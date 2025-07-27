import reviewModel from "../models/reviewModel.js";
import { sendNotification } from "../utils/sendNotification.js";

export const createReviewController = async (req, res) => {
    try {
        const {
            orderId,
            reviewerId,
            reviewerRole,
            reviewedEntityId,
            reviewedEntityType,
            rating,
            reviewText = "" 
        } = req.body;

        // Check if required fields are present
        if (!orderId || !reviewerId || !reviewedEntityId || !reviewedEntityType || rating === undefined) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check for duplicate review
        const existingReview = await reviewModel.findOne({
            orderId,
            reviewerId,
            reviewedEntityId,
        });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this entity for this order." });
        }

        // Save the review
        const newReview = new reviewModel({
            orderId,
            reviewerId,
            reviewerRole,
            reviewedEntityId,
            reviewedEntityType,
            rating,
            reviewText: reviewText.trim(),
        });

        await newReview.save();

        // Send notification
        await sendNotification({
            role: reviewedEntityType,
            relatedUserId: reviewedEntityId,
            relatedBookingId: orderId,
            title: "New Review Received",
            message: `You received ${rating}★ - "${reviewText?.trim() || "No comment"}"`,
            type: "activity",
            deliveryMode: "instant"
        });

        res.status(201).json({ message: "Review created successfully", review: newReview });
    } catch (err) {
        console.error("Error in createReviewController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
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
    catch(err){
        console.log("Error in getAllReviewsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
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
    catch(err){
        console.log("Error in getReviewForOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteReviewController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await reviewModel.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Review not found" });
        }
        await sendNotification({
            role: deleted.reviewerRole,
            relatedUserId: deleted.reviewerId,
            relatedBookingId: deleted.orderId,
            title: "Review Deleted",
            message: `Your review for order ${deleted.orderId} was removed.`,
            type: "info",
            deliveryMode: "instant",
        });
        res.status(200).json({ message: "Review deleted successfully" });
    } 
    catch(err){
        console.log("Error in deleteReviewController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};