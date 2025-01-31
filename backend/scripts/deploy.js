const hre = require("hardhat");

async function main() {
    const RPS = await hre.ethers.getContractFactory("RockPaperScissors");
    const rps = await RPS.deploy();
    await rps.deployed();
    console.log("RockPaperScissors deployed to:", rps.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});