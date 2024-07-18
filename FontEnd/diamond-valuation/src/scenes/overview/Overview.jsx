import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { getAllRequests } from "../../components/utils/ApiFunctions"; // Adjust the import path as necessary

const monthToChar = {
  "01": "January", // January
  "02": "February", // February
  "03": "March", // March
  "04": "April", // April
  "05": "May", // May
  "06": "June", // June
  "07": "July", // July
  "08": "August", // August
  "09": "September", // September
  10: "October", // October
  11: "November", // November
  12: "December", // December
};

const processData = (data) => {
  const monthlyIncome = {};

  // Filter out requests where paid is not true
  const filteredData = data.filter((entry) => entry.paid);

  filteredData.forEach((entry) => {
    const date = new Date(entry.created_date);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyIncome[yearMonth]) {
      monthlyIncome[yearMonth] = 0;
    }
    monthlyIncome[yearMonth] += entry.total;
  });

  // Generate data for all months of the year
  const year = new Date().getFullYear(); // Current year or you can use a specific year if needed
  const allMonths = {};
  for (let month = 1; month <= 12; month++) {
    const yearMonth = `${year}-${String(month).padStart(2, "0")}`;
    allMonths[yearMonth] = 0; // Initialize all months with zero income
  }

  // Update with actual data
  Object.keys(monthlyIncome).forEach((key) => {
    allMonths[key] = monthlyIncome[key];
  });

  return Object.keys(allMonths)
    .map((yearMonth) => ({
      x: monthToChar[yearMonth.slice(5, 7)] || yearMonth, // Use character for month
      y: allMonths[yearMonth],
    }))
    .sort(
      (a, b) =>
        new Date(
          `${year}-${Object.keys(monthToChar).find(
            (month) => monthToChar[month] === a.x
          )}-01`
        ) -
        new Date(
          `${year}-${Object.keys(monthToChar).find(
            (month) => monthToChar[month] === b.x
          )}-01`
        )
    );
};

const Overview = ({ isDashboard = false }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRequests();
        const formattedData = processData(response);
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const chartData = [
    {
      id: "Income",
      data: data,
    },
  ];

  return (
    <div style={{ height: "500px" }}>
      <ResponsiveLine
        data={chartData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "#525252",
              },
            },
            legend: {
              text: {
                fill: "#525252",
              },
            },
            ticks: {
              line: {
                stroke: "#525252",
                strokeWidth: 1,
              },
              text: {
                fill: "#525252",
              },
            },
          },
          legends: {
            text: {
              fill: "#525252",
            },
          },
          tooltip: {
            container: {
              color: "#f0f0f0",
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
          legend: isDashboard ? "" : `Income for Year ($)`,
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
          !isDashboard
            ? [
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
            : undefined
        }
      />
    </div>
  );
};

export default Overview;
