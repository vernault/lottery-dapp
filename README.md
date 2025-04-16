# Decentralized Lottery dApp

This project is a decentralized lottery application built on the Ethereum blockchain. Users can enter the lottery by purchasing tickets with ETH, and a random winner is selected after a set time using Chainlink's Verifiable Random Function (VRF).

## Features

- Users can buy lottery tickets by sending ETH to the smart contract.
- Only the owner of the contract can start and end the lottery.
- A winner is chosen randomly using Chainlink VRF, ensuring fair randomness.
- The winner receives the entire prize pool, minus a small fee for the contract owner.
- The contract is designed to prevent reentrancy attacks.

## Tech Stack

- **Solidity**: For writing the smart contract.
- **Hardhat**: For deployment and testing of the smart contract.
- **Ethers.js**: For interacting with the Ethereum blockchain from the frontend.
- **Next.js**: For building the frontend application.
- **Chainlink VRF**: For generating verifiable random numbers.
- **Alchemy**: For enhanced blockchain interactions.

## Project Structure

```
decentralized-lottery-dapp
├── contracts
│   └── Lottery.sol          # Solidity smart contract for the lottery
├── frontend
│   ├── components
│   │   └── LotteryForm.tsx  # React component for entering the lottery
│   ├── pages
│   │   ├── index.tsx        # Main page of the frontend application
│   │   └── _app.tsx         # Custom App component for Next.js
│   ├── public               # Static assets for the frontend
│   └── styles
│       └── globals.css      # Global CSS styles
├── scripts
│   ├── deploy.js            # Script for deploying the Lottery contract
│   └── interact.js          # Script for interacting with the deployed contract
├── test
│   └── Lottery.test.js      # Test cases for the Lottery contract
├── hardhat.config.js        # Hardhat configuration file
├── package.json             # npm configuration file
├── README.md                # Project documentation
└── tsconfig.json            # TypeScript configuration file
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd decentralized-lottery-dapp
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Deploy the smart contract**:
   ```
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

4. **Run the frontend**:
   ```
   cd frontend
   npm run dev
   ```

5. **Interact with the dApp**: Open your browser and navigate to `http://localhost:3000` to access the lottery application.

## License

This project is licensed under the MIT License.