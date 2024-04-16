const db = require('mysql'); // Importa el módulo MySQL

// Función para borrar datos de una tabla en la base de datos OLTP
exports.borrarDatosOLTP = async (tabla) => {
    const connection = db.createConnection({
        host: 'localhost',
        user: 'usuario',
        password: 'contraseña',
        database: 'basededatos_oltp'
    });

    // Conectar a la base de datos
    connection.connect();

    // Sentencia SQL para borrar datos
    const sql = `DELETE FROM ${tabla}`;

    // Ejecutar la sentencia SQL
    await connection.query(sql);

    // Cerrar la conexión
    connection.end();
}

// Uso de la función para borrar datos de una tabla específica
//borrarDatosOLTP('tabla_ejemplo');
