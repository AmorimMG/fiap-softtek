'use client';
import React, { useState, useEffect } from 'react';
import { RESTAPI } from './service/api';

const TicketForm = () => {
  const [nomeDoCliente, setNomeDoCliente] = useState('');
  const [suporteTecnico, setSuporteTecnico] = useState('');
  const [email, setEmail] = useState('');
  const [urgencia, setUrgencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modeloData, setModeloData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [fileContent, setFileContent] = useState('');

  const getModelo = (duvida) => {
    RESTAPI.ObterModelos(duvida).then((response) => {
      setModeloData(Array.isArray(response.data) ? response.data : []);
      setCurrentPage(0);
    }).catch((error) => {
      console.log(error);
      toast.add({
        severity: 'error',
        summary: error,
        life: 3000
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      nomeDoCliente,
      suporteTecnico,
      email,
      urgencia,
      descricao
    };
    
    getModelo(data.suporteTecnico);
  };

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  const handleNextAnswer = () => {
    if ((currentPage + 1) * 3 < modeloData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousAnswer = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchFileContent = async (fileName) => {
    try {
      const response = await fetch(`/modelos/${fileName}.txt`);
      if (!response.ok) throw new Error('File not found');
      const content = await response.text();
      setFileContent(content);
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContent('Error: Could not load file content.');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
    fetchFileContent(item.nomeArquivo);
  };

  return (
    <div className="w-full h-screen p-4 bg-white rounded shadow-md text-black">
        <div className="p-4 max-w-md">
            <h1 className="text-3xl font-bold mb-4">Criar Ticket</h1>
            <p className="mb-4">Descreva abaixo o problema do cliente</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="nomeDoCliente">
                    Nome do Cliente:
                </label>
                <input
                    type="text"
                    id="nomeDoCliente"
                    value={nomeDoCliente}
                    onChange={(e) => setNomeDoCliente(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                </div>
                <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="suporteTecnico">
                    Suporte Técnico:
                </label>
                <input
                    type="text"
                    id="suporteTecnico"
                    value={suporteTecnico}
                    onChange={(e) => setSuporteTecnico(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                </div>
                <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="email">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                </div>
                <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="urgencia">
                    Urgência:
                </label>
                <select
                    id="urgencia"
                    value={urgencia}
                    onChange={(e) => setUrgencia(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">Selecione</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                </select>
                </div>
                <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="descricao">
                    Descrição:
                </label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                </div>
                <button
                type="submit"
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Enviar
                </button>
            </form>
        </div>
        {showModal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white rounded shadow-md p-8 relative w-[800px] h-[600px] flex flex-col">
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
      >
        X
      </button>
      <div className="flex-grow overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Duvidas Frequentes</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Suporte Técnico</label>
          <input
            type="text"
            readOnly
            value={suporteTecnico}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Possíveis Soluções:</label>
          <div className="space-y-2">
            {Array.isArray(modeloData) && modeloData.length > 0
              ? modeloData.slice(currentPage * 3, (currentPage + 1) * 3).map((item, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-100 rounded">
                    <div 
                      onClick={() => handleItemClick(item)}
                      className="cursor-pointer p-1 hover:bg-gray-200 rounded mr-2"
                    >
                      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-sm flex-grow">{item.nomeArquivo}</span>
                  </div>
                ))
              : <p>Não há soluções disponíveis</p>
            }
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <button
          onClick={handlePreviousAnswer}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 0}
        >
          Solução Anterior
        </button>
        <button
          onClick={handleNextAnswer}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${(currentPage + 1) * 3 >= modeloData.length ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={(currentPage + 1) * 3 >= modeloData.length}
        >
          Próxima Solução
        </button>
      </div>
    </div>
  </div>
        )}

    {showItemModal && selectedItem && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-md p-8 relative w-[800px] max-h-[80vh] flex flex-col">
          <button
            onClick={closeItemModal}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            X
          </button>
          <div className="flex-grow overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Detalhes do Item</h2>
            <p><strong>Nome do Arquivo:</strong> {selectedItem.nomeArquivo}</p>
            <p><strong>Ocorrências de Palavras-Chave:</strong> {selectedItem.ocorrenciasDePalavrasChave}</p>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Conteúdo do Arquivo:</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                {fileContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default TicketForm;
