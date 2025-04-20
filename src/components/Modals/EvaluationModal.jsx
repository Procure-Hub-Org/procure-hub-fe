import React, { useState } from 'react';
import '../../styles/EvaluationModal.css';

const EvaluationModal = ({ bidId, bid, criteria, onClose, onSubmit }) => {
  const [scores, setScores] = useState(() => {
    // Initialize all criteria with score 0
    const initialScores = {};
    criteria.forEach(criterion => {
      initialScores[criterion.id] = 0;
    });
    return initialScores;
  });
  
  const [comment, setComment] = useState('');

  const handleScoreChange = (criterionId, value) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      scores,
      comment
    });
  };

  return (
    <div className="modal-overlay">
      <div className="evaluation-modal">
        <h2>Evaluate Bid Proposal</h2>
        <h3>{bid.sellerName}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="criteria-list">
            {criteria.map(criterion => (
              <div key={criterion.id} className="criterion-item">
                <label>{criterion.name}</label>
                <select 
                  value={scores[criterion.id]} 
                  onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value))}
                  required
                >
                  <option value="0">Select Score</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
            ))}
          </div>
          
          <div className="comment-section">
            <label>Additional Comments (Optional)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter any additional feedback..."
              rows={4}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;