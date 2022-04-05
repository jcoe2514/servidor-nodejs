const jwt = require('jsonwebtoken');


module.exports = function( req, res, next) {
     //Leer el token del header
     const token = req.header('x-auth-token');

     //Revisar si no hay jsonwebtoken
     if(!token) {
          return res.status(401).json({ msg: 'No hay token, permiso no valido' });
     }


     //Validar el token

     try {
         const cifrado = jwt.verify(token, process.env.SECRETA);
         console.log("Cifrado");
         console.log(cifrado);
         req.usuario = cifrado.id;
         console.log(req.usaurio);
         next();
     } catch ( error ) {
           res.status(401).json({ msg: 'Token no válido' });
     }


}
