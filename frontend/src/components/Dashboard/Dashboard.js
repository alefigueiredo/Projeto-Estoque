import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import GraficosEstoque from './GraficosEstoque';

function Dashboard() {
  const [itens, setItens] = useState([]);
  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [forcarAtualizacao, setForcarAtualizacao] = useState(false);
  const [ordenacao, setOrdenacao] = useState({ campo: 'data', direcao: 'desc' });

  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo ? (prev.direcao === 'asc' ? 'desc' : 'asc') : 'asc'
    }));
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
    return [...movimentos].sort((a, b) => {
      if (ordenacao.campo === 'data') {
        return ordenacao.direcao === 'asc' 
          ? new Date(a.data) - new Date(b.data)
          : new Date(b.data) - new Date(a.data);
      }
      
      if (ordenacao.campo === 'nome') {
        const itemA = itens.find(i => i.id === a.itemId)?.nome || '';
        const itemB = itens.find(i => i.id === b.itemId)?.nome || '';
        return ordenacao.direcao === 'asc' 
          ? itemA.localeCompare(itemB)
          : itemB.localeCompare(itemA);
      }
      
      return ordenacao.direcao === 'asc'
        ? (a[ordenacao.campo] < b[ordenacao.campo] ? -1 : 1)
        : (a[ordenacao.campo] > b[ordenacao.campo] ? -1 : 1);
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
    return () => clearInterval(interval);
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
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Carregando dados do estoque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <img 
              src="/logo-sicoob.png" 
              alt="Logo Sicoob" 
              className={styles.logoImg} 
            />
            <h1 className={styles.logoText}>Sistema de Estoque - Marketing</h1>
          </div>
          <div className={styles.dashboardControls}>
            {ultimaAtualizacao && (
              <span className={styles.updateInfo}>
                Última atualização: {formatarData(ultimaAtualizacao)}
              </span>
            )}
            <button 
              onClick={fetchData} 
              className={styles.refreshButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.spinner}></div>
              ) : (
                <>
                  <span>↻</span>
                  Atualizar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <GraficosEstoque itens={itens} movimentos={movimentos} />
        
        <section className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>
            <span>📦</span>
            Resumo do Estoque
          </h2>
          <div className={styles.cardsGrid}>
            {itens.map(item => (
              <div 
                key={item.id} 
                className={`${styles.statCard} ${item.quantidade < 10 ? styles.lowStock : ''}`}
              >
                <h3 className={styles.itemName}>
                  <span>⦿</span>
                  {item.nome}
                </h3>
                <div className={styles.itemInfo}>
                  <p><strong>Código:</strong> {item.numero}</p>
                  <p>
                    <strong>Quantidade:</strong> 
                    <span className={item.quantidade < 10 ? styles.textDanger : ''}>
                      {item.quantidade}
                    </span>
                  </p>
                  <p><strong>Atualizado em:</strong> {formatarData(item.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span>🔄</span>
              Últimas Movimentações
            </h2>
            <span className={styles.badge}>{movimentos.length} registros</span>
          </div>
          
          <div className={styles.tableResponsive}>
            {movimentos.length > 0 ? (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th onClick={() => handleOrdenar('nome')} className={styles.sortableHeader}>
                      Item {ordenacao.campo === 'nome' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('tipo')} className={styles.sortableHeader}>
                      Tipo {ordenacao.campo === 'tipo' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('quantidade')} className={styles.sortableHeader}>
                      Quantidade {ordenacao.campo === 'quantidade' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleOrdenar('data')} className={styles.sortableHeader}>
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
                          <span className={`${styles.tipoMovimento} ${movimento.tipo.toLowerCase()}`}>
                            {formatarTipo(movimento.tipo)}
                          </span>
                        </td>
                        <td>{movimento.quantidade}</td>
                        <td>{formatarData(movimento.data)}</td>
                        <td>
                          <button
                            onClick={() => window.open(`/movimentos/${movimento.id}/impressao`, '_blank')}
                            className={`${styles.btn} ${styles.btnSecondary}`}
                          >
                            <span>🖨️</span>
                            Imprimir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
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