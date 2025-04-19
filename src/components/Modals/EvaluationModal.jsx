import React, { useState } from 'react';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import CustomTextField from '../Input/TextField';
import '../../styles/EvaluationModal.css';

const EvaluationModal = ({ bid, onClose, onSubmit, criteria }) => {
  // Initialize scores based on the criteria prop
  const [scores, setScores] = useState(() => {
    const initialScores = {};
    criteria.forEach(criterion => {
      initialScores[criterion.id] = 0;
    });
    return initialScores;
  });
  
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleScoreChange = (criterionId, value) => {
    const numValue = parseInt(value, 10);
    
    // Validate score is between 1-5
    if (numValue >= 1 && numValue <= 5) {
      setScores(prev => ({
        ...prev,
        [criterionId]: numValue
      }));
      
      // Clear error for this field if it exists
      if (errors[criterionId]) {
        setErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[criterionId];
          return newErrors;
        });
      }
    } else if (value === '') {
      // Allow empty value while typing
      setScores(prev => ({
        ...prev,
        [criterionId]: ''
      }));
    } else {
      setScores(prev => ({
        ...prev,
        [criterionId]: prev[criterionId]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check each score is provided and between 1-5
    Object.entries(scores).forEach(([criterionId, score]) => {
      if (!score || score < 1 || score > 5) {
        newErrors[criterionId] = 'Score must be between 1-5';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        scores,
        comment,
        evaluationDate: new Date().toISOString()
      });
    }
  };

  return (
    <div className="evaluation-modal-overlay">
      <div className="evaluation-modal">
        <div className="modal-header">
          <h3>Evaluate Bid Proposal</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="bid-summary">
            <h4>{bid.sellerName}'s Proposal</h4>
            <div className="summary-details">
              <div className="summary-item">
                <span className="label">Price:</span>
                <span>${bid.price}</span>
              </div>
              <div className="summary-item">
                <span className="label">Delivery:</span>
                <span>{bid.deliveryTime} days</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="evaluation-form">
            <div className="score-section">
              <h4>Evaluation Criteria</h4>
              <p className="score-instruction">Rate each category from 1 (poor) to 5 (excellent)</p>
              
              <div className="score-grid">
                {criteria.map(criterion => (
                  <div key={criterion.id} className="score-input-group">
                    <label htmlFor={criterion.id}>{criterion.name}:</label>
                    <input
                      type="number"
                      id={criterion.id}
                      min="1"
                      max="5"
                      value={scores[criterion.id]}
                      onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                      className={errors[criterion.id] ? 'error' : ''}
                    />
                    {errors[criterion.id] && <span className="error-message">{errors[criterion.id]}</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="comment-section">
              <CustomTextField
                label="Additional Comments (Optional)"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <div className="modal-actions">
              <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Submit Evaluation</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;