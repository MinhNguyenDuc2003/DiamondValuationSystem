import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import {
  saveReport,
  getRequestById,
  updateRequestStatus,
} from "../../components/utils/ApiFunctions"; // Adjust the import path as needed
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlockDiamondHtml = `
<!DOCTYPE html>
<html>
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            width: 50%;
            height: 100%;
            margin: auto;
            padding: 2%;
            border: 1px solid #333333;
            box-sizing: border-box;
        }
        .header {
            flex: 0.2;
            box-sizing: border-box;
        }
        .header .title-seal {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header .title-seal img {
            width: 30%;
            flex: 0.2;
        }
        .header .date {
            margin: 20px;
            display: block;
            text-align: right;
        }
        .header h1 {
            text-align: center;
        }
        .info-user {
            max-width: 50em;
            padding: 0;
            overflow-x: hidden;
            list-style: none;
            line-height: 28px;
        }
        .info-user div {
            text-align: justify;
        }
        .info-user li::before {
            float: left;
            width: 0;
            white-space: nowrap;
            content:
                ". . . . . . . . . . . . . . . . . . . . "
                ". . . . . . . . . . . . . . . . . . . . "
                ". . . . . . . . . . . . . . . . . . . . "
                ". . . . . . . . . . . . . . . . . . . . ";
        }
        .info-user .element {
            padding-right: 0.33em;
            background: white
        }
        .info-user .value {
            margin-left: 3em;
            background-color: white;
        }
        .info-diamond {
            margin: 10px auto 20px;
            width: 100%;
            height: 100%;
            border-collapse: collapse;
        }
        .info-diamond th, .info-diamond td {
            border: 1px solid #333333;
            text-align: left;
            padding: 2px;
        }
        .body {
            flex: 0.6;
        }
        .content {
            margin: 10px auto;
        }
        .note ul {
            margin: 5px auto;
        }
        .footer {
            flex: 0.2;
            display: flex;
            justify-content: space-around;
            align-items: baseline;
            text-align: center;
        }
        .footer img {
            width: 80%;
        }
    </style>
</head>
<body>
    <div class="container">
        <section class="header">
            <div class="title-seal">
                <img src="./logot.png" alt="Shine logo">
                <b>Policy Enforcement Notice</b>
            </div>
            <div class="date">
                <i>Date: <span>#Value</span></i>
            </div>
            <h1>DIAMOND SEALING RECORD</h1>
        </section>
        <section class="body">
            <div>
                <div class="info">
                    <ul class="info-user">
                        <li><b class="element">Name: </b><span class="value">#Value</span></li>
                        <li><b class="element">Email: </b><span class="value">#Value</span></li>
                        <li><b class="element">Contact number: </b><span class="value">#Value</span></li>
                    </ul>
                    <table class="info-diamond">
                        <tr>
                            <th>Certificate number</th>
                            <th>Weight</th>
                            <th>Color</th>
                            <th>Clarity</th>
                            <th>Cut</th>
                            <th>Type</th>
                        </tr>
                        <tr>
                            <td>#Value</td>
                            <td>#Value</td>
                            <td>#Value</td>
                            <td>#Value</td>
                            <td>#Value</td>
                            <td>#Value</td>
                        </tr>
                    </table>
                </div>
                <div class="content">
                    <b>Reason for sealing: </b>
                    <div style="text-indent: 30px;">
                        This diamond is being sealed because the customer,
                        <span>#CustomerNameValue</span>, has not been contactable for the past 7 days.
                        The last successful contact with <span>#CustomerNameValue</span>
                        was on <span>#DateValue</span>. Since then,
                        multiple attempts have been made to reach <span>#CustomerNameValue</span>
                        via phone, email, and physical mail,
                        but no response has been received.
                        These attempts include three phone calls,
                        three emails, and one registered letter.
                    </div>
                </div>
                <div class="content">
                    <b>Sealing Process: </b>
                    <span>
                        The diamond has been carefully placed in a tamper-evident bag,
                        which has been signed and dated by the sealing officer.
                        The sealed bag has been stored in the company’s secure vault to
                        ensure its safety and integrity until further notice.
                    </span>
                </div>
                <div class="content">
                    <b>Remarks:</b>
                    <span>
                        The diamond will remain sealed until the customer responds.
                        If there is no response from the customer within an
                        additional 30 days, further action will be taken in
                        accordance with company policy, which may include
                        reporting the situation to relevant authorities and
                        potentially auctioning the diamond to recover costs.
                    </span>
                </div>
            </div>
            <div class="note">
                <b><i>Note:</i></b>
                <ul>
                    <li>
                        <b>No Third-Party Collection: </b>
                        <span>
                            The customer cannot authorize another person
                            to collect the diamond on their behalf under
                            any circumstances.
                        </span>
                    </li>
                    <li>
                        <b>In-Person Retrieval Only: </b>
                        <span>
                            The customer must collect the diamond in person,
                            providing valid government-issued identification.
                        </span>
                    </li>
                    <li>
                        <b>Legal Consequences: </b>
                        <span>
                            Failure to comply with these conditions may result
                            in legal action, including but not limited to the
                            forfeiture of the diamond and recovery of any associated costs.
                        </span>
                    </li>
                </ul>
            </div>
        </section>
        <section class="footer">
            <div class="stamp">
                <h3>SHINE Company</h3>
                <img src="./Facet_part1.jpg" alt="Shine stamp">
            </div>
            <div class="signature">
                <h3>Signature</h3>
                <img src="./Facet_part2.jpg" alt="Signature of manager">
            </div>
        </section>
    </div>
</body>
</html>
`;

const Report = () => {
  const { requestId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("BLOCKDIAMOND");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [request, setRequest] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      await getRequestById(requestId).then((response) => setRequest(response));
    };
    fetchRequest();
  });

  // const handleSave = async () => {
  //   const htmlContent = BlockDiamondHtml(request);
  //   console.log(htmlContent);
  //   const reportData = {
  //     header: title,
  //     content: htmlContent,
  //     type,
  //     status: "WAIT",
  //     request_id: requestId,
  //   };

  //   try {
  //     console.log(reportData);
  //     const result = await saveReport(reportData);
  //     if (result.message !== undefined) {
  //       localStorage.setItem(
  //         "successMessage",
  //         "Send Report for manager successfully"
  //       );
  //       navigate("/requests");
  //     } else {
  //       setError("Error occurred");
  //     }
  //     handleClear();
  //   } catch (error) {
  //     setError("Error occurred");
  //     console.error("Error saving report:", error);
  //   }
  // };

  const handleSave = async () => {
    const reportData = {
      header: title,
      content,
      type,
      status: "WAIT",
      request_id: requestId,
    };
    try {
      const result = await saveReport(reportData);
      if (reportData.type === "BLOCKDIAMOND") {
        await updateRequestStatus(requestId, "BLOCKREQUEST");
      }
      if (reportData.type === "RETURNDIAMOND") {
        await updateRequestStatus(requestId, "RETURNREQUEST");
      }
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
      setError("Error occurred");
      console.error("Error saving report:", error);
    }
  };

  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setType("BLOCKDIAMOND");
    setMessage("");
    setError(null);
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
              style={{ height: "200px" }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: "3rem" }}>
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
    /* <Container>
      <Paper>
        <Typography variant="h4">Create Report</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Block Diamond Report
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Block Diamond Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the title for your Block Diamond Report.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogContentText
            dangerouslySetInnerHTML={{ __html: BlockDiamondHtml }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container> */
  );
};

export default Report;
