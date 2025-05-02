import React, { useState } from "react";
import AuctionBidForm from "./Modals/AuctionBidForm";
import PrimaryButton from "./Button/PrimaryButton";

const BidPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleBidSubmit = (amount) => {
    console.log("Bid submitted:", amount);
    setIsFormOpen(false);
  };

  return (
    <>
      <PrimaryButton variant="contained" onClick={() => setIsFormOpen(true)}>
        Open Bid Form
      </PrimaryButton>

      <AuctionBidForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleBidSubmit}
        currentBid={13200}
        minimumDecrement={100}
      />
    </>
  );
};

export default BidPage;
