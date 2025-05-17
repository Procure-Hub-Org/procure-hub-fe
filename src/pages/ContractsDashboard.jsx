import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import PrimaryButton from "../components/Button/PrimaryButton";
import OutlinedButton from "../components/Button/OutlinedButton";
import { isAdmin, isAuthenticated } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const ContractsDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(5);
  const theme = useTheme();

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("id"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Mock data
    const mockContracts = [
  {
    contract_id: 1,
    buyer_id: 1,
    buyer_name: "Ima Galijašević",
    buyer_company_name: "ETF",
    seller_id: 10,
    seller_name: "Seller One",
    seller_company_name: "Seller Co 1",
    procurement_request_title: "Request A",
    number_of_disputes: 0,
  },
  {
    contract_id: 2,
    buyer_id: 3,
    buyer_name: "Irma Galijašević",
    buyer_company_name: "Company B",
    seller_id: 11,
    seller_name: "Seller Two",
    seller_company_name: "Seller Co 2",
    procurement_request_title: "Request B",
    number_of_disputes: 2,
  },
  {
    contract_id: 3,
    buyer_id: 3,
    buyer_name: "Irma Galijašević",
    buyer_company_name: "Company B",
    seller_id: 10,
    seller_name: "Seller One",
    seller_company_name: "Seller Co 1",
    procurement_request_title: "Request C",
    number_of_disputes: 1,
  },
  {
    contract_id: 4,
    buyer_id: 1,
    buyer_name: "Ima Galijašević",
    buyer_company_name: "ETF",
    seller_id: 10,
    seller_name: "Seller One",
    seller_company_name: "Seller Co 1",
    procurement_request_title: "Request A",
    number_of_disputes: 0,
  },
  {
    contract_id: 5,
    buyer_id: 3,
    buyer_name: "Irma Galijašević",
    buyer_company_name: "Company B",
    seller_id: 11,
    seller_name: "Seller Two",
    seller_company_name: "Seller Co 2",
    procurement_request_title: "Request B",
    number_of_disputes: 0,
  },
  {
    contract_id: 6,
    buyer_id: 3,
    buyer_name: "Irma Galijašević",
    buyer_company_name: "Company B",
    seller_id: 10,
    seller_name: "Seller One",
    seller_company_name: "Seller Co 1",
    procurement_request_title: "Request C",
    number_of_disputes: 3,
  },
];


    // Commented out real API call
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

    const filtered = isAdmin()
      ? mockContracts
      : mockContracts.filter(
          (contract) =>
            contract.buyer_id === userId || contract.seller_id === userId
        );

    setContracts(filtered);
  }, [token]);

  const indexOfLast = currentPage * contractsPerPage;
  const indexOfFirst = indexOfLast - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(contracts.length / contractsPerPage);
  const maxPageButtons = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

                    {/* Make request title a clickable link */}
                    <td>
                        <Link
                        to={`/requests/${contract.contract_id}`} // Use the correct request ID if available
                        style={{ color: theme.palette.primary.main, textDecoration: "underline" }}
                        >
                        {contract.procurement_request_title}
                        </Link>
                    </td>

                    {/* Replace button with clickable 'Bid Proposal' */}
                    <td>
                        <Link
                        to={`/bids/${contract.contract_id}`} // Use actual bid ID if needed
                        style={{ color: theme.palette.primary.main, textDecoration: "underline" }}
                        >
                        Bid Proposal
                        </Link>
                    </td>

                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                        <OutlinedButton disabled={contract.number_of_disputes === 0}>
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
          <OutlinedButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ margin: '0 5px', padding: '5px 10px' }}
          >
            &laquo; Prev
          </OutlinedButton>

          {pageNumbers.map((number) => (
            number === currentPage ? (
              <PrimaryButton
                key={number}
                onClick={() => paginate(number)}
                style={{ margin: '0 5px', padding: '5px 10px' }}
              >
                {number}
              </PrimaryButton>
            ) : (
              <OutlinedButton
                key={number}
                onClick={() => paginate(number)}
                style={{ margin: '0 5px', padding: '5px 10px' }}
              >
                {number}
              </OutlinedButton>
            )
          ))}

          <OutlinedButton
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ margin: '0 5px', padding: '5px 10px' }}
          >
            Next &raquo;
          </OutlinedButton>
        </div>
      </div>
    </Layout>
  );
};

export default ContractsDashboard;
