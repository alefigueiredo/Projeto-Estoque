import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ImpressaoMovimento.module.css';

// Definição local da URL base (caso não queira usar o arquivo config)
const API_BASE_URL = 'http://localhost:5001/api';

function ImpressaoMovimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movimento, setMovimento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [item, setItem] = useState(null);
  const [posto, setPosto] = useState(null);
  const [colaborador, setColaborador] = useState(null);
// Componente para impressão de comprovante de movimentação

  useEffect(() => {
    const carregarMovimento = async () => {
      try {
        console.log('Carregando movimento com ID:', id);
        
        // Verificar se temos um ID válido
        if (!id || isNaN(parseInt(id))) {
          setErro('ID de movimento inválido');
          setCarregando(false);
          return;
        }
        
        // Buscar movimento diretamente do banco de dados
        const movimentoRes = await axios.get(`${API_BASE_URL}/movimentos/${id}`);
        console.log('Resposta completa da API:', movimentoRes);
        
        // Verificar se a resposta é válida
        if (!movimentoRes.data) {
          setErro('Resposta da API inválida');
          setCarregando(false);
          return;
        }
        
        // Se a API retornou um erro
        if (movimentoRes.status === 404 || (movimentoRes.data && !movimentoRes.data.success)) {
          setErro(`Movimento #${id} não encontrado`);
          setCarregando(false);
          return;
        }
        
        // Extrair dados do movimento
        const movimentoData = movimentoRes.data.data;
        console.log('Dados do movimento:', movimentoData);
        
        if (!movimentoData) {
          setErro('Dados do movimento não encontrados');
          setCarregando(false);
          return;
        }
        
        setMovimento(movimentoData);
        
        // Verificar se temos os objetos relacionados incluídos ou IDs para buscá-los
        if (movimentoData.Item) {
          console.log('Item incluído na resposta:', movimentoData.Item);
          setItem(movimentoData.Item);
        } else if (movimentoData.itemId) {
          try {
            const itemRes = await axios.get(`${API_BASE_URL}/itens/${movimentoData.itemId}`);
            const itemData = itemRes.data.data || itemRes.data;
            console.log('Dados do item:', itemData);
            setItem(itemData);
          } catch (itemError) {
            console.error('Erro ao carregar item:', itemError);
          }
        }
        
        if (movimentoData.PostoAtendimento) {
          console.log('Posto incluído na resposta:', movimentoData.PostoAtendimento);
          setPosto(movimentoData.PostoAtendimento);
        } else if (movimentoData.postoId) {
          try {
            const postoRes = await axios.get(`${API_BASE_URL}/postos/${movimentoData.postoId}`);
            const postoData = postoRes.data.data || postoRes.data;
            console.log('Dados do posto:', postoData);
            setPosto(postoData);
          } catch (postoError) {
            console.error('Erro ao carregar posto:', postoError);
          }
        }
        
        if (movimentoData.Colaborador) {
          console.log('Colaborador incluído na resposta:', movimentoData.Colaborador);
          setColaborador(movimentoData.Colaborador);
        } else if (movimentoData.colaboradorId) {
          try {
            const colaboradorRes = await axios.get(`${API_BASE_URL}/colaboradores/${movimentoData.colaboradorId}`);
            const colaboradorData = colaboradorRes.data.data || colaboradorRes.data;
            console.log('Dados do colaborador:', colaboradorData);
            setColaborador(colaboradorData);
          } catch (colaboradorError) {
            console.error('Erro ao carregar colaborador:', colaboradorError);
          }
        }
        
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar movimento:", error);
        setErro(error.response?.data?.message || 'Erro ao carregar movimento');
        setCarregando(false);
      }
    };

    if (id) {
      carregarMovimento();
    } else {
      setErro('ID de movimento não fornecido');
      setCarregando(false);
    }
  }, [id]);

  const handleImprimir = () => {
    // Garantir que a impressão seja chamada após o DOM estar completamente renderizado
    setTimeout(() => {
      window.print();
    }, 300);
  };
  
  const handleVoltar = () => {
    navigate('/');
  };

  if (carregando) {
    return <div className="loading-container">Carregando movimento...</div>;
  }
  
  if (erro) {
    return (
      <div className="erro-container">
        <h2>Erro ao carregar movimento</h2>
        <p>{erro}</p>
        <button onClick={handleVoltar} className="btn-voltar">Voltar ao Dashboard</button>
      </div>
    );
  }

  if (!movimento) {
    return (
      <div className="erro-container">
        <h2>Movimento não encontrado</h2>
        <p>Não foi possível encontrar o movimento solicitado.</p>
        <button onClick={handleVoltar} className="btn-voltar">Voltar ao Dashboard</button>
      </div>
    );
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
          <p><strong>Data:</strong> {new Date(movimento.data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
          })}</p>
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