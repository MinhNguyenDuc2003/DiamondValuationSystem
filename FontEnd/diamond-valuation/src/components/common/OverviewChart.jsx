import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { DashBoard } from "../utils/ApiFunctions";
import { CircularProgress, useTheme } from "@mui/material";

const OverviewChart = ({ isDashboard = false, view }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await DashBoard(2024);
        const formattedData = formatData(responseData, view);
        setData(formattedData);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [view]);

  const formatData = (data, view) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let chartData = [];

    if (view === "customers") {
      chartData = months.map((month, index) => ({
        x: month,
        y: data.number_customer_each_month[index + 1] || 0,
      }));
    } else if (view === "requests") {
      chartData = months.map((month, index) => ({
        x: month,
        y: data.number_request_each_month[index + 1] || 0,
      }));
    } else if (view === "certificates") {
      chartData = months.map((month, index) => ({
        x: month,
        y: data.number_certificate_each_month[index + 1] || 0,
      }));
    } else if (view === "revenue") {
      chartData = months.map((month, index) => ({
        x: month,
        y: data.revenue_each_month[index + 1] || 0,
      }));
    }

    return [{ id: view, data: chartData }];
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data.length) {
    return <CircularProgress />;
  }

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.secondary[200],
            },
          },
          legend: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.secondary[200],
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.secondary[200],
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.secondary[200],
          },
        },
        tooltip: {
          container: {
            color: theme.palette.primary.main,
          },
        },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          if (isDashboard) return v.slice(0, 3);
          return v;
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${
              view === "sales"
                ? "Revenue"
                : view.charAt(0).toUpperCase() + view.slice(1)
            } for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard ? (
          [
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 30,
              translateY: -40,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]
        ) : (
          <CircularProgress />
        )
      }
    />
  );
};

export default OverviewChart;
