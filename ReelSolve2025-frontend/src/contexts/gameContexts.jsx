import React, { createContext, useState, useContext, useEffect } from 'react';
import { videoPokerVariants } from '../models/videoPokerVariants';

// =============================================================================
// Default values
// =============================================================================

// Default symbol library with realistic slot machine symbols
const defaultSymbols = [
  // High Paying Symbols
  {
    id: 1,
    name: "Diamond",
    image: "",
    color: "#3FB8AF",
    payouts: { 3: 50, 4: 150, 5: 500 },
    isWild: false,
    isScatter: false
  },
  {
    id: 2,
    name: "Seven",
    image: "",
    color: "#FF3366",
    payouts: { 3: 30, 4: 100, 5: 300 },
    isWild: false,
    isScatter: false
  },
  {
    id: 3,
    name: "Cherry",
    image: "",
    color: "#FF0000",
    payouts: { 3: 15, 4: 40, 5: 100 },
    isWild: false,
    isScatter: false
  },
  {
    id: 4,
    name: "Bell",
    image: "",
    color: "#FFD700",
    payouts: { 3: 20, 4: 60, 5: 150 },
    isWild: false,
    isScatter: false
  },
  {
    id: 5,
    name: "BAR",
    image: "",
    color: "#000000",
    payouts: { 3: 25, 4: 75, 5: 200 },
    isWild: false,
    isScatter: false
  },
  {
    id: 6,
    name: "Lemon",
    image: "",
    color: "#FFF44F",
    payouts: { 3: 10, 4: 30, 5: 80 },
    isWild: false,
    isScatter: false
  },
  {
    id: 7,
    name: "Orange",
    image: "",
    color: "#FFA500",
    payouts: { 3: 12, 4: 35, 5: 90 },
    isWild: false,
    isScatter: false
  },
  {
    id: 8,
    name: "Plum",
    image: "",
    color: "#8E4585",
    payouts: { 3: 18, 4: 55, 5: 130 },
    isWild: false,
    isScatter: false
  },
  {
    id: 9,
    name: "Grapes",
    image: "",
    color: "#6F2DA8",
    payouts: { 3: 16, 4: 50, 5: 120 },
    isWild: false,
    isScatter: false
  },
  {
    id: 10,
    name: "Wild",
    image: "",
    color: "#00FF00",
    payouts: { 3: 0, 4: 0, 5: 0 },
    isWild: true,
    isScatter: false
  },
  {
    id: 11,
    name: "Scatter",
    image: "",
    color: "#FF5722",
    payouts: { 3: 5, 4: 20, 5: 100 },
    isWild: false,
    isScatter: true
  }
];

// =============================================================================
// Context Creation
// =============================================================================

// Create all contexts
const SymbolLibraryContext = createContext();
const VideoPokerContext = createContext();
const PayTableContext = createContext();

// Combined provider that holds all game-related state
export const GameProvider = ({ children }) => {
  // =========================================================================
  // Video Poker State
  // =========================================================================
  const defaultVariant = videoPokerVariants[0];
  const storedVariantId = localStorage.getItem('videoPokerVariantId');
  const initialVariant = storedVariantId
    ? videoPokerVariants.find((v) => v.id === storedVariantId) || defaultVariant
    : defaultVariant;
  const [variant, setVariant] = useState(initialVariant);

  // Persist video poker variant to localStorage
  useEffect(() => {
    localStorage.setItem('videoPokerVariantId', variant.id);
  }, [variant]);

  // =========================================================================
  // Symbol Library State
  // =========================================================================
  const [symbols, setSymbols] = useState(defaultSymbols);
  
  // Load symbols from storage on mount
  useEffect(() => {
    if (window.api && window.api.getSymbolConfig) {
      window.api.getSymbolConfig().then(config => {
        if (config && config.length > 0) {
          setSymbols(config);
        }
      });
    }
  }, []);

  // =========================================================================
  // Pay Table State
  // =========================================================================
  const initialPayTable = variant ? variant.payTable : {};
  const [payTable, setPayTable] = useState(initialPayTable);

  // When the variant changes, update the pay table
  useEffect(() => {
    setPayTable(variant ? variant.payTable : {});
  }, [variant]);

  // Persist the paytable configuration to localStorage
  useEffect(() => {
    localStorage.setItem('videoPokerPayTable', JSON.stringify(payTable));
  }, [payTable]);

  // =========================================================================
  // Render nested providers
  // =========================================================================
  return (
    <SymbolLibraryContext.Provider value={{ symbols, setSymbols }}>
      <VideoPokerContext.Provider value={{ variant, setVariant }}>
        <PayTableContext.Provider value={{ payTable, setPayTable }}>
          {children}
        </PayTableContext.Provider>
      </VideoPokerContext.Provider>
    </SymbolLibraryContext.Provider>
  );
};

// =============================================================================
// Custom Hooks (keep the original API so existing components don't need changes)
// =============================================================================

// Symbol Library hooks
export const useSymbolLibrary = () => useContext(SymbolLibraryContext);

// Video Poker hooks
export const useVideoPoker = () => useContext(VideoPokerContext);

// Pay Table hooks
export const usePayTable = () => useContext(PayTableContext);

// Combined hook for components that need multiple contexts
export const useGameState = () => {
  return {
    ...useSymbolLibrary(),
    ...useVideoPoker(),
    ...usePayTable()
  };
};

// =============================================================================
// Legacy exports to maintain compatibility with existing code
// =============================================================================

export { SymbolLibraryContext, VideoPokerContext, PayTableContext };
export const VideoPokerProvider = ({ children }) => {
  const { variant, setVariant } = useVideoPoker();
  
  return (
    <VideoPokerContext.Provider value={{ variant, setVariant }}>
      {children}
    </VideoPokerContext.Provider>
  );
};

export const SymbolLibraryProvider = ({ children }) => {
  const { symbols, setSymbols } = useSymbolLibrary();
  
  return (
    <SymbolLibraryContext.Provider value={{ symbols, setSymbols }}>
      {children}
    </SymbolLibraryContext.Provider>
  );
};

export const PayTableProvider = ({ children, variant }) => {
  const { payTable, setPayTable } = usePayTable();
  
  return (
    <PayTableContext.Provider value={{ payTable, setPayTable }}>
      {children}
    </PayTableContext.Provider>
  );
};