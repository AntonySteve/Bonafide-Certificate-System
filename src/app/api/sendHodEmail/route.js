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
      year,
      academicYear,
      fatherName,
      reason
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

    // Green line (Top border)
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(0, 0, width, 15);

    // Header (Logo & Founder Image)
    ctx.drawImage(logo, 50, 50, 250, 100); // College Logo (left side)
    ctx.drawImage(founderImage, width - 200, 50, 150, 150); // Founder Image (right side)

    // College Name & Details
    ctx.fillStyle = '#003366';
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PSNA College of Engineering & Technology', width / 2, 200);
    ctx.font = 'italic 24px Arial';
    ctx.fillText('(An Autonomous Institution)', width / 2, 240);
    ctx.font = '20px Arial';
    ctx.fillText('AICTE | Anna University | NBA | NAAC A++', width / 2, 270);

    // Certificate Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 42px Times New Roman';
    ctx.fillText('Bonafide Certificate', width / 2, 350);

    // Subtitle
    ctx.font = 'italic 28px Times New Roman';
    ctx.fillText('To whomsoever it may concern', width / 2, 400);

    // Certificate Content
    ctx.fillStyle = '#222222';
    ctx.font = '26px Times New Roman';
    ctx.textAlign = 'left';
    const content = `This is to certify that Mr./Ms. ${studentName} (Reg No: ${studentRegNo}),
    S/o or D/o of ${fatherName}, is a student of our institution, currently enrolled
    in the BE. Computer Science Engineering during the academic year ${academicYear}.`;
    
    const lines = content.split('\n');
    let yPosition = 500;
    lines.forEach((line) => {
      ctx.fillText(line.trim(), 100, yPosition);
      yPosition += 50;
    });

    // Reason for certificate
    ctx.font = 'bold 26px Times New Roman';
    ctx.fillText(`This Certificate is issued for the purpose of ${reason}.`, 100, yPosition + 40);

    // Signature & Footer
    ctx.font = 'bold 28px Times New Roman';
    ctx.textAlign = 'right';
    ctx.fillText('HOD-CSE', width - 100, height - 120);

    // Green line (Bottom border)
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(0, height - 15, width, 15);

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
    // Email Content with Attachment
      const mailOptions = {
        from: `Bonafide Certificate <${process.env.USER}>`,
        to: studentEmail,
        subject: 'Your Bonafide Certificate',
        text: `Dear ${studentName},

          Please find your Bonafide Certificate attached.

          Best regards,
          PSNA College of Engineering and Technology`,
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