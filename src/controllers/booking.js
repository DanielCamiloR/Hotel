const Booking = require("../models/schema");

// 📌 Crear una nueva reserva
const createBooking = async (req, res) => {
  try {
    const { name, email, roomType, numberOfRooms, numberOfGuests, arrivalDate, departureDate } = req.body;

    const newBooking = new Booking({
      name,
      email,
      roomType,
      numberOfRooms,
      numberOfGuests,
      arrivalDate,
      departureDate,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// 📌 Obtener todas las reservas
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings", error: error.message });
  }
};

// 📌 Obtener una reserva por ID
const getIdBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving booking", error: error.message });
    }
  };

// 📌 Eliminar una reserva por ID
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  getIdBooking
};
