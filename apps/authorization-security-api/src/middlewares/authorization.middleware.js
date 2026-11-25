// Allow access only when the authenticated user's role is permitted.
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource.",
            });
        }

        return next();
    };
};

// Allow access only when the user has every required permission.
const requirePermissions = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const userPermissions = Array.isArray(req.user.permissions)
            ? req.user.permissions
            : [];

        const hasAllPermissions = permissions.every((permission) =>
            userPermissions.includes(permission),
        );

        if (!hasAllPermissions) {
            return res.status(403).json({
                success: false,
                message: "Required permission is missing.",
                requiredPermissions: permissions,
            });
        }

        return next();
    };
};

// Allow access when the user either has an accepted role
// or has every permission listed for the route.
const allowRoleOrPermissions = (roles = [], permissions = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const userPermissions = Array.isArray(req.user.permissions)
            ? req.user.permissions
            : [];

        const hasAllowedRole = roles.includes(req.user.role);

        const hasRequiredPermissions = permissions.every((permission) =>
            userPermissions.includes(permission),
        );

        if (!hasAllowedRole && !hasRequiredPermissions) {
            return res.status(403).json({
                success: false,
                message: "You do not have sufficient access.",
                allowedRoles: roles,
                requiredPermissions: permissions,
            });
        }

        return next();
    };
};

module.exports = {
    allowRoleOrPermissions,
    allowRoles,
    requirePermissions,
};
