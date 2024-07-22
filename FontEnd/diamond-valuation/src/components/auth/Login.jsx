// import React, { useEffect, useState } from "react";
// import { loginUser } from "../utils/ApiFunctions";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthProvider";
// import {
//   Container,
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Alert,
// } from "@mui/material";
// import { validateToken } from "../utils/ApiFunctions";

// export const Login = () => {
//   const [errorMessage, setErrorMessage] = useState("");
//   const [login, setLogin] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();
//   const location = useLocation();
//   const auth = useAuth();
//   const redirectUrl = location.state?.path || "/";

//   useEffect(() => {
//     const checkToken = async () => {
//       const result = await validateToken();
//       if (result.status == 200) {
//         navigate("/");
//       }
//     };
//     const token = localStorage.getItem("token");
//     if (token !== null && token.length > 0) {
//       checkToken();
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     setLogin({ ...login, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await loginUser(login);

//     if (result.token) {
//       const token = result.token;
//       auth.handleLogin(token);
//       navigate(redirectUrl, { replace: true });
//     } else {
//       setErrorMessage(
//         result.message || "Invalid email or password. Please try again."
//       );
//     }
//     setTimeout(() => {
//       setErrorMessage("");
//     }, 4000);
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{ maxWidth: 350, mx: "auto" }}
//       >
//         {errorMessage && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {errorMessage}
//           </Alert>
//         )}
//         <Box sx={{ border: "1px solid #ced4da", borderRadius: 1, p: 3 }}>
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="h6"
//               component="label"
//               htmlFor="email"
//               sx={{ display: "block", mb: 1 }}
//             >
//               Email
//             </Typography>
//             <TextField
//               id="email"
//               name="email"
//               type="email"
//               fullWidth
//               value={login.email}
//               onChange={handleInputChange}
//               required
//             />
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="h6"
//               component="label"
//               htmlFor="password"
//               sx={{ display: "block", mb: 1 }}
//             >
//               Password
//             </Typography>
//             <TextField
//               id="password"
//               name="password"
//               type="password"
//               fullWidth
//               value={login.password}
//               onChange={handleInputChange}
//               required
//               inputProps={{ minLength: 5 }}
//             />
//           </Box>

//           <Box>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               name="login"
//               sx={{ mr: 2, width: "40%" }}
//             >
//               Login
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { loginUser, validateToken } from "../utils/ApiFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";

const LoginContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
}));

const LoginForm = styled(Box)(({ theme }) => ({
  width: "100%", // Fix IE11 issue.
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const redirectUrl = location.state?.path || "/";

  useEffect(() => {
    const checkToken = async () => {
      const result = await validateToken();
      if (result.status === 200) {
        navigate("/");
      }
    };
    const token = localStorage.getItem("token");
    if (token !== null && token.length > 0) {
      checkToken();
    }
  }, []);

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(login);

    if (result.token) {
      const token = result.token;
      auth.handleLogin(token);
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage(
        result.message || "Invalid email or password. Please try again."
      );
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  return (
    <LoginContainer component="main" maxWidth="xs">
      <LoginPaper elevation={3}>
        <Typography component="h1" variant="h5">
          Diamond Valuation Admin
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <LoginForm component="form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={login.email}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={login.password}
            onChange={handleInputChange}
            inputProps={{ minLength: 5 }}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Login
          </SubmitButton>
        </LoginForm>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Login;
