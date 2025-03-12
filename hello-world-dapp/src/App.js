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
        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        // Initialize Web3
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Get network ID
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

  if (loading) return (
    <div className="App">
      <header className="App-header">
        <p>Loading... Please make sure you are connected to Ganache through MetaMask</p>
      </header>
    </div>
  );

  if (error) return (
    <div className="App">
      <header className="App-header">
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please make sure:</p>
          <ul>
            <li>Ganache is running on port 7545</li>
            <li>MetaMask is connected to Ganache (http://127.0.0.1:7545)</li>
            <li>You have deployed your contract using 'truffle migrate --reset'</li>
          </ul>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry Connection
          </button>
        </div>
      </header>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello {name}</h1>
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
            Update Name
          </button>
        </form>
        <p>Connected to network ID: {networkId}</p>
        {account && <p>Connected Account: {account}</p>}
      </header>
    </div>
  );
}

export default App;