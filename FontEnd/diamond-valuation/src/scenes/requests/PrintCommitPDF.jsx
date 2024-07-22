import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../image/logo.png";

const ReturnHTML = () => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
      <style>
          .container {
              width: 50%;
              height: 100%;
              margin: auto;
              padding: 2%;
              border: 1px solid #333333;
              box-sizing: border-box;
              color: #222222;
          }
  
          .header {
              box-sizing: border-box;
  
              .title-seal {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
  
                  img {
                      width: 30%;
                      flex: 0.2;
                  }
  
              }
  
              .date {
                  margin: 20px;
                  display: block;
                  text-align: right;
              }
  
              h1 {
                  text-align: center;
                  width: 70%;
                  margin: auto;
              }
  
          }
  
  
          .info-user {
              max-width: 50em;
              padding: 0;
              overflow-x: hidden;
              list-style: none;
              line-height: 28px;
  
              div {
                  text-align: justify;
              }
  
              li::before {
                  float: left;
                  width: 0;
                  white-space: nowrap;
                  content:
                      ". . . . . . . . . . . . . . . . . . . . "
                      ". . . . . . . . . . . . . . . . . . . . "
                      ". . . . . . . . . . . . . . . . . . . . "
                      ". . . . . . . . . . . . . . . . . . . . ";
              }
  
              .element {
                  padding-right: 0.33em;
                  background: white;
              }
  
              .value {
                  margin-left: 3em;
                  background-color: white;
                  font-weight: bold;
              }
          }
  
          .info-commit {
              padding: 0;
              list-style-type: none;
          }
  
          .commit-content-1 {
              margin: 5px auto 10px;
          }
  
  
          .commit-content-2 {
              list-style-type: decimal;
              padding-left: 30px;
              text-align: justify;
  
              li {
                  padding-bottom: 5px;
              }
          }
  
          .info-diamond {
              margin: 0px auto 20px;
              width: 100%;
              height: 100%;
              border-collapse: collapse;
  
              td {
                  border: 1px solid #333333;
                  text-align: left;
                  padding: 2px;
              }
          }
  
  
          .footer {
  
              display: flex;
              width: 100%;
              height: 200px;
              justify-content: space-around;
              align-items: baseline;
              text-align: center;
  
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <section class="header">
              <div class="title-seal">
                  <img src="${logo}" alt="Shine logo">
                  <b>Policy Enforcement Notice</b>
              </div>
              <div class="date">
                  <i>Date: <span>. . . . / . . . . / . . . .</span></i>
              </div>
              <h1>COMMITMENT LETTER FOR RECEIVING VALUATION SAMPLE</h1>
          </section>
          <section class="body">
              <div>
                  <div class="info">
                      <ul class="info-user">
                          <li><span class="element">Full name: </span></li>
                          <li><span class="element">Email: </span></li>
                          <li><span class="element">Contact number: </span></li>
                      </ul>
                      <ul class="info-commit">
                          <li>
                              <b>Commitment:</b>
                              <p class="commit-content-1">
                                  I commit that I have lost the valuation receipt
                                  issued by Shine for my valuation sample.
                              </p>
                          </li>
                          <li>
                              <p>
                                  <b class="commit-title-2">I commit that:</b>
                              </p>
                              <ul class="commit-content-2">
                                  <li>
                                      Lost Receipt: I have lost the valuation receipt and do not retain any copies of this
                                      receipt.
                                  </li>
                                  <li>
                                      Accurate Information: The information provided above is accurate and complete.
                                  </li>
                                  <li>
                                      No Claims: I will not file any claims or request any compensation related to the
                                      loss of this valuation receipt.
                                  </li>
                                  <li>
                                      Receiving Valuation Sample: I agree to receive my valuation sample from Shine
                                      without the valuation receipt.
                                  </li>
                                  <li>
                                      Legal Responsibility: I understand that the loss of the valuation receipt is my
                                      fault
                                      and I will bear legal responsibility for any consequences arising from the loss of
                                      this receipt.
                                  </li>
                              </ul>
                          </li>
                      </ul>
                      <div>
                          <b>I commit to complying with the above terms and sign below to confirm.</b>
                      </div>
                  </div>
              </div>
          </section>
          <section class="footer">
              <div class="stamp">
                  <h3>Customer Signature</h3>
  
              </div>
              <div class="signature">
                  <h3>Shine's Confirmation</h3>
  
              </div>
          </section>
      </div>
  </body>
  
  </html>`;
};

const PrintReturnPDF = () => {
  const htmlContent = ReturnHTML();

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  //   printWindow.onload = () => {
  //     html2canvas(printWindow.document.body, { scale: 1 }).then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jsPDF("portrait", "mm", "a4"); // Set to portrait
  //       const imgWidth = 210; // Width of A4 in portrait
  //       const pageHeight = 297; // Height of A4 in portrait
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       let heightLeft = imgHeight;
  //       let position = 0;

  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       pdf.save(`ReturnCommit.pdf`);
  //       //   printWindow.close();
  //     });
  //   };
};

export default PrintReturnPDF;
