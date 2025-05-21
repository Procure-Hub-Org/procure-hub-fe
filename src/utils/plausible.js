/**
 * Plausible Analytics utility functions
 */

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Helper function to ensure Plausible is available
const ensurePlausible = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    if (!window.plausible) {
      window.plausible = function() { 
        try {
          (window.plausible.q = window.plausible.q || []).push(arguments);
        } catch (e) {
          console.warn('Plausible tracking failed:', e);
        }
      };
    }
    return true;
  } catch (e) {
    console.warn('Plausible initialization failed:', e);
    return false;
  }
};

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} [props] - Additional properties for the event
 */
export const trackEvent = (eventName, props = {}) => {
  try {
    if (ensurePlausible()) {
      window.plausible(eventName, { props });
    }
  } catch (e) {
    console.warn('Failed to track event:', eventName, e);
  }
};

/**
 * Track page view
 * @param {string} [url] - URL to track (defaults to current URL)
 */
export const trackPageView = (url) => {
  try {
    if (ensurePlausible()) {
      window.plausible('pageview', { url });
    }
  } catch (e) {
    console.warn('Failed to track pageview:', e);
  }
};

/**
 * Track file download
 * @param {string} fileName - Name of the downloaded file
 * @param {Object} [props] - Additional properties for the event
 */
export const trackFileDownload = (fileName, props = {}) => {
  if (window.plausible) {
    window.plausible('file-download', { 
      props: {
        file: fileName,
        ...props
      }
    });
  }
};

/**
 * Track outbound link click
 * @param {string} url - The URL that was clicked
 * @param {Object} [props] - Additional properties for the event
 */
export const trackOutboundLink = (url, props = {}) => {
  if (window.plausible) {
    window.plausible('outbound-link', {
      props: {
        url,
        ...props
      }
    });
  }
};

/**
 * Track revenue
 * @param {number} amount - Amount of revenue
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {Object} [props] - Additional properties for the event
 */
export const trackRevenue = (amount, currency, props = {}) => {
  if (window.plausible) {
    window.plausible('revenue', {
      props: {
        amount,
        currency,
        ...props
      }
    });
  }
};

/**
 * Track suspicious activity report
 * @param {string} type - Type of suspicious activity
 * @param {string} targetId - ID of the reported item (request, bid, auction, etc.)
 * @param {Object} [props] - Additional properties for the event
 */
export const trackSuspiciousActivity = (type, targetId, props = {}) => {
  if (window.plausible) {
    window.plausible('suspicious_activity', {
      props: {
        type,
        target_id: targetId,
        ...props
      }
    });
  }
};

/**
 * Track document upload
 * @param {string} documentType - Type of document (e.g., 'certificate', 'proposal', 'contract')
 * @param {string} relatedTo - What the document is related to (e.g., 'bid', 'request', 'auction')
 * @param {string} relatedId - ID of the related item
 * @param {Object} [props] - Additional properties for the event
 */
export const trackDocumentUpload = (documentType, relatedTo, relatedId, props = {}) => {
  if (window.plausible) {
    window.plausible('document_upload', {
      props: {
        document_type: documentType,
        related_to: relatedTo,
        related_id: relatedId,
        ...props
      }
    });
  }
};

/**
 * Track dispute creation
 * @param {string} type - Type of dispute (e.g., 'bid', 'auction', 'contract')
 * @param {string} targetId - ID of the disputed item
 * @param {string} reason - Reason for the dispute
 * @param {Object} [props] - Additional properties for the event
 */
export const trackDispute = (type, targetId, reason, props = {}) => {
  if (window.plausible) {
    window.plausible('dispute', {
      props: {
        type,
        target_id: targetId,
        reason,
        ...props
      }
    });
  }
};

/**
 * Track bid award
 * @param {string} bidId - ID of the awarded bid
 * @param {string} procurementRequestId - ID of the procurement request
 * @param {Object} [props] - Additional properties for the event
 */
export const trackBidAward = (bidId, procurementRequestId, props = {}) => {
  if (window.plausible) {
    window.plausible('bid_award', {
      props: {
        bid_id: bidId,
        procurement_request_id: procurementRequestId,
        ...props
      }
    });
  }
};

/**
 * Track contract creation
 * @param {string} contractId - ID of the created contract
 * @param {string} bidId - ID of the awarded bid
 * @param {string} procurementRequestId - ID of the procurement request
 * @param {Object} [props] - Additional properties for the event
 */
export const trackContractCreation = (contractId, bidId, procurementRequestId, props = {}) => {
  if (window.plausible) {
    window.plausible('contract_creation', {
      props: {
        contract_id: contractId,
        bid_id: bidId,
        procurement_request_id: procurementRequestId,
        ...props
      }
    });
  }
};

export const usePageView = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      if (ensurePlausible()) {
        window.plausible('pageview', {
          url: pathname
        });
      }
    } catch (e) {
      console.warn('Failed to track pageview in usePageView:', e);
    }
  }, [pathname]);
}; 