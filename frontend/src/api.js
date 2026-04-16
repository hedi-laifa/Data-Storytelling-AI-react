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