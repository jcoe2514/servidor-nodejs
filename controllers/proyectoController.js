const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async ( req, res) => {

     //Revisar si hay errores
     const errores = validationResult(req);
     if( !errores.isEmpty() ) {
          return res.status(400).json( { errores: errores.array() } );
     }

     try {
          //Crear un nuevo proyectos
          const proyecto = new Proyecto(req.body);
          console.log(proyecto);

          // Guardar el creador via JWT
           proyecto.creador = req.usuario;
           console.log(req.usuario);
           console.log(proyecto.creador);

          //Guardar el proyecto
          proyecto.save();
          res.json(proyecto);
     } catch ( error) {
          console.log(error);
          res.status(500).send('Hubo un error');
     }
}

//Pbtienen todos los proyectos del usaurio actua
exports.obtenerProyectos = async ( req, res ) => {
     try {
          const proyectos = await Proyecto.find({ creador: req.usuario }).sort({ creado: -1});
          res.json({ proyectos });
     } catch ( error ) {
          console.log(error);
          res.status(500).send('Hubo un error');
     }
}
//Actualiza un proyecto
exports.actualizarProyecto = async ( req, res ) => {
      //Revisar si hay errores
      const errores = validationResult(req);
      if( !errores.isEmpty() ) {
           return res.status(400).json( { errores: errores.array() } );
      }

      //Extrare la información del proyecto

      const { nombre } = req.body;
      const nuevoProyecto = {};
      if(nombre) {
            nuevoProyecto.nombre = nombre;
      }

      try {
            //Revisar el id
            let proyecto = await Proyecto.findById(req.params.id);

            //Si el proyecto existe
            if( !proyecto ) {
                 return res.status(404).json({ msg: 'Proyecto no encntrado' });
            }
            //Verificar el creeador del proyecto
            if(proyecto.creador.toString() !== req.usuario) {
              return res.status(401).json({ msg: 'No autrizado' });
            }

            //Actualizar

            proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto}, {new : true});
            res.json({proyecto});

      } catch ( error ) {
           console.log(error);
           res.status(500).send('Error en el servidor');
      }
}

//Elimina un proyecto por su id
exports.eliminarProyecto = async ( req, res ) => {
      try {
            //Revisar el id
            let proyecto = await Proyecto.findById(req.params.id);

            //Si el proyecto existe
            if( !proyecto ) {
                 return res.status(404).json({ msg: 'Proyecto no encntrado' });
            }
            //Verificar el creeador del proyecto
            if(proyecto.creador.toString() !== req.usuario) {
              return res.status(401).json({ msg: 'No autrizado' });
            }

           //elimnar el proyecto
           await Proyecto.findOneAndRemove({ _id: req.params.id });
           res.json({msg: 'Proyetco Eliminado'});

      } catch ( error ) {
           console.log(error);
           res.status(500).send('Error en el servidor');
      }
}
