# Notarize Smart Contract

This repository contains a Solidity smart contract named "Notarize" which provides functionality for notarizing documents on the blockchain. The contract allows designated "hash writers" to add new documents along with their corresponding cryptographic hashes, which are then stored on-chain for verification purposes.

The smartcontract is deployed at address [0x6dCb6Cde4a94Fe51B9b2d512f131eF575db2d663](https://mumbai.polygonscan.com/address/0x6dCb6Cde4a94Fe51B9b2d512f131eF575db2d663) on Mumbai test network

## Features

- Role-based Access Control: The contract uses OpenZeppelin's AccessControlEnumerable library to manage roles. There are two main roles in the contract:
  1. **DEFAULT_ADMIN_ROLE**: The default admin role that is granted to the contract deployer. It can manage other roles.
  2. **HASH_WRITER**: A custom role that allows designated addresses to add new documents and their hashes.

- Document Notarization: The contract allows hash writers to add new documents and their cryptographic hashes to the blockchain. Each document is associated with a unique counter value that can be used to retrieve document information.

- Document Information Retrieval: Anyone can query the contract to get information about a specific document by providing its counter value.

- Registered Hash Check: The contract also allows users to check whether a specific cryptographic hash is already registered or not.

## Usage

To use this smart contract, follow the steps below:

1. Clone the repository and navigate to the contract directory.

2. Make sure you have the required dependencies:
   - Solidity compiler version 0.8.19 or compatible.
   - OpenZeppelin Contracts library version compatible with 0.8.19.

3. Deploy the contract to the Ethereum network of your choice using a development environment like Remix, Truffle, or Hardhat.

4. Grant the HASH_WRITER role to the addresses that you want to allow for adding new documents and their hashes.

5. Interact with the contract using the following functions:

   - `setHashWriterRole(address _hashWriter)`: This function allows the contract owner (DEFAULT_ADMIN_ROLE) to grant the HASH_WRITER role to a specific address.

   - `addNewDocument(string memory _url, bytes32 _hash)`: Hash writers (addresses with the HASH_WRITER role) can use this function to add a new document along with its cryptographic hash. The `_url` parameter represents the URL or identifier of the document, and `_hash` is the cryptographic hash of the document's content.

   - `getDocInfo(uint256 _num)`: This function allows anyone to retrieve information about a specific document based on its counter value `_num`. It returns the document URL and its cryptographic hash.

   - `getDocsCount()`: Use this function to get the total number of documents registered in the contract.

   - `getRegisteredHash(bytes32 _hash)`: Check if a given cryptographic `_hash` is already registered in the contract.

## License

This smart contract is released under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

The contract is built on top of the [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) library, which provides secure and tested implementations of various useful Solidity components.

## Note

This README provides an overview of the smart contract and its functionalities. For more detailed information about the contract functions, events, and modifiers, please refer to the contract's source code. If you encounter any issues or have suggestions for improvements, feel free to create an issue or submit a pull request. Happy notarizing!