import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import DashboardApplet from "./DashboardApplet";
// import AddCustomer from "./AddCustomer";
import Trade from "./Trade";
import { ToastContainer } from "react-bootstrap";
import Charts from "../Components/Charts";
import { instance } from "../Api";

// ------------
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NavConfig } from "../Components/sideConfig";

const DashBoard = () => {
  // const date = new Date();
  // const months = date.getMonth();
  // console.log(months + 1);
  const [getLedger, setGetLedger] = useState([]);
  const chartsValues = async () => {
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate= &toDate= `
      );
      if (response.status === 200) {
        setGetLedger(response.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  useState(() => {
    chartsValues();
  }, []);
  const filterUserId = getLedger.map((userId) => userId.User_ID);
  const userIDset = new Set(filterUserId);
  const uniqueId = [...userIDset];
  console.log(uniqueId);

  const filterUserIdAvgValues = getLedger.map((data) => {
    if (data.User_ID) {
      return data.Avg_Price;
    }
  });
  console.log(filterUserIdAvgValues);
  const filterDistintValue = (data) => {
    const obj = {};
    for (const char of data) {
      if (obj[char.User_ID]) {
        obj[char.User_ID] += Number(char.Avg_Price);
      } else {
        obj[char.User_ID] = Number(char.Avg_Price);
      }
    }
    // return obj;
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return [keys, values];
  };
  const result = filterDistintValue(getLedger);
  console.log("result", result);
  // const userIDData = [];
  // for (let i = 0; i < filterUserId.length; i++) {
  //   for (let j = 0; j < filterUserId.length; j++) {
  //     if (filterUserId[i] == filterUserId[j]) {
  //       userIDData.push(filterUserId[i]);
  //     }
  //   }
  // }
  // console.log(filterUserIdAvgValues);

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate();
  const handleNav = (nav) => {
    navigate(nav);
  };
  // const drawer = (
  //   <div>
  //     <Toolbar />
  //     <Divider />
  //     <List>
  //       {NavConfig.map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton onClick={() => handleNav(text.path)}>
  //             <ListItemIcon color="white" sx={{ color: "white" }}>
  //               {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
  //               {text.icon}
  //             </ListItemIcon>
  //             <ListItemText primary={text.name} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

  return (
    <>
      {/* <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: "#25242D",
          }}
        >
          {" "}
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: "600" }}
            >
              Black Box
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            // container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
                color: "white",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {" "}
          <Toolbar />
         
          <Outlet />
        </Box>
      </Box> */}
      <div>
        <br />
        <DashboardApplet />
        {/* <AddCustomer /> */}

        <br />
        <Trade />
        <Charts data1={filterUserIdAvgValues} downData1={result} />
        <ToastContainer />
      </div>
    </>
  );
};

export default DashBoard;
