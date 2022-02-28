const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const { abi, bytecode } = require("./compile");

const mnemic = "ribbon ivory pole vintage soul hill practice snow unusual upset aspect jazz";
const provider = new HDWalletProvider(mnemic, "http://localhost:8545");

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const argumentsContructor = [];

  const gasEstimate = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: argumentsContructor,
    })
    .gasEstimate({ from: accounts[0] });

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: argumentsContructor,
    })
    .send({
      from: accounts[0],
      gas: gasEstimate,
    });

  console.log("Contract deployed to: ", result.options.address);
};

deploy();
