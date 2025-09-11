const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createItem, updateItem } = require('../validators/itemValidator');

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', auth, validate(createItem), itemController.createItem);
router.put('/:id', auth, validate(updateItem), itemController.updateItem);
router.delete('/:id', auth, adminOnly, itemController.deleteItem);

module.exports = router;
