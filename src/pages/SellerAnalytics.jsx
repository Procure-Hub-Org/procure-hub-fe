import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import StatCard from "../components/Cards/Analytics/StatCard";
import CustomBarChart from "../components/Cards/Analytics/BarChart";
import CustomPieChart from "../components/Cards/Analytics/PieChart";
import CustomLineChart from "../components/Cards/Analytics/LineChart";
import { Grid, Typography, Box } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import HorizontalPercentageBarChart from "../components/Cards/Analytics/HorizontalPercentageBarChart";
import { isAuthenticated, isBuyer, isSeller, isAdmin } from '../utils/auth';

const SellerAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [awardedCategories, setAwardedCategories] = useState([]);
  const [participationCategories, setParticipationCategories] = useState([]);
  const [auctionPositions, setAuctionPositions] = useState({});
  const [priceReductions, setPriceReductions] = useState([]);
  const [performanceAttributes, setPerformanceAttributes] = useState([]); 
  const [probabilityOfWinning, setProbabilityOfWinning] = useState(0); // NOVO

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const token = localStorage.getItem("token");
    //const userId = urlParams.get("id");

    // user ID from local storage
    const decoded = JSON.parse(atob(token.split('.')[1]));
    let userId = decoded.id;

    const AdminLoged_user = urlParams.get("id");
    if (isAdmin() && AdminLoged_user) {
      userId = AdminLoged_user; //if admin is viewing another user's analytics
    }

    if (token || userId) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/seller-analytics?id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          setSummary({
            totalBids: data.totalBidsCount,
            winRatio: data.awardedToSubmittedRatio,
            avgPriceReduction: data.avgPriceReduction,
          });

          setAuctionPositions(
            Object.entries(data.top5PositionsCount || {}).map(
              ([position, value]) => ({
                position,
                value,
              })
            )
          );

          setAwardedCategories(
            Object.entries(data.awardedBidPercentages || {}).map(
              ([name, value]) => ({ name, value })
            )
          );
          setParticipationCategories(
            Object.entries(data.submittedBidPercentages || {}).map(
              ([name, value]) => ({ name, value })
            )
          );
          setPriceReductions(
            (data.averagePriceReductionOverTime || []).map((item) => ({
              position: item.column_index,
              percentage: item.average_value_in_percentage,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching buyer analytics:", error);
        });

        // performance attributes regression
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/seller-regression?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            //console.log('Response data:', response.data);

          const probabilityAttr = response.data.find(attr => attr.name === 'Probability of winning next procurement');
          setProbabilityOfWinning(probabilityAttr?.value);

          const remainingAttributes = response.data.filter(attr => attr.name !== 'Probability of winning next procurement');
          setPerformanceAttributes(remainingAttributes);
        })
        .catch((error) => {
          console.error("Error fetching seller performance attributes:", error);
          setPerformanceAttributes([]); // fallback
          setProbabilityOfWinning(0); // fallback
        });
    }
  }, []);

  useEffect(() => {}, [priceReductions]);
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
              icon="bid"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Win Ratio"
              value={`${summary.winRatio}%`}
              icon="trophy"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Avg. Price Reduction"
              value={`${summary.avgPriceReduction}%`}
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
        </Typography>v
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
        {/* New section with the horizontal percentage bar chart */}
        <Typography variant="h5" mb={2} textAlign="center">
              Performance Attributes Overview
        </Typography>
        <Box mt={6} width="60%">
          <HorizontalPercentageBarChart
            data={performanceAttributes}
            height={400}
            width="100%"
            title="Attributes Percentage"
            subtitle="Regression coefficients showing the impact of bidding factors on seller outcomes"
          />
          <Box mt={4} width="100%">
              <StatCard
                title="Probability Of Winning The Next Procurement Contract"
                value={`${probabilityOfWinning}%`}
              />
            </Box>
          </Box>
      </Box>
    </Layout>
  );
};

export default SellerAnalytics;
