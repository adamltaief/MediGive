const mongoose = require("mongoose");
const joi = require("joi");

// Don Schema
const DonAppareilSchema = new mongoose.Schema(
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
        minlength : 1,
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
        },

    etat : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        }, 

    description : {
        type : String,
        required : true,
        trim : true,
        minlength : 10,
        maxlength : 200,
        }, 

    categorie : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true,
    },

    demandes : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Necessiteux",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DonAppareil Model
const DonAppareil = mongoose.model("DonAppareil", DonAppareilSchema);

// Validate create DonAppareil
function validateCreateDonAppareil(obj) {
    const schema = joi.object({
        libelle: joi.string().trim().min(3).max(50),
        quanitite: joi.string().trim().min(1).max(50),
        date_expiration: joi.date().min(3).max(50),
        Lieu_stockage: joi.string().trim().min(3).max(50),
        etat: joi.string().trim().min(3).max(50),
        description: joi.string().trim().min(10).max(200),
        categorie: joi.string().trim().min(3).max(50),

    });
    return schema.validate(obj);
}

// Validate Update DonAppareil
function validateUpdateDonAppareil(obj) {
    const schema = joi.object({
        libelle: joi.string().trim().min(3).max(50),
        quanitite: joi.string().trim().min(1).max(50),
        date_expiration: joi.date().min(3).max(50),
        Lieu_stockage: joi.string().trim().min(3).max(50),
        etat: joi.string().trim().min(3).max(50),
        description: joi.string().trim().min(10).max(200),
        categorie: joi.string().trim().min(3).max(50),

    });
    return schema.validate(obj);
}

module.exports = {
    DonAppareil,
    validateCreateDonAppareil,
    validateUpdateDonAppareil,
  };