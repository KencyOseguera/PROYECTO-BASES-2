const sql = require('mssql');

// Configuración de conexión para OLTP
const configOLTP = {
    user: 'admin',
    password: 'administrador',
    server: 'localhost',
    port: 1433, 
    database: 'ClassicModels',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Configuración de conexión para OLAP
const configOLAP = {
    user: 'admin',
    password: 'administrador',
    port: 1433, 
    server: 'localhost',
    database: 'OLAP_CLASSICMODELS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};



const llenarTablaCustomersOLAP = async () => {
    try {
        await sql.connect(configOLAP);
        const request = new sql.Request();
        await request.execute('LlenarTablaOLAPCustommers');
        console.log('Procedimiento almacenado ejecutado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
    } finally {
        sql.close();
    }
};

const llenarEmployeesOLAP = async () => {
    try {
        await sql.connect(configOLAP);
        const request = new sql.Request();
        await request.execute('LlenarTablaOLAPEmployees');
        console.log('Procedimiento almacenado ejecutado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
    } finally {
        sql.close();
    }
};

const obtenerDatosTablaCustomersOLAP = async () => {
    let pool;
    try {
        pool = await sql.connect(configOLAP);
        const result = await pool.request().query(`
            SELECT CUSTOMERNUMBER, CUSTOMERNAME, NOMBRE_CONTACTO_CUSTOMER, CITY, COUNTRY
            FROM CUSTOMERS;
        `);
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener datos de la tabla CUSTOMERS en OLAP:', error);
        throw error;
    } finally {
        if (pool) await pool.close();
    }
};

const obtenerDatosEmployeesOLAP = async () => {
    let pool;
    try {
        pool = await sql.connect(configOLAP);
        const result = await pool.request().query(`
            SELECT EMPLOYEENUMBER, NOMBRE_EMPLOYEE, OFFICECODE
            FROM EMPLOYEES;
        `);
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener datos de la tabla CUSTOMERS en OLAP:', error);
        throw error;
    } finally {
        if (pool) await pool.close();
    }
};

module.exports = {
      llenarTablaCustomersOLAP,
      obtenerDatosTablaCustomersOLAP,
      obtenerDatosEmployeesOLAP,
      llenarEmployeesOLAP 


};





