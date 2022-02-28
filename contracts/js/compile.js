const path = require("path");
const fs = require("fs");
const solc = require("solc");

const MyCoin = path.join(__dirname, "../MyCoin.sol");
const code = fs.readFileSync(MyCoin, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "MyCoin.sol": {
      content: code,
    },
  },
  setting: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.export = {
  abi: output.contracts["MyCoin.sol"].MyCoin.abi,
  bytecode: output.contracts["MyCoin.sol"].MyCoin.evm.bytecode.object,
};
