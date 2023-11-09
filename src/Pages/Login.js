import React, { useState } from "react";
import background from "../Assets/loginBackground.jpg";
import { Box, Button, Grid, Typography } from "@mui/material";
import InputComponent from "../Components/InputComponent";
import { instance } from "../Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies=new Cookies();
  const cardStyle = {
    width: "35%",
    height: "40vh",
    background: "#25242D",
    borderRadius: "10px",
    position: "absolute",
    top: "30%",
    left: "30%",
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
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const navigate = useNavigate();
  const loginUser = async () => {
    try {
      const response = await instance.get(
        `/api/login?userName=${loginData.email}&password=${loginData.password}`
      );
      if (response.status === 200) {
        cookies.set("User", JSON.stringify(response.data), { path: "/" });
        navigate("/dashboard");
        toast.success("login Successfully !", {
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

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div
          style={{
            content: "",
            background: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={cardStyle}>
            <Typography
              sx={{ color: "white", textAlign: "center", padding: "10px" }}
              variant="h5"
            >
              Login
            </Typography>
            <Grid container spacing={2} p={2}>
              <Grid item xl={12} lg={12} md={12} sx={12} sm={12}>
                <InputComponent
                  name={"email"}
                  label={"Email"}
                  value={loginData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xl={12} lg={12} md={12} sx={12} sm={12}>
                <InputComponent
                  label={"Password"}
                  name={"password"}
                  value={loginData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{ margin: "auto 0" }}
                  onClick={loginUser}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Login;
