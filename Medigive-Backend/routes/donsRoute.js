const router = require("express").Router();
const { createDonCtrl, getAllDonCtrl, getSingleDonCtrl, getDonCountCtrl, deleteDonCtrl, updateDonCtrl } = require("../controllers/donController");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/dons
router
  .route("/")
  .post(verifyToken, createDonCtrl)
  .get(getAllDonCtrl);

  // /api/dons/count
router
.route("/count")
.get(getDonCountCtrl);

// /api/dons/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleDonCtrl)
  .delete(validateObjectId, verifyToken, deleteDonCtrl)
  .put(validateObjectId, verifyToken, updateDonCtrl);



module.exports = router;
