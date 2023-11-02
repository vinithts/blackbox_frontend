import "react-toastify/dist/ReactToastify.css";
import DashBoard from "./Pages/DashBoard";
import { BrowserRouter, useRoutes, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import { useState } from "react";
import { instance } from "./Api";
import UserWiseCharts from "./UserWiseCharts";

function App() {
  // const Routes = useRoutes([
  //   { path: "/login", element: <Login /> },
  //   {
  //     path: "/Dashboard",
  //     element: <DashBoard />,
  //     children: [
  //       {
  //         path: "/userWiseChart", element:<UserWiseCharts
  //       },
  //     ],
  //   },
  // ]);
  return (
    <BrowserRouter>
      <div
        className="App"
        style={{ background: "#171721", minHeight: "100vh" }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/userWiseChart" element={<UserWiseCharts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
