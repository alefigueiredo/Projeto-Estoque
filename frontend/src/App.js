// src/App.js
import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import CadastroItem from './components/CadastroItem/CadastroItem';
import CadastroPosto from './components/CadastroPosto/CadastroPosto';
import CadastroColaborador from './components/CadastroColaborador/CadastroColaborador';
import MovimentacaoEstoque from './components/MovimentacaoEstoque/MovimentacaoEstoque';
import PesquisaEstoque from './components/PesquisaEstoque/PesquisaEstoque'; // Importe o componente
import ImpressaoMovimento from './components/ImpressaoMovimento/ImpressaoMovimento';
import { FaHome, FaBox, FaStore, FaUsers, FaExchangeAlt, FaSearch } from 'react-icons/fa';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <div className="container">
            <h1>Sistema de Controle de Estoque - Marketing</h1>
            <nav>
              <Link to="/"><FaHome /> Dashboard</Link>
              <Link to="/itens"><FaBox /> Itens</Link>
              <Link to="/postos"><FaStore /> P.A.</Link>
              <Link to="/colaboradores"><FaUsers /> Colaboradores</Link>
              <Link to="/movimentacao"><FaExchangeAlt /> Movimentação</Link>
              <Link to="/pesquisa"><FaSearch /> Pesquisa</Link>
            </nav>
          </div>
        </header>
        
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/itens" element={<CadastroItem />} />
            <Route path="/postos" element={<CadastroPosto />} />
            <Route path="/colaboradores" element={<CadastroColaborador />} />
            <Route path="/movimentacao" element={<MovimentacaoEstoque />} />
            <Route path="/pesquisa" element={<PesquisaEstoque />} />
            <Route path="/movimentos/:id/impressao" element={<ImpressaoMovimento />} />
          </Routes>
        </main>
        
        <footer>
          <div className="container">
            <p>Sistema desenvolvido para controle de brindes e consumíveis</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
