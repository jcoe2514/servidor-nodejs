//Rutas para autenticar Usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
//Inicial sesión
//api/auth
router.post('/',
    authController.autenticarUsuario
);
//Obtiene le usuario autenticado
router.get('/',
     auth,
     authController.usuarioAutenticado

)
module.exports = router;
