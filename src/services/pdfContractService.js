import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateContractAuditReportPDF(logs) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Contract Activity Audit Report", 14, 22);

  const tableColumn = ["Date & Time", "User", "Action"];
  const tableRows = [];

  logs.forEach((log) => {
    const logData = [
      new Date(log.created_at).toLocaleString(),
      log.user?.name || "Unknown",
      log.action,
    ];
    tableRows.push(logData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [24, 68, 100] },
  });

  doc.save("contract-audit-report.pdf");
}