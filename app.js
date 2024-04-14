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

    // Manejar la solicitud para la página de ETL
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


    // Manejar la solicitud para el archivo CSS
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

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}/`);
});
