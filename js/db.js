// Configuración de conexión para OLTP
const configOLTP = {
    user: 'usuarioOLTP',
    password: 'contraseñaOLTP',
    server: 'localhost',
    database: 'nombreOLTP',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Configuración de conexión para OLAP
const configOLAP = {
    user: 'usuarioOLAP',
    password: 'contraseñaOLAP',
    server: 'localhost',
    database: 'nombreOLAP',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = {
    configOLTP,
    configOLAP
};
