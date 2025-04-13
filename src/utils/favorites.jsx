import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const toggleFollowRequest = async (requestId, currentFollowedState, setFollowedState) => {
    const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");

    try {
        const res = await axios.get(`${API_URL}/procurement-requests/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("iz favorites.jsx" ,res.data);

        return res.data;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};
