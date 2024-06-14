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


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

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

    const handleSearch = () => {

        console.log('Search value:', searchValue);
    };

    const menuUser = (
        <Menu>
            <Menu.Item>
                <Button onClick={() => navigate('/account')} type="text">Manage Account</Button>
            </Menu.Item>
            <Menu.Item>
                <Button type='text'> Logout</Button>
            </Menu.Item>
        </Menu>
    );
    const search = (
        <Menu>

            <Space direction="vertical">
                <Input.Search
                    placeholder="input search text"
                    style={{
                        width: 200,
                    }}
                    onSearch={handleSearch}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </Space>

        </Menu>
    );

    return (
        <div className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
            <button onClick={() => setMenuContact(!menuContact)} className='contact'>
                <span className={scrolled ? 'scrolled' : ''}>+ Contact Us</span>
            </button>

            <button onClick={() => navigate('/')} className={`logo ${scrolled ? 'scrolled' : ''}`}>
                <img src={logo} alt="Logo" />
            </button>

            <ul className="actions">
                <li>
                    <Dropdown overlay={menuUser} trigger={['hover']} visible={userMenuOpen} onVisibleChange={setUserMenuOpen}>
                        <Button type="text" icon={<UserOutlined />} />
                    </Dropdown>
                </li>
                <li>

                    <Dropdown overlay={search} trigger={['hover']} >
                        <Button type="text" icon={<SearchOutlined />} />
                    </Dropdown>
                </li>
                <li>
                    <Button type="text" onClick={() => setMenuOpen(!menuOpen)} icon={<MenuOutlined />} />

                </li>
            </ul>

            {menuOpen && (
                <div className="menu">
                    <button onClick={() => setMenuOpen(false)} className="close-button"><CloseCircleOutlined /></button>
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

            {ServiceOpen && (
                <div className="education-panel">
                    <button onClick={handleCloseService} className="close-button"><CloseCircleOutlined /></button>
                    <div className="education-content">
                        <ul>
                            <li>
                                <button onClick={() => handleNavigateToService('/Service/valuation')}>Valuation
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToService('/Service/calculator')}>Calculator
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToService('/Service/sale')}>Sale
                                    <span className='direct-item'>
                                        <span className='direct'> <RightOutlined /></span>
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button onClick={() => handleNavigateToService('/Service/sculpture')}>Sculpture
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
            {menuContact && <div className="overlay" onClick={() => setMenuContact(false)}></div>}
        </div>
    );
};

export default memo(Header);
