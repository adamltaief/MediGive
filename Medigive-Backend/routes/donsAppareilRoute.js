const router = require("express").Router();
const { createDonAppareilCtrl, getAllDonAppareilCtrl, getSingleDonAppareilCtrl, getDonAppareilCountCtrl, deleteDonAppareilCtrl, updateDonAppareilCtrl } = require("../controllers/donAppareilController");
const { verifyToken } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/donsmedicament
router
  .route("/")
  .post(verifyToken, createDonAppareilCtrl)
  .get(getAllDonAppareilCtrl);

  // /api/donsmedicament/count
router
.route("/count")
.get(getDonAppareilCountCtrl);

// /api/donsmedicament/:id
router
  .route("/:id")
  .get(validateObjectId, getSingleDonAppareilCtrl)
  .delete(validateObjectId, verifyToken, deleteDonAppareilCtrl)
  .put(validateObjectId, verifyToken, updateDonAppareilCtrl);



module.exports = router;
