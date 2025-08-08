import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PesquisaEstoque() {
  const [itens, setItens] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

  useEffect(() => {
    const carregarItens = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/itens');
        setItens(response.data);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setCarregando(false);
      }
    };
    
    carregarItens();
  }, []);

  const handleOrdenar = (campo) => {
    if (ordenacao.campo === campo) {
      setOrdenacao({
        campo,
        direcao: ordenacao.direcao === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setOrdenacao({
        campo,
        direcao: 'asc'
      });
    }
  };

  const itensFiltrados = itens.filter(item => 
    item.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    item.numero.toLowerCase().includes(filtro.toLowerCase())
  );

  // Ordenar os itens
  const itensOrdenados = [...itensFiltrados].sort((a, b) => {
    if (a[ordenacao.campo] < b[ordenacao.campo]) {
      return ordenacao.direcao === 'asc' ? -1 : 1;
    }
    if (a[ordenacao.campo] > b[ordenacao.campo]) {
      return ordenacao.direcao === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="pesquisa-container">
      <h2>Pesquisa de Estoque</h2>
      
      <div className="filtro">
        <input
          type="text"
          placeholder="Pesquisar por nome ou código..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      
      {carregando ? (
        <p>Carregando itens...</p>
      ) : (
        <table className="tabela-estoque">
          <thead>
            <tr>
              <th onClick={() => handleOrdenar('numero')}>
                Código {ordenacao.campo === 'numero' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleOrdenar('nome')}>
                <div className="flex items-center">
                  Nome 
                  {ordenacao.campo === 'nome' && (
                    <span className="ml-1">
                      {ordenacao.direcao === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th onClick={() => handleOrdenar('quantidade')}>
                Quantidade {ordenacao.campo === 'quantidade' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {itensOrdenados.map(item => (
              <tr key={item.id} className={item.quantidade < 10 ? 'estoque-baixo' : ''}>
                <td>{item.numero}</td>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {itensFiltrados.length === 0 && !carregando && (
        <p>Nenhum item encontrado com o filtro informado.</p>
      )}
      
      <div className="total-itens">
        Total de itens encontrados: {itensFiltrados.length}
      </div>
    </div>
  );
}

export default PesquisaEstoque;