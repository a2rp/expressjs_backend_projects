const getHome = (req, res) => {
    res.json({
        message: "Request Logger Middleware API is running",
    });
};

module.exports = {
    getHome,
};
