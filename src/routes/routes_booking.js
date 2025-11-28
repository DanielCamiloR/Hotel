const express = require("express");
const router = express.Router();
const { createBooking, getAllBookings, getIdBooking, deleteBooking, updateBooking} = require("../controllers/booking");

/**
 * @swagger
 * /api/hotel/create:
 *   post:
 *     summary: Create a new booking
 *     description: Creates a new room reservation
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               roomType:
 *                 type: string
 *               numberOfRooms:
 *                 type: integer
 *               numberOfGuests:
 *                 type: integer
 *               arrivalDate:
 *                 type: string
 *                 format: date
 *               departureDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/create", createBooking);

/**
 * @swagger
 * /api/hotel/get-bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve a list of all bookings
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/get-bookings", getAllBookings);

/**
 * @swagger
 * /api/hotel/get-one-booking/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     description: Get a booking from the system
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking get successfully
 */
router.get("/get-one-booking/:id", getIdBooking);

/**
 * @swagger
 * /api/hotel/delete-booking/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     description: Removes a booking from the system
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 */
router.delete("/delete-booking/:id", deleteBooking);
/**
 * @swagger
 * /api/hotel/update-booking/{id}:
 *   put:
 *     summary: Update a booking by ID
 *     description: Updates an existing room reservation
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               roomType:
 *                 type: string
 *               numberOfRooms:
 *                 type: integer
 *               numberOfGuests:
 *                 type: integer
 *               arrivalDate:
 *                 type: string
 *                 format: date
 *               departureDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid input data
 */
router.put("/update-booking/:id", updateBooking);

module.exports = router;
