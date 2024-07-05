import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
const PaymentFail = () => {
    const navigate = useNavigate();
    const handelHomePage = () => {
        navigate("/");
    }

    const handleService = () => {
        navigate("/Service/valuation/valuation-form");
    }

  return (
    <div className="wrapperrrrr">
            <>
              <h1>Your payment fail!</h1>
              <div>
                <>
                    <Button onClick={handelHomePage} variant="contained" color="primary" >
                        GO TO HOME PAGE
                    </Button>
                </>
              </div>
              <div>
                <>
                    <Button onClick={handleService} variant="contained" color="primary" >
                        BACK TO SERVICE FORM
                    </Button>
                </>
              </div>
            </>
        </div>
  )
}

export default PaymentFail