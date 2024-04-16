const pg = require('mysql');

// Función para insertar datos en una tabla de la base de datos OLAP
exports.insertarDatosOLAP= async (tabla, datos)=> {
    const pool = new pg.Pool({
        user: 'usuario',
        host: 'localhost',
        database: 'basededatos_olap',
        password: 'contraseña',
        port: 5432 // Puerto por defecto de PostgreSQL
    });

    // Conectar al pool de conexiones
    const client = await pool.connect();

    try {
        // Sentencia SQL para insertar datos
        const sql = `INSERT INTO ${tabla} VALUES ($1, $2, $3)`; // Aquí  valores a insertar

        // Ejecutar la sentencia SQL 
        await client.query(sql, datos);
    } finally {
        // Liberar el cliente del pool de conexiones
        client.release();
    }
}

// Uso de la función para insertar datos en una tabla específica
/*const datosEjemplo = [valor1, valor2, valor3]; // Ejemplo de datos a insertar
await insertarDatosOLAP('tabla_ejemplo', datosEjemplo);*/
