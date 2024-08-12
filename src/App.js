import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './components/login/LoginPage/LoginPage';
import PedidoPage from './components/pedidos/PedidoPage/PedidoPage';
import PedidosList from './components/pedidos/PedidosList/PedidosList';
import PrivateRoute from './components/PrivateRoute';
import FaturamentoList from './components/faturamento/FaturamentoList/FaturamentoList';
import Cadastro from './components/Cadastro/cadastro';

function App() {
  const username = Cookies.get('username');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to={username ? "/pedidos" : "/login"} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/pedidos" 
            element={
              <PrivateRoute>
                <PedidoPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/pedidosList" 
            element={
              <PrivateRoute>
                <PedidosList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/faturamentoList" 
            element={
              <PrivateRoute>
                <FaturamentoList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/cadastro" 
            element={
              <PrivateRoute>
                <Cadastro />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
