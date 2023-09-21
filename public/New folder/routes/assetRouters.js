const express = require('express');
const assetController = require('../controllers/assetController');


const router = express.Router();
// //create asset
 router.post('/', assetController.createAsset);
//edit asset details
router.put('/', assetController.editAsset);
//list asset details
router.get('/', assetController.listAsset);
module.exports = router;