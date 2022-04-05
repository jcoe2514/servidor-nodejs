const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
exports.crearUsuario = async ( req, res ) => {

     //Revisarsi hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty() ) {
         return res.status(400).json({ errores: errores.array() });
     }

    //Extraer email y passsword
    const { email, password } = req.body;
    try {
        //Revisar que el usario sea unico
        let usuario = await Usuario.findOne({ email });

        if( usuario ) {
             return res.status(400).json({ msg: 'El Usuario ya existe' });
        }

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        // HAshear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt );


        //Guardar usuario
        await usuario.save();

        //Crear y firmar eljwt
        const paylaod = {
            id : usuario.id
        }
        //Firmar el jsonwebtoken
        jwt.sign(paylaod, process.env.SECRETA, {
            expiresIn: 3600 //1 hora
        }, ( error, token ) => {
             if(error) throw error;
             //Mensaje de confimación
             res.json({ token });
        })


    } catch ( error ) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }

}
