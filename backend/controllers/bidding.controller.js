import biddingModel from "../models/biddingModel.js";
import axios from "axios";
import truckModel from "../models/truckModel.js";
import orderModel from "../models/orderModel.js";
import transporterModel from '../models/transporterModel.js';

// --- MAPPINGS ---
const load_category_map_reverse = {
    "general": "others",
    "fragile": "fragile",
    "perishable": "perishable",
    "bulk": "bulk",
    "electronics": "electronics",
    "furniture": "furniture",
    "others": "others"
};
const body_type_map_reverse = {
    1.0: "open", 1.2: "container", 1.4: "tanker", 1.6: "reefer", 2.0: "flatbed"
};
const size_category_map_reverse = {
    1.0: "small", 1.2: "medium", 1.5: "large", 2.0: "extra-large"
};
const urgency_level_map_reverse = {
    "low": "low", "medium": "medium", "high": "high"
};

const getEstimatedPrice = async (
    orderId, weightInTon, distanceKm, isMultiStop, loadCategory,
    bodyTypeMultiplier, sizeCategoryMultiplier, urgencyLevel, deliveryTimeline
) => {
    try {
        const mappedLoadCategory = load_category_map_reverse[loadCategory] || "others";
        const mappedBodyType = body_type_map_reverse[bodyTypeMultiplier] || "open";
        const mappedSizeCategory = size_category_map_reverse[sizeCategoryMultiplier] || "small";
        const mappedUrgencyLevel = urgency_level_map_reverse[urgencyLevel] || "low";
        const mappedDeliveryType = isMultiStop ? "multi" : "single";

        const requestBodyToFlask = {
            weight_ton: parseFloat(weightInTon),
            distance_km: parseFloat(distanceKm),
            delivery_type: mappedDeliveryType,
            load_category: mappedLoadCategory,
            truck_body_type: mappedBodyType,
            truck_size_category: mappedSizeCategory,
            urgency_level: mappedUrgencyLevel,
            delivery_timeline_days: parseFloat(deliveryTimeline || 1)
        };

        console.log("Sending to Flask API on Port 5000:", requestBodyToFlask);
        const response = await axios.post("http://127.0.0.1:5000/predict", requestBodyToFlask);
        
        console.log("Received from Flask API:", response.data);
        return response.data.estimated_price;
    } catch (error) {
        console.error("Error calling AI Price Estimator API:", error.message);
        if (error.response) {
            console.error("Flask API Response Error Data:", error.response.data);
            console.error("Flask API Response Status:", error.response.status);
        }
        throw new Error("Failed to get estimated price from AI model.");
    }
};

export const getFairPriceSuggestionsController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        const {
            loadDetails, distance, isMultiStop, bodyTypeMultiplier,
            sizeCategoryMultiplier, urgency
        } = order;

        if (!loadDetails?.weightInTon || !distance || !loadDetails?.type ||
            (bodyTypeMultiplier === undefined) || (sizeCategoryMultiplier === undefined) || !urgency) {
            return res.status(400).json({
                message: "Missing required fields in order details for price estimation.",
            });
        }
        
        const fairPrice = await getEstimatedPrice(
            orderId,
            loadDetails.weightInTon,
            distance,
            isMultiStop,
            loadDetails.type,
            bodyTypeMultiplier,
            sizeCategoryMultiplier,
            urgency,
            1 // Default delivery timeline
        );

        if (fairPrice) {
            try {
                await biddingModel.findOneAndUpdate(
                    { orderId: orderId },
                    { 
                        $set: { fairPrice: Math.round(fairPrice) },
                        $setOnInsert: { orderId: orderId } // Set orderId only on creation
                    },
                    { upsert: true, new: true }
                );
                console.log(`AI Fair Price ${Math.round(fairPrice)} saved to DB for Order ID: ${orderId}`);
            } catch (dbError) {
                console.error("Error saving fair price to DB:", dbError.message);
                // We can still proceed to show the price even if DB save fails
            }
        }
        
        const minPrice = Math.round(fairPrice * 0.9);
        const maxPrice = Math.round(fairPrice * 1.1);
        
        return res.status(200).json({
            orderId,
            fairPrice: Math.round(fairPrice),
            marketRange: { min: minPrice, max: maxPrice },
            currency: "INR",
            note: "This is an estimated fair price based on AI model.",
        });
    } catch (err) {
        console.log("Error in getFairPriceSuggestionsController:", err.message);
        res.status(500).json({ message: "Failed to get AI price suggestion." });
    }
};

