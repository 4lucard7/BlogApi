const jwt = require("jsonwebtoken");

// Verify Token
function verfiyToken(req, res, next) {
    const authToken = req.headers.authorization;
    
    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token, access denied" });
        }
    } else {
        return res.status(401).json({ message: "No token provided, access denied" });
    }
}

// Verify Token & Admin
function verfiyTokenAndAdmin(req, res, next) {
    verfiyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only admin" });
        }
    });
}

// Verify Token & Only User Himself
function verfiyTokenAndOnlyUser(req, res, next) {
    verfiyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only user himself" });
        }
    });
}

// Verify Token & Authorization (User himself or Admin)
function verfiyTokenAndAuthorization(req, res, next) {
    verfiyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Not allowed, only user himself or admin" });
        }
    });
}

module.exports = {
    verfiyToken,
    verfiyTokenAndAdmin,
    verfiyTokenAndOnlyUser,
    verfiyTokenAndAuthorization,
};