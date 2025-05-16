# Medilocker Smart Contracts

This package contains the Solidity smart contracts for the Medilocker decentralized medical data vault.

## Contracts Overview

- `MedicalRecordRegistry.sol`: Main contract for storing record hashes and managing access control
- `ChainlinkOracle.sol`: Handler for Chainlink Functions to fetch health metrics
- `AccessControl.sol`: NFT-based permissions system for doctor access
- `BaseNamesResolver.sol`: Integration with Base L2 naming system

## Development

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base testnet
npx hardhat run scripts/deploy.js --network base-testnet
```

## Contract Addresses (Base Testnet)

- MedicalRecordRegistry: `0x...`
- ChainlinkOracle: `0x...`
- AccessControl: `0x...` 