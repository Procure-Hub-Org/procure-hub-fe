import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateContractAuditReportPDF(contractDetails, logs) {
  const doc = new jsPDF();

  // Naslov
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor("#184464");
  doc.text("Contract Activity Audit Report", 14, 25);

  // Datum generisanja izvještaja
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.setTextColor("#555555");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

  // Prikaz osnovnih detalja o ugovoru
  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.setFont("times", "bold");
  doc.text("Contract Details:", 14, 45);

  doc.setFont("times", "normal");
  const startY = 52;
  const lineHeight = 7;
  let currentY = startY;

  function printKeyValue(key, value, y, xKey = 14, xValue = 70) {
    doc.text(`${key}:`, xKey, y);
    doc.text(String(value || "N/A"), xValue, y);
  }

  printKeyValue("Request", contractDetails.procurement_request_title, currentY);
  printKeyValue("Category", contractDetails.procurement_category, currentY += lineHeight);
  printKeyValue(
    "Buyer",
    `${contractDetails.buyer_name} (${contractDetails.buyer_company_name})`,
    currentY += lineHeight
  );
  printKeyValue(
    "Seller",
    `${contractDetails.seller_name} (${contractDetails.seller_company_name})`,
    currentY += lineHeight
  );
  printKeyValue("Price", `${contractDetails.price} KM`, currentY += lineHeight);
  printKeyValue("Status", contractDetails.status, currentY += lineHeight);
  printKeyValue("Award Date", new Date(contractDetails.award_date).toLocaleString(), currentY += lineHeight);
  printKeyValue("Disputes", contractDetails.number_of_disputes, currentY += lineHeight);

  // Priprema tabele
  const tableColumn = ["Date & Time", "User", "Action"];
  const tableRows = [];

  logs.forEach((log) => {
    const userName = log.user ? `${log.user.first_name} ${log.user.last_name}` : "Unknown";
    const logData = [
      new Date(log.created_at).toLocaleString(),
      userName || "Unknown",
      log.action,
    ];
    tableRows.push(logData);
  });

  const tableStartY = currentY + 15;

  autoTable(doc, {
    startY: tableStartY,
    head: [tableColumn],
    body: tableRows,
    styles: {
      fontSize: 12,
      cellPadding: 6,
      valign: "middle",
      halign: "left",
      font: "times",
    },
    headStyles: {
      fillColor: "#184464",
      textColor: "#ffffff",
      fontStyle: "bold",
      fontSize: 13,
      font: "times",
    },
    alternateRowStyles: {
      fillColor: "#f6f9fc",
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setTextColor("#999999");
      doc.setFont("times", "normal");
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save("contract-audit-report.pdf");
}