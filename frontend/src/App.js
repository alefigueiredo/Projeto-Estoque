// src/App.js
import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CadastroItem from './components/CadastroItem';
import CadastroPosto from './components/CadastroPosto';
import CadastroColaborador from './components/CadastroColaborador';
import MovimentacaoEstoque from './components/MovimentacaoEstoque';
import PesquisaEstoque from './components/PesquisaEstoque'; // Importe o componente
import ImpressaoMovimento from './components/ImpressaoMovimento';
import './styles.css';
import { FaHome, FaBox, FaStore, FaUsers, FaExchangeAlt, FaSearch } from 'react-icons/fa';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Sistema de Controle de Estoque - Marketing</h1>
          <nav>
            <Link to="/"><FaHome /> Dashboard</Link>
            <Link to="/itens"><FaBox /> Itens</Link>
            <Link to="/postos"><FaStore /> P.A.</Link>
            <Link to="/colaboradores"><FaUsers /> Colaboradores</Link>
            <Link to="/movimentacao"><FaExchangeAlt /> Movimentação</Link>
            <Link to="/pesquisa"><FaSearch /> Pesquisa</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/itens" element={<CadastroItem />} />
            <Route path="/postos" element={<CadastroPosto />} />
            <Route path="/colaboradores" element={<CadastroColaborador />} />
            <Route path="/movimentacao" element={<MovimentacaoEstoque />} />
            <Route path="/pesquisa" element={<PesquisaEstoque />} /> {/* Adicione esta rota */}
            <Route path="/movimentos/:id/impressao" element={<ImpressaoMovimento />} />
          </Routes>
        </main>
        
        <footer>
          <p>Sistema desenvolvido para controle de brindes e consumíveis</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
