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
import Loading from "./Components/Loading";

const UserWiseCharts = () => {
  const [getLedger, setGetLedger] = useState([]);
  const [PortFoliotype, setPortFolioType] = useState("");
  const [loading, setLoading] = useState(false);
  const chartsValues = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate= &toDate= `
      );
      if (response.status === 200) {
        setGetLedger(response.data);
        setLoading(false);
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

  // --------

  const calculateBSMTM = (data) => {
    const obj = {};
    for (const char of data) {
      if (char.User_ID === PortFoliotype) {
        if (!obj[char.User_ID]) {
          obj[char.User_ID] = 0;
        }
        if (char.Txn === "BUY") {
          obj[char.User_ID] += Number(char.Avg_Price) * -Number(char.Qty);
        } else {
          obj[char.User_ID] += Number(char.Avg_Price) * Number(char.Qty);
        }
      }
    }
    const key = Object.keys(obj);
    const value = Object.values(obj);
    return [key, value];
  };
  const result = calculateBSMTM(getLedger);
  console.log(result[1]);
  // --------
  const [value, setValue] = useState([]);

  const handleUserIdChange = (e) => {
    const data = e.target.value;
    // selectedUserIdAva_Price(getLedger);
    setPortFolioType(e.target.value);
    setDateRange("");
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

  console.log(userIdWiseFilter);
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
    setLoading(true);
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
    setLoading(true);
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
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    toast.success("Downloaded Successfully !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // doc.text(10, 10, "Report");
    const imgData = logo;
    setLoading(true);
    doc.addImage(imgData, "PNG", 13, 20, 150, 30);
    doc.autoTable({
      startY: 60,
      head: [exportTableHeading[0]],
      body: exportTableHeading.slice(1),
    });
    doc.save("data.pdf");
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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

  return (
    <>
      {loading && <Loading />}
      <div>
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
                </Grid>
                {exportType.length > 0 && (
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <br />
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ padding: "10px" }}
                      onClick={typeOfDownloads}
                    >
                      Export
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
        <br />

        {PortFoliotype && dateRange && (
          <Charts
            data1={result}
            downData1={uniquieUserId}
            userWise
            data2={userIdWiseFilter}
          />
        )}
      </div>
    </>
  );
};

export default UserWiseCharts;
