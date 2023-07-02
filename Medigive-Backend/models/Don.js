const mongoose = require("mongoose");
const joi = require("joi");

// Don Schema
const DonSchema = new mongoose.Schema(
  {
    libelle : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    quanitite : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },
    
    date_expiration : {
        type : Date,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    Lieu_stockage : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        } ,

    etat : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        } , 

    description : {
        type : String,
        required : true,
        trim : true,
        minlength : 10,
        maxlength : 200,
        } , 
    
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true,
    },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Don Model
const Don = mongoose.model("Don", DonSchema);

// Validate create Don
function validateCreateDon(obj) {
    const schema = joi.object({
        libelle: joi.string().trim().min(3).max(50),
        quanitite: joi.string().trim().min(3).max(50),
        date_expiration: joi.date().min(3).max(50),
        Lieu_stockage: joi.string().trim().min(3).max(50),
        etat: joi.string().trim().min(3).max(50),
        description: joi.string().trim().min(10).max(200),
        
    });
    return schema.validate(obj);
}

// Validate Update Don
function validateUpdateDon(obj) {
    const schema = joi.object({
        libelle: joi.string().trim().min(3).max(50),
        quanitite: joi.string().trim().min(3).max(50),
        date_expiration: joi.date().min(3).max(50),
        Lieu_stockage: joi.string().trim().min(3).max(50),
        etat: joi.string().trim().min(3).max(50),
        description: joi.string().trim().min(10).max(200),
        
    });
    return schema.validate(obj);
}

module.exports = {
    Don,
    validateCreateDon,
    validateUpdateDon,
  };