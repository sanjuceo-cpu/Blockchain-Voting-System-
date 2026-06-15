import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

import vijayImg from "./images/vijay.jpg";
import annamalaiImg from "./images/annamalai.jpg";
import seemanImg from "./images/seeman.jpg";
import epsImg from "./images/eps.jpg";
import udhayanidhiImg from "./images/udhayanidhi.jpg";
import nainaImg from "./images/naina.jpg";

const candidateDetails = {
  Vijay: {
    party: "Tamilaga Vettri Kazhagam (TVK)",
    photo: vijayImg,
    bio: "Founder of TVK and popular actor. Focuses on youth empowerment and transparent governance.",
  },

  "K. Annamalai": {
    party: "We The Leaders",
    photo: annamalaiImg,
    bio: "Former IPS officer known for leadership and administrative experience.",
  },

  Seeman: {
    party: "Naam Tamilar Katchi (NTK)",
    photo: seemanImg,
    bio: "Chief Coordinator of NTK. Promotes Tamil identity and agricultural development.",
  },

  "Edappadi K. Palaniswami": {
    party: "AIADMK",
    photo: epsImg,
    bio: "Former Chief Minister of Tamil Nadu. Known for infrastructure and welfare initiatives.",
  },

  "Udhayanidhi Stalin": {
    party: "DMK",
    photo: udhayanidhiImg,
    bio: "Youth leader focusing on education, sports and youth development.",
  },
  "Nainar Nagendran": {
    party: "BJP",
    photo: nainaImg,
    bio: "Political leader with a focus on women's empowerment and social welfare.",
  },
};

function App() {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
     method: "eth_requestAccounts",
  });

if (!accounts.length) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const address = await signer.getAddress();
      setAccount(address);

      await loadCandidates(signer);
      await loadWinner(signer);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
  const checkWallet = async () => {
    if (!window.ethereum) return;

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      connectWallet();
    }
  };

  checkWallet();
}, []);

  const loadCandidates = async (signer) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const count = Number(await contract.candidateCount());

      let loadedCandidates = [];
      let voteSum = 0;

      for (let i = 1; i <= count; i++) {
        const candidate = await contract.candidates(i);

        const candidateData = {
          id: Number(candidate.id),
          name: candidate.name,
          voteCount: Number(candidate.voteCount),
        };

        voteSum += Number(candidate.voteCount);
        loadedCandidates.push(candidateData);
      }

      setCandidates(loadedCandidates);
      setTotalVotes(voteSum);
    } catch (error) {
      console.error("Load Candidates Error:", error);
    }
  };

  const loadWinner = async (signer) => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const winnerName = await contract.getWinner();
      setWinner(winnerName);
    } catch (error) {
      console.error("Winner Error:", error);
    }
  };

  const vote = async (candidateId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.vote(candidateId);

      alert("Waiting for transaction confirmation...");

      await tx.wait();

      alert(
        `✅ Vote Submitted Successfully!\n\nTransaction Hash:\n${tx.hash}`
      );

      await loadCandidates(signer);
      await loadWinner(signer);
    } catch (error) {
      alert(error.reason || error.message);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>🗳 Blockchain Voting Platform</h1>

        <h2>Secure • Transparent • Decentralized</h2>

        <p>Please Give Your Valuable Vote</p>

        <h2 style={{ color: "green" }}>
          Election Status : LIVE
        </h2>

        <h1>Total Votes : {totalVotes}</h1>

        <button
          onClick={connectWallet}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      </div>

      <br />

      <h3>Connected Account:</h3>
      <p>{account}</p>

      <hr />

      <h1>Candidates</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {candidates.map((candidate) => {
          const details = candidateDetails[candidate.name];

          return (
            <div
              key={candidate.id}
              style={{
                width: "350px",
                background: "#fff",
                borderRadius: "15px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={details?.photo}
                alt={candidate.name}
                style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <h2>{candidate.name}</h2>

              <h3 style={{ color: "#0066cc" }}>
                {details?.party}
              </h3>

              <p>{details?.bio}</p>

              <h2>Votes : {candidate.voteCount}</h2>

              <button
                onClick={() => vote(candidate.id)}
                style={{
                  padding: "10px 25px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Vote Now
              </button>
            </div>
          );
        })}
      </div>

      <br />
      <hr />

      <h1>🏆 Current Winner</h1>

      <h1 style={{ color: "green" }}>
        {winner}
      </h1>
    
    <div
  style={{
    textAlign: "center",
    marginTop: "40px",
    padding: "20px",
    color: "#666",
  }}
>
  © 2026 Blockchain Voting Platform | Developed by
  <strong> Sanjeev Ragaventra S</strong>
</div>
      
</div>
    
    
  );
  
}

export default App;