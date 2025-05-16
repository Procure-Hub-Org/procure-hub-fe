import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const evaluateBid = async (evaluationData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Transform the data format as needed
    const transformedData = Object.entries(evaluationData.scores).map(([criterionId, score]) => {
      return {
        procurement_request_id: parseInt(evaluationData.procurementRequestId),
        procurement_bid_id: evaluationData.bidId,
        criteria_type_id: parseInt(criterionId),
        score: parseInt(score)
      };
    });
    
    console.log('API URL being used:', `${API_BASE_URL}/api/evaluate-bid`);
    console.log('Transformed data being sent:', transformedData);
    
    const response = await axios.post(`${API_BASE_URL}/api/evaluate-bid`, transformedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error evaluating bid in service:', error);
    // Re-throw the error so it can be caught in the component
    throw error;
  }
};

const awardBid = async (bidId, procurementRequestId) => {
  try {
    const token = localStorage.getItem('token');
    
    console.log(`Awarding bid ${bidId} for procurement request ${procurementRequestId}`);
    
    // Use the correct endpoint and HTTP method
    /*const response = await axios.put(
      `${API_BASE_URL}/api/procurement/${procurementRequestId}/status`, 
      { 
        status: 'awarded',
        awarded_bid_id: bidId // Include the winning bid ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );*/

    const response = await axios.post(`${API_BASE_URL}/api/new-contract`,
      {
        procurement_request_id: Number(procurementRequestId),
        bid_id: bidId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Award response:', response.data);
    //window.location.reload(); // Reload the page to reflect changes
    // Optionally redirect to a contract dashboard
    useNavigate('/contract-dashboard'); // Adjust the path as needed


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