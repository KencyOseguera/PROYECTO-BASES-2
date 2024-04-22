

import React, { useState } from 'react';
import axios from 'axios';

const ETLForm = () => {
    const [tablaOrigen, setTablaOrigen] = useState('');
    const [tablaDestino, setTablaDestino] = useState('');
    const [camposSeleccionados, setCamposSeleccionados] = useState([]);
    const [camposSeleccionadosDestino, setCamposSeleccionadosDestino] = useState([]);
    const [transformacionesPorCampo, setTransformacionesPorCampo] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [datosTransformados, setDatosTransformados] = useState([]); // Nuevo estado para datos transformados
    const [camposConcatenar, setCamposConcatenar] = useState([]);
    const [datosCargados, setDatosCargados] = useState([]);


    const camposDisponiblesOrigen = {
        CUSTOMERS: ['CUSTOMERNUMBER', 'CUSTOMERNAME', 'CONTACTFIRSTNAME', 'CONTACTLASTNAME', 'CITY', 'COUNTRY'],
        PRODUCTS: ['productCode', 'productName', 'productLine', 'quantityInStock'],
        EMPPLOYEES: ['EMPLOYEENUMBER', 'FIRSTNAME', 'LASTNAME', 'NOMBRE_EMPLOYEE', 'OFFICECODE'],
        orders: ['orderNumber', 'employeeNumber', 'orderDate', 'requiredDate', 'shippedDate', 'status', 'comments', 'customerNumber'],
        productlines: ['productLine', 'textDescription'],
    };

    const camposDisponiblesDestino = {
        CUSTOMERS: ['CUSTOMERNUMBER', 'CUSTOMERNAME', 'NOMBRE_CONTACTO_CUSTOMER', 'CITY', 'COUNTRY'],
        PRODUCTS: ['PRODUCTCODE', 'PRODUCTNAME', 'PRODUCTLINE', 'QUANTITYINSTOCK'],
        EMPPLOYEES: ['employeeNumber', 'NOMBRE_EMPLOYEE', 'officeCode'],
        TBL_TIEMPO: ['TIEMPO_ID', 'NOMBRE_MES', 'SEMANA', 'TRIMESTRE', 'CUATRIMESTRE', 'SEMESTRE', 'DIA_DE_SEMANA'],
        PRODUCTLINES: ['PRODUCTLINE', 'TEXTDESCRIPTION'],
    };
    

    const handleTransformacionPorCampo = (campo, tipoTransformacion) => {
        setTransformacionesPorCampo({ ...transformacionesPorCampo, [campo]: { tipoTransformacion } });
    };


    const handleCampoSeleccionado = (campo) => {
        const selectedFields = [...camposSeleccionados];
        const index = selectedFields.indexOf(campo);
        if (index === -1) {
            selectedFields.push(campo);
        } else {
            selectedFields.splice(index, 1);
        }
        setCamposSeleccionados(selectedFields);
    };




    const handleCampoSeleccionadoDestino = (campo) => {
        const selectedFields = [...camposSeleccionadosDestino];
        const index = selectedFields.indexOf(campo);
        if (index === -1) {
            selectedFields.push(campo);
        } else {
            selectedFields.splice(index, 1);
        }
        setCamposSeleccionadosDestino(selectedFields);
    };


  
  
    const handleExtraerYTransformar = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/extraerYTransformarDatos', {
                tablaOrigen,
                camposSeleccionados,
                transformacionesPorCampo,
            });

            console.log('Respuesta de extracción y transformación de datos:', response.data); // Agregado para depuración

            // Actualizar los datos transformados en el estado
            setDatosTransformados(response.data.datosTransformados);
        } catch (error) {
            setError('Error al ejecutar el proceso de extracción y transformación: ' + error.message);
            console.error('Detalles del error:', error); // Agrega este registro para obtener más detalles del error
        }
    };

/*
    const handleExtraerYTransformar = async (event) => {
        event.preventDefault();
        setError('');
    
        try {
            let camposConcatenados = {};
            camposConcatenar.forEach((campo) => {
                const valorCampo = datosTransformados.map((dato) => dato[campo]).join(' '); // Concatenar usando un espacio
                camposConcatenados[campo] = valorCampo;
            });
    
            // Agregar campos concatenados a datosTransformados si es necesario
            if (Object.keys(camposConcatenados).length > 0) {
                setDatosTransformados((prevData) => prevData.map((dato) => ({ ...dato, ...camposConcatenados })));
            }
    
            const response = await axios.post('http://localhost:3000/api/extraerYTransformarDatos', {
                tablaOrigen,
                camposSeleccionados,
                transformacionesPorCampo,
            });
    
            console.log('Respuesta de extracción y transformación de datos:', response.data); // Agregado para depuración
    
            // Actualizar los datos transformados en el estado
            setDatosTransformados(response.data.datosTransformados);
        } catch (error) {
            setError('Error al ejecutar el proceso de extracción y transformación: ' + error.message);
            console.error('Detalles del error:', error); // Agrega este registro para obtener más detalles del error
        }
    };
    
*/
/*
const handleExtraerYTransformar = async (event) => {
    event.preventDefault();
    setError('');

    try {
        const response = await axios.post('http://localhost:3000/api/extraerYTransformarDatos', {
            tablaOrigen,
            camposSeleccionados,
            transformacionesPorCampo,
        });

        console.log('Respuesta de extracción y transformación de datos:', response.data);

        // Concatenar campos seleccionados en el origen si es necesario
        const datosTransformadosActualizados = response.data.datosTransformados.map((dato) => {
            const camposConcatenados = {};
            camposConcatenar.forEach((campo) => {
                camposConcatenados[campo] = dato[campo];
            });
            return { ...dato, ...camposConcatenados };
        });

        setDatosTransformados(datosTransformadosActualizados);
    } catch (error) {
        setError('Error al ejecutar el proceso de extracción y transformación: ' + error.message);
        console.error('Detalles del error:', error);
    }
};
*/

