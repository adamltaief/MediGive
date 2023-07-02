const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
    DonAppareil,
    validateCreateDonAppareil,
    validateUpdateDonAppareil,
  } = require("../models/DonAppareil");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New DonAppareil
 * @route   /api/donsmedicament
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 module.exports.createDonAppareilCtrl = asyncHandler(async (req, res) => {

        if (!DonAppareil) {
          return res.status(400).json({ message: "No donation provided"});
        }

    // 1. Validation for data
    const { error } = validateCreateDonAppareil(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    // 2. Create new Donation and save it to DB
    const donappareil = await DonAppareil.create({
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
        categorie: req.body.libelle,
        user: req.user.id,

    });
  
    // 3. Send response to the client
    res.status(201).json(donappareil);
  
  });
  
  /**-----------------------------------------------
 * @desc    Get All doantions
 * @route   /api/dons
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllDonAppareilCtrl = asyncHandler(async (req, res) => {
  let donsmedicam;
    donsmedicam = await DonAppareil.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  
  res.status(200).json(donsmedicam);
});

/**-----------------------------------------------
 * @desc    Get Single don
 * @route   /api/donsmedicament/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getSingleDonAppareilCtrl = asyncHandler(async (req, res) => {
  const donappareil = await DonAppareil.findById(req.params.id)
  .populate("user", ["-password"])  
  
  if (!DonAppareil) {
    return res.status(404).json({ message: "Don not found" });
  }

  res.status(200).json(donappareil);
});

/**-----------------------------------------------
 * @desc    Get DonAppareil Count
 * @route   /api/donsmedicament/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getDonAppareilCountCtrl = asyncHandler(async (req, res) => {
  const count = await DonAppareil.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Delete DonAppareil
 * @route   /api/donsmedicament/:id
 * @method  DELETE
 * @access  private (only admin or owner of the donation)
 ------------------------------------------------*/
 module.exports.deleteDonAppareilCtrl = asyncHandler(async (req, res) => {
  const donappareil = await DonAppareil.findById(req.params.id);
  if (!donappareil) {
    return res.status(404).json({ message: "Don not found" });
  }

  if (req.user.isAdmin || req.user.id === donappareil.user.toString()) {
    await DonAppareil.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Don has been deleted successfully",
      DonAppareilId: donappareil._id,
    });

  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});

/**-----------------------------------------------
 * @desc    Update DonAppareil
 * @route   /api/dons/:id
 * @method  PUT
 * @access  private (only owner of the Donation)
 ------------------------------------------------*/
 module.exports.updateDonAppareilCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateUpdateDonAppareil(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const donappareil = await DonAppareil.findById(req.params.id);
  if (!donappareil) {
    return res.status(404).json({ message: "Don not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user.id === req.user.isAdmin || req.user.id === donappareil.user.toString()) {  
    return res
    .status(403)
    .json({ message: "access denied, you are not allowed"});
  }

  // 4. Update post
  const updatedDonAppareil = await DonAppareil.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
        categorie: req.body.libelle,
      },
    },
    { new: true }
  ).populate("user", ["-password"])


  // 5. Send response to the client
  res.status(200).json(updatedDonAppareil);
});