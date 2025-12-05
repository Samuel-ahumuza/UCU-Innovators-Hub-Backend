const restrictTo = (allowedRoles) => {
    return (req, res, next) => {
     
        
        // 1. Check if user data is present
        if (!req.user || !req.user.role) {
            return res.status(403).json({ 
                message: 'Access denied. User authentication context is missing.' 
            });
        }
        
        // 2. Check if the user's role is included in the allowed roles array
        if (!allowedRoles.includes(req.user.role)) {
            // Log the denied attempt (optional, but good for debugging)
            console.warn(`Access denied for user ID ${req.user.UserID} with role ${req.user.role} trying to access role-restricted route.`);

            return res.status(403).json({ 
                message: `Access denied. Role (${req.user.role}) is not authorized for this operation.` 
            });
        }

        // If authorized, proceed to the next middleware or controller
        next();
    };
};

module.exports = { restrictTo};