import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import style from "./index.module.scss";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Balance } from "../Balance";
import { formatUnits } from "ethers/lib/utils";

const Ether = (window as any).ethereum;
const address = "0xF62d7cC0f33Cdeb7d732bd74b474AC8447Da82FB";

const injectedConnector = new InjectedConnector({
  /*   supportedChainIds: [3], */
});

const Wallet = () => {
  const { chainId, account, activate, deactivate, active } = useWeb3React<Web3Provider>();
  const [errorMessage, setErrorMessage] = useState<String>();
  const [provider, setProvider] = useState<any>(null);

  const connectWalletHandler = async () => {
    if (Ether && account == null) {
      activate(injectedConnector);
    } else if (!Ether) {
      setErrorMessage("Please install MetaMask browser extension");
    }
  };

  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(Ether));
  }, []);

  const getValue = async () => {
    /*     const signer = provider.getSigner();
    const contract = new ethers.Contract(address, ERC20ABI2, signer); */
    /*   const survay = new Survay(await contract.survey());
    console.log(await contract.getAllQuestion());
    console.log((await contract.getAllQuestion()).map((q: any) => new Question(q)));
 */
    /*    const [id, name, description] = await contract.getLasTask(); */
    //  const aux: Task = new Task(await contract.getAllTask());
    /*     console.log((await contract.getAllTask()).map((e: any) => new Task(e))); */
  };

  useEffect(() => {
    if (!account) return;
    const signer = provider.getSigner();
    /*     const contract = new ethers.Contract(address, ERC20ABI2, signer); */

    /*    contract.on("OneEvent", (message, task, ...event) => {
      console.log(message, new Task(task), event);
    }); */

    return () => {
      /*       contract.removeAllListeners(); */
    };
  }, [account]);

  return (
    <div className={style.wallet}>
      <h4> Connection to MetaMask using ethers.js </h4>
      {(!account && <button onClick={connectWalletHandler}>CONECTAR</button>) || (
        <button onClick={() => deactivate()}>DESCONECTAR</button>
      )}
      {account && <button onClick={getValue}>GET VALOR</button>}
      <div className="accountDisplay">
        <h3>Address: {account}</h3>
      </div>
      <div className="accountDisplay">
        <h3>ChainId: {chainId}</h3>
        {active && <div>✅</div>}
      </div>
      <div className="balanceDisplay">
        <Balance />
      </div>
      {errorMessage}
    </div>
  );
};

export default Wallet;
