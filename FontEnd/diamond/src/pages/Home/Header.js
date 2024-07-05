import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Dropdown, Menu, Input, Space } from 'antd';
import { getCustomerById } from '../../utils/ApiFunction';
import './Header.scss';
import logo from './image/logot.png';
import Account from './Account.jsx';
import { useAuth } from '../../component/Auth/AuthProvider.jsx';
import { Button, Badge, IconButton, List, ListItemButton, ListItemText, Popover, outlinedInputClasses, Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import '@fontsource/roboto/500.css';
import { useMediaQuery } from 'react-responsive';
import MenuIcon from '@mui/icons-material/Menu';
import { SearchOutlined } from '@mui/icons-material';


const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuContact, setMenuContact] = useState(false);
    const [educationOpen, setEducationOpen] = useState(false);
    const [ServiceOpen, setServiceOpen] = useState(false);
    const [user, setUser] = useState();
    const [isLogin, setLogin] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();

    const [totalRequest, setTotalRequest] = useState('')
    const [badgeVisible, setBadgeVisible] = useState(true);

    //Responsive........
    const isMaxScreen767 = useMediaQuery({ query: '(max-width: 767px)' });


    // Ẩn Badge khi click vào
    const handleBadgeClick = () => {
        setBadgeVisible(false);

    };
    const handleLogoutClick = () => {
        setLogin(false)
        auth.handleLogout();
        navigate('/login');
    }

    const handleMenuOpen = (event) => {
        setUserMenuOpen(event.currentTarget);
    };

    const handleMenuClose = () => {
        setUserMenuOpen(null);
    };
    const handleNavigate = (path) => {
        navigate(path);
        setUserMenuOpen(false);
    };
    const handleNavigateToEducation = (path) => {
        navigate(path);
        setEducationOpen(false);
        setMenuOpen(false);
        window.location.reload();
    };
    const handleNavigateToService = (path) => {
        navigate(path);
        setServiceOpen(false);
        setMenuOpen(false);
    };

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        //dung để lấy ra độ dài của mảng
        setTotalRequest(storedOrders.length);
    }, []);

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

    const handleSearch = () => {

        console.log('Search value:', searchValue);
    };

    useEffect(() => {
        
        const getCustomer = async() => {
            const data = await getCustomerById();
            if(data!==null){
              setUser({
                first_name: data.first_name,
                last_name: data.last_name
              }); 
              setLogin(true)
            }
          }
          getCustomer();
    },[navigate])
    const menuUser = (

        <Popover
            open={Boolean(userMenuOpen)}
            anchorEl={userMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <List>
                {isLogin ? (
                    <>
                        <ListItemButton onClick={() => handleNavigate('/account')}>
                            <ListItemText primary="Manage Account" />
                        </ListItemButton>
                        {isMaxScreen767 && (
                        <ListItemButton onClick={() => handleNavigate('/Service/ServiceList')}>
                            <ListItemText primary="Service"/>
                        </ListItemButton>

                        )}
                        <ListItemButton onClick={() => handleNavigate('/MyRequest')}>

                            <Badge sx={{ gap: "5px" }}
                                badgeContent={totalRequest}
                                onClick={handleBadgeClick}
                                color="primary">
                                <ListItemText primary="My Request" />

                            </Badge>
                        </ListItemButton>
                        <ListItemButton onClick={handleLogoutClick}>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </>
                ) : (
                    <>
                        <ListItemButton onClick={() => navigate("/login")}>
                            <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton onClick={() => navigate("/signup")}>
                            <ListItemText primary="Sign Up" />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Popover>
    );


    return (
        <div className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
            <div className='header-left'>
                <div className='contact'>
                    <button onClick={() => setMenuContact(!menuContact)} className={scrolled ? 'scrolled' : ''}><span>+</span> Contact Us</button>
                    {/* {menuContact && ( */}
                    <div className="contact-content">
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <CallOutlinedIcon className='icon-contact' />
                                <span>CALL US 099999999</span>
                            </a>
                            <p>Our Client Services are available daily, between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <WhatsAppIcon className='icon-contact' />
                                <span>WHATSAPP US</span>
                            </a>
                            <p>Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <FacebookOutlinedIcon className='icon-contact' />
                                <span>FACEBOOK US</span>
                            </a>
                            <p>Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).</p>
                        </div>
                        <div className="col">
                            <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <FmdGoodIcon className='icon-contact' />
                                <span>ADDRESS US</span>
                            </a>
                            <p>Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh</p>
                        </div>
                    </div>
                    {/* )} */}
                </div>
                <div className='education'>
                    <button>Education</button>
                    <ul className="education-content">
                        <li>
                            <button className='carat' onClick={() => handleNavigateToEducation('/education/carat')}>Carat
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToEducation('/education/cut')}>Cut
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToEducation('/education/color')}>Color
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToEducation('/education/clarity')}>Clarity
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToEducation('/education/fluorescence')}>Fluorescence
                            </button>
                        </li>
                    </ul>
                </div>
                <div className='diamond'>
                    <button>Diamond</button>
                </div>      
                {isMaxScreen767 && (
                    <MenuIcon onClick={handleMenuOpen} className='iconMenu' />
                )}
            </div>

            <button onClick={() => navigate('/')} className={`logo ${scrolled ? 'scrolled' : ''}`}>
                <img src={logo} alt="Logo" />
            </button>

            <div className='header-right'>
                <div className='service'>
                    <button>Service</button>
                    <ul className="service-content">
                        <li>
                            <button onClick={() => handleNavigateToService('/Service/valuation')}>Valuation
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToService('/Service/calculator')}>Calculation
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToService('/Service/sale')}>Sale
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleNavigateToService('/Service/sculpture')}>Sculpture
                            </button>
                        </li>
                    </ul>
                </div>
                <div className='blog' >
                    <button onClick={() => handleNavigateToEducation('/blog')}>Blog</button>
                </div>

                <div className='active'>
                    <form className='search-box'>
                        <input type='text' placeholder='Looking for blogs'>
                        </input>
                        <Button className='search' type="text" icon={<SearchOutlined/>} />
                    </form>
                    <div>
                    <Account
                        isLogin={isLogin}
                        menuUser={menuUser}
                        userMenuOpen={userMenuOpen}
                        setUserMenuOpen={setUserMenuOpen}
                    />
        </div>
                </div>
                {/* <ul className="actions">
                    <li>
                        <Dropdown overlay={menuUser} trigger={['hover']} visible={userMenuOpen} onVisibleChange={setUserMenuOpen}>
                            <Button type="text" icon={<UserOutlined />} />
                        </Dropdown>
                    </li>
                    <li>

                                </Badge>
                            ) : (
                                <AccountCircleIcon />
                            )}
                        </div>

                    </div>
                </div>
            )}

            {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
            {ServiceOpen && <div className="overlay-2" onClick={() => setServiceOpen(false)}></div>}
            {educationOpen && <div className="overlay-2" onClick={() => setEducationOpen(false)}></div>}

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
            {menuContact && <div className="overlay" onClick={() => setMenuContact(false)}></div>} */}
        </div>
        </div>
    );
};

export default memo(Header);
