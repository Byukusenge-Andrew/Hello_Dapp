import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HelloWorld from './contracts/HelloWorld.json';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Connect to MetaMask
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the contract
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = HelloWorld.networks[networkId];
        
        if (!deployedNetwork) {
          throw new Error('Please connect to Ganache');
        }

        const contract = new web3.eth.Contract(
          HelloWorld.abi,
          deployedNetwork.address
        );

        // Get name from contract
        const result = await contract.methods.getName().call();
        setName(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, []);

  if (loading) return <div className="App">Loading...</div>;
  if (error) return <div className="App">Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello {name}</h1>
      </header>
    </div>
  );
}

export default App;