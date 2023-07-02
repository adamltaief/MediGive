const router = require("express").Router();
const { createDonMedicamCtrl, getAllDonMedicamCtrl, getSingleDonMedicamCtrl, getDonMedicamCountCtrl, deleteDonMedicamCtrl, updateDonMedicamCtrl } = require("../controllers/donMedicamController");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/donsmedicament
router
  .route("/")
  .post(verifyToken, createDonMedicamCtrl)
  .get(getAllDonMedicamCtrl);

  // /api/donsmedicament/count
router
.route("/count")
.get(getDonMedicamCountCtrl);

// /api/donsmedicament/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleDonMedicamCtrl)
  .delete(validateObjectId, verifyToken, deleteDonMedicamCtrl)
  .put(validateObjectId, verifyToken, updateDonMedicamCtrl);



module.exports = router;
