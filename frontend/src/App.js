import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HelloWorld from './contracts/HelloWorld.json';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [web3, setWeb3] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        const netId = await web3Instance.eth.net.getId();
        console.log('Connected to network:', netId);
        setNetworkId(netId);
      } catch (err) {
        console.error('Error initializing Web3:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initWeb3();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
  }, []); // Only run once on mount

  useEffect(() => {
    const loadContract = async () => {
      if (!web3 || !networkId) return;

      try {
        // gget contract
        const deployedNetwork = HelloWorld.networks[networkId];
        
        if (!deployedNetwork) {
          throw new Error(`Please connect to Ganache. Current Network ID: ${networkId}`);
        }

        const contractInstance = new web3.eth.Contract(
          HelloWorld.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);

     
        const result = await contractInstance.methods.getName().call();
        setName(result);
        setError(''); 
      } catch (err) {
        console.error('Error loading contract:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, [web3, networkId]);

  const handleNameChange = (e) => {
    setInputName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    setLoading(true);
    try {
      await contract.methods.setName(inputName).send({ from: account });
      const newName = await contract.methods.getName().call();
      setName(newName);
      setInputName('');
      setError('');
    } catch (err) {
      console.error('Error updating name:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="App">
      <header className="App-header">
        <div className="message-container">
          <h1>BlockChain Message Board</h1>
          <h4>Current Message: {name || 'Loading...'}</h4>
          <form onSubmit={handleSubmit} className="name-form">
            <input
              type="text"
              value={inputName}
              onChange={handleNameChange}
              placeholder="Enter new name"
              className="name-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !inputName.trim()}>
              Update 
            </button>
          </form>
          <button 
            className="refresh-button"
            onClick={async () => {
              try {
                setLoading(true);
                await contract.methods.clearMessage().send({ from: account });
                const newName = await contract.methods.getName().call();
                setName(newName || 'No message set');
              } catch (err) {
                console.error('Error clearing message:', err);
                setError(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
           Refresh
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;