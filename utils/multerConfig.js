const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Caminho da pasta para onde as imagens vão ser guardadas
const pastaImagens = path.join(__dirname, '../public/images/pratos');

// Se esta pasta não existir ela cria automaticamente para receber as imagens
if (!fs.existsSync(pastaImagens)) {
  fs.mkdirSync(pastaImagens, { recursive: true });
}

// Configura o storage das imagens

const storage = multer.diskStorage({

  // Define o caminho para onde o ficheiro será guardado

  destination: (req, file, cb) => {
    cb(null, pastaImagens);
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    let filename = `${originalName}${ext}`;
    let counter = 1;

    // Caso exista um ficheiro com o mesmo nome, ele adiciona um número à frente para evitar sobreposição

    while (fs.existsSync(path.join(pastaImagens, filename))) {
      filename = `${originalName} (${counter})${ext}`;
      counter++;
    }

    cb(null, filename);
  }
});

module.exports = multer({ storage });
