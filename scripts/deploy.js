const hre = require("hardhat");

async function main() {
  console.log("Deploying contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");

  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  console.log(
    "Voting deployed to:",
    await voting.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});