import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import BidProposalCard from '../components/Cards/BidProposalCard';
import CustomSelect from '../components/Input/DropdownSelect';
import EvaluationModal from '../components/Modals/EvaluationModal';
import { bidService } from '../services/bidService';
import '../styles/BuyerBidEvaluation.css';
import PrimaryButton from '../components/Button/PrimaryButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [awardedBidId, setAwardedBidId] = useState(null);

  const [newCriteria, setNewCriteria] = useState(null);

  const fetchBidCriteria = async (bidId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bids/${bidId}/criteria`);
      if (!response.ok) throw new Error('Failed to fetch evaluation criteria');
      const data = await response.json();

      // Return only criteriaId and criteriaName
      return data.criteria.map((item) => ({
        id: item.criteriaId,
        name: item.criteriaName
      }));
    } catch (error) {
      console.error('Error fetching bid criteria:', error);
      return [];
    }
  };
  console.log('Pozivanje FetchBidCriteria:', fetchBidCriteria(5));


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
         // console.error('Unexpected API response format:', data);
          setError('Unexpected API response format');
          setLoading(false);
          return;
        }
        
        // Transform API data to match the expected format
        const transformedBids = data.bids.map((bid, index) => {
          try {
            const bidId = bid.id || index + 1; // Fallback to index+1 if no ID provided

/**
 * Ismar: 
 *   Problematično pozivanje fetchBidCriteria(). Ako se unutar useEffect() zove fetchBidCriteria(),
 *   pozvat će se za svaki bid, iako su kriteriji isti za sve. Nije potrebno pozivati istu metodu 
 *   više puta, jer će uvijek vraćati iste podatke.
 *   
 *   Razmisliti o konstrukciji:
 * 
 *    const bidCriteria = fetchBidCriteria(bidId).then((criteria) => {
 *            setNewCriteria(criteria);
 *        }); 
 * 
 * 
 */
/////////////////////////////////////////////////////////////////////////////////////////////////

            fetchBidCriteria(bidId).then((criteria) => {
              // Set new criteria state for the current bid
              setNewCriteria(criteria);
            });
                        
/////////////////////////////////////////////////////////////////////////////////////////////////
            console.log('fetchani kriteriji nakon 66x pozvanog fetcha unutar useEffecta(): ', newCriteria);
            
            return {
              id: bidId, 
              sellerEmail: bid.seller?.email || 'unknown',
              sellerName: bid.seller?.company_name || 'Unknown Seller',
              sellerLogo: 'https://via.placeholder.com/40',
              price: bid.price?.toString() || '0',
              deliveryTime: parseTimelineString(bid.timeline || '0 days'),
              proposalDescription: bid.proposalText || 'No description provided',
              submissionDate: bid.submittedAt || new Date().toISOString(),
              isEvaluated: bid.evaluations && bid.evaluations.length > 0,
              evaluation: bid.evaluations && bid.evaluations.length > 0 ? {
                scores: bid.evaluations.map((evaluation) => ({
                  criteriaName: evaluation.criteriaName,
                  score: evaluation.score,
                  weight: evaluation.weight
                })),
                comment: bid.evaluationStatus || "Evaluation from backend", 
                averageScore: bid.finalScore !== null ? bid.finalScore : "Pending",
                evaluationDate: new Date().toISOString()
              } : null,
              isAwarded: false // Assuming this comes from elsewhere or is determined later
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

  /*const handleAwardBid = async (bidId) => {
    try {
      setLoading(true);
      
      // Pass both the bidId and procurement request id
      await bidService.awardBid(bidId, id); // 'id' is from useParams()
      
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
  };*/

  const handleAwardBid = async (bidId) => {
    try {
      setLoading(true);
  
      const token = localStorage.getItem('token');
  
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/procurement/${id}/status`,
        { id, status: 'awarded' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Procurement status updated:', response.data);
  
      // Localy signal which bid was awarded
      setBidProposals(prevBids =>
        prevBids.map(bid => ({
          ...bid,
          isAwarded: bid.id === bidId,
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
      // Show loading state if you have one
      setLoading(true);
      
      // Prepare the payload for the API
      const evaluationPayload = {
        bidId: selectedBidId,
        scores: evaluationData.scores,
        comment: evaluationData.comment
      };
      
      console.log('Submitting evaluation for bid:', selectedBidId);
      console.log('Evaluation payload:', evaluationPayload);
      
      // Call the API
      const response = await bidService.evaluateBid(evaluationPayload);
      
      console.log('Evaluation API response:', response);
      
      // Update the bid in the state with the returned score
      setBidProposals(prevBids => 
        prevBids.map(bid => {
          if (bid.id === selectedBidId) {
            return {
              ...bid,
              isEvaluated: true,
              evaluation: {
                scores: evaluationData.scores,
                comment: evaluationData.comment,
                // Use the final_score from the backend response
                averageScore: response.final_score.toString(),
                evaluationDate: new Date().toISOString()
              }
            };
          }
          return bid;
        })
      );
      
      // Show success message if you have a notification system
      // notificationService.success('Evaluation submitted successfully!');
      
      // Close the modal
      setIsEvaluationModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error('Error in handleEvaluationSubmit:', error);
    
    // Log more details about the axios error
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
      // Show a more detailed error message
      toast.error(`Failed to submit evaluation: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    
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
          {/*<button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>*/}
          <PrimaryButton label="Retry"  onClick={() => window.location.reload()}> Retry </PrimaryButton> 
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={5000} />
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
          criteria={newCriteria}
          onClose={() => setIsEvaluationModalOpen(false)}
          onSubmit={() => handleEvaluationSubmit()}
        />
      )}
    </Layout>
  );
  
};

export default BuyerBidEvaluation;