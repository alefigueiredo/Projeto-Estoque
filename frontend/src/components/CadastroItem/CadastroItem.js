import React, { useState } from 'react';
import axios from 'axios';

function CadastroItem() {
  const [item, setItem] = useState({
    numero: '',
    nome: '',
    quantidade: 0,
    tipo: 'Brinde' // Adicionei tipo como campo padrão
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({
      ...item,
      [name]: name === 'quantidade' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    
    try {
      // Validação básica
      if (!item.numero || !item.nome || item.quantidade < 0) {
        throw new Error('Preencha todos os campos corretamente');
      }

      await axios.post('http://localhost:5001/api/itens', item);
      
      setMensagem('Item cadastrado com sucesso!');
      setItem({ 
        numero: '', 
        nome: '', 
        quantidade: 0,
        tipo: 'Brinde'
      });
      
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      let mensagemErro = 'Erro ao cadastrar item';
      
      if (error.response) {
        mensagemErro += `: ${error.response.data.error || error.response.status}`;
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      setErro(mensagemErro);
      console.error('Erro completo:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Itens</h2>
      
      {erro && <div className="mensagem erro">{erro}</div>}
      {mensagem && <div className="mensagem sucesso">{mensagem}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Número do Item:</label>
          <input
            type="text"
            name="numero"
            className="form-control"
            value={item.numero}
            onChange={handleChange}
            required
            maxLength="20"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Nome do Item:</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={item.nome}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantidade Inicial:</label>
            <input
              type="number"
              name="quantidade"
              className="form-control"
              value={item.quantidade}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="select-container">
            <label className="form-label">Tipo de Item:</label>
            <select
              name="tipo"
              className="form-control select-field"
              value={item.tipo}
              onChange={handleChange}
              required
            >
              <option value="Brinde">Brinde</option>
              <option value="Consumível">Consumível</option>
              <option value="Material">Material</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setItem({ 
              numero: '', 
              nome: '', 
              quantidade: 0,
              tipo: 'Brinde'
            })}
          >
            Limpar
          </button>
          <button type="submit" className="btn-primary">
            Salvar Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroItem;