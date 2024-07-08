// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import CertificateHTML from "./CertificateHTML";

// const PrintPDF = (certificate) => {
//   const htmlContent = CertificateHTML(certificate);

//   const printWindow = window.open("", "_blank");
//   printWindow.document.open();
//   printWindow.document.write(htmlContent);
//   printWindow.document.close();

//   printWindow.onload = () => {
//     html2canvas(printWindow.document.body).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF();
//       pdf.addImage(imgData, "PNG", 10, 10, 180, 160); // Adjust the dimensions as needed
//       pdf.save(`${certificate.id}_certificate.pdf`);
//       printWindow.close();
//     });
//   };
// };

// export default PrintPDF;

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CertificateHTML from "./CertificateHTML";

const PrintPDF = (certificate) => {
  const htmlContent = CertificateHTML(certificate);

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    html2canvas(printWindow.document.body).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4"); // Set to landscape
      const imgWidth = 297; // Width of A4 in landscape
      const pageHeight = 210; // Height of A4 in landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${certificate.id}_certificate.pdf`);
      printWindow.close();
    });
  };
};

export default PrintPDF;
