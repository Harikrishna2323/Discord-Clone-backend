const router = require("express").Router();
const {getAllUsers, getOneUser} = require("../controllers/userController")

router.get('/', getAllUsers );

router.get("/:id", getOneUser);

module.exports = router;