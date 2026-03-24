const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { s3Client } = require('../config/aws');
const multer = require('multer');
const multerS3 = require('multer-s3');

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => cb(null, `tickets/${Date.now()}_${file.originalname}`)
    })
});

router.get('/', ticketController.getAllTickets);
router.get('/add', (req, res) => res.render('add'));
router.get('/edit/:id', ticketController.getEditPage);
router.post('/save', upload.single('image'), ticketController.saveTicket);
router.get('/delete/:id', ticketController.deleteTicket);

module.exports = router;