const multer = require('multer')
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file , cb) => {
        const directory = path.join(__dirname, '../uploads/');
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        const filePath = uuid.v4() + path.extname(file.originalname);
        req.body.imageUrl = '/uploads/' + filePath;
        cb(null, filePath);
    }
});

const upload = multer({storage: storage});

module.exports = upload;
