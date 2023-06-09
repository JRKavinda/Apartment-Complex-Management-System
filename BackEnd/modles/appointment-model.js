const mongoose = require("mongoose");

const appointmentSchema =  mongoose.Schema({

    ownersName:{
        required:true,
        type:String
    },
    serviceType:{
        required:true,
        type:String
    },
    contactNo:{
        required:true,
        type:String
    },
    createdAt:{
        required:true,
        type:Date
    },
})

const  Appointment = mongoose.model("Appointment",  appointmentSchema);
module.exports =  Appointment;