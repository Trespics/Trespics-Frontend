import React from 'react';
import { Trophy } from 'lucide-react';

interface Prize {
  place: string;
  amount: string;
  perks: string;
}

interface PrizesProps {
  prizes: Prize[];
  prizePoolDesc?: string;
}

const Prizes: React.FC<PrizesProps> = ({ prizes, prizePoolDesc }) => {
  return (
    <div className="prizes-section" id="prizes">
      <div className="prizes-header">
        <Trophy size={48} className="prizes-icon" />
        <h2>Prize Pool</h2>
        <p>{prizePoolDesc || "Exciting prizes for the winners!"}</p>
      </div>
      <div className="prizes-grid">
        {prizes && prizes.length > 0 ? (
          prizes.map((prize, i) => (
            <div key={i} className={`prize-card ${i === 0 ? 'first' : ''}`}>
              <div className="prize-place">
                {prize.place}
              </div>
              <div className="prize-amount">{prize.amount}</div>
              <div className="prize-perks">{prize.perks}</div>
            </div>
          ))
        ) : (
          <p className="no-data-msg">Prize details coming soon!</p>
        )}
      </div>
    </div>
  );
};

export default Prizes;
