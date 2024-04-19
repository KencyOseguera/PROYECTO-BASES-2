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
                <Link to="/Customers"><button>Llenado CUSTOMERS</button></Link>
                <Link to="/Employees"><button>Llenado EMPLOYEES</button></Link>
                <Link to="/ruta3"><button>Llenado PRODUCTS</button></Link>
                <Link to="/ruta4"><button>Llenado TIMEPO</button></Link>
                <Link to="/ruta5"><button>Llenado PRODUCTI LINE</button></Link>
                <Link to="/ruta6"><button>Llenado HECHOS</button></Link>
            </div>
        </div>
    );
};

export default Inicio;
