const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery Contract", function () {
    let lottery;
    let owner;
    let player1;
    let player2;
    let players;

    const entranceFee = ethers.utils.parseEther("0.01");
    const duration = 60; // 1 minute

    beforeEach(async function () {
        [owner, player1, player2] = await ethers.getSigners();
        const Lottery = await ethers.getContractFactory("Lottery");
        lottery = await Lottery.deploy(entranceFee, duration);
        await lottery.deployed();
    });

    describe("Enter Lottery", function () {
        it("should allow users to enter the lottery", async function () {
            await lottery.connect(player1).enter({ value: entranceFee });
            players = await lottery.getPlayers();
            expect(players.length).to.equal(1);
            expect(players[0]).to.equal(player1.address);
        });

        it("should revert if the entrance fee is not paid", async function () {
            await expect(lottery.connect(player1).enter()).to.be.revertedWith("Not enough ETH!");
        });
    });

    describe("Start and End Lottery", function () {
        it("should allow the owner to start the lottery", async function () {
            await lottery.startLottery();
            const lotteryState = await lottery.lotteryState();
            expect(lotteryState).to.equal(1); // 1 means lottery is open
        });

        it("should allow the owner to end the lottery", async function () {
            await lottery.startLottery();
            await lottery.endLottery();
            const lotteryState = await lottery.lotteryState();
            expect(lotteryState).to.equal(2); // 2 means lottery is closed
        });

        it("should revert if a non-owner tries to start the lottery", async function () {
            await expect(lottery.connect(player1).startLottery()).to.be.revertedWith("Only the owner can start the lottery");
        });
    });

    describe("Random Winner Selection", function () {
        it("should select a random winner after the lottery ends", async function () {
            await lottery.startLottery();
            await lottery.connect(player1).enter({ value: entranceFee });
            await lottery.connect(player2).enter({ value: entranceFee });
            await new Promise((resolve) => setTimeout(resolve, duration * 1000)); // wait for the duration
            await lottery.endLottery();
            const winner = await lottery.winner();
            expect([player1.address, player2.address]).to.include(winner);
        });
    });

    describe("Reentrancy Attack Prevention", function () {
        it("should prevent reentrancy attacks", async function () {
            // This test would require a malicious contract to simulate a reentrancy attack
            // Implement a mock contract and test the reentrancy guard
        });
    });
});