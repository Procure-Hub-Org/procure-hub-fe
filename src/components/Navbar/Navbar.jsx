import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import BasicButton from "../Button/BasicButton";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const adminUser = isAdmin();

  function onClickLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <AppBar
      position="static"
      sx={{ background: "#14110F", width: "100%", boxSizing: "border-box" }}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Typography
          onClick={() => navigate("/")}
          variant="h4"
          sx={{
            color: "#E3B34B",
            fontFamily: "Montserrat, sans-serif",
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
            <BasicButton onClick={() => navigate("/profile")}>
              Profile
            </BasicButton>
            <BasicButton onClick={() => navigate("/admin")}>
              Dashboard
            </BasicButton>
            <BasicButton onClick={() => navigate("/create-user")}>
              Create User
            </BasicButton>
            <BasicButton onClick={onClickLogout}>Logout</BasicButton>
          </Box>
        )}
        {loggedIn && !adminUser && (
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
