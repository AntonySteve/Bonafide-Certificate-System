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
    const width = 595 * 2; // Scale up for better resolution
    const height = 842 * 2;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load images (College Logo & Signature)
    const logo = await loadImage('https://psnacet.edu.in/img-1/logo-clr.png');
    const signature = await loadImage('kothandaraman.jpeg');

    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // **Top Green Line**
    ctx.fillStyle = '#07bc49'; // Green color
    ctx.fillRect(0, 34, width / 2, 34); // Adjusted to match your UI

    // **Header (Logo & Signature)**
    ctx.drawImage(logo, 26, 130, 291, 99); // Logo at top-left
    ctx.drawImage(signature, width - 160, 130, 124, 99); // Signature at top-right

    // **Title: Bonafide Certificate**
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Bonafide Certificate', width / 2, 400);

    // **Subtitle**
    ctx.font = 'italic 24px Arial';
    ctx.fillText('To Whomsoever It May Concern', width / 2, 460);

    // **Certificate Content**
    ctx.fillStyle = '#222222';
    ctx.font = '22px Arial';
    ctx.textAlign = 'left';
    const textX = 50;
    let textY = 520;

    const content = `This is to certify that Mr./Ms. ${studentName} (Reg No: ${studentRegNo}),
S/o or D/o of ${fatherName}, is a student of our institution,
currently enrolled in the BE. Computer Science Engineering during
the academic year ${academicYear}.`;

    // Split text into multiple lines for better readability
    const lines = content.split('\n');
    lines.forEach((line) => {
      ctx.fillText(line.trim(), textX, textY);
      textY += 40;
    });

    // **Reason for Certificate**
    ctx.font = '22px Arial';
    ctx.fillText(`This Certificate is issued for the purpose of: ${reason}`, textX, textY + 50);

    // **Signature**
    ctx.font = 'bold 28px Arial';
    ctx.fillText('HOD-CSE', width - 200, height - 150);

    // **Bottom Green Line (Moved Slightly Up)**
    ctx.fillStyle = '#07bc49';
    ctx.fillRect(width / 2, height - 80, width / 2, 20);

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
