// app/page.tsx or app/home.tsx (depending on your file structure)
"use client"; // Ensure this file is treated as a Client Component

import { useEffect, useState } from "react";
import { allRatings } from "./api/ratingApi";

interface RatingData {
  rating: string;
}

export default function Home() {
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const ratingData: RatingData[] = await allRatings();

        if (ratingData) {
          const ratings = ratingData.map((item) => parseInt(item.rating));
          const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
          console.log(totalRating);
          const average = totalRating / ratings.length;

          // Update state with average rating
          setAverageRating(average);
        } else {
          // Handle the case where there are no ratings
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        setAverageRating(null);
      }
    };

    fetchAverageRating();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[url('/error-bg.png')] object-cover flex items-center flex-col justify-center">
      <h1 className="text-2xl font-semibold mb-5">
        Simple way to track your money!
      </h1>
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold">Our Ratings :D</h1>
        {averageRating !== null ? (
          <p className="text-4xl text-indigo-500 font-bold">
            {averageRating.toFixed(1)} / 5
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
