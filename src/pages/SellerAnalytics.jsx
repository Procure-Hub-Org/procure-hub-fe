import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import StatCard from "../components/Cards/Analytics/StatCard";
import CustomBarChart from "../components/Cards/Analytics/BarChart";
import CustomPieChart from "../components/Cards/Analytics/PieChart";
import CustomLineChart from "../components/Cards/Analytics/LineChart";
import { Grid, Typography, Box } from "@mui/material";

const SellerAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [awardedCategories, setAwardedCategories] = useState([]);
  const [participationCategories, setParticipationCategories] = useState([]);
  const [auctionPositions, setAuctionPositions] = useState([]);
  const [priceReductions, setPriceReductions] = useState([]);

  useEffect(() => {
    setSummary({
      totalBids: 342,
      winRatio: 32,
      avgPriceReduction: 8.7,
    });

    setAwardedCategories([
      { name: "IT Hardware", value: 35 },
      { name: "Office Supplies", value: 25 },
      { name: "Professional Services", value: 20 },
      { name: "Software Licenses", value: 15 },
      { name: "Other", value: 5 },
    ]);

    setParticipationCategories([
      { name: "IT Hardware", value: 30 },
      { name: "Office Supplies", value: 25 },
      { name: "Professional Services", value: 20 },
      { name: "Software Licenses", value: 15 },
      { name: "Facility Management", value: 10 },
    ]);

    setAuctionPositions([
      { position: "1st (Winner)", value: 100 },
      { position: "2nd", value: 75 },
      { position: "3rd", value: 50 },
      { position: "4th", value: 25 },
      { position: "5th or below", value: 0 },
    ]);

    setPriceReductions([
        { position: "0", percentage: 100 },
        { position: "1", percentage: 96.5 },
        { position: "2", percentage: 94.3 },
      ]);
    }, []);      

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Typography variant="h5" mt={4} mb={2}>
          Platform Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Total Bids Submitted"
              value={summary.totalBids}
              change={summary.totalBidsChange}
              icon="bid"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Win Ratio"
              value={`${summary.winRatio}%`}
              change={summary.winRatioChange}
              icon="trophy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Avg. Price Reduction"
              value={`${summary.avgPriceReduction}%`}
              change={summary.avgPriceReductionChange}
              icon="price"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" mt={4} mb={2}>
          Category Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <CustomPieChart
              data={awardedCategories}
              title="Awarded Categories"
              subtitle="Distribution of awarded bids by category"
              height={300}
              colors={["#4e79a7", "#f28e2b", "#e15759", "#59a14f", "#8cd17d"]}
              width={800}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <CustomPieChart
              title="Participation Categories"
              subtitle="Distribution of submitted bids by category"
              data={participationCategories}
              height={300}
              colors={["#4e79a7", "#f28e2b", "#e15759", "#59a14f", "#8cd17d"]}
              width={800}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" mt={4} mb={2}>
          Auction Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <CustomBarChart
              title="Auction Positions"
              subtitle="Number of top 5 auction placements by position"
              data={auctionPositions}
              xKey="position"
              yKey="value"
              barColor="#3f51b5"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <CustomLineChart
              data={priceReductions}
              xKey="position"
              yKey="percentage"
              lineColor="#e15759"
              title="Price Reductions Over Time"
              subtitle="Average bid price as % of initial price per bid position"
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default SellerAnalytics;
