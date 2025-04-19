import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import BidProposalCard from '../components/Cards/BidProposalCard';
import CustomSelect from '../components/Input/DropdownSelect';
import EvaluationModal from '../components/Modals/EvaluationModal';
import { mockBidProposals } from '../mockData/mockBidProposals';
import '../styles/BuyerBidEvaluation.css';

const BuyerBidEvaluation = () => {
  const { id } = useParams();
  const [bidProposals, setBidProposals] = useState([]);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const [procurementRequest, setProcurementRequest] = useState(null);

  useEffect(() => {
    console.log("Procurement ID:", id);
    
    // Mock podaci za test
    setBidProposals(mockBidProposals);
    setProcurementRequest({
      id: id || '1',
      title: 'Software Development Services',
      status: 'Active',
      deadline: '2025-05-30',
      budget: '50000',
      description: 'Looking for experienced developers for a 6-month project'
    });
  }, [id]);

  const handleEvaluateClick = (bidId) => {
    setSelectedBidId(bidId);
    setIsEvaluationModalOpen(true);
  };

  const handleAwardBid = (bidId) => {
    // Later to be an API call to award the bid
    setBidProposals(proposals => 
      proposals.map(bid => ({
        ...bid,
        isAwarded: bid.id === bidId
      }))
    );
  };

  const handleEvaluationSubmit = (evaluationData) => {
    // Average score calc
    const scores = Object.values(evaluationData.scores);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Update bid with evaluation data
    setBidProposals(proposals => 
      proposals.map(bid => {
        if (bid.id === selectedBidId) {
          return {
            ...bid,
            evaluation: {
              ...evaluationData,
              averageScore: avgScore.toFixed(1)
            },
            isEvaluated: true
          };
        }
        return bid;
      })
    );
    
    setIsEvaluationModalOpen(false);
  };

  const sortBids = (bids) => {
    if (sortOption === 'highestScore') {
      return [...bids].sort((a, b) => {
        const scoreA = a.isEvaluated ? parseFloat(a.evaluation.averageScore) : 0;
        const scoreB = b.isEvaluated ? parseFloat(b.evaluation.averageScore) : 0;
        return scoreB - scoreA;
      });
    } else if (sortOption === 'lowestScore') {
      return [...bids].sort((a, b) => {
        const scoreA = a.isEvaluated ? parseFloat(a.evaluation.averageScore) : 0;
        const scoreB = b.isEvaluated ? parseFloat(b.evaluation.averageScore) : 0;
        return scoreA - scoreB;
      });
    } else if (sortOption === 'oldest') {
      return [...bids].sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    } else {
      // Sortiranje - default = newest first
      return [...bids].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    }
  };

  const sortedBids = sortBids(bidProposals);

  return (
    <Layout>
      <div className="buyer-bid-evaluation-container">
        <div className="procurement-details-section">
          {procurementRequest && (
            <div className="procurement-details">
              <h2>{procurementRequest.title}</h2>
              <div className="procurement-info">
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`status ${procurementRequest.status.toLowerCase()}`}>
                    {procurementRequest.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Deadline:</span>
                  <span>{new Date(procurementRequest.deadline).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Budget:</span>
                  <span>${procurementRequest.budget}</span>
                </div>
              </div>
              <p className="description">{procurementRequest.description}</p>
            </div>
          )}
        </div>

        <div className="bids-section">
          <div className="bids-header">
            <h3>Bid Proposals ({bidProposals.length})</h3>
            <div className="bids-sorting">
              <CustomSelect
                label="Sort by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                options={[
                  { value: 'default', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'highestScore', label: 'Highest Score' },
                  { value: 'lowestScore', label: 'Lowest Score' }
                ]}
              />
            </div>
          </div>

          <div className="bids-list">
            {sortedBids.length > 0 ? (
              sortedBids.map(bid => (
                <BidProposalCard
                  key={bid.id}
                  bid={bid}
                  onEvaluate={() => handleEvaluateClick(bid.id)}
                  onAward={() => handleAwardBid(bid.id)}
                  isAwardDisabled={bidProposals.some(b => b.isAwarded)}
                />
              ))
            ) : (
              <div className="no-bids-message">
                <p>No bid proposals have been submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEvaluationModalOpen && (
        <EvaluationModal
          bidId={selectedBidId}
          bid={bidProposals.find(bid => bid.id === selectedBidId)}
          onClose={() => setIsEvaluationModalOpen(false)}
          onSubmit={handleEvaluationSubmit}
        />
      )}
    </Layout>
  );
};

export default BuyerBidEvaluation;