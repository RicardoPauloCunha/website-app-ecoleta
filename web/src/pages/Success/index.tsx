import React from "react";
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

const Success = () => {
    return (
        <div id="page-success">
            <div id="box-mensage">
                <span><FiCheckCircle /></span>
                <h1>Ponto de coleta criado com sucesso.</h1>
                <Link to="/create-point">
                    <FiArrowLeft />
                    Cadastrar outro ponto de coleta.
                </Link>
            </div>
        </div>
    );
}

export default Success;