import React, { useState } from 'react';
import axios from 'axios';
import styles from './CadastroItem.module.css';

function CadastroItem() {
  const [item, setItem] = useState({
    numero: '',
    nome: '',
    quantidade: 0
  });
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      // URL relativa para evitar problemas de CORS
      await axios.post('http://localhost:5001/api/itens', item);
      
      alert('Item cadastrado com sucesso!');
      setItem({ numero: '', nome: '', quantidade: 0 });
    } catch (error) {
      let mensagemErro = 'Erro ao cadastrar item';
      
      if (error.response) {
        // Erro do servidor (4xx/5xx)
        mensagemErro += `: ${error.response.data.error || error.response.status}`;
      } else if (error.request) {
        // Sem resposta do servidor
        mensagemErro = 'Servidor não respondeu. Verifique se o backend está rodando.';
      } else {
        // Erro de configuração
        mensagemErro += `: ${error.message}`;
      }
      
      setErro(mensagemErro);
      console.error('Erro completo:', error);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Itens</h2>
      
      {erro && <div className="mensagem erro">{erro}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número do Item:</label>
          <input
            type="text"
            name="numero"
            value={item.numero}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Nome do Item:</label>
          <input
            type="text"
            name="nome"
            value={item.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Quantidade Inicial:</label>
          <input
            type="number"
            name="quantidade"
            value={item.quantidade}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="btn-primary">Salvar</button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setItem({ numero: '', nome: '', quantidade: 0 })}
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroItem;