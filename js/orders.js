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

async function OrdersRequest(req, res) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM orders`;
        let tableContent = `
            <h1>Tabla Orders</h1>
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

module.exports = {
    OrdersRequest
};