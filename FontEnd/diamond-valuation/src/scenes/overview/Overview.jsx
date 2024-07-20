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
        <OverviewChart view={view} />
      </Box>
    </Box>
  );
};

export default Overview;
