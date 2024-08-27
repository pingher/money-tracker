"use server";
import axios from "axios";
const SERVER_URL = "http://localhost:3109/categories";

type CategoryType = {
  _id: string;
  title: string;
  type: string;
  icons: string;
};

export const fetchCategories = async (): Promise<CategoryType[]> => {
  const res = await axios.get(`${SERVER_URL}`);
  return res.data;
};

export const addCategory = async (category: any) => {
  const res = await axios.post(`${SERVER_URL}`, category);
  return res.data;
};
