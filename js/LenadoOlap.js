const sql = require('mssql');

// Configuración de la conexión a la base de datos OLAP
const config = {
    user: 'usuario',
    password: 'contraseña',
    server: 'localhost',
    database: 'OLAP_CLASSICMODELS',
    options: {
        encrypt: true, // En caso de utilizar conexiones encriptadas
        enableArithAbort: true // Habilitar aritmética abortiva para evitar errores de aritmética
    }
};

// Función para llenar la tabla CUSTOMERS en OLAP desde la tabla correspondiente en OLTP
async function llenarTablaCustomersOLAP() {
    try {
        // Conectar a la base de datos OLAP
        await sql.connect(config);

        // Consulta SQL para llenar la tabla CUSTOMERS en OLAP desde la tabla OLTP
        const query = `
            INSERT INTO CUSTOMERS (CUSTOMERNUMBER, CUSTOMERNAME, NOMBRE_CONTACTO_CUSTOMER, CITY, COUNTRY)
            SELECT CUSTOMERNUMBER, customerName, CONCAT(contactFirstName, ' ', contactLastName) AS NOMBRE_CONTACTO_CUSTOMER, city, country
            FROM ClassicModels.dbo.customers;
        `;

        // Ejecutar la consulta SQL
        await sql.query(query);
        console.log('Tabla CUSTOMERS en OLAP llenada correctamente.');
    } catch (error) {
        console.error('Error al llenar la tabla CUSTOMERS en OLAP:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await sql.close();
    }
}

// Llamar a la función para llenar la tabla CUSTOMERS en OLAP
llenarTablaCustomersOLAP();

//Lógica de Llenado de la Tabla EMPLOYEES en OLAP:

// Función para llenar la tabla EMPLOYEES en OLAP desde la tabla correspondiente en OLTP
async function llenarTablaEmployeesOLAP() {
    try {
        // Conectar a la base de datos OLAP
        await sql.connect(config);

        // Consulta SQL para llenar la tabla EMPLOYEES en OLAP desde la tabla OLTP
        const query = `
            INSERT INTO EMPLOYEES (EMPLOYEENUMBER, NOMBRE_EMPLOYEE, OFFICECODE)
            SELECT employeeNumber, CONCAT(firstName, ' ', lastName) AS NOMBRE_EMPLOYEE, officeCode
            FROM ClassicModels.dbo.employees;
        `;

        // Ejecutar la consulta SQL
        await sql.query(query);
        console.log('Tabla EMPLOYEES en OLAP llenada correctamente.');
    } catch (error) {
        console.error('Error al llenar la tabla EMPLOYEES en OLAP:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await sql.close();
    }
}

// Llamar a la función para llenar la tabla EMPLOYEES en OLAP
llenarTablaEmployeesOLAP();


