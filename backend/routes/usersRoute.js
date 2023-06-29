const { getAllUsersCtrl, 
        getUserProfileCtrl, 
        updateUserProfileCtrl, 
        getUsersCountCtrl, 
        deleteUserProfileCtrl, 
        getPendingRequestsCtrl, 
        approveRequestCtrl, 
        rejectRequestCtrl, 
        getUserType
      } = require("../controllers/userController");

const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");
const router = require("express").Router();

// /api/users/newregistrations
router.route("/newregistrations")
.get(verifyTokenAndAdmin , getPendingRequestsCtrl )

// /api/users/newregistrations
router.route("/newregistrations/:id")
.get(validateObjectId , getUserProfileCtrl )
.put(validateObjectId , verifyTokenAndAdmin , approveRequestCtrl )
.patch(validateObjectId , verifyTokenAndAdmin , rejectRequestCtrl )

// Route to retrieve the user type based on email
router.route("/users/profile/type").get(getUserType);

module.exports = router;
// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin , getAllUsersCtrl);

// /api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId , getUserProfileCtrl )
  .put(validateObjectId, verifyTokenAndAuthorization, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndAuthorization ,deleteUserProfileCtrl);
// /api/users/count
router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

module.exports = router;