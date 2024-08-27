"use server";
import axios from "axios";
const SERVER_URL = "http://localhost:3109/budgets";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getBudgetsByUserId = async () => {
  const { getUser } = getKindeServerSession();
  const userData = await getUser();
  const id = userData?.id;
  console.log(id);
  const res = await axios.get(`${SERVER_URL}/userID/${id}`);
  return res.data;
};

export const addBudget = async (budget: any) => {
  const res = await axios.post(`${SERVER_URL}`, budget);
  return res.data;
};
