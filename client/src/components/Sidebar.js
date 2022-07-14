import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { MdExitToApp, MdDashboard } from "react-icons/md";
import { AiFillTags } from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";
import useToastContext from "../hooks/useToastContext";

const Sidebar = (props) => {
  const { loading, error, data, setIsSidebar, refetch } = props;
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { domain } = useToastContext();
  // console.log(data);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-spin w-16 h-16 m-16 rounded-full border-[10px] border-transparent border-b-[10px] border-b-red-800 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    // console.log("#########################");
    // console.log(error);
    // console.log("#########################");
    cookies.remove("ut");
    navigate("/");
    return (
      <div className="w-full min-h-screen">
        <div className="text-xl font-semibold">Error!</div>
      </div>
    );
  }

  return (
    <nav className="lg:w-full sm:w-1/3 w-3/4 min-h-screen lg:sticky fixed top-0 px-2 py-8 bg-[#111827] overflow-y-auto sidebar">
      <div className="flex items-center space-x-1 justify-center mb-8">
        <img
          className="w-[35px]"
          src={require("../img/MR.Logo2.png")}
          alt="Logo"
        />
        <div className="text-2xl font-semibold text-gray-100">Financetor</div>
      </div>
      <div className="text-center">
        <Link to={"useredit"}>
          <img
            className="w-[90px] h-[90px] rounded-full mx-auto mb-2"
            src={
              data.me.img
                ? `${domain}/${data.me.img}`
                : require("../img/man.png")
            }
            alt="User profile"
          />
        </Link>
        <p className="text-lg font-medium text-gray-100">
          <Link to={"useredit"}>{data?.me.username}</Link>
        </p>
        <p className="text-sm text-gray-200">
          <Link to={"useredit"}>{data?.me.name}</Link>
        </p>
      </div>
      <ul className="text-gray-50 font-medium mx-6 mt-8 space-y-2">
        <li className="block mb-3 px-2 text-lg font-medium text-gray-400">
          Menu
        </li>
        <li className="p-2 rounded hover:bg-gray-700 transition-all">
          <Link
            to={"home"}
            onClick={() => setIsSidebar(false)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <MdDashboard className="text-xl" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className="p-2 rounded hover:bg-gray-700 transition-all">
          <Link
            to={"orders"}
            onClick={() => setIsSidebar(false)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <FiShoppingBag className="text-xl" />
            <span>Orders</span>
          </Link>
        </li>
        <li className="p-2 rounded hover:bg-gray-700 transition-all">
          <Link
            to={"Tags"}
            onClick={() => setIsSidebar(false)}
            className="flex items-end space-x-2 cursor-pointer"
          >
            <AiFillTags className="text-xl" />
            <span>Tags</span>
          </Link>
        </li>
        <li className="p-2 rounded hover:bg-gray-700 transition-all">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              cookies.remove("ut");
              refetch();
              navigate("/");
              // window.location.href = "/"
              setIsSidebar(false);
            }}
          >
            <MdExitToApp className="text-xl" />
            <span>Exit</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
