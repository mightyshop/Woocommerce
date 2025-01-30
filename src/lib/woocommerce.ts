import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_WOOCOMMERCE_API_URL,
  params: {
    consumer_key: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY,
    consumer_secret: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET
  }
});

export interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  images: { src: string }[];
  description: string;
  categories: { id: number; name: string }[];
  agents: { id: number; name: string; image: { src: string } }[];
}

export interface Category {
  id: number;
  name: string;
  count: number;
}

export interface Agent {
  id: number;
  name: string;
  image: {
    src: string;
  };
  count: number;
}

export const getProducts = async (search?: string, categoryId?: number, agentId?: number) => {
  try {
    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (categoryId) params.category = categoryId;
    if (agentId) params.agent = agentId;

    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', axios.isAxiosError(error) ? error.message : 'Unknown error');
    return [];
  }
};

export const getProduct = async (id: number) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', axios.isAxiosError(error) ? error.message : 'Unknown error');
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', axios.isAxiosError(error) ? error.message : 'Unknown error');
    return [];
  }
};

export const getAgents = async () => {
  try {
    const response = await api.get('/products/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', axios.isAxiosError(error) ? error.message : 'Unknown error');
    return [];
  }
};