const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
    DonMedicam,
    validateCreateDonMedicam,
    validateUpdateDonMedicam,
  } = require("../models/DonMedicam");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New DonMedicam
 * @route   /api/donsmedicament
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 module.exports.createDonMedicamCtrl = asyncHandler(async (req, res) => {

        if (!DonMedicam) {
          return res.status(400).json({ message: "No donation provided"});
        }

    // 1. Validation for data
    const { error } = validateCreateDonMedicam(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    // 2. Create new Donation and save it to DB
    const donmedicam = await DonMedicam.create({
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
        posologie: req.body.libelle,
        maladie: req.body.libelle,
        user: req.user.id,

    });
  
    // 3. Send response to the client
    res.status(201).json(donmedicam);
  
  });
  
  /**-----------------------------------------------
 * @desc    Get All doantions
 * @route   /api/dons
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllDonMedicamCtrl = asyncHandler(async (req, res) => {
  let donsmedicam;
    donsmedicam = await DonMedicam.find()
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
 module.exports.getSingleDonMedicamCtrl = asyncHandler(async (req, res) => {
  const donmedicam = await DonMedicam.findById(req.params.id)
  .populate("user", ["-password"])  
  
  if (!DonMedicam) {
    return res.status(404).json({ message: "Don not found" });
  }

  res.status(200).json(donmedicam);
});

/**-----------------------------------------------
 * @desc    Get DonMedicam Count
 * @route   /api/donsmedicament/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getDonMedicamCountCtrl = asyncHandler(async (req, res) => {
  const count = await DonMedicam.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Delete DonMedicam
 * @route   /api/donsmedicament/:id
 * @method  DELETE
 * @access  private (only admin or owner of the donation)
 ------------------------------------------------*/
 module.exports.deleteDonMedicamCtrl = asyncHandler(async (req, res) => {
  const donmedicam = await DonMedicam.findById(req.params.id);
  if (!donmedicam) {
    return res.status(404).json({ message: "Don not found" });
  }

  if (req.user.isAdmin || req.user.id === donmedicam.user.toString()) {
    await DonMedicam.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Don has been deleted successfully",
      DonMedicamId: donmedicam._id,
    });

  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});

/**-----------------------------------------------
 * @desc    Update DonMedicam
 * @route   /api/dons/:id
 * @method  PUT
 * @access  private (only owner of the Donation)
 ------------------------------------------------*/
 module.exports.updateDonMedicamCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateUpdateDonMedicam(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const donmedicam = await DonMedicam.findById(req.params.id);
  if (!donmedicam) {
    return res.status(404).json({ message: "Don not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user.id === req.user.isAdmin || req.user.id === donmedicam.user.toString()) {  
    return res
    .status(403)
    .json({ message: "access denied, you are not allowed"});
  }

  // 4. Update post
  const updatedDonMedicam = await DonMedicam.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        libelle: req.body.libelle,
        quanitite: req.body.quanitite ,
        date_expiration: req.body.date_expiration ,
        Lieu_stockage: req.body.Lieu_stockage ,
        etat: req.body.etat ,
        description: req.body.description ,
        posologie: req.body.libelle,
        maladie: req.body.libelle,
      },
    },
    { new: true }
  ).populate("user", ["-password"])


  // 5. Send response to the client
  res.status(200).json(updatedDonMedicam);
});