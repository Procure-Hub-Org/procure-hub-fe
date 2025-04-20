import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getBidProposals = async (procurementRequestId) => {
  try {
    console.log(`Fetching bids for procurement request ${procurementRequestId}`);
    const token = localStorage.getItem('token');
    console.log('Authorization token:', token ? 'Token exists' : 'No token found');
    
    // Log the full URL being requested
    const url = `${API_BASE_URL}/api/bid-proposals/${procurementRequestId}`;
    console.log('Making request to:', url);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching bid proposals:', error);
    throw error;
  }
};

// Also update these endpoints
const evaluateBid = async (evaluationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/evaluate-bid`, evaluationData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error evaluating bid:', error);
    throw error;
  }
};

const awardBid = async (bidId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/api/award-bid/${bidId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error awarding bid:', error);
    throw error;
  }
};

export const bidService = {
  getBidProposals,
  evaluateBid,
  awardBid
};