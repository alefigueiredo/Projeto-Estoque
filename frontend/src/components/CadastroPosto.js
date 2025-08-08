import React, { useState } from 'react';
import axios from 'axios';

function CadastroPosto() {
  const [posto, setPosto] = useState({
    numero: '',
    cidade: ''
  });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setPosto({
      ...posto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Removida a variável response não utilizada
      await axios.post('http://localhost:5001/api/postos', posto);
      setMensagem('Posto cadastrado com sucesso!');
      setPosto({ numero: '', cidade: '' });
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      setMensagem('Erro ao cadastrar posto: ' + error.message);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Posto de Atendimento</h2>
      {mensagem && <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>{mensagem}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número do P.A.:</label>
          <input
            type="text"
            name="numero"
            value={posto.numero}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={posto.cidade}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Salvar</button>
        <button type="button" className="btn-secondary" onClick={() => setPosto({ numero: '', cidade: '' })}>
          Limpar
        </button>
      </form>
    </div>
  );
}

export default CadastroPosto;
