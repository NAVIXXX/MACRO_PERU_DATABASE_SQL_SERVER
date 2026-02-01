const sql = require('mssql')
require('dotenv').config();

// condifguracion para el sql server

const config ={
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt:false,
        enableArithAbort: true
    },
    port: parseInt(process.env.DB_PORT)
};

//crear una conexion pool y exportaresto como una premisa

const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool =>{
    console.log('Conectado a la base de datos');
    return pool;
})
.catch(err =>{
    console.error('Falla en la conexion a la base de datos',err)
    throw err;
});

module.exports = {
    sql,
    poolPromise
};