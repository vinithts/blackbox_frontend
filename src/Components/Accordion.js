import {
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { instance } from "../Api";
import DatePickerComponent from "./DatePickerComponent";
import DropDown from "./DropDown";
import { toast } from "react-toastify";
import Loading from "./Loading";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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
const AccordionComponent = ({ title, trade }) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [UserIDtype, setUserIDType] = useState("");
  const [tagType, setTagType] = useState("");
  const [PortFoliotype, setPortFolioType] = useState("");

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
  const handleToDate = (e) => {
    setToDate(e.target.value);
  };
  const handleChange = (e) => {
    getPortifolioTag(e.target.value);
    setTagType(e.target.value);
    setUserIDType("");
  };

  const [Portfolio, setPortfolio] = useState([]);
  const [userId, setUserId] = useState([]);
  const [tags, setTags] = useState([]);

  let user = [];
  let Portfolio_Name = [];
  const dropDownData = (val) => {
    const result = val.map((e) => {
      if (e.User_ID || e.Portfolio_Name) {
        user.push(e.User_ID);
        Portfolio_Name.push(e.Portfolio_Name);
        if (e.Tag) {
          tags.push(e.Tag);
        }
      }
    });
    // const removeDuplicatePortfolio = new Set(Portfolio_Name);
    // const updatePortfolio = [...removeDuplicatePortfolio];
    const removeDuplicateUserId = new Set(user);
    const updateUserId = [...removeDuplicateUserId];
    const removeDuplicateTags = new Set(tags);
    const updateTags = [...removeDuplicateTags];
    // setPortfolio(["All", ...updatePortfolio]);
    setUserId(["All", ...updateUserId]);
    setTags(["All", ...updateTags]);
    return result;
  };
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
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

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

  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const filterDatasValue = (data) => {
    const fieldsToSearch = ["Portfolio_Name", "User_ID"];
    if (UserIDtype === "All" || tagType === "All") {
      if (PortFoliotype.length > 0) {
        return fieldsToSearch?.some((field) =>
          String(data[field])
            ?.toLowerCase()
            ?.includes(PortFoliotype?.toLowerCase() || UserIDtype.toLowerCase())
        );
      }
      return data;
    } else {
      return fieldsToSearch?.some((field) =>
        String(data[field])
          ?.toLowerCase()
          ?.includes(PortFoliotype?.toLowerCase() || UserIDtype.toLowerCase())
      );
    }
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
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const getPortifolioTag = async (e) => {
    try {
      const response = await instance.get(`/api/protfolioName/${e}`);
      if (response.status === 200) {
        const array = response.data.map((a) => a.Portfolio_Name);
        const uniquePortfolios = new Set(array);
        const uniquePortfolioArray = [...uniquePortfolios];
        setPortfolio(uniquePortfolioArray);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  const sellValue = useMemo(() => {
    return (
      filteredData
        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .reduce((acc, value) => {
          if (value["Txn"] === "BUY") {
            acc += Number(value["Avg_Price"]) * -Number(value["Qty"]);
          } else {
            acc += Number(value["Avg_Price"]) * Number(value["Qty"]);
          }
          return acc;
        }, 0)
    );
  }, [filteredData, page, rowsPerPage]);
  useEffect(() => {
    getUploadFilesLedger();
    dropDownData(filteredData);
  }, [fromDate, toDate, page || rowsPerPage]);

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
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DropDown
                    arrays={userId}
                    other
                    label={"User_ID"}
                    values={UserIDtype}
                    onChanges={(e) => {
                      setUserIDType(e.target.value);
                      setTagType("");
                      setPortFolioType("");
                    }}
                  />
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <DropDown
                    arr={tags}
                    label={"Tag"}
                    value={tagType}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                {tagType && (
                  <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                    <DropDown
                      arr={Portfolio}
                      label={"Portfolio_Name"}
                      value={PortFoliotype}
                      onChange={(e) => {
                        setPortFolioType(e.target.value);
                        // getUploadFilesLedger();
                      }}
                    />
                  </Grid>
                )}
              </Grid>
              <Box sx={{ padding: "15px" }}>
                {!loading && data.length === 0 ? (
                  <Typography sx={{ color: "white", padding: "6rem" }}>
                    <ErrorOutlineIcon sx={{ color: "red" }} /> Need to Upload
                    file in settings!
                  </Typography>
                ) : (
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
                        sx={{ paddingRight: "10rem", color: "#90EE90",fontSize:"20px",fontWeight:"bold"}}
                      >
                        {/* {`Total Profit :  ${Math.round(sellValue)}`} */}
                        Total Profit: {sellValue.toFixed(2)}
                        &nbsp;
                      </Typography>
                    </div>
                  </Paper>
                )}
              </Box>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AccordionComponent;
