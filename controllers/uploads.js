const { response } = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  //Validar tipos
  const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es un médico, usuario u hospial (tipo)',
    });
  }

  //Validar que exista un archivvo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: 'No se han subido archivos',
    });
  }

  //Procesar la imagen
  const file = req.files.imagen;

  const nombreCortado = file.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //Validar extension
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: 'No es una extensión permitida',
    });
  }

  //Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  //Path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  //Actualizar base de datos

  let resp;
  await actualizarImagen(tipo, id, nombreArchivo).then((retorna) => {
    if (!retorna) {
      resp = retorna;
    }
  });

  if (resp === false) {
    return res.status(500).json({
      ok: false,
      msg: 'Error al actualizar la imagen. Verifique los logs.',
    });
  }

  // Mover la imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: 'Error al mover la imagen',
      });
    }
  });

  res.json({
    ok: true,
    msg: 'Archivo subido',
    nombreArchivo,
  });
};

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  //Imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/noimg.png`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
