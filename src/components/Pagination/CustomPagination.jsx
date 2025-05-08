import React from "react";
import { Pagination, Box } from "@mui/material";

const CustomPagination = ({ count, page, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        padding: "10px",
        width: "100%",
      }}
    >
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        sx={{
          "& .MuiPaginationItem-root": {
            //color: "#E3B34B", // Zlatna boja za tekst
            borderRadius: "4px", // Zaobljeni kutovi
            fontFamily: '"Montserrat", sans-serif', // Korištenje istog fonta
            fontWeight: "bold", // Deblji font za bolje isticanje
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            //backgroundColor: "#E3B34B", // Zlatna boja kada je selektovano
            color: "#14110F", // Tamni tekst kada je selektovano
          },
          "& .MuiPaginationItem-ellipsis": {
            //color: "#E3B34B", // Zlatna boja za elipsu (tri tačke)
          },
          "& .MuiPagination-ul": {
            padding: 0,
            display: "flex",
            gap: "10px",
          },
        }}
      />
    </Box>
  );
};

export default CustomPagination;
