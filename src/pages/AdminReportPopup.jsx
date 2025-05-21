import '../styles/AdminReportPopup.css';
import { useEffect, useState } from "react";
import axios from "axios";

const AdminReportPopup = ({ onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReportData(response.data);
        console.log("Admin report data:", response.data);

      } catch (error) {
        console.error("Failed to fetch admin report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="admin-popup-overlay">
        <div className="admin-popup">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const {
    disputes,
    suspiciousActivities,
    top3Buyers,
    top5Users
  } = reportData;

  return (
    <div className="admin-popup-overlay" onClick={onClose}>
      <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
        <div className="admin-popup-header">
          <h2>Admin Report</h2>
          <button onClick={onClose} className="admin-close-button">X</button>
        </div>

        <div className="admin-popup-content">
          <p className="admin-dispute-count">
            <strong>Number of Disputes:</strong> {disputes?.count ?? 0}
          </p>

          <div className="admin-section">
            <h3>Suspicious Activities</h3>
            <div className="admin-scrollable-section">
              {suspiciousActivities.length === 0 ? (
                <p>No suspicious activities.</p>
              ) : (
                suspiciousActivities.map(activity => (
                  <div key={activity.id} className="admin-activity-card">
                    <p>
                      <strong>Seller:</strong> {activity.seller?.first_name ?? "N/A"} {activity.seller?.last_name ?? ""} ({activity.seller?.company_name ?? "N/A"})
                    </p>
                    {activity.procurementRequest?.buyer ? (
                      <p>
                        <strong>Buyer:</strong> {activity.procurementRequest.buyer.first_name ?? "N/A"} {activity.procurementRequest.buyer.last_name ?? ""} ({activity.procurementRequest.buyer.company_name ?? "N/A"})
                      </p>
                    ) : (
                      <p><strong>Buyer:</strong> No data</p>
                    )}
                    <p><strong>Reported Request:</strong> {activity.procurementRequest?.title ?? "N/A"}</p>
                    <p><strong>Text:</strong> {activity.text ?? "No text"}</p>
                    <p><strong>Date:</strong> {activity.created_at ? new Date(activity.created_at).toLocaleString() : "N/A"}</p>
                  </div>
                ))
              )}
            </div>
          </div>


          <div className="admin-section-row">
            <div className="admin-subsection">
              <h3>Top 3 Buyers (Suspicious Activity)</h3>
              {top3Buyers.length === 0 ? (
                <p>No data.</p>
              ) : (
                top3Buyers.map(buyer => (
                  <div key={buyer.buyer_id} className="admin-card">
                    <p><strong>Name:</strong> {buyer.buyer_name ?? "N/A"}</p>
                    <p><strong>Company:</strong> {buyer["procurementRequest.company_name"] ?? "N/A"}</p>
                    <p><strong>Number of Suspicious Activities:</strong> {buyer.count ?? 0}</p>
                  </div>
                ))
              )}
            </div>

            <div className="admin-subsection">
              <h3>Top 5 Users (Disputes)</h3>
              {top5Users.length === 0 ? (
                <p>No data.</p>
              ) : (
                top5Users.map(user => (
                  <div key={user.user_id} className="admin-card">
                    <p><strong>Name:</strong> {user.first_name ?? "N/A"} {user.last_name ?? ""}</p>
                    <p><strong>Company:</strong> {user.company_name ?? "N/A"}</p>
                    <p><strong>Number of Disputes:</strong> {user.count ?? 0}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminReportPopup;
