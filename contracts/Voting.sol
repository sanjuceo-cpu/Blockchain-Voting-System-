// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidateCount;
    address public admin;
    bool public electionActive;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    constructor() {
        addCandidate("Vijay");
        addCandidate("K. Annamalai");
        addCandidate("Seeman");
        addCandidate("Edappadi K. Palaniswami");
        addCandidate("Udhayanidhi Stalin");
        addCandidate("Nainar Nagendran");

    }

    function addCandidate(string memory _name) private {
        candidateCount++;

        candidates[candidateCount] = Candidate(
            candidateCount,
            _name,
            0
        );
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "Already voted");

        require(
            _candidateId > 0 &&
            _candidateId <= candidateCount,
            "Invalid candidate"
        );

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getWinner()
        public
        view
        returns(string memory)
    {
        uint highestVotes = 0;
        uint winnerId = 0;

        for(uint i = 1; i <= candidateCount; i++) {
            if(candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winnerId = i;
            }
        }

        return candidates[winnerId].name;
    }
}