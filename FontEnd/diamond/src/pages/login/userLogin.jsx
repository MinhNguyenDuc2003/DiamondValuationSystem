import React, { useState, useEffect } from 'react';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './userLogin.scss';
import { loginUser, validateToken } from '../../utils/ApiFunction';
import { useAuth } from '../../component/Auth/AuthProvider';
import Alert from 'react-bootstrap/Alert';

const UserLogin = () => {
    const [error, setError] = useState("");
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
        console.log("abc");
        if (result.status === 200 ) {
          navigate("/");
        }
      };
      checkToken();
    }, []);
  
    const handleInputChange = (e) => {
      setLogin({ ...login, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const result = await loginUser(login);
  
      if (result.token) {
        auth.handleLogin(result);
        navigate(redirectUrl, { replace: true });
      } else {
        setError(
          "Invalid email or password. Please try again."
        );
      }
      setTimeout(() => {
        setError("");
      }, 4000);
    };

    return (
        <div className='wrapperr'>
            <form className='login-form' onSubmit={handleSubmit}>
            {error &&  (<Alert key='danger' variant='danger'>
                            {error}
                    </Alert>)}
                <div className='form-group' >
                    <label htmlFor='email' className='text-start'>email</label>
                    <input 
                        className='form-control'
                        type='email' 
                        id='email' 
                        name='email' 
                        value={login.email}
                        onChange={handleInputChange}
                        required 
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password' className='text-start'>Password</label>
                    <input 
                        className='form-control'
                        type='password' 
                        id='password' 
                        name='password'
                        value={login.password}
                        onChange={handleInputChange}
                        minLength={5}
                        required 
                    />
                </div>
                
                <button type='submit' className='login-button'>
                    Login
                </button>
                <div>
                <a href='/signup' className='' style={{ textDecoration: 'none' }}>Create new account</a>
                </div>
            </form>
            
            <div className='alternative-login'>
                <p>Or login with</p>
                <button className='google-login'>
                    <GoogleOutlined /> Google
                </button>
                <button className='facebook-login'>
                    <FacebookOutlined /> Facebook
                </button>
            </div>

            <div cl>

            </div>
          
        </div>
    );
};

export default UserLogin;
