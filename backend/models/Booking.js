const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus ID is required'],
    },
    seatNumbers: {
      type: [Number],
      required: [true, 'Seat numbers are required'],
      validate: {
        validator: function (seats) {
          return seats.length > 0 && seats.every((seat) => seat > 0);
        },
        message: 'At least one valid seat number is required',
      },
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ busId: 1, travelDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

