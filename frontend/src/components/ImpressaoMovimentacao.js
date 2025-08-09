import React from 'react';

const ImpressaoMovimentacao = React.forwardRef(({ movimento, item, posto, colaborador }, ref) => {
  return (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>Comprovante de Movimentação</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Tipo:</td>
            <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{movimento.tipo}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Item:</td>
            <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{item?.numero} - {item?.nome}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Quantidade:</td>
            <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{movimento.quantidade}</td>
          </tr>
          {/* Adicione mais campos conforme necessário */}
        </tbody>
      </table>
      <p style={{ marginTop: '20px', textAlign: 'right' }}>
        Data: {new Date(movimento.data).toLocaleDateString()}
      </p>
    </div>
  );
});

export default ImpressaoMovimentacao;