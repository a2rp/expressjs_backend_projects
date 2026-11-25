const express = require("express");

const {
    getAdminResource,
    getFlexibleResource,
    getManageResource,
    getModeratorResource,
    getReadPermissionResource,
    getUserResource,
} = require("../controllers/resource.controllers");

const { requireAuth } = require("../middlewares/auth.middleware");

const {
    allowRoleOrPermissions,
    allowRoles,
    requirePermissions,
} = require("../middlewares/authorization.middleware");

const router = express.Router();

// Every resource route requires authentication first.
router.use(requireAuth);

// Any active authenticated user can access this route.
router.get("/user", getUserResource);

// Only moderator and admin roles can access this route.
router.get(
    "/moderator",
    allowRoles("moderator", "admin"),
    getModeratorResource,
);

// Only admin users can access this route.
router.get("/admin", allowRoles("admin"), getAdminResource);

// Permission-based access independent of the user's role.
router.get(
    "/read",
    requirePermissions("resource:read"),
    getReadPermissionResource,
);

// This route requires both update and delete permissions.
router.get(
    "/manage",
    requirePermissions("resource:update", "resource:delete"),
    getManageResource,
);

// Access is granted either to an admin
// or to a user with the resource:create permission.
router.get(
    "/flexible",
    allowRoleOrPermissions(["admin"], ["resource:create"]),
    getFlexibleResource,
);

module.exports = router;
