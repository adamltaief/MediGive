const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
    DonVirement,
    validateCreateDonVirement,
    validateUpdateDonVirement,
  } = require("../models/DonVirement");
const { User } = require("../models/User");

/**-----------------------------------------------
 * @desc    Create New DonVirement
 * @route   /api/donvirement
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 module.exports.createDonVirementCtrl = asyncHandler(async (req, res) => {

        if (!DonVirement) {
          return res.status(400).json({ message: "No donation provided"});
        }

    // 1. Validation for data
    const { error } = validateCreateDonVirement(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    // 2. Create new Donation and save it to DB
    const donvirement = await DonVirement.create({
      nom: req.body.nom ,
      email: req.body.email ,
      addresse: req.body.addresse ,
      zip: req.body.zip ,
      montant: req.body.montant ,
      modepaiment: req.body.modepaiment,
      numerocompte: req.body.numerocompte,
      nombanque: req.body.nombanque,
      iban: req.body.iban,
      note: req.body.note,
      user: req.user.id,

    });
  
    // 3. Send response to the client
    res.status(201).json(donvirement);
  
  });
  
  /**-----------------------------------------------
 * @desc    Get All doantions
 * @route   /api/donvirement
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllDonVirementCtrl = asyncHandler(async (req, res) => {
  let donvirement;
  donvirement = await DonVirement.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  
  res.status(200).json(donvirement);
});

/**-----------------------------------------------
 * @desc    Get Single don
 * @route   /api/donvirement/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
 module.exports.getSingleDonVirementCtrl = asyncHandler(async (req, res) => {
  const donvirement = await DonVirement.findById(req.params.id)
  .populate("user", ["-password"])  
  
  if (!DonVirement) {
    return res.status(404).json({ message: "Don not found" });
  }

  res.status(200).json(donvirement);
});

/**-----------------------------------------------
 * @desc    Get DonVirement Count
 * @route   /api/donvirement/count
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getDonVirementCountCtrl = asyncHandler(async (req, res) => {
  const count = await DonVirement.count();
  res.status(200).json(count);
});

/**-----------------------------------------------
 * @desc    Delete DonVirement
 * @route   /api/donvirement/:id
 * @method  DELETE
 * @access  private (only admin or owner of the donation)
 ------------------------------------------------*/
 module.exports.deleteDonVirementCtrl = asyncHandler(async (req, res) => {
  const donvirement = await DonVirement.findById(req.params.id);
  if (!donvirement) {
    return res.status(404).json({ message: "Don not found" });
  }

  if (!req.user.isAdmin || req.user.id === donvirement.user.toString()) {
    await DonVirement.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Don has been deleted successfully",
      DonVirementId: donvirement._id,
    });

  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});

/**-----------------------------------------------
 * @desc    Update DonVirement
 * @route   /api/donvirement/:id
 * @method  PUT
 * @access  private (only owner of the Donation)
 ------------------------------------------------*/
 module.exports.updateDonVirementCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateUpdateDonVirement(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const donvirement = await DonVirement.findById(req.params.id);
  if (!donvirement) {
    return res.status(404).json({ message: "Don not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user.id === req.user.isAdmin || req.user.id === donvirement.user.toString()) {  
    return res
    .status(403)
    .json({ message: "access denied, you are not allowed"});
  }

  // 4. Update post
  const updatedDonVirement = await DonVirement.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        nom: req.body.nom ,
        email: req.body.email ,
        addresse: req.body.addresse ,
        zip: req.body.zip ,
        montant: req.body.montant ,
        modepaiment: req.body.modepaiment,
        numerocompte: req.body.numerocompte,
        nombanque: req.body.nombanque,
        iban: req.body.iban,
        note: req.body.note,
      },
    },
    { new: true }
  ).populate("user", ["-password"])


  // 5. Send response to the client
  res.status(200).json(updatedDonVirement);
});