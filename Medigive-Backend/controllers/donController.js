const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
    Don,
    validateCreateDon,
    validateUpdateDon,
  } = require("../models/Don");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New Don
 * @route   /api/dons
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 module.exports.createDonCtrl = asyncHandler(async (req, res) => {

        if (!Don) {
          return res.status(400).json({ message: "No donation provided"});
        }

    // 1. Validation for data
    const { error } = validateCreateDon(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    // 2. Create new Donation and save it to DB
    const don = await Don.create({
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
        user: req.user.id,

    });
  
    // 3. Send response to the client
    res.status(201).json(don);
  
  });
  
  /**-----------------------------------------------
 * @desc    Get All doantions
 * @route   /api/dons
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllDonCtrl = asyncHandler(async (req, res) => {
  let dons;
    dons = await Don.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  
  res.status(200).json(dons);
});

/**-----------------------------------------------
 * @desc    Get Single Post
 * @route   /api/dons/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getSingleDonCtrl = asyncHandler(async (req, res) => {
  const don = await Don.findById(req.params.id)
  .populate("user", ["-password"])  
  
  if (!Don) {
    return res.status(404).json({ message: "Don not found" });
  }

  res.status(200).json(don);
});

/**-----------------------------------------------
 * @desc    Get dons Count
 * @route   /api/dons/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getDonCountCtrl = asyncHandler(async (req, res) => {
  const count = await Don.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Delete Donation
 * @route   /api/dons/:id
 * @method  DELETE
 * @access  private (only admin or owner of the donation)
 ------------------------------------------------*/
 module.exports.deleteDonCtrl = asyncHandler(async (req, res) => {
  const don = await Don.findById(req.params.id);
  if (!don) {
    return res.status(404).json({ message: "Don not found" });
  }

  if (req.user.isAdmin || req.user.id === don.user.toString()) {
    await Don.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Don has been deleted successfully",
      DonId: don._id,
    });

  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});

/**-----------------------------------------------
 * @desc    Update Don
 * @route   /api/dons/:id
 * @method  PUT
 * @access  private (only owner of the Donation)
 ------------------------------------------------*/
 module.exports.updateDonCtrl = asyncHandler(async (req, res,next) => {
  // 1. Validation
  const { error } = validateUpdateDon(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const don = await Don.findById(req.params.id);
  if (!don) {
    return res.status(404).json({ message: "Don not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user.id === req.user.isAdmin || req.user.id === don.user.toString()) {  
    return res
    .status(403)
    .json({ message: "access denied, you are not allowed"});
  }

  // 4. Update post
  const updatedDon = await Don.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
      },
    },
    { new: true }
  ).populate("user", ["-password"])


  // 5. Send response to the client
  res.status(200).json(updatedDon);
});