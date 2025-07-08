import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadDocumentController } from "../controllers/uploadController.js";

const router = express.Router();
router.post("/:entityType/:entityId", upload.single("file"), uploadDocumentController);

export default router;