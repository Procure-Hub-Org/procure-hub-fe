import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import {Box, Grid, Typography} from "@mui/material";
import StatCard from "../components/Cards/Analytics/StatCard.jsx";
import CustomPieChart from "../components/Cards/Analytics/PieChart.jsx";
import CustomBarChart from "../components/Cards/Analytics/BarChart.jsx";
import CustomTopList from "../components/Cards/Analytics/CustomUserListCard.jsx";
import CustomDonutChart from "../components/Cards/Analytics/DonutChart";
import {isAdmin, isAuthenticated} from "../utils/auth.jsx";
import axios from "axios";
import PrimaryButton from "../components/Button/PrimaryButton.jsx";
import PlausibleDashboardPopup from "../components/Cards/Popups/PlausibleDashboardPopup.jsx";

const AdminAnalytics = () => {
    const [overview, setOverview] = useState({
        totalRequests: null,
        totalAuctions: null,
        totalBids: null,
        frozenRatio: null,
        avgAwardTime: null,
    });
    const [requestsByCategory, setRequestsByCategory] = useState([]);
    const [avgBidsPerCategory, setAvgBidsPerCategory] = useState([]);
    const [priceReductionBuyers, setPriceReductionBuyers] = useState([]);
    const [frozenBuyers, setFrozenBuyers] = useState([]);
    const [requestStatusDistribution, setRequestStatusDistribution] = useState([]);
    const [plausibleOpen, setPlausibleOpen] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!isAdmin()) {
            window.location.href = isAuthenticated() ? "/" : "/login";
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const fetchOverviewData = async () => {
            try {
                const [
                    totalRequestsRes,
                    totalAuctionsRes,
                    totalBidsRes,
                    frozenRatioRes,
                    avgAwardTimeRes,
                ] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/frozen-requests-ratio`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/auctions-count`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/bids-count`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/frozen-requests-ratio`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics/avg-time-to-award`, { headers }),
                ]);

                setOverview({
                    totalRequests: totalRequestsRes.data.total_count,
                    totalAuctions: totalAuctionsRes.data.total_auctions,
                    totalBids: totalBidsRes.data.total_bids,
                    frozenRatio: frozenRatioRes.data.frozen_ratio,
                    avgAwardTime: avgAwardTimeRes.data.average_time_minutes,
                });
            } catch (error) {
                console.error("Error fetching overview analytics:", error);
            }
        };

        const fetchRequestStatusDistribution = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/analytics/requests-status-distribution`,
                    { headers }
                );
                setRequestStatusDistribution(
                    response.data.map((item) => ({ name: item.status, value: item.count }))
                );
            } catch (error) {
                console.error("Error fetching request status distribution:", error);
            }
        };

        const fetchRequestsByCategory = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/analytics/requests-by-categories`,
                    { headers }
                );
                setRequestsByCategory(
                    response.data.map((item) => ({ name: item.category, value: parseInt(item.total_requests) }))
                );
            } catch (error) {
                console.error("Error fetching requests by category distribution:", error);
            }
        };

        const fetchAvgBidsPerCategory = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/analytics/avg-bids-by-category`,
                    { headers }
                );
                setAvgBidsPerCategory(
                    response.data.map((item) => ({ name: item.category, value: item.avg_bids }))
                );
            } catch (error) {
                console.error("Error fetching average bids per category:", error);
            }
        };

        const fetchTopFrozenBuyers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/analytics/top5-buyers-frozen`,
                    { headers }
                );
                setFrozenBuyers(
                    response.data.map(buyer => ({
                        buyer_id: buyer.buyer_id,
                        first_name: buyer.first_name,
                        last_name: buyer.last_name,
                        company_name: buyer.company_name,
                        value1: parseInt(buyer.frozen_requests_count),
                        value2: parseInt(buyer.total_requests_count),
                    }))
                );
            } catch (error) {
                console.error("Error fetching top frozen buyers:", error);
            }
        };

        const fetchTopPriceReductionBuyers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/admin/analytics/top5-buyers-price-reduction`,
                    { headers }
                );
                setPriceReductionBuyers(
                    response.data.map(buyer => ({
                        buyer_id: buyer.buyer_id,
                        first_name: buyer.first_name,
                        last_name: buyer.last_name,
                        company_name: buyer.company_name,
                        value1: parseFloat(buyer.average_benefit),      // % reduction
                        auctions: buyer.auctions                        // array of auction stats if needed
                    }))
                );
            } catch (error) {
                console.error("Error fetching top price reduction buyers:", error);
            }
        };

        fetchOverviewData();
        fetchRequestStatusDistribution();
        fetchRequestsByCategory();
        fetchAvgBidsPerCategory();
        fetchTopFrozenBuyers();
        fetchTopPriceReductionBuyers();

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
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 2, mr: 8
                 }}>
                    <PrimaryButton onClick={() => setPlausibleOpen(true)}>
                        Platform Growth
                    </PrimaryButton>
                </Box>

                <Typography variant="h5" mt={4} mb={2}>
                    Platform Overview
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Requests"
                            value={overview.totalRequests}
                            icon="request"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Auctions"
                            value={overview.totalAuctions}
                            icon="auction"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Bids"
                            value={overview.totalBids}
                            icon="bid"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Frozen Ratio"
                            value={`${overview.frozenRatio}%`}
                            icon="freeze"
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" mt={4} mb={2}>
                    Category Analysis
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <CustomPieChart
                            title="Requests by Category"
                            subtitle="Distribution of requests across product categories"
                            data={requestsByCategory}
                            height={300}
                            width={800}
                            colors={["#4e79a7", "#f28e2b", "#e15759", "#59a14f", "#8cd17d"]}
                            tooltipFormatter={(value) => value}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CustomBarChart
                            title="Average Bids per Request"
                            subtitle="Avg. number of bids per request by category"
                            data={avgBidsPerCategory}
                            xKey="name"
                            yKey="value"
                            barColor="#3f51b5"
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" mt={4} mb={2}>
                    Performance Insights
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <CustomTopList
                                title="Top 5 Buyers by Frozen Requests"
                                subtitle="Buyers with most frozen requests"
                                data={frozenBuyers}
                                onRowClick={(buyer) => navigate(`/buyer-analytics?id=${buyer.buyer_id}`)}
                                getTooltipText={() => `Click to view full analytics for this user`}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTopList
                            title="Top 5 Buyers by Avg. Price Reduction"
                            subtitle="Buyers with highest average price reduction (%)"
                            data={priceReductionBuyers}
                            onRowClick={(buyer) => navigate(`/buyer-analytics?id=${buyer.buyer_id}`)}
                            getTooltipText={() => `Click to view full analytics for this user`}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} mt={3}>
                        <StatCard
                                title="Average time from request creation to award"
                                value={
                                    overview.avgAwardTime > 1440
                                    ? `${(overview.avgAwardTime / 1440).toFixed(0)} days ${((overview.avgAwardTime % 1440)/60).toFixed(0)} hours ${((overview.avgAwardTime % 1440)%60).toFixed(0)} minutes`
                                    : (overview.avgAwardTime > 60
                                        ? `${(overview.avgAwardTime / 60).toFixed(0)} hours ${(overview.avgAwardTime % 60).toFixed(0)} minutes`
                                        : `${overview.avgAwardTime} minutes`)
                                    /*overview.avgAwardTime > 60
                                    ? `${(overview.avgAwardTime / 60).toFixed(2)} hours`
                                    : `${overview.avgAwardTime} minutes`*/
                                }
                                icon="time"
                                />
                    </Grid>
                </Grid>

                <Typography variant="h5" mt={4} mb={2}>
                    Request Analysis
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <CustomDonutChart
                            title="Request Status Distribution"
                            subtitle="Current state of all procurement requests"
                            data={requestStatusDistribution}
                            height={400}
                            width={800}
                            colors={["#4e79a7", "#f28e2b", "#e15759", "#59a14f", "#8cd17d"]}
                        />
                    </Grid>
                </Grid>

                <PlausibleDashboardPopup 
                    open={plausibleOpen}
                    onClose={() => setPlausibleOpen(false)}
                />
            </Box>
        </Layout>
    );
};

export default AdminAnalytics;