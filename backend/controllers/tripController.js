import exress from "express";
import User from "../models/userModel.js";
import tripModel from "../models/tripModel.js";


// create new  trip
const createTrip = async (req, res) => {
    try{
        const {title, destination, startDate, endDate, description} = req.body;
        const userId = req.user._id; // Assuming user ID is available in req.user
        if (!title || !destination || !startDate || !endDate || !description) {
            return res.status(400).json({error: "All fields are required"});
        }

        if( userId === undefined) {
            return res.status(401).json({error: "Unauthorized"});
        }

        const  newTrip = new tripModel({
            title,
            destination, 
            startDate,
            endDate, description,
            createdBy: userId,
            members: [userId]   
        })

        await newTrip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip: newTrip
        });
    }catch(err) {
        console.error('Error creating trip:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}


// get all trips for user
const getTrip = async (req, res) => {
    try{
        const trips = await tripModel.find({members: req.user._id});
        res.status(200).json(trips);
    }catch(err) {
        console.error('Error retrieving trips:', err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// delete trip

const deleteTrip = async (req, res) => {
    try {
        const tripId = req.params.id;
        const trip = await tripModel.findById(tripId);

        if(!trip) {
            return res.status(404).json({error : "Trip not found"});
        }

        if(trip.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "You are not authorized to delete this trip"});
        }

        await tripModel.findByIdAndDelete(tripId);
        res.status(200).json({message: "Trip deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export { createTrip, getTrip , deleteTrip};