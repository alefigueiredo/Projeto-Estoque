import React, { useState } from 'react';
import axios from 'axios';

function CadastroColaborador() {
  const [colaborador, setColaborador] = useState({
    matricula: '',
    nome: '',
    cargo: ''
  });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setColaborador({
      ...colaborador,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/colaboradores', colaborador);
      setMensagem('Colaborador cadastrado com sucesso!');
      setColaborador({ matricula: '', nome: '', cargo: '' });
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      setMensagem('Erro ao cadastrar colaborador: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Colaborador</h2>
      
      {mensagem && (
        <div className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Matrícula:</label>
          <input
            type="text"
            name="matricula"
            className="form-control"
            value={colaborador.matricula}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={colaborador.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Cargo:</label>
          <input
            type="text"
            name="cargo"
            className="form-control"
            value={colaborador.cargo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setColaborador({ matricula: '', nome: '', cargo: '' })}
          >
            Limpar
          </button>
          <button type="submit" className="btn-primary">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroColaborador;