const http = require('http');
const fs = require('fs');

const path = require('path');

const { CustomersRequest } = require('./js/customers');
const { EmployeesRequest } = require('./js/employees');
const { ProductsRequest } = require('./js/products');
const { PaymentsRequest } = require('./js/payments');
const { OfficesRequest } = require('./js/offices');
const { OrderDetailsRequest } = require('./js/orderDetails');
const { OrdersRequest } = require('./js/orders');
const { ProductlineRequest } = require('./js/productline');


const server = http.createServer((req, res) => {
     // Función para servir archivos estáticos para que funcionen los css en el html
    const serveStaticFile = (filePath, contentType) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    }; 
    
    
    // Manejar la solicitud para la página principal index.html
    if (req.url === '/' && req.method === 'GET') {
        // Leer el archivo HTML de index.html
        fs.readFile('home.html', 'utf8', (err, data) => {
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

    // Manejar la solicitud para la página principal index.html
    else if (req.url === '/index' && req.method === 'GET') {
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
    
    // Manejar la solicitud para seleccionar la tabla, elegir que tabla ver
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


    /*PARA EL ETL */
    // Solicitud para la página de ETL mostrarla
    else if (req.url === '/etl' && req.method === 'GET') {
        // Leer el archivo HTML de la página de ETL
        fs.readFile('etl.html', 'utf8', (err, data) => {
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

    // Manejar la solicitud para realizar el ETL
    else if (req.url === '/realizar-etl' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { tablaOrigen, tablaDestino, consultaOrigen, camposExtraccion } = new URLSearchParams(body);

            try {
                // Conectar a SQL Server
                await sql.connect(config);

                // Ejecutar la consulta de origen o la consulta indicada
                const query = consultaOrigen ? consultaOrigen : `SELECT ${camposExtraccion} FROM ${tablaOrigen}`;
                const result = await sql.query(query);

                // Procesar los datos y cargarlos en la tabla destino
                // Aquí implementa la lógica para la transformación y carga de datos

                // Enviar mensaje de éxito al cliente
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Proceso ETL completado con éxito');
            } catch (error) {
                console.error('Error al conectar a SQL Server o ejecutar la consulta:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } finally {
                sql.close();
            }
        });
    }

    /*FIN ETL */

    // Solicitud para el archivo CSS
    else if (req.url.endsWith('.css') && req.method === 'GET') {
        const cssPath = path.join(__dirname, req.url);
        serveStaticFile(cssPath, 'text/css');
    }

    //Para archivos individuales de js
    else if (req.url.startsWith('/customers')) {
        CustomersRequest(req, res);
    } else if (req.url.startsWith('/employees')) {
        EmployeesRequest(req, res);
    } else if (req.url.startsWith('/products')) {
        ProductsRequest(req, res);
    } else if (req.url.startsWith('/payments')) {
        PaymentsRequest(req, res);
    } else if (req.url.startsWith('/offices')) {
        OfficesRequest(req, res);
    } else if (req.url.startsWith('/orderDetails')) {
        OrderDetailsRequest(req, res);
    } else if (req.url.startsWith('/orders')) {
        OrdersRequest(req, res);
    } else if (req.url.startsWith('/productline')) {
        ProductlineRequest(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página no encontrada');
    }
});

app.post('/realizar-etl', async (req, res) => {
    const { tablaOrigen, tablaDestino } = req.body;

    try {
        await sql.connect(config);

        let query = '';

        if (tablaDestino === 'CUSTOMERS') {
            query = `
                INSERT INTO CUSTOMERS (CUSTOMERNUMBER, CUSTOMERNAME, NOMBRE_CONTACTO_CUSTOMER, CITY, COUNTRY)
                SELECT CUSTOMERNUMBER, customerName, CONCAT(contactFirstName, ' ', contactLastName) AS NOMBRE_CONTACTO_CUSTOMER, city, country
                FROM ClassicModels.dbo.customers;
            `;
        } else if (tablaDestino === 'EMPLOYEES') {
            query = `
                INSERT INTO EMPLOYEES (EMPLOYEENUMBER, NOMBRE_EMPLOYEE, OFFICECODE)
                SELECT employeeNumber, CONCAT(firstName, ' ', lastName) AS NOMBRE_EMPLOYEE, officeCode
                FROM ClassicModels.dbo.employees;
            `;
        }

        await sql.query(query);
        console.log(`Tabla ${tablaDestino} en OLAP llenada correctamente.`);
        res.sendStatus(200);
    } catch (error) {
        console.error(`Error al llenar la tabla ${tablaDestino} en OLAP:`, error);
        res.sendStatus(500);
    } finally {
        await sql.close();
    }
});



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}/`);
});
