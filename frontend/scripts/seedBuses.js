const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');

dotenv.config();

// Sample bus data (future-dated)
const buses = [
  {
    busNumber: 'BUS201',
    source: 'Mumbai',
    destination: 'Pune',
    departureTime: new Date('2025-01-18T08:00:00Z'),
    arrivalTime: new Date('2025-01-18T12:00:00Z'),
    price: 520,
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['WiFi', 'AC', 'USB Charging', 'Reading Light'],
  },
  {
    busNumber: 'BUS202',
    source: 'Mumbai',
    destination: 'Delhi',
    departureTime: new Date('2025-01-20T10:30:00Z'),
    arrivalTime: new Date('2025-01-21T05:45:00Z'),
    price: 1550,
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['WiFi', 'AC', 'Reclining Seats', 'Snacks'],
  },
  {
    busNumber: 'BUS203',
    source: 'Bangalore',
    destination: 'Chennai',
    departureTime: new Date('2025-01-22T07:15:00Z'),
    arrivalTime: new Date('2025-01-22T11:30:00Z'),
    price: 650,
    totalSeats: 36,
    availableSeats: 36,
    amenities: ['WiFi', 'AC', 'Water Bottle', 'Blanket'],
  },
  {
    busNumber: 'BUS204',
    source: 'Delhi',
    destination: 'Jaipur',
    departureTime: new Date('2025-01-19T06:45:00Z'),
    arrivalTime: new Date('2025-01-19T10:05:00Z'),
    price: 480,
    totalSeats: 32,
    availableSeats: 32,
    amenities: ['AC', 'Reading Light', 'Live Tracking'],
  },
  {
    busNumber: 'BUS205',
    source: 'Hyderabad',
    destination: 'Vizag',
    departureTime: new Date('2025-01-25T09:00:00Z'),
    arrivalTime: new Date('2025-01-25T14:20:00Z'),
    price: 720,
    totalSeats: 44,
    availableSeats: 44,
    amenities: ['WiFi', 'AC', 'USB Charging', 'Snacks', 'Pillow'],
  },
  {
    busNumber: 'BUS206',
    source: 'Pune',
    destination: 'Goa',
    departureTime: new Date('2025-01-24T22:30:00Z'),
    arrivalTime: new Date('2025-01-25T06:10:00Z'),
    price: 890,
    totalSeats: 38,
    availableSeats: 38,
    amenities: ['WiFi', 'AC', 'Blanket', 'Water Bottle'],
  },
  {
    busNumber: 'BUS207',
    source: 'Chennai',
    destination: 'Coimbatore',
    departureTime: new Date('2025-01-23T05:45:00Z'),
    arrivalTime: new Date('2025-01-23T10:05:00Z'),
    price: 540,
    totalSeats: 34,
    availableSeats: 34,
    amenities: ['AC', 'USB Charging', 'Reading Light'],
  },
  {
    busNumber: 'BUS208',
    source: 'Delhi',
    destination: 'Chandigarh',
    departureTime: new Date('2025-01-21T07:30:00Z'),
    arrivalTime: new Date('2025-01-21T12:15:00Z'),
    price: 620,
    totalSeats: 40,
    availableSeats: 40,
    amenities: ['WiFi', 'AC', 'Snacks'],
  },
  {
    busNumber: 'BUS209',
    source: 'Ahmedabad',
    destination: 'Udaipur',
    departureTime: new Date('2025-01-26T06:10:00Z'),
    arrivalTime: new Date('2025-01-26T11:25:00Z'),
    price: 560,
    totalSeats: 30,
    availableSeats: 30,
    amenities: ['AC', 'Reading Light', 'Water Bottle'],
  },
  {
    busNumber: 'BUS210',
    source: 'Kolkata',
    destination: 'Durgapur',
    departureTime: new Date('2025-01-19T14:00:00Z'),
    arrivalTime: new Date('2025-01-19T18:00:00Z'),
    price: 420,
    totalSeats: 28,
    availableSeats: 28,
    amenities: ['AC', 'USB Charging'],
  },
  {
    busNumber: 'BUS211',
    source: 'Lucknow',
    destination: 'Kanpur',
    departureTime: new Date('2025-01-18T16:00:00Z'),
    arrivalTime: new Date('2025-01-18T18:00:00Z'),
    price: 260,
    totalSeats: 30,
    availableSeats: 30,
    amenities: ['AC', 'USB Charging'],
  },
  {
    busNumber: 'BUS212',
    source: 'Bhopal',
    destination: 'Indore',
    departureTime: new Date('2025-01-27T08:20:00Z'),
    arrivalTime: new Date('2025-01-27T11:10:00Z'),
    price: 350,
    totalSeats: 32,
    availableSeats: 32,
    amenities: ['AC', 'WiFi'],
  },
];

const seedBuses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/busbooking');
    console.log('Connected to MongoDB');

    // Clear existing buses
    await Bus.deleteMany({});
    console.log('Cleared existing buses');

    // Insert new buses
    await Bus.insertMany(buses);
    console.log(`Seeded ${buses.length} buses successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding buses:', error);
    process.exit(1);
  }
};

seedBuses();

