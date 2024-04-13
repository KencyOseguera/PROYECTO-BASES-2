const http = require('http');
const fs = require('fs');
const { CustomersRequest } = require('./js/customers');
const { EmployeesRequest } = require('./js/employees');


const server = http.createServer((req, res) => {
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

    else if (req.url.startsWith('/customers')) {
        CustomersRequest(req, res);
    } else if (req.url.startsWith('/employees')) {
        EmployeesRequest(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página no encontrada');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}/`);
});
