import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const FilterSidebar = ({ onApplyFilters }) => {
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sort, setSort] = useState("popularity");

  const handleApply = () => {
    onApplyFilters({ category, minPrice, maxPrice, sort });
  };

  return (
    <Box
      sx={{
        width: "240px",
        height: "calc(100vh - 64px)",
        backgroundColor: "#0E4660",
        color: "#FFFFFF",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        top: "64px",
        left: 0,
        zIndex: 1200,
      }}
    >
      <Box>
        {/* Category Dropdown */}

        <Typography variant="subtitle1" sx={{ color: "#FFFFFF", mb: 1 }}>
        Category
          </Typography>
        <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
        <Select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  sx={{
    backgroundColor: "#FFFFFF",
    color: "#000000",
    "&.MuiFilledInput-root": {
      backgroundColor: "#FFFFFF",
    },
    "&.MuiFilledInput-root:hover": {
      backgroundColor: "#FFFFFF",
    },
    "&.MuiFilledInput-root.Mui-focused": {
      backgroundColor: "#FFFFFF",
    },
    "& .MuiSvgIcon-root": { color: "#000000" },
  }}
>
            {["all categories","clothes", "electronics", "books", "home"].map((cat) => (
              <MenuItem
                key={cat}
                value={cat}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                  },
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>



        {/* Price Range Input Fields */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: "#FFFFFF", mb: 1 }}>
            Price Range
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" ,}}>
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                },
              }}
              sx={{ width: "45%" }}
            />
            <TextField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                },
              }}
              sx={{ width: "45%" }}
            />
          </Box>
        </Box>



        {/* Sort Dropdown */}
        <Typography variant="subtitle1" sx={{ color: "#FFFFFF", mb: 1 }}>
        Sort by
          </Typography>
        <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
          <InputLabel
            sx={{
              color: "#000000",
              "&.Mui-focused": {
                color: "#000000",
              },
            }}
          >
          </InputLabel>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#000000",
              "&.MuiFilledInput-root": {
                backgroundColor: "#FFFFFF",
              },
              "&.MuiFilledInput-root:hover": {
                backgroundColor: "#FFFFFF",
              },
              "&.MuiFilledInput-root.Mui-focused": {
                backgroundColor: "#FFFFFF",
              },
              "& .MuiSvgIcon-root": { color: "#000000" },
            }}
          >
            {[{ value: "popularity", label: "Most Popular" },
              { value: "priceLowHigh", label: "Price: Low to High" },
              { value: "priceHighLow", label: "Price: High to Low" },
              { value: "newest", label: "Newest First" }]
              .map(({ value, label }) => (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#FFFFFF",
                      color: "#000000",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#FFFFFF",
                    },
                  }}
                >
                  {label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>


      </Box>

      {/* Apply Filters Button */}
      <Button
        variant="contained"
        onClick={handleApply}
        sx={{
          backgroundColor: "#FFFFFF",
          color: "#14110F",
          fontWeight: "bold",
        }}
      >
        Apply Filters
      </Button>
    </Box>
  );
};

export default FilterSidebar;
