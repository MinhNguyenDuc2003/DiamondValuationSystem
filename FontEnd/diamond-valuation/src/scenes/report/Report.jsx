import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Report = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    const reportData = {
      title,
      content,
      status: "New",
    };
    axios
      .post("https://665ae895003609eda45f3327.mockapi.io/Report", reportData)
      .catch((error) => console.error("Error creating course:", error));
    // Handle the submitted report data here (e.g., send to an API)
    handleClear();
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }}>
      <Paper style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Write a Report
        </Typography>
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
