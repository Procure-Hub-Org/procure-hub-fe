import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import BasicButton from "../Button/BasicButton";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, isBuyer, isSeller } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const adminUser = isAdmin();
  const buyerUser = isBuyer();
  const sellerUser = isSeller();

  function onClickLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ width: "100%", boxSizing: "border-box" }}>
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Typography
          onClick={() => navigate("/")}
          variant="h4"
          sx={{
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          ProcureHub
        </Typography>
        {!loggedIn && (
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <BasicButton onClick={() => navigate("/register")}>
              Register
            </BasicButton>
            <BasicButton onClick={() => navigate("/login")}>Login</BasicButton>
          </Box>
        )}
        {loggedIn && adminUser && (
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <BasicButton
              onClick={() => navigate("/admin-procurement-requests")}>
              Procurement Requests
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/admin-auctions")}>
              Auctions
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/contract-dashboard")}>
              Contracts
            </BasicButton>
            <BasicButton onClick={() => navigate("/admin")}>
              Users
            </BasicButton>
            <BasicButton onClick={() => navigate("/admin-analytics")}>
              Analytics
            </BasicButton>
            <BasicButton onClick={() => navigate("/profile")}>
              Profile
            </BasicButton>
            <BasicButton onClick={onClickLogout}>Logout</BasicButton>
          </Box>
        )}
        {loggedIn && buyerUser && (
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <BasicButton
              onClick={() => navigate("/buyer-procurement-requests")}
            >
              Procurement Requests
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/buyer-auctions")}
            >
              Auctions
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/contract-dashboard")}>
              Contracts
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/buyer-analytics")}
            >
              Analytics
            </BasicButton>
            <BasicButton onClick={() => navigate("/profile")}>
              Profile
            </BasicButton>
            <BasicButton onClick={onClickLogout}>Logout</BasicButton>
          </Box>
        )}
        {loggedIn && sellerUser && (
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <BasicButton
              onClick={() => navigate("/seller-procurement-requests")}
            >
              Procurement Requests
            </BasicButton>
            <BasicButton onClick={() => navigate("/seller-favorites")}>
              Favorites
            </BasicButton>
            <BasicButton onClick={() => navigate("/seller-bids")}>
              My Bids
            </BasicButton>
            <BasicButton onClick={() => navigate("/seller-auctions")}>
              Auctions
            </BasicButton>
            <BasicButton
              onClick={() => navigate("/contract-dashboard")}>
              Contracts
            </BasicButton>
            <BasicButton onClick={() => navigate("/seller-analytics")}>
              Analytics
            </BasicButton>
            <BasicButton onClick={() => navigate("/profile")}>
              Profile
            </BasicButton>
            <BasicButton onClick={onClickLogout}>Logout</BasicButton>
          </Box>
        )}
        {loggedIn && !adminUser && !buyerUser && !sellerUser && (
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <BasicButton onClick={() => navigate("/profile")}>
              Profile
            </BasicButton>
            <BasicButton onClick={onClickLogout}>Logout</BasicButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
