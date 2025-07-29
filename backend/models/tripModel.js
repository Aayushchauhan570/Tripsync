import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    destination : {
        type : String,
        required : true,
    },
    startDate : {
        type : Date,
        reuired : true,
    },
    endDate : {
        type : Date,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
}, { timestamps: true});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;