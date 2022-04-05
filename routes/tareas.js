const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear una tareas
///apiT/atreas
router.post('/',
      auth,
      [
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('proyecto', 'El Proyecto es obligatorio').not().isEmpty()
      ],
      tareaController.crearTarea
);

//Obtener tarea por proyecto
router.get('/',
     auth,
     tareaController.obtenerTareas
);

//Obtener tarea por proyecto
router.put('/:id',
     auth,
     tareaController.actualizarTarea
);

router.delete('/:id',
     auth,
     tareaController.eliminarTarea
);
module.exports = router;
