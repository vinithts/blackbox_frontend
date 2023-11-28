import React, { useEffect, useState } from "react";

import { instance } from "../Api";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ViewUploads() {
  const [getTradeFiles, setGetTradeFiles] = useState([]);
  const navigate = useNavigate();
  const getFiles = async (e) => {
    try {
      const response = await instance.get(`/api/tradeFiles`);
      if (response.status === 200) {
        setGetTradeFiles(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const deleteFiles = async (e) => {
    try {
      const response = await instance.delete(`/api/tradeFile/${e}`);
      if (response.status === 200) {
        console.log("success");
        getFiles();
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getFiles();
  }, []);
  return (
    <div>
      {getTradeFiles.length > 0 ? (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SI.NO</TableCell>
                  <TableCell align="left">File Name</TableCell>
                  <TableCell align="left">View</TableCell>
                  <TableCell align="left">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTradeFiles.map((e, index) => (
                  <TableRow
                    key={e.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{e.tradeFIle}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        onClick={() => navigate("/Dashboard/ViewSelectedFiles")}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        onClick={() => deleteFiles(e.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <Typography sx={{color:'white'}}>no data available</Typography>
      )}
    </div>
  );
}

export default ViewUploads;
