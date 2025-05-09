import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import {Box, Grid, Typography} from "@mui/material";
import StatCard from "../components/Cards/Analytics/StatCard.jsx";
import CustomPieChart from "../components/Cards/Analytics/PieChart.jsx";
import CustomBarChart from "../components/Cards/Analytics/BarChart.jsx";
import CustomTopList from "../components/Cards/Analytics/CustomUserListCard.jsx";
import CustomDonutChart from "../components/Cards/Analytics/DonutChart";

const AdminAnalytics = () => {
    const [overview, setOverview] = useState({});
    const [requestsByCategory, setRequestsByCategory] = useState([]);
    const [avgBidsPerCategory, setAvgBidsPerCategory] = useState([]);
    const [frozenRequests, setFrozenRequests] = useState([]);
    const [priceReductionBuyers, setPriceReductionBuyers] = useState([]);
    const [frozenBuyers, setFrozenBuyers] = useState([]);
    const [requestStatusDistribution, setRequestStatusDistribution] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setOverview({
            totalRequests: 150,
            totalAuctions: 120,
            totalBids: 1023,
            frozenRatio: "12.5%",
            avgAwardTime: "3.8 days",
        });

        setRequestsByCategory([
            { name: "IT Equipment", value: 45 },
            { name: "Furniture", value: 30 },
            { name: "Stationery", value: 15 },
            { name: "Cleaning Services", value: 7 },
            { name: "Other", value: 3 },
        ]);

        setAvgBidsPerCategory([
            { name: "IT Equipment", value: 7.2 },
            { name: "Furniture", value: 5.4 },
            { name: "Stationery", value: 6.1 },
            { name: "Cleaning Services", value: 4.9 },
            { name: "Other", value: 3.2 },
        ]);

        setFrozenBuyers([
            {
                first_name: "Lewis",
                last_name: "Hamilton",
                company_name: "Silver Arrow Ltd.",
                value1: 17, // number of frozen req
                value2: 40, //total number of proc
            },
            {
                first_name: "Max",
                last_name: "Verstappen",
                company_name: "Redline Procurements",
                value1: 15,
                value2: 38,
            },
            {
                first_name: "Charles",
                last_name: "Leclerc",
                company_name: "Scuderia Supplies",
                value1: 12,
                value2: 29,
            },
            {
                first_name: "Lando",
                last_name: "Norris",
                company_name: "OrangeTech Procurement",
                value1: 10,
                value2: 24,
            },
            {
                first_name: "Fernando",
                last_name: "Alonso",
                company_name: "Aston Trade Systems",
                value1: 9,
                value2: 22,
            },
        ]);

        setPriceReductionBuyers([
            { name: "John Doe Corp.", value: 17.8 },
            { name: "Alpha Industries", value: 15.2 },
            { name: "Global Supplies", value: 14.5 },
            { name: "EuroProcure", value: 12.9 },
            { name: "NovaTech", value: 11.3 },
        ].map((item, i) => {
            const [first_name, last_name] = item.name.split(" ");
            return {
                first_name: first_name || "N/A",
                last_name: last_name || "N/A",
                company_name: item.name,
                value1: item.value,
            };
        }));

        setRequestStatusDistribution([
            { name: "Draft", value: 20 },
            { name: "Published", value: 35 },
            { name: "In Auction", value: 25 },
            { name: "Awarded", value: 50 },
            { name: "Frozen", value: 20 },
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
                            value={overview.frozenRatio}
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
                                onRowClick={() => navigate(`/`)} // <- prepravi naknadno
                                getTooltipText={() => `Click to view full analytics for this user`}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTopList
                            title="Top 5 Buyers by Avg. Price Reduction"
                            subtitle="Buyers with highest avg. price reductions"
                            data={priceReductionBuyers}
                            onRowClick={() => navigate(`/`)} // <- prepravi naknadno
                            getTooltipText={() => `Click to view full analytics for this user`}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} mt={3}>
                        <StatCard title="Average time from request creation to award" value={overview.avgAwardTime} icon="time" />
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
            </Box>
        </Layout>
    );
};

export default AdminAnalytics;