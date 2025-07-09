import biddingModel from "../models/biddingModel.js";
import { calculateFairPrice } from "../services/fairPrice.service.js";

export const getFairPriceSuggestionsController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { sizeCategory, bodyType, distanceKm } = req.body;

        if (!sizeCategory || !bodyType || !distanceKm) {
            return res.status(400).json({
                message: "Missing required fields: sizeCategory, bodyType, distanceKm",
            });
        }

        if (distanceKm < 10 || distanceKm > 3000) {
            return res.status(400).json({
                message: "Distance seems unrealistic. Please check the input.",
            });
        }

        const { baseRate, price, bodyFactor, sizeFactor } = calculateFairPrice(
            sizeCategory,
            bodyType,
            distanceKm
        );
        const fairPrice = Math.round(price);
        const minPrice = Math.round(fairPrice * 0.9);
        const maxPrice = Math.round(fairPrice * 1.1);

        return res.status(200).json({
            orderId,
            fairPrice,
            marketRange: { min: minPrice, max: maxPrice },
            currency: "INR",
            breakdown: {
                baseRatePerKm: baseRate,
                distanceKm,
                bodyTypeFactor: bodyFactor,
                sizeCategoryFactor: sizeFactor,
                bodyType,
                sizeCategory,
          },
            note: "This is an estimated fair price. Actual bids may vary based on availability and market demand.",
        });
    }
    catch(err){
        console.log("Error in getFairPriceSuggestionsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const placeBidController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { transporterId, truckId, bidAmount, sizeCategory, bodyType, distanceKm } = req.body;

        if (!transporterId || !truckId || !bidAmount || !sizeCategory || !bodyType || !distanceKm) {
            return res.status(400).json({ message: "Please fill all the required fields." });
        }

        const { price: fairPrice } = calculateFairPrice(sizeCategory, bodyType, distanceKm);
        const minBid = fairPrice * 0.8;

        if (bidAmount < minBid) {
            return res.status(400).json({
                message: `Your bid is too low. Minimum allowed is ₹${Math.floor(minBid)}`,
                minAllowed: Math.floor(minBid),
                fairPrice: Math.floor(fairPrice),
            });
        }

        let bidding = await biddingModel.findOne({ orderId });

        if (!bidding) {
            const newBidding = new biddingModel({
                orderId,
                fairPrice,
                bids: [{ transporterId, truckId, bidAmount }],
            });
        await newBidding.save();
        
        return res.status(201).json({
            message: "Bid placed successfully.",
            yourBid: bidAmount,
            currentLowestBid: bidAmount,
            totalBids: 1,
        });
        }

        if (bidding.bids.length >= 10) {
            return res.status(400).json({ message: "Bid limit reached for this order." });
        }

        const alreadyBid = bidding.bids.some(
            (bid) => bid.transporterId.toString() === transporterId
        );
        if (alreadyBid) {
            return res.status(400).json({ message: "You have already placed a bid for this order." });
        }

        const lowestBid = Math.min(...bidding.bids.map((b) => b.bidAmount));
        if (bidAmount >= lowestBid) {
            return res.status(400).json({
                message: `Your bid must be lower than the current lowest bid ₹${lowestBid}`,
                currentLowestBid: lowestBid,
            });
        }

        bidding.bids.push({ transporterId, truckId, bidAmount });
        await bidding.save();

        return res.status(201).json({
            message: "Bid placed successfully.",
            yourBid: bidAmount,
            currentLowestBid: Math.min(...bidding.bids.map((b) => b.bidAmount)),
            totalBids: bidding.bids.length,
        });
    }
    catch(err){
        console.log("Error in placeBidController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelBidController = async (req, res) => {
  try {
    const { orderId, transporterId } = req.params;
    const bidding = await biddingModel.findOne({ orderId });

    if (!bidding) {
      return res.status(404).json({ message: "No bidding found for the given order." });
    }

    const bidIndex = bidding.bids.findIndex(
      (bid) => bid.transporterId.toString() === transporterId
    );
    if (bidIndex === -1) {
      return res.status(404).json({ message: "No bid found for this transporter on the given order." });
    }

    bidding.bids.splice(bidIndex, 1);
    await bidding.save();

    return res.status(200).json({
      message: "Bid cancelled successfully.",
      remainingBids: bidding.bids.length,
    });
  } catch(err){
    console.log("Error in cancelBidController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBidStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const bidding = await biddingModel.findOne({ orderId });

    if (!bidding) {
      return res.status(404).json({ message: "No bids found for this order" });
    }

    const bids = bidding.bids;
    if (!bids.length) {
      return res.status(200).json({ message: "No bids placed yet", totalBids: 0, bids: [] });
    }

    const lowestBidAmount = Math.min(...bids.map((bid) => bid.bidAmount));
    const formattedBids = bids.map((bid) => ({
      transporterId: bid.transporterId,
      truckId: bid.truckId,
      bidAmount: bid.bidAmount,
      isLowest: bid.bidAmount === lowestBidAmount,
      status: bid.status || "pending",
    }));

    return res.status(200).json({
      orderId,
      totalBids: bids.length,
      lowestBidAmount,
      bids: formattedBids,
    });
  }
  catch(err){
    console.log("Error in getBidStatusController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateBidController = async (req, res) => {
  try {
    const { orderId, transporterId } = req.params;
    const { newBidAmount, sizeCategory, bodyType, distanceKm } = req.body;

    if (!newBidAmount || !sizeCategory || !bodyType || !distanceKm) {
      return res.status(400).json({
        message: "Missing required fields: newBidAmount, sizeCategory, bodyType, distanceKm",
      });
    }

    const bidding = await biddingModel.findOne({ orderId });
    if (!bidding) {
      return res.status(404).json({ message: "No bids found for this order" });
    }

    const bidIndex = bidding.bids.findIndex(
      (bid) => bid.transporterId.toString() === transporterId
    );
    if (bidIndex === -1) {
      return res.status(404).json({ message: "You have not placed a bid for this order" });
    }

    const { price: fairPrice } = calculateFairPrice(sizeCategory, bodyType, distanceKm);
    const minAllowedBid = fairPrice * 0.8;

    if (newBidAmount < minAllowedBid) {
      return res.status(400).json({
        message: `Bid too low. Minimum allowed is ₹${Math.floor(minAllowedBid)}`,
      });
    }

    const otherBids = bidding.bids.filter((_, index) => index !== bidIndex);
    const currentLowest = Math.min(...otherBids.map((b) => b.bidAmount), Infinity);

    if (newBidAmount >= currentLowest) {
      return res.status(400).json({
        message: `Your new bid must be lower than the current lowest bid ₹${currentLowest}`,
      });
    }

    bidding.bids[bidIndex].bidAmount = newBidAmount;
    await bidding.save();

    return res.status(200).json({
      message: "Bid updated successfully",
      newBid: newBidAmount,
      currentLowestBid: currentLowest === Infinity ? newBidAmount : currentLowest,
    });
  }
  catch(err){
    console.log("Error in updateBidController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptBidController = async (req, res) => {
  try {
    const { orderId, transporterId } = req.params;
    const bidding = await biddingModel.findOne({ orderId });

    if (!bidding) {
      return res.status(404).json({ message: "No bidding record found for this order" });
    }

    let bidFound = false;
    bidding.bids = bidding.bids.map((bid) => {
      if (bid.transporterId.toString() === transporterId) {
        bid.status = "accepted";
        bidFound = true;
      } else {
        bid.status = "rejected";
      }
      return bid;
    });

    if (!bidFound) {
      return res.status(404).json({ message: "Transporter's bid not found for this order" });
    }

    bidding.isClosed = true;
    await bidding.save();

    return res.status(200).json({
      message: "Bid accepted successfully",
      orderId,
      acceptedTransporterId: transporterId,
    });
  }
  catch(err){
    console.log("Error in acceptBidController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectBidController = async (req, res) => {
  try {
    const { orderId, transporterId } = req.params;
    const bidding = await biddingModel.findOne({ orderId });

    if (!bidding) {
        return res.status(404).json({ message: "No bidding record found for this order" });
    }

    const bidIndex = bidding.bids.findIndex(
        (bid) => bid.transporterId.toString() === transporterId
    );

    if (bidIndex === -1) {
        return res.status(404).json({ message: "Transporter's bid not found for this order" });
    }

    bidding.bids[bidIndex].status = "rejected";
    await bidding.save();

    return res.status(200).json({
        message: "Bid rejected successfully",
        orderId,
        rejectedTransporterId: transporterId,
    });
  }
  catch(err){
    console.log("Error in rejectBidController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
