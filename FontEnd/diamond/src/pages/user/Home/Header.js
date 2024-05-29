import React, { memo, useEffect, useState } from 'react';
import { RightOutlined, CloseCircleOutlined, UserOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.scss';
import logo from './Gucci-Logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleContactClick = () => {
        navigate('/contact');
        setMenuOpen(false);
    };

    const handleEducationClick = () => {
        navigate('/education');
        setMenuOpen(false);
    };

    const handleDiamondClick = () => {
        navigate('/diamond');
        setMenuOpen(false);
    };

    const handleServiceClick = () => {
        navigate('/service');
        setMenuOpen(false);
    };

    const handleBlogClick = () => {
        navigate('/blog');
        setMenuOpen(false);
    };

    const handleBackHomePage = () => {
        navigate('/');
    };

    const handleSign = () => {
        if (user) {
            setUserMenuOpen(!userMenuOpen);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setUserMenuOpen(false);
        navigate('/login');
    };

    const handleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 0);
        };

        if (location.pathname === '/') {
            window.addEventListener('scroll', handleScroll);
        } else {
            setScrolled(true);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]);

    return (
        <div className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''} ${searchOpen ? 'search-open' : ''}`}>
            <button onClick={handleContactClick} className='contact'>
                <span className={scrolled ? 'scrolled' : ''}>+ Contact Us</span>
            </button>

            <button onClick={handleBackHomePage} className={`logo ${scrolled ? 'scrolled' : ''}`}>
                <img src={logo} alt="Logo" />
            </button>

            <ul className="actions">
                <li>
                    <button onClick={handleSign} className={scrolled ? 'scrolled' : ''}>
                        <UserOutlined />
                    </button>
                    {userMenuOpen && user && (
                        <div className='user-menu'>
                            <ul>
                                <li>
                                    <button onClick={() => navigate('/account')}>Manage Account</button>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
                <li>
                    <button onClick={handleSearch} className={scrolled ? 'scrolled' : ''}>
                        <SearchOutlined />
                    </button>
                </li>
                <li>
                    <button onClick={handleMenu} className={scrolled ? 'scrolled' : ''}>
                        <MenuOutlined style={{ marginRight: '5px' }} />
                        <span>MENU</span>
                    </button>
                </li>
            </ul>

            {menuOpen && (
                <div className="menu">
                    <button onClick={handleMenu} className="close-button"> <CloseCircleOutlined /></button>
                    <div className="menu-content">
                        <ul>
                            <li>
                                <div className='menu-items'>
                                    <button onClick={handleServiceClick} className='btn-menu-items'>
                                        <span className='items'>
                                            <span className='name-item'>Service</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button onClick={handleBlogClick} className='btn-menu-items'>
                                        <span className='items'>
                                            <span className='name-item'> Blog</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button onClick={handleEducationClick} className='btn-menu-items'>
                                        <span className='items'>
                                            <span className='name-item'>Education</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button onClick={handleDiamondClick} className='btn-menu-items'>
                                        <span className='items'>
                                            <span className='name-item'>Diamond</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {menuOpen && <div className="overlay" onClick={handleMenu}></div>}

            {searchOpen && (
                <div className='search'></div>
            )}
        </div>
    );
};

export default memo(Header);
