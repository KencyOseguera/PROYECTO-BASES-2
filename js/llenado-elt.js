const sql = require('mssql');

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

// Configuración de conexión para OLAP
const configOLTP = {
    user: 'admin',
    password: 'administrador',
    port: 1433, 
    server: 'localhost',
    database: 'ClasiccModels',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const extraerDatos = async (tablaOrigen, camposSeleccionados) => {
    try {
        await sql.connect(configOLAP); // Conexión a la base de datos
        const request = new sql.Request();
        const campos = camposSeleccionados.join(', '); // Convertir los campos seleccionados en una cadena separada por comas
        const query = `SELECT ${campos} FROM ClassicModels.dbo.${tablaOrigen}`; // Consulta SQL dinámica
        console.log('Consulta SQL generada:', query);
        const result = await request.query(query); // Ejecutar la consulta
        return result.recordset; // Retornar los datos extraídos
    } catch (error) {
        throw new Error(`Error al extraer datos de ${tablaOrigen}: ${error.message}`);
    } finally {
        sql.close();
    }
};



// Función para validar y ejecutar la consulta SQL
const ejecutarConsultaSQL = async (consultaSQL) => {
    try {
        // Conecta a la base de datos usando la configuración definida
        await sql.connect(configOLTP);

        // Valida que la consulta SQL no esté vacía
        if (!consultaSQL) {
            throw new Error('La consulta SQL no puede estar vacía');
        }

        // Ejecuta la consulta SQL ingresada por el usuario
        const resultado = await sql.query(consultaSQL);

        // Cierra la conexión a la base de datos
        await sql.close();

        // Devuelve el resultado de la consulta
        return resultado.recordset;
    } catch (error) {
        // En caso de error, cierra la conexión y devuelve el error
        await sql.close();
        throw new Error('Error al ejecutar la consulta SQL: ' + error.message);
    }
};




// Función para convertir un valor a minúscula
const convertirAMinuscula = (valor) => {
    return valor.toLowerCase();
};

// Función para convertir un valor a mayúscula
const convertirAMayuscula = (valor) => {
    try {
        return valor.toUpperCase();
    } catch (error) {
        throw new Error('Error al convertir a mayúsculas');
    }
};
// Función para obtener partes de una fecha/hora (ejemplo: mes, día, año, hora)
const obtenerParteFechaHora = (valor, parte) => {
    const fecha = new Date(valor);
    switch (parte) {
        case 'mes':
            return fecha.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript
        case 'dia':
            return fecha.getDate();
        case 'año':
            return fecha.getFullYear();
        case 'hora':
            return fecha.getHours();
        default:
            return null;
    }
};

// Función para concatenar un valor con otro valor
const concatenarValores = (valor1, valor2) => {
    return valor1 + ' ' + valor2;
};

// Función para identificar registros nuevos o actualizados
const identificarRegistrosNuevosActualizados = async (datosOrigen) => {
    try {
        await sql.connect(configOLTP);
        
        // Itera sobre los datos de origen para identificar nuevos o actualizados
        for (const dato of datosOrigen) {
            const id = dato.ID;

            // Verifica si el registro existe en la tabla de destino
            const consultaExistencia = `SELECT COUNT(*) AS count FROM TablaDestino WHERE ID = @id`;
            const resultExistencia = await sql.query(consultaExistencia, { id });

            const existeRegistro = resultExistencia.recordset[0].count > 0;

            if (existeRegistro) {
                // Si existe, se actualiza en la tabla de destino
                const consultaActualizacion = `UPDATE TablaDestino SET Campo1 = @campo1, Campo2 = @campo2 WHERE ID = @id`;
                await sql.query(consultaActualizacion, { id, campo1: dato.Campo1, campo2: dato.Campo2 });
            } else {
                // Si no existe, se inserta como nuevo registro
                const consultaInsercion = `INSERT INTO TablaDestino (ID, Campo1, Campo2) VALUES (@id, @campo1, @campo2)`;
                await sql.query(consultaInsercion, { id, campo1: dato.Campo1, campo2: dato.Campo2 });
            }
        }

        await sql.close();
        console.log('Proceso de carga finalizado.');
    } catch (error) {
        await sql.close();
        throw new Error('Error en el proceso de carga: ' + error.message);
    }
};

/*
const cargarDatosOLAP = async (tablaDestino, camposInsertar, datosTransformados) => {
    try {
        // Conecta a la base de datos OLAP usando la configuración definida
        await sql.connect(configOLAP);

        // Verificar que camposInsertar sea un array válido
        if (!Array.isArray(camposInsertar) || camposInsertar.length === 0) {
            throw new Error('No se han seleccionado campos válidos para insertar en la tabla de destino OLAP.');
        }

        // Verificar que hay datos para cargar
        if (!datosTransformados || datosTransformados.length === 0) {
            throw new Error('No hay datos para cargar en la tabla de destino OLAP.');
        }

        // Obtener nombres de campos dinámicamente del primer objeto de datos
        const campos = Object.keys(datosTransformados[0]);

        // Iterar sobre los datos transformados para insertarlos en la tabla de destino
        for (const dato of datosTransformados) {
            // Verificar campos requeridos antes de la inserción
            if (campos.some(campo => !dato[campo])) {
                throw new Error('Faltan campos requeridos en los datos a cargar en la tabla de destino OLAP.');
            }

            // Construir la consulta SQL INSERT dinámicamente
            const valores = campos.map(campo => typeof dato[campo] === 'string' ? `'${dato[campo]}'` : dato[campo]).join(', ');
            const sqlQuery = `INSERT INTO ${tablaDestino} (${camposInsertar.join(', ')}) VALUES (${valores})`;

            // Ejecutar la consulta SQL INSERT para cada registro
            await sql.query(sqlQuery);
        }

        // Cierra la conexión a la base de datos OLAP
        await sql.close();

        console.log('Datos cargados en la tabla de destino OLAP correctamente.');
    } catch (error) {
        // En caso de error, cierra la conexión y muestra el mensaje de error
        await sql.close();
        console.error('Error al cargar datos en la tabla de destino OLAP:', error.message);
        throw new Error('Error al cargar datos en la tabla de destino OLAP: ' + error.message);
    }
};
*/
/*
const cargarDatosOLAP = async (tablaDestino, camposInsertar, datosTransformados) => {
    try {
        // Conecta a la base de datos OLAP usando la configuración definida
        await sql.connect(configOLAP);

        // Verificar que camposInsertar sea un array válido
        if (!Array.isArray(camposInsertar) || camposInsertar.length === 0) {
            throw new Error('No se han seleccionado campos válidos para insertar en la tabla de destino OLAP.');
        }

        // Verificar que hay datos para cargar
        if (!datosTransformados || datosTransformados.length === 0) {
            throw new Error('No hay datos para cargar en la tabla de destino OLAP.');
        }

        // Iterar sobre los datos transformados para insertarlos en la tabla de destino
        for (const dato of datosTransformados) {
            // Verificar campos requeridos antes de la inserción
            if (camposInsertar.includes('customer name')) {
                // Concatenar "customer first name" y "customer last name" si se va a insertar en "customer name"
                dato['customer name'] = `${dato['customer first name']} ${dato['customer last name']}`;
            }

            // Construir la consulta SQL INSERT dinámicamente
            const valores = camposInsertar.map(campo => typeof dato[campo] === 'string' ? `'${dato[campo]}'` : dato[campo]).join(', ');
            const sqlQuery = `INSERT INTO ${tablaDestino} (${camposInsertar.join(', ')}) VALUES (${valores})`;


            console.log('Consulta SQL generada:', sqlQuery);
            // Ejecutar la consulta SQL INSERT para cada registro
            await sql.query(sqlQuery);
        }

        // Cierra la conexión a la base de datos OLAP
        await sql.close();

        console.log('Datos cargados en la tabla de destino OLAP correctamente.');
    } catch (error) {
        // En caso de error, cierra la conexión y muestra el mensaje de error
        await sql.close();
        console.error('Error al cargar datos en la tabla de destino OLAP:', error.message);
        throw new Error('Error al cargar datos en la tabla de destino OLAP: ' + error.message);
    }
};
*/
const cargarDatosOLAP = async (tablaDestino, camposInsertar, datosTransformados) => {
    try {
        // Conecta a la base de datos OLAP usando la configuración definida
        await sql.connect(configOLAP);

        // Verificar que camposInsertar sea un array válido
        if (!Array.isArray(camposInsertar) || camposInsertar.length === 0) {
            throw new Error('No se han seleccionado campos válidos para insertar en la tabla de destino OLAP.');
        }

        // Verificar que hay datos para cargar
        if (!datosTransformados || datosTransformados.length === 0) {
            throw new Error('No hay datos para cargar en la tabla de destino OLAP.');
        }

        // Obtener nombres de campos dinámicamente del primer objeto de datos
        const campos = Object.keys(datosTransformados[0]);

        // Iterar sobre los datos transformados para insertarlos en la tabla de destino
        for (const dato of datosTransformados) {
            // Verificar campos requeridos antes de la inserción
            if (campos.some(campo => !dato[campo])) {
                throw new Error('Faltan campos requeridos en los datos a cargar en la tabla de destino OLAP.');
            }

            // Construir la consulta SQL INSERT dinámicamente
            const valores = campos.map(campo => typeof dato[campo] === 'string' ? `'${dato[campo]}'` : dato[campo]).join(', ');
            const sqlQuery = `INSERT INTO ${tablaDestino} (${camposInsertar.join(', ')}) VALUES (${valores})`;

            // Ejecutar la consulta SQL INSERT para cada registro
            await sql.query(sqlQuery);
        }

        // Cierra la conexión a la base de datos OLAP
        await sql.close();

        console.log('Datos cargados en la tabla de destino OLAP correctamente.');
    } catch (error) {
        // En caso de error, cierra la conexión y muestra el mensaje de error
        await sql.close();
        console.error('Error al cargar datos en la tabla de destino OLAP:', error.message);
        throw new Error('Error al cargar datos en la tabla de destino OLAP: ' + error.message);
    }
};

/*
const cargarDatosOLAP = async (tablaDestino, camposInsertar, datosTransformados) => {
    try {
        // Conecta a la base de datos OLAP usando la configuración definida
        await sql.connect(configOLAP);

        // Verificar que hay datos para cargar
        if (!datosTransformados || datosTransformados.length === 0) {
            throw new Error('No hay datos para cargar en la tabla de destino OLAP.');
        }

        // Verificar que los campos a insertar están presentes
        if (!camposInsertar || camposInsertar.length === 0) {
            throw new Error('Debe especificar los campos a insertar en la tabla de destino OLAP.');
        }

        // Iterar sobre los datos transformados para insertarlos en la tabla de destino
        for (const dato of datosTransformados) {
            // Verificar campos requeridos antes de la inserción
            if (camposInsertar.some(campo => !dato[campo])) {
                throw new Error('Faltan campos requeridos en los datos a cargar en la tabla de destino OLAP.');
            }

            // Construir la consulta SQL INSERT dinámicamente
            const valores = camposInsertar.map(campo => typeof dato[campo] === 'string' ? `'${dato[campo]}'` : dato[campo]).join(', ');
            const sqlQuery = `INSERT INTO ${tablaDestino} (${camposInsertar.join(', ')}) VALUES (${valores})`;

            // Ejecutar la consulta SQL INSERT para cada registro
            await sql.query(sqlQuery);
        }

        // Cierra la conexión a la base de datos OLAP
        await sql.close();

        console.log('Datos cargados en la tabla de destino OLAP correctamente.');
    } catch (error) {
        // En caso de error, cierra la conexión y muestra el mensaje de error
        await sql.close();
        console.error('Error al cargar datos en la tabla de destino OLAP:', error.message);
        throw new Error('Error al cargar datos en la tabla de destino OLAP: ' + error.message);
    }
};
*/

const ejecutarTransformacion = (transformaciones, datos) => {
    // Aplicar transformaciones a los datos de los campos
    const datosTransformados = { ...datos }; // Crear una copia de los datos originales
  
    transformaciones.forEach(({ campo, tipoTransformacion, valorConcatenar, parteFecha }) => {
      switch (tipoTransformacion) {
        case 'minusculas':
          datosTransformados[campo] = datosTransformados[campo].toLowerCase();
          break;
        case 'mayusculas':
          datosTransformados[campo] = datosTransformados[campo].toUpperCase();
          break;
        case 'concatenar':
          datosTransformados[campo] = datosTransformados[campo] + valorConcatenar;
          break;
        case 'obtenerfecha':
          datosTransformados[campo] = obtenerParteFecha(datosTransformados[campo], parteFecha);
          break;
        default:
          throw new Error(`Tipo de transformación no válido para el campo ${campo}`);
      }
    });
  
    return datosTransformados;
  };
  
  // Función para obtener parte de la fecha (adaptada de tu código)
  const obtenerParteFecha = (fecha, parte) => {
    const fechaObj = new Date(fecha);
  
    switch (parte) {
      case 'mes':
        return fechaObj.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
      case 'ano':
        return fechaObj.getFullYear();
      case 'dia':
        return fechaObj.getDate();
      case 'semana':
        return obtenerNumeroSemana(fechaObj);
      default:
        throw new Error('Parte de fecha no válida.');
    }
  };
  
  // Función para obtener el número de la semana (adaptada de tu código)
  const obtenerNumeroSemana = (fecha) => {
    // Lógica para obtener el número de la semana
  };


  const transformarDatos = async (datosExtraidos, transformacionesPorCampo) => {
    try {
        // Aplicar las transformaciones a cada fila de datos según las transformaciones especificadas por campo
        const datosTransformados = datosExtraidos.map((fila) => {
            const filaTransformada = {};
            Object.keys(fila).forEach((campo) => {
                const transformacion = transformacionesPorCampo[campo];
                if (transformacion) {
                    // Verificar el tipo de transformación y el tipo de dato del campo
                    switch (transformacion.tipoTransformacion) {
                        case 'mayusculas':
                            filaTransformada[campo] = typeof fila[campo] === 'string' ? fila[campo].toUpperCase() : fila[campo];
                            break;
                        case 'minusculas':
                            filaTransformada[campo] = typeof fila[campo] === 'string' ? fila[campo].toLowerCase() : fila[campo];
                            break;
                        case 'concatenar':
                            const valorConcatenar = transformacion.valorConcatenar || '';
                            filaTransformada[campo] = typeof fila[campo] === 'string' ? fila[campo] + valorConcatenar : fila[campo];
                            break;
                        case 'obtenerfecha':
                            const parteFecha = transformacion.parteFecha || 'mes'; // Por defecto, obtener el mes
                            filaTransformada[campo] = typeof fila[campo] === 'string' ? obtenerParteFecha(fila[campo], parteFecha) : fila[campo];
                            break;
                        default:
                            filaTransformada[campo] = fila[campo]; // No aplicar transformación
                    }
                } else {
                    filaTransformada[campo] = fila[campo]; // No aplicar transformación
                }
            });
            return filaTransformada;
        });

        return datosTransformados; // Retornar los datos transformados
    } catch (error) {
        throw new Error('Error al transformar datos: ' + error.message);
    }
};






 /* 
// Función para transformar los datos según las transformaciones especificadas por campo
const transformarDatos = async (datosExtraidos, transformacionesPorCampo) => {
    try {
        // Aplicar las transformaciones a cada fila de datos según las transformaciones especificadas por campo
        const datosTransformados = datosExtraidos.map((fila) => {
            const filaTransformada = {};
            Object.keys(fila).forEach((campo) => {
                const transformacion = transformacionesPorCampo[campo];
                if (transformacion) {
                    switch (transformacion.tipoTransformacion) {
                        case 'mayusculas':
                            filaTransformada[campo] = fila[campo].toUpperCase();
                            break;
                        case 'minusculas':
                            filaTransformada[campo] = fila[campo].toLowerCase();
                            break;
                        case 'concatenar':
                            const valorConcatenar = transformacion.valorConcatenar || '';
                            filaTransformada[campo] = fila[campo] + valorConcatenar;
                            break;
                        case 'obtenerfecha':
                            const parteFecha = transformacion.parteFecha || 'mes'; // Por defecto, obtener el mes
                            filaTransformada[campo] = obtenerParteFecha(fila[campo], parteFecha);
                            break;
                        default:
                            filaTransformada[campo] = fila[campo]; // No aplicar transformación
                    }
                } else {
                    filaTransformada[campo] = fila[campo]; // No aplicar transformación
                }
            });
            return filaTransformada;
        });

        return datosTransformados; // Retornar los datos transformados
    } catch (error) {
        throw new Error('Error al transformar datos: ' + error.message);
    }
};
*/

module.exports = {
ejecutarConsultaSQL, extraerDatos, 
concatenarValores, obtenerParteFechaHora,
convertirAMayuscula,convertirAMinuscula,
identificarRegistrosNuevosActualizados,
cargarDatosOLAP,
ejecutarTransformacion,
transformarDatos

};















































































/*

const obtenerNombreProcedimiento = (tabla) => {
    switch (tabla.toLowerCase()) {
        case 'customers':
            return 'LlenarTablaOLAPCustommers';
        case 'employees':
            return 'LlenarTablaOLAPEmployees';
        case 'products':
            return 'LlenarTablaOLAPProducts';
        case 'tiempo':
            return 'LlenarTablaTiempo';
        case 'productlines':
            return 'LlenarTablaOLAPProductLine';
        default:
            throw new Error('Tabla de destino no válida');
    }
};

const llenarTablaOLAP = async (tablaDestino, campos, camposDestino) => {
    try {
        await sql.connect(configOLAP);
        const request = new sql.Request();
        request.input('Campos', sql.NVarChar(sql.MAX), campos);
        request.input('Campos2', sql.NVarChar(sql.MAX), camposDestino);
        const spName = obtenerNombreProcedimiento(tablaDestino);
        await request.execute(spName);
        console.log('Procedimiento almacenado ejecutado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
    } finally {
        sql.close();
    }
};


const llenarTablaTiempoOlAP = async (campos) => {
    try {
        await sql.connect(configOLAP); // Asegúrate de tener una configuración válida para la conexión (configOLAP)
        const request = new sql.Request();

        let sqlQuery = `
            INSERT INTO TBL_TIEMPO (TIEMPO_ID, NOMBRE_MES, SEMANA, TRIMESTRE, CUATRIMESTRE, SEMESTRE, DIA_DE_SEMANA)
            SELECT  `; // Agregamos un espacio después de "SELECT"

        if (campos.includes('TIEMPO_ID')) {
            sqlQuery += `CONVERT(DATE, ORDERDATE) AS TIEMPO_ID, `;
        }
        if (campos.includes('NOMBRE_MES')) {
            sqlQuery += `DATENAME(MONTH, ORDERDATE) AS NOMBRE_MES, `;
        }
        if (campos.includes('SEMANA')) {
            sqlQuery += `DATEPART(WEEK, ORDERDATE) AS SEMANA, `;
        }
        if (campos.includes('TRIMESTRE')) {
            sqlQuery += `DATEPART(QUARTER, ORDERDATE) AS TRIMESTRE, `;
        }
        if (campos.includes('CUATRIMESTRE')) {
            sqlQuery += `CEILING(DATEPART(MM, ORDERDATE) * 1.0 / 4) AS CUATRIMESTRE, `;
        }
        if (campos.includes('SEMESTRE')) {
            sqlQuery += `CEILING(DATEPART(MM, ORDERDATE) / 6) AS SEMESTRE, `;
        }
        if (campos.includes('DIA_DE_SEMANA')) {
            sqlQuery += `DATENAME(WEEKDAY, ORDERDATE) AS DIA_DE_SEMANA `;
        }

        sqlQuery = sqlQuery.slice(0, -2); // Eliminamos la coma al final
        sqlQuery += ` FROM ClassicModels.dbo.orders`;

        console.log(sqlQuery);

        await request.query(sqlQuery);

        console.log('Procedimiento almacenado ejecutado correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
    } finally {
        sql.close();
    }
};







const ejecutarProcedimiento = async (req, res) => {
    const { tablaOrigen, tablaDestino, campos, camposDestino } = req.body;

    try {
        if (tablaOrigen === tablaDestino) {
            return res.status(400).json({ error: 'La tabla de origen y destino no pueden ser iguales' });
        }

        await llenarTablaOLAP(tablaDestino, campos, camposDestino);
        return res.status(200).json({ message: 'Procedimiento ejecutado correctamente' });
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ error: 'Error al ejecutar el procedimiento almacenado' });
    }
};

const obtenerDatosTablaOLAP = async (tabla) => {
    try {
        // Ejemplo de uso de la librería mssql para obtener datos de la tabla especificada
        const pool = await sql.connect(configOLAP); // Configura tu conexión a la base de datos aquí

        const result = await pool.request()
            .query(`SELECT * FROM ${tabla}`); // Consulta dinámica para seleccionar todos los campos de la tabla

        return result.recordset; // Devuelve los datos obtenidos de la tabla
    } catch (error) {
        console.error('Error al obtener los datos de la tabla OLAP:', error);
        throw error; // Lanza el error para manejarlo en el controlador
    }
};
*/


/*
module.exports = {
     llenarTablaCustomersOLAP,
      llenarEmployeesOLAP,
      llenarProductsOLAP,
      llenarProductsLineOLAP,
      llenarTiempoOLAP,
      obtenerDatosTablaOLAP,
      llenarTablaHechos,
      ejecutarProcedimiento
};*/





