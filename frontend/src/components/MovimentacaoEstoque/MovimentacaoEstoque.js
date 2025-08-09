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

        // Ajuste para a estrutura da sua API (resposta com success e data)
        setItens(itensRes.data.success ? itensRes.data.data : []);
        setPostos(postosRes.data.success ? postosRes.data.data : []);
        setColaboradores(colaboradoresRes.data.success ? colaboradoresRes.data.data : []);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados do servidor');
        setItens([]);
        setPostos([]);
        setColaboradores([]);
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
      // Validação dos campos
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

      // Preparar dados para a API
      const dadosMovimento = {
        tipo: movimento.tipo,
        itemId: itemId,
        postoId: Number(movimento.postoId),
        colaboradorId: Number(movimento.colaboradorId),
        quantidade: quantidadeMov,
        data: movimento.data,
        observacao: movimento.observacao || null
      };

      // Enviar para a API
      const [movimentoRes, itemRes] = await Promise.all([
        axios.post(`${API_BASE_URL}/movimentos`, dadosMovimento),
        axios.put(`${API_BASE_URL}/itens/${itemId}`, {
          quantidade: movimento.tipo === 'Entrada' 
            ? item.quantidade + quantidadeMov 
            : item.quantidade - quantidadeMov
        })
      ]);

      // Atualizar estado local
      setItens(itens.map(i => 
        i.id === itemId ? { 
          ...i, 
          quantidade: movimento.tipo === 'Entrada' 
            ? i.quantidade + quantidadeMov 
            : i.quantidade - quantidadeMov 
        } : i
      ));

      // Preparar dados para impressão
      const posto = postos.find(p => p.id === Number(movimento.postoId));
      const colaborador = colaboradores.find(c => c.id === Number(movimento.colaboradorId));

      // Gerar comprovante de impressão
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprovante de Movimentação</title>
            <style>
              body { font-family: Arial; margin: 20px; }
              h1 { color: #333; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { margin-bottom: 30px; }
              .footer { margin-top: 30px; font-size: 0.8em; text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Comprovante de Movimentação</h1>
              <p style="text-align: center;">Nº ${movimentoRes.data.data?.id || 'N/A'}</p>
            </div>
            
            <table>
              <tr>
                <th>Tipo de Movimentação</th>
                <td>${movimento.tipo}</td>
              </tr>
              <tr>
                <th>Item</th>
                <td>${item.numero} - ${item.nome}</td>
              </tr>
              <tr>
                <th>Quantidade</th>
                <td>${movimento.quantidade}</td>
              </tr>
              <tr>
                <th>Posto de Atendimento</th>
                <td>${posto?.numero || 'N/A'} - ${posto?.cidade || 'N/A'}</td>
              </tr>
              <tr>
                <th>Colaborador</th>
                <td>${colaborador?.matricula || 'N/A'} - ${colaborador?.nome || 'N/A'}</td>
              </tr>
              <tr>
                <th>Data/Hora</th>
                <td>${new Date(movimento.data).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Observações</th>
                <td>${movimento.observacao || 'Nenhuma'}</td>
              </tr>
            </table>

            <div class="footer">
              <p>Emitido em: ${new Date().toLocaleString()}</p>
            </div>

            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 300);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      alert('Movimentação registrada com sucesso!');
      
      // Resetar formulário (exceto tipo e data)
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
    <div className="movimentacao-container">
      <h2>Movimentação de Estoque</h2>
      
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
        
        <div className="form-group">
          <label>Posto de Atendimento:</label>
          <select 
            name="postoId" 
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
        
        <div className="form-group">
          <label>Colaborador:</label>
          <select 
            name="colaboradorId" 
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
          <button type="submit" className="btn-primary">
            Registrar Movimentação
          </button>
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
        </div>
      </form>
    </div>
  );
}

export default MovimentacaoEstoque;