import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { saveReport } from "../../components/utils/ApiFunctions"; // Adjust the import path as needed
import { useNavigate, useParams } from "react-router-dom";

export const Report = () => {
  const { requestId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("BLOCKDIAMOND"); // Default to BLOCKDIAMOND or any initial value you prefer
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSave = async () => {
    const reportData = {
      header: title,
      content,
      type,
      status: "WAIT",
      request_id: requestId,
    };

    try {
      console.log(reportData);
      const result = await saveReport(reportData);
      if (result.message !== undefined) {
        localStorage.setItem(
          "successMessage",
          "Send Report for manager successfully"
        );
        navigate("/requests");
      } else {
        setError("Error occurred");
      }
      handleClear();
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setType("BLOCKDIAMOND"); // Reset to default value
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Write a Report for Request {requestId}
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Report Title"
              type="text"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="BLOCKDIAMOND">BLOCKDIAMOND</MenuItem>
                <MenuItem value="RETURNDIAMOND">RETURNDIAMOND</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your report here..."
              style={{ height: "300px" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Report;
