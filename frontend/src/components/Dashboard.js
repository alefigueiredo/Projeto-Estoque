import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import GraficosEstoque from './GraficosEstoque';

function Dashboard() {
  const [itens, setItens] = useState([]);
  const [movimentos, setMovimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adicione esta função para buscar os dados
const fetchData = async () => {
  try {
    const [itensResponse, movimentosResponse] = await Promise.all([
      axios.get('http://localhost:5001/api/itens'),
          axios.get('http://localhost:5001/api/movimentos?limit=5')
    ]);
    
    setItens(itensResponse.data);
    setMovimentos(movimentosResponse.data);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
};

// Atualização inicial e periódica
useEffect(() => {
  fetchData();
  
  const interval = setInterval(fetchData, 10000); // Atualiza a cada 10s
  
  return () => clearInterval(interval);
}, []);
  
  useEffect(() => {
  const interval = setInterval(() => {
    const fetchData = async () => {
      try {
        const [itensResponse, movimentosResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/itens'),
          axios.get('http://localhost:5001/api/movimentos')
        ]);
        setItens(itensResponse.data);
        setMovimentos(movimentosResponse.data.slice(0, 5));
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
    };
    fetchData();
  }, 30000); // Atualiza a cada 30 segundos

  return () => clearInterval(interval);
}, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itensResponse, movimentosResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/itens'),
          axios.get('http://localhost:5001/api/movimentos')
        ]);
        
        setItens(itensResponse.data);
        setMovimentos(movimentosResponse.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando dados do estoque...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Sistema de Controle de Estoque - Marketing</h1>
      
      <GraficosEstoque itens={itens} movimentos={movimentos} />
      
      <div className="resumo-estoque">
        <h2>Resumo do Estoque</h2>
        <div className="dashboard-grid">
          {itens.map(item => (
            <div 
              key={item.id} 
              className={`resumo-card ${item.quantidade < 10 ? 'estoque-baixo' : ''}`}
            >
              <h3>{item.nome}</h3>
              <p><strong>Quantidade:</strong> {item.quantidade}</p>
              <p><strong>Código:</strong> {item.numero}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="ultimas-movimentacoes">
        <h2>Últimas Movimentações</h2>
        {movimentos.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {movimentos.map(movimento => (
                <tr key={movimento.id}>
                  <td>{movimento.Item?.nome || 'N/A'}</td>
                  <td>{movimento.tipo}</td>
                  <td>{movimento.quantidade}</td>
                  <td>
                    {new Date(movimento.data).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </td>
                  <td>
                    <Link to={`/movimentos/${movimento.id}/impressao`} target="_blank">
                      Imprimir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma movimentação registrada</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;