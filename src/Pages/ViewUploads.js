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
  TablePagination,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ViewUploads() {
  const [getTradeFiles, setGetTradeFiles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const getFiles = async () => {
    try {
      const response = await instance.get(`/api/tradeFiles`);
      if (response.status === 200) {
        setGetTradeFiles(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFiles = async (id) => {
    try {
      const response = await instance.delete(`/api/tradeFile/${id}`);
      if (response.status === 200) {
        console.log("success");
        getFiles();
        // Display success message using toast
        toast.success("File deleted successfully");
      }
    } catch (e) {
      console.log(e);
      // Display error message using toast
      toast.error("Error deleting file");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div>
      {getTradeFiles.length > 0 ? (
        <Box sx={{ padding: "10px" }}>
          <Typography
            variant="h4"
            sx={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Uploaded Files
          </Typography>
          <div>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 600,
                marginTop: "4rem",
                border: "1px solid #D9D9D9",
              }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      SI.NO
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      File Name
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      View
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "rgb(23, 23, 33)",
                        color: "white",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? getTradeFiles.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : getTradeFiles
                  ).map((e, index) => (
                    <TableRow
                      key={e.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        {e.tradeFIle}
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={() =>
                            navigate(`/Dashboard/ViewSelectedFiles/${e.id}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell
                        sx={{ background: "#25242D", color: "white" }}
                        align="center"
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red" }}
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
            {getTradeFiles.length > 5 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                component="div"
                count={getTradeFiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ background: "#25242D", color: "white", fontSize: "20px" }}
              />
            )}
          </div>
        </Box>
      ) : (
        <Typography sx={{textAlign:"center", padding: "300px", color: "white",fontSize:"18px"}}>
          No Files available !
        </Typography>
      )}
    </div>
  );
}

export default ViewUploads;
