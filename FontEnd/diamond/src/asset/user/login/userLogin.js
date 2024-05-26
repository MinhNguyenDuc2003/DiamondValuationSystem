import React, { memo } from 'react';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import './userLogin.scss';

const UserLogin = () => {
    const handleGoogleLogin = () => {
       alert('Đang Hoàn Thiện')
    };

    const handleFacebookLogin = () => {
        alert('Đang Hoàn Thiện')
      
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       alert('Đang Hoàn Thiện')

      
    };

    return (
        <div className='wrapperr'>
           
            <h1> ACCOUNT</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' name='username' required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' name='password' required />
                </div>
                <button type='submit' className='login-button'>Login</button>
            </form>
            <div className='alternative-login'>
                <p>Or login with</p>
                <button className='google-login' onClick={handleGoogleLogin}>
                    <GoogleOutlined /> Google
                </button>
                <button className='facebook-login' onClick={handleFacebookLogin}>
                    <FacebookOutlined /> Facebook
                </button>
            </div>
        </div>
    );
};

export default memo(UserLogin);
