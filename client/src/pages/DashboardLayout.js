import React, { useState } from "react";
import useTitle from "../hooks/useTitle";
import { gql, useQuery } from "@apollo/client";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useToastContext from "../hooks/useToastContext";
import { Link } from "react-router-dom";

const MY_DASHBOARD = gql`
  query Me {
    me {
      _id
      name
      username
      img
    }
  }
`;

const DashboardLayout = () => {
  useTitle("Dashboard");
  const { loading, error, data, refetch } = useQuery(MY_DASHBOARD);
  const [isSidebar, setIsSidebar] = useState(false);
  const { domain } = useToastContext();
  // console.log(data);

  return (
    <div className="w-full min-h-screen">
      <div className="grid grid-cols-5">
        <div
          className={`col-span-1 lg:block z-50 ${
            isSidebar ? "block" : "hidden"
          }`}
        >
          <Sidebar
            loading={loading}
            error={error}
            data={data}
            refetch={refetch}
            setIsSidebar={setIsSidebar}
          />
        </div>
        <div className="lg:col-span-4 col-span-5 bg-gray-50">
          <div
            className={`w-full top-0 min-h-screen bg-black bg-opacity-40 cursor-not-allowed z-[49] ${
              isSidebar ? "fixed" : "hidden"
            }`}
            onClick={() => setIsSidebar(false)}
          ></div>
          <div className="flex justify-between items-center cursor-pointer lg:hidden sticky top-0 bg-gray-50 shadow z-40 p-2 sm:px-4">
            <div
              className="flex items-center space-x-2"
              onClick={() => setIsSidebar(true)}
            >
              <img
                className="w-9 h-9 rounded-full"
                src={
                  data?.me.img
                    ? `${domain}/${data.me.img}`
                    : require("../img/man.png")
                }
                alt="User profile"
              />
              <div>{data?.me.username}</div>
            </div>
            <Link to={"/dashboard/home"}>
              <img
                className="w-8"
                src={require("../img/MR.Logo2.png")}
                alt="Logo"
              />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
