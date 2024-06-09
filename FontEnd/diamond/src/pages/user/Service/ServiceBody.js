
import './Service.scss'
import React, { useState } from 'react';
import {
  Button,
  message,
  Form,
  Input,
  DatePicker,
} from 'antd';
import emailjs from 'emailjs-com';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};


const ServiceBody = () => {


  const onFinish = (values) => {

    console.log('Success:', values);
    message.success('Form submitted successfully!', 3);
    sendEmail(values);
  };

  const sendEmail = (formData) => {
    const templateParams = {
      fullName: formData.Name,
      email: formData.Email,
      phoneNumber: formData.Phone,
      address: formData.Address,
      description: formData.Description,
      date: formData.Date,
      notes: formData.Notes,
    };
  
    emailjs.send(
      'Valuation Service', // EmailJS service ID
      'template_lcvz7zi', // EmailJS template ID
      templateParams, // Truyền templateParams trực tiếp
      'bsF8xgo_v-vgVEVJO' // EmailJS user ID
    )
    .then((response) => {
      console.log('Email successfully sent!', response.status, response.text);
      message.success('Form submitted successfully!', 3); // Hiển thị thông báo thành công trong 3 giây
    })
    .catch((err) => {
      console.error('There has been an error. Here some thoughts on the error that occurred:', err);
    });
  }
  return (
    <div className='wrapperrr'>
      <div className="body-content">

      
        <Form className='from-valuation'
        
          {...formItemLayout}
          variant="filled"
          onFinish={onFinish}
          style={{
            maxWidth: 1000,
          }}
        >
          <Form.Item
            label="Full Name"
            name="Name"
            rules={[
              {
                required: true,
                message: 'Please input Your Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="Email"
            rules={[
              {
                required: true,
                message: 'Please input Your Email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="Phone"
            rules={[
              {
                required: true,
                message: 'Please input Your Phone Number!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="Address"
            rules={[
              {
                required: true,
                message: 'Please input Your Address!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Diamond Description"
            name="Description"
            rules={[
              {
                required: true,
                message: 'Please input Diamond Description!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            label="Preferred Appraisal Date"
            name="Date"
            rules={[
              {
                required: true,
                message: 'Please input Preferred Appraisal Date!',
              },
            ]}
          >
             <DatePicker className='date-picker' />
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="Notes"
            rules={[
              {
                required: true,
                message: 'Please input Additional Notes!',
              },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  )
}

export default ServiceBody
