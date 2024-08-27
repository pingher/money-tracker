"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Swal from "sweetalert2";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { addBudget, getBudgetsByUserId } from "@/app/api/budgetApi";
import { fetchRecords } from "@/app/api/recordApi";
import { fetchCategories } from "@/app/api/categoryApi";
import CategoryItem from "@/components/CategoryItem";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "next/navigation";

// Define the types
type BudgetType = {
  amount: number;
  category: {
    _id: string;
    title: string;
    type: string;
    icons: string;
  };
  timeline: string;
  _id?: string;
};

type RecordType = {
  _id: string;
  user: string;
  category: {
    _id: string;
    title: string;
    type: string;
    icons: string;
  };
  amount: number;
  details: string;
  date: string;
};

type CategoryType = {
  _id: string;
  title: string;
  type: string;
  icons: string;
};

const Budget = () => {
  const { user, getUser } = useKindeBrowserClient();
  const userID = user?.id;

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [budget, setBudget] = useState<BudgetType>({
    amount: 0,
    category: { _id: "", title: "", type: "", icons: "" },
    timeline: "",
  });
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [records, setRecords] = useState<RecordType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  // Fetch budgets and records
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        // Fetch budgets data
        const budgetsData = await getBudgetsByUserId();
        setBudgets(budgetsData);

        // Fetch records data
        const recordsData = await fetchRecords();
        setRecords(recordsData);
      } catch (error) {
        console.error("Failed to fetch budgets or records:", error);
      }
    };

    fetchBudgets();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      }
    };

    fetchCategoriesData();
  }, []);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBudget((prevBudget) => ({
      ...prevBudget,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!budget.amount || !budget.category._id || !budget.timeline) {
      Swal.fire({
        title: "Please Fill Up Required Fields",
        text: "Amount, Category & Timeline.",
        icon: "error",
      });
      return;
    }

    if (userID) {
      try {
        await addBudget({
          amount: budget.amount,
          category: budget.category._id,
          timeline: budget.timeline,
          userID: userID,
        });
        setBudget({
          amount: 0,
          category: { _id: "", title: "", type: "", icons: "" },
          timeline: "",
        });
        setSelectedCategory(null);
        setShowModal(false);
        Swal.fire({
          title: "New Budget Added!",
          icon: "success",
        });
      } catch (error) {
        console.error("Failed to add budget:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add budget.",
          icon: "error",
        });
      }
    }
  };

  const handleCategorySelect = (categoryID: string) => {
    const selected = categories.find((category) => category._id === categoryID);
    setSelectedCategory(selected || null);
    setBudget((prevBudget) => ({
      ...prevBudget,
      category: selected || { _id: "", title: "", type: "", icons: "" },
    }));
    setShowModal2(false);
  };

  const calculateTotalExpenses = (categoryId: string) => {
    const filteredRecords = records.filter(
      (record) => record.category._id === categoryId
    );

    return filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  };

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;
    setCurrentMonth(formattedMonth);
  }, []);

  const formatDate = (date: string) => {
    const [year, month] = date.split("-");
    return `${year}-${month}`;
  };
  return (
    <>
      <div className="bg-indigo-200 w-full min-h-screen flex flex-col items-center py-36">
        <h1 className="text-xl mb-5">This Month</h1>
        <div className="w-1/4">
          <div className="">
            <button
              className="bg-indigo-500 text-white p-2 px-8 rounded-lg w-full mb-8"
              onClick={() => setShowModal(true)}
            >
              Create Budget
            </button>
          </div>
          <div className="">
            {budgets
              .filter((budget) => formatDate(budget.timeline) === currentMonth)
              .map((budget) => {
                return (
                  <div
                    key={budget._id}
                    className="mb-4 p-4 border border-gray-300 rounded w-full bg-white"
                  >
                    <h2 className="text-lg font-semibold">
                      {budget.category.title || "Unknown Category"}
                    </h2>
                    <ProgressBar
                      categoryId={budget.category._id}
                      budgetAmount={budget.amount}
                      totalExpenses={calculateTotalExpenses(
                        budget.category._id
                      )}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Modal for add Budget */}
        {showModal && (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold">
                      Create New Budget
                    </h3>
                    <button
                      className="ml-auto bg-transparent border-0 text-black opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="text-black opacity-80 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        X
                      </span>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <form
                      className="shadow-md px-8 p-2 flex flex-col gap-5"
                      onSubmit={onSubmitHandler}
                    >
                      {/* amount */}
                      <div className="flex gap-8">
                        <i
                          className="fa fa-money"
                          style={{ fontSize: "32px" }}
                        ></i>
                        <input
                          type="number"
                          name="amount"
                          min={0}
                          onChange={onChangeHandler}
                          className="border-b-2 border-indigo-600 outline-none"
                          placeholder="0"
                        />
                      </div>

                      {/* category */}
                      <div className="flex gap-8">
                        <i
                          className="fa fa-question-circle"
                          style={{ fontSize: "34px" }}
                        ></i>
                        <button
                          className="border p-1 w-full rounded-sm px-4 bg-indigo-400 text-white"
                          onClick={() => setShowModal2(true)}
                          style={{
                            backgroundColor: selectedCategory
                              ? "lightgreen"
                              : "lightgrey",
                          }}
                          type="button"
                        >
                          {selectedCategory
                            ? selectedCategory.title
                            : "Select Category"}
                        </button>
                      </div>

                      {/* timeline */}
                      <div className="flex gap-8">
                        <i
                          className="fa fa-calendar"
                          style={{ fontSize: "32px" }}
                        ></i>
                        <input
                          type="month"
                          name="timeline"
                          onChange={onChangeHandler}
                          className="outline-none"
                          placeholder="Select Month"
                        />
                      </div>

                      {/* button */}
                      <div className="flex items-center justify-end ps-6 py-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="submit"
                        >
                          Add Budget
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}

        {/* Modal 2 for select category */}
        {showModal2 && (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t gap-24">
                    <h3 className="text-2xl font-semibold">Select Category</h3>
                    <button
                      className="ml-auto bg-transparent border-0 text-black opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal2(false)}
                    >
                      <span className="text-black opacity-80 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        X
                      </span>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <CategoryItem
                      categories={categories.filter(
                        (category) => category.type === "expense"
                      )}
                      handleCategorySelect={handleCategorySelect}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
      </div>
    </>
  );
};

export default Budget;
