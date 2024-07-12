import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReceiptHTML from "./ReceiptHTML";

const PrintPDF = (request, services) => {
  const htmlContent = ReceiptHTML(request, services);

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    html2canvas(printWindow.document.body, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4"); // Set to portrait
      const imgWidth = 297; // Width of A4 in portrait
      const pageHeight = 210; // Height of A4 in portrait
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

      pdf.save(`Receipt.pdf`);
      //   printWindow.close();
    });
  };
};

export default PrintPDF;
