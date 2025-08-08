import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

function MovimentacaoEstoque() {
  const [movimento, setMovimento] = useState({
    tipo: 'Entrada',
    itemId: '',
    postoId: '',
    colaboradorId: '',
    quantidade: 0,
    data: new Date().toISOString().slice(0, 16), // Formato ISO com hora
    observacao: ''
  });

  const [itens, setItens] = useState([]);
  const [postos, setPostos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    console.log("Itens carregados:", itens);
    console.log("Postos carregados:", postos);
    console.log("Colaboradores carregados:", colaboradores);
  }, [itens, postos, colaboradores]);
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [itensRes, postosRes, colaboradoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/itens`),
          axios.get(`${API_BASE_URL}/postos`),
          axios.get(`${API_BASE_URL}/colaboradores`)
        ]);
        
        setItens(itensRes.data);
        setPostos(postosRes.data);
        setColaboradores(colaboradoresRes.data);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Falha ao carregar dados. Tente recarregar a página.');
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const handleChange = (e) => {
    setMovimento({
      ...movimento,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const itemId = Number(movimento.itemId);
    const item = itens.find(i => Number(i.id) === itemId);
    
    if (!item) throw new Error('Item não encontrado');

    // Converter para número
    const quantidadeMov = Number(movimento.quantidade);
    
    if (movimento.tipo !== 'Entrada') {
      if (quantidadeMov > item.quantidade) {
        throw new Error(`Quantidade indisponível em estoque (Disponível: ${item.quantidade})`);
      }
    }

    // Atualiza localmente primeiro para resposta imediata
    const novaQuantidade = movimento.tipo === 'Entrada' 
      ? item.quantidade + quantidadeMov
      : item.quantidade - quantidadeMov;

    // Atualiza estado local
    setItens(itens.map(i => 
      Number(i.id) === itemId ? {...i, quantidade: novaQuantidade} : i
    ));

    // Envia para o servidor
    await axios.post(`${API_BASE_URL}/movimentos`, {
      ...movimento,
      itemId: itemId,
      quantidade: quantidadeMov
    });

    await axios.put(`${API_BASE_URL}/itens/${itemId}`, {
      quantidade: novaQuantidade
    });

    alert('Movimentação registrada com sucesso!');
    setMovimento({
      ...movimento,
      quantidade: 0,
      observacao: ''
    });
  } catch (error) {
    alert(`Erro: ${error.message}`);
    console.error('Detalhes:', error);
  }
};

  if (carregando) {
    return <div>Carregando dados...</div>;
  }

  if (erro) {
    return <div className="erro">{erro}</div>;
  }

  return (
    <div className="movimentacao-container">
      <h2>Movimentação de Estoque</h2>
      
      {erro && <div className="mensagem erro">{erro}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo:</label>
          <select 
            name="tipo" 
            value={movimento.tipo} 
            onChange={handleChange} 
            required
          >
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
            <option value="Devolução">Devolução</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Item:</label>
          <select 
            name="itemId" 
            value={movimento.itemId} 
            onChange={handleChange} 
            required
          >
            <option value="">Selecione um item</option>
            {itens.map(item => (
              <option key={item.id} value={item.id}>
                {item.numero} - {item.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Posto de Atendimento:</label>
          <select 
            name="postoId" 
            value={movimento.postoId} 
            onChange={handleChange} 
            required
          >
            <option value="">Selecione um P.A.</option>
            {postos.map(posto => (
              <option key={posto.id} value={posto.id}>
                {posto.numero} - {posto.cidade}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Colaborador:</label>
          <select 
            name="colaboradorId" 
            value={movimento.colaboradorId} 
            onChange={handleChange} 
            required
          >
            <option value="">Selecione um colaborador</option>
            {colaboradores.map(colab => (
              <option key={colab.id} value={colab.id}>
                {colab.matricula} - {colab.nome}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            value={movimento.quantidade}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Data:</label>
          <input
            type="datetime-local"
            name="data"
            value={movimento.data}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Observação:</label>
          <textarea
            name="observacao"
            value={movimento.observacao}
            onChange={handleChange}
            placeholder="Motivo da movimentação"
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary">OK</button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setMovimento({
              tipo: 'Entrada',
              itemId: '',
              postoId: '',
              colaboradorId: '',
              quantidade: 0,
              data: new Date().toISOString().split('T')[0],
              observacao: ''
            })}
          >
            Limpar
          </button>
          <button 
            type="button" 
            className="btn-danger"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovimentacaoEstoque;