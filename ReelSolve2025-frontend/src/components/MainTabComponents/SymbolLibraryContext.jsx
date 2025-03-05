import React, { createContext, useState, useContext, useEffect } from 'react';

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
    name: "Triple Bar",
    image: "",
    color: "#FFAD11",
    payouts: { 3: 20, 4: 60, 5: 200 },
    isWild: false,
    isScatter: false
  },
  {
    id: 4,
    name: "Bell",
    image: "",
    color: "#7C4DFF",
    payouts: { 3: 15, 4: 40, 5: 150 },
    isWild: false,
    isScatter: false
  },
  
  // Medium Paying Symbols
  {
    id: 5,
    name: "Watermelon",
    image: "",
    color: "#8BC34A",
    payouts: { 3: 10, 4: 25, 5: 75 },
    isWild: false,
    isScatter: false
  },
  {
    id: 6,
    name: "Grapes",
    image: "",
    color: "#9C27B0",
    payouts: { 3: 8, 4: 20, 5: 60 },
    isWild: false,
    isScatter: false
  },
  {
    id: 7,
    name: "Orange",
    image: "",
    color: "#FF9800",
    payouts: { 3: 5, 4: 15, 5: 50 },
    isWild: false,
    isScatter: false
  },
  
  // Low Paying Symbols
  {
    id: 8,
    name: "Cherry",
    image: "",
    color: "#F44336",
    payouts: { 3: 3, 4: 10, 5: 30 },
    isWild: false,
    isScatter: false
  },
  {
    id: 9,
    name: "Lemon",
    image: "",
    color: "#CDDC39",
    payouts: { 3: 2, 4: 8, 5: 25 },
    isWild: false,
    isScatter: false
  },
  
  // Special Symbols
  {
    id: 10,
    name: "Wild",
    image: "",
    color: "#00BCD4",
    payouts: { 3: 25, 4: 75, 5: 250 },
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

const SymbolLibraryContext = createContext();

export const SymbolLibraryProvider = ({ children }) => {
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
  
  return (
    <SymbolLibraryContext.Provider value={{ symbols, setSymbols }}>
      {children}
    </SymbolLibraryContext.Provider>
  );
};

export const useSymbolLibrary = () => useContext(SymbolLibraryContext);
