import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './GraficosEstoque.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function GraficosEstoque({ itens, movimentos }) {
  const dadosEstoque = {
    labels: itens.map(item => item.nome),
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: itens.map(item => item.quantidade),
        backgroundColor: 'rgba(53, 162, 235, 0.6)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcoesEstoque = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: 'Estoque por Item',
        font: { size: 18 }
      },
    },
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { font: { size: 12 } } }
    }
  };

  const contagemMovimentos = { Entrada: 0, Saída: 0, Devolução: 0 };
  movimentos.forEach(mov => { contagemMovimentos[mov.tipo]++; });

  const dadosMovimentos = {
    labels: Object.keys(contagemMovimentos),
    datasets: [
      {
        label: 'Quantidade de Movimentos',
        data: Object.values(contagemMovimentos),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
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

  const opcoesMovimentos = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: 'Movimentações',
        font: { size: 18 }
      }
    }
  };

  return (
    <div className="graficos-container">
      <div className="grafico">
        <Bar options={opcoesEstoque} data={dadosEstoque} />
      </div>
      <div className="grafico">
        <Pie options={opcoesMovimentos} data={dadosMovimentos} />
      </div>
    </div>
  );
}

export default GraficosEstoque;
