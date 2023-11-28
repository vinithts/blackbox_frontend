import { Box, Button, Card, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import InputComponent from "../Components/InputComponent";
import DropDown from "../Components/DropDown";
import { instance } from "../Api";
import DatePickerComponent from "../Components/DatePickerComponent";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";

const AddCustomerNew = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState([]);
  const [UserIDtype, setUserIDType] = useState("");
  const cardStyle = {
    width: "50%",
    height: "63vh",
    background: "#25242D",
    borderRadius: "10px",
    position: "absolute",
    top: "20%",
    left: "35%",
    transform: "translate(-50% -50%)",
    "@media (max-width: 768px)": {
      width: "95%",
      height: "63vh",
      position: "absolute",
      top: "30%",
      left: "2%",
      transform: "none",
    },
    "@media (max-width: 480px)": {
      width: "95%",
      height: "63vh",
      position: "absolute",
      top: "30%",
      left: "2%",
      transform: "none",
    },
  };
  const [dataObject, setDataObject] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    address: "",
    user_id: "",
    amt: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataObject({ ...dataObject, [name]: value });
  };
  const [loading, setLoading] = useState(false);
  const createCustomers = async () => {
    // Validation checks
    if (!dataObject.name || 
      !dataObject.email || 
      !dataObject.mobile ||
      !dataObject.address || 
      !dataObject.gender ||
      !UserIDtype ||
      !dataObject.dob ||
      !dataObject.amt) {
      toast.error("Please fill in all fields!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataObject.email)) {
      toast.error("Please enter a valid email address!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }
  
    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(dataObject.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }
  
    // Amount validation
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(dataObject.amt)) {
      toast.error("Please enter a valid amount!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
      return;
    }
  
    setLoading(true);
    try {
      const response = await instance.post(
        `/api/createCustomer`,
        { ...dataObject, user_id: UserIDtype },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        toast.success("Customer Created Successfully !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
  
        setDataObject({
          name: "",
          email: "",
          mobile: "",
          gender: "",
          dob: "",
          address: "",
          user_id: "",
          amt: "",
        });
  
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
      setLoading(false);
    }
  };
  
  const gender = ["Male", "Female"];
  let user = [];
  const dropDownData = (val) => {
    const result = val.map((e) => {
      if (e.User_ID) {
        user.push(e.User_ID);
      }
    });
    const removeDuplicateUserId = new Set(user);
    const updateUserId = [...removeDuplicateUserId];
    setUserId([...updateUserId]);
    return result;
  };
  const getUploadFilesLedger = async () => {
    try {
      const response = await instance.get(`/api/getUploadFilesLedger`);
      if (response.status === 200) {
        setData(response.data);
        dropDownData(response.data);
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went to wrong !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  const filterDatasValue = (data) => {
    const fieldsToSearch = ["Portfolio_Name", "User_ID", "Tag"];
    return fieldsToSearch?.some((field) =>
      String(data[field])?.toLowerCase()?.includes(UserIDtype.toLowerCase())
    );
  };

  const filteredData = data?.filter((filData) => filterDatasValue(filData));
  useEffect(() => {
    getUploadFilesLedger();
    dropDownData(filteredData);
  }, []);
  return (
    <div>
      <Card sx={cardStyle}>
        <Box
          sx={{
            padding: "20px",
            borderBottom: "1px solid gray",
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Add Customer
          </Typography>
        </Box>
        <Box sx={{ padding: "18px" }}>
          <Grid container spacing={2}>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <InputComponent
                label={"Name"}
                name={"name"}
                value={dataObject.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <DropDown
                arrays={userId}
                other
                label={"User_ID"}
                values={UserIDtype}
                onChanges={(e) => {
                  setUserIDType(e.target.value);
                }}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <InputComponent
                label={"Email"}
                name={"email"}
                value={dataObject.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <InputComponent
                label={"Mobile"}
                name={"mobile"}
                value={dataObject.mobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <DropDown
                label={"Gender"}
                name={"gender"}
                arr={gender}
                value={dataObject.gender}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <DatePickerComponent
                label={"Date of birth"}
                name={"dob"}
                value={dataObject.dob}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <InputComponent
                label={"Address"}
                name={"address"}
                value={dataObject.address}
                onChange={handleChange}
                // textArea
              />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
              <InputComponent
                label={"Amount"}
                name={"amt"}
                value={dataObject.amt}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%", padding: "10px" }}>
          <Button
            onClick={createCustomers}
            variant="contained"
            sx={{
              float: "right",
              background: "white",
              color: "black",
              fontWeight: "600",
              "&:hover": {
                background: "white",
              },
            }}
          >
            Create
          </Button>
        </Box>
      </Card>
      {loading && <Loading />}
    </div>
  );
};

export default AddCustomerNew;
