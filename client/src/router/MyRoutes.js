import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../pages/MainLayout";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import DashboardLayout from "../pages/DashboardLayout";
import CreateExpense from "../pages/CreateExpense";
import TagsList from "../pages/TagsList";
import Error404 from "../pages/Error404";
import OrdersList from "../pages/OrdersList";
import DashboardHome from "../pages/DashboardHome";
import UserEdit from "../pages/UserEdit";

const MyRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard/createexpense" element={<CreateExpense />} />
          <Route path="/dashboard/Tags" element={<TagsList />} />
          <Route path="/dashboard/orders" element={<OrdersList />} />
          <Route path="/dashboard/home" element={<DashboardHome />} />
          <Route path="/dashboard/useredit" element={<UserEdit />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
};

export default MyRoutes;
