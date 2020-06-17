import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Success from './pages/Success';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" exact/>
            <Route component={Success} path="/success-create-point" exact/>
        </BrowserRouter>
    );
}

export default Routes;