## Running the Full Project

To run the full project, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- [Truffle](https://www.trufflesuite.com/truffle) (install via npm)
- [Ganache](https://www.trufflesuite.com/ganache) (for local blockchain)
- [MetaMask](https://metamask.io/) (browser extension for Ethereum wallet)

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Byukusenge-Andrew/Hello_Dapp.git
   cd Hello_Dapp
   ```

2. **Install Dependencies**:
   Navigate to the project directory and install the required packages:
   ```bash
   npm install
   ```

3. **Start Ganache**:
   Open Ganache and create a new workspace. This will start a local Ethereum blockchain.

4. **Compile Contracts**:
   In your project directory, compile the smart contracts:
   ```bash
   truffle compile
   ```

5. **Migrate Contracts**:
   Deploy the contracts to the local Ganache blockchain:
   ```bash
   truffle migrate
   ```

6. **Connect MetaMask**:
   - Open your MetaMask extension.
   - Create a new account or import an existing one.
   - Connect MetaMask to the Ganache network:
     - Click on the network dropdown in MetaMask and select "Custom RPC".
     - Enter the following details:
       - **Network Name**: Ganache
       - **New RPC URL**: `http://127.0.0.1:7545`
       - **Chain ID**: 1337 (or the chain ID shown in Ganache)
     - Click "Save".

7. **Interact with the DApp**:
   You can now interact with your deployed contracts through your DApp interface.

### Full Deployment

To deploy your contracts to a live network (e.g., Rinkeby, Mainnet), you will need to configure your `truffle-config.js` with the appropriate network settings and provide your wallet's private key and Infura/Alchemy project ID.
