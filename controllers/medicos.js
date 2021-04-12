const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
  try {
    const medicos = await Medico.find()
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img');

    return res.json({
      ok: true,
      medicos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: 'Hable con el administrador',
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    ...req.body,
    usuario: uid,
  });

  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;
  try {
    const medico = await Medico.findById(id);

    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado por id',
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medico = await Medico.findById(id);

    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado por id',
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Medico eliminado',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const getMedicoById = async (req, res = response) => {
  const id = req.params.id;

  try {

    if (!isValidObjectId(id)) {
      return res.json({
        ok: true,
        msg: 'IsValidObjectID reached. Method getMedicoById'
      });
    }  

    const medico = await Medico.findById(id)
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img');
      

    return res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: 'Hable con el administrador.',
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicoById,
};
