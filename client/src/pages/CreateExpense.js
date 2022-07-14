import React, { useState, useRef, useMemo, useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import useToastContext from "../hooks/useToastContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MY_EXPENSES } from "./OrdersList";
import useTitle from "../hooks/useTitle";

const CREATE_EXPENSE = gql`
  mutation Mutation($data: ExpenseInfo!) {
    create_expense(data: $data) {
      status
    }
  }
`;

const MY_TAGS = gql`
  query Query {
    getMyTags {
      _id
      name
      color
    }
  }
`;

const center = [51.505, -0.09];

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const CreateExpense = () => {
  useTitle("Create expense");
  const [createExpense] = useMutation(CREATE_EXPENSE, {
    refetchQueries: [MY_EXPENSES],
  });
  const { loading, error, data, refetch } = useQuery(MY_TAGS);
  const [expenseDetail, setExpenseDetail] = useState({});
  const { pushAlert } = useToastContext();
  const date = new Date(expenseDetail.date);
  const markerRef = useRef();

  // console.log(expenseDetail);
  // console.log(data);
  // console.log(markerRef.current.getCenter());

  const register = async () => {
    try {
      const {
        data: {
          create_expense: { status },
        },
      } = await createExpense({
        variables: {
          data: {
            amount: Number(expenseDetail.amount),
            geo: {
              lat: markerRef.current.getCenter().lat,
              lon: markerRef.current.getCenter().lng,
            },
            date: date.toISOString(),
            tags: expenseDetail.tagId,
            address: {
              MunicipalityZone: expenseDetail.municipalityZone
                ? Number(expenseDetail.municipalityZone)
                : Number(0),
              Neighbourhood: expenseDetail.neighbourhood
                ? expenseDetail.neighbourhood
                : "-",
              FormattedAddress: expenseDetail.formattedAddress
                ? expenseDetail.formattedAddress
                : "-",
              Place: expenseDetail.place ? expenseDetail.place : "-",
            },
          },
        },
      });
      if (status === 200) {
        refetch();
        setExpenseDetail({});
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
      <div className="container">
        <div className="w-full border shadow-sm rounded-lg p-4">
          <h2 className="text-xl font-medium text-blue-900 mb-4">
            Expense detail
          </h2>
          <div className="mb-2">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Price</h3>
            <div className="grid grid-cols-2">
              <label className="block relative mb-4 md:mr-4 md:col-span-1 col-span-2">
                <input
                  className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
                  type="number"
                  required
                  value={expenseDetail.amount}
                  onChange={(e) =>
                    setExpenseDetail({
                      ...expenseDetail,
                      amount: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                  Amount
                </div>
              </label>
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Address</h3>
            <div className="grid grid-cols-2">
              <label className="block relative mb-4 md:mr-4 md:col-span-1 col-span-2">
                <input
                  className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
                  type="number"
                  required
                  value={expenseDetail.municipalityZone}
                  onChange={(e) =>
                    setExpenseDetail({
                      ...expenseDetail,
                      municipalityZone: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                  Municipality zone
                </div>
              </label>
              <label className="block relative mb-4 md:col-span-1 col-span-2">
                <input
                  className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
                  type="text"
                  required
                  value={expenseDetail.neighbourhood}
                  onChange={(e) =>
                    setExpenseDetail({
                      ...expenseDetail,
                      neighbourhood: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                  Neighbourhood
                </div>
              </label>
              <label className="block relative mb-4 md:mr-4 md:col-span-1 col-span-2">
                <input
                  className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
                  type="text"
                  required
                  value={expenseDetail.formattedAddress}
                  onChange={(e) =>
                    setExpenseDetail({
                      ...expenseDetail,
                      formattedAddress: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                  Address
                </div>
              </label>
              <label className="block relative mb-4 md:col-span-1 col-span-2">
                <input
                  className="bg-gray-50 w-full h-9 p-2 border rounded border-gray-400"
                  type="text"
                  required
                  value={expenseDetail.place}
                  onChange={(e) =>
                    setExpenseDetail({
                      ...expenseDetail,
                      place: e.target.value,
                    })
                  }
                />
                <div className="absolute top-[6px] left-2 transition-all duration-200 text-gray-500">
                  Place
                </div>
              </label>
            </div>
          </div>
          <label className="block relative mb-6 mr-2">
            <div className="text-lg font-medium text-blue-800 mb-2">date</div>
            <input
              className="bg-gray-50 xl:w-1/3 md:w-[48.5%] w-full h-9 p-2 border rounded border-gray-400"
              type="date"
              value={expenseDetail.date}
              onChange={(e) =>
                setExpenseDetail({ ...expenseDetail, date: e.target.value })
              }
            />
          </label>
          <div className="flex items-center space-x-2 mb-6">
            <div className="text-lg font-medium text-blue-800">Select tag</div>
            <select
              className="bg-gray-50 border rounded border-gray-400 block p-1"
              name="selectTag"
              onClick={(e) =>
                setExpenseDetail({ ...expenseDetail, tagId: e.target.value })
              }
            >
              <option value="">Choose tag</option>
              {data?.getMyTags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <h3 className="text-lg font-medium text-blue-800 mb-2">Location</h3>
          <div className="w-full relative">
            <MapContainer
              ref={markerRef}
              center={center}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
            <FaMapMarkerAlt className="absolute text-2xl text-blue-900 top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[35]" />
          </div>
          <div className="text-center">
            <button
              className="lg:text-xl bg-blue-500 transition-all hover:bg-blue-600 text-white px-5 py-2 mt-8 rounded"
              onClick={() => register()}
            >
              Add expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExpense;
