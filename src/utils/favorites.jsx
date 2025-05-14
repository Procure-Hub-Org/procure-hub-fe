import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const token = localStorage.getItem("token");

export const toggleFollowRequest = async (requestId, currentFollowedState, setFollowedState) => {

    try {
        const method = currentFollowedState ? 'delete' : 'post';
        const endpoint = currentFollowedState 
            ? `/procurement-requests/${requestId}/unfollow`
            : `/procurement-requests/${requestId}/follow`;

        await axios({
            method,
            url: `${API_URL}${endpoint}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setFollowedState(!currentFollowedState);
    } catch (error) {
        console.error("Error toggling follow state:", error);
    }
};

export const fetchFavorites = async () => {

    try {
        const res = await axios.get(`${API_URL}/procurement-requests/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const activeFavorites = res.data.filter(item => item.status === "active");
        
        return activeFavorites;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};

export const fetchSubmittedBidRequestIds = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bids/request-ids`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.requestIds;
    } catch (error) {
        console.error('Error fetching submitted bid request IDs:', error);
    }
};

