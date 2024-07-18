import React, { useEffect, useState } from "react";
import logo from "../../../image/logo.png";
import { getCustomerById } from "../../components/utils/ApiFunctions";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${month} ${year}`;
};

const ReceiptHTML = (request, services) => {
  const paymentStatus = request.paid ? "PAID" : "NOT PAID";
  const ribbonColor = request.paid ? "#66c591" : "red";

  const serviceRows = services
    .filter((service) => request.service_ids.includes(String(service.id)))
    .map(
      (service, index) => `
        <tr key="${service.id}">
          <td class="text-center">${index + 1}</td>
          <td>${service.name}</td>
          <td class="text-right">${service.content}</td>
          <td class="text-right">$${service.money.toFixed(2)}</td>
        </tr>
    `
    )
    .join("");

  return `
    <html lang="en">
      <head>
        <meta charset="utf-8" />

        <title>Invoice with ribbon - Bootdey.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <style type="text/css">
          body {
            margin-top: 20px;
            background: #eee;
          }
          
          .container {
            width: 100%;
          }

          .panel {
            margin: 0;
          }

          /*Invoice*/

          .invoice .top-left {
            font-size: 65px;
            color: #3ba0ff;
          }

          .invoice .top-right {
            text-align: right;
            padding-right: 20px;
          }

          .invoice .table-row {
            margin-left: -15px;
            margin-right: -15px;
            margin-top: 25px;
          }

          .invoice .payment-info {
            font-weight: 500;
          }

          .invoice .table-row .table > thead {
            border-top: 1px solid #ddd;
          }

          .invoice .table-row .table > thead > tr > th {
            border-bottom: none;
          }

          .invoice .table > tbody > tr > td {
            padding: 8px 20px;
          }

          .invoice .invoice-total {
            margin-right: -10px;
            font-size: 16px;
          }

          .invoice .last-row {
            border-bottom: 1px solid #ddd;
          }

          .invoice-ribbon {
            width: 85px;
            height: 88px;
            overflow: hidden;
            position: absolute;
            top: -1px;
            right: 14px;
          }

          .ribbon-inner {
            text-align: center;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            position: relative;
            padding: 7px 0;
            left: -5px;
            top: 11px;
            width: 120px;
            background-color: ${ribbonColor};
            font-size: 15px;
            color: #fff;
          }

          .ribbon-inner:before,
          .ribbon-inner:after {
            content: "";
            position: absolute;
          }

          .ribbon-inner:before {
            left: 0;
          }

          .ribbon-inner:after {
            right: 0;
          }

          .row img {
            width: 200px;
          }
        </style>
      </head>
      <body>
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <div class="container bootstrap snippets bootdeys">
          <div class="row">
            <div class="col-sm-12">
              <div class="panel panel-default invoice" id="invoice">
                <div class="panel-body">
                  <div class="invoice-ribbon">
                    <div class="ribbon-inner">${paymentStatus}</div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6 top-left">
                      <img src=${logo} alt="LogoShine">
                    </div>
                    <div class="col-sm-6 top-right">
                      <h3 class="marginright">INVOICE-${request.id}</h3>
                      <span class="marginright">${formatDate(new Date())}</span>
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-xs-4 from">
                      <p class="lead marginbottom">Customer Information</p>
                      <p>Name: ${request.customer_name}</p>
                      <p>Phone: ${request.customer_phone}</p>
                      <p>
                        Email:
                        <a
                          href="mailto:${request.customer_email}"
                          >${request.customer_email}</a
                        >
                      </p>
                    </div>
                    <div class="col-xs-4 to">
                      <p class="lead marginbottom">Appointment</p>
                      <p>Date: ${request.appoinment_date}</p>
                      <p>Time: ${request.slot}</p>
                      <p>Service: ${request.service_names}</p>
                    </div>
                    <div class="col-xs-4 text-right payment-details">
                      <p class="lead marginbottom payment-info">Payment details</p>
                      <p>Date: ${formatDate(new Date())}</p>
                      <p>Total Amount: $${request.total.toFixed(2)}</p>
                      <p>Account Name: ${request.customer_name}</p>
                    </div>
                  </div>
                  <div class="row table-row">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th class="text-center" style="width: 10%">#</th>
                          <th style="width: 50%">Service</th>
                          <th class="text-right" style="width: 20%">Content</th>
                          <th class="text-right" style="width: 20%">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${serviceRows}
                      </tbody>
                    </table>
                  </div>
                  <div class="row">
                    <div class="col-xs-6 margintop">
                      <p class="lead marginbottom">THANK YOU!</p>
                    </div>
                    <div class="col-xs-6 text-right pull-right invoice-total">
                      <p>Total : $${request.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <script
          data-cfasync="false"
          src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"
        ></script>
        <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
        <script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script type="text/javascript"></script>
      </body>
    </html>
      `;
};

export default ReceiptHTML;
