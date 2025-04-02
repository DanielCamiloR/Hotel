const { mongoose  } = require('mongoose');


const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roomType: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  numberOfGuests: { type: Number, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("reservations", bookingSchema);
module.exports = Booking;
