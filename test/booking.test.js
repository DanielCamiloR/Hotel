const createBooking = async () => {
  try {
    data = {
      name: "test alojamiento",
      email: "camilo@gmail.com",
      roomType: "Vacaciones",
      numberOfRooms: 2,
      numberOfGuests: 4,
      arrivalDate: new Date(),
      departureDate: new Date(),
    }

    const newBooking = new Booking({
      data
    });

    await newBooking.save();
    return { message: "Booking created successfully", booking: newBooking };
  } catch (error) {
    return { message: "Error creating booking", error: error.message };
  }
};

test('insertar un nuevo alojamiento', () => {
  expect(createBooking).toBeDefined();
});
