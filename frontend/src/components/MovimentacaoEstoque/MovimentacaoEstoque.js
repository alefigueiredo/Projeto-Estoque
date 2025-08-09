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
    data: new Date().toISOString().slice(0, 16),
    observacao: ''
  });

  const [itens, setItens] = useState([]);
  const [postos, setPostos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [itensRes, postosRes, colaboradoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/itens`),
          axios.get(`${API_BASE_URL}/postos`),
          axios.get(`${API_BASE_URL}/colaboradores`)
        ]);

        setItens(itensRes.data.success ? itensRes.data.data : []);
        setPostos(postosRes.data.success ? postosRes.data.data : []);
        setColaboradores(colaboradoresRes.data.success ? colaboradoresRes.data.data : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados do servidor');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovimento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!movimento.itemId || !movimento.postoId || !movimento.colaboradorId || movimento.quantidade <= 0) {
        throw new Error('Preencha todos os campos obrigatórios com valores válidos');
      }

      const itemId = Number(movimento.itemId);
      const item = itens.find(i => Number(i.id) === itemId);
      
      if (!item) {
        throw new Error('Item selecionado não encontrado');
      }

      const quantidadeMov = Number(movimento.quantidade);
      
      if (movimento.tipo !== 'Entrada' && quantidadeMov > item.quantidade) {
        throw new Error(`Quantidade indisponível em estoque (Disponível: ${item.quantidade})`);
      }

      const dadosMovimento = {
        tipo: movimento.tipo,
        itemId: itemId,
        postoId: Number(movimento.postoId),
        colaboradorId: Number(movimento.colaboradorId),
        quantidade: quantidadeMov,
        data: movimento.data,
        observacao: movimento.observacao || null
      };

      const [movimentoRes, itemRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/movimentos`, dadosMovimento),
        axios.put(`${API_BASE_URL}/itens/${itemId}`, {
          quantidade: movimento.tipo === 'Entrada' 
            ? item.quantidade + quantidadeMov 
            : item.quantidade - quantidadeMov
        })
      ]);

      setItens(itens.map(i => 
        i.id === itemId ? { 
          ...i, 
          quantidade: movimento.tipo === 'Entrada' 
            ? i.quantidade + quantidadeMov 
            : i.quantidade - quantidadeMov 
        } : i
      ));

      alert('Movimentação registrada com sucesso!');
      setMovimento(prev => ({
        tipo: prev.tipo,
        itemId: '',
        postoId: '',
        colaboradorId: '',
        quantidade: 0,
        data: new Date().toISOString().slice(0, 16),
        observacao: ''
      }));
    } catch (error) {
      console.error('Erro ao processar movimentação:', error);
      alert(`Erro: ${error.response?.data?.message || error.message}`);
    }
  };

  if (carregando) {
    return <div className="loading">Carregando dados...</div>;
  }

  if (erro) {
    return <div className="error-message">{erro}</div>;
  }

  return (
    <div className="form-container">
      <h2>Movimentação de Estoque</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="select-container">
            <label className="form-label">Tipo:</label>
            <select 
              name="tipo" 
              className="form-control select-field"
              value={movimento.tipo} 
              onChange={handleChange} 
              required
            >
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
              <option value="Devolução">Devolução</option>
            </select>
          </div>
          
          <div className="select-container">
            <label className="form-label">Item:</label>
            <select 
              name="itemId" 
              className="form-control select-field"
              value={movimento.itemId} 
              onChange={handleChange} 
              required
              disabled={itens.length === 0}
            >
              <option value="">{itens.length === 0 ? 'Carregando itens...' : 'Selecione um item'}</option>
              {itens.map(item => (
                <option key={item.id} value={item.id}>
                  {item.numero} - {item.nome} (Estoque: {item.quantidade})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="select-container">
            <label className="form-label">Posto de Atendimento:</label>
            <select 
              name="postoId" 
              className="form-control select-field"
              value={movimento.postoId} 
              onChange={handleChange} 
              required
              disabled={postos.length === 0}
            >
              <option value="">{postos.length === 0 ? 'Carregando postos...' : 'Selecione um posto'}</option>
              {postos.map(posto => (
                <option key={posto.id} value={posto.id}>
                  {posto.numero} - {posto.cidade}
                </option>
              ))}
            </select>
          </div>
          
          <div className="select-container">
            <label className="form-label">Colaborador:</label>
            <select 
              name="colaboradorId" 
              className="form-control select-field"
              value={movimento.colaboradorId} 
              onChange={handleChange} 
              required
              disabled={colaboradores.length === 0}
            >
              <option value="">{colaboradores.length === 0 ? 'Carregando colaboradores...' : 'Selecione um colaborador'}</option>
              {colaboradores.map(colab => (
                <option key={colab.id} value={colab.id}>
                  {colab.matricula} - {colab.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantidade:</label>
            <input
              type="number"
              name="quantidade"
              className="form-control"
              value={movimento.quantidade}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Data:</label>
            <input
              type="datetime-local"
              name="data"
              className="form-control"
              value={movimento.data}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Observação:</label>
          <textarea
            name="observacao"
            className="form-control"
            value={movimento.observacao}
            onChange={handleChange}
            rows="3"
            placeholder="Motivo da movimentação"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setMovimento({
              tipo: movimento.tipo,
              itemId: '',
              postoId: '',
              colaboradorId: '',
              quantidade: 0,
              data: new Date().toISOString().slice(0, 16),
              observacao: ''
            })}
          >
            Limpar Campos
          </button>
          <button type="submit" className="btn-primary">
            Registrar Movimentação
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovimentacaoEstoque;