import { PDFDocument, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Candidate } from "@/types";

const generateFilledPDF = async (
  candidate: Candidate,
  templateBytes: Uint8Array
) => {
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText(candidate.name, {
    x: 100, // Adjust X/Y according to where the placeholder is
    y: 500,
    size: 12,
    font,
  });

  // Continue for other fields...

  return await pdfDoc.save();
};

export const downloadPDF = async (candidate: Candidate): Promise<void> => {
  try {
    const res = await fetch("/template.pdf");
    const templateBytes = new Uint8Array(await res.arrayBuffer());

    const pdfBytes = await generateFilledPDF(candidate, templateBytes);

    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `admit_card_${candidate.name.replace(/\s+/g, "_")}.pdf`;

    // Append link to the body
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF");
  }
};
