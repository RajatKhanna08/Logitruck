import multer from 'multer';
import fs from 'fs';
import path from 'path';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    let roleFolder = 'others';

        // 1. Extract role from the URL (baseUrl like /api/company, /api/transporter, etc.)
        const base = req.baseUrl.toLowerCase();
        if (base.includes('company')) roleFolder = 'company';
        else if (base.includes('transporter')) roleFolder = 'transporter';
        else if (base.includes('driver')) roleFolder = 'driver';

        const uploadPath = path.join('uploads', roleFolder);

        
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

export const companyFields = upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "gstCertificate", maxCount: 1 }
])