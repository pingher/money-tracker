import axios from "axios";
const SERVER_URL = "${process.env.SERVER}/users";

/*
const res = await axios.post(`${SERVER_URL}/register`, body, {
    headers: { Authorization: `Bearer ${token}` },
  }); 
*/

export const register = async (user: any) => {
  const res = await axios.post(`${SERVER_URL}/register`, user);
  return res.data;
};

export const getByKindeID = async (kindeID: any) => {
  const res = await axios.get(`${SERVER_URL}/kindeID/${kindeID}`);
  return res.data;
};
