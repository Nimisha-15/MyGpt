const express = require("express")
const { registerController, loginController, getPublishedImages } = require("../controller/user.controller")

const router = express.Router();

router.post('/register' , registerController)
router.post('/login' , loginController)
router.get('/published-images',getPublishedImages)

module.exports = router;