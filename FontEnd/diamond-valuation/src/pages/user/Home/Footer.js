import { memo } from "react"
import { Input, Col, Row } from 'antd';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import './Footer.scss'
const Footer = () => {
    const hanlde_Contact_Click = () => {

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
                <div className="wrapper-content">
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
            </div>
        </>
    );

};

export default memo(Footer);