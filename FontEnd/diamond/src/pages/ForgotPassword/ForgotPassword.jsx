import { Alert, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './ForgotPassword.scss'
import { useNavigate } from 'react-router-dom'
import { validateToken } from '../../utils/ApiFunction'

const ForgotPassword = () => {
    const navigate = useNavigate('');
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [key, setKey] = useState('');
    const [checkExist, setCheckExist] = useState(true);
    const [error, setError] = useState('');
    const [checkKey ,setCheckkey] = useState(false);
    useEffect(() => {
        fetch(`https://6660044b5425580055b1c21d.mockapi.io/Assignment/User/1`)
            .then(data => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle error if needed
            });
    }, [])
    const handleSearch = async () => {
        const result = await validateToken(email)
        if (result.token) {
            setCheckExist(true);
        } else {
            setError('This Email not exist !');
        }
        setTimeout(() => {
            setError('');
        }, 4000);
    }
    const handleReSendToEmail = () => {
        //xu li logic de gui lai ma
    }
    const handleRecover = () => {
        //check xem ma co dung k
        
    }
    return (
        <div className='recover_passowrd'>
            {checkExist ? (
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
                        <Button onClick={handleSearch} variant="contained">Search</Button>
                    </div>
                </>

            ) : (
                <>
                    <div className='header-retake-password'>
                        <h4>Enter The Security Key</h4>
                    </div>
                        <p>Please check the key in your email.</p>
                    <div className='body-content-retake-password'>
                        <div className='body-key'>
                            <TextField id="outlined-basic" label="Key" onChange={e => setKey(e.target.value)} variant="outlined" />

                        </div>
                        <div>
                            <p>We sent you the code to:</p>
                            <p>justindo@gmail.com</p>

                        </div>
                    </div>
                    <div className='action-retake-password'>
                        <div className='reSend'>
                            <p onClick={handleReSendToEmail} >Don't have a code yet?</p>
                        </div>
                        <div className='action'>
                            <Button onClick={e => navigate('/login')} variant="outlined">Cancle</Button>
                            <Button onClick={handleRecover} variant="contained">Continute</Button>
                        </div>
                    </div>
                </>
            )}
            
        </div>

    )
}

export default ForgotPassword