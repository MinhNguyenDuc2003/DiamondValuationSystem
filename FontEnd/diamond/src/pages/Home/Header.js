import React, { memo, useEffect, useState } from 'react';
import { RightOutlined, CloseCircleOutlined, UserOutlined, SearchOutlined, MenuOutlined, FacebookOutlined, PhoneOutlined, WhatsAppOutlined, AudioOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Menu, Input, Space } from 'antd';
import './Header.scss';
import logo from './image/logot.png';

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

    const handleUserAccount = () => {
        setUser(window.localStorage.getItem(`user`))
    }
    const handleLogoutClick = () => {
        window.localStorage.removeItem(`user`);
        window.location.reload()
        navigate('/');
    }

    const handleServiceClick = () => {
        setServiceOpen(true);
    }
    const handleEducationClick = () => {
        setEducationOpen(true);
    };

    const handleCloseEducation = () => {
        setEducationOpen(false);
    };
    const handleCloseService = () => {
        setServiceOpen(false);
    };

    const handleNavigateToEducation = (path) => {
        navigate(path);
        setEducationOpen(false);
        setMenuOpen(false);
        // window.location.reload();
    };
    const handleNavigateToService = (path) => {
        navigate(path);
        setServiceOpen(false);
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
    const nameUser = 'justin';
    // const nameUser = JSON.parse(user);
    const menuUser = (


        <Menu>

            {user ? (
                <>
                    <Menu.Item>
                        <Button onClick={() => navigate('/account')} type="text">Manage Account</Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button onClick={e => navigate('/MyOrder')} type='text'> My Order</Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button onClick={handleLogoutClick} type='text'> Logout</Button>
                    </Menu.Item>
                </>
            ) : (
                <>
                    <Menu.Item>
                        <Button onClick={e => navigate("/login")} type='text'> Login</Button>

                    </Menu.Item>
                    <Menu.Item>
                        <Button onClick={e => navigate("/signup")} type='text'> Sign Up</Button>

                    </Menu.Item>
                </>

            )}


        </Menu>

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
                    <Dropdown className='account' overlay={menuUser} trigger={['hover']} visible={userMenuOpen} onVisibleChange={setUserMenuOpen}>
                        {user ? (
                            <strong style={{ margin: 0 }}>{nameUser.LastName}</strong>
                        ) : (
                            <Button type="text" icon={<UserOutlined />} />
                        )}
                    </Dropdown>
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
