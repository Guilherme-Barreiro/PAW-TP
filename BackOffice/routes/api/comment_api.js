const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticatedAPI } = require('../../middleware/auth');//nao existe acho
const commentController = require('../../controllers/commentController_api');
const upload = require('../../utils/multerConfig')

// POST /api/orders/:id/comments
router.post(
  '/orders/:id/comments',
  isAuthenticatedAPI,
  upload.single('image'),
  commentController.addComment
);

module.exports = router;
