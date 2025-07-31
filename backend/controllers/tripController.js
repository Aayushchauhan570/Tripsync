import express from "express";
// import User from "../models/userModel.js";
import authMiddleware from '../middleware/authMiddleware.js';
import tripModel from "../models/tripModel.js";


// Create new trip
const createTrip = async (req, res) => {
    try {
        console.log(req.user);
        const { title, destination, startDate, endDate, description } = req.body;
        const userId = req.user._id; // Available from authMiddleware in routes
        
        // Input validation
        if (!title || !destination || !startDate || !endDate || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // User authentication check (redundant but good practice)
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Date validation
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        
        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }
        
        // Set today to start of day for comparison
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        
        if (start < today) {
            return res.status(400).json({ error: "Start date cannot be in the past" });
        }
        
        if (end <= start) {
            return res.status(400).json({ error: "End date must be after start date" });
        }

        // Create new trip
        const newTrip = new tripModel({
            title,
            destination, 
            startDate: start,
            endDate: end,
            description,
            createdBy: userId,
            members: [userId]   
        });

        await newTrip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip: {
                _id: newTrip._id,
                title: newTrip.title,
                destination: newTrip.destination,
                startDate: newTrip.startDate,
                endDate: newTrip.endDate,
                description: newTrip.description,
                createdBy: newTrip.createdBy,
                members: newTrip.members
            }
        });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all trips for user
const getTrip = async (req, res) => {
    try {
        const trips = await tripModel.find({ members: req.user._id })
            .populate('createdBy', 'username')
            .populate('members', 'username')
            .select('-__v')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Trips retrieved successfully",
            count: trips.length,
            trips
        });
    } catch (error) {
        console.error('Error retrieving trips:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete trip
const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        
        // Validate trip ID format
        if (!tripId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid trip ID format" });
        }
        
        const trip = await tripModel.findById(tripId);

        if (!trip) {
            return res.status(404).json({ error: "Trip not found" });
        }

        // Check if user is authorized to delete
        if (trip.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this trip" });
        }

        await tripModel.findByIdAndDelete(tripId);
        
        res.status(200).json({ 
            message: "Trip deleted successfully",
            deletedTripId: tripId
        });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { createTrip, getTrip, deleteTrip };