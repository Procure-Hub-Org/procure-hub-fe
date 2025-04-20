import React, { useState } from 'react';
import '../../styles/EvaluationModal.css';

const EvaluationModal = ({ bidId, bid, criteria, onClose, onSubmit }) => {
  // Initialize scores with each criterion ID as the key
  const [scores, setScores] = useState(() => {
    const initialScores = {};
    criteria.forEach(criterion => {
      // Initialize with zero or a default value
      initialScores[criterion.id] = 0;
    });
    return initialScores;
  });
  
  const [comment, setComment] = useState('');
  
  const handleScoreChange = (criterionId, score) => {
    setScores(prev => ({
      ...prev,
      [criterionId]: score
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log what we're submitting for debugging
    console.log('Submitting scores:', scores);
    
    // Check if all criteria have been scored
    const allCriteriaScored = criteria.every(criterion => 
      scores[criterion.id] > 0
    );
    
    if (!allCriteriaScored) {
      alert('Please score all criteria before submitting.');
      return;
    }
    
    // Submit the data
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
                  className="score-select"
                >
                  <option value="0">Select Score</option>
                  <option value="1">1 - Very Poor</option>
                  <option value="2">2 - Poor</option>
                  <option value="3">3 - Below Average</option>
                  <option value="4">4 - Slightly Below Average</option>
                  <option value="5">5 - Average</option>
                  <option value="6">6 - Slightly Above Average</option>
                  <option value="7">7 - Above Average</option>
                  <option value="8">8 - Good</option>
                  <option value="9">9 - Very Good</option>
                  <option value="10">10 - Excellent</option>
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