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

    const [auctionData, setAuctionData] = useState({
        id: 0,
        procurement_request_title: "",
        buyer: {
            first_name: "",
            last_name: "",
            company_name: ""
        },
        min_increment: 0,
        last_call_timer: 2, // minutes
        ending_time: new Date().getTime() + 1000 * 60 * 60 // default to 1 hour from now,	
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

        // Fetch initial auction data 
        const fetchAuctionData = async () => {
            try{
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auction/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;

                setAuctionData({
                    id: data.id,
                    procurement_request_title: data.procurement_request_title,
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
                
                setSellers(mappedSellers);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching auction data:", error);
                setLoading(false);
            }
        };

        fetchAuctionData();

        //websocket connection
        const socket = io(import.meta.env.VITE_WEBSOCKET_URL);
        socketRef.current = socket;

        //listen for updates
        socket.on('connect', () => {
            console.log('WebSocket connected');
            socket.emit('joinAuctionRoom', { auctionId: id });
        });
      
        socket.on('auctionData', (data) => {
            //setSellers(data.sellers);
            console.log('Auction data emitted from server:', data);

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

        socket.on('auctionTimeUpdate', (data) => {
            setAuctionData(prev => ({
              ...prev,
              ending_time: new Date(data.ending_time).getTime()
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

    }, [token, auctionData.ending_time]);

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
            const distance = new Date(auctionData.ending_time).getTime() - now;
            
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
                navigate("/auction-dashboard"); 
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

    const handleBidSubmit = (amount) => {
        if (socketRef.current) {
            socketRef.current.emit("placeBid", {
                auctionId: id,
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

    const formatTimeFromSeconds = (time_seconds) => {
        const hours = Math.floor(time_seconds / 3600);
        const minutes = Math.floor((time_seconds % 3600) / 60);
        const seconds = time_seconds % 60;
    
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`;
        }
    };

    return (
        <Layout>
            <div className="auction-monitoring-container">
                <div className="auction-header">
                    <div className="auction-info">
                        <h1 className="auction-title">{auctionData.procurement_request_title}</h1>
                        <div className="buyer-info">
                            <span className="label">Buyer:</span> {auctionData.buyer.first_name + " " + auctionData.buyer.last_name} ({auctionData.buyer.company_name}) 
                        </div>

                        <div className="auction-details">
                            <div className="detail-items">
                                <span className="label">Minimum Increment:</span> ${auctionData.min_increment}
                            </div>
                            <div className="detail-items">
                                <span className="label">Last Call Timer:</span> {auctionData.last_call_timer} minutes
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
                                    {/*<span>Last call: {formatTimeFromSeconds(lastCallCounter-1)} </span> */}
                                    <span>LAST CALL</span>
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
                                                    <td>{rankDisplay}</td>
                                                    <td>{showFullDetails ? seller.first_name + " " + seller.last_name : (isCurrentUser ? seller.first_name + " " + seller.last_name : "****")}</td>
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