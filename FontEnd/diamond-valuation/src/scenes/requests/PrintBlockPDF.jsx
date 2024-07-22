import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../image/logo.png";
import StampShine from "../../../image/StampShine.png";

const BlockHTML = () => {
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        .container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            width: 50%;
            height: 100%;
            margin: auto;
            padding: 2%;
            border: 1px solid #333333;
            box-sizing: border-box;
        }

        .header {
            flex: 0.2;
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
                background: white
            }

            .value {
                margin-left: 3em;
                background-color: white;
            }
        }


        .info-diamond {
            margin: 10px auto 20px;
            width: 100%;
            height: 100%;
            border-collapse: collapse;

            th,
            td {
                border: 1px solid #333333;
                text-align: left;
                padding: 2px;
            }
        }

        .body {
            flex: 0.6;
        }

        .content {
            margin: 10px auto;
        }

        .note ul {
            margin: 5px auto;
        }

        .footer {
            flex: 0.2;
            display: flex;
            justify-content: space-around;
            align-items: baseline;
            text-align: center;

            img {
                width: 100%;
                height: 160px;
                object-fit: contain;
            }
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
            <h1>DIAMOND SEALING RECORD</h1>
        </section>
        <section class="body">
            <div>
                <div class="info">
                    <ul class="info-user">
                        <li><b class="element">Name: </b></li>
                        <li><b class="element">Email: </b></li>
                        <li><b class="element">Contact number: </b></li>
                    </ul>
                </div>
                <div class="content">
                    <p>
                        <b>Reason for sealing: </b>
                    </p>
                    <div style="text-indent: 30px; text-align: justify;">
                        This diamond is being sealed because the customer,
                        <span>. . . . . . . . . . . . . . . . . .</span>, has not been contactable for the past 7 days.
                        The last successful contact with <span>. . . . . . . . . . . . . . . . . . . .</span>
                        was on <span>. . . . / . . . .</span> Since then, multiple attempts have been made to reach
                        <span>. . . . . . . . . . . . . .</span>
                        via phone, email, and physical mail,
                        but no response has been received.
                        These attempts include three phone calls,
                        three emails, and one registered letter.
                    </div>
                </div>
                <div class="content">
                    <b>Sealing Process: </b>
                    <span>
                        The diamond has been carefully placed in a tamper-evident bag,
                        which has been signed and dated by the sealing officer.
                        The sealed bag has been stored in the company’s secure vault to
                        ensure its safety and integrity until further notice.
                    </span>
                </div>
                <div class="content">
                    <b>Remarks:</b>
                    <span>
                        The diamond will remain sealed until the customer responds.
                        If there is no response from the customer within an
                        additional 30 days, further action will be taken in
                        accordance with company policy, which may include
                        reporting the situation to relevant authorities and
                        potentially auctioning the diamond to recover costs.
                    </span>
                </div>
            </div>
            <div class="note">
                <b><i>Note:</i></b>
                <ul>
                    <li>
                        <b>No Third-Party Collection: </b>
                        <span>
                            The customer cannot authorize another person
                            to collect the diamond on their behalf under
                            any circumstances.
                        </span>
                    </li>
                    <li>
                        <b>In-Person Retrieval Only: </b>
                        <span>
                            The customer must collect the diamond in person,
                            providing valid government-issued identification.
                        </span>
                    </li>
                    <li>
                        <b>Legal Consequences: </b>
                        <span>
                            Failure to comply with these conditions may result
                            in legal action, including but not limited to the
                            forfeiture of the diamond and recovery of any associated costs.
                        </span>
                    </li>
                </ul>
            </div>
        </section>
        <section class="footer">
            <div class="stamp">
                <h3>SHINE Company</h3>
                <img src="${StampShine}" alt="Shine stamp">
            </div>
            <div class="signature">
                <h3>Signature</h3>
            </div>
        </section>
    </div>
</body>

</html>`;
};

const PrintBlockPDF = () => {
  const htmlContent = BlockHTML();

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // printWindow.onload = () => {
  //   html2canvas(printWindow.document.body, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("portrait", "mm", "a4"); // Set to portrait
  //     const imgWidth = 297; // Width of A4 in portrait
  //     const pageHeight = 210; // Height of A4 in portrait
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;
  //     let position = 0;

  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save(`Receipt.pdf`);
  //     //   printWindow.close();
  //   });
  // };
};

export default PrintBlockPDF;
