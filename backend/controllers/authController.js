const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User,
       validateRegisterUser, 
       validateLoginUser,
} = require("../models/User");
 
/**------------------------------------
 * @desc   Register New User
 * @route /api/auth/register
 * @method POST
 * @access public
 *--------------------------------------*/
module.exports.registerUserCtrl =asyncHandler(async (req,res)=>{
    const {error} = validateRegisterUser(req.body);
    if(error) {
        return res.status(400).json({message: error.details[0].message});
    }
    let user = await User.findOne({email : req.body.email});
    if(user) {
        return res.status(400).json({message : "User Already Exists"});
        }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.mot_de_passe,salt);
    user = new User({
        type : req.body.type,
        nom : req.body.nom,
        prenom : req.body.prenom,
        sexe : req.body.sexe,
        date_de_naissance : req.body.date_de_naissance,
        email : req.body.email,
        mot_de_passe : hashedPassword,
        adresse : req.body.adresse,
        code_postal : req.body.code_postal,
        telephone : req.body.telephone,
        approved: false,
        secteuractivite: req.body.secteuractivite, // Pour le type "Donateur"
        competences: req.body.competences, // Pour le type "Benevole"
        situation: req.body.situation, // Pour le type "Necessiteux"
        description: req.body.description, // Pour le type "Necessiteux"

    });
    await user.save();
    res.status(201).json({message : "you registred successfully, please log in"});


});

/**-----------------------------------------------
 * @desc    Login User
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 ------------------------------------------------*/
 module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
   
   if (!user.approved) {
      return res.status(400).json({ message: "Your registration request is still pending approval" });
    }
    
    const isPasswordMatch = await bcrypt.compare(
        req.body.mot_de_passe,
        user.mot_de_passe
      );
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid email or password" });
      }
     


      const token = user.generateAuthToken();
      res.status(200).json({
        _id: user._id,
        isAdmin: user.isAdmin,
        token,
        type:user.type
      }); 

});