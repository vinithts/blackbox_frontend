import React from 'react'
import { useEffect } from 'react'
import { getCustomersDetails } from '../Components/Accordion'
import { useState } from 'react'
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Loading from "../Components/Loading";


const ViewCustomerDetails = () => {
const [allCustomers,setAllCustomers]=useState([])
  const [customerHead, setCustomerHead] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getCustomersDetails().then((res) => {
      if (res.status === 200) {
        setAllCustomers(res.data);
        setCustomerHead(Object.keys(res.data[0]));
        setLoading(false);
      }
    });
  }, []);
 
  return (
    <div>
      {loading && <Loading />}
      <Card sx={{ padding: "15px", background: "#25242D" }}>
        <Typography
          variant="h5"
          sx={{ color: "white", fontWeight: "600", padding: "10px" }}
        >
          All Customers
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {customerHead?.map((head) => (
                  <TableCell
                    align={"center"}
                    style={{
                      minWidth: 170,

                      background: "#25242D",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {head.charAt(0).toUpperCase() + head.slice(1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allCustomers.map((pair, i) => (
                <TableRow>
                  {customerHead.map((key, index) => (
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
      </Card>
    </div>
  );
}

export default ViewCustomerDetails
