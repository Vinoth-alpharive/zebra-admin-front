const express = require("express");
const betInfoController = require("../controllers/betInfoController");

const router = express.Router();
// create game 
router.post("/",betInfoController.createBetInfo);
router.get('/',betInfoController.getBetInfo);

module.exports = router;
