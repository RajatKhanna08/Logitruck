export const correctRole = (...role) => {
    return (req, res, next) => {
        if(!req.user || !role.includes(req.user.role)){
            return res.status(401).json({ message: "Access Denied: Unauthorized access of admin" });
        }

        next();
    }
}