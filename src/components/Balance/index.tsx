import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect } from "react";
import useSWR from "swr";
import { TOKENS_BY_NETWORK } from "../../utilities/constants";
import { fetcher } from "../../utilities/fetcher";
import { TokenBalance } from "../tokenBalance";

export const Balance = () => {
  const { account, library } = useWeb3React<Web3Provider>();

  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });

  useEffect(() => {
    library?.on("block", () => {
      mutate(undefined, true);
    });
    return () => {
      library?.removeAllListeners("block");
    };
  }, []);

  if (!balance) {
    return <div>...</div>;
  }

  return (
    <div>
      <div>Balance: {ethers.utils.formatEther(balance)}</div>
    </div>
  );
};
