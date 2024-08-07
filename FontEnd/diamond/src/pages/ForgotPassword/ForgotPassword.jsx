import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './ForgotPassword.scss'
import { useNavigate } from 'react-router-dom'
import { forgotPassword} from '../../utils/ApiFunction'

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [foundEmail, setFoundEmail] = useState(true)
    const handleSearch = async () => {
        const result = await forgotPassword(email);
        setLoading(true)
        try {
            if (result !== null && result.status === 200) {
                setFoundEmail(false)
            } else {
                setError('This Email not exist !');
            
        } 
         }catch (error) {
            console.log('error')
        }finally{
            setLoading(false)
        }
        setTimeout(() => {
            setError('');
        }, 6000);
    }
    if (loading) {
        return (
          <Box mt={20} mb={38} textAlign={'center'}>
             <CircularProgress size={50} color="primary" />
                  <Box mt={2}>
                    <h3>LOADING. . .</h3>
                  </Box>
          </Box>
        );
      }

    return (
        <div className='recover_passowrd'>
            {foundEmail ? (
                <>
                    <div className='header-retake-password'>
                        {error && <Alert severity="error">{error}</Alert>}
                        <h4>Find Your Account</h4>
                    </div>
                    <div className='body-content-retake-passwordd'>
                        <p>Enter your email to search for your account.</p>
                        <TextField id="outlined-basic" label="Email" onChange={e => setEmail(e.target.value)} variant="outlined" fullWidth />
                    </div>
                    <div className='action-retake-passwordd'>
                        <Button onClick={e => navigate('/login')} variant="outlined">Cancel</Button>
                        <Button onClick={handleSearch} variant="contained">Submit</Button>
                    </div>
                </>

            ) : (
                <>
                    <div className='header-retake-password'>
                        <h4>Send request to reset password successfully</h4>
                    </div>
                        <p>Please check your email.</p>
                </> 
            )}            
        </div>

    )
}

export default ForgotPassword