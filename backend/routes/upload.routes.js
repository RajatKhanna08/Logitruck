import express from "express";
import { upload } from "../middlewares/upload.js";
import { uploadOrderDocumentController } from "../controllers/upload.controller.js";

const router = express.Router();

// ==================== Document Upload Route ====================
router.post("/:entityType/:entityId",upload.single("file"),uploadOrderDocumentController);

export default router;
