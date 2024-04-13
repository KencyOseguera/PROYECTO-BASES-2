const http = require('http');//
const fs = require('fs');//

const sql = require('mssql');

// Configuración de la conexión a SQL Server
const config = {
    user: 'sa',
    password: '12345678',
    server: 'localhost', // Puede ser 'localhost' si es local
    database: 'ClassicModels',
    options:{
        encrypt:true,
        trustServerCertificate: true
    }
};


// Crear un servidor HTTP
const server = http.createServer(async (req, res) => {
     // Manejar la solicitud para la página principal
    if (req.url === '/' && req.method === 'GET') {
        // Leer el archivo HTML de index.html
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo HTML:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
                return;
            }

            // Enviar el HTML como respuesta al cliente
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Manejar la solicitud para seleccionar la tabla
    else if (req.url === '/seleccionar-tabla' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const parsedParams = new URLSearchParams(body);
            const tabla = parsedParams.get('tabla');
            // Redirigir al HTML de la tabla seleccionada
            res.writeHead(302, { 'Location': `/${tabla}` });
            res.end();
        });
    }

    
    
    // Manejar la solicitud para cada tabla+++++++
    else if (req.url.startsWith('/customers')) {
        try {
            // Conectar a SQL Server
            await sql.connect(config);

            // Ejecutar la consulta SQL para obtener los datos de la tabla Customers
            const result = await sql.query`SELECT * FROM Customers`;

            // Construir el contenido de la tabla HTML con los resultados
            let tableContent = `
                <h1>Tabla Customers</h1>
                <table>
                    <thead>
                        <tr>
                            ${Object.keys(result.recordset[0]).map(columnName => `<th>${columnName}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${result.recordset.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            `;

            // Enviar el contenido HTML como respuesta al cliente
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(tableContent);
        } catch (error) {
            console.error('Error al conectar a SQL Server o ejecutar la consulta:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        } finally {
            sql.close();
        }
    } else if (req.url.startsWith('/employees')) {
        try {
            // Conectar a SQL Server
            await sql.connect(config);

            // Ejecutar la consulta SQL para obtener los datos de la tabla Employees
            const result = await sql.query`SELECT * FROM Employees`;

            // Construir el contenido de la tabla HTML con los resultados
            let tableContent = `
                <h1>Tabla Employees</h1>
                <table>
                    <thead>
                        <tr>
                            ${Object.keys(result.recordset[0]).map(columnName => `<th>${columnName}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${result.recordset.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            `;

            // Enviar el contenido HTML como respuesta al cliente
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(tableContent);
        } catch (error) {
            console.error('Error al conectar a SQL Server o ejecutar la consulta:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error interno del servidor');
        } finally {
            sql.close();
        }
    } 
    // Manejar otras rutas
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página no encontrada');
    }
});

//PARA LA PAGINA INDEX



// Escuchar en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}/`);
});

// Función para conectar y ejecutar una consulta
/*async function conectarYConsultar() {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM payments`;
        console.log(result);
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
    } finally {
        sql.close();
    }
}

// Llamada a la función para conectar y consultar
conectarYConsultar();
*/

