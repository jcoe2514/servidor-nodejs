//Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

//Crear usuario

//api/usuarios
router.post('/',
    [
        check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
        check('email', 'Agrega un Email valido').isEmail(),
        check('password', 'El password debe ser minimo seis caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

module.exports = router;
