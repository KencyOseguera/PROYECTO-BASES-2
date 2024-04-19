const express = require('express');
const router = express.Router();

const {
    llenarTablaCustomersOLAP,
    obtenerDatosTablaCustomersOLAP,
    obtenerDatosEmployeesOLAP,
    llenarEmployeesOLAP 
} = require('./llenado-elt'); // Importar las funciones del controlador



// Ruta para llenar la tabla CUSTOMERS en OLAP
router.post('/llenarTablaOLAP', async (req, res) => {
    const datos = req.body;
    try {
        await llenarTablaCustomersOLAP(datos);
        res.json({ message: 'Tabla CUSTOMERS en OLAP llenada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al llenar la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

// Ruta para obtener los datos de la tabla CUSTOMERS en OLAP
router.get('/obtenerTablaCustomersOLAP', async (req, res) => {
    try {
        const datosTablaCustomersOLAP = await obtenerDatosTablaCustomersOLAP();
        res.status(200).json(datosTablaCustomersOLAP);
    } catch (error) {
        console.error('Error al obtener los datos de la tabla CUSTOMERS en OLAP:', error);
        res.status(500).json({ message: 'Error al obtener los datos de la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

// Ruta para llenar la tabla EMPLOYEES en OLAP
router.post('/llenarTablaOLAPEMP', async (req, res) => {
    const datos = req.body;
    try {
        await llenarEmployeesOLAP(datos);
        res.json({ message: 'Tabla CUSTOMERS en OLAP llenada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al llenar la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

// Ruta para obtener los datos de la tabla EMPLOYEES en OLAP
router.get('/obtenerTablaEMPOLAP', async (req, res) => {
    try {
        const datosTablaCustomersOLAP = await obtenerDatosEmployeesOLAP();
        res.status(200).json(datosTablaCustomersOLAP);
    } catch (error) {
        console.error('Error al obtener los datos de la tabla CUSTOMERS en OLAP:', error);
        res.status(500).json({ message: 'Error al obtener los datos de la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

module.exports = router;
