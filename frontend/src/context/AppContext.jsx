import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [datasetId, setDatasetId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState([]);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <AppContext.Provider value={{
      datasetId, setDatasetId,
      summary, setSummary,
      charts, setCharts,
      report, setReport,
      isLoading, setIsLoading,
      isAuthenticated, setIsAuthenticated,
      user, setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);