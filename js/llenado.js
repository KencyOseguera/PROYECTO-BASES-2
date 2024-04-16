const db = require('mysql'); // Importa el módulo MySQL

// Función para insertar datos en una tabla de la base de datos OLTP
exports.insertarDatosOLTP = async (tabla, datos)=> {
    const connection = db.createConnection({
        host: 'localhost',
        user: 'usuario',
        password: 'contraseña',
        database: 'basededatos_oltp'
    });

    // Conectar a la base de datos
    connection.connect();

    // Sentencia SQL para insertar datos
    const sql = `INSERT INTO ${tabla} SET ?`;

    // Ejecutar la sentencia SQL con los datos proporcionados
    await connection.query(sql, datos);

    // Cerrar la conexión
    connection.end();
}

// Uso de la función para insertar datos en una tabla específica
/*const datosEjemplo = { campo1: 'valor1', campo2: 'valor2' };
insertarDatosOLTP('tabla_ejemplo', datosEjemplo);*/
