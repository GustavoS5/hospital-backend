require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Directorio público
app.use(express.static('public'));

//Rutas
//Ruta de Usuarios
app.use('/api/usuarios', require('./routes/usuarios'));

//Ruta de hospitales
app.use('/api/hospitales', require('./routes/hospitales'));

//Ruta de médicos
app.use('/api/medicos', require('./routes/medicos'));

//Ruta de Login
app.use('/api/login', require('./routes/auth'));

//Ruta de busqueda
app.use('/api/todo', require('./routes/busquedas'));

//Ruta de Upload
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
