const { Router } = require('express');
const booking = require("./routes_booking");

const router = Router();

router.use("/api/hotel", booking);

module.exports = { router };
