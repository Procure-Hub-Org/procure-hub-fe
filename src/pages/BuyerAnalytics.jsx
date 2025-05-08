import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import StatCard from "../components/Cards/Analytics/StatCard";
import CustomBarChart from "../components/Cards/Analytics/BarChart";
import ResponseTimeCard from "../components/Cards/Analytics/ResponseTimeCard";
import { Grid, Typography, Box } from "@mui/material";

const BuyerAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [categories, setCategories] = useState([]);
  const [criteria, setCriteria] = useState([]);

  useEffect(() => {
    setSummary({
      totalRequests: 128,
      avgBids: 5.3,
      awardedRatio: 78,
      frozenRequests: 12,
      auctionBenefits: 15.3,
    });

    setCategories([
      { category: "IT Hardware", count: 60 },
      { category: "Software Licenses", count: 45 },
      { category: "Marketing", count: 30 },
    ]);

    setCriteria([
      { criterion: "Price", count: 100 },
      { criterion: "Quality", count: 75 },
      { criterion: "Technical Compliance", count: 50 },
      { criterion: "Sustainability", count: 25 },
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
          Activity Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Total Requests"
              value={summary.totalRequests}
              change={summary.totalRequestsChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Avg. Bids per Request"
              value={summary.avgBids}
              change={summary.avgBidsChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Awarded Ratio"
              value={`${summary.awardedRatio}%`}
              change={summary.awardedRatioChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Frozen Requests"
              value={`${summary.frozenRequests}`}
              change={summary.frozenRequestsChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <StatCard
              title="Auction Benefits"
              value={`${summary.auctionBenefits}%`}
              change={summary.auctionBenefitsChange}
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
            averageTime="2.5"
          ></ResponseTimeCard>
        </Grid>
      </Box>
    </Layout>
  );
};

export default BuyerAnalytics;
