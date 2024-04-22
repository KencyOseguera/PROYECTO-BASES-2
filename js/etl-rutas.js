const express = require('express');
const router = express.Router();


const {
    ejecutarConsultaSQL, extraerDatos, 
    concatenarValores, obtenerParteFechaHora,
    convertirAMayuscula,convertirAMinuscula,
    identificarRegistrosNuevosActualizados,
    cargarDatosOLAP,
    ejecutarTransformacion,
    transformarDatos
} = require('./llenado-elt'); // Importar las funciones del controlador


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

/*
const concatenarValor = (campo, valorAConcatenar) => {
    return campo + valorAConcatenar;
  };
  
  // Función para obtener parte de una fecha
  const obtenerParteFecha = (fecha, parte) => {
    const date = new Date(fecha);
    switch (parte) {
      case 'mes':
        return date.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11 en JavaScript
      case 'ano':
        return date.getFullYear();
      case 'dia':
        return date.getDate();
      case 'semana':
        // Obtener el número de semana del año
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000; // 86400000 = 24 horas * 60 minutos * 60 segundos * 1000 milisegundos
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      default:
        throw new Error('Parte de fecha no válida');
    }
  };
  
  // Definir la ruta para procesar las transformaciones de campos
  router.post('/transformarCampos', (req, res) => {
    // Obtener las transformaciones enviadas desde el cliente
    const { transformaciones } = req.body;
  
    try {
      // Aquí puedes implementar la lógica para procesar cada transformación
      const resultadosTransformaciones = transformaciones.map(({ campo, tipoTransformacion, valorConcatenar, parteFecha }) => {
        // Implementar la lógica de transformación para cada tipo
        switch (tipoTransformacion) {
          case 'minusculas':
            return { campo, resultado: campo.toLowerCase() };
          case 'mayusculas':
            return { campo, resultado: campo.toUpperCase() };
          case 'concatenar':
            return { campo, resultado: concatenarValor(campo, valorConcatenar) };
          case 'obtenerfecha':
            return { campo, resultado: obtenerParteFecha(campo, parteFecha) };
          default:
            throw new Error(`Tipo de transformación no válido para el campo ${campo}`);
        }
      });
  
      // Devolver los resultados de las transformaciones al cliente
      res.json({ resultadosTransformaciones });
    } catch (error) {
      // En caso de error, devolver un mensaje de error al cliente
      res.status(500).json({ error: error.message });
    }
  });



/*
router.post('/ejecutarProcedimiento', async (req, res) => {  // Usa la misma ruta en el backend
    const datos = req.body;
    try {
        await llenarTablaOLAP(datos.tablaDestino, datos.campos, datos.camposDestino);  // Ajusta la llamada según tus parámetros
        res.json({ message: 'Procedimiento ejecutado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado', error: error.message });
    }
});

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


router.post('/llenarTablaTiempo', async (req, res) => {
    const { campos, operaciones } = req.body;

    try {
        if (!campos || !operaciones) {
            return res.status(400).json({ error: 'Falta información necesaria para ejecutar el procedimiento.' });
        }

        await llenarTablaTiempoOlAP(campos, operaciones);
        return res.status(200).json({ message: 'Procedimiento de llenado de tabla tiempo ejecutado correctamente.' });
    } catch (error) {
        console.error('Error al ejecutar el procedimiento de llenado de tabla tiempo:', error);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento de llenado de tabla tiempo.' });
    }
});


router.get('/obtenertabla/:tabla', async (req, res) => {
    const { tabla } = req.params; // Obtiene el nombre de la tabla desde la URL

    try {
        // Llama a la función obtenerDatosTablaOLAP con el nombre de la tabla como parámetro
        const datosTablaOLAP = await obtenerDatosTablaOLAP(tabla);
        res.status(200).json(datosTablaOLAP);
    } catch (error) {
        console.error(`Error al obtener los datos de la tabla ${tabla} en OLAP:`, error);
        res.status(500).json({ message: `Error al obtener los datos de la tabla ${tabla} en OLAP`, error: error.message });
    }
});


/*
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


// Ruta para llenar la tabla products en OLAP
router.post('/llenarTablaOLAPPrd', async (req, res) => {
    const datos = req.body;
    try {
        await llenarProductsOLAP(datos);
        res.json({ message: 'Tabla Products en OLAP llenada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al llenar la tabla CUSTOMERS en OLAP', error: error.message });
    }
});


// Ruta para llenar la tabla productline en OLAP
router.post('/llenarTablaOLAPPrd', async (req, res) => {
    const datos = req.body;
    try {
        await llenarProductsLineOLAP(datos);
        res.json({ message: 'Tabla Products en OLAP llenada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al llenar la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

// Ruta para llenar la tabla productline en OLAP
router.post('/llenarTablaOLATiempo', async (req, res) => {
    const datos = req.body;
    try {
        await llenarTiempoOLAP(datos);
        res.json({ message: 'Tabla Products en OLAP llenada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al llenar la tabla CUSTOMERS en OLAP', error: error.message });
    }
});

// Ruta para obtener los datos de la tabla productline en OLAP
router.get('/obtenertabla/:tabla', async (req, res) => {
    const { tabla } = req.params; // Obtiene el nombre de la tabla desde la URL

    try {
        // Llama a la función obtenerDatosTablaOLAP con el nombre de la tabla como parámetro
        const datosTablaOLAP = await obtenerDatosTablaOLAP(tabla);
        res.status(200).json(datosTablaOLAP);
    } catch (error) {
        console.error(`Error al obtener los datos de la tabla ${tabla} en OLAP:`, error);
        res.status(500).json({ message: `Error al obtener los datos de la tabla ${tabla} en OLAP`, error: error.message });
    }
});
*/

module.exports = router;
