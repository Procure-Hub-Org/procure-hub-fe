import React, { use, useEffect, useState, useRef } from 'react';
import {PlusCircle, ArrowLeft, Clock} from 'lucide-react';
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/AuctionMonitoring.css";
import axios from 'axios';
import PrimaryButton from '../components/Button/PrimaryButton';
import SecondaryButton from '../components/Button/SecondaryButton';
import Layout from '../components/Layout/Layout';
import { isAuthenticated, isBuyer, isSeller, isAdmin } from '../utils/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import AuctionBidForm from '../components/Modals/AuctionBidForm';

const AuctionMonitoring = () => {

    const navigate = useNavigate();
    const {id} = useParams(); // auction ID from URL
    //console.log("Auction ID:", id);
    const [auctionData, setAuctionData] = useState({
        id: 0,
        title: "",
        buyer: {
            first_name: "",
            last_name: "",
            company_name: ""
        },
        min_increment: 0,
        last_call_timer: 2, // minutes
        ending_time: new Date().getTime() + 1800000,	 // how will BE send?	
    });

    const [sellers, setSellers] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [lastCallCounter, setLastCallCounter] = useState(0);
    const [isLastCall, setIsLastCall] = useState(false);
    const socketRef = useRef(null);
    const timerRef = useRef(null);
    const lastCallTimerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [currentUserBidPosition, setCurrentUserBidPosition] = useState(null);
    const [userId, setUserId] = useState(null);

    const [isBidFormOpen, setIsBidFormOpen] = useState(false);
    const currentSellerBid = sellers.find(seller => seller.id === userId)?.bidAmount || 0;

    const token = localStorage.getItem("token");

    //fetching auction data and establishing socket connection
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = "/login";
            return;
        }
        
        // user ID from local storage
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = decoded.id;
        setUserId(currentUserId);
        //console.log("User ID:", currentUserId);

        // Fetch initial auction data 
        const fetchAuctionData = async () => {
            try{
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auction/${id}`, { // replace with actual api
                    headers: { Authorization: `Bearer ${token}` },
                });
                //setAuctionData(response.data);

                const data = response.data;

                setAuctionData({
                    id: data.id,
                    title: data.title,
                    buyer: data.buyer ?? { first_name: "", last_name: "", company_name: "" },
                    min_increment: data.min_increment,
                    last_call_timer: data.last_call_timer,
                    ending_time: new Date(data.ending_time).getTime()
                });


                const mappedSellers = response.data.sellers.map(bid => ({
                    id: bid.seller.id,
                    first_name: bid.seller.first_name,
                    last_name: bid.seller.last_name,
                    company_name: bid.seller.company_name,
                    bidAmount: bid.auction_price,
                    position: bid.auction_placement
                }));
                
                /*setAuctionData(prev => ({
                    ...prev,
                    ...response.data,
                }));*/
                
                setSellers(mappedSellers);
                console.log("Sellers:", mappedSellers);
                console.log("Auction Data:", auctionData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching auction data:", error);
                setLoading(false);
            }
        };

        fetchAuctionData();

        /*setTimeout(() => {
            setAuctionData({
                id: 1,
                title: "Office Supplies Procurement",
                buyer: {
                    first_name: "John",
                    last_name: "Doe",
                    company_name: "Acme Corporation"
                },
                min_increment: 50,
                last_call_timer: 2, // in minutes
                ending_time: new Date().getTime() + 180000, // 3 minutes from now
            });

            setSellers([
                { id: 2, first_name: "Your", last_name: "Name", company_name: "Your Company", bidAmount: 1000, position: 1 },
                { id: 5678, first_name: "Jane", last_name: "Doe", company_name: "ABC Inc", bidAmount: 950, position: 2 },
                { id: 9012, first_name: "Bob", last_name: "Johnson", company_name: "XYZ Corp", bidAmount: 900, position: 3 },
                { id: 3546, first_name: "Alice", last_name: "Brown", company_name: "123 Industries", bidAmount: 850, position: 4 },
            ]);
        
            setLoading(false);
        }, 1000);*/

        //websocket connection
        const socket = io(import.meta.env.VITE_WEBSOCKET_URL);
        socketRef.current = socket;

        //listen for updates
        socket.on('connect', () => {
            console.log('WebSocket connected');
            socket.emit('join-auction', { auctionId: id });
        });
      
        socket.on('auction-update', (data) => {
            //setSellers(data.sellers);

            const mappedSellers = data.sellers.map(bid => ({
                id: bid.seller.id,
                first_name: bid.seller.first_name,
                last_name: bid.seller.last_name,
                company_name: bid.seller.company_name,
                bidAmount: bid.auction_price,
                position: bid.auction_placement
            }));
        
            setSellers(mappedSellers);
            
            // Reset last call timer if there's a new winning bid within last call period
            if (isLastCall && data.newBid) {
                resetLastCallTimer();
            }
        });

        socket.on('auction-time-update', (data) => {
            setAuctionData(prev => ({
              ...prev,
              ending_time: data.ending_time
            }));
        });
      
        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });
      
        // Start the timers
        startCountdownTimer();

        // Cleanup
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (lastCallTimerRef.current) {
                clearInterval(lastCallTimerRef.current);
            }
        };

    }, [token]);

    //update current user's position in the auction
    useEffect(() => {
        if (isSeller() && sellers.length > 0 && userId) {
            const userSeller = sellers.find(seller => seller.id === userId);
            if (userSeller) {
              setCurrentUserBidPosition(userSeller.position);
            }
        }
    }, [sellers, userId]);

    //start countdown timer
    const startCountdownTimer = () => {
        timerRef.current = setInterval(() => {
            const now = new Date().getTime();
            const distance = auctionData.ending_time - now;
            
            //time calculations
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
            setTimeRemaining({ hours, minutes, seconds });

            //check if we should enter last call
            if (distance <= auctionData.last_call_timer * 1000 * 60 && !isLastCall) {
                startLastCallTimer();
            }

            //check if auction ended
            if (distance < 0) {
                clearInterval(timerRef.current);
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                navigate("/auction-dashboard"); //check if the route is correct
            }
        }, 1000);
    };

    // Start last call timer
    const startLastCallTimer = () => {
        setIsLastCall(true);
        setLastCallCounter(auctionData.last_call_timer * 60);
        
        lastCallTimerRef.current = setInterval(() => {
        setLastCallCounter((prev) => {
            if (prev <= 1) {
                clearInterval(lastCallTimerRef.current);
                return 0;
            }
            return prev - 1;
        });
        }, 1000);
    };

    // Reset last call timer when a new bid comes in
    const resetLastCallTimer = () => {
        clearInterval(lastCallTimerRef.current);
        startLastCallTimer();
    };

    // Handle send bid button click
    const handleSendBid = () => {
        navigate('/bid-submission', { state: { auctionId: auctionData.id } }); //pop-up should appear
    };

    const handleBidSubmit = (amount) => {
        if (socketRef.current) {
            socketRef.current.emit("placeBid", {
                id,
                price: amount,
                userId,
            });
            console.log("Bid submitted:", amount);
        } else {
            console.error("Socket not connected.");
        }
        setIsBidFormOpen(false);
    };    

    // Handle cancel button click
    const handleClose = () => {
        if (isAdmin()){
            navigate("/admin-auctions");
        }
        else if (isBuyer()){
            navigate("/buyer-auctions");
        }
        else if (isSeller()){
            navigate("/seller-auctions");
        } 
    };

    // Format time for display
    const formatTime = ({ hours, minutes, seconds }) => {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Layout>
            <div className="auction-monitoring-container">
                <div className="auction-header">
                    <div className="auction-info">
                        <h1 className="auction-title">{auctionData.title}</h1>
                        <div className="buyer-info">
                            <span className="label">Buyer:</span> {auctionData.buyer.first_name + " " + auctionData.buyer.last_name} ({auctionData.buyer.company_name}) 
                        </div>

                        <div className="auction-details">
                            <div className="detail-items">
                                <span className="label">Minimum Increment:</span> ${auctionData.min_increment}
                            </div>
                            <div className="detail-items">
                                <span className="label">Last Call Timer:</span> {auctionData.last_call_timer} minutes {/*check if seconds/minutes will we sent by BE*/}
                            </div>
                        </div>
                    </div>
          
                    <div className="timer-section">
                        <div className="countdown-timer">
                            <div className="timer-icon"><Clock size={20} /></div>
                                <div className="timer-value">{formatTime(timeRemaining)}</div>
                            </div>

                            {isLastCall && (
                                <div className="last-call-alert">
                                    <span>LAST CALL: {lastCallCounter} seconds </span> {/*check if seconds/minutes will we sent by BE*/}
                                </div>
                            )}

                            <div className="timer-actions">
                                {isSeller() && (
                                    <PrimaryButton onClick={() => setIsBidFormOpen(true)} startIcon={<SendIcon />}>Send Bid</PrimaryButton>
                                )}
                                <SecondaryButton onClick={() => handleClose()} startIcon={<CloseIcon />}>Close Details</SecondaryButton>
                            </div>
                        </div>
                    </div>
        
                    <div className="leaderboard-section">
                        <h2>Auction Leaderboard</h2>
                        {loading ? (
                                <div className="loading">Loading leaderboard data...</div>
                            ) : (
                                <table className="leaderboard-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Seller</th>
                                            <th>Company</th>
                                            <th>Current Bid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellers.map((seller) => {
                                            const isCurrentUser = seller.id === userId;
                                            const showFullDetails = isAdmin() || isBuyer() || isCurrentUser;
                                            const rowClass = isCurrentUser ? 'current-user-row' : 
                                                (isSeller() && !isCurrentUser ? 'competitor-row' : '');

                                            const rankDisplay = seller.position === 1 ? (<span className="emoji gold-medal">🥇</span>) 
                                                                : seller.position === 2 ? (<span className="emoji silver-medal">🥈</span>) 
                                                                : seller.position === 3 ? (<span className="emoji bronze-medal">🥉</span>) 
                                                                : (seller.position);
                
                                            return (
                                                <tr key={seller.id} className={rowClass}>
                                                    {/*<td>{seller.position}</td>*/}
                                                    <td>{rankDisplay}</td>
                                                    <td>{showFullDetails ? seller.first_name + " " + seller.last_name : (isCurrentUser ? seller.fullName : "****")}</td>
                                                    <td>{showFullDetails ? seller.company_name : (isCurrentUser ? seller.company_name : "****")}</td>
                                                    <td>{ (isAdmin() || isBuyer() || isCurrentUser) ? `$${seller.bidAmount.toLocaleString()}` : "*"}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                        )}
                    </div>
                </div>
                
{/* popup for bid submission */}
                {isBidFormOpen && ( 
                    <AuctionBidForm
                    open={isBidFormOpen}
                    onClose={() => setIsBidFormOpen(false)}
                    onSubmit={handleBidSubmit}
                    currentBid={currentSellerBid}
                    minimumDecrement={auctionData.min_increment}
                  />
                )}
        </Layout>
    );
};

export default AuctionMonitoring;