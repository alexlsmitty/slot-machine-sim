import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial symbol library data (this can be loaded from IPC or a database)
const initialSymbols = [
  { id: 1, name: 'Wild', image: 'wild.png', color: '#FFD700', payouts: { 3: 5, 4: 25, 5: 100 }, isWild: true, isScatter: false },
  { id: 2, name: 'Scatter', image: 'scatter.png', color: '#FF5722', payouts: { 3: 5, 4: 10, 5: 50 }, isWild: false, isScatter: true },
  { id: 3, name: 'Diamond', image: 'diamond.png', color: '#00BCD4', payouts: { 3: 3, 4: 8, 5: 25 }, isWild: false, isScatter: false },
];

const SymbolLibraryContext = createContext();

export const SymbolLibraryProvider = ({ children }) => {
  const [symbols, setSymbols] = useState(initialSymbols);

  // Optionally, load from IPC if available:
  useEffect(() => {
    if (window.api && window.api.getSymbolConfig) {
      window.api.getSymbolConfig().then(savedSymbols => {
        if (savedSymbols && savedSymbols.length > 0) {
          setSymbols(savedSymbols);
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
