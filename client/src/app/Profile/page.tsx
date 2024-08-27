"use client";
import React, { useState, useEffect } from "react";
import { addRating, fetchRating as fetchRatingfromApi } from "../api/ratingApi";
import { getByKindeID } from "../api/userApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const Profile = () => {
  const [rating, setRating] = useState<number>(0);
  const [userData, setUserData] = useState<any>(null);

  const { user } = useKindeBrowserClient();
  const userID = user?.id;

  const { isAuthenticated } = useKindeBrowserClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID) {
          const fetchedUserData = await getByKindeID(userID);
          setUserData(fetchedUserData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [userID]);

  useEffect(() => {
    const fetchRating = async () => {
      const currentRating = await fetchRatingfromApi();
      console.log(currentRating);
      if (currentRating) setRating(currentRating.rating);
    };
    fetchRating();
  }, []);

  const handleRatingChange = async (newRating: number) => {
    try {
      setRating(newRating);
      const response = await addRating(newRating);
      console.log("Rating updated:", response);
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  return isAuthenticated ? (
    <div className="w-full min-h-screen bg-indigo-200 py-36 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg py-8 w-96 flex justify-center items-center flex-col">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">
            {userData?.givenName} {userData?.familyName}
          </h2>
          <p className="text-gray-600 mb-4">@{userData?.username}</p>
          <p className="text-gray-700">Email: {userData?.email}</p>
        </div>
        <div className="mt-4 border-t w-full">
          <h3 className="text-lg font-semibold mt-8 text-center">
            Rate Our App!
          </h3>
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingChange(star)}
                className={`text-4xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Profile;
