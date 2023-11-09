import { Card, Typography } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";


function ChartComponent({ data1, downData1, userWise, data2 }) {
  // const options = {
  //   series: [
  //     {
  //       name: userWise ? downData1.toString() : "",
  //       type: "area",
  //       data: !userWise
  //         ? data1.map((e) => Number(e))
  //         : data2.map((e) => Number(e)),
  //     },

  //   ],
  //   chart: {
  //     height: 350,
  //     type: "line",
  //   },
  //   toolbar: {
  //     show: false,
  //   },
  //   stroke: {
  //     curve: "smooth",
  //   },
  //   fill: {
  //     type: "solid",
  //     opacity: [0.35, 1],
  //   },
  //   labels: userWise ? [downData1.toString()] : downData1.map((e) => e),
  //   xaxis: {
  //     labels: {
  //       style: {
  //         colors: "white",
  //       },
  //     },
  //   },
  //   markers: {
  //     size: 0,
  //   },
  //   yaxis: [
  //     {
  //       title: {
  //         text: "All Customers",
  //         style: {
  //           color: "white",
  //         },
  //       },
  //     },

  //   ],
  //   tooltip: {
  //     shared: true,
  //     intersect: false,
  //     y: {
  //       formatter: function (y) {
  //         if (typeof y !== "undefined") {
  //           return y.toFixed(0) + " Avg_Price";
  //         }
  //         return y;
  //       },
  //     },
  //   },
  // };
  console.log(data1[1]);
  const seriesData = [
    {
      name: "Avg Price",
      data: userWise ? data1[1] : downData1[1].map((e) => Number(e).toFixed(1)),
    },
  ];


  const options = {
    chart: {
      width: 800,
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },

    stroke: {
      curve: "straight",
    },
    title: {
      text: "All Customers",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: userWise ? data1[0] : downData1[0].map((e) => e),
    },

    tooltip: {
      enabled: true,
    },
  };
  return (
    <div id="chart" style={{ padding: "18px" }}>

      <Card sx={{ background: "#25242D", borderRadius: "15px" }}>
        <Typography sx={{color:"white",fontSize:"22px",fontWeight:"700",padding:"18px"}}>All Customers Data</Typography>

      <Card
        sx={{
          // background: "#25242D",
          borderRadius: "15px",
        }}
      >

        <ReactApexChart
          options={options}
          series={seriesData}
          type="line"
          height={340}
        />
      </Card>
      </Card>
    </div>
  );
}

export default ChartComponent;
