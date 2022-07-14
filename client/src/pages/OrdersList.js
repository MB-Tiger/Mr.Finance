import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import OrderModal from "../components/OrderModal";
import useToastContext from "../hooks/useToastContext";
import useTitle from "../hooks/useTitle";

export const MY_EXPENSES = gql`
  query Query {
    getMyExpenses {
      _id
      amount
      tags {
        _id
        name
        color
      }
      geo {
        lat
        lon
      }
      date
      address {
        MunicipalityZone
        Neighbourhood
        FormattedAddress
        Place
      }
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation Mutation($id: ID!) {
    delete_expense(_id: $id) {
      status
    }
  }
`;

const OrdersList = () => {
  useTitle("Orders");
  const { loading, error, data, refetch } = useQuery(MY_EXPENSES);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [isModal, setIsModal] = useState(false);
  const [orderModalValue, setOrderModalValue] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const { pushAlert } = useToastContext();

  console.log(data);

  const openModal = (id) => {
    const unique = data?.getMyExpenses.findIndex(
      (expense) => expense._id === id
    );
    setOrderModalValue(data?.getMyExpenses[unique]);
    setIsModal(true);
  };

  const removeExpense = async (_id) => {
    try {
      const {
        data: {
          delete_expense: { status },
        },
      } = await deleteExpense({
        variables: {
          id: _id,
        },
      });
      if (status === 200) {
        refetch();
        setIsModal(false);
        return pushAlert({
          msg: "Expense were successfully recorded",
          type: "success",
          icon: "success",
        });
      } else {
        return pushAlert({
          msg: "Not valid, please check your form",
          type: "error",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      return pushAlert({
        msg: "Not valid, please check your form",
        type: "error",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-spin w-16 h-16 m-16 rounded-full border-[10px] border-transparent border-b-[10px] border-b-red-800 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="w-full min-h-screen">
        <div className="text-xl font-semibold">Error!</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <OrderModal
        isModal={isModal}
        setIsModal={setIsModal}
        removeExpense={removeExpense}
        orderModalValue={orderModalValue}
      />
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-3xl text-2xl font-bold">Orders list</h2>
          <Link to={"/dashboard/createexpense"}>
            <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white sm:px-5 px-4 sm:py-2 py-1 rounded md:font-medium">
              Add order
            </button>
          </Link>
        </div>
        <div className="w-full bg-white relative rounded-lg shadow-sm p-4 mb-6">
          <input
            type="search"
            value={searchInput}
            placeholder="Search category"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-12 border rounded-lg focus:outline-blue-600 py-2 pl-9 pr-2"
          />
          <BiSearchAlt2 className="absolute top-1/2 -translate-y-1/2 ml-3 text-lg" />
        </div>
        {data?.getMyExpenses.length ? (
          <div className="w-full shadow-sm overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 font-medium">Order</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {data?.getMyExpenses
                  .filter((myExpense) =>
                    myExpense.tags[0].name
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                  )
                  .map((expense, i) => (
                    <tr
                      key={expense._id}
                      onClick={() => openModal(expense._id)}
                      className="hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <td className="py-4 md:text-base text-sm">#{i + 1}</td>
                      <td className="py-4 md:text-base text-sm">
                        {expense.amount} $
                      </td>
                      <td className="py-4 md:text-base text-sm">
                        {expense.date.substring(0, 10)}
                      </td>
                      <td className="py-3 px-1 md:text-base text-sm">
                        <div
                          className={`max-w-[100px] text-white py-1 rounded-full mx-auto`}
                          style={{ backgroundColor: expense.tags[0].color }}
                        >
                          {expense.tags[0].name}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full">
            <img
              className="w-[600px] mx-auto"
              src={require("../img/empty-concept.png")}
              alt="empty concept"
            />
            <div className="mt-4 text-lg text-center">
              There are currently no orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
