const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'غير مصرح'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'ليس لديك صلاحية للوصول'
            });
        }

        next();
    };
};

module.exports = checkRole; 