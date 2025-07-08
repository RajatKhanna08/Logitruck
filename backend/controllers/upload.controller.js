import orderModel from "../models/orderModel.js";

export const uploadOrderDocumentController = async (req, res) => {
  try {
    const { orderId, docType } = req.params;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const allowedDocTypes = [
      "eWayBill",
      "bilty",
      "kataParchiBefore",
      "kataParchiAfter",
      "receivingDocument"
    ];
    if (!allowedDocTypes.includes(docType)) {
      return res.status(400).json({ message: "Invalid document type" });
    }
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const filePath = `/uploads/orders/${orderId}/${file.filename}`;
    order.documents[docType] = {
      fileName: file.originalname,
      fileURL: filePath,
      uploadedAt: new Date()
    };
    await order.save();
    res.status(200).json({
      message: `${docType} uploaded successfully`,
      fileURL: filePath,
    });
  } catch (err) {
    console.error("Error in uploadOrderDocumentController:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
