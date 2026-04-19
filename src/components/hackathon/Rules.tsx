import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RulesProps {
  rules: string | string[];
}

const Rules: React.FC<RulesProps> = ({ rules }) => {
  return (
    <div className="rules-section" id="rules">
      <div className="section-card">
        <h2>Rules & Guidelines</h2>
        <div className="rules-list">
          {rules ? (
            typeof rules === 'string' ? (
              <div className="rule-item">
                <AlertCircle size={18} />
                <span>{rules}</span>
              </div>
            ) : (
              rules.map((rule, i) => (
                <div key={i} className="rule-item">
                  <AlertCircle size={18} />
                  <span>{rule}</span>
                </div>
              ))
            )
          ) : (
            <p className="no-data-msg">Rules have not been set for this event.</p>
          )}
        </div>
      </div>

      <div className="section-card warning-card">
        <h2>Important Notes</h2>
        <ul>
          <li>All submissions must be original work</li>
          <li>Teams can use open-source libraries</li>
          <li>Code of conduct applies to all participants</li>
          <li>Decisions of judges are final</li>
        </ul>
      </div>
    </div>
  );
};

export default Rules;
