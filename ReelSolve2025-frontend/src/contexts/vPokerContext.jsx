import React, { createContext, useState, useEffect } from 'react';
import { videoPokerVariants } from '../models/videoPokerVariants';

export const VideoPokerContext = createContext();

export const VideoPokerProvider = ({ children }) => {
  const defaultVariant = videoPokerVariants[0];
  const storedVariantId = localStorage.getItem('videoPokerVariantId');
  const initialVariant = storedVariantId
    ? videoPokerVariants.find((v) => v.id === storedVariantId) || defaultVariant
    : defaultVariant;
  const [variant, setVariant] = useState(initialVariant);

  useEffect(() => {
    localStorage.setItem('videoPokerVariantId', variant.id);
  }, [variant]);

  return (
    <VideoPokerContext.Provider value={{ variant, setVariant }}>
      {children}
    </VideoPokerContext.Provider>
  );
};