import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function GraficosEstoque({ itens, movimentos }) {
  // Dados para o gráfico de barras (estoque)
  const dadosEstoque = {
    labels: itens.map(item => item.nome),
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: itens.map(item => item.quantidade),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const opcoesEstoque = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estoque por Item',
      },
    },
  };

  // Contar movimentos por tipo
  const contagemMovimentos = {
    Entrada: 0,
    Saída: 0,
    Devolução: 0
  };

  movimentos.forEach(mov => {
    contagemMovimentos[mov.tipo]++;
  });

  // Dados para o gráfico de pizza (movimentações)
  const dadosMovimentos = {
    labels: Object.keys(contagemMovimentos),
    datasets: [
      {
        label: 'Quantidade de Movimentos',
        data: Object.values(contagemMovimentos),
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="graficos-container">
      <div className="grafico">
        <Bar options={opcoesEstoque} data={dadosEstoque} />
      </div>
      
      <div className="grafico">
        <Pie data={dadosMovimentos} />
      </div>
    </div>
  );
}

export default GraficosEstoque;