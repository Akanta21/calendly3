import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';

import Calendar from './Components/Calendar'

import './App.css';

function App() {
  const [account, setAccount] = useState()

  const connect = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      // returns an array of accounts
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      
      // check if array at least one element. if so, set account to the first one.
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        alert('No account found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    isConnected();
  }, []);

  const isConnected = async () => {
    const provider = await detectEthereumProvider();
    const accounts = await provider.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("No authorized account found")
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Calendly</h1>
        <div id="slogan">Web 3 scheduling</div>
        {!account && <button onClick={connect}>connect wallet</button>}
        {account && <Calendar account={account}/>}
      </header>
    </div>
  );
}

export default App;
