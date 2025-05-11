import React from "react";
import PrimaryButton from "../Button/PrimaryButton";
import dayjs from "dayjs";
import { toggleFollowRequest } from "../../utils/favorites";
import { useNavigate } from "react-router-dom";

const ProcurementRequestCard = ({
  request,
  followedRequests,
  setFollowedRequests,
  submittedBidRequestIds = [],
}) => {
  const navigate = useNavigate();

  const isBidSubmitted = submittedBidRequestIds.includes(request.id);

  const handleFollowClick = async (requestId) => {
    const isFollowed = followedRequests[requestId] || false;

    await toggleFollowRequest(requestId, isFollowed, (newState) => {
      setFollowedRequests((prev) => ({
        ...prev,
        [requestId]: newState,
      }));
    });
  };

  const handleCreateBidProposalClick = async (requestId) => {
    console.log("kliknuo da createa bid proposal na requestu id: " + requestId);
    navigate(`/new-bid/${requestId}`);
  };

  return (
    <div className="request-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title">{request.title}</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          <PrimaryButton
            onClick={() => handleCreateBidProposalClick(request.id)}
            disabled={isBidSubmitted}
          >
            Create Bid Proposal
          </PrimaryButton>
          <PrimaryButton onClick={() => handleFollowClick(request.id)}>
            {followedRequests[request.id] ? "Unfollow" : "Follow"}
          </PrimaryButton>
        </div>
      </div>

      <div className="card-body">
        <p className="card-description">{request.description}</p>
        <div className="card-details-grid">
          <div className="detail-item">
            <strong>Category:</strong>
            <span>{request.category_name}</span>
          </div>
          <div className="detail-item">
            <strong>Location:</strong>
            <span>{request.location}</span>
          </div>
          <div className="detail-item">
            <strong>Budget:</strong>
            <span>
              {request.budget_min} $ - {request.budget_max} $
            </span>
          </div>
          <div className="detail-item">
            <strong>Deadline:</strong>
            <span>{dayjs(request.deadline).format("MMM D, YYYY h:mm A")}</span>
          </div>
          {request.buyer_type_name && (
            <div className="detail-item">
              <strong>Buyer Type:</strong>
              <span>{request.buyer_type_name}</span>
            </div>
          )}
          <div className="detail-item">
            <strong>Documentation:</strong>
            <span>{request.documentation}</span>
          </div>
          <div className="detail-item full-width">
            <strong>Evaluation criteria:</strong>
            {request.evaluationCriteria &&
            request.evaluationCriteria.length > 0 ? (
              request.evaluationCriteria.map((item, index) => (
                <span key={item.id || index}>
                  {" "}
                  {item.criteriaType.name} (Weight: {item.weight})
                </span>
              ))
            ) : (
              <span> No criteria specified.</span>
            )}
          </div>
          <div className="detail-item">
            <strong>Items:</strong>
            {request.items && request.items.length > 0 ? (
              request.items.map((item, index) => (
                <div key={item.id || index} style={{ marginBottom: "8px" }}>
                  <div style={{ textAlign: "center" }}>
                    <strong>
                      {item.title} (x{item.quantity})
                    </strong>
                  </div>
                  <span>{item.description}</span>
                </div>
              ))
            ) : (
              <span>No items specified.</span>
            )}
          </div>

          <div className="detail-item">
            <strong>Requirements:</strong>
            {request.requirements && request.requirements.length > 0 ? (
              request.requirements.map((item, index) => (
                <div key={item.id || index} style={{ marginBottom: "8px" }}>
                  <div style={{ textAlign: "center" }}>
                    <strong>{item.type}</strong>
                  </div>
                  <span>{item.description}</span>
                </div>
              ))
            ) : (
              <span>No requirements specified.</span>
            )}
          </div>
        </div>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center">
        <span className="buyer-info">
          Posted by: <strong>{request.buyer_full_name}</strong>
        </span>
        <span className="date-info">
          Created: {dayjs(request.created_at).format("MMM D, YYYY")}
        </span>
        <span className={`card-status status-${request.status}`}>
          {request.status}
        </span>
      </div>
    </div>
  );
};

export default ProcurementRequestCard;
