export const Networks = {
  MainNet: 1,
  Rinkeby: 4,
  Ropsten: 3,
  Kovan: 42,
}

export interface IERC20 {
  symbol: string
  address: string
  decimals: number
  name: string
}

export const TOKENS_BY_NETWORK: {
  [key: number]: IERC20[]
} = {
  [Networks.Ropsten]: [
    {
      address: "0x2F5B69Fa8A766a7b38b55E9c6d9C07ec9C42b912",
      symbol: "$QUIZ",
      name: "QUIZ",
      decimals: 18,
    },
  ],
}