import React from 'react'
import successIcon from './successsss.jpg'
import { Link, Typography } from '@mui/material'
const Success = () => {
  return (
    <div style={{marginBottom : '12%'}} className='wrapperrr'>
        <img style={{width : '10%'}} src={successIcon}/>
        <Typography>Payment Success. Thanks for use Service</Typography>
        <Link href="/">Back to HomePage</Link>
        </div>
  )
}
export default Success