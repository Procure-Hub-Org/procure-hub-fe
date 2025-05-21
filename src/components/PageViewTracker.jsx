import React from 'react';
import { usePageView } from '../utils/plausible';

const PageViewTracker = ({ children }) => {
  usePageView();
  return children;
};

export default PageViewTracker; 