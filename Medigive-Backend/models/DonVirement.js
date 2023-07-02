const mongoose = require("mongoose");
const joi = require("joi");

// Don Schema
const DonVirementSchema = new mongoose.Schema(
  {
    nom : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        maxlength : 50,
        },
    
    addresse : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    zip : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    montant : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        }, 

    modepaiment : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        }, 

    numerocompte : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },
    
    nombanque : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    iban : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    note : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 200,
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

// DonVirement Model
const DonVirement = mongoose.model("DonVirement", DonVirementSchema);

// Validate create DonVirement
function validateCreateDonVirement(obj) {
    const schema = joi.object({
        nom: joi.string().trim().min(3).max(50),
        email: joi.string().trim().min(3).max(50),
        addresse: joi.string().min(3).max(50),
        zip: joi.string().trim().min(3).max(50),
        montant: joi.string().trim().min(3).max(50),
        modepaiment: joi.string().trim().min(3).max(50),
        numerocompte: joi.string().trim().min(3).max(50),
        nombanque: joi.string().trim().min(3).max(50),
        iban: joi.string().trim().min(3).max(50),
        note: joi.string().trim().min(3).max(200),

    });
    return schema.validate(obj);
}

// Validate Update DonVirement
function validateUpdateDonVirement(obj) {
    const schema = joi.object({
        nom: joi.string().trim().min(3).max(50),
        email: joi.string().trim().min(3).max(50),
        addresse: joi.string().min(3).max(50),
        zip: joi.string().trim().min(3).max(50),
        montant: joi.string().trim().min(3).max(50),
        modepaiment: joi.string().trim().min(3).max(50),
        numerocompte: joi.string().trim().min(3).max(50),
        nombanque: joi.string().trim().min(3).max(50),
        iban: joi.string().trim().min(3).max(50),
        note: joi.string().trim().min(3).max(200),

    });
    return schema.validate(obj);
}

module.exports = {
    DonVirement,
    validateCreateDonVirement,
    validateUpdateDonVirement,
  };