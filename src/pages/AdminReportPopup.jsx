import '../styles/AdminReportPopup.css';
import { useEffect, useState } from "react";
import axios from "axios";

const AdminReportPopup = ({ onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get("/admin/reports");
        setReportData(response.data);
      } catch (error) {
        console.error("Failed to fetch admin report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);


  /*mock Data */
/*
useEffect(() => {
  // MOCK PODACI
  const mockData = {
    disputes: 7,
    suspiciousActivities: [
      {
        id: 1,
        seller: {
          first_name: "Amir",
          last_name: "Kovačević",
          company_name: "Kompani d.o.o."
        },
        buyer: {
          first_name: "Maja",
          last_name: "Hodžić",
          company_name: "SoftTech"
        },
        procurement_request: {
          title: "Nabavka računara"
        },
        text: "Sumnjiva ponuda bez traženih dokumenata.",
        created_at: "2025-05-15T14:32:00Z"
      },
      {
        id: 2,
        seller: {
          first_name: "Ivana",
          last_name: "Milić",
          company_name: "TechPro"
        },
        buyer: {
          first_name: "Adnan",
          last_name: "Begović",
          company_name: "Net Solutions"
        },
        procurement_request: {
          title: "Usluge održavanja servera"
        },
        text: "Nepravilnosti u obrascu ponude.",
        created_at: "2025-05-15T12:15:00Z"
      }
    ],
    top3Buyers: [
      {
        buyer_id: 101,
        buyer_name: "Marko Petrović",
        company_name: "Inženjering BH",
        count: 3
      },
      {
        buyer_id: 102,
        buyer_name: "Lejla Hadžić",
        company_name: "Smart Systems",
        count: 2
      },
      {
        buyer_id: 103,
        buyer_name: "Jasmin Dedić",
        company_name: "SIGMA d.o.o.",
        count: 2
      }
    ],
    top5Users: [
      {
        user_id: 201,
        first_name: "Amra",
        last_name: "Zukić",
        company_name: "GlobalTech",
        count: 4
      },
      {
        user_id: 202,
        first_name: "Tarik",
        last_name: "Mehić",
        company_name: "NovaVizija",
        count: 3
      },
      {
        user_id: 203,
        first_name: "Emina",
        last_name: "Salihović",
        company_name: "LogIT",
        count: 3
      },
      {
        user_id: 204,
        first_name: "Faruk",
        last_name: "Selimović",
        company_name: "Datakom",
        count: 2
      },
      {
        user_id: 205,
        first_name: "Dženana",
        last_name: "Mujkić",
        company_name: "NetCom",
        count: 2
      }
    ]
  };

  setReportData(mockData);
  setLoading(false);
}, []);*/

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

  // Destrukturiraj s default vrijednostima za sigurnost
  const {
    disputes = 0,
    suspiciousActivities = [],
    top3Buyers = [],
    top5Users = []
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
          <strong>Number of Disputes:</strong> {disputes ?? 0}
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
                  {activity.buyer ? (
                    <p>
                      <strong>Buyer:</strong> {activity.buyer.first_name ?? "N/A"} {activity.buyer.last_name ?? ""} ({activity.buyer.company_name ?? "N/A"})
                    </p>
                  ) : (
                    <p><strong>Buyer:</strong> No data</p>
                  )}
                  <p><strong>Reported Request:</strong> {activity.procurement_request?.title ?? "N/A"}</p>
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
                  <p><strong>Company:</strong> {buyer.company_name ?? "N/A"}</p>
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
