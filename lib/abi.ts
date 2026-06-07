export const circuitStickerAbi = [
  {
    type: "function",
    name: "placeChip",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "routeLine",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "testSpark",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "userChips",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "userRoutes",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "userSparks",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "totalChips",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "totalRoutes",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "totalSparks",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "event",
    name: "ChipPlaced",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userChips", type: "uint256" },
      { indexed: false, name: "totalChips", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "LineRouted",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userRoutes", type: "uint256" },
      { indexed: false, name: "totalRoutes", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "SparkTested",
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "userSparks", type: "uint256" },
      { indexed: false, name: "totalSparks", type: "uint256" }
    ]
  }
] as const;
