import React from 'react';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import '../../styles/BidProposalCard.css';

const BidProposalCard = ({ bid, onEvaluate, onAward, isAwardDisabled }) => {
  const { 
    sellerName, 
    sellerLogo, 
    price, 
    deliveryTime, 
    proposalDescription, 
    submissionDate, 
    isEvaluated, 
    evaluation,
    isAwarded
  } = bid;

  return (
    <div className={`bid-proposal-card ${isAwarded ? 'awarded' : ''}`}>
      {isAwarded && <div className="awarded-badge">Awarded</div>}
      
      <div className="bid-header">
        <div className="seller-info">
          {sellerLogo && <img src={sellerLogo} alt={`${sellerName} logo`} className="seller-logo" />}
          <h4>{sellerName}</h4>
        </div>
        <div className="bid-submission-date">
          Submitted: {new Date(submissionDate).toLocaleDateString()}
        </div>
      </div>
      
      <div className="bid-details">
        <div className="bid-detail-item">
          <span className="label">Price:</span>
          <span className="value">${price}</span>
        </div>
        <div className="bid-detail-item">
          <span className="label">Delivery Time:</span>
          <span className="value">{deliveryTime} days</span>
        </div>
      </div>
      
      <div className="bid-proposal">
        <p>{proposalDescription}</p>
      </div>
      
      {isEvaluated && (
      <div className="evaluation-results">
        <h5>Evaluation Scores</h5>
        <div className="scores-grid">
          {Object.entries(evaluation.scores).map(([criterionId, score]) => {
            const criterionMap = {
              'quality': 'Quality',
              'price': 'Price',
              'delivery': 'Delivery',
              'expertise': 'Expertise',
              'communication': 'Communication',
              // Keep backward compatibility with old data (since first code had these keys)
              'technicalQuality': 'Technical Quality',
              'priceFeasibility': 'Price Feasibility',
              'deliveryTimeline': 'Delivery Timeline',
              'experience': 'Experience'
            };
            
            const displayName = criterionMap[criterionId] || 
                              criterionId.charAt(0).toUpperCase() + 
                              criterionId.slice(1).replace(/([A-Z])/g, ' $1').trim();
            
            return (
              <div key={criterionId} className="score-item">
                <span className="criterion">{displayName}:</span>
                <span className="score">{score}</span>
              </div>
            );
          })}
        </div>
        <div className="average-score">
          <span className="label">Average Score:</span>
          <span className="score">{evaluation.averageScore}</span>
        </div>
        {evaluation.comment && (
          <div className="evaluation-comment">
            <span className="label">Comment:</span>
            <p>{evaluation.comment}</p>
          </div>
        )}
      </div>
    )}
      
      <div className="bid-actions">
        {!isEvaluated || evaluation?.averageScore === "Pending" ? (
          <PrimaryButton onClick={onEvaluate}>Evaluate</PrimaryButton>
        ) : (
          <SecondaryButton 
            onClick={onAward} 
            disabled={isAwardDisabled && !isAwarded}
            className={isAwarded ? 'awarded-button' : ''}
          >
            {isAwarded ? 'Awarded' : 'Award Bid'}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

export default BidProposalCard;