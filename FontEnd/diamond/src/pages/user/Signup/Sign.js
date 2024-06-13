import React, { useState } from 'react';
import './Sign.scss';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
    const [new_user_name, setNewUserName] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [conform_new_password, setConformNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Reset error
        setError('');

        // Validate username
        if (new_user_name.length < 5 || new_user_name.length > 30 || !new_user_name.includes('@gmail.com')) {
            setError('Username phải có từ 5-15 kí tự và chứa @gmail.com');
            return;
        }

        // Validate password
        if (new_password.length < 5 || new_password.length > 30) {
            setError('Password phải có từ 5-15 kí tự');
            return;
        }

        // Validate confirm password
        if (new_password !== conform_new_password) {
            setError('Password không khớp');
            return;
        }

        // Lưu thông tin người dùng vào localStorage
        const user = {
            email: new_user_name,
            password: new_password
        };
        localStorage.setItem('user', JSON.stringify(user));

        // Điều hướng đến trang chủ hoặc trang đăng nhập sau khi đăng ký thành công
        navigate('/');
    };

    return (
        <div className='wrapperrrr'>
            <h1>Create New Account</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='new_user_name'>Username</label>
                    <input
                        type='text'
                        id='new_user_name'
                        name='new_user_name'
                        value={new_user_name}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='new_password'>Password</label>
                    <input
                        type='password'
                        id='new_password'
                        name='new_password'
                        value={new_password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='conform_new_password'>Confirm Password</label>
                    <input
                        type='password'
                        id='conform_new_password'
                        name='conform_new_password'
                        value={conform_new_password}
                        onChange={(e) => setConformNewPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className='error-message'>{error}</p>}
                <button type='submit' className='login-button'>
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default Sign;
