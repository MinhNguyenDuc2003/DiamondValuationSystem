import React, { useEffect, useState } from 'react'
import data from "./data/Data.json"
import './Valuation.scss'
import pic1 from './img/pic1_Valuation.jpg'
import { useNavigate } from 'react-router-dom'
const Valuation = () => {
    const [dataContent, setDataContent] = useState(null);
    const navigate = useNavigate("");
    useEffect(() => {
        setDataContent(data);
    }, []);
    if (!dataContent) {
        return (
            <div>Loading....</div>
        )
    }
    return (
        <div className='wrapperrr'>
            <div className='header-valuation'>
                <div>
                    <h9>{dataContent.ValuationIntroduction.subtle}</h9>
                </div>
                <div>
                    <h1>{dataContent.ValuationIntroduction.title}</h1>
                </div>
                </div>
                <div >
                    <button onClick={e => navigate('/Service/valuation/valuation-form')} className='btn-form'>
                        Send Form To Valuation
                    </button>
                </div>
                <div className='body-valuation'>
                    {dataContent.ValuationIntroduction.sections.map((section , index) =>{
                        switch (section.type){
                            case 'paragraph':
                                return <div className='paragraph'><p key={index}>{section.content}</p> </div>
                            case 'img':
                                return <img className='img-valuation' src={section.src === 'pic1' ? pic1 : "" } alt={section.alt}></img>
                                default:
                                    return null;
                        }
                    })}
                </div>
            


        </div>
    )
}

export default Valuation