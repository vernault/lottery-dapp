const { ethers } = require("hardhat");

async function main() {
    const lotteryAddress = "YOUR_LOTTERY_CONTRACT_ADDRESS"; // Replace with your deployed contract address
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = Lottery.attach(lotteryAddress);

    // Function to enter the lottery
    async function enterLottery() {
        const tx = await lottery.enter({ value: ethers.utils.parseEther("0.01") }); // Adjust ticket price as needed
        await tx.wait();
        console.log("Entered the lottery!");
    }

    // Function to check the current winner
    async function checkWinner() {
        const winner = await lottery.winner();
        console.log("Current winner:", winner);
    }

    // Function to start the lottery
    async function startLottery() {
        const tx = await lottery.startLottery();
        await tx.wait();
        console.log("Lottery started!");
    }

    // Function to end the lottery and pick a winner
    async function endLottery() {
        const tx = await lottery.endLottery();
        await tx.wait();
        console.log("Lottery ended!");
    }

    // Example usage
    await startLottery();
    await enterLottery();
    await endLottery();
    await checkWinner();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });