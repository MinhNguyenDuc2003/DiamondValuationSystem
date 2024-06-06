import { memo, useState } from "react";
import SliderComponent from "../../../component/SliderComponent/SliderComponent";
import DiamondAppraisal from './image/icon1.jpg'
import JewelryAppraisal from './image/icon2.jpg'
import Certification from './image/icon3.jpg'
import Consultation from './image/icon4.jpg'
import './HomePage.scss';
import banner from './image/bannerHome.jpg'
import { Col, InputNumber, Row, Slider, Space } from "antd";

const HomePage = () => {

    const [inputValue, setInputValue] = useState(0.3);
    const onChange = (value) => {
        if (isNaN(value)) {
            return;
        }
        setInputValue(value);

    };
    const [selectedShape, setSelectedShape] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedClarity, setSelectedClarity] = useState('');

    const handleShapeSelected = (shape) => {
        setSelectedShape(shape)
    };

    const handleColorSelected = (color) => {
        setSelectedColor(color)
    };

    const handleClaritySelected = (clarity) => {
        setSelectedClarity(clarity)
    };
    return (

        <div className="home-page">
            <SliderComponent />
            <div className="body-content">
                <div className="wrapper-text">
                    <h1>
                        Company History
                    </h1>
                    <p>
                        Founded in 2005, Shine has grown to become a premier diamond appraisal company, renowned for its expertise and commitment to excellence. Initially established as a small family business in New York City by John Doe, a diamond expert with over 30 years of industry experience, Shine has expanded significantly over the years. John’s passion for diamonds and his vision to provide accurate, reliable appraisals set the foundation for the company's success.
                    </p>
                    <p>
                        At Shine, we pride ourselves on our team of highly qualified diamond appraisers who hold advanced certifications from leading gemological institutes, including the Gemological Institute of America (GIA) and the International Gemological Institute (IGI). Our experts undergo rigorous training and continuous education to stay abreast of the latest advancements and trends in the diamond industry.
                    </p>
                </div>

                <div className="wrapper-banner">
                    <img src={banner} alt="banner1"></img>
                </div>
            </div>
            <div className="body-content-3">
                <h1>
                    Our Vision for the Future
                </h1>
                <p>
                    Looking ahead, Shine aims to continue leading the diamond appraisal industry by embracing innovation and expanding our global reach. We are committed to maintaining the highest standards of integrity and expertise, ensuring our clients receive the best possible service.
                </p>
                <p>
                    For more information about our services or to schedule an appraisal, please visit our website or contact our customer service team. At Shine, we are here to help you discover the true value of your diamonds.
                </p>
            </div>
            <div className="body-content-2">
                <Row className="wrapper-content-icon">
                    <Col className="col" span={6}>
                        <div className="custom-block">
                            <div className="wrapper-icon">
                                <img src={DiamondAppraisal} alt="icon1"></img>
                            </div>
                            < h1 >
                                Diamond Appraisal
                            </ h1 >
                            <p>
                                Detailed and accurate assessments of diamond value, considering factors such as carat weight, color, clarity, and cut.
                            </p>
                        </div>
                    </Col>
                    <Col className="col" span={6}>
                        <div className="custom-block">
                            <div className="wrapper-icon">
                                <img src={JewelryAppraisal} alt="icon2"></img>
                            </div>
                            < h1 >
                                Jewelry Appraisal
                            </ h1 >
                            <p>
                                Appraisals for diamond jewelry, ensuring each piece is evaluated with precision and expertise.

                            </p>
                        </div>
                    </Col>
                    <Col className="col" span={6}>
                        <div className="custom-block">
                            <div className="wrapper-icon">
                                <img src={Certification} alt="icon3"></img>
                            </div>
                            < h1 >
                                Certification
                            </ h1 >
                            <p>
                                Providing certified reports that are recognized globally, enhancing the value and authenticity of your diamonds.
                            </p>
                        </div>
                    </Col>
                    <Col className="col" span={6}>
                        <div className="custom-block">
                            <div className="wrapper-icon">
                                <img src={Consultation} alt="icon4"></img>
                            </div>
                            < h1 >
                                Consultation
                            </ h1 >
                            <p>
                                Expert advice on diamond investments, purchases, and sales, tailored to meet individual client needs.
                            </p>
                        </div>
                    </Col>
                </Row>

            </div>

            <div className="body-content-4">
                <Row className="wrapper-content-calculator">
                    <Col className="wrapper-input" span={8}>
                        <h2>Calculator Input</h2>
                        <div className="wrapper-input-content">

                            <p>SHAPE</p>
                            <div className="input-col-2">
                                <div className={selectedShape === 'Round' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Round')}>Round</button>
                                </div>
                                <div className={selectedShape === 'Cushion' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Cushion')}>Cushion</button>
                                </div>
                                <div className={selectedShape === 'Emerald' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Emerald')}>Emerald</button>
                                </div>
                                <div className={selectedShape === 'Oval' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Oval')}>Oval</button>
                                </div>
                                <div className={selectedShape === 'Princess' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Princess')}>Princess</button>
                                </div>
                                <div className={selectedShape === 'Pear' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Pear')}>Pear</button>
                                </div>
                                <div className={selectedShape === 'Radiant' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Radiant')}>Radiant</button>
                                </div>
                                <div className={selectedShape === 'Asscher' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Asscher')}>Asscher</button>
                                </div>
                                <div className={selectedShape === 'Marquise' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Marquise')}>Marquise</button>
                                </div>
                                <div className={selectedShape === 'Heart' ? 'selected' : ''}>
                                    <button onClick={() => handleShapeSelected('Heart')}>Heart</button>
                                </div>
                                {console.log(selectedShape)}
                            </div>
                            <p>CARAT</p>
                            <div className="input-col-3">

                                <Space
                                    style={{
                                        width: '100%',
                                    }}
                                    direction="vertical"
                                >
                                    <Row>
                                        <Col span={12}>
                                            <Slider
                                                min={0.3}
                                                max={5}
                                                onChange={onChange}
                                                value={typeof inputValue === 'number' ? inputValue : 0}
                                                step={0.01}
                                            />
                                        </Col>
                                        <Col span={4}>
                                            <InputNumber
                                                min={0.3}
                                                max={5}
                                                style={{
                                                    margin: '0 16px',
                                                }}
                                                step={0.01}
                                                value={inputValue}
                                                onChange={onChange}
                                            />
                                        </Col>
                                    </Row>
                                </Space>
                            </div>
                            <p>COLOR</p>
                            <div className="input-col-4">
                                <div className={selectedColor === 'k' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('K')}>K</button>
                                </div>

                                <div className={selectedColor === 'J' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('J')}>J</button>
                                </div>
                                <div className={selectedColor === 'I' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('I')}>I</button>
                                </div>
                                <div className={selectedColor === 'H' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('H')}>H</button>
                                </div>
                                <div className={selectedColor === 'G' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('G')}>G</button>
                                </div>
                                <div className={selectedColor === 'F' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('F')}>F</button>
                                </div>
                                <div className={selectedColor === 'E' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('E')}>E</button>
                                </div>
                                <div className={selectedColor === 'D' ? 'selected' : ''}>
                                    <button onClick={() => handleColorSelected('D')}>D</button>
                                </div>
                            </div>
                            <p>CLARITY</p>
                            <div className="input-col-5">
                                <div className={selectedClarity === 'SI2' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('SI2')}>SI2</button>
                                </div>
                                <div className={selectedClarity === 'SI1' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('SI1')}>SI1</button>
                                </div>
                                <div className={selectedClarity === 'VS2' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('VS2')}>VS2</button>
                                </div>
                                <div className={selectedClarity === 'VS1' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('VS1')}>VS1</button>
                                </div>
                                <div className={selectedClarity === 'VVS2' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('VVS2')}>VVS2</button>
                                </div>
                                <div className={selectedClarity === 'VVS1' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('VVS1')}>VVS1</button>
                                </div>
                                <div className={selectedClarity === 'IF' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('IF')}>IF</button>
                                </div>
                                <div className={selectedClarity === 'FL' ? 'selected' : ''}>
                                    <button onClick={() => handleClaritySelected('FL')}>FL</button>
                                </div>
                            </div>
                            <div className="input-col-6">
                                <button>Submit</button>
                            </div>
                        </div>
                    </Col>
                    <Col className="wrapper-output" span={9}>
                        <h2>Calculator Output</h2>
                        <div className="wrapper-output-content">
                            <div className="result-output-1">
                                <div className="toolTip-1">
                                    <p>Fair Price Estimate</p>
                                </div>
                                <div className="total-price" >
                                    <p>$1,125</p>
                                </div>
                                <div className="output-value-selected">
                                    <p>
                                        {selectedShape}  {inputValue} Carat {selectedColor} {selectedClarity}

                                    </p>


                                </div>

                            </div>
                            <div className="result-output-2">
                                <div className="wrapper-block">
                                    <div className="toolTip">
                                        <p> Estimate Range </p>
                                    </div>
                                    <div className="price-flex">
                                        <p> $1,035 - $1,224 </p>
                                    </div>
                                </div  >
                                <div className="wrapper-block">
                                    <div className="toolTip">
                                        <p> Last 30 Day Change </p>
                                    </div>
                                    <div className="price-flex">
                                        <p> -7.60% </p>
                                    </div>
                                </div>
                                <div className="wrapper-block">
                                    <div className="toolTip">
                                        <p>Estimate Price per Carat</p>
                                    </div>
                                    <div className="price-flex">
                                        <p> $3,750</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default memo(HomePage);
