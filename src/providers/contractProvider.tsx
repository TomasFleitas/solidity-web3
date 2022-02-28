import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { ADDRESS, ERC20ABI2 } from "../ERC20ABI/ERC20ABI";

const ContractContext = createContext<any>(null);

const Ether = (window as any).ethereum;

const injectedConnector = new InjectedConnector({
  /*   supportedChainIds: [3], */
});

const ContractProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>(null);
  const { chainId, account, activate, deactivate, active } = useWeb3React<Web3Provider>();
  const [provider, setProvider] = useState<any>(null);
  const [asyncdData, setAsyncdData] = useState<any>({});

  useEffect(() => {
    if (!provider) {
      setProvider(new ethers.providers.Web3Provider(Ether));
    }

    if (provider && account && !contract) {
      setContract(new ethers.Contract(ADDRESS, ERC20ABI2, provider.getSigner()));
    }

    if (contract) {
      _isAdmin();
      _getName();
      _isOwner();

      contract.on(
        "EmittedEvent",
        (eventType: "add_question_<id>" | "user_answer_<address>" | "user_name_change_<address>" |  "change_admin_<address>") => {
          if (eventType.match("user_name_change_")) _getName();
          if (eventType.match("change_admin_")) _isAdmin();
          setAsyncdData((s: any) => ({ ...s, event: eventType }));
        }
      );
    }

    return () => {
      contract && contract.removeAllListeners();
    };
  }, [provider, account, contract]);

  const connectWallet = useCallback(async () => {
    if (Ether && !account) {
      activate(injectedConnector);
    } else if (!Ether) {
      console.error("Instalar Metamask");
    }
  }, [activate]);

  const disconnect = useCallback(() => {
    setContract(undefined);
    deactivate();
  }, [deactivate]);

  const _isAdmin = useCallback(async () => {
    const isAdmin = await contract.admin();
    setAsyncdData((s: any) => ({ ...s, isAdmin }));
  }, [contract, asyncdData]);

  const _isOwner = useCallback(async () => {
    const isOnwer = await contract.owner();
    setAsyncdData((s: any) => ({ ...s, isOnwer }));
  }, [contract, asyncdData]);

  const _getName = useCallback(async () => {
    const name = await contract.getUserName();
    setAsyncdData((s: any) => ({ ...s, name }));
  }, [contract, asyncdData]);

  const makeAdmin = useCallback(async () => {}, [contract]);

  const undoAdmin = useCallback(async () => {}, [contract]);

  return (
    <ContractContext.Provider
      value={{ contract, connectWallet, disconnect, makeAdmin, undoAdmin, chainId, active, account, ...asyncdData }}>
      {children}
    </ContractContext.Provider>
  );
};

const useContract = () => useContext(ContractContext);

export { ContractProvider, useContract };
