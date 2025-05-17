import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import PrimaryButton from "../components/Button/PrimaryButton";
import OutlinedButton from "../components/Button/OutlinedButton";
import { isAdmin, isAuthenticated } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const ContractsDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("id"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Commented out API call
    // axios
    //   .get(`${import.meta.env.VITE_API_URL}/api/contracts`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })
    //   .then((response) => {
    //     setContracts(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching contracts:", error);
    //   });

    // Mock data
    const mockContracts = [
      {
        contract_id: 1,
        buyer_id: 1,
        buyer_name: "I. Galijasevic",
        buyer_company_name: "ETF Buyers",
        seller_id: 10,
        seller_name: "Seller One",
        seller_company_name: "Company A",
        procurement_request_id: 101,
        procurement_request_title: "Request A",
        procurement_bid_id: 201
      },
      {
        contract_id: 2,
        buyer_id: 3,
        buyer_name: "Irma G.",
        buyer_company_name: "Global Buy Co.",
        seller_id: 11,
        seller_name: "Seller Two",
        seller_company_name: "Company B",
        procurement_request_id: 102,
        procurement_request_title: "Request B",
        procurement_bid_id: 202
      },
      {
        contract_id: 3,
        buyer_id: 99,
        buyer_name: "John Doe",
        buyer_company_name: "Doe Corp",
        seller_id: 11,
        seller_name: "Seller Two",
        seller_company_name: "Company B",
        procurement_request_id: 103,
        procurement_request_title: "Request C",
        procurement_bid_id: 203
      }
    ];

    const filteredContracts = isAdmin()
      ? mockContracts
      : mockContracts.filter(
          (contract) => contract.buyer_id === userId || contract.seller_id === userId
        );

    setContracts(filteredContracts);
  }, [token]);

  const indexOfLast = currentPage * contractsPerPage;
  const indexOfFirst = indexOfLast - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="button-container">
          <div className="title">
            <h3>Contracts</h3>
          </div>

          {isAdmin() && (
            <PrimaryButton onClick={() => {}}>
              Generate Reports
            </PrimaryButton>
          )}
        </div>

        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Buyer Name</th>
                <th>Buyer Company</th>
                <th>Seller Name</th>
                <th>Seller Company</th>
                <th>Request Title</th>
                <th>Request</th>
                <th>Bid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentContracts.map((contract) => (
                <tr key={contract.contract_id}>
                  <td>{contract.buyer_name}</td>
                  <td>{contract.buyer_company_name}</td>
                  <td>{contract.seller_name}</td>
                  <td>{contract.seller_company_name}</td>
                  <td>{contract.procurement_request_title}</td>
                  <td>
                    <OutlinedButton onClick={() => {}}>
                      View Request
                    </OutlinedButton>
                  </td>
                  <td>
                    <OutlinedButton onClick={() => {}}>
                      View Bid
                    </OutlinedButton>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <OutlinedButton disabled>
                        View Disputes
                      </OutlinedButton>
                      {!isAdmin() && (
                        <PrimaryButton onClick={() => {}}>
                          Add Dispute
                        </PrimaryButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {Array.from({ length: Math.ceil(contracts.length / contractsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              style={{ margin: '0 5px', padding: '5px 10px' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ContractsDashboard;
