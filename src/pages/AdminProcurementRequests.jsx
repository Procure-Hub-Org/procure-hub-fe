import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Layout from "../components/Layout/Layout";
import CustomSearchInput from "../components/Input/SearchInput";
import CustomDropdownSelect from "../components/Input/DropdownSelect";
import CustomTextField from "../components/Input/TextField";
import PrimaryButton from "../components/Button/PrimaryButton";
import CustomPagination from "../components/Pagination/CustomPagination";
import CustomInput from "../components/Input/CustomInput";
import { Eye, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Admin.css";
import "../styles/AdminProcurementRequests.css";

const dummyRequests = [
  {
    id: 1,
    title: "Office Chairs",
    description: "Need ergonomic office chairs",
    category: "Furniture",
    status: "active",
    deadline: "2025-05-01",
    bids: 3,
    logs: 5,
    buyerEmail: "john@example.com",
    flagged: true,
  },
  {
    id: 2,
    title: "Laptops for IT",
    description: "15 laptops with SSD",
    category: "Electronics",
    status: "closed",
    deadline: "2025-04-15",
    bids: 10,
    logs: 7,
    buyerEmail: "anna@example.com",
    flagged: false,
  },
  {
    id: 3,
    title: "Cleaning Service",
    description: "Monthly cleaning contract",
    category: "Services",
    status: "awarded",
    deadline: "2025-04-20",
    bids: 5,
    logs: 8,
    buyerEmail: "lisa@example.com",
    flagged: true,
  },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "frozen", label: "Frozen" },
  { value: "awarded", label: "Awarded" },
];


const AdminProcurementDashboard = () => {
    const [requests, setRequests] = useState(dummyRequests);
    const [statusFilter, setStatusFilter] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [bidsFrom, setBidsFrom] = useState("");
    const [bidsTo, setBidsTo] = useState("");
    const [logsFrom, setLogsFrom] = useState("");
    const [logsTo, setLogsTo] = useState("");    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dateError, setDateError] = useState("");
    const [bidsError, setBidsError] = useState("");
    const [logsError, setLogsError] = useState("");
 
    const theme = useTheme();

  const filteredRequests = requests
    .filter((req) => 
      req.buyerEmail.toLowerCase().includes(emailSearch.toLowerCase())
    )
    .filter((req) => 
      statusFilter ? req.status === statusFilter : true
    )
    .filter((req) => {
      // Filtriranje prema opsegu datuma
      const deadline = new Date(req.deadline);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      return (
        (!fromDate || deadline >= fromDate) &&
        (!toDate || deadline <= toDate)
      );
    })
    .filter((req) => {
        const from = bidsFrom !== "" ? Number(bidsFrom) : null;
        const to = bidsTo !== "" ? Number(bidsTo) : null;
      
        if ((from != null && from < 0) || (to != null && to < 0)) return false;
        if (from != null && to != null && from > to) return false;
      
        return (
          (from == null || req.bids >= from) &&
          (to == null || req.bids <= to)
        );
      })
      .filter((req) => {
        const from = logsFrom !== "" ? Number(logsFrom) : null;
        const to = logsTo !== "" ? Number(logsTo) : null;
      
        if ((from != null && from < 0) || (to != null && to < 0)) return false;
        if (from != null && to != null && from > to) return false;
      
        return (
          (from == null || req.logs >= from) &&
          (to == null || req.logs <= to)
        );
      })
      

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleFreeze = (id) => {
    //mijenjanje statusa u frozen
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // toggle sidebar visibility
  };

