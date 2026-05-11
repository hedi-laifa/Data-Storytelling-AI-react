import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";



export const api = axios.create({


  baseURL: API_BASE_URL,
});

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/datasets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getDatasetSummary = async (datasetId) => {
  const response = await api.get(`/datasets/${datasetId}/summary`);
  return response.data;
};

export const getCharts = async (datasetId) => {
  const response = await api.get(`/analysis/${datasetId}/charts`);
  return response.data;
};

export const getReport = async (datasetId) => {
  const response = await api.get(`/analysis/${datasetId}/storytelling-report`);
  return response.data;
};
export const getHistory = async (userId) => {
  const response = await api.get("/history", {
    headers: { "X-User-Id": userId },
  });
  return response.data;
};

export const downloadHistoryReport = async (historyId) => {
  const response = await api.get(`/history/${historyId}/download-report`, {
    responseType: "blob",
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'report.md';
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (fileNameMatch && fileNameMatch.length === 2)
      fileName = fileNameMatch[1];
  }
  
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadDataset = async (datasetId, userId) => {
  const response = await api.get(`/datasets/${datasetId}/download`, {
    headers: { "X-User-Id": userId },
    responseType: "blob",
  });
  
  // Create a blob link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Extract filename from header if possible, else default
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'dataset.csv';
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (fileNameMatch && fileNameMatch.length === 2)
      fileName = fileNameMatch[1];
  }
  
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};



// Interceptor to add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
