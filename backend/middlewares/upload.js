import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Dynamic folder creation based on upload context
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { entity, entityId } = req.params;
    const uploadPath = path.join('uploads', entity, entityId);

    // Create folder if doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

export const upload = multer({ storage });
