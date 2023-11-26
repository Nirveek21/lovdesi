const express = require('express');
const router = express.Router();


const { userCreateController, userListController, userUpdateController, userDeleteController } = require('../../controllers/user/userController');

router.post(['/'], userCreateController);
router.get(['/', '/:id'], userListController)
router.patch(['/', '/:id'], userUpdateController)
router.delete(['/'], userDeleteController)

module.exports = router;