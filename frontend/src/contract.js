export const CONTRACT_ADDRESS =
"0xFD6838874577C012C24dC385b40C99B2f77EAbcD";

export const CONTRACT_ABI = [
  "function candidateCount() view returns(uint256)",
  "function candidates(uint256) view returns(uint256 id, string name, uint256 voteCount)",
  "function vote(uint256 _candidateId)",
  "function getWinner() view returns(string)"
];