import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Chatbox from "keyring-web-component";
import "./App.css";

function App() {
  const [ address, setAddress ] = useState();
  const [ provider, setProvider ] = useState();
  const [ signer, setSigner ] = useState();
  const [ connected, setConnected ] = useState(false);
  const web3Modal = useMemo(() => {
    return new Web3Modal({
      network: "rinkeby",
      cacheProvider: false,
      providerOptions: {
        injected: {
          display: {
            name: "Injected",
            description: "Connect with the provider in your Browser"
          },
          package: null
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "460f40a260564ac4a4f4b3fffb032dad",
          },
        },
      },
    });
  }, []);

  const handleConnect = async () => {
    const instance = await web3Modal.connect();
    
    const selectedProvider = new ethers.providers.Web3Provider(instance);
    const selectedSigner = selectedProvider.getSigner();
    const walletAddress = await selectedSigner.getAddress();
    setAddress(walletAddress);
    setProvider(selectedProvider);
    setSigner(selectedSigner);

    setConnected(true);
  }

  return (
    <>
      <iframe src="http://localhost:4000/" frameBorder="0" width="100%" height="100%"></iframe>
      {!connected &&
        <div id="footer">
          <button onClick={handleConnect}>Connect</button>
        </div>
      }
      {connected && 
        <Chatbox provider={provider} signer={signer} address={address} theme="#0360a5" />
      }
    </>
  );
}

export default App;
