import React, { useEffect, useState } from "react";
import ProcurementRequestCard from "../components/Cards/ProcurementRequestCard";
import { fetchFavorites } from "../utils/favorites";
import Layout from "../components/Layout/Layout";
const SellerFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [followedRequests, setFollowedRequests] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFavorites();
      setFavorites(data);
      console.log(data);
      const initialFollowed = {};
      data.forEach((req) => {
        initialFollowed[req.id] = true;
      });
      setFollowedRequests(initialFollowed);
    };

    fetchData();
  }, []);
  return (
    <Layout>
      <div className="seller-favorites-container">
        <h2 className="mb-4">Favorite Procurement Requests</h2>
        {favorites.length === 0 ? (
          <div className="no-favorites-message">
            <p>You have no favorite procurement requests yet.</p>
          </div>
        ) : (
          favorites.map((request) => (
            <ProcurementRequestCard
              key={request.id}
              request={request}
              followedRequests={followedRequests}
              setFollowedRequests={setFollowedRequests}
            />
          ))
        )}
      </div>
    </Layout>
  );
};

export default SellerFavorites;
