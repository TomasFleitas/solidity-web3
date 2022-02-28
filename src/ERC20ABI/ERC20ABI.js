const ERC20ABI2 = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "eventType",
				"type": "string"
			}
		],
		"name": "EmittedEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lifetimeSeconds",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "opts",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "correctAns",
				"type": "string"
			}
		],
		"name": "addQuestion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_opts_id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_question_id",
				"type": "uint256"
			}
		],
		"name": "answer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"name": "deleteAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAdmins",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "admins",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllQuestion",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "lifetimeSeconds",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "options",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "correctAns",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "visible",
						"type": "bool"
					}
				],
				"internalType": "struct Quiz.Question[]",
				"name": "qsts",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getAnswerByAccount",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "question_id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "anwser_id",
						"type": "string"
					}
				],
				"internalType": "struct Quiz.Answer[]",
				"name": "answers",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAnsweredCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "cnt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getClasifications",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					}
				],
				"internalType": "struct Quiz.UserCalification[]",
				"name": "cal",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyAnswers",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "question_id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "anwser_id",
						"type": "string"
					}
				],
				"internalType": "struct Quiz.Answer[]",
				"name": "answers",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "nexId",
				"type": "uint256"
			}
		],
		"name": "getNextQuestion",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "lifetimeSeconds",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "options",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "correctAns",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "visible",
						"type": "bool"
					}
				],
				"internalType": "struct Quiz.Question",
				"name": "question",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getQuestionNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "cnt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserName",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "getUserNameByAccount",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "removeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "setAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "setUserName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_visible",
				"type": "bool"
			}
		],
		"name": "setVsibileQuestion",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "survey",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const ADDRESS = "0x35caaDA9F8FbD8ACC26693036c79945543769003";

export { ERC20ABI2, ADDRESS };
