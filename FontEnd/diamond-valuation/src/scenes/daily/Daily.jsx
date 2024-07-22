import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DailyDashBoard } from "../../components/utils/ApiFunctions";

const Daily = () => {
  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(today.getDate() - 10);

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(tenDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [error, setError] = useState(null); // Add state for error messages
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (startDate > endDate) {
        setError("Start date cannot be later than end date.");
        setData([]); // Clear the data if there's an error
        return;
      }
      try {
        const response = await DailyDashBoard(startDate, endDate); // Fetch data from API
        const formattedData = formatData(response);
        setData(formattedData);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const formatData = (data) => {
    const { revenue_each_day, request_each_day } = data;

    if (!revenue_each_day || !request_each_day) {
      console.error("Invalid data format", data);
      return [];
    }

    const dates = Object.keys(revenue_each_day).sort();
    const revenueData = dates.map((date) => ({
      x: date,
      y: revenue_each_day[date],
    }));
    const requestData = dates.map((date) => ({
      x: date,
      y: request_each_day[date],
    }));

    return [
      { id: "Revenue", data: revenueData },
      { id: "Requests", data: requestData },
    ];
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box ml={2}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>
        {error ? (
          <Typography color="error">{error}</Typography> // Display error message
        ) : data.length > 0 ? (
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
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
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
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
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
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
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
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
