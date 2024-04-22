const express = require('express');
const router = express.Router();


const {
    ejecutarConsultaSQL, extraerDatos, 
    concatenarValores, obtenerParteFechaHora,
    convertirAMayuscula,convertirAMinuscula,
    cargarDatosOLAP,
    BorrarDatos,
    transformarDatos,
    CargarHechos
} = require('./llenado-elt'); // Importar las funciones del controlador


router.post('/llenarTablaHechos', async (req, res) => {
    try {
        const nombreProcedimiento = 'LlenarTablaOLAPHechos';
        const resultado = await controller.ejecutarProcedimientoAlmacenado(nombreProcedimiento);
        res.status(200).json({ message: 'Procedimiento ejecutado correctamente', resultado });
    } catch (error) {
        res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado', error: error.message });
    }
});


// ruta para extraer datos de origen
router.post('/extraerDatos', async (req, res) => {
    const { tablaOrigen, camposSeleccionados } = req.body;
    try {
        const datosExtraidos = await extraerDatos(tablaOrigen, camposSeleccionados);
        res.json({ datos: datosExtraidos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/borrarDatosOLAP', async (req, res) => {
    const { tablaDestino } = req.body; // Obtén el nombre de la tabla de destino desde la solicitud

    try {
        const resultadoBorrar = await BorrarDatos(tablaDestino); // Llama a la función BorrarDatos con el nombre de la tabla de destino
        res.json({ resultadoBorrar }); // Devuelve el resultado de la operación de borrado
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar datos en la tabla de destino OLAP.', message: error.message });
    }
});

//ruta para crear una consulta dinamica
router.post('/consulta-dinamica', async (req, res) => {
    const { consultaSQL } = req.body;
    try {
        // Aquí llamas a tu función de validación y ejecución de la consulta SQL dinámica
        const resultados = await ejecutarConsultaSQL(consultaSQL);
        res.json({ data: resultados });
    } catch (error) {
        res.status(500).json({ error: 'Error al ejecutar la consulta SQL dinámica' });
    }
});

// Ruta para convertir un campo a minúscula
router.post('/transformarmin', async (req, res) => {
    const { campo } = req.body;
    try {
        const resultado = await convertirAMinuscula(campo); // Llama a la función de transformación
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para convertir un campo a mayúscula
router.post('/transformarmayus', async (req, res) => {
    const { campo } = req.body;
    try {
        const resultado = await convertirAMayuscula(campo); // Llama a la función de transformación
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error:  'Error al procesar la transformación' });
    }
});

//ruta para concatenar 
router.post('/concatenar', async (req, res) => {
    const { campo } = req.body;
    try {
        const resultado = await concatenarValores(campo); // Llama a la función de transformación
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//ruta para obtener parte de una fecha
router.post('/obtenerfecha', async (req, res) => {
    const { valor, parte } = req.body;
    try {
        const resultado = await obtenerParteFechaHora( valor, parte ); // Llama a la función de transformación
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// identifica registros nuevos actualizados
router.post('/cargarDatos', async (req, res) => {
    const {tablaDestino, datosOrigen } = req.body;

    try {
        // Llama a la función para identificar registros nuevos o actualizados
        await identificarRegistrosNuevosActualizados(tablaDestino,datosOrigen);
        
        res.status(200).json({ message: 'Proceso de carga finalizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el proceso de carga', message: error.message });
    }
});

// Ruta para cargar datos en la tabla de destino OLAP
router.post('/cargarDatosOLAP', async (req, res) => {
    const { tablaDestino,camposInsertar,datosTransformados } = req.body; // Extraer nombre de tabla y datos transformados

    try {
        // Validar que se proporcionen la tabla de destino y los datos transformados
        if (!tablaDestino || !datosTransformados || datosTransformados.length === 0) {
            throw new Error('Debe proporcionar la tabla de destino y datos transformados válidos.');
        }

        console.log('Datos recibidos para cargar en la tabla de destino OLAP:', tablaDestino, datosTransformados); // Registro para depuración

        await cargarDatosOLAP(tablaDestino,camposInsertar,datosTransformados);
        res.json({ message: 'Datos cargados en la tabla de destino OLAP correctamente.' });
    } catch (error) {
        console.error('Error al cargar datos en la tabla de destino OLAP:', error.message); // Registro de error en consola
        res.status(500).json({ error: 'Error al cargar datos en la tabla de destino OLAP.', message: error.message });
    }
});



router.post('/extraerYTransformarDatos', async (req, res) => {
    const { tablaOrigen, camposSeleccionados, transformacionesPorCampo } = req.body;

    try {
        // Llamar a la función extraerDatos para obtener los datos de la tabla de origen
        const datosExtraidos = await extraerDatos(tablaOrigen, camposSeleccionados);

        // Llamar a la función transformarDatos para aplicar las transformaciones a los datos extraídos
        const datosTransformados = await transformarDatos(datosExtraidos, transformacionesPorCampo);

        res.json({ datosTransformados });
    } catch (error) {
        res.status(500).json({ error: 'Error al extraer y transformar datos.', message: error.message });
    }
});


// Ruta para obtener los datos de la tabla productline en OLAP
router.get('/obtenertablaHechos', async (req, res) => {
    
    try {
        // Llama a la función obtenerDatosTablaOLAP con el nombre de la tabla como parámetro
        const datosTablaOLAP = await CargarHechos();
        res.status(200).json(datosTablaOLAP);
    } catch (error) {
        console.error(`Error al obtener los datos de la tabla ${tabla} en OLAP:`, error);
        res.status(500).json({ message: `Error al obtener los datos de la tabla ${tabla} en OLAP`, error: error.message });
    }
});


module.exports = router;
