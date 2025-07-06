import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        console.log("Error in isLoggedIn middleware", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}