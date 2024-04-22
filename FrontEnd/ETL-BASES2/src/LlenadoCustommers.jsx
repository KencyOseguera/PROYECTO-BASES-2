import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LlenadoCustommers = ({ onLlenarTablaOLAP }) => {
    const [datosOLAP, setDatosOLAP] = useState([]); // Estado para almacenar los datos de la tabla OLAP

    const obtenerDatosTablaOLAP = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/obtenertablaHechos');
            setDatosOLAP(response.data); // Actualiza el estado con los datos obtenidos del backend
        } catch (error) {
            console.error('Error al obtener los datos de la tabla OLAP:', error);
        }
    };

    const llenarTablaOLAP = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/llenarTablaHechos');
            console.log(response.data); // Muestra la respuesta del servidor
            obtenerDatosTablaOLAP(); // Vuelve a obtener los datos de la tabla OLAP después de llenarla
        } catch (error) {
            console.error('Error al llenar la tabla OLAP:', error);
        }
    };

    useEffect(() => {
        obtenerDatosTablaOLAP(); // Llamar a la función para obtener los datos de la tabla OLAP al cargar el componente
    }, []);

    return (
        <div>
            <h2>Datos en la Tabla OLAP: EMPLOYEES</h2>
            <table>
                <thead>
                    <tr>
                        <th>CODIGO_ID</th>
                        <th>EMPLOYEENUMBER</th>
                        <th>EMPLOYEENUMBER</th>
                        <th>PRODUCTCODE</th>
                        <th>TIEMPO_ID</th>
                        <th>TIEMPO_ID</th>
                    </tr>
                </thead>
                <tbody>
                    {datosOLAP.map((dato) => (
                        <tr key={dato.CODIGO_ID}>
                            <td>{dato.CODIGO_ID}</td>
                            <td>{dato.EMPLOYEENUMBER}</td>
                            <td>{dato.EMPLOYEENUMBER}</td>
                            <td>{dato.PRODUCTCODE}</td>
                            <td>{dato.TIEMPO_ID}</td>
                            <td>{dato.TIEMPO_ID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={llenarTablaOLAP}>Llenar Tabla OLAP</button>
        </div>
    );
};

export default LlenadoCustommers;
