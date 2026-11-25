const express = require("express");
const homeRoutes = require("./src/routes/home.routes");
const requestLogger = require("./src/middleware/requestLogger.middleware");

const app = express();
const PORT = 1198;

app.use(express.json());

app.use(requestLogger);

app.use("/", homeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
