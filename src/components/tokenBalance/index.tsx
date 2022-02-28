import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "../../utilities/fetcher";

export const TokenBalance = ({ symbol, address, decimals }: any) => {
  const { account, library } = useWeb3React<Web3Provider>();

  const { data: balance, mutate } = useSWR([address, "balanceOf", account], {
   /*  fetcher: fetcher(library, ERC20ABI.output.abi), */
  });

  useEffect(() => {
    console.log(`listening for Transfer...`);
/*     const contract = new Contract(address, ERC20ABI.output.abi, library?.getSigner()); */
   /*  const fromMe = contract.filters.Transfer(account, null);
    library?.on(fromMe, (from, to, amount, event) => {
      console.log("Transfer|sent", { from, to, amount, event });
      mutate(undefined, true);
    });
    const toMe = contract.filters.Transfer(null, account);
    library?.on(toMe, (from, to, amount, event) => {
      console.log("Transfer|received", { from, to, amount, event });
      mutate(undefined, true);
    }); */
    return () => {
/*       library?.removeAllListeners(toMe);
      library?.removeAllListeners(fromMe); */
    };
  }, []);

  if (!balance) {
    return <div>...</div>;
  }

  return (
    <div>
      {parseFloat(formatUnits(balance, decimals)).toPrecision(4)} {symbol}
    </div>
  );
};
