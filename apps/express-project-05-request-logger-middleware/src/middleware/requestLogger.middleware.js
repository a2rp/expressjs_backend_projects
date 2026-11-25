const requestLogger = (req, res, next) => {
    const method = req.method;
    const path = req.path;
    const time = new Date().toISOString();

    console.log(`[${time}] ${method} ${path}`);

    next();
};

module.exports = requestLogger;
