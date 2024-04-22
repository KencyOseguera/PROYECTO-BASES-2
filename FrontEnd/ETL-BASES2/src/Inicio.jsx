import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div>
            <h1>Proyecto Bases de Datos 2 Sección 1100</h1>
            <p>Kency Pamela Oseguera Valdez 20201004556</p>
            <p>Kenia Romero 20171003359</p>
            <p>Cristian Rodil Zuniga 20181002386</p>
            <div>
                <Link to="/etl"><button>Llenado Tablas</button></Link>
                <Link to="/hechos"><button>Llenado Hechos</button></Link>
                
            </div>
        </div>
    );
};

export default Inicio;
