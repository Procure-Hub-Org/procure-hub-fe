import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import StatCard from "../components/Cards/Analytics/StatCard";
import CustomBarChart from "../components/Cards/Analytics/BarChart";
import ResponseTimeCard from "../components/Cards/Analytics/ResponseTimeCard";
import { Grid, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BuyerAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = urlParams.get("id");
    if (token || userId) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/buyer-analytics?id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const data = response.data;
          setSummary({
            totalRequests: data.totalRequests,
            avgBids: data.avgBids,
            awardedRatio: data.awardedRatio,
            frozenRequests: data.frozenRequests,
            auctionBenefits: data.auctionBenefits,
            avgTime: data.avgTime,
          });

          setCategories(data.requestPerCategory);
          setCriteria(data.criteriaFrequency);
        })
        .catch((error) => {
          console.error("Error fetching buyer analytics:", error);
        });
    }
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
          Activity Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard title="Total Requests" value={summary.totalRequests} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard title="Avg. Bids per Request" value={summary.avgBids} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Awarded Ratio"
              value={`${summary.awardedRatio}%`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Frozen Requests"
              value={`${summary.frozenRequests}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Auction Benefits"
              value={`${summary.auctionBenefits}%`}
            />
          </Grid>
        </Grid>

        <Box mt={4} mb={2}>
          <Typography variant="h5">Category Analysis</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomBarChart
              title="Requests by Category"
              subtitle={"Distribution of requests across categories"}
              data={categories}
              xKey="category"
              yKey="count"
              height={300}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomBarChart
              title="Criteria Frequency"
              subtitle={"How often each criterion is used in requests"}
              data={criteria}
              xKey="criterion"
              yKey="count"
              barColor="#FF9800"
              height={300}
            />
          </Grid>
        </Grid>
        <Box mt={4} mb={2}>
          <Typography variant="h5">Performance Analysis</Typography>
        </Box>
        <Grid item xs={12} sm={6} md={4}>
          <ResponseTimeCard
            title="Average Response Time"
            subtitle="Time from request publication to first bid"
            averageTime={summary.avgTime}
          ></ResponseTimeCard>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BuyerAnalytics;
