"use server";

import axios from "axios";
const SERVER_URL = `${process.env.SERVER}/records`;
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RecordType } from "../Record/page";

export const fetchRecords = async () => {
  const { getUser } = getKindeServerSession();
  const userData = await getUser();
  const id = userData?.id;
  console.log(id);
  const res = await axios.get(`${SERVER_URL}/userID/${id}`);
  return res.data;
};

export const addRecords = async (record: any) => {
  const res = await axios.post(`${SERVER_URL}`, record);
  return res.data;
};

export const deleteRecord = async (id: string) => {
  const res = await axios.delete(`${SERVER_URL}/${id}`);
  return res.data;
};

export const editRecord = async (id: string, edittedRecord: RecordType) => {
  const res = await axios.put(`${SERVER_URL}/${id}`, edittedRecord);
  return res.data;
};
