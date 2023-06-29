const asyncHandler = require("express-async-handler");

const {User, validateUpdateUser,} = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Don } = require("../models/Don");




/**-----------------------------------------------
 * @desc    Get All Users Profile
 * @route   /api/users/profile
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
    const users = await User.find().select("-mot_de_passe").populate("dons").populate({
      path: "secteuractivite competences situation description",
      select: "-_id -__v",
    });
    res.status(200).json(users);
  });

  /**-----------------------------------------------
 * @desc    Get User Profile
 * @route   /api/users/profile/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-mot_de_passe").populate("dons").populate({
    path: "secteuractivite competences situation description",
    select: "-_id -__v",
  });


  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.status(200).json(user);
});

/**-----------------------------------------------
 * @desc    Update User Profile
 * @route   /api/users/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 ------------------------------------------------*/
 module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        nom: req.body.nom,
        prenom: req.body.prenom,
        date_de_naissance: req.body.date_de_naissance,
        sexe: req.body.sexe,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe, 
        adresse: req.body.adresse,
        code_postal: req.body.code_postal,
        telephone: req.body.telephone,
        secteuractivite: req.body.secteuractivite, // Pour le type "Donateur"
        competences: req.body.competences, // Pour le type "Benevole"
        situation: req.body.situation, // Pour le type "Necessiteux"
        description: req.body.description, // Pour le type "Necessiteux"
        
      },
    },
    { new: true }
  ).select("-mot_de_passe")
  .populate("dons");

  res.status(200).json(updatedUser);
});

/**-----------------------------------------------
 * @desc    Get Users Count
 * @route   /api/users/count
 * @method  GET
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Delete User Profile (Account)
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 ------------------------------------------------*/
 module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  // 2. Get all posts from DB 
  const dons = await Don.find({ user: user._id });

  // 3. Get the public ids from the posts


  // 5. Delete the profile picture from cloudinary

  
  // 6. Delete user posts & comments
  await Don.deleteMany({ user: user._id });


  // 7. Delete the user himself
  await User.findByIdAndDelete(req.params.id);

  // 8. Send a response to the client
  res.status(200).json({ message: "your profile has been deleted" });
});

/**-----------------------------------------------
 * @desc    Get Pending Registration Requests
 * @route   /api/auth/pending
 * @method  GET
 * @access  private (accessible only by admin)
 ------------------------------------------------*/
 module.exports.getPendingRequestsCtrl = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({ approved: false });
  res.status(200).json(pendingUsers);
});

/**-----------------------------------------------
 * @desc    Approve Registration Request
 * @route   /api/auth/approve/:userId
 * @method  PUT
 * @access  private (accessible only by admin)
 ------------------------------------------------*/
module.exports.approveRequestCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const updatedUser = await User.findByIdAndUpdate(
  req.params.id,
  {
    $set: {
      approved:true
    }
    },
    { new: true }
  )

res.status(200).json({ message: "User approved successfully" });


});

exports.getUserType = async (req, res) => {
  try {
    const { email } = req.query;

    // Find the user in the database based on the email
    const user = await User.findOne({ email });

    if (user) {
      // Retrieve the user type from the user object
      const userType = user.type;

      res.json({ userType });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    
  }
};

/**-----------------------------------------------
 * @desc    Reject Registration Request
 * @route   /api/auth/reject/:userId
 * @method  PATCH
 * @access  private (accessible only by admin)
 ------------------------------------------------*/
module.exports.rejectRequestCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "User rejected and removed successfully" });
});

