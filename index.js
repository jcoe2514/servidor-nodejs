const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();
//Habilitar cors
app.use(cors());

// Habilitar express.json
app.use( express.json({ extended: true }) );


// PUERTO DE LA APP
const PORT = process.env.PORT || 4000;

//IMportar rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));




app.listen(PORT, () => {
     console.log(`El servidor funciona en el puerto ${PORT}`)
});