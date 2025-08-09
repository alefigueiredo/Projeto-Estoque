import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PesquisaEstoque() {
  const [itens, setItens] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

  useEffect(() => {
    const carregarItens = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/itens');
        // Ajuste para a estrutura da sua API que retorna { success, data }
        setItens(response.data.success ? response.data.data : []);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setErro('Erro ao carregar itens do estoque. Tente recarregar a página.');
        setItens([]);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarItens();
  }, []);

  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo ? (prev.direcao === 'asc' ? 'desc' : 'asc') : 'asc'
    }));
  };

  const itensFiltrados = itens.filter(item => {
    if (!filtro) return true;
    
    const searchTerm = filtro.toLowerCase();
    return (
      (item.nome?.toLowerCase().includes(searchTerm)) ||
      (item.numero?.toString().toLowerCase().includes(searchTerm)) ||
      (item.quantidade?.toString().includes(searchTerm))
    );
  });

  const itensOrdenados = [...itensFiltrados].sort((a, b) => {
    const valA = a[ordenacao.campo]?.toString().toLowerCase() || '';
    const valB = b[ordenacao.campo]?.toString().toLowerCase() || '';
    
    if (ordenacao.campo === 'quantidade') {
      // Ordenação numérica para quantidade
      return ordenacao.direcao === 'asc' 
        ? Number(a.quantidade) - Number(b.quantidade)
        : Number(b.quantidade) - Number(a.quantidade);
    }
    
    // Ordenação alfabética para outros campos
    return ordenacao.direcao === 'asc' 
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  return (
    <div className="pesquisa-container">
      <h2>Pesquisa de Estoque</h2>
      
      {erro && <div className="alert alert-error">{erro}</div>}
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquisar por nome, código ou quantidade..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      {carregando ? (
        <div className="loading">Carregando itens...</div>
      ) : (
        <div className="table-responsive">
          <table className="estoque-table">
            <thead>
              <tr>
                <th onClick={() => handleOrdenar('numero')} className="sortable-header">
                  Código {ordenacao.campo === 'numero' && (
                    <span>{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleOrdenar('nome')} className="sortable-header">
                  Nome {ordenacao.campo === 'nome' && (
                    <span>{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleOrdenar('quantidade')} className="sortable-header">
                  Quantidade {ordenacao.campo === 'quantidade' && (
                    <span>{ordenacao.direcao === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {itensOrdenados.length > 0 ? (
                itensOrdenados.map(item => (
                  <tr key={item.id} className={item.quantidade < 10 ? 'low-stock' : ''}>
                    <td>{item.numero || '-'}</td>
                    <td>{item.nome || '-'}</td>
                    <td>{item.quantidade}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-results">
                    {filtro ? 'Nenhum item encontrado com o filtro informado' : 'Nenhum item cadastrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="search-summary">
        {!carregando && (
          <p>Total de itens encontrados: <strong>{itensFiltrados.length}</strong></p>
        )}
      </div>
    </div>
  );
}

export default PesquisaEstoque;