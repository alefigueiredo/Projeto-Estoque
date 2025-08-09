import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GraficosEstoque from './GraficosEstoque';

function Dashboard() {
  const [itens, setItens] = useState([]);
  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [forcarAtualizacao, setForcarAtualizacao] = useState(false);
  const [ordenacao, setOrdenacao] = useState({ campo: 'data', direcao: 'desc' });

  const handleOrdenar = (campo) => {
    setOrdenacao(prev => {
      if (prev.campo === campo) {
        return {
          campo,
          direcao: prev.direcao === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        campo,
        direcao: 'asc'
      };
    });
  };
  
  const formatarTipo = (tipo) => {
    const tiposCorretos = {
      'Entrada': 'Entrada',
      'Saída': 'Saída',
      'Safda': 'Saída',
      'Devolução': 'Devolução'
    };
    return tiposCorretos[tipo] || tipo;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itensResponse, movimentosResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/itens'),
        axios.get('http://localhost:5001/api/movimentos')
      ]);
      
      if (itensResponse.data?.success) {
        setItens(itensResponse.data.data || []);
      }
      
      if (movimentosResponse.data?.success) {
        const movimentosOrdenados = ordenarMovimentos([...movimentosResponse.data.data]);
        setMovimentos(movimentosOrdenados.slice(0, 5));
      }
      
      setUltimaAtualizacao(new Date());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const ordenarMovimentos = (movimentos) => {
    return movimentos.sort((a, b) => {
      if (ordenacao.campo === 'data') {
        return ordenacao.direcao === 'asc' 
          ? new Date(a.data) - new Date(b.data)
          : new Date(b.data) - new Date(a.data);
      } else if (ordenacao.campo === 'nome') {
        const itemA = itens.find(i => i.id === a.itemId)?.nome || '';
        const itemB = itens.find(i => i.id === b.itemId)?.nome || '';
        return ordenacao.direcao === 'asc' 
          ? itemA.localeCompare(itemB)
          : itemB.localeCompare(itemA);
      } else {
        if (a[ordenacao.campo] < b[ordenacao.campo]) return ordenacao.direcao === 'asc' ? -1 : 1;
        if (a[ordenacao.campo] > b[ordenacao.campo]) return ordenacao.direcao === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  useEffect(() => {
    if (movimentos.length > 0) {
      const movimentosOrdenados = ordenarMovimentos([...movimentos]);
      setMovimentos(movimentosOrdenados.slice(0, 5));
    }
  }, [ordenacao]);

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    window.atualizarDashboard = () => setForcarAtualizacao(prev => !prev);
    
    return () => {
      clearInterval(interval);
      delete window.atualizarDashboard;
    };
  }, [forcarAtualizacao]);

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading && itens.length === 0) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner">
          <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#0033a0" strokeWidth="4" strokeDasharray="80 30">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
          <p>Carregando dados do estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <img src="/logo-sicoob.png" alt="Logo Sicoob" className="logo-img" />
            <span className="logo-text">Sistema de Estoque - Marketing</span>
          </div>
          <div className="dashboard-controls">
            {ultimaAtualizacao && (
              <span className="update-info">
                Última atualização: {formatarData(ultimaAtualizacao)}
              </span>
            )}
            <button 
              onClick={fetchData} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Atualizando...
                </>
              ) : (
                <>
                  <span className="refresh-icon">↻</span>
                  Atualizar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <GraficosEstoque itens={itens} movimentos={movimentos} />
        
        <section className="dashboard-section">
          <h2 className="section-title">
            <span className="icon">📦</span>
            Resumo do Estoque
          </h2>
          <div className="stats-grid">
            {itens.map(item => (
              <div 
                key={item.id} 
                className={`stat-card ${item.quantidade < 10 ? 'low-stock' : ''}`}
              >
                <h3>
                  <span className="item-icon">⦿</span>
                  {item.nome}
                </h3>
                <div className="item-info">
                  <p><strong>Código:</strong> {item.numero}</p>
                  <p>
                    <strong>Quantidade:</strong> 
                    <span className={`quantidade ${item.quantidade < 10 ? 'text-danger' : ''}`}>
                      {item.quantidade}
                    </span>
                  </p>
                  <p><strong>Atualizado em:</strong> {formatarData(item.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="icon">🔄</span>
              Últimas Movimentações
            </h2>
            <span className="badge">{movimentos.length} registros</span>
          </div>
          
          <div className="table-responsive">
            {movimentos.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleOrdenar('nome')} className="sortable-header">
                      Item {ordenacao.campo === 'nome' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('tipo')} className="sortable-header">
                      Tipo {ordenacao.campo === 'tipo' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('quantidade')} className="sortable-header">
                      Quantidade {ordenacao.campo === 'quantidade' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('data')} className="sortable-header">
                      Data {ordenacao.campo === 'data' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentos.map(movimento => {
                    const item = itens.find(i => i.id === movimento.itemId);
                    return (
                      <tr key={movimento.id}>
                        <td>{item?.nome || 'N/A'}</td>
                        <td>
                          <span className={`tipo-movimento ${movimento.tipo.toLowerCase()}`}>
                            {formatarTipo(movimento.tipo)}
                          </span>
                        </td>
                        <td>{movimento.quantidade}</td>
                        <td>{formatarData(movimento.data)}</td>
                        <td>
                          <button
                            onClick={() => window.open(`/movimentos/${movimento.id}/impressao`, '_blank')}
                            className="btn btn-secondary"
                          >
                            <span className="print-icon">🖨️</span>
                            Imprimir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>Nenhuma movimentação registrada</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;