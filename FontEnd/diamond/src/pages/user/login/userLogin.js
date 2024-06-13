import React, { memo, useState } from 'react';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './userLogin.scss';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        alert('Đang Hoàn Thiện');
    };

    const handleFacebookLogin = () => {
        alert('Đang Hoàn Thiện');
    };

    const handleSignClick = () => {
        navigate('/sign')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Reset error
        setError('');

        // Validate username
        if (username.length < 5 || username.length > 15 || !username.includes('@gmail.com')) {
            setError('Username phải có từ 5-9 kí tự và chứa @gmail.com');
            return;
        }

        // Validate password
        // if (password.length < 5 || password.length > 15) {
        //     setError('Password phải có từ 5-10 kí tự');
        //     return;
        // }

        // Fetch data to validate user
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.email === username && u.id === password); 
                if (user) {
                    navigate('/');
                } else {
                    setError('Sai tài khoản hoặc mật khẩu');
                }
            });
    };

    return (
        <div className='wrapperr'>
            <h1> ACCOUNT</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input 
                        type='text' 
                        id='username' 
                        name='username' 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password' 
                        id='password' 
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p className='error-message'>{error}</p>}
                <button type='submit' className='login-button'>
                    Login
                </button>
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

            <div cl>

            </div>
          
        </div>
    );
};

export default memo(UserLogin);
