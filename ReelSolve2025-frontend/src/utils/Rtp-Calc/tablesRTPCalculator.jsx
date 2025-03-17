import React, { useState } from "react";

const TableGamesRTPCalculator = () => {
    const [stake, setStake] = useState("");
    const [payout, setPayout] = useState("");
    const [rtp, setRtp] = useState(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        const s = parseFloat(stake);
        const p = parseFloat(payout);

        if (isNaN(s) || isNaN(p) || s === 0) {
            setRtp("Invalid input");
            return;
        }

        // Calculate RTP as a percentage (payout divided by stake)
        const result = (p / s) * 100;
        setRtp(result.toFixed(2));
    };

    return (
        <div className="rtp-calculator">
            <h1>Table Games RTP Calculator</h1>
            <form onSubmit={handleCalculate}>
                <div>
                    <label htmlFor="stake">Stake:</label>
                    <input
                        type="number"
                        id="stake"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        placeholder="Enter stake amount"
                    />
                </div>
                <div>
                    <label htmlFor="payout">Payout:</label>
                    <input
                        type="number"
                        id="payout"
                        value={payout}
                        onChange={(e) => setPayout(e.target.value)}
                        placeholder="Enter payout amount"
                    />
                </div>
                <button type="submit">Calculate RTP</button>
            </form>
            {rtp && (
                <div>
                    <h2>RTP: {rtp}%</h2>
                </div>
            )}
        </div>
    );
};

export default TableGamesRTPCalculator;