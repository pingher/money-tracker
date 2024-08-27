import React from "react";
import { RecordType } from "@/app/Record/page";
import { useState, useEffect } from "react";
import { deleteRecord, editRecord } from "@/app/api/recordApi";
import DoughnutChart from "./DoughnutChart";
import Swal from "sweetalert2";

type RecordItemProps = {
  records: RecordType[];
};

interface CategorySpending {
  title: string;
  totalAmount: number;
  percentage: number;
  icons: string | undefined;
}

const RecordItem: React.FC<RecordItemProps> = ({ records }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedRecord, setEditedRecord] = useState<RecordType | null>(null);

  // Sort records from latest date to oldest
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date to include day, date, month, and year
  const formatDate = (
    dateString: string
  ): { day: string; date: string; month: string; year: string } => {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const datePart = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.toLocaleDateString("en-US", { year: "numeric" });

    return {
      day,
      date: datePart,
      month,
      year,
    };
  };

  //when record clicked, show detail
  const handleClick = (record: RecordType) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  // when edit button clicked
  const handleEditClick = () => {
    if (selectedRecord) {
      setEditedRecord({ ...selectedRecord });
      setShowEditModal(true);
    }
  };

  // Calculate top spending categories
  const [topSpending, setTopSpending] = useState<CategorySpending[]>([]);
  useEffect(() => {
    const calculateTopSpending = () => {
      const categoryTotals: {
        [key: string]: { totalAmount: number; icons: string | undefined };
      } = {};
      let totalSpending = 0;

      // Sum all based on categories
      records.forEach((record) => {
        if (record.category?.type === "expense") {
          const categoryTitle = record.category.title;
          const amount = record.amount;

          // Find if category exists
          if (!categoryTotals[categoryTitle]) {
            categoryTotals[categoryTitle] = {
              totalAmount: 0,
              icons: record.category.icons,
            };
          }

          // Accumulate the totalAmount for the category
          categoryTotals[categoryTitle].totalAmount += amount;
          totalSpending += amount;
        }
      });

      // Calculate percentages & sort
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

      // Sort categories by total spending in descending order
      spendingArray.sort((a, b) => b.totalAmount - a.totalAmount);
      setTopSpending(spendingArray);
    };

    calculateTopSpending();
  }, [records]);

  const onDeleteHandler = async (recordID: string) => {
    try {
      await deleteRecord(recordID);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Record has been deleted.",
        confirmButtonText: "OK",
      });

      // fetchRecords();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        confirmButtonText: "OK",
      });
    }
  };

  // Edit submit
  const onSubmitHandler = async () => {
    if (selectedRecord && editedRecord) {
      try {
        await editRecord(editedRecord._id, editedRecord);
        setShowEditModal(false);
        setShowDetails(false);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Record has been updated.",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div>
      <h1 className="m-8 text-lg font-semibold">Recent Transactions:</h1>
      {sortedRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedRecords.map((record, index) => {
            const { day, date, month, year } = formatDate(record.date);

            const categoryType = record.category?.type || "";
            let amountText = "";
            let amountStyle = {};

            if (categoryType === "income") {
              amountText = `+ ${record.amount}`;
              amountStyle = { color: "green" };
            } else if (categoryType === "expense") {
              amountText = `- ${record.amount} `;
              amountStyle = { color: "red" };
            } else {
              amountText = `${record.amount}`;
            }

            return (
              // ALL RECORDS
              <div
                key={index}
                className="flex items-center justify-between bg-white border rounded-lg p-4 px-6 cursor-pointer"
                onClick={() => handleClick(record)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <img
                      src={`http://localhost:3109/${record.category?.icons}`}
                      width={40}
                      height={40}
                      alt="Record Icon"
                    />
                    <div className="text-sm">{record.category?.title}</div>
                  </div>

                  <div className="text-5xl me-2">{date}</div>
                  <div>
                    <div>{day}</div>
                    <div className="text-sm">
                      {month} {year}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold" style={amountStyle}>
                    {amountText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No transactions available.</p>
      )}
      {/* DETAIL MODAL */}
      {showDetails && selectedRecord && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-1/2 my-6 mx-auto max-w-sm">
              <div className="border-2 border-gray-300 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-6 border-b-2 border-gray-300 rounded-t">
                  <h3 className="text-2xl font-semibold">Details</h3>
                  <button
                    className="bg-transparent border-0 text-black opacity-80 text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowDetails(false)}
                  >
                    <span className="text-black opacity-80 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto text-lg">
                  {selectedRecord.details}
                </div>
                <div className="flex justify-end border-t-2 border-gray-300 rounded-b">
                  <button
                    className="bg-indigo-400 text-white h-full p-2 w-1/2 rounded-bl-lg"
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white h-full p-2 w-1/2 rounded-br-lg"
                    onClick={() => onDeleteHandler(selectedRecord?._id || "")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
      {showEditModal && editedRecord && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t gap-24">
                  <h3 className="text-2xl font-semibold">Edit Record</h3>
                  <button
                    className="ml-auto bg-transparent border-0 text-black opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowEditModal(false)}
                  >
                    <span className="text-black opacity-80 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto text-lg">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={editedRecord.amount}
                      onChange={(e) =>
                        setEditedRecord({
                          ...editedRecord,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Details
                    </label>
                    <input
                      type="text"
                      value={editedRecord.details}
                      onChange={(e) =>
                        setEditedRecord({
                          ...editedRecord,
                          details: e.target.value,
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editedRecord.date.split("T")[0]}
                      onChange={(e) =>
                        setEditedRecord({
                          ...editedRecord,
                          date: e.target.value,
                        })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="flex justify-end border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="bg-indigo-500 text-white h-full py-3 w-full"
                    onClick={onSubmitHandler}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}

      {/* TOP SPENDINGS */}
      <h2 className="m-8 mt-24 text-lg font-semibold">Top Spendings:</h2>
      <div className="flex flex-wrap gap-24 justify-center items-center">
        <div className="w-1/4">
          {topSpending.length > 0 ? (
            <div>
              {topSpending.map((category, index) => (
                <div
                  key={index}
                  className="mb-2 bg-white p-4 px-6 flex items-center gap-3 rounded-lg"
                >
                  <img
                    src={`http://localhost:3109/${category.icons}`}
                    width={40}
                    height={40}
                    alt="Record Icon"
                  />
                  {category.title}: ${category.totalAmount.toFixed(2)}{" "}
                  <strong>({category.percentage.toFixed(2)}%)</strong>
                </div>
              ))}
            </div>
          ) : (
            <p>No top spendings available.</p>
          )}
        </div>

        <div className="w-1/3">
          <div className="programming-stats">
            <DoughnutChart data={topSpending} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordItem;
