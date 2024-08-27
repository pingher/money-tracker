"use server";

import axios from "axios";
const SERVER_URL = "http://localhost:3109/ratings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const fetchRating = async () => {
  const { getUser } = getKindeServerSession();
  const userData = await getUser();
  const id = userData?.id;
  const res = await axios.get(`${SERVER_URL}/${id}`);
  return res.data;
};

export const addRating = async (rating: any) => {
  const { getUser } = getKindeServerSession();
  const userData = await getUser();
  const id = userData?.id;
  const res = await axios.post(`${SERVER_URL}`, { userID: id, rating });
  return res.data;
};

export const allRatings = async () => {
  const res = await axios.get(`${SERVER_URL}`);
  return res.data;
};
