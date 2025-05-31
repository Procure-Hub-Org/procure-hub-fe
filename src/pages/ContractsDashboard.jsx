import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import PrimaryButton from "../components/Button/PrimaryButton";
import OutlinedButton from "../components/Button/OutlinedButton";
import { isAdmin, isAuthenticated } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ProcurementRequestCard from "../components/Cards/ProcurementRequestCard";
import SellerBidCard from "../components/Cards/SellerBidCard";
import AdminReportPopup from "./AdminReportPopup";
import ContractDisputeSubmit from "../components/Cards/Popups/ContractDisputesPopup";
import "../styles/ContractsDashboard.css";
import AddDisputePopup from "../components/Cards/Popups/AddDisputePopup";
import ContractInfoPopup from "../components/Cards/Popups/ContractInfoPopup";
import CustomTextField from "../components/Input/TextField"
import CustomSearchInput from "../components/Input/SearchInput";
import CustomDropdownSelect from "../components/Input/DropdownSelect"
import { ChevronLeft, ChevronRight } from "@mui/icons-material";



const ContractsDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(5);
  const theme = useTheme();

  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("id"));
  const navigate = useNavigate();

  const [openModalRequest, setOpenModalRequest] = useState(false);
  const [openModalBid, setOpenModalBid] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [isDisputesOpen, setIsDisputesOpen] = useState(false);
  const [isAddDisputeOpen, setIsAddDisputeOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedContractName, setSelectedContractName] =useState(null);
  const [allContracts, setAllContracts] = useState([]);


  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [buyerName, setBuyerName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateError, setDateError] = useState('')
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [infoPopupOpen, setInfoPopupOpen] = useState(false);

  const handleOpenInfoPopup = (contractId) => {
    setSelectedContractId(contractId);
    setInfoPopupOpen(true);
  };

  const handleCloseInfoPopup = () => {
    setInfoPopupOpen(false);
    setSelectedContractId(null);
  };


  const handleOpenDisputes = (contractId) => {
    setSelectedContractId(contractId);
    setIsDisputesOpen(true);
  };
  const handleCloseDisputes = () => setIsDisputesOpen(false);

  const handleOpenAddDispute = (contractId, contractName) => {
    setSelectedContractId(contractId);
    setSelectedContractName(contractName);
    setIsAddDisputeOpen(true);
  };

  const handleCloseAddDispute = () => {
    setSelectedContractId(null);
    setIsAddDisputeOpen(false);
  };

  const handleSubmitDispute = async ({ contract_id, complainment_text }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/new-dispute`,
        { 
          contract_id,
          complainment_text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error submitting dispute:", error);
      throw error;
    }
  };

  const handleOpenRequest = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/procurement-request-details/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setSelectedRequest(response.data.data);
      setOpenModalRequest(true);
    } catch (error) {
      console.error("Greška pri dohvaćanju zahtjeva:", error);
    }
  };

  const handleCloseRequest = () => {
    setOpenModalRequest(false);
    setSelectedRequestId(null);
  };

  const handleOpenBid = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/procurement-bid/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedBid(response.data.data);
      setOpenModalBid(true);
    } catch (error) {
      console.error("Greška pri dohvaćanju zahtjeva:", error);
    }
  };

  const handleCloseBid = () => {
    setSelectedBid(null);
    setOpenModalBid(false);
  };

 const filterContracts = (allContracts) => {
  console.log('filterContracts pozvan sa:', allContracts); // log svih ugovora prije filtriranja

  const filtered = allContracts.filter(contract => {
    const matchesBuyer = buyerName === '' || contract.buyer_name.toLowerCase().includes(buyerName.toLowerCase());
    const matchesSeller = sellerName === '' || contract.seller_name.toLowerCase().includes(sellerName.toLowerCase());
    const matchesStatus = statusFilter === '' || (contract.status && contract.status.toLowerCase() === statusFilter.toLowerCase());
    const matchesDateFrom = dateFrom === '' || new Date(contract.created_at) >= new Date(dateFrom);
    const matchesDateTo = dateTo === '' || new Date(contract.created_at) <= new Date(dateTo);

    return matchesBuyer && matchesSeller && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  console.log('filterContracts vraća:', filtered); // log filtriranih ugovora
  return filtered;
};


useEffect(() => {
  if (!isAuthenticated()) {
    navigate("/login");
    return;
  }

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/contracts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const fetchedContracts = response.data;
      console.log('Podaci sa backend-a:', fetchedContracts); // log podataka sa backenda
      
      const filtered = isAdmin()
        ? fetchedContracts
        : fetchedContracts.filter(contract => contract.buyer_id === userId || contract.seller_id === userId);
      
      console.log('Podaci nakon primjene korisničkog filtera:', filtered); // log nakon filtra
      
      setAllContracts(filtered);  // Čuvamo sve
      setContracts(filtered);     // Inicijalno sve
    })
    .catch((error) => {
      console.error("Error fetching contracts:", error);
    });
}, [token]);


useEffect(() => {
  const filtered = filterContracts(allContracts);
  setContracts(filtered);
  setCurrentPage(1);  // Vrati na prvu stranicu ako se filteri promijene
}, [buyerName, sellerName, statusFilter, dateFrom, dateTo, allContracts]);


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

  useEffect(() => {
        if (dateFrom && dateTo && dateFrom > dateTo) {
            setDateError('From date cannot be after To date');
        } else {
            setDateError('');
        }
    }, [dateFrom, dateTo]);




  return (
    <Layout>
      <div className="dashboard-container contracts-dashboard " style={{ display: "flex" }}>
        <div
    className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
    style={{
        backgroundColor: theme.palette.background.paper, // theme color
    }}
>
    {sidebarOpen && (
        <div>
            <h4>Filters</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                {/* Buyer Name Filter */}
                <div>
                    <CustomSearchInput
                        label="Buyer Name"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Enter buyer name"
                    />
                </div>

                {/* Seller Name Filter */}
                <div>
                    <CustomSearchInput
                        label="Seller Name"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="Enter seller name"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <CustomDropdownSelect
                        label="Status"
                        options={[
                            { label: 'All', value: '' },
                            { label: 'Draft', value: 'draft' },
                            { label: 'Issued', value: 'issued' },
                            { label: 'Edited', value: 'edited' },
                            { label: 'Signed', value: 'signed' },
                        ]}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>

                {/* Date Range Filter */}
                <div>
                    <label style={{ marginBottom: '-8px', display: 'block' }}>Date Range</label>
                    <CustomTextField
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        style={{ marginBottom: '-5px' }}
                    />
                    <CustomTextField
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                    />
                    {dateError && (<div style={{ color: "red", fontSize: "0.875rem" }}>{dateError}</div>)}
                </div>

                {/* Clear Filters Button */}
                <PrimaryButton
                    onClick={() => {
                        setBuyerName("");
                        setSellerName("");
                        setStatusFilter("");
                        setDateFrom("");
                        setDateTo("");
                    }}
                    style={{ marginTop: "5px" }}
                >
                    Clear Filters
                </PrimaryButton>
            </div>
        </div>
    )}
</div>
<button onClick={toggleSidebar} className="sidebar-toggle">
    {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
</button>
<div className="panel-all" style={{ flex: 1, backgroundColor: theme.palette.background.default }}>
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "space-between", // rasporedi naslov i button-e na krajeve
            alignItems: "center",             // vertikalno poravnaj
          }}
        >
          <div className="title">
            <h3>Contracts</h3>
          </div>

          <div style={{ display: "flex", gap: "12px", paddingRight: "20px"}}>
            {isAdmin() && (
              <PrimaryButton onClick={() => setShowReportPopup(true)}>
                Generate Reports
              </PrimaryButton>
            )}
            <PrimaryButton onClick={() => {}}>
              View Notifications
            </PrimaryButton>
          </div>
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
                  <td>
                    <span
                      onClick={() =>
                        handleOpenRequest(contract.procurement_request_id)
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {contract.procurement_request_title}
                    </span>
                  </td>

                  <td>
                    <span
                      onClick={() => handleOpenBid(contract.procurement_bid_id)}
                      style={{
                        cursor: "pointer",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Bid Proposal
                    </span>
                  </td>

                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "8px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <OutlinedButton
                        disabled={contract.number_of_disputes == 0}
                        onClick={() => handleOpenDisputes(contract.contract_id)}
                      >
                        View Disputes
                      </OutlinedButton>

                       <ContractDisputeSubmit
                          open={isDisputesOpen}
                          onClose={handleCloseDisputes}
                        />
                      {!isAdmin() && (
                        <PrimaryButton 
                          onClick={() => handleOpenAddDispute(contract.contract_id, contract.procurement_request_title)}
                        >
                          Add Dispute
                        </PrimaryButton>
                        
                      )}
                      <PrimaryButton
                        onClick={() => handleOpenInfoPopup(1)}
                      >
                        View Contract Info
                      </PrimaryButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <OutlinedButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ margin: "0 5px", padding: "5px 10px" }}
          >
            &laquo; Prev
          </OutlinedButton>

          {pageNumbers.map((number) =>
            number === currentPage ? (
              <PrimaryButton
                key={number}
                onClick={() => paginate(number)}
                style={{ margin: "0 5px", padding: "5px 10px" }}
              >
                {number}
              </PrimaryButton>
            ) : (
              <OutlinedButton
                key={number}
                onClick={() => paginate(number)}
                style={{ margin: "0 5px", padding: "5px 10px" }}
              >
                {number}
              </OutlinedButton>
            )
          )}

          <OutlinedButton
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ margin: "0 5px", padding: "5px 10px" }}
          >
            Next &raquo;
          </OutlinedButton>
        </div>

        {openModalRequest && selectedRequest && (
          <div
            className="request-modal-contract-dashboard"
            onClick={handleCloseRequest}
          >
            <div
              className="request-modal-contract-dashboard-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseRequest}
                className="admin-close-button"
                style={{ float: "right" }}
              >
                X
              </button>
              <ProcurementRequestCard
                request={selectedRequest}
                followedRequests={[]}
                setFollowedRequests={() => {}}
                submittedBidRequestIds={[]}
                buttonsWrapper={false}
              />
            </div>
          </div>
        )}

        {openModalBid && selectedBid && (
          <div
            className="bid-modal-contract-dashboard"
            onClick={handleCloseBid}
          >
            <div
              className="bid-modal-contract-dashboard-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseBid}
                className="admin-close-button"
                style={{ float: "right" }}
              >
                X
              </button>
              <SellerBidCard bid={selectedBid} buttonsWrapper={false} />
            </div>
          </div>
        )}
        {showReportPopup && (
          <AdminReportPopup onClose={() => setShowReportPopup(false)} />
        )}
        <AddDisputePopup
          open={isAddDisputeOpen}
          onClose={handleCloseAddDispute}
          onSubmit={handleSubmitDispute}
          contractId={selectedContractId}
          contractName={selectedContractName}
        />
        <ContractDisputeSubmit
          open={isDisputesOpen}
          onClose={handleCloseDisputes}
          contractId={selectedContractId}
        />
        <ContractInfoPopup
          open={infoPopupOpen}
          onClose={handleCloseInfoPopup}
          contractId={selectedContractId}
        />
        </div>
      </div>
    </Layout>
  );
};

export default ContractsDashboard;