export const placeBidController = async (req, res) => {
    try {
        const {
            orderId,
            bidAmount,
            weightInTon,
            distanceKm,
            isMultiStop,
            loadCategory,
            bodyType, // This is bodyTypeMultiplier from the frontend
            sizeCategory, // This is sizeCategoryMultiplier from the frontend
            urgencyLevel,
            deliveryTimeline,
        } = req.body;

        const transporterId = req.user._id;

        const transporterTrucks = await truckModel.find({ transporterId: transporterId });
        if (transporterTrucks.length === 0) {
            return res.status(400).json({ message: "No trucks found for this transporter. Please add a truck to bid." });
        }
        const truckId = transporterTrucks[0]._id;

        if (
            !transporterId ||
            !truckId ||
            !bidAmount ||
            !weightInTon ||
            !distanceKm ||
            !loadCategory ||
            (bodyType === undefined || bodyType === null) ||
            (sizeCategory === undefined || sizeCategory === null) ||
            (urgencyLevel === undefined || urgencyLevel === null)
        ) {
            return res.status(400).json({ message: "Please fill all the required fields." });
        }

        const fairPrice = await getEstimatedPrice(
            orderId,
            weightInTon,
            distanceKm,
            isMultiStop,
            loadCategory,
            bodyType,
            sizeCategory,
            urgencyLevel,
            deliveryTimeline
        );

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
                fairPrice: Math.round(fairPrice),
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
            (bid) => bid.transporterId.toString() === transporterId.toString()
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
    } catch (err) {
        console.log("Error in placeBidController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelBidController = async (req, res) => {
    try {
        const transporterId = req.user._id;
        const { orderId } = req.params;
        const bidding = await biddingModel.findOne({ orderId });

        if (!bidding) {
            return res.status(404).json({ message: "No bidding found for the given order." });
        }

        const bidIndex = bidding.bids.findIndex(
            (bid) => bid.transporterId.toString() === transporterId.toString()
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
    } catch (err) {
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

        const lowestBidAmount = Math.min(...bidding.bids.map((bid) => bid.bidAmount));
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
    } catch (err) {
        console.log("Error in getBidStatusController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateBidController = async (req, res) => {
    try {
        const transporterId = req.user._id;
        const { orderId } = req.params;
        const {
            newBidAmount,
            weightInTon,
            distanceKm,
            isMultiStop,
            loadCategory,
            bodyType,
            sizeCategory,
            urgencyLevel,
            deliveryTimeline,
        } = req.body;

        if (
            !newBidAmount ||
            !weightInTon ||
            !distanceKm ||
            !loadCategory ||
            (bodyType === undefined || bodyType === null) ||
            (sizeCategory === undefined || sizeCategory === null) ||
            (urgencyLevel === undefined || urgencyLevel === null)
        ) {
            return res.status(400).json({
                message: "Missing required fields for bid update and price estimation.",
            });
        }

        const bidding = await biddingModel.findOne({ orderId });
        if (!bidding) {
            return res.status(404).json({ message: "No bids found for this order" });
        }

        const bidIndex = bidding.bids.findIndex(
            (bid) => bid.transporterId.toString() === transporterId.toString()
        );
        if (bidIndex === -1) {
            return res.status(404).json({ message: "You have not placed a bid for this order" });
        }
        
        const fairPrice = await getEstimatedPrice(
            orderId,
            weightInTon,
            distanceKm,
            isMultiStop,
            loadCategory,
            bodyType,
            sizeCategory,
            urgencyLevel,
            deliveryTimeline
        );

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
    } catch (err) {
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

    const transporter = await transporterModel.findById(transporterId);
    transporter.assignedBookings = orderId;
    await transporter.save();

    bidding.isClosed = true;
    await bidding.save();

    await orderModel.updateOne(
      { _id: orderId },
      { $set: { acceptedTransporterId: transporterId } }
    );

    return res.status(200).json({
      message: "Bid accepted successfully",
      orderId,
      acceptedTransporterId: transporterId,
    });
  } catch (err) {
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
    } catch (err) {
        console.log("Error in rejectBidController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getViewBidsController = async (req, res) => {
    try {
        const transporterId = req.user._id;

        if (!transporterId) {
            return res.status(401).json({ message: "Unauthorized. Transporter not logged in." });
        }

        // Step 1: Database se woh saare bidding documents laayein jinmein aapka bid hai
        const activeBidsDocuments = await biddingModel.find({ 
            "bids.transporterId": transporterId,
            "isClosed": false
        }).populate({
            path: 'orderId',
            select: 'pickupLocation dropLocations fare' // Sirf zaroori cheezein laayein
        }).lean(); // .lean() ka istemal performance behtar karta hai

        if (!activeBidsDocuments || activeBidsDocuments.length === 0) {
            return res.status(200).json({ message: "No active bids found.", bids: [] });
        }

        // Step 2: Data ko frontend ke liye sahi format mein taiyaar karein
        const transporterSpecificBids = activeBidsDocuments.map(biddingDoc => {
            // Har document mein se aapka apna bid dhundein
            const myBid = biddingDoc.bids.find(bid => bid.transporterId.toString() === transporterId.toString());

            // Agar kisi vajah se bid na mile, to is entry ko chhod dein
            if (!myBid || !biddingDoc.orderId) {
                return null;
            }

            // Sahi data ko return karein
            return {
                orderInfo: biddingDoc.orderId,
                myBid: {
                    bidAmount: myBid.bidAmount,
                    status: myBid.status,
                    bidTime: myBid.createdAt
                },
                aiPrice: biddingDoc.fairPrice,
                fairPrice: biddingDoc.orderId.fare,
                totalBids: biddingDoc.bids.length,
                biddingId: biddingDoc._id // Unique key ke liye
            };
        }).filter(bid => bid !== null); // Un sabhi entries ko hata dein jahan null return hua tha

        res.status(200).json({
            message: "Active bids fetched successfully.",
            bids: transporterSpecificBids,
        });

    } catch (err) {
        console.error("Error in getViewBidsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};