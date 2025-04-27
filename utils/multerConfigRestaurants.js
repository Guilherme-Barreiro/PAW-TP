const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pastaImagens = path.join(__dirname, '../public/images/restaurantes');

// Se esta pasta não existir, ela cria automaticamente

if (!fs.existsSync(pastaImagens)) {
  fs.mkdirSync(pastaImagens, { recursive: true });
}

// Configura o storage das imagens

const storage = multer.diskStorage({

  // Define onde as imagens vão ser guardadas

  destination: (req, file, cb) => {
    cb(null, pastaImagens);
  },

  // Define o nome do ficheiro

  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    let filename = `${originalName}${ext}`;
    let counter = 1;
 
    // Se já existir algum ficheiro com este nome, ele coloca um número à frente para evitar sobreposição de ficheiros

    while (fs.existsSync(path.join(pastaImagens, filename))) {
      filename = `${originalName} (${counter})${ext}`;
      counter++;
    }

    cb(null, filename);
  }
});

module.exports = multer({ storage });
