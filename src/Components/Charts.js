import { Card } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

function ChartComponent({ data1, downData1, userWise, data2 }) {
  const options = {
    series: [
      {
        name: userWise ? downData1.toString() : "",
        type: "area",
        data: !userWise
          ? data1.map((e) => Number(e))
          : data2.map((e) => Number(e)),
      },
      // {
      //   name: "TEAM B",
      //   type: "line",
      //   data: !userWise ? data1.map((e) => Number(e) + 20) : [],
      // },
    ],
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      type: "solid",
      opacity: [0.35, 1],
    },
    labels: userWise ? [downData1.toString()] : downData1.map((e) => e),
    xaxis: {
      labels: {
        style: {
          colors: "white",
        },
      },
    },
    markers: {
      size: 0,
    },
    yaxis: [
      {
        title: {
          text: "All Customers",
          style: {
            color: "white",
          },
        },
      },
      // {
      //   opposite: true,
      //   title: {
      //     text: "Series B",
      //   },
      // },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " Avg_Price";
          }
          return y;
        },
      },
    },
  };

  return (
    <div id="chart" style={{ padding: "18px" }}>
      <Card sx={{ background: "#25242D", borderRadius: "15px" }}>
        <ReactApexChart
          options={options}
          series={options.series}
          type="line"
          height={340}
        />
      </Card>
    </div>
  );
}

export default ChartComponent;
