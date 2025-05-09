import React, { useEffect, useState } from "react";
import ProcurementRequestCard from "../components/Cards/ProcurementRequestCard";
import { fetchFavorites, fetchSubmittedBidRequestIds } from "../utils/favorites";
import Layout from "../components/Layout/Layout";
import "../styles/SellerDashboardRequests.css";

const SellerFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [followedRequests, setFollowedRequests] = useState({});
  const [submittedBidRequestIds, setSubmittedBidRequestIds] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFavorites();
      setFavorites(data);
      const ids = await fetchSubmittedBidRequestIds();
      setSubmittedBidRequestIds(ids);
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
        <div className="requests-list-section">
        <div className="scrollable-list-container">
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
              submittedBidRequestIds={submittedBidRequestIds}
            />
          ))
        )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default SellerFavorites;
