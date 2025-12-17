const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { busId, seatNumbers, travelDate } = req.body;
    const userId = req.user._id;

    // Validation
    if (!busId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0 || !travelDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide busId, seatNumbers array, and travelDate',
      });
    }

    // Get bus details
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    // Check if seats are within valid range
    if (seatNumbers.some((seat) => seat < 1 || seat > bus.totalSeats)) {
      return res.status(400).json({
        success: false,
        message: `Seat numbers must be between 1 and ${bus.totalSeats}`,
      });
    }

    // Check for duplicate seat selection
    if (new Set(seatNumbers).size !== seatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate seat numbers selected',
      });
    }

    // Check if seats are already booked for this date
    const travelDateObj = new Date(travelDate);
    const startOfDay = new Date(travelDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(travelDateObj.setHours(23, 59, 59, 999));

    const existingBookings = await Booking.find({
      busId,
      travelDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: 'CONFIRMED',
      seatNumbers: { $in: seatNumbers },
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.flatMap((b) => b.seatNumbers);
      const conflictingSeats = seatNumbers.filter((seat) => bookedSeats.includes(seat));
      return res.status(400).json({
        success: false,
        message: `Seats ${conflictingSeats.join(', ')} are already booked`,
      });
    }

    // Calculate total amount
    const totalAmount = bus.price * seatNumbers.length;

    // Create booking
    const booking = await Booking.create({
      userId,
      busId,
      seatNumbers,
      travelDate: startOfDay,
      totalAmount,
      status: 'CONFIRMED',
    });

    // Populate bus details for response
    await booking.populate('busId', 'busNumber source destination departureTime arrivalTime price');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('busId', 'busNumber source destination departureTime arrivalTime price')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'busId',
      'busNumber source destination departureTime arrivalTime price'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if already cancelled
    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.status = 'CANCELLED';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};

