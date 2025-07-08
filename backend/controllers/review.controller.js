import reviewModel from "../models/reviewModel.js";

export const createReviewController = async (req, res) => {
  try {
    const {
      orderId,
      reviewerId,
      reviewerRole,
      reviewedEntityId,
      reviewedEntityType,
      rating,
      reviewText,
    } = req.body;

    const existingReview = await reviewModel.findOne({
      orderId,
      reviewerId,
      reviewedEntityId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this entity for this order." });
    }

    const newReview = new reviewModel({
      orderId,
      reviewerId,
      reviewerRole,
      reviewedEntityId,
      reviewedEntityType,
      rating,
      reviewText,
    });

    await newReview.save();
    res.status(201).json({ message: "Review created successfully", review: newReview });

  } 
  catch (error) {
    res.status(500).json({ message: "Failed to create review", error: error.message });
  }
};

export const getAllReviewsController = async (req, res) => {
  try {
    const reviews = await reviewModel.find()
      .populate("reviewerId", "name")
      .populate("reviewedEntityId", "name")
      .populate("orderId");

    res.status(200).json(reviews);
  } 
  catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

export const getReviewForOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const review = await reviewModel.find({ orderId })
      .populate("reviewerId", "name")
      .populate("reviewedEntityId", "name");

    if (!review || review.length === 0) {
      return res.status(404).json({ message: "No reviews found for this order." });
    }

    res.status(200).json(review);
  } 
  catch (error) {
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await reviewModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};
