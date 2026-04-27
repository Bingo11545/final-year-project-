const jwt = require('jsonwebtoken');

module.exports = function(roles = []) {
    return (req, res, next) => {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            // Check role if roles are specified
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ msg: 'Access denied: Insufficient privileges' });
            }

            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
};
