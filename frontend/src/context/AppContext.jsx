import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [datasetId, setDatasetId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState([]);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider value={{
      datasetId, setDatasetId,
      summary, setSummary,
      charts, setCharts,
      report, setReport,
      isLoading, setIsLoading,
      isAuthenticated, setIsAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);