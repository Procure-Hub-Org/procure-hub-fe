import React from 'react';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryButton from '../Button/SecondaryButton';
import '../../styles/BidProposalCard.css';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Stack,
} from "@mui/material";

import {
  FilePresent as FileIcon,
} from "@mui/icons-material";

import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import JpgIcon from '@mui/icons-material/Image';

// {bidProposals.map(bid => (
//   <BidProposalCard
//     key={bid.id}
//     bid={bid}
//     onEvaluate={() => handleEvaluateClick(bid.id)}
//     onAward={() => handleAwardBid(bid.id)}
//     isAwardDisabled={awardedBidId !== null && awardedBidId !== bid.id}
//   />
// ))}

function getIconForFileType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PdfIcon color="action" />;
    case 'doc':
    case 'docx':
      return <DocIcon color="action" />;
    case 'jpg':
    case 'png':
    case 'jpeg':
      return <JpgIcon color="action" />;
    // Add more cases for other file types if needed
    default:
      return <FileIcon color="action" />;
  }
}

const BidProposalCard = ({ bid, onEvaluate, onAward, isAwardDisabled }) => {
  const { 
    sellerName, 
    sellerLogo, 
    sellerCompany,
    price, 
    deliveryTime, 
    proposalDescription, 
    submissionDate, 
    isEvaluated, 
    evaluation,
    isAwarded,
    auctionHeld,
    bidAuctionPrice,
    documents,
    procurementRequestId,
    isRequestAwarded,
  } = bid;

  return (
    <div className={`bid-proposal-card ${isAwarded ? 'awarded' : ''}`}>
      {isAwarded && <div className="awarded-badge">Awarded</div>}
      
      <div className="bid-header">   
        <div className="seller-info">
          <h4>{sellerCompany}</h4> 
          <h6>{sellerName}</h6>
        </div>
             
        <div className="bid-submission-date">
          Submitted: {new Date(submissionDate).toLocaleDateString()}
        </div>
      </div>
      
      <div className="bid-details">
        <div className="bid-detail-item">
          <span className="label">Bid price:</span>
          <span className="value">${price}</span>
        </div>

        {auctionHeld && (
          <div className="bid-detail-item">
            <span className="label">Price after auction: </span>
            <span className="value">${bidAuctionPrice}</span>
          </div>
        )}
        
      </div>

      <div className="bid-details">
        <div className="bid-detail-item">
            <span className="label">Delivery time:</span>
            <span className="value">{deliveryTime} {/*days*/}</span>
        </div>
      </div>
      
      <div className="bid-details">
        <div className="bid-proposal">
          <span className="label">Proposal text:</span>
          <p>{proposalDescription}</p>
        </div>
      </div>

      <div className="bid-documentation">
        <span className="label">Documentation:</span>

        {documents.length > 0 && (
          console.log("Documents: ", documents),
          <Box mt={3} px={0} sx={{ width: "100%" }}>

            {documents.map((doc) => (
              <Paper
                key={doc.id}
                sx={{
                  p: 2,
                  my: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/*<FileIcon color="action" />*/}
                  {getIconForFileType(doc.original_name)}
                  <Box>
                    {/*<Typography fontWeight="bold">{doc.original_name}</Typography>*/}
                    <Typography fontWeight="bold">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">{doc.original_name}</a>
                    </Typography>
                  </Box>
                </Stack>

              </Paper>
            ))}
          </Box>
        )}

        {documents.length === 0 && (
          <span className="value"> <br></br>
            No documents have been uploaded.
          </span>
        )}

      </div>
      
      {isEvaluated && (
      <div className="evaluation-results">
        <h5>Evaluation Scores</h5>
        <div className="scores-grid">

          {Array.isArray(evaluation.scores) && evaluation.scores.length > 0 ? (
            evaluation.scores.map((scoreItem, index) => (
              <div key={index} className="score-item">
                <div className="score-item-row">
                  <span className="criterion">
                    <strong>{scoreItem.criteriaName}:</strong>
                  </span>
                  <span className="score">Score: {scoreItem.score}</span>
                  <span className="weight">Weight: {scoreItem.weight}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No evaluations available</p> // Fallback poruka ako nema evaluacija
          )}

        </div>
        <div className="average-score">
          <span className="label">Average Score:</span>
          <span className="score">{evaluation.averageScore}</span>
        </div>
        {/*evaluation.comment && (
          <div className="evaluation-comment">
            <span className="label">Comment:</span>
            <p>{evaluation.comment}</p>
          </div>
        )*/}
      </div>
    )}

    {isRequestAwarded && !isEvaluated && (
      <div className="evaluation-results">
        <h5>Bid proposal has not been evaluated</h5>
      </div>
    )}
      
      { !isRequestAwarded && (
        <div className="bid-actions">
          {!isEvaluated || evaluation?.averageScore === "Pending" ? (
            <PrimaryButton onClick={onEvaluate}>Evaluate</PrimaryButton>
          ) : (
            <SecondaryButton 
              onClick={onAward} 
              disabled={isAwardDisabled && !isAwarded}
              className={isAwarded ? 'awarded-button' : ''}
            >
              {isAwarded ? 'Awarded' : 'Award Bid and Generate Contract'}
            </SecondaryButton>
          )}
        </div>
      )}
    </div>
  );
};

export default BidProposalCard;