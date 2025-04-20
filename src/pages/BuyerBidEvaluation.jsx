import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import BidProposalCard from '../components/Cards/BidProposalCard';
import CustomSelect from '../components/Input/DropdownSelect';
import EvaluationModal from '../components/Modals/EvaluationModal';
import { bidService } from '../services/bidService';
import '../styles/BuyerBidEvaluation.css';

const generalCriteria = [
  { id: 'quality', name: 'Quality' },
  { id: 'price', name: 'Price' },
  { id: 'delivery', name: 'Delivery' },
  { id: 'expertise', name: 'Expertise' },
  { id: 'communication', name: 'Communication' }
];

const BuyerBidEvaluation = () => {
  // Get URL parameters
  const { id } = useParams();
  
  // State management
  const [bidProposals, setBidProposals] = useState([]);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [procurementRequest, setProcurementRequest] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function
  const transformEvaluationScores = (evaluations) => {
    // Create a mapping from your general criteria
    const scoreMap = {};
    
    // Map the evaluations to your general criteria format
    generalCriteria.forEach((criterion, index) => {
      const evaluation = evaluations[index];
      scoreMap[criterion.id] = evaluation ? evaluation.score : 0;
    });
    
    return scoreMap;
  };
  
  const calculateAverageScore = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return "0";
    
    // Fixed: Changed eval.score to evaluation.score
    const total = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0);
    return (total / evaluations.length).toFixed(1);
  };
  
  // Helper function to parse timeline strings like "3 days"
  const parseTimelineString = (timelineStr) => {
    try {
      const number = parseInt(timelineStr.split(' ')[0]);
      return isNaN(number) ? 30 : number; // Default to 30 if parsing fails
    } catch (e) {
      console.error('Error parsing timeline:', e, timelineStr);
      return 30; // Default value
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for ID:', id);
        const data = await bidService.getBidProposals(id);
        console.log('API Response:', data); // For debugging
        
        // Check if the response has the expected structure
        if (!data || !data.bids) {
          console.error('Unexpected API response format:', data);
          setError('Unexpected API response format');
          setLoading(false);
          return;
        }
        
        // Transform API data to match the expected format
        const transformedBids = data.bids.map(bid => {
          try {
            return {
              id: bid.seller?.email || 'unknown',
              sellerName: bid.seller?.company_name || 'Unknown Seller',
              sellerLogo: 'https://via.placeholder.com/40',
              price: bid.price?.toString() || '0',
              deliveryTime: parseTimelineString(bid.timeline || '0 days'),
              proposalDescription: bid.proposalText || 'No description provided',
              submissionDate: bid.submittedAt || new Date().toISOString(),
              isEvaluated: bid.evaluations && bid.evaluations.length > 0,
              evaluation: bid.evaluations && bid.evaluations.length > 0 ? {
                scores: transformEvaluationScores(bid.evaluations),
                comment: "Evaluation from backend", 
                // Use finalScore from backend if available, otherwise calculate
                averageScore: bid.finalScore || calculateAverageScore(bid.evaluations),
                evaluationDate: new Date().toISOString()
              } : null,
              isAwarded: false
            };
          } catch (e) {
            console.error('Error transforming bid:', e, bid);
            // Return fallback object
            return {
              id: `fallback-${Math.random()}`,
              sellerName: 'Data Error',
              price: '0',
              deliveryTime: 0,
              proposalDescription: 'There was an error processing this bid data',
              submissionDate: new Date().toISOString(),
              isEvaluated: false,
              isAwarded: false
            };
          }
        });
        
        setBidProposals(transformedBids);
        
        // Set procurement request data with fallbacks
        setProcurementRequest({
          id: data.procurementRequestId?.toString() || id,
          title: data.title || 'Procurement Request',
          status: 'Active', // Not provided in API
          deadline: data.deadline || new Date().toISOString(),
          budget: data.budgetMin && data.budgetMax ? 
            `${data.budgetMin} - ${data.budgetMax}` : 'Budget not specified',
          description: data.description || 'No description available'
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bids:', err);
        // Log more detailed error information
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          console.error('No response received:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
        setError(err.response?.data?.message || 'Failed to load bid proposals');
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  
  
  // Event handlers
  const handleEvaluateClick = (bidId) => {
    setSelectedBidId(bidId);
    setIsEvaluationModalOpen(true);
  };

  const handleAwardBid = async (bidId) => {
    try {
      setLoading(true);
      
      // Award the bid via API
      await bidService.awardBid(bidId);
      
      // Update local state
      setBidProposals(prevBids => 
        prevBids.map(bid => ({
          ...bid,
          isAwarded: bid.id === bidId
        }))
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Error awarding bid:', err);
      setError(err.response?.data?.message || 'Failed to award bid');
      setLoading(false);
    }
  };

  const handleEvaluationSubmit = async (evaluationData) => {
    try {
      // Calculate average score
      const scores = Object.values(evaluationData.scores);
      const avgScore = scores.reduce((sum, score) => sum + Number(score), 0) / scores.length;
      
      // Prepare payload
      const evaluationPayload = {
        bidId: selectedBidId,
        procurementRequestId: id,
        scores: evaluationData.scores,
        comment: evaluationData.comment,
        averageScore: avgScore.toFixed(1)
      };
      
      // Submit evaluation
      await bidService.evaluateBid(evaluationPayload);
      
      // Update local state
      setBidProposals(prevBids => 
        prevBids.map(bid => {
          if (bid.id === selectedBidId) {
            return {
              ...bid,
              evaluation: {
                scores: evaluationData.scores,
                comment: evaluationData.comment,
                averageScore: avgScore.toFixed(1),
                evaluationDate: new Date().toISOString()
              },
              isEvaluated: true
            };
          }
          return bid;
        })
      );
      
      // Close modal
      setIsEvaluationModalOpen(false);
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    }
  };
  
  // Sorting logic
  const sortBids = (bids) => {
    if (!bids.length) return [];
    
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
      // Default = newest first
      return [...bids].sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    }
  };

  const sortedBids = sortBids(bidProposals);

  // Render loading state
  if (loading && !bidProposals.length) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Loading bid proposals...</p>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error && !bidProposals.length) {
    return (
      <Layout>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="buyer-bid-evaluation-container">
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

      {isEvaluationModalOpen && selectedBidId && (
        <EvaluationModal
          bidId={selectedBidId}
          bid={bidProposals.find(bid => bid.id === selectedBidId)}
          criteria={generalCriteria}
          onClose={() => setIsEvaluationModalOpen(false)}
          onSubmit={handleEvaluationSubmit}
        />
      )}
    </Layout>
  );
};

export default BuyerBidEvaluation;