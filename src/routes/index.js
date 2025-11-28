const { Router } = require('express');
const booking = require("./routes_booking");

const router = Router();

// CAMBIA ESTO: quita "/api/hotel" y deja solo "/hotel"
router.use("/hotel", booking);

module.exports = { router };