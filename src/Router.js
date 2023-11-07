// import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
// import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
// export const NavConfig = [
//   {
//     name: "Dashboard",
//     path: "/Dashboard",
//     icon: <SpaceDashboardIcon color="white" />,
//   },
//   {
//     name: "UserWise",
//     path: "/userWiseChart",
//     icon: <SupervisedUserCircleIcon color="white" />,
//   },
// ];

import React from "react";
import { useRoutes } from "react-router-dom";
import Login from "./Pages/Login";
import DashBoard from "./Pages/DashBoard";
import DashboardPage from "./Components/DashboardPage";
import UserWiseCharts from "./UserWiseCharts";

const Router = () => {
  return useRoutes([
    { path: "/", element: <Login /> },
    {
      path: "/Dashboard",
      element: <DashboardPage />,
      children: [
        { path: "/Dashboard", element: <DashBoard /> },
        { path: "userWiseChart", element: <UserWiseCharts /> },
      ],
    },
  ]);
};

export default Router;