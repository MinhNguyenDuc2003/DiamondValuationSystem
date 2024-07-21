import React, { useState } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Box,
  Select,
  Typography,
} from "@mui/material";
import OverviewChart from "../../components/common/OverviewChart";

const Overview = () => {
  const [view, setView] = useState("revenue");
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <Box m="1.5rem 2.5rem">
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Box height="75vh">
        <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="requests">Requests</MenuItem>
            <MenuItem value="customers">Customers</MenuItem>
            <MenuItem value="certificates">Certificates</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 2 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: "200px",
                },
              },
            }}
          >
            {/* Generate year options from a range */}
            {Array.from(
              { length: 100 },
              (_, index) => new Date().getFullYear() - index
            ).map((yearOption) => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <OverviewChart view={view} year={year} />
      </Box>
    </Box>
  );
};

export default Overview;
