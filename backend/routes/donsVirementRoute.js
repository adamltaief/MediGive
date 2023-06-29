const router = require("express").Router();
const { createDonVirementCtrl, getAllDonVirementCtrl, getSingleDonVirementCtrl, getDonVirementCountCtrl, deleteDonVirementCtrl, updateDonVirementCtrl } = require("../controllers/donVirementController");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/donsvirement
router
  .route("/")
  .post(verifyToken, createDonVirementCtrl)
  .get(getAllDonVirementCtrl);

  // /api/donsvirement/count
router
.route("/count")
.get(getDonVirementCountCtrl);

// /api/donsvirement/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleDonVirementCtrl)
  .delete(validateObjectId, verifyToken, deleteDonVirementCtrl)
  .put(validateObjectId, verifyToken, updateDonVirementCtrl);



module.exports = router;
