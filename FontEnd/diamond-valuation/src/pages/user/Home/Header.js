import React, { memo, useEffect, useState } from 'react';
import { RightOutlined, CloseCircleOutlined, UserOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.scss';
import logo from './Gucci-Logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    console.log(location)
    const handleContactClick = () => {
      
    };

    const handleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleSearch = () => {
        
    };

    const handleBackHomePage = () => {
        navigate('/');
    };

    const handleSign = () => {
        navigate('/login');
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
        <div className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
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
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
                                            <span className='direct-item'>
                                                <span className='direct'> <RightOutlined /></span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                            <li>
                                <div className='menu-items'>
                                    <button className='btn-menu-items'>
                                        <span className='items' >
                                            <span className='name-item'>New in</span>
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
        </div>
    );
};

export default memo(Header);
