import {
  Box,
  Card,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import * as XLSX from "xlsx";
import InputComponent from "./InputComponent";
import { instance } from "../Api";
import DatePickerComponent from "./DatePickerComponent";
import { format } from "date-fns";
import DropDown from "./DropDown";
import { AccessAlarmTwoTone } from "@mui/icons-material";
import { toast } from "react-toastify";
import Loading from "./Loading";

export async function getCustomersDetails() {
  try {
    const result = await instance.get(`/api/getCustomersDetails`);

    return result;
  } catch (e) {
    console.log("err", e);
    toast.error("Something Went to wrong  !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  }
}
const AccordionComponent = ({ title, trade, viewCus }) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [sim, setSim] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [PortFoliotype, setPortFolioType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [UserIDtype, setUserIDType] = useState("");
  const [loading, setLoading] = useState(false);
  // console.log(type);

  function parseCustomDate(dateStr) {
    const dateComponents = dateStr.match(
      /(\d+)-([A-Za-z]+)-(\d+) (\d+)\.(\d+)\.(\d+)/
    );

    if (!dateComponents) {
      return null;
    }

    const monthAbbreviations = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const year = parseInt(dateComponents[3], 10);
    const month = monthAbbreviations[dateComponents[2]];
    const day = parseInt(dateComponents[1], 10);
    const hours = parseInt(dateComponents[4], 10);
    const minutes = parseInt(dateComponents[5], 10);
    const seconds = parseInt(dateComponents[6], 10);

    return new Date(year, month, day, hours, minutes, seconds);
  }

  const [totalValues, setTotalValues] = useState(0);

  const handleToDate = (e) => {
    setToDate(e.target.value);
  };

  const [Portfolio, setPortfolio] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [userId, setUserId] = useState([]);

  let user = [];
  let Portfolio_Name = [];
  const dropDownData = (val) => {
    const result = val
      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((e) => {
        if (e.User_ID || e.Portfolio_Name) {
          user.push(e.User_ID);
          Portfolio_Name.push(e.Portfolio_Name);
        }
      });
    const removeDuplicatePortfolio = new Set(Portfolio_Name);
    const updatePortfolio = [...removeDuplicatePortfolio];
    const removeDuplicateUserId = new Set(user);
    const updateUserId = [...removeDuplicateUserId];
    console.log(updatePortfolio);
    setPortfolio(updatePortfolio);
    setUserId(updateUserId);
    return result;
  };
  // console.log(Portfolio);
  const getUploadFilesLedger = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/api/getUploadFilesLedger?fromDate=${
          fromDate ? fromDate : ""
        }&toDate=${toDate ? toDate : ""}`
      );
      if (response.status === 200) {
        setData(response.data);
        dropDownData(response.data);
        setLoading(false);
        // dropDownData(response.data);
        // let BUY = 0;
        // let SELL = 0;
        // response.data.map((e) => {
        //   if (e.Txn === "BUY") {
        //     BUY += e.Avg_Price;
        //     console.log("true");
        //   } else if (e.Txn === "SELL") {
        //     SELL += e.Avg_Price;
        //   }
        //   setTotalValues(SELL - BUY);
        // });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  // console.log(totalValues);

  const columnNames = [
    "Portfolio Name",
    "Leg ID",
    "Exchange",
    "Exchange Symbol",
    "Product",
    "Order Type",
    "Order ID",
    "Time",
    "Txn",
    "Qty",
    "Filled Qty",
    "Exchg Time",
    "Avg Price",
    "Status",
    "Limit Price",
    "Order Failed",
    "User ID",
    "User Alias",
    "Remarks",
    "Tag",
  ];
  // console.log(columnNames.length);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryString = event.target.result;
      const workBook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      function ensureMandatoryKeys(obj) {
        for (const columnName of columnNames) {
          if (!obj.hasOwnProperty(columnName)) {
            obj[columnName] = "-";
          }
        }
      }

      for (const obj of jsonData) {
        ensureMandatoryKeys(obj);
      }
      // console.log(jsonData);

      try {
        const response = await instance.post(`/api/uploadFilesLedger`, {
          data: jsonData,
        });
        if (response.status === 200) {
          getUploadFilesLedger();
          toast.success("Uploaded Successfully !", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "foo-bar",
          });
        }

        // console.log(response);
      } catch (e) {
        console.log(e);
        toast.error("Something went to wrong !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };
  useEffect(() => {
    if (data[0]) {
      setKeys(Object.keys(data[0]));
    }
  }, [data]);
  // console.log(data);
  // const [filterValue, setFilterValue] = useState("");

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const filterDatasValue = (data) => {
    const fieldsToSearch = ["Portfolio_Name", "User_ID"];
    return fieldsToSearch.some((field) =>
      String(data[field])
        .toLowerCase()
        .includes(UserIDtype.toLowerCase() || PortFoliotype.toLowerCase())
    );
  };

  const filteredData = data?.filter((filData) => filterDatasValue(filData));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [cusKey, setCusKey] = useState([]);
  const [cusDetails, setCusDetails] = useState([]);

  useEffect(() => {
    setLoading(true);
    getCustomersDetails()
      .then((res) => {
        if (res && res.status === 200) {
          setCusDetails(res.data);
          setCusKey(Object.keys(res.data[0]));
          setLoading(false);
          // console.log("datas", res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  // const [sell, setSell] = useState(0);

  // const [buy, setBuy] = useState(0);
  let profit = 0;
  let loss = 0;
  const sellValue = useMemo(() => {
    return filteredData
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .reduce((acc, value) => {
        if (value["Txn"] === "SELL") {
          acc += Number(value["Avg_Price"]);
        } else {
          acc -= Number(value["Avg_Price"]);
        }
        // if (acc > 0) {
        //   profit += acc;
        // } else {
        //   loss -= acc;
        // }
        return acc;
      }, 0);
  }, [filteredData, page, rowsPerPage]);

  // console.log("profit :", profit, "loss :", loss);
  // const d = () => {
  //   const arr = filteredData.slice(
  //     page * rowsPerPage,
  //     page * rowsPerPage + rowsPerPage
  //   );

  //   let a = 0,
  //     b = 0;
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i]["Txn"] === "SELL") {
  //       a += +arr[i]["Avg_Price"];
  //     } else {
  //       b += +arr[i]["Avg_Price"];
  //     }
  //   }
  //   console.log(a, b);
  //   console.log(b - a);
  // };
  useEffect(() => {
    // if (fromDate && toDate) {
    getUploadFilesLedger();
    // }
    dropDownData(filteredData);
  }, [fromDate, toDate, page || rowsPerPage]);
  // useEffect(() => {

  // }, [page, rowsPerPage]);

  // console.log(userId);
  const arr = ["Portfolio_Name", "Order_ID", "User_ID"];

  return (
    <>
      {loading && <Loading />}

      <div style={{ padding: "15px" }}>
        {!trade ? (
          <Box sx={{ background: "#25242D" }}>
            <Card
              sx={{ width: "100%", background: "#25242D", padding: "15px" }}
            >
              <Typography
                sx={{ padding: "15px", color: "white", fontWeight: "600" }}
              >
                {" "}
                {title}
              </Typography>
              <Paper
                sx={{
                  overflow: "hidden",
                  border: "1px solid #D9D9D9",
                  // padding: "15px"
                }}
              >
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {cusKey.map((keys, index) => (
                          <TableCell
                            key={keys.id}
                            align={"center"}
                            style={{
                              minWidth: 170,

                              background: "#25242D",
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            {keys.charAt(0).toUpperCase() + keys.slice(1)}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cusDetails?.map((pair, i) => (
                        <TableRow key={i}>
                          {cusKey?.map((key, index) => (
                            <TableCell
                              sx={{ background: "#25242D", color: "gray" }}
                              key={index}
                              align="center"
                              style={{ minWidth: 170 }}
                            >
                              {pair[key]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={12}
                  rowsPerPage={10}
                  page={10}
                  sx={{ background: "#25242D", color: "white" }}
                  // onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Card>
          </Box>
        ) : (
          <>
            <Card
              sx={{ padding: "15px", width: "100%", background: "#25242D" }}
            >
              <Grid container spacing={2} p={2}>
                {/* <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <Form.Group controlId="formFile">
                  <Form.Label style={{ color: "gray", fontWeight: "600" }}>
                    Upload csv,xlsx
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Grid> */}
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DatePickerComponent
                    label={"From Date"}
                    name={"From Date"}
                    value={fromDate}
                    onChange={handleFromDate}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DatePickerComponent
                    label={"To Date"}
                    name={"To Date"}
                    value={toDate}
                    onChange={handleToDate}
                  />
                  {/* <DropDown
                  arr={arr}
                  label={"Type"}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                /> */}
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  {/* <InputComponent
                  label={"Search"}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  type
                /> */}
                  <DropDown
                    arr={Portfolio}
                    label={"Portfolio_Name"}
                    value={PortFoliotype}
                    onChange={(e) => {
                      setPortFolioType(e.target.value);
                      getUploadFilesLedger();
                    }}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DropDown
                    arrays={userId}
                    other
                    label={"User_ID"}
                    values={UserIDtype}
                    onChanges={(e) => setUserIDType(e.target.value)}
                  />
                </Grid>

                {/* <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <InputComponent
                  label={"Search"}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  type
                />
              </Grid> */}
              </Grid>
              {/* {UserIDtype && PortFoliotype && ( */}
              <Box sx={{ padding: "15px" }}>
                {data.length > 0 ? (
                  <Paper
                    sx={{ overflow: "hidden", border: "1px solid #D9D9D9" }}
                  >
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {keys.map((item, index) => (
                              <TableCell
                                key={index}
                                sx={{
                                  background: " rgb(23, 23, 33)",
                                  color: "white",
                                  fontWeight: "600",
                                  textAlign: "center",
                                  // border: "1px solid white",
                                }}
                              >
                                {item}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {filteredData

                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((value, Rowindex) => {
                            return (
                              <TableRow key={Rowindex}>
                                {keys.map((allData, Colindex) => (
                                  <TableCell
                                    align="center"
                                    key={Colindex}
                                    sx={{
                                      background: "#25242D",
                                      color: "gray",
                                      textAlign: "center",
                                      // border: "1px solid white",
                                    }}
                                  >
                                    {allData === "Remarks"
                                      ? value.Remarks.slice(0, 15)
                                      : value[allData]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                      </Table>
                    </TableContainer>

                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{ background: "#25242D", color: "white" }}
                    />
                    <div
                      style={{
                        padding: "10px",
                        background: "#25242D",
                        color: "white",
                      }}
                    >
                      <Typography
                        sx={{ paddingRight: "10rem", color: "#90EE90" }}
                      >
                        {`Total Profit :  ${Math.round(sellValue)}`}
                        &nbsp;
                      </Typography>
                      {/* <Typography
                          sx={{ color: "red" }}
                        >{`Total Loss : -${Math.round(loss)}`}</Typography> */}
                    </div>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                    }}
                  >
                    <Typography>
                      <AiOutlineExclamationCircle color="red" size={20} />
                    </Typography>
                    <Typography sx={{ padding: "5px", color: "white" }}>
                      There is no data found !
                    </Typography>
                  </Box>
                )}
              </Box>
              {/* )} */}
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AccordionComponent;
