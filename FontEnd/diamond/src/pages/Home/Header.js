import React, { memo, useEffect, useState } from 'react';
import { RightOutlined, CloseCircleOutlined, UserOutlined, SearchOutlined, MenuOutlined, FacebookOutlined, PhoneOutlined, WhatsAppOutlined, AudioOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Menu, Input, Space } from 'antd';
import './Header.scss';
import logo from './image/logot.png';
import { Badge, IconButton, List, ListItemButton, ListItemText, Popover } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuContact, setMenuContact] = useState(false);
    const [educationOpen, setEducationOpen] = useState(false);
    const [ServiceOpen, setServiceOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [totalRequest , setTotalRequest] = useState('')
    const [badgeVisible, setBadgeVisible] = useState(true);

    // Ẩn Badge khi click vào
    const handleBadgeClick = () => {
        setBadgeVisible(false); 
      
    };
    const handleLogoutClick = () => {
        window.localStorage.removeItem(`user`);
        window.location.reload()
        navigate('/');
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

    const blogs = [
        { id: `ask-certification-importance`, title: 'Introduction to Diamonds' },
        { id: `ask-fancy-yellow-diamond-below20k`, title: 'The 4 C’s of Diamonds' },
        { id: `ask-k-color-diamond-in-pave-ring`, title: 'Choosing the Right Diamond' },
    ];

    const handleSearch = () => {
        console.log('Search value:', searchValue);
        const filteredBlogs = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log('Filtered blogs:', filteredBlogs);
        if (filteredBlogs.length > 0) {
            setSearchValue(``);
            navigate(`/blog/${filteredBlogs[0].id}`);
        } else {
            console.log(`no result`)
        }
    };

    useEffect(() => {

        setUser(window.localStorage.getItem(`user`))


    }, [user])
    const nameUser = JSON.parse(user);
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
                horizontal: 'right',
            }}
        >
            <List>
                {user ? (
                    <>
                        <ListItemButton onClick={() => handleNavigate('/account')}>
                            <ListItemText primary="Manage Account" />
                        </ListItemButton>
                        <ListItemButton onClick={() => handleNavigate('/MyRequest')}>

                            <Badge sx={{gap : "5px"}} 
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
                    <button onClick={() => setMenuContact(!menuContact)} className={scrolled ? 'scrolled' : ''}>+ Contact Us</button>
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
                    <form className='search-box' onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <Input
                            type='text'
                            placeholder='Looking for blogs'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <Button className='search' htmlType='submit' icon={<SearchOutlined />} />
                    </form>
                    <IconButton
                        className='account-button'
                        aria-label="account-menu"
                        aria-controls="account-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                    >
                        {user ? (
                               <Badge sx={{gap : "5px"}} badgeContent={totalRequest} color="primary">
                                   <strong >{nameUser.LastName}</strong>

                               </Badge>
                        ) : (
                            <UserOutlined />
                        )}
                    </IconButton>
                    {menuUser}
                </div>
            </div>


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
