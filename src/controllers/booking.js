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
// Agrega esta función al final del archivo booking.js

/**
 * Update a booking by ID
 */
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validar que el ID existe
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID de reserva es requerido'
            });
        }

        // Buscar y actualizar la reserva
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, // Devuelve el documento actualizado
                runValidators: true // Ejecuta las validaciones del schema
            }
        );

        // Verificar si la reserva existe
        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Reserva actualizada exitosamente',
            data: updatedBooking
        });

    } catch (error) {
        console.error('Error actualizando reserva:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de reserva no válido'
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Datos de validación incorrectos',
                errors: error.errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar reserva'
        });
    }
};

module.exports = {
  createBooking,
  getAllBookings,
  deleteBooking,
  getIdBooking,
  updateBooking
};


