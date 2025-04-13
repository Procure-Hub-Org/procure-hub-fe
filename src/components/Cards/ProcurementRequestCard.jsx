import React from "react";
import PrimaryButton from '../Button/PrimaryButton';
import dayjs from "dayjs";
import { toggleFollowRequest } from "../../utils/favorites";

const ProcurementRequestCard = ({ request, followedRequests, setFollowedRequests }) => {
    const handleFollowClick = async (requestId) => {
        const isFollowed = followedRequests[requestId] || false;
    
        await toggleFollowRequest(requestId, isFollowed, (newState) => {
            setFollowedRequests((prev) => ({
                ...prev,
                [requestId]: newState,
            }));
        });
    };

    return (
        <div className="request-card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">{request.title}</h3>
                <PrimaryButton onClick={() => handleFollowClick(request.id)}>
                    {followedRequests[request.id] ? "Unfollow" : "Follow"}
                </PrimaryButton>
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
                        <span>{request.budget_min} - {request.budget_max}</span>
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
                    <div className="detail-item full-width">
                        <strong>Documentation:</strong>
                        <span>{request.documentation}</span>
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
