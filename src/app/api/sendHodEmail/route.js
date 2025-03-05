import nodemailer from 'nodemailer';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const {
      studentName,
      studentRegNo,
      studentEmail,
      academicYear,
      reason,
      fatherName
    } = await req.json();

    // Canvas dimensions (A4 size ratio)
    const width = 1200;
    const height = 1600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load images (College Logo & Founder Image)
    const logo = await loadImage('https://psnacet.edu.in/img-1/logo-clr.png');
    const founderImage = await loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRw1cQVTCVyBqY0d5c3OITBi82aKDDn6WWHxuVBfMk20GMt0U6SGcqWEfZJdEgaZfG2Nw&usqp=CAU');

    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // **Green Line (Top-left to center)**
    ctx.fillStyle = '#16A34A'; // Green color
    ctx.fillRect(0, 5, width / 2, 20); // Starts 5px from top, spans left to center

    // **Header (Logo & Founder Image)**
    ctx.drawImage(logo, 30, 30, 150, 150); // Logo at top-left
    ctx.drawImage(founderImage, width - 180, 30, 150, 180); // Founder Image at top-right

    // **College Name**
    ctx.fillStyle = '#003366';
    ctx.font = 'bold 54px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('PSNA College of Engineering and Technology', width / 2, 300);

    // **Certificate Title**
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Times New Roman';
    ctx.fillText('Bonafide Certificate', width / 2, 400);

    // **Subtitle**
    ctx.font = 'italic 32px Times New Roman';
    ctx.fillText('To Whomsoever It May Concern', width / 2, 470);

    // **Certificate Content (Center-Aligned)**
    ctx.fillStyle = '#222222';
    ctx.font = '28px Times New Roman';
    ctx.textAlign = 'center';

    const content = `
      This is to certify that Mr./Ms. ${studentName} (Reg No: ${studentRegNo}),
      S/o or D/o of ${fatherName}, is a student of our institution,
      currently enrolled in the BE. Computer Science Engineering
      during the academic year ${academicYear}.
    `;

    const lines = content.split('\n');
    let yPosition = 600;
    lines.forEach((line) => {
      ctx.fillText(line.trim(), width / 2, yPosition);
      yPosition += 60;
    });

    // **Reason for Certificate**
    ctx.font = '28px Times New Roman';
    ctx.fillText(`This Certificate is issued for the purpose of: ${reason}`, width / 2, yPosition + 50);

    // **Signature & Footer**
    ctx.font = 'bold 32px Times New Roman';
    ctx.textAlign = 'right';
    ctx.fillText('HOD-CSE', width - 100, height - 120);

    // **Bottom Green Line (Center to Right)**
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(width / 2, height - 40, width / 2, 20); // Bottom green line (center to right)

    // Save the image to a temporary path
    const imagePath = path.join('/tmp', 'bonafide_certificate.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    // Email Configuration (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Email Content with Attachment
    const mailOptions = {
      from: `Bonafide Certificate <${process.env.USER}>`,
      to: studentEmail,
      subject: 'Your Bonafide Certificate',
      text: `Dear ${studentName},\n\nPlease find your Bonafide Certificate attached.\n\nBest regards,\nPSNA College of Engineering and Technology`,
      attachments: [
        {
          filename: 'bonafide_certificate.png',
          path: imagePath,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate and send certificate.' }), { status: 500 });
  }
}
