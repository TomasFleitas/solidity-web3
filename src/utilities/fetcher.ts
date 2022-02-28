import { Web3Provider } from "@ethersproject/providers"
import { Contract } from "ethers"
import { isAddress } from "ethers/lib/utils"

export const fetcher = (library: Web3Provider | any, abi?: any) => (...args: any[]): any => {
  const [arg1, arg2, ...params] = args


  if (isAddress(arg1)) {
    const address = arg1
    const method = arg2
    const contract = new Contract(address, abi, library.getSigner())
    return contract[method](...params)
  }

  const method = arg1
  return library[method](arg2, ...params)
}