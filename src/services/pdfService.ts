
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Candidate } from '../types';

export const generatePDF = async (candidate: Candidate): Promise<Uint8Array> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a new page
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Get the font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Define drawing settings
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    
    // Draw university header
    page.drawText('Darul Huda Islamic University', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darul Huda Islamic University', 18) / 2,
      y: height - 50,
      size: 18,
      font: boldFont,
    });
    
    // Draw address
    const address = 'Hidaya Nagar, Chemmad Tirurngadi PO, Chemmad, Kerala 676306';
    page.drawText(address, {
      x: width / 2 - font.widthOfTextAtSize(address, fontSize) / 2,
      y: height - 75,
      size: fontSize,
      font: font,
    });
    
    // Draw center info
    page.drawText('Darunnoor Education Center', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darunnoor Education Center', 16) / 2,
      y: height - 100,
      size: 16,
      font: boldFont,
    });
    
    const centerAddress = 'Kashipatna, Moodbidri(Via), Belthangady (Tq.), Dakshina Kannada (Dist.), Karnataka – 574236';
    page.drawText(centerAddress, {
      x: width / 2 - font.widthOfTextAtSize(centerAddress, fontSize) / 2,
      y: height - 125,
      size: fontSize,
      font: font,
    });
    
    const website = 'Website: darunnooredcation.in | Gmail: dnekashipatna@gmail.com';
    page.drawText(website, {
      x: width / 2 - font.widthOfTextAtSize(website, fontSize) / 2,
      y: height - 145,
      size: fontSize,
      font: font,
    });
    
    // Draw admit card title
    page.drawText('Darul Huda Admission Test - Admit Card', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darul Huda Admission Test - Admit Card', 16) / 2,
      y: height - 180,
      size: 16,
      font: boldFont,
    });
    
    // Draw horizontal line
    page.drawLine({
      start: { x: margin, y: height - 200 },
      end: { x: width - margin, y: height - 200 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Draw form and token info
    page.drawText('Form No.', {
      x: margin + 20,
      y: height - 230,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Token No.', {
      x: 300,
      y: height - 230,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(candidate.formNo, {
      x: margin + 30,
      y: height - 260,
      size: fontSize + 2,
      font: boldFont,
    });
    
    page.drawText(candidate.tokenNo, {
      x: 310,
      y: height - 260,
      size: fontSize + 2,
      font: boldFont,
    });
    
    // Draw candidate info
    const infoY = height - 310;
    const labelX = margin + 20;
    const valueX = margin + 120;
    const lineSpacing = 30;
    
    // Photo box
    page.drawRectangle({
      x: 450,
      y: infoY - 80,
      width: 100,
      height: 120,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    
    page.drawText('Please affix', {
      x: 470,
      y: infoY - 20,
      size: 10,
      font: font,
    });
    
    page.drawText('your recent', {
      x: 470,
      y: infoY - 35,
      size: 10,
      font: font,
    });
    
    page.drawText('passport size', {
      x: 470,
      y: infoY - 50,
      size: 10,
      font: font,
    });
    
    page.drawText('photo', {
      x: 485,
      y: infoY - 65,
      size: 10,
      font: font,
    });
    
    // Name
    page.drawText('Name', {
      x: labelX,
      y: infoY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(':', {
      x: labelX + 80,
      y: infoY,
      size: fontSize,
      font: font,
    });
    
    page.drawText(candidate.name, {
      x: valueX,
      y: infoY,
      size: fontSize,
      font: font,
    });
    
    // DOB
    page.drawText('DOB', {
      x: labelX,
      y: infoY - lineSpacing,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(':', {
      x: labelX + 80,
      y: infoY - lineSpacing,
      size: fontSize,
      font: font,
    });
    
    page.drawText(candidate.dob, {
      x: valueX,
      y: infoY - lineSpacing,
      size: fontSize,
      font: font,
    });
    
    // Contact No.
    page.drawText('Contact No.', {
      x: labelX,
      y: infoY - lineSpacing * 2,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(':', {
      x: labelX + 80,
      y: infoY - lineSpacing * 2,
      size: fontSize,
      font: font,
    });
    
    page.drawText(candidate.contactNo, {
      x: valueX,
      y: infoY - lineSpacing * 2,
      size: fontSize,
      font: font,
    });
    
    // Place
    page.drawText('Place', {
      x: labelX,
      y: infoY - lineSpacing * 3,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(':', {
      x: labelX + 80,
      y: infoY - lineSpacing * 3,
      size: fontSize,
      font: font,
    });
    
    page.drawText(candidate.place, {
      x: valueX,
      y: infoY - lineSpacing * 3,
      size: fontSize,
      font: font,
    });
    
    // Draw horizontal line
    page.drawLine({
      start: { x: margin, y: infoY - lineSpacing * 4 - 10 },
      end: { x: width - margin, y: infoY - lineSpacing * 4 - 10 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Draw counter info
    const counterY = infoY - lineSpacing * 4 - 40;
    
    page.drawText('Counter 1', {
      x: margin + 50,
      y: counterY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Counter 2', {
      x: 200 + 50,
      y: counterY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Counter 3', {
      x: 350 + 50,
      y: counterY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Written Test', {
      x: 450 + 30,
      y: counterY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText(candidate.examTime || '12.00 - 1.30 pm', {
      x: 450 + 20,
      y: counterY - 30,
      size: fontSize,
      font: font,
    });
    
    // Draw grid for counters
    page.drawLine({
      start: { x: margin, y: counterY + 20 },
      end: { x: width - margin, y: counterY + 20 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: margin, y: counterY - 50 },
      end: { x: width - margin, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: margin, y: counterY + 20 },
      end: { x: margin, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: 200, y: counterY + 20 },
      end: { x: 200, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: 350, y: counterY + 20 },
      end: { x: 350, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: 450, y: counterY + 20 },
      end: { x: 450, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    page.drawLine({
      start: { x: width - margin, y: counterY + 20 },
      end: { x: width - margin, y: counterY - 50 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Draw instructions section
    const instructionY = counterY - 80;
    
    page.drawText('INSTRUCTIONS', {
      x: width / 2 - boldFont.widthOfTextAtSize('INSTRUCTIONS', 14) / 2,
      y: instructionY,
      size: 14,
      font: boldFont,
    });
    
    const instructions = [
      '• Hall ticket shall be produced in the examination hall failing which the candidate will not be allowed to write and attend the exam.',
      '• The candidate shall carry into examination hall only (i) Blue/Black ball point pen (ii) Hall Ticket',
      '• Carrying of Calculators, Mathematical/Log Tables, Pagers, Cell Phones, any other electronic gadgets and loose of a papers into the examination hall is strictly prohibited.',
      '• The candidate shall produce the Hall Ticket at the entrance of DNEC office for any matter related with this exam.',
      '• The result will be announced on ' + (candidate.examDate || '21-04-2024') + ' Sunday',
      '• Follow all other rules of which will be announced on time.'
    ];
    
    let instructionLineY = instructionY - 30;
    
    instructions.forEach(instruction => {
      // Split long instructions into multiple lines if needed
      const maxWidth = width - margin * 2 - 20;
      let words = instruction.split(' ');
      let line = '';
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (font.widthOfTextAtSize(testLine, fontSize) < maxWidth) {
          line = testLine;
        } else {
          page.drawText(line, {
            x: margin + 10,
            y: instructionLineY,
            size: fontSize,
            font: font,
          });
          instructionLineY -= 20;
          line = words[i] + ' ';
        }
      }
      
      page.drawText(line, {
        x: margin + 10,
        y: instructionLineY,
        size: fontSize,
        font: font,
      });
      
      instructionLineY -= 25;
    });
    
    // Draw signature section
    const signatureY = 120;
    
    page.drawText('Seal', {
      x: 100,
      y: signatureY,
      size: fontSize,
      font: boldFont,
    });
    
    page.drawText('Signature of Principal', {
      x: 450,
      y: signatureY,
      size: fontSize,
      font: boldFont,
    });
    
    // Serialize the PDF to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPDF = async (candidate: Candidate): Promise<void> => {
  try {
    const pdfBytes = await generatePDF(candidate);
    
    // Create a blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admit_card_${candidate.name.replace(/\s+/g, '_')}.pdf`;
    
    // Append link to the body
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};
