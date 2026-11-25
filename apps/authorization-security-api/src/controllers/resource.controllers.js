// Public-style protected resource available to every authenticated user.
const getUserResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "User resource accessed successfully.",
        data: {
            resource: "user-resource",
            accessedBy: {
                id: req.user._id,
                name: req.user.name,
                role: req.user.role,
            },
        },
    });
};

// Moderator and admin resource controlled through role-based access.
const getModeratorResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Moderator resource accessed successfully.",
        data: {
            resource: "moderator-resource",
            accessedBy: {
                id: req.user._id,
                name: req.user.name,
                role: req.user.role,
            },
        },
    });
};

// Admin-only resource controlled through role-based access.
const getAdminResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Admin resource accessed successfully.",
        data: {
            resource: "admin-resource",
            accessedBy: {
                id: req.user._id,
                name: req.user.name,
                role: req.user.role,
            },
        },
    });
};

// Demonstrate permission-based access independent of the user's role.
const getReadPermissionResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Read permission resource accessed successfully.",
        data: {
            resource: "permission-read-resource",
            requiredPermission: "resource:read",
            userPermissions: req.user.permissions,
        },
    });
};

// Demonstrate a route requiring more than one permission.
const getManageResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Resource management access granted.",
        data: {
            resource: "resource-management",
            requiredPermissions: ["resource:update", "resource:delete"],
            userPermissions: req.user.permissions,
        },
    });
};

// Demonstrate flexible authorization where an admin role
// or a specific permission can grant access.
const getFlexibleResource = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Flexible authorization resource accessed successfully.",
        data: {
            resource: "flexible-resource",
            role: req.user.role,
            permissions: req.user.permissions,
        },
    });
};

module.exports = {
    getAdminResource,
    getFlexibleResource,
    getManageResource,
    getModeratorResource,
    getReadPermissionResource,
    getUserResource,
};