const handleCargar = async (event) => {
    event.preventDefault();
    setError('');

    if (!tablaDestino || !datosTransformados.length || !camposSeleccionadosDestino.length) { // Verificar datos transformados y campos de destino
        setError('Debe seleccionar una tabla de destino, proporcionar datos transformados válidos y seleccionar campos de destino.');
        return;
    }

    try {
        const responseCargar = await axios.post('http://localhost:3000/api/cargarDatosOLAP', {
            tablaDestino,
            camposInsertar: camposSeleccionadosDestino, // Cambiar a camposInsertar
            datosTransformados,
        });

        console.log('Respuesta de carga de datos:', responseCargar.data); // Agregado para depuración
        alert('ETL exitoso: Datos cargados en la tabla de destino OLAP correctamente.');

    } catch (error) {
        setError('Error al ejecutar el proceso de carga: ' + error.message);
        lert('No se pudo completar el ETL');
    }
};

/*
    const handleCargar = async (event) => {
        event.preventDefault();
        setError('');
    
        if (!tablaDestino || !datosTransformados.length || !camposSeleccionadosDestino.length) { // Verificar datos transformados y campos de destino
            setError('Debe seleccionar una tabla de destino, proporcionar datos transformados válidos y seleccionar campos de destino.');
            return;
        }
    
        try {
            const responseCargar = await axios.post('http://localhost:3000/api/cargarDatosOLAP', {
                tablaDestino,
                camposInsertar: camposSeleccionadosDestino, // Cambiar a camposInsertar
                datosTransformados,
            });
    
            console.log('Respuesta de carga de datos:', responseCargar.data); // Agregado para depuración
        } catch (error) {
            setError('Error al ejecutar el proceso de carga: ' + error.message);
        }
    };
    */

    return (
        <div>
            <h1>ETL Form</h1>
            {/* Sección de selección de tablas */}
            <div>
                <label htmlFor="tablaOrigen">Tabla de Origen:</label>
                <select
                    id="tablaOrigen"
                    value={tablaOrigen}
                    onChange={(e) => setTablaOrigen(e.target.value)}
                >
                    <option value="">Selecciona una tabla de origen</option>
                    {Object.keys(camposDisponiblesOrigen).map((tabla) => (
                        <option key={tabla} value={tabla}>{tabla}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="tablaDestino">Tabla de Destino:</label>
                <select
                    id="tablaDestino"
                    value={tablaDestino}
                    onChange={(e) => setTablaDestino(e.target.value)}
                >
                    <option value="">Selecciona una tabla de destino</option>
                    {Object.keys(camposDisponiblesDestino).map((tabla) => (
                        <option key={tabla} value={tabla}>{tabla}</option>
                    ))}
                </select>
            </div>

            {/* Sección de selección de campos */}
            <div>
                <label>Campos de Origen:</label>
                {tablaOrigen && camposDisponiblesOrigen[tablaOrigen].map((campo) => (
                    <label key={campo}>
                        <input
                            type="checkbox"
                            value={campo}
                            checked={camposSeleccionados.includes(campo)}
                            onChange={() => handleCampoSeleccionado(campo)}
                        />
                        {campo}
                    </label>
                ))}
            </div>

            {/* Sección de selección de campos para la tabla de destino */}
        <div>
            <label>Campos de Destino:</label>
            {tablaDestino && camposDisponiblesDestino[tablaDestino].map((campo) => (
                <label key={campo}>
                    <input
                        type="checkbox"
                        value={campo}
                        checked={camposSeleccionadosDestino.includes(campo)}
                        onChange={() => handleCampoSeleccionadoDestino(campo)}
                    />
                    {campo}
                    </label>
                    ))}
                    </div>


                    {/* Sección de selección de transformaciones */}
                    <div>
                        <label>Transformación de Campos:</label>
                        {camposSeleccionados.map((campo) => (
                            <div key={campo}>
                                <span>{campo}</span>
                                <select onChange={(e) => handleTransformacionPorCampo(campo, e.target.value)}>
                                    <option value="">Selecciona una transformación</option>
                                    <option value="minusculas">Convertir a minúsculas</option>
                                    <option value="mayusculas">Convertir a mayúsculas</option>
                                    <option value="concatenar">Concatenar</option>
                                    <option value="mes">Obtener Mes</option>
                                    <option value="ano">Obtener Año</option>
                                    <option value="dia">Obtener Dias</option>
                                    {/* Otros tipos de transformación */}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Botón para enviar el formulario */}
                    <button onClick={handleExtraerYTransformar}>Extraer y Transformar</button>
                    
                    <button onClick={handleCargar}>Cargar en OLAP</button>

                    
                    {/* Mostrar datos cargados en la tabla */}
                    {datosCargados.length > 0 && (
                        <div>
                            <h2>Datos Cargados en OLAP</h2>
                            <table>
                                <thead>
                            <tr>
                                {/* Encabezados de la tabla */}
                                {Object.keys(datosCargados[0]).map((campo) => (
                                    <th key={campo}>{campo}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Filas de datos */}
                            {datosCargados.map((dato, index) => (
                                <tr key={index}>
                                    {Object.values(dato).map((valor, idx) => (
                                        <td key={idx}>{valor}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ETLForm;
