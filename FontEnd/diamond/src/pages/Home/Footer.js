import { memo, useState } from "react"
import { Input, Col, Row } from 'antd';
import { CloseCircleOutlined, FacebookOutlined, GoogleOutlined, PhoneOutlined ,WhatsAppOutlined ,EnvironmentOutlined } from '@ant-design/icons';
import './Footer.scss'
const Footer = () => {
    const [menuContact , setMenuContact] = useState(false);
    const hanlde_Contact_Click = () => {
        setMenuContact(!menuContact)
    }
    const hanlde_Question_Click = () => {

    }
    const hanlde_Map_Click = () => {

    }
    const hanlde_Blog_Click = () => {

    }
    const hanlde_Education_Click = () => {

    }
    const hanlde_About_Click = () => {

    }
    const hanlde_Valuation_Click = () => {

    }
    const hanlde_History_Click = () => {

    }
    const hanlde_Diamond_Click = () => {

    }

    const hanlde_Submit_Email = () => {

    }

    const hanlde_Facebook_Click = () => {

    }
    const hanlde_Google_Click = () => {

    }
    return (
        <>
            <div className="wrapper">
                <div className={`wrapper-content ${menuContact ? 'menu-contact' : ''} `}>
                    <Row>

                        <Col span={6} className="footer_col_1">
                            <h4 className="footer_heading">May We Help You</h4>
                            <ul className="footer_list">
                                <li><button onClick={hanlde_Contact_Click} className="footer_link">Contact Us</button> </li>
                                <li><button onClick={hanlde_Question_Click} className="footer_link">Q&A</button></li>
                                <li><button onClick={hanlde_Map_Click} className="footer_link">Site Map</button></li>
                                <li><button onClick={hanlde_Blog_Click} className="footer_link">Blog</button></li>
                                <li><button onClick={hanlde_Education_Click} className="footer_link">Educaiton</button></li>
                            </ul>


                        </Col>

                        <Col span={6} className="footer_col_2">
                            <h4 className="footer_heading">The Company</h4>
                            <ul className="footer_list">
                                <li><button onClick={hanlde_About_Click} className="footer_link">About Us</button> </li>
                                <li><button onClick={hanlde_Valuation_Click} className="footer_link">Valuation</button></li>
                                <li><button onClick={hanlde_History_Click} className="footer_link">History</button></li>
                                <li><button onClick={hanlde_Diamond_Click} className="footer_link">Diamonds</button></li>
                            </ul>
                        </Col>

                        <Col span={6} className="footer_col_3">
                            <h4 className="footer_heading">Send Email For Us</h4>
                            <div className="footer_form">

                                <Input className="input_search" placeholder="Enter Email" />
                                <button className="btn_submit" onClick={hanlde_Submit_Email}>
                                    SUBMIT
                                </button>
                            </div>
                        </Col>
                        <Col span={6} className="footer_col_4">
                            <h4 className="footer_heading">Social Networks</h4>
                            <div className="footer_social">
                                <ul className="social-button">
                                    <li> <button onClick={hanlde_Facebook_Click} className="facebook_Login" > <FacebookOutlined /></button></li>

                                    <li> <button onClick={hanlde_Google_Click} className="google_Login"> < GoogleOutlined /></button></li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
                {menuContact && (
                    <div className="wrapper-menu">
                        <button onClick={hanlde_Contact_Click} className="close-button"><CloseCircleOutlined/></button>
                        <div className="menu-content">
                            <h2>CONTACT US </h2>
                            <div className="col">
                                <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <PhoneOutlined />
                                <span>CALL US 099999999</span>
                                </a>
                                <p>
                                Our Client Services are available daily, between 10 AM to 10 PM (GMT+8).
                                </p>
                            </div>
                            <div className="col">
                                <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <WhatsAppOutlined />
                                <span>WHATSAPP US</span>
                                </a>
                                <p>
                                Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).
                                </p>
                            </div>
                            <div className="col">
                                <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <FacebookOutlined />
                                <span>facebook Us</span>
                                </a>
                                <p>
                                Our Client Services are available to answer your WhatsApp messages at +65-3138-2024 daily between 10 AM to 10 PM (GMT+8).
                                </p>
                            </div>
                            <div className="col">
                                <a href="https://www.facebook.com/profile.php?id=100012156048080">
                                <EnvironmentOutlined />
                                <span>Address US</span>
                                </a>
                                <p>
                                Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {menuContact&& <div className="overlay" onClick={hanlde_Contact_Click}> </div>}
            </div>
        </>
    );

};

export default memo(Footer);