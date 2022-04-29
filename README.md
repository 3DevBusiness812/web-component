<!-- PROJECT HEADER -->
<br />
<p align="center">

  <h3 align="center">Keyring Web Component</h3>

  <p align="center">
    A simple plug&play ReactJS module to add a fully-decentralised KYC/AML made by DeFi for DeFi.
    <br />
    <a href="https://github.com/Keyring-Network/keyring-web-component">View Demo</a>
    ·
    <a href="https://github.com/Keyring-Network/keyring-web-component/issues">Report Bug</a>
    ·
    <a href="https://github.com/Keyring-Network/keyring-web-component/issues">Request Feature</a>
  </p>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

Simply sign the challenge with your preferred wallet provider and you are ready to chat!
If you got an ENS name for your wallet, it will be used on behalf of your wallet address. Chats are ephemeral, not logged or stored anywhere. Due to the decentralised nature of the tool, the content posted by users cannot be subject to moderation.
The chat supports all UTF-8 characters and is language-agnostic. For security reasons you cannot use BBCode or HTML code, any spurious tag will be stripped out.

### Built With

* [ComplyCube](https://complycube.com/)
* [ReactJS](https://reactjs.org/)
* [FontAwesome](https://fontawesome.com/)
* [Create React Library](https://www.npmjs.com/package/create-react-library)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

In order to build this package you will need NodeJS and Yarn installed on your machine.

### Installation and local testing

1. Clone the repo
   ```sh
   git clone https://github.com/Keyring-Network/keyring-web-component.git
   ```
2. Install required packages both in the base and the *example* folder using the same command
   ```sh
   yarn install
   ```
3. Execute the demo app
   ```sh
   yarn start
   ```

<!-- USAGE EXAMPLES -->
## Usage

This plugin works with Ethereum mainnet and Rinkeby testnet only.

To use this package in your (d)app simply:
1. install it with `yarn add @keyring-web-component` 
2. import it locally using `import Chatbox from "keyring-web-component"`
3. instantiate the component passing the required params `<Chatbox provider={injectedProvider} address={address} streamID={STREAM_ID} theme="#backgroundColorHex />`

The component needs the following parameters to work:
* *provider*: web3 provider (MetaMask, WalletConnect, Web3Modal, ...)
* *address*: (the user address in hexadecimal form as a string)
* *theme*: the background colour in hex format (default: #0360a5)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the GPL-3.0+ License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact


Project Link: [https://github.com/Keyring-Network/keyring-web-component](https://github.com/Keyring-Network/keyring-web-component)

