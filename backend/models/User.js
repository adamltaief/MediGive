const { default: mongoose } = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");


//User Schema
const UserSchema = new mongoose.Schema({
    
    nom : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    prenom : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },
    
    date_de_naissance : {
        type : Date,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 10,
        },
    
    sexe : {
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
        minlength : 8,
        unique : true,
        } ,
        
    mot_de_passe : {
        type : String,
        required : true,
        trim : true,
        minlength : 8
        },

    adresse : {
        type : String,
        required : true,
        trim : true,
        minlength : 5,
        maxlength : 100,
        },

    code_postal : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 50,
        },

    telephone : {
        type : String,
        required : true,
        trim : true,
        minlength : 8,
        maxlength : 12,
        unique : true,
        },
        
    type: {
        type: mongoose.Schema.Types.String,
        ref: "UserType",
         required: false,
        }  , 

    secteuractivite: {
        type: mongoose.Schema.Types.String,
        ref: 'Donateur',
        },

    competences: {
        type: mongoose.Schema.Types.String,
        ref: 'Benevole',
        },

    situation: {
        type: mongoose.Schema.Types.String,
        ref: 'Necessiteux',
        },

    description: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Necessiteux',
        },

    isAdmin : {
        type : Boolean,
        default : false,
    },
    isAccountVerified : {
        type : Boolean,
        default : false,
    },
    
    approved: {
        type: Boolean,
        default: false
      }
        
},
{
    timestamps : true,
    toJSON : {virtuals:true},
    toObject : {virtuals:true}
})


UserSchema.virtual("dons", {
    ref: "Don",
    foreignField: "user",
    localField: "_id",
});

// Schéma pour le type d'utilisateur "Donateur" avec des attributs supplémentaires
const DonateurSchema = new mongoose.Schema(
    {
      secteuractivite: {
        type: String,
        required: true,
        trim : true,
        minlength : 3,
        maxlength : 50,
      },
    },
    { discriminatorKey: "type" }
  );
  
  // Schéma pour le type d'utilisateur "Bénévole" avec des attributs supplémentaires
  const BenevoleSchema = new mongoose.Schema(
    {
      competences: {
        type: String,
        required: true,
        trim : true,
        minlength : 3,
        maxlength : 50,
      },
    },
    { discriminatorKey: "type" }
  );
  
  // Schéma pour le type d'utilisateur "Nécessiteux" avec des attributs supplémentaires
  const NecessiteuxSchema = new mongoose.Schema(
    {
      situation: {
        type: String,
        required: true,
        trim : true,
        minlength : 3,
        maxlength : 50,
      },
      description: {
        type: String,
        required: true,
        trim : true,
        minlength : 3,
        maxlength : 50,
      },
    },
    { discriminatorKey: "type" }
  );
// Generate Auth Token
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}
  // Appliquer l'héritage et associer les schémas dérivés au schéma de base
const User = mongoose.model("User", UserSchema);
const Donateur = User.discriminator("Donateur", DonateurSchema);
const Benevole = User.discriminator("Benevole", BenevoleSchema);
const Necessiteux = User.discriminator("Necessiteux", NecessiteuxSchema);


//Validate Register User
function validateRegisterUser(obj){
    const schema = joi.object({
        type: joi.string().valid("Donateur", "Benevole", "Necessiteux","Admin").required(),
        nom : joi.string().min(2).max(50).required(),
        prenom : joi.string().min(3).max(50).required(),
        date_de_naissance : joi.date().min(3).max(10).required(),
        sexe : joi.string().trim().min(3).max(50).required(),
        email : joi.string().min(8).required().email(),
        mot_de_passe : joi.string().trim().min(8).required(),
        adresse : joi.string().trim().min(5).max(100).required(),
        code_postal : joi.string().min(3).max(50).required(),
        telephone : joi.string().min(8).max(12).required(),
        secteuractivite : joi.string().when("type", {
            is: "Donateur",
            then: joi.required(),
          }),
          competences: joi.string().trim().min(3).max(50).when("type", {
            is: "Benevole",
            then: joi.required(),
          }),
          situation: joi.string().trim().min(3).max(50).when("type", {
            is: "Necessiteux",
            then: joi.required(),
          }),
          description: joi.string().trim().min(3).max(50).when("type", {
            is: "Necessiteux",
            then: joi.required(),
          }),
    });
    return schema.validate(obj);
}

//Validate Login User
function validateLoginUser(obj){
    const schema = joi.object({
        email : joi.string().min(8).required().email(),
        mot_de_passe : joi.string().trim().min(8).required(),
    });
    return schema.validate(obj);
}

// Validate Update User
function validateUpdateUser(obj) {
    const schema = joi.object({
        mot_de_passe: joi.string().min(8).trim(),
        email: joi.string().trim().min(8).email(),
        nom: joi.string().trim().min(2).max(50),
        prenom: joi.string().trim().min(3).max(50),
        date_de_naissance: joi.date().min(3).max(10),
        sexe: joi.string().trim().min(3).max(50),
        adresse: joi.string().trim().min(5).max(100),
        code_postal: joi.string().trim().min(3).max(50),
        telephone: joi.string().min(8).max(12),
        secteuractivite : joi.string().when("type", {
            is: "Donateur",
            then: joi.required(),
          }),
          competences: joi.string().trim().min(3).max(50).when("type", {
            is: "Benevole",
            then: joi.required(),
          }),
          situation: joi.string().trim().min(3).max(50).when("type", {
            is: "Necessiteux",
            then: joi.required(),
          }),
          description: joi.string().trim().min(3).max(50).when("type", {
            is: "Necessiteux",
            then: joi.required(),
          }),
    });
    return schema.validate(obj);
}
module.exports ={
    User,
    Donateur,
    Benevole,
    Necessiteux,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}