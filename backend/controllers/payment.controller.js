import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from "pdfkit";
import { format } from "date-fns";
import ordersModel from '../models/orderModel.js';
import paymentsModel from '../models/paymentModel.js';
import transporterModel from "../models/transporterModel.js";
import companyModel from "../models/companyModel.js";
import razorpay from '../lib/razorpay.js'; // 

// ----------------------------------------
// Post: Initiate a new payment
// ----------------------------------------
export const initiatePaymentController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, customerId, transporterId, currency = 'INR' } = req.body;

    if (!amount || !customerId || !transporterId || !orderId) {
      return res.status(400).json({ error: 'Missing required fields.' });
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
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// ----------------------------------------
// Post: Verify Payment
// ----------------------------------------
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
        error: "Payment signature verification failed"
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
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: "Server error during payment verification" });
  }
};

// ----------------------------------------
// Get: Get Payment History
// ----------------------------------------
export const getPaymentHistoryController = async (req, res) => {
  try {
    const { userId, userType } = req.query;
    if (!userId || !userType) {
      return res.status(400).json({ error: "Missing userId or userType" });
    }
    let filter = {};
    if (userType === "company") filter.customerId = userId;
    else if (userType === "transporter") filter.transporterId = userId;
    else return res.status(400).json({ error: "Invalid userType" });
    const payments = await paymentsModel
      .find(filter)
      .sort({ paidAt: -1 })
      .populate("orderId transporterId customerId");
    res.status(200).json({
      success: true,
      totalPayments: payments.length,
      payments
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

// ----------------------------------------
// Get: Get Payment by Order ID
// ----------------------------------------
export const getPaymentByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId in request parameters." });
    }
    const payment = await paymentsModel
      .findOne({ orderId })
      .populate("orderId customerId transporterId");
    if (!payment) {
      return res.status(404).json({ error: "No payment found for this order." });
    }
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    res.status(500).json({ error: "Failed to fetch payment details." });
  }
};

// ----------------------------------------
// Get: Download Invoice PDF
// ----------------------------------------
export const downloadInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentsModel
      .findOne({ orderId })
      .populate("orderId customerId transporterId");
    if (!payment) {
      return res.status(404).json({ error: "No payment found for this order." });
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
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ error: "Failed to generate invoice." });
  }
};

// ----------------------------------------
// Put: Mark Order as Paid
// ----------------------------------------
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
  } catch (error) {
    console.error("Error marking order as paid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestRefundController = async (req, res) => {

}

export const processRefundController = async (req, res) => {

}

export const getRefundStatusController = async (req, res) => {

}

export const getAllPaymentsController = async (req, res) => {

}