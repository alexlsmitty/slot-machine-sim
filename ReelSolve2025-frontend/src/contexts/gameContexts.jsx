import React, { createContext, useState, useContext, useEffect, use } from 'react';
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

// Default reel configuration
const defaultReelConfig = {
  selectionMethod: 'percentage',
  reels: [
    // Reel 1
    { 
      id: 1, 
      height: 3, 
      visibleHeight: 3, 
      symbols: [
        { id: 1, percentage: 5 },   // Diamond (rare)
        { id: 2, percentage: 8 },   // Seven
        { id: 3, percentage: 10 },  // Triple Bar
        { id: 4, percentage: 12 },  // Bell
        { id: 5, percentage: 14 },  // Watermelon
        { id: 6, percentage: 15 },  // Grapes
        { id: 7, percentage: 16 },  // Orange
        { id: 8, percentage: 18 },  // Cherry
        { id: 9, percentage: 18 },  // Lemon
        { id: 10, percentage: 2 },  // Wild (very rare)
        { id: 11, percentage: 2 }   // Scatter (very rare)
      ]
    },
    // Reel 2
    { 
      id: 2, 
      height: 3, 
      visibleHeight: 3,
      symbols: [
        { id: 1, percentage: 4 },   // Diamond (rarer on middle reels)
        { id: 2, percentage: 6 },   // Seven
        { id: 3, percentage: 10 },  // Triple Bar
        { id: 4, percentage: 13 },  // Bell
        { id: 5, percentage: 15 },  // Watermelon
        { id: 6, percentage: 16 },  // Grapes
        { id: 7, percentage: 17 },  // Orange
        { id: 8, percentage: 19 },  // Cherry
        { id: 9, percentage: 19 },  // Lemon
        { id: 10, percentage: 1 },  // Wild (very rare)
        { id: 11, percentage: 2 }   // Scatter
      ]
    },
    // Reel 3
    { 
      id: 3, 
      height: 3, 
      visibleHeight: 3,
      symbols: [
        { id: 1, percentage: 4 },   // Diamond
        { id: 2, percentage: 5 },   // Seven
        { id: 3, percentage: 8 },   // Triple Bar
        { id: 4, percentage: 10 },  // Bell
        { id: 5, percentage: 15 },  // Watermelon
        { id: 6, percentage: 16 },  // Grapes
        { id: 7, percentage: 17 },  // Orange
        { id: 8, percentage: 19 },  // Cherry
        { id: 9, percentage: 20 },  // Lemon
        { id: 10, percentage: 1 },  // Wild
        { id: 11, percentage: 3 }   // Scatter (more common on middle reel)
      ]
    },
    // Reel 4
    { 
      id: 4, 
      height: 3, 
      visibleHeight: 3,
      symbols: [
        { id: 1, percentage: 3 },   // Diamond
        { id: 2, percentage: 5 },   // Seven
        { id: 3, percentage: 8 },   // Triple Bar
        { id: 4, percentage: 10 },  // Bell
        { id: 5, percentage: 15 },  // Watermelon
        { id: 6, percentage: 16 },  // Grapes
        { id: 7, percentage: 18 },  // Orange
        { id: 8, percentage: 19 },  // Cherry
        { id: 9, percentage: 20 },  // Lemon
        { id: 10, percentage: 1 },  // Wild
        { id: 11, percentage: 2 }   // Scatter
      ] 
    },
    // Reel 5
    { 
      id: 5, 
      height: 3, 
      visibleHeight: 3,
      symbols: [
        { id: 1, percentage: 2 },   // Diamond (even rarer on last reel)
        { id: 2, percentage: 3 },   // Seven
        { id: 3, percentage: 6 },   // Triple Bar
        { id: 4, percentage: 8 },   // Bell
        { id: 5, percentage: 14 },  // Watermelon
        { id: 6, percentage: 15 },  // Grapes
        { id: 7, percentage: 17 },  // Orange
        { id: 8, percentage: 21 },  // Cherry
        { id: 9, percentage: 22 },  // Lemon
        { id: 10, percentage: 1 },  // Wild
        { id: 11, percentage: 2 }   // Scatter
      ]
    }
  ]
};

// =============================================================================
// Context Creation
// =============================================================================

// Create all contexts
const ReelMatrixContext = createContext();
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
// Reel Matrix State
// =========================================================================
const [reelConfig, setReelConfig] = useState(defaultReelConfig);

// Load reel configuration from storage on mount
useEffect(() => {
  if (window.api && window.api.getReelConfig) {
    window.api.getReelConfig().then(config => {
      if (config) {
        setReelConfig(config);
      }
    }).catch(err => {
      console.error("Error loading reel configuration:", err);
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
    <ReelMatrixContext.Provider value={{ reelConfig, setReelConfig }}>
      <SymbolLibraryContext.Provider value={{ symbols, setSymbols }}>
        <VideoPokerContext.Provider value={{ variant, setVariant }}>
          <PayTableContext.Provider value={{ payTable, setPayTable }}>
            {children}
          </PayTableContext.Provider>
        </VideoPokerContext.Provider>
      </SymbolLibraryContext.Provider>
    </ReelMatrixContext.Provider>
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

// Reel Matrix hooks
export const useReelMatrix = () => useContext(ReelMatrixContext);

// Combined hook for components that need multiple contexts
export const useGameState = () => {
  return {
    ...useSymbolLibrary(),
    ...useVideoPoker(),
    ...usePayTable(),
    ...useReelMatrix(),
  };
};

// =============================================================================
// Legacy exports to maintain compatibility with existing code
// =============================================================================

export { SymbolLibraryContext, VideoPokerContext, PayTableContext, ReelMatrixContext };
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

export const ReelMatrixProvider = ({ children }) => {
  const { reelConfig, setReelConfig } = useReelMatrix();
  
  return (
    <ReelMatrixContext.Provider value={{ reelConfig, setReelConfig }}>
      {children}
    </ReelMatrixContext.Provider>
  );
};