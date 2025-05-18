const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/commentController_api');
const multer = require('multer');
const upload = multer({ dest: 'public/images/comments/' });
const { verifyToken } = require('../../controllers/api/authController'); // se usares JWT

// POST /api/comments/:id
router.post('/:id', verifyToken, upload.single('image'), commentController.addComment);

// GET /api/comments/:id
router.get('/:id', commentController.getCommentsByOrder);

module.exports = router;
