const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

// Helper: attach availability per bus for a given travel date
const attachAvailability = async (buses, travelDate) => {
  if (!travelDate || buses.length === 0) return buses;

  const searchDate = new Date(travelDate);
  const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
  const busIds = buses.map((b) => b._id);

  const bookings = await Booking.aggregate([
    {
      $match: {
        busId: { $in: busIds },
        travelDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'CONFIRMED',
      },
    },
    { $unwind: '$seatNumbers' },
    {
      $group: {
        _id: '$busId',
        bookedCount: { $sum: 1 },
      },
    },
  ]);

  const bookedMap = bookings.reduce((acc, cur) => {
    acc[cur._id.toString()] = cur.bookedCount;
    return acc;
  }, {});

  return buses.map((bus) => {
    const booked = bookedMap[bus._id.toString()] || 0;
    const available = Math.max(0, bus.totalSeats - booked);
    const plain = bus.toObject();
    plain.availableSeats = available;
    plain.bookedSeatsCount = booked;
    return plain;
  });
};

// @desc    Get upcoming buses (future departures)
// @route   GET /api/buses/upcoming
// @access  Public
const getUpcomingRoutes = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const now = new Date();

    const buses = await Bus.find({
      departureTime: { $gte: now },
    })
      .sort({ departureTime: 1 })
      .limit(Number(limit));

    const withAvailability = await attachAvailability(buses, now);

    res.status(200).json({
      success: true,
      count: withAvailability.length,
      data: withAvailability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all buses (with optional search)
// @route   GET /api/buses/search
// @access  Public
const searchBuses = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;

    // Build query
    const query = {};

    if (source) {
      query.source = new RegExp(source, 'i'); // Case-insensitive search
    }

    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

      query.departureTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    const buses = await Bus.find(query).sort({ departureTime: 1 });

    const withAvailability = await attachAvailability(buses, date);

    res.status(200).json({
      success: true,
      count: withAvailability.length,
      data: withAvailability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bus
// @route   POST /api/buses
// @access  Private (Admin - for now, we'll make it accessible)
const createBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private (Admin)
const updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private (Admin)
const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked seats for a bus on a specific date
// @route   GET /api/buses/:id/booked-seats
// @access  Public
const getBookedSeats = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    const travelDate = new Date(date);
    const startOfDay = new Date(travelDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(travelDate.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      busId: req.params.id,
      travelDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: 'CONFIRMED',
    });

    // Flatten all booked seat numbers
    const bookedSeats = bookings.flatMap((booking) => booking.seatNumbers);

    res.status(200).json({
      success: true,
      data: {
        bookedSeats: [...new Set(bookedSeats)], // Remove duplicates
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBookedSeats,
  getUpcomingRoutes,
};

