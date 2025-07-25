import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import ordersModel from '../models/orderModel.js';
import paymentsModel from '../models/paymentModel.js';
import transporterModel from "../models/transporterModel.js";
import companyModel from "../models/companyModel.js";
import razorpay from '../lib/razorpay.js'; // 

export const initiatePaymentController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, customerId, transporterId, currency = 'INR' } = req.body;

    if (!amount || !customerId || !transporterId || !orderId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const options = {
      amount: amount * 100, // Razorpay uses paisa
      currency,
      receipt: `receipt_${orderId}_${uuidv4()}`,
      payment_capture: 1,
      notes: {
        internalOrderId: orderId,
        customerId,
        transporterId
      }
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Payment order initiated",
      orderDetails: razorpayOrder,
      frontendKey: process.env.RAZORPAY_KEY_ID,
      linkedOrderId: orderId
    });
  }
  catch(err){
    console.log("Error in initiatePaymentController:", err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      customerId,
      transporterId
    } = req.body;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed"
      });
    }

    const invoiceId = 'INV_' + razorpay_order_id + '_' + Date.now();
    const commission = Math.floor(amount * 0.05); // 5% platform commission
    const paymentRecord = new paymentsModel({
      orderId: req.params.orderId,
      customerId,
      transporterId,
      amount,
      commission,
      payoutAmount: amount - commission,
      currency,
      paymentMode: "UPI", // default, can be overridden by frontend
      paymentInvoice: invoiceId,
      paidAt: new Date(),
      paymentGateway: {
        name: "Razorpay",
        transactionId: razorpay_payment_id,
        orderRef: req.params.orderId,
        response: req.body
      }
    });
    await paymentRecord.save();
    res.status(200).json({
      success: true,
      message: "Payment verified and saved successfully",
      paymentRecord
    });
  }
  catch(err){
    console.log("Error verifyPaymentController:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPaymentHistoryController = async (req, res) => {
  try {
    const { userId, userType } = req.query;
    if (!userId || !userType) {
      return res.status(400).json({ message: "Missing userId or userType" });
    }
    let filter = {};
    if (userType === "company") filter.customerId = userId;
    else if (userType === "transporter") filter.transporterId = userId;
    else return res.status(400).json({ message: "Invalid userType" });
    const payments = await paymentsModel
      .find(filter)
      .sort({ paidAt: -1 })
      .populate("orderId transporterId customerId");
    res.status(200).json({
      success: true,
      totalPayments: payments.length,
      payments
    });
  }
  catch(err){
    console.log("Error in getPaymentHistoryController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Missing orderId in request parameters." });
    }
    const payment = await paymentsModel
      .findOne({ orderId })
      .populate("orderId customerId transporterId");
    if (!payment) {
      return res.status(404).json({ message: "No payment found for this order." });
    }
    res.status(200).json({
      success: true,
      payment
    });
  }
  catch(err){
    console.log("Error in getPaymentByIdController:", err.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const downloadInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentsModel
      .findOne({ orderId })
      .populate("orderId customerId transporterId");
    if (!payment) {
      return res.status(404).json({ message: "No payment found for this order." });
    }
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=Invoice_${payment.paymentInvoice}.pdf`);
      res.send(result);
    });
    doc.fontSize(18).text("Logitruck - Payment Invoice", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Invoice ID: ${payment.paymentInvoice}`);
    doc.text(`Order ID: ${payment.orderId._id}`);
    doc.text(`Customer (Company): ${payment.customerId.companyName}`);
    doc.text(`Transporter: ${payment.transporterId.transporterName}`);
    doc.text(`Payment Mode: ${payment.paymentMode}`);
    doc.text(`Transaction ID: ${payment.paymentGateway.transactionId}`);
    doc.text(`Amount Paid: ₹${payment.amount} ${payment.currency}`);
    doc.text(`Commission: ₹${payment.commission}`);
    doc.text(`Paid On: ${format(new Date(payment.paidAt), "dd-MM-yyyy HH:mm")}`);
    doc.text(`Generated On: ${format(new Date(), "dd-MM-yyyy HH:mm")}`);
    doc.end();
  }
  catch(err){
    console.log("Error downloadInvoiceController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markOrderAsPaidController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await ordersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus === "paid") {
      return res.status(200).json({ message: "Order is already marked as paid." });
    }
    order.paymentStatus = "paid";
    order.paidAt = new Date();
    if (!order.commission && order.fare) {
      order.commission = order.fare * 0.05;
    }
    await order.save();
    res.status(200).json({
      message: "Order payment status updated successfully.",
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      commission: order.commission
    });
  }
  catch(err){
    console.log("Error in markOrderAsPaidController:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestRefundController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const payment = await paymentsModel.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    if (payment.refundStatus !== 'not_requested') {
      return res.status(400).json({ message: "Refund already requested or processed." });
    }

    payment.refundStatus = 'pending';
    payment.refundReason = reason || "Not specified";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Refund requested successfully.",
      refundStatus: payment.refundStatus,
      refundReason: payment.refundReason
    });
  } catch (err) {
    console.error("Error in requestRefundController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const processRefundController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { refundAmount, action } = req.body;

    const payment = await paymentsModel.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    if (action === "approve") {
      payment.refundAmount = refundAmount;
      payment.refundedAt = new Date();
      payment.refundStatus = "processed";
      payment.paymentStatus = "refunded";
    } else if (action === "reject") {
      payment.refundStatus = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: `Refund ${action}ed successfully.`,
      refundStatus: payment.refundStatus,
      refundAmount: payment.refundAmount
    });
  } catch (err) {
    console.error("Error in processRefundController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRefundStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentsModel.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json({
      success: true,
      refundStatus: payment.refundStatus,
      refundAmount: payment.refundAmount || 0,
      refundReason: payment.refundReason || "",
      refundedAt: payment.refundedAt
    });
  } catch (err) {
    console.error("Error in getRefundStatusController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPaymentsController = async (req, res) => {
  try {
    const payments = await paymentsModel
      .find({})
      .sort({ paidAt: -1 })
      .populate("orderId customerId transporterId");

    res.status(200).json({
      success: true,
      total: payments.length,
      payments
    });
  } catch (err) {
    console.error("Error in getAllPaymentsController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};