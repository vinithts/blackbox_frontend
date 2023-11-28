import {
    Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Components/Loading";
import { instance } from "../Api";

function ViewSelectedFiles() {
  const getfiledetailsById = async () => {
    try {
      const result = await instance.get(`/api/ledgerDataByFile/16`);
      return result;
    } catch (e) {
      console.log("err", e);
      toast.error("Something Went to wrong  !", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };
  const [cusKey, setCusKey] = useState([]);
  const [cusDetails, setCusDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getfiledetailsById()
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
  return (
    <>
      {loading && <Loading />}
      <div>
        <TableContainer sx={{ maxHeight: 600 }}>
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
      </div>
    </>
  );
}

export default ViewSelectedFiles;
