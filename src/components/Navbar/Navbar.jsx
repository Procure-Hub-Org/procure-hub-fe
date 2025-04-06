import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import BasicButton from "../Button/BasicButton";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); 
  return (
    <AppBar position="static" sx={{ background: "#14110F", width: "100%", boxSizing: "border-box" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h4" sx={{ color: "#E3B34B", fontFamily: "Montserrat, sans-serif" }}>
          ProcureHub
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <BasicButton onClick={() => navigate("/register")}>Register</BasicButton>
          <BasicButton onClick={() => navigate("/login")}>Login</BasicButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

