import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LlenadoCustommers = ({ onLlenarTablaOLAP }) => {
    const [datosOLAP, setDatosOLAP] = useState([]); // Estado para almacenar los datos de la tabla OLAP

    const obtenerDatosTablaOLAP = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/obtenerTablaCustomersOLAP');
            setDatosOLAP(response.data); // Actualiza el estado con los datos obtenidos del backend
        } catch (error) {
            console.error('Error al obtener los datos de la tabla OLAP:', error);
        }
    };

    const llenarTablaOLAP = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/llenarTablaOLAP');
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
                        <th>Customer Number</th>
                        <th>Customer Name</th>
                        <th>Contact Name</th>
                        <th>City</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {datosOLAP.map((dato) => (
                        <tr key={dato.CUSTOMERNUMBER}>
                            <td>{dato.CUSTOMERNUMBER}</td>
                            <td>{dato.CUSTOMERNAME}</td>
                            <td>{dato.NOMBRE_CONTACTO_CUSTOMER}</td>
                            <td>{dato.CITY}</td>
                            <td>{dato.COUNTRY}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={llenarTablaOLAP}>Llenar Tabla OLAP</button>
        </div>
    );
};

export default LlenadoCustommers;
