const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tareas
exports.crearTarea = async ( req, res ) => {
      const errores = validationResult(req);
      if( !errores.isEmpty() ) {
            return res.status(400).json( { errores: errores.array() } );
      }


      //Extraer el proyecrto y commprobar si existe

      try {
           const { proyecto } = req.body;
           const proyectoExiste = await Proyecto.findById(proyecto);
           if( !proyectoExiste ) {
               return res.status(404).json({ msg : 'Proyecto no encontrado'});
           }

           //Revisar si el proyecto actual pertenece al proyecto autenticado
           if(proyectoExiste.creador.toString() !== req.usuario) {
             return res.status(401).json({ msg: 'No autrizado' });
           }

           //Crear la tareasconst tareas
           const tarea = new Tarea(req.body);
           await tarea.save();
           res.json({ tarea });
      } catch ( error ) {
           console.log(error);
           res.status(500).send('Hubo un error');
      }
}
//Obtienes las tareas por proyecto
exports.obtenerTareas = async ( req, res ) => {
     //
     try {
          const { proyecto } = req.query;
          console.log("Controller");
          console.log(req.query);
          const proyectoExiste = await Proyecto.findById(proyecto);
          if( !proyectoExiste ) {
              return res.status(404).json({ msg : 'Proyecto no encontrado'});
          }

          //Revisar si el proyecto actual pertenece al proyecto autenticado
          if(proyectoExiste.creador.toString() !== req.usuario) {
            return res.status(401).json({ msg: 'No autrizado' });
          }

          //Obtener las tareas por proyecto
          const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
          res.json({ tareas});
    } catch (error ) {
         console.log(error);
         res.status(500).send('Hubo un error');
    }

}

exports.actualizarTarea = async ( req, res ) => {
     try {
         const { proyecto, nombre, estado } = req.body;
         let tarea = await Tarea.findById(req.params.id);

         if(!tarea) {
              return res.status(404).json({ msg: 'No existe esa Tarea' });
         }


         const proyectoExiste = await Proyecto.findById(proyecto);



         //Revisar si el proyecto actual pertenece al proyecto autenticado
         if(proyectoExiste.creador.toString() !== req.usuario) {
           return res.status(401).json({ msg: 'No autrizado' });
         }

         //Cerar un objeto con la nueva informacion

         const nuevaTarea = {};
         nuevaTarea.nombre = nombre;
         nuevaTarea.estado = estado;

         //Guardar tarea

         tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, nuevaTarea, { new: true});
         res.json({ tarea });


     } catch( error ) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }
}

exports.eliminarTarea = async ( req, res ) => {
  try {
      const { proyecto } = req.query;
      let tarea = await Tarea.findById(req.params.id);

      if(!tarea) {
           return res.status(404).json({ msg: 'No existe esa Tarea' });
      }


      const proyectoExiste = await Proyecto.findById(proyecto);



      //Revisar si el proyecto actual pertenece al proyecto autenticado
      if(proyectoExiste.creador.toString() !== req.usuario) {
        return res.status(401).json({ msg: 'No autrizado' });
      }

      //eliminarTarea
      await Tarea.findOneAndRemove({_id: req.params.id});
      res.json({msg: 'Tarea Eliminada'});


  } catch( error ) {
      console.log(error);
      res.status(500).send('Hubo un error');
  }
}
