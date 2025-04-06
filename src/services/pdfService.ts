
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Candidate } from '../types';

export const generatePDF = async (candidate: Candidate): Promise<Uint8Array> => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a new page
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Get the fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Define drawing settings
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const borderColor = rgb(0, 0, 0);
    
    // Draw main container outline
    page.drawRectangle({
      x: margin,
      y: margin,
      width: width - margin * 2,
      height: height - margin * 2,
      borderColor,
      borderWidth: 1,
    });
    
    // Draw university header section
    const headerY = height - margin - 20;
    const headerBackgroundY = height - margin - 40;
    
    // Header background (gray)
    page.drawRectangle({
      x: margin,
      y: headerBackgroundY,
      width: width - margin * 2,
      height: 40,
      color: rgb(0.9, 0.9, 0.9),
      borderColor,
      borderWidth: 1,
    });
    
    // University name
    page.drawText('Darul Huda Islamic University', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darul Huda Islamic University', 16) / 2,
      y: headerY,
      size: 16,
      font: boldFont,
    });
    
    // University address
    const uniAddress = 'Hidaya Nagar, Chemmad Tirurngadi PO, Chemmad, Kerala 676306';
    page.drawText(uniAddress, {
      x: width / 2 - font.widthOfTextAtSize(uniAddress, 10) / 2,
      y: headerY - 15,
      size: 10,
      font: font,
    });
    
    // Draw educational center section
    const centerY = headerBackgroundY - 20;
    
    // Center name
    page.drawText('Darunnoor Education Center', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darunnoor Education Center', 16) / 2,
      y: centerY,
      size: 16,
      font: boldFont,
    });
    
    // Center address
    const centerAddress = 'Kashipatna, Moodbidri(Via), Belthangady (Tq.), Dakshina Kannada (Dist.), Karnataka – 574236';
    page.drawText(centerAddress, {
      x: width / 2 - font.widthOfTextAtSize(centerAddress, 10) / 2,
      y: centerY - 15,
      size: 10,
      font: font,
    });
    
    // Website and email
    const contactInfo = 'Website: darunnooredcation.in | Gmail: dnekashipatna@gmail.com';
    page.drawText(contactInfo, {
      x: width / 2 - font.widthOfTextAtSize(contactInfo, 10) / 2,
      y: centerY - 30,
      size: 10,
      font: font,
    });
    
    // Horizontal separator line
    const centerSectionBottom = centerY - 45;
    page.drawLine({
      start: { x: margin, y: centerSectionBottom },
      end: { x: width - margin, y: centerSectionBottom },
      thickness: 1,
      color: borderColor,
    });
    
    // Admit card title section
    const titleY = centerSectionBottom - 20;
    
    // Title background (white)
    page.drawRectangle({
      x: margin,
      y: titleY - 5,
      width: width - margin * 2,
      height: 25,
      borderColor,
      borderWidth: 1,
    });
    
    // Title text
    page.drawText('Darul Huda Admission Test - Admit Card', {
      x: width / 2 - boldFont.widthOfTextAtSize('Darul Huda Admission Test - Admit Card', 14) / 2,
      y: titleY,
      size: 14,
      font: boldFont,
    });
    
    // Form and token number section
    const formSectionY = titleY - 40;
    const formColWidth = 150;
    const tokenColWidth = 150;
    const colHeight = 50;
    const headerHeight = 30;
    
    // Form number header (dark gray)
    page.drawRectangle({
      x: margin,
      y: formSectionY,
      width: formColWidth,
      height: headerHeight,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Token number header (dark gray)
    page.drawRectangle({
      x: margin + formColWidth,
      y: formSectionY,
      width: tokenColWidth,
      height: headerHeight,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    // Form number text (white)
    page.drawText('Form No.', {
      x: margin + formColWidth / 2 - boldFont.widthOfTextAtSize('Form No.', 12) / 2,
      y: formSectionY + 10,
      size: 12,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
    
    // Token number text (white)
    page.drawText('Token No.', {
      x: margin + formColWidth + tokenColWidth / 2 - boldFont.widthOfTextAtSize('Token No.', 12) / 2,
      y: formSectionY + 10,
      size: 12,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
    
    // Form number value box
    page.drawRectangle({
      x: margin,
      y: formSectionY - colHeight + headerHeight,
      width: formColWidth,
      height: colHeight - headerHeight,
      borderColor,
      borderWidth: 1,
    });
    
    // Token number value box
    page.drawRectangle({
      x: margin + formColWidth,
      y: formSectionY - colHeight + headerHeight,
      width: tokenColWidth,
      height: colHeight - headerHeight,
      borderColor,
      borderWidth: 1,
    });
    
    // Form number value
    page.drawText(candidate.formNo, {
      x: margin + formColWidth / 2 - boldFont.widthOfTextAtSize(candidate.formNo, 14) / 2,
      y: formSectionY - colHeight / 2 + 8,
      size: 14,
      font: boldFont,
    });
    
    // Token number value
    page.drawText(candidate.tokenNo, {
      x: margin + formColWidth + tokenColWidth / 2 - boldFont.widthOfTextAtSize(candidate.tokenNo, 14) / 2,
      y: formSectionY - colHeight / 2 + 8,
      size: 14,
      font: boldFont,
    });
    
    // Photo box
    const photoBoxWidth = 100;
    const photoBoxHeight = 120;
    const photoBoxX = width - margin - photoBoxWidth - 30;
    const photoBoxY = formSectionY - photoBoxHeight;
    
    page.drawRectangle({
      x: photoBoxX,
      y: photoBoxY,
      width: photoBoxWidth,
      height: photoBoxHeight,
      borderColor,
      borderWidth: 1,
    });
    
    // Photo text
    const photoText = 'Please affix';
    const photoText2 = 'your recent';
    const photoText3 = 'passport size';
    const photoText4 = 'photo';
    
    page.drawText(photoText, {
      x: photoBoxX + photoBoxWidth / 2 - font.widthOfTextAtSize(photoText, 10) / 2,
      y: photoBoxY + photoBoxHeight - 25,
      size: 10,
      font: font,
    });
    
    page.drawText(photoText2, {
      x: photoBoxX + photoBoxWidth / 2 - font.widthOfTextAtSize(photoText2, 10) / 2,
      y: photoBoxY + photoBoxHeight - 40,
      size: 10,
      font: font,
    });
    
    page.drawText(photoText3, {
      x: photoBoxX + photoBoxWidth / 2 - font.widthOfTextAtSize(photoText3, 10) / 2,
      y: photoBoxY + photoBoxHeight - 55,
      size: 10,
      font: font,
    });
    
    page.drawText(photoText4, {
      x: photoBoxX + photoBoxWidth / 2 - font.widthOfTextAtSize(photoText4, 10) / 2,
      y: photoBoxY + photoBoxHeight - 70,
      size: 10,
      font: font,
    });
    
    // Candidate details section
    const detailsStartY = formSectionY - colHeight;
    const labelX = margin + 30;
    const separatorX = labelX + 80;
    const valueX = separatorX + 20;
    const lineSpacing = 35;
    
    // Draw candidate information
    const fields = [
      { label: 'Name', value: candidate.name },
      { label: 'DOB', value: candidate.dob },
      { label: 'Contact No.', value: candidate.contactNo },
      { label: 'Place', value: candidate.place },
    ];
    
    fields.forEach((field, index) => {
      const currentY = detailsStartY - index * lineSpacing;
      
      // Label
      page.drawText(field.label, {
        x: labelX,
        y: currentY,
        size: 12,
        font: boldFont,
      });
      
      // Separator
      page.drawText(':', {
        x: separatorX,
        y: currentY,
        size: 12,
        font: boldFont,
      });
      
      // Value
      page.drawText(field.value, {
        x: valueX,
        y: currentY,
        size: 12,
        font: font,
      });
    });
    
    // Counter section
    const counterStartY = detailsStartY - fields.length * lineSpacing - 20;
    const counterWidth = (width - margin * 2) / 4;
    const counterHeight = 80;
    
    // Draw counter section border
    page.drawRectangle({
      x: margin,
      y: counterStartY - counterHeight,
      width: width - margin * 2,
      height: counterHeight,
      borderColor,
      borderWidth: 1,
    });
    
    // Draw vertical separators for counters
    for (let i = 1; i < 4; i++) {
      page.drawLine({
        start: { x: margin + i * counterWidth, y: counterStartY },
        end: { x: margin + i * counterWidth, y: counterStartY - counterHeight },
        thickness: 1,
        color: borderColor,
      });
    }
    
    // Draw counter titles
    const counterTitles = ['Counter 1', 'Counter 2', 'Counter 3', 'Written Test'];
    
    counterTitles.forEach((title, index) => {
      const titleX = margin + index * counterWidth + counterWidth / 2 - boldFont.widthOfTextAtSize(title, 12) / 2;
      page.drawText(title, {
        x: titleX,
        y: counterStartY - 20,
        size: 12,
        font: boldFont,
      });
      
      // Add exam time to Written Test column
      if (index === 3) {
        const examTime = candidate.examTime || '12.00 - 1.30 pm';
        page.drawText(examTime, {
          x: margin + index * counterWidth + counterWidth / 2 - font.widthOfTextAtSize(examTime, 12) / 2,
          y: counterStartY - 45,
          size: 12,
          font: font,
        });
      }
    });
    
    // Instructions section
    const instructionsStartY = counterStartY - counterHeight - 15;
    
    // Instructions header
    page.drawRectangle({
      x: margin,
      y: instructionsStartY - 30,
      width: width - margin * 2,
      height: 30,
      borderColor,
      borderWidth: 1,
    });
    
    page.drawText('INSTRUCTIONS', {
      x: width / 2 - boldFont.widthOfTextAtSize('INSTRUCTIONS', 14) / 2,
      y: instructionsStartY - 15,
      size: 14,
      font: boldFont,
    });
    
    // Instructions content
    const instructions = [
      '• Hall ticket shall be produced in the examination hall failing which the candidate will not be allowed to write and attend the exam.',
      '• The candidate shall carry into examination hall only (i) Blue/Black ball point pen (ii) Hall Ticket',
      '• Carrying of Calculators, Mathematical/Log Tables, Pagers, Cell Phones, any other electronic gadgets and loose of a papers into the examination hall is strictly prohibited.',
      '• The candidate shall produce the Hall Ticket at the entrance of DNEC office for any matter related with this exam.',
      '• The result will be announced on ' + (candidate.examDate || '21-04-2024') + ' Sunday',
      '• Follow all other rules of which will be announced on time.'
    ];
    
    let instructionY = instructionsStartY - 45;
    const instructionIndent = margin + 10;
    const instructionWidth = width - margin * 2 - 20;
    
    instructions.forEach(instruction => {
      const words = instruction.split(' ');
      let line = '';
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (font.widthOfTextAtSize(testLine, 10) < instructionWidth) {
          line = testLine;
        } else {
          page.drawText(line, {
            x: instructionIndent,
            y: instructionY,
            size: 10,
            font: font,
          });
          instructionY -= 15;
          line = words[i] + ' ';
        }
      }
      
      page.drawText(line, {
        x: instructionIndent,
        y: instructionY,
        size: 10,
        font: font,
      });
      
      instructionY -= 20;
    });
    
    // Signature section
    const signatureY = margin + 80;
    
    page.drawText('Seal', {
      x: margin + 70,
      y: signatureY,
      size: 12,
      font: boldFont,
    });
    
    page.drawText('Signature of Principal', {
      x: width - margin - 180,
      y: signatureY,
      size: 12,
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
