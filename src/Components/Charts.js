import React from "react";
import ReactApexChart from "react-apexcharts";

function ChartComponent({ data1, downData1, userWise, data2 }) {
  const options = {
    series: [
      {
        name: "TEAM A",
        type: "area",
        data: !userWise
          ? data1.map((e) => Number(e))
          : data2.map((e) => Number(e)),
      },
      {
        name: "TEAM B",
        type: "line",
        data: !userWise ? data1.map((e) => Number(e) + 20) : [],
      },
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
    labels: downData1.map((e) => e),
    markers: {
      size: 0,
    },
    yaxis: [
      {
        title: {
          text: "Series A",
        },
      },
      {
        opposite: true,
        title: {
          text: "Series B",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={options.series}
        type="line"
        height={350}
      />
    </div>
  );
}

export default ChartComponent;
