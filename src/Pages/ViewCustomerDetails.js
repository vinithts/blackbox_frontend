import React from 'react'
import { useEffect } from 'react'
import { getCustomersDetails } from '../Components/Accordion'
import { useState } from 'react'
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Loading from "../Components/Loading";


const ViewCustomerDetails = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerHead, setCustomerHead] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCustomersDetails().then((res) => {
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        setAllCustomers(res.data);
        setCustomerHead(Object.keys(res.data[0]));
        setLoading(false);
      } else {
        setLoading(false);
        // Handle the case where res.data is not as expected
        console.error("Invalid response format:", res.data);
      }
    });
  }, []);

  return (
    <div>
      {loading && <Loading />}
      {!loading && allCustomers.length === 0 ? (
          <Typography sx={{textAlign:"center", padding: "300px", color: "white",fontSize:"18px"}}>
            No customers available!
          </Typography>
        ) : (
          <><Typography
            variant="h5"
            sx={{ color: "white", fontWeight: "600", padding: "20px" }}
          >
            All Customers
          </Typography><Card sx={{ padding: "15px", background: "#25242D" }}>
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
                          key={head}
                        >
                          {head.charAt(0).toUpperCase() + head.slice(1)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCustomers.map((pair, i) => (
                      <TableRow key={i}>
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
            </Card></>
       )}
    </div>
  );
};

export default ViewCustomerDetails;