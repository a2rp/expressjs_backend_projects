const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    register,
    login,
    logout,
    isLoggedIn
} = require("../controllers/user.controllers");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/isLoggedIn", auth, isLoggedIn);

module.exports = router;

