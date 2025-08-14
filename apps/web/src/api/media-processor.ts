import axios from 'axios';

export const mediaProcessorApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/media-processor`,
  withCredentials: true,
});

export const getMediaProcessorHealth = async () => {
  return await mediaProcessorApi.get('/health');
};
