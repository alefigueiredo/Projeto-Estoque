import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Definição local da URL base (caso não queira usar o arquivo config)
const API_BASE_URL = 'http://localhost:5001/api';

function ImpressaoMovimento() {
  const { id } = useParams();
  const [movimento, setMovimento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [item, setItem] = useState(null);
  const [posto, setPosto] = useState(null);
  const [colaborador, setColaborador] = useState(null);
// Corrigir o formato da data para o fuso horário do Brasil
const formatarDataBrasil = (dataString) => {
  const data = new Date(dataString);
  // Ajusta para o fuso horário de Brasília (-3h)
  data.setHours(data.getHours() - 3);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  });
};

// No JSX:
<p><strong>Data:</strong> {formatarDataBrasil(movimento.data)}</p>

  useEffect(() => {
    const carregarMovimento = async () => {
      try {
        const movimentoRes = await axios.get(`${API_BASE_URL}/movimentos/${id}`);
        setMovimento(movimentoRes.data);
        
        // Carregar dados relacionados
        const [itemRes, postoRes, colaboradorRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/itens/${movimentoRes.data.itemId}`),
          axios.get(`${API_BASE_URL}/postos/${movimentoRes.data.postoId}`),
          axios.get(`${API_BASE_URL}/colaboradores/${movimentoRes.data.colaboradorId}`)
        ]);
        
        setItem(itemRes.data);
        setPosto(postoRes.data);
        setColaborador(colaboradorRes.data);
        
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar movimento:", error);
        setCarregando(false);
      }
    };

    carregarMovimento();
  }, [id]);

  const handleImprimir = () => {
    window.print();
  };

  if (carregando) {
    return <div>Carregando movimento...</div>;
  }

  if (!movimento) {
    return <div>Movimento não encontrado.</div>;
  }

  return (
    <div className="impressao-container">
      <button onClick={handleImprimir} className="btn-imprimir no-print">
        Imprimir Comprovante
      </button>
      
      <div className="comprovante">
        <h1>Comprovante de Movimentação de Estoque</h1>
        
        <div className="info-section">
          <h2>Dados da Movimentação</h2>
          <p><strong>ID:</strong> {movimento.id}</p>
          <p><strong>Tipo:</strong> {movimento.tipo}</p>
          <p><strong>Quantidade:</strong> {movimento.quantidade}</p>
          <p><strong>Data:</strong> {new Date(movimento.data).toLocaleString()}</p>
          <p><strong>Observação:</strong> {movimento.observacao || 'Nenhuma'}</p>
        </div>
        
        <div className="info-section">
          <h2>Item Movimentado</h2>
          <p><strong>Nome:</strong> {item?.nome || 'N/A'}</p>
          <p><strong>Código:</strong> {item?.numero || 'N/A'}</p>
        </div>
        
        <div className="info-section">
          <h2>Posto de Atendimento</h2>
          <p><strong>Número:</strong> {posto?.numero || 'N/A'}</p>
          <p><strong>Cidade:</strong> {posto?.cidade || 'N/A'}</p>
        </div>
        
        <div className="info-section">
          <h2>Colaborador</h2>
          <p><strong>Nome:</strong> {colaborador?.nome || 'N/A'}</p>
          <p><strong>Matrícula:</strong> {colaborador?.matricula || 'N/A'}</p>
          <p><strong>Cargo:</strong> {colaborador?.cargo || 'N/A'}</p>
        </div>
        
        <div className="assinaturas">
          <div className="assinatura">
            <p>_________________________________________</p>
            <p>Responsável pela Retirada</p>
          </div>
          
          <div className="assinatura">
            <p>_________________________________________</p>
            <p>Responsável pelo Envio</p>
          </div>
        </div>
        
        <div className="rodape">
          <p>Data de impressão: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default ImpressaoMovimento;