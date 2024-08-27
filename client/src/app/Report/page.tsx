"use client";

import React, { useState, useEffect } from "react";
import DoughnutChart from "@/components/DoughnutChart";
import IncomeChart from "@/components/IncomePieChart";
import SpendingLineGraph from "@/components/SpendingLineGraph";
import { fetchRecords } from "@/app/api/recordApi";

interface CategorySpending {
  title: string;
  totalAmount: number;
  percentage: number;
  icons: string | undefined;
}

// interface ReportProps {
//   userID: string | null;
// }

interface DailyExpense {
  date: string;
  totalAmount: number;
}

const ReportPage = () => {
  const [topSpending, setTopSpending] = useState<CategorySpending[]>([]);
  const [topIncome, setTopIncome] = useState<CategorySpending[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<DailyExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRecords = async () => {
    try {
      const fetchedRecords = await fetchRecords();
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    if (!records.length) return;

    const calculateTopSpending = () => {
      const categoryTotals: {
        [key: string]: { totalAmount: number; icons: string | undefined };
      } = {};
      let totalSpending = 0;

      records.forEach((record) => {
        if (record.category?.type === "expense") {
          const categoryTitle = record.category.title;
          const amount = record.amount;

          if (!categoryTotals[categoryTitle]) {
            categoryTotals[categoryTitle] = {
              totalAmount: 0,
              icons: record.category.icons,
            };
          }

          categoryTotals[categoryTitle].totalAmount += amount;
          totalSpending += amount;
        }
      });

      const spendingArray: CategorySpending[] = Object.keys(categoryTotals).map(
        (title) => ({
          title,
          totalAmount: categoryTotals[title].totalAmount,
          percentage: totalSpending
            ? (categoryTotals[title].totalAmount / totalSpending) * 100
            : 0,
          icons: categoryTotals[title].icons,
        })
      );

      spendingArray.sort((a, b) => b.totalAmount - a.totalAmount);
      setTopSpending(spendingArray);
    };

    calculateTopSpending();
  }, [records]);

  useEffect(() => {
    if (!records.length) return;

    const calculateTopIncomes = () => {
      const categoryTotals: {
        [key: string]: { totalAmount: number; icons: string | undefined };
      } = {};
      let totalIncome = 0;

      records.forEach((record) => {
        if (record.category?.type === "income") {
          const categoryTitle = record.category.title;
          const amount = record.amount;

          if (!categoryTotals[categoryTitle]) {
            categoryTotals[categoryTitle] = {
              totalAmount: 0,
              icons: record.category.icons,
            };
          }

          categoryTotals[categoryTitle].totalAmount += amount;
          totalIncome += amount;
        }
      });

      const incomeArray: CategorySpending[] = Object.keys(categoryTotals).map(
        (title) => ({
          title,
          totalAmount: categoryTotals[title].totalAmount,
          percentage: totalIncome
            ? (categoryTotals[title].totalAmount / totalIncome) * 100
            : 0,
          icons: categoryTotals[title].icons,
        })
      );

      incomeArray.sort((a, b) => b.totalAmount - a.totalAmount);
      setTopIncome(incomeArray);
    };

    calculateTopIncomes();
  }, [records]);

  useEffect(() => {
    if (!records.length) return;

    const calculateMonthlyExpenses = () => {
      const monthlyTotals: { [key: string]: number } = {};

      records.forEach((record) => {
        if (record.category?.type === "expense") {
          const date = new Date(record.date);
          const month =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1).toString().padStart(2, "0");
          const amount = record.amount;

          if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
          }

          monthlyTotals[month] += amount;
        }
      });

      const monthlyExpenseArray: DailyExpense[] = Object.keys(
        monthlyTotals
      ).map((month) => ({
        date: month,
        totalAmount: monthlyTotals[month],
      }));

      monthlyExpenseArray.sort(
        (a, b) =>
          new Date(a.date + "-01").getTime() -
          new Date(b.date + "-01").getTime()
      );
      setMonthlyExpenses(monthlyExpenseArray);
    };

    calculateMonthlyExpenses();
  }, [records]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-indigo-200 flex flex-col items-center py-36 space-y-8">
      <div className="w-1/3 border p-8 rounded-2xl bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-8 text-center">Income Chart</h1>
        <IncomeChart data={topIncome} />
      </div>
      <div className="w-1/3 border p-8 rounded-2xl bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-8 text-center">Expenses Chart</h1>
        <DoughnutChart data={topSpending} />
      </div>
      <div className="w-1/3 border p-8 rounded-2xl bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-8 text-center">Daily Expenses</h1>
        <SpendingLineGraph monthlyExpenses={monthlyExpenses} />
      </div>
    </div>
  );
};

export default ReportPage;
