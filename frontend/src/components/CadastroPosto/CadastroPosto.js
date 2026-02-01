import React, { useState } from 'react';
import axios from 'axios';

function CadastroPosto() {
  const [posto, setPosto] = useState({
    numero: '',
    cidade: '',
    uf: 'SP', // Adicionei UF como campo padrão
    responsavel: ''
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPosto({
      ...posto,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    
    try {
      // Validação básica
      if (!posto.numero || !posto.cidade || !posto.uf) {
        throw new Error('Preencha os campos obrigatórios');
      }

      await axios.post('http://localhost:5001/api/postos', posto);
      
      setMensagem('Posto cadastrado com sucesso!');
      setPosto({ 
        numero: '', 
        cidade: '',
        uf: 'SP',
        responsavel: ''
      });
      
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      let mensagemErro = 'Erro ao cadastrar posto';
      
      if (error.response) {
        mensagemErro += `: ${error.response.data.error || error.response.status}`;
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      setErro(mensagemErro);
      console.error('Erro completo:', error);
    }
  };

  const estadosBrasil = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="form-container">
      <h2>Cadastro de Posto de Atendimento</h2>
      
      {erro && <div className="mensagem erro">{erro}</div>}
      {mensagem && <div className="mensagem sucesso">{mensagem}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Número do P.A.:</label>
          <input
            type="text"
            name="numero"
            className="form-control"
            value={posto.numero}
            onChange={handleChange}
            required
            maxLength="10"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">Cidade:</label>
            <input
              type="text"
              name="cidade"
              className="form-control"
              value={posto.cidade}
              onChange={handleChange}
              required
              maxLength="50"
            />
          </div>
          
          <div className="select-container" style={{ flex: 1 }}>
            <label className="form-label">UF:</label>
            <select
              name="uf"
              className="form-control select-field"
              value={posto.uf}
              onChange={handleChange}
              required
            >
              {estadosBrasil.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Responsável (opcional):</label>
          <input
            type="text"
            name="responsavel"
            className="form-control"
            value={posto.responsavel}
            onChange={handleChange}
            maxLength="100"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setPosto({ 
              numero: '', 
              cidade: '',
              uf: 'SP',
              responsavel: ''
            })}
          >
            Limpar
          </button>
          <button type="submit" className="btn-primary">
            Salvar Posto
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroPosto;