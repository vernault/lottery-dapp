// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Lottery is Ownable, ReentrancyGuard, VRFConsumerBaseV2 {
    // State variables
    address[] public participants;
    uint256 public entryFee;
    bool public lotteryActive;
    address public recentWinner;

    // Chainlink VRF variables
    VRFCoordinatorV2Interface private vrfCoordinator;
    uint64 private subscriptionId;
    bytes32 private keyHash;
    uint32 private callbackGasLimit;
    uint16 private requestConfirmations;
    uint32 private numWords;

    uint256 private randomResult;

    // Events
    event LotteryStarted(uint256 entryFee);
    event LotteryEntered(address indexed participant);
    event LotteryEnded(address indexed winner, uint256 prize);

    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = _numWords;
    }

    // Start the lottery
    function startLottery(uint256 _entryFee) external onlyOwner {
        require(!lotteryActive, "Lottery is already active");
        entryFee = _entryFee;
        lotteryActive = true;
        delete participants; // Clear participants from the previous round
        emit LotteryStarted(_entryFee);
    }

    // Enter the lottery
    function enterLottery() external payable nonReentrant {
        require(lotteryActive, "Lottery is not active");
        require(msg.value == entryFee, "Incorrect entry fee");
        participants.push(msg.sender);
        emit LotteryEntered(msg.sender);
    }

    // End the lottery and request randomness
    function endLottery() external onlyOwner {
        require(lotteryActive, "Lottery is not active");
        require(participants.length > 0, "No participants in the lottery");

        lotteryActive = false;

        // Request randomness from Chainlink VRF
        vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    // Fulfill randomness
    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        randomResult = randomWords[0];
        uint256 winnerIndex = randomResult % participants.length;
        address winner = participants[winnerIndex];
        recentWinner = winner;

        // Transfer prize to the winner
        uint256 prize = address(this).balance;
        uint256 ownerFee = (prize * 5) / 100; // 5% fee for the owner
        uint256 winnerPrize = prize - ownerFee;

        payable(owner()).transfer(ownerFee);
        payable(winner).transfer(winnerPrize);

        emit LotteryEnded(winner, winnerPrize);
    }

    // Get the list of participants
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }
}