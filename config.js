// Configuración de la conexión a SQL Server
module.exports = {
    user: 'sa',
    password: '12345678',
    server: 'localhost', // Puede ser 'localhost' si es local
    database: 'ClassicModels',
    options:{
        encrypt:true,
        trustServerCertificate: true
    }
};