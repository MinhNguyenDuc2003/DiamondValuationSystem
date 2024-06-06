import React, { memo, useEffect, useState } from 'react';
import { RightOutlined, CloseCircleOutlined, UserOutlined, SearchOutlined, MenuOutlined, FacebookOutlined, PhoneOutlined, WhatsAppOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.scss';
import logo from './image/logot.png';



const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuContact, setMenuContact] = useState(false);
    const [educationOpen, setEducationOpen] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleEducationClick = () => {
        setEducationOpen(true);
    };

    const handleCloseEducation = () => {
        setEducationOpen(false);
    };

    const handleNavigateToEducation = (path) => {
        navigate(path);
        setEducationOpen(false);
        setMenuOpen(false);
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
            <button onClick={() => setMenuContact(!menuContact)} className='contact'>
                <span className={scrolled ? 'scrolled' : ''}>+ Contact Us</span>
            </button>

            <button onClick={() => navigate('/')} className={`logo ${scrolled ? 'scrolled' : ''}`}>
                <img src={logo} alt="Logo" />
            </button>

            <ul className="actions">
                <li>
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={scrolled ? 'scrolled' : ''}>
                        <UserOutlined />
                    </button>
                    {userMenuOpen && user && (
                        <div className='user-menu'>
                            <ul>
                                <li>
                                    <button onClick={() => navigate('/account')}>Manage Account</button>
                                </li>
                                <li>
                                    <button onClick={() => { setUser(null); setUserMenuOpen(false); navigate('/login'); }}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>
                <li>
                    <button onClick={() => setSearchOpen(!searchOpen)} className={scrolled ? 'scrolled' : ''}>
                        <SearchOutlined />
                    </button>
                </li>
                <li>
                    <button onClick={() => setMenuOpen(!menuOpen)} className={scrolled ? 'scrolled' : ''}>
                        <MenuOutlined style={{ marginRight: '5px' }} />
                        <span>MENU</span>
                    </button>
                </li>
            </ul>

            {menuOpen && (
                <div className="menu">
                    <button onClick={() => setMenuOpen(false)} className="close-button"><CloseCircleOutlined /></button>
                    <div className="menu-content">
                        <ul>
                            <li>
                                <div className='menu-items'>
                                    <button onClick={() => handleNavigateToEducation('/service')} className='btn-menu-items'>
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
                                    <button onClick={() => handleNavigateToEducation('/blog')} className='btn-menu-items'>
                                        <span className='items'>
                                            <span className='name-item'>Blog</span>
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
                                    <button onClick={() => handleNavigateToEducation('/diamond')} className='btn-menu-items'>
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

            {educationOpen && (
                <div className="education-panel">
                    <button onClick={handleCloseEducation} className="close-button"><CloseCircleOutlined /></button>
                    <div className="education-content">
                        <ul>
                            <li>
                                <button onClick={() => handleNavigateToEducation('/education/carat')}>Carat
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToEducation('/education/cut')}>Cut
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToEducation('/education/color')}>Color
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToEducation('/education/clarity')}>Clarity
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToEducation('/education/fluorescence')}>Fluorescence
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

            {searchOpen && (
                <div className='search'></div>
            )}

            {menuContact && (
                <div className="wrapper-menu">
                    <button onClick={() => setMenuContact(false)} className="close-button"><CloseCircleOutlined /></button>
                    <div className="menu-content">
                        <h2>CONTACT US</h2>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <PhoneOutlined />
                                <span>CALL US 099999999</span>
                            </a>
                            <p>Our Client Services are available daily, between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <WhatsAppOutlined />
                                <span>WHATSAPP US</span>
                            </a>
                            <p>Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <FacebookOutlined />
                                <span>FACEBOOK US</span>
                            </a>
                            <p>Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <EnvironmentOutlined />
                                <span>ADDRESS US</span>
                            </a>
                            <p>Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh</p>
                        </div>
                    </div>
                </div>
            )}
            {menuContact && <div className="overlay" onClick={() => setMenuContact(false)}></div>}
        </div>
    );
};

export default memo(Header);
