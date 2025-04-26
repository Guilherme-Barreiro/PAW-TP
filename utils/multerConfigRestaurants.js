const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pastaImagens = path.join(__dirname, '../public/images/restaurantes');

if (!fs.existsSync(pastaImagens)) {
  fs.mkdirSync(pastaImagens, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaImagens);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    let filename = `${originalName}${ext}`;
    let counter = 1;

    while (fs.existsSync(path.join(pastaImagens, filename))) {
      filename = `${originalName} (${counter})${ext}`;
      counter++;
    }

    cb(null, filename);
  }
});

module.exports = multer({ storage });
