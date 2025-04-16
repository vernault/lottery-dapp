import React, { useState } from 'react';
import { ethers } from 'ethers';
import LotteryContract from '../../artifacts/contracts/Lottery.sol/Lottery.json';

const LotteryForm = () => {
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!amount) return;

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const lotteryContract = new ethers.Contract(process.env.NEXT_PUBLIC_LOTTERY_ADDRESS, LotteryContract.abi, signer);

            const transaction = await lotteryContract.enterLottery({ value: ethers.utils.parseEther(amount) });
            setStatus('Transaction pending...');
            await transaction.wait();
            setStatus('Successfully entered the lottery!');
        } catch (error) {
            console.error(error);
            setStatus('Transaction failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Enter the Lottery</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Enter</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default LotteryForm;