import React, { createContext, useState, useEffect } from 'react';

export const PayTableContext = createContext();

export const PayTableProvider = ({ children, variant }) => {
  // Use the current variant’s pay table as the initial state.
  const initialPayTable = variant ? variant.payTable : {};
  const [payTable, setPayTable] = useState(initialPayTable);

  // When the variant changes, update the pay table.
  useEffect(() => {
    setPayTable(variant ? variant.payTable : {});
  }, [variant]);

  // Persist the paytable configuration to localStorage.
  useEffect(() => {
    localStorage.setItem('videoPokerPayTable', JSON.stringify(payTable));
  }, [payTable]);

  return (
    <PayTableContext.Provider value={{ payTable, setPayTable }}>
      {children}
    </PayTableContext.Provider>
  );
};