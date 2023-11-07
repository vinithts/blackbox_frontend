import React, { useEffect, useState } from "react";
import Charts from "./Components/Charts";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DropDown from "./Components/DropDown";
import { instance } from "./Api";
import NavBar from "./Components/NavBar";
import DatePickerComponent from "./Components/DatePickerComponent";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ImageEncoded } from "./Components/ImageEncoded";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { NavConfig } from "./Components/sideConfig";
import logo from "./Assets/first_logo.png";

const UserWiseCharts = () => {
  const [getLedger, setGetLedger] = useState([]);
  const [PortFoliotype, setPortFolioType] = useState("");
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
  const filterUserId = getLedger.map((userId) => userId.User_ID);
  const userIDset = new Set(filterUserId);
  const uniqueId = [...userIDset];

  // selected userId chart
  const chartFilterUserId = getLedger
    .map((selectedId) => selectedId.User_ID)
    .filter((e) => e === PortFoliotype);
  const selectedUserId = new Set(chartFilterUserId);
  const uniquieUserId = [...selectedUserId];
  console.log(uniquieUserId);
  useEffect(() => {
    chartsValues();
  }, []);
  const filterUserIdAvgValues = getLedger.slice(0, 50).map((data) => {
    if (data.User_ID) {
      return data.Avg_Price;
    }
  });
  const [value, setValue] = useState([]);
  const handleUserIdChange = (e) => {
    const data = e.target.value;
    setPortFolioType(e.target.value);
    console.log(typeof data);
    const result = getLedger
      .filter((e) => e.User_ID === data)
      .map((data) => data.Avg_Price)
      .reduce((a, c) => Number(a) + Number(c), 0);
    setValue(result);
    setExportData({
      ...exportData,
      exportUserId: data,
      exportAvg: Math.round(result.toString()),
    });
  };
  const userIdWiseFilter = getLedger
    .filter((e) => e.User_ID === PortFoliotype)
    .map((data) => data.Avg_Price);

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate();
  const handleNav = (nav) => {
    navigate(nav);
  };
  const date_Range = [
    "This Month",
    "Last Month",
    "This Year",
    "All Time",
    "Custom",
  ];
  const export_Type = ["CSV", "EXCEL", "PDF"];

  const [dateRange, setDateRange] = useState("");
  const [exportType, setExportType] = useState("");
  const [fromDate, setFromDate] = useState(null);

  const [toDate, setToDate] = useState(null);
  const [exportData, setExportData] = useState({
    exportUserId: "",
    exportDateRange: "",
    exportFromDate: "-",
    exportToDate: "-",
    exportAvg: "",
  });
  const exportTableHeading = [
    ["UserId", "DateRange", "FromDate", "ToDate", "AvgPrice"],
    [
      exportData.exportUserId,
      exportData.exportDateRange,
      exportData.exportFromDate,
      exportData.exportToDate,
      exportData.exportAvg,
    ],
  ];
  const handleDownloadCSV = () => {
    const csvData = exportTableHeading.map((row) => row).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
    toast.success("Downloaded Successfully !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  };
  // ----------------------------------------------------

  const handleDownloadXLSX = async () => {
    const workbook = new ExcelJS.Workbook(); //create excel object instance  (1st step)

    const worksheet = workbook.addWorksheet("Sheet 1");
    const imgBase64 = ImageEncoded;
    const imageId = workbook.addImage({
      base64: imgBase64,
      extension: "png",
    });

    worksheet.addImage(imageId, "A2:E8");

    exportTableHeading.forEach((row) => {
      worksheet.addRow(row);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    console.log(url);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();
    toast.success("Downloaded Successfully !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  };

  // ----------------
  // const handleDownloadXLSX = () => {
  //   const ws = XLSX.utils.aoa_to_sheet(exportTableHeading);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  //   XLSX.writeFile(wb, "data.xlsx");
  // };
  // ----------------
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // doc.text(10, 10, "Report");
    const imgData = logo;

    doc.addImage(imgData, "PNG", 13, 20, 150, 30);
    doc.autoTable({
      startY: 60,
      head: [exportTableHeading[0]],
      body: exportTableHeading.slice(1),
    });
    doc.save("data.pdf");
    toast.success("Downloaded Successfully !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  };

  const typeOfDownloads = () => {
    switch (exportType) {
      case "CSV":
        handleDownloadCSV();
        break;
      case "EXCEL":
        handleDownloadXLSX();
        break;
      case "PDF":
        handleDownloadPDF();
        break;
    }
  };
  const [count, setCount] = useState(0);
  const handleAddCount = () => {
    setCount(count + 1);
  };
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {NavConfig.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleNav(text.path)}>
              <ListItemIcon color="white" sx={{ color: "white" }}>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {text.icon}
              </ListItemIcon>
              <ListItemText primary={text.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
  // const [mobileNumber, setMobileNumber] = useState("");
  // const handleMobileNumber = (event) => {
  //   const data = event.target.value.replace(/[^0-9]/g, "").slice(0, 10);
  //   setMobileNumber(data);
  // };

  return (
    <div>
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
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
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
        
        </Box>
      </Box> */}
      <Box sx={{ padding: "10px" }}>
        <Typography
          variant="h4"
          sx={{ color: "white", textAlign: "center", fontWeight: "600" }}
        >
          UserWise
        </Typography>

        <Grid container spacing={2} p={2}>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <DropDown
              arr={uniqueId}
              label={"User Wise"}
              value={PortFoliotype}
              onChange={handleUserIdChange}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <DropDown
              arr={date_Range}
              label={"Date Range"}
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setExportData({
                  ...exportData,
                  exportDateRange: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <br />
            <Button
              variant="contained"
              sx={{ background: "white", color: "black", padding: "10px" }}
              fullWidth
              onClick={handleAddCount}
            >
              More
            </Button>
          </Grid>
          {count >= 1 && (
            <>
              {" "}
              <Grid xl={4} lg={4} md={4} sm={12} xs={12} p={1.2}>
                <DatePickerComponent
                  label={"From Date"}
                  name={"From Date"}
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setExportData({
                      ...exportData,
                      exportFromDate: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid xl={4} lg={4} md={4} sm={12} xs={12} p={1.2}>
                <DatePickerComponent
                  label={"To Date"}
                  name={"To Date"}
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setExportData({
                      ...exportData,
                      exportToDate: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <DropDown
                  arr={export_Type}
                  label={"Export Type"}
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                />
              </Grid>{" "}
            </>
          )}

          {exportType.length > 0 && (
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <br />
              {/* <CSVLink data={exportTableHeading} filename={"data.csv"}> */}
              <Button
                variant="contained"
                fullWidth
                sx={{ padding: "10px" }}
                onClick={typeOfDownloads}
              >
                Export
              </Button>
              {/* </CSVLink> */}
            </Grid>
          )}
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Charts
              data1={filterUserIdAvgValues}
              downData1={uniquieUserId}
              userWise
              data2={userIdWiseFilter}
            />
          </Grid>
        </Grid>
      </Box>
      <br />

      {/* <Charts
        data1={filterUserIdAvgValues}
        downData1={uniqueId}
        userWise
        data2={userIdWiseFilter}
      /> */}
      {/* <div
        style={{
          position: "absolute",
          left: "20%",
          color: "white",
          display: "none",
        }}
      >
        <h2 style={{ textAlign: "center" }}>{exportData.exportUserId}</h2>
        <table>
          <thead>
            <tr>
              {exportTableHeading[0].map((item, index) => (
                <th
                  key={index}
                  style={{ padding: "15px", textAlign: "center" }}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exportTableHeading.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((item, index) => (
                <td
                  key={index}
                  style={{ padding: "15px", textAlign: "center" }}
                >
                  {item}
                </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default UserWiseCharts;