useEffect(() => {
  let isValid = true;

  // Date validation
  if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
    setDateError("Start date must be earlier than or equal to end date.");
    isValid = false;
  } else {
    setDateError("");
  }

  // Bids validation
  if ((bidsFrom && bidsFrom < 0) || (bidsTo && bidsTo < 0)) {
    setBidsError("Number of bids cannot be negative.");
    isValid = false;
  } else if (bidsFrom && bidsTo && Number(bidsFrom) > Number(bidsTo)) {
    setBidsError("Minimum number of bids must be less than or equal to maximum.");
    isValid = false;
  } else {
    setBidsError("");
  }

  // Logs validation
  if ((logsFrom && logsFrom < 0) || (logsTo && logsTo < 0)) {
    setLogsError("Number of logs cannot be negative.");
    isValid = false;
  } else if (logsFrom && logsTo && Number(logsFrom) > Number(logsTo)) {
    setLogsError("Minimum number of logs must be less than or equal to maximum.");
    isValid = false;
  } else {
    setLogsError("");
  }
}, [dateFrom, dateTo, bidsFrom, bidsTo, logsFrom, logsTo]);

  

  return (
    <Layout>
      <div className="dashboard-container" style={{ display: "flex" }}>
        
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
                <div style={{ marginBottom: '-15px' }}>
        <CustomSearchInput
            label="Search by Email"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="Enter email"
        />
    </div>
    <div>
        <CustomDropdownSelect
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
        />
    </div>

    <div>
        <label style={{ marginBottom: '-8px', display: 'block' }}>From and To Date</label>
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
    <div>
        <label style={{ marginBottom: '-8px', display: 'block' }}>Bids</label>
        <div style={{ display: 'flex', gap: '0px' }}>
            <CustomTextField
                label="From"
                type="number"
                value={bidsFrom}
                onChange={(e) => setBidsFrom(e.target.value)}
            />
            <CustomTextField
                label="To"
                type="number"
                value={bidsTo}
                onChange={(e) => setBidsTo(e.target.value)}
            />
        </div>
        {bidsError && (<div style={{ color: "red", fontSize: "0.875rem" }}>{bidsError}</div>)}
    </div>

    <div>
        <label style={{ marginBottom: '-8px', display: 'block' }}>Logs</label>
        <div style={{ display: 'flex', gap: '0px' }}>
            <CustomTextField
                label="From"
                type="number"
                value={logsFrom}
                onChange={(e) => setLogsFrom(e.target.value)}
            />
            <CustomTextField
                label="To"
                type="number"
                value={logsTo}
                onChange={(e) => setLogsTo(e.target.value)}
            />
        </div>
        {logsError && (<div style={{ color: "red", fontSize: "0.875rem" }}>{logsError}</div>)}
    </div>
    <PrimaryButton
                    onClick={() => {
                        setEmailSearch("");
                        setStatusFilter("");
                        setDateFrom("");
                        setDateTo("");
                        setBidsFrom("");
                        setBidsTo("");
                        setLogsFrom("");
                        setLogsTo("");
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

        <div className="panel" style={{ flex: 1, backgroundColor: theme.palette.background.default }}>
          <h3 style={{ color: theme.palette.text.primary }}>Procurement Requests</h3>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Title</th>
                <th className="th">Description</th>
                <th className="th">Category</th>
                <th className="th">Status</th>
                <th className="th">Deadline</th>
                <th className="th">Bids</th>
                <th className="th">Logs</th>
                <th className="th">Buyer Email</th>
                <th className="th">Flags</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req) => (
                <tr
                  key={req.id}
                  className="tr"
                  onClick={() => alert("View " + req.id)} // Kada se klikne na red
                  style={{ cursor: "pointer" }}
                >
                  <td className="td">{req.title}</td>
                  <td className="td">{req.description}</td>
                  <td className="td td-center">{req.category}</td>
                  <td className="td td-center">{req.status}</td>
                  <td className="td td-center">{req.deadline}</td>
                  <td className="td td-center">{req.bids}</td>
                  <td className="td td-center">{req.logs}</td>
                  <td className="td td-center">{req.buyerEmail}</td>

                  <td className="td">
                    {req.flagged && <Flag color="red" size={20} />}
                  </td>
                  <td className="td">
                    <PrimaryButton onClick={() => handleFreeze(req.id)}>
                      Freeze
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
              {currentRequests.length === 0 && (
                <tr>
                  <td className="td" colSpan="10">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRequests.length / requestsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminProcurementDashboard;
