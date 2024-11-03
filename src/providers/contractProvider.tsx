import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useState, createContext, useContext, useEffect, useCallback, useRef, useMemo } from "react";
import { ADDRESS, ERC20ABI2, ERC20ABI_COIN_TOKEN } from "../ERC20ABI/ERC20ABI";
import { useNotification } from "../hooks/useNotification";

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
  const [quizCoinContract, setQuizCoin] = useState<any>(null);
  const { openSuccessNotification, openErrorNotification } = useNotification();

  const callBack = useCallback(
    (
      eventType:
        | "add_question_<id>"
        | "user_answer_correct_<address>"
        | "user_answer_wrong_<address>"
        | "user_name_change_<address>"
        | "change_admin_<address>"
    ) => {
      /*     if (account && eventType.match(account)) { */
      if (eventType.match("user_name_change_")) _getName();
      if (eventType.match("change_admin_")) _isAdmin();
      if (eventType.match("user_answer_wrong_")) openErrorNotification("Respuesta incorrecta");
      if (eventType.match("user_answer_correct_")) openSuccessNotification("Respuesta correcta");
      if (eventType.match("user_answer_")) _balance();
      /*       } */
      setAsyncdData((s: any) => ({ ...s, event: eventType }));
    },
    [account]
  );

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

      if (quizCoinContract) {
        _balance();
        _coinName();
        _coinSymbol();
      }

      (async () => {
        const COIN_ADDRESS = await contract.getCoinAddress();
        if (provider && account) {
          setQuizCoin(new ethers.Contract(COIN_ADDRESS, ERC20ABI_COIN_TOKEN, provider.getSigner()));
        }
      })();

      contract.on("EmittedEvent", callBack);
    }

    return () => {
      contract && contract.removeAllListeners(callBack);
    };
  }, [provider, account, contract]);

  useEffect(() => {
    if (!quizCoinContract) return;
    _balance();
    _coinName();
    _coinSymbol();
  }, [quizCoinContract]);

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
    const name = await contract.getUserNameByAccount(account);
    setAsyncdData((s: any) => ({ ...s, name }));
  }, [contract, asyncdData]);

  const makeAdmin = useCallback(async () => {
    await contract.setAdmin();
  }, [contract]);

  const undoAdmin = useCallback(async () => {
    await contract.removeAdmin();
  }, [contract]);

  const _balance = useCallback(async () => {
    if (quizCoinContract) {
      const balance = await quizCoinContract.balanceOf(account);
      setAsyncdData((s: any) => ({ ...s, balance: balance.toNumber() }));
    }
  }, [quizCoinContract, asyncdData, account]);

  const _coinName = useCallback(async () => {
    const coinName = await quizCoinContract.name();
    setAsyncdData((s: any) => ({ ...s, coinName }));
  }, [quizCoinContract, asyncdData, account]);

  const _coinSymbol = useCallback(async () => {
    const coinSymbol = await quizCoinContract.symbol();
    setAsyncdData((s: any) => ({ ...s, coinSymbol }));
  }, [quizCoinContract, asyncdData, account]);

  const approveAllowence = useCallback(
    async amount => {
      quizCoinContract && quizCoinContract.approve("0xAab63Aa9939aB7699B0919D8dfE13566bef57524", amount);
    },
    [quizCoinContract, asyncdData, account]
  );

  const decreaseAllowance = useCallback(
    async amount => {
      quizCoinContract && quizCoinContract.decreaseAllowance(account, amount);
    },
    [quizCoinContract, asyncdData, account]
  );

  return (
    <ContractContext.Provider
      value={{
        contract,
        connectWallet,
        disconnect,
        makeAdmin,
        undoAdmin,
        approveAllowence,
        decreaseAllowance,
        chainId,
        active,
        account,
        ...asyncdData,
      }}>
      {children}
    </ContractContext.Provider>
  );
};

const useContract = () => useContext(ContractContext);

export { ContractProvider, useContract };
