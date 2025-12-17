const express = require('express');
const router = express.Router();
const {
  searchBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  getBookedSeats,
  getUpcomingRoutes,
} = require('../controllers/busController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.get('/upcoming', getUpcomingRoutes);
router.get('/search', searchBuses);
router.get('/:id', getBusById);
router.get('/:id/booked-seats', getBookedSeats);

// Protected routes (Admin - for bus management)
router.post('/', authenticate, createBus);
router.put('/:id', authenticate, updateBus);
router.delete('/:id', authenticate, deleteBus);

module.exports = router;

