"use client";
import RecordItem from "@/components/RecordItem";
import CategoryItem from "@/components/CategoryItem";
import {
  fetchRecords as fetchRecordsfromApi,
  addRecords as addRecordsfromApi,
} from "../api/recordApi";
import {
  fetchCategories as fetchCategoriesfromApi,
  addCategory as addCategoryfromApi,
} from "../api/categoryApi";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Swal from "sweetalert2";

export type RecordType = {
  _id: string;
  amount: number;
  category?: Category;
  details?: string;
  date: string;
  userID?: string;
};

export type Category = {
  _id: string;
  title: string;
  icons: string;
  type: string;
};

type AddedCategory = {
  title?: string;
  type?: string;
  icons?: File;
};

const RecordPage = () => {
  // modal
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  const [getRecords, setgetRecords] = useState<RecordType[]>([]);
  const [record, setRecord] = useState<RecordType>({
    _id: "",
    amount: 0,
    date: "",
  });

  const [getCategories, setgetCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<any>([]);
  const [addedCategory, setAddedCategory] = useState<AddedCategory>({
    title: "",
    type: "expense",
    icons: undefined,
  });

  // find user id
  const { user, getUser } = useKindeBrowserClient();
  const userID = user?.id;

  //   fetch all records
  const fetchRecords = async () => {
    try {
      const fetchedRecords = await fetchRecordsfromApi();
      setgetRecords(fetchedRecords);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  //   fetch all categories
  const fetchCategories = async () => {
    try {
      const fetchedCategories = await fetchCategoriesfromApi();
      setgetCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch records:", error);
    }
  };

  const handleCategorySelect = (categoryID: string) => {
    const selected = getCategories.find(
      (category: { _id: string }) => category._id === categoryID
    );
    setSelectedCategory(selected || null);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setRecord({
      ...record,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!record.amount || !record.date || !selectedCategory) {
      Swal.fire({
        title: "Please Fill Up Required Fields",
        text: "Amount, Category & Date.",
        icon: "error",
      });
      return;
    }
    try {
      addRecordsfromApi({
        ...record,
        category: selectedCategory._id,
        userID,
      });
      setRecord({ _id: "", amount: 0, date: "" });
      setSelectedCategory(null);
      setShowModal(false);
      Swal.fire({
        title: "New Record Added!",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to add record:", error);
    }
    fetchRecords();
  };

  // add category on change
  const onChangeHandler2 = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddedCategory({
      ...addedCategory,
      [e.target.name]:
        e.target.type === "file"
          ? (e.target as HTMLInputElement).files?.[0]
          : e.target.value,
    });
  };

  // add category on submit
  const onSubmitHandler2 = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (addedCategory.title) formData.append("title", addedCategory.title);
    if (addedCategory.type) formData.append("type", addedCategory.type);
    if (addedCategory.icons) formData.append("icons", addedCategory.icons);

    try {
      await addCategoryfromApi(formData);
      setShowModal3(false);
      Swal.fire({
        title: "Category Added!",
        icon: "success",
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to add category:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add category.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchCategories();
  }, []);

  return (
    <div className="w-full min-h-screen bg-indigo-200">
      <div className="py-24 px-10 relative min-h-screen">
        <RecordItem records={getRecords} />
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 rounded-full w-24 h-24 m-8 drop-shadow-lg hover:drop-shadow-sm text-3xl text-white border hover:translate-y-0.5 duration-150 fixed right-0 bottom-0 "
        >
          <p className="m-0 text-5xl">+</p>
        </button>
        {showModal && (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-sm">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-2xl font-semibold">Add New Record</h3>
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
                      className="shadow-md px-8 p-2 flex flex-col gap-5 "
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

                      {/* notes */}
                      <div className="flex gap-8">
                        <i
                          className="fa fa-bars"
                          style={{ fontSize: "32px" }}
                        ></i>
                        <input
                          type="text"
                          name="details"
                          className="outline-none"
                          onChange={onChangeHandler}
                          placeholder="Write Note..."
                        />
                      </div>

                      {/* date */}
                      <div className="flex gap-8">
                        <i
                          className="fa fa-calendar"
                          style={{ fontSize: "32px" }}
                        ></i>
                        <input
                          type="date"
                          name="date"
                          onChange={onChangeHandler}
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
                          Add
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

        {showModal2 && (
          <div>
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-sm">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b gap-24 border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-2xl font-semibold">Categories</h3>
                      <button
                        className="ml-auto bg-transparent border-0 text-black opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModal2(false)}
                      >
                        <span className="bg-transparent text-black opacity-80 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          X
                        </span>
                      </button>
                    </div>
                    <div className="relative p-6 flex-auto">
                      <CategoryItem
                        categories={getCategories}
                        handleCategorySelect={handleCategorySelect}
                      />
                      <button
                        className="text-center w-full bg-indigo-400 py-2 rounded-md mt-3 text-white hover:bg-indigo-500"
                        onClick={() => setShowModal3(true)}
                      >
                        Add Category +
                      </button>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="bg-indigo-500 text-white active:bg-indigo-400 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal2(false)}
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          </div>
        )}

        {showModal3 && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl">
                <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Add New Category
                  </h3>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowModal3(false)}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <form className="space-y-6" onSubmit={onSubmitHandler2}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={onChangeHandler2}
                        className="w-full p-2 mt-1 border rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        name="type"
                        onChange={onChangeHandler2}
                        className="w-full p-2 mt-1 border rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Icon (Image)
                      </label>
                      <input
                        type="file"
                        name="icons"
                        onChange={onChangeHandler2}
                        className="w-full p-2 mt-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-indigo-500 rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                    >
                      Add +
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
