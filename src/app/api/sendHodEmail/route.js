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

<<<<<<< HEAD
    // Green Line (Top-Left to Center)
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(0, 5, width / 2, 20); // Starts from left, extends to center

    // Logo & Founder Image (Top-Right)
    const logoWidth = 150, logoHeight = 150;
    const founderWidth = 150, founderHeight = 180;
    const marginTop = 5;
    const logoX = width - (logoWidth + founderWidth + 20); // Right-aligned
    const founderX = width - (founderWidth + 10); // Next to logo

    ctx.drawImage(logo, logoX, marginTop, logoWidth, logoHeight);
    ctx.drawImage(founderImage, founderX, marginTop, founderWidth, founderHeight);

    // College Name (Centered)
    ctx.fillStyle = '#003366';
    ctx.font = 'bold 54px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('PSNA College of Engineering and Technology', width / 2, 350);

    // Certificate Title (Centered)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Times New Roman';
    ctx.fillText('Bonafide Certificate', width / 2, 450);

    // Subtitle (Centered)
    ctx.font = 'italic 32px Times New Roman';
    ctx.fillText('To Whomsoever It May Concern', width / 2, 520);

    // Certificate Content (Centered)
=======
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
>>>>>>> e42b5ca4977371469cdb153dd324e7c562c0c33a
    ctx.fillStyle = '#222222';
    ctx.font = '28px Times New Roman';
    ctx.textAlign = 'center';

<<<<<<< HEAD
    const content = `This is to certify that Mr./Ms. ${studentName} (Reg No: ${studentRegNo}),
      S/o or D/o of ${fatherName}, is a student of our institution,
      currently enrolled in the BE. Computer Science Engineering
      during the academic year ${academicYear}.`;

    const lines = content.split('\n');
    let yPosition = 620;
=======
    const content = `
      This is to certify that Mr./Ms. ${studentName} (Reg No: ${studentRegNo}),
      S/o or D/o of ${fatherName}, is a student of our institution,
      currently enrolled in the BE. Computer Science Engineering
      during the academic year ${academicYear}.
    `;

    const lines = content.split('\n');
    let yPosition = 600;
>>>>>>> e42b5ca4977371469cdb153dd324e7c562c0c33a
    lines.forEach((line) => {
      ctx.fillText(line.trim(), width / 2, yPosition);
      yPosition += 60;
    });

<<<<<<< HEAD
    // Reason for certificate (Centered) - Fixed Quotes Error Here
    ctx.font = '28px Times New Roman';
    ctx.fillText(`This Certificate is issued for the purpose of: ${reason}`, width / 2, yPosition + 40);

    // Signature & Footer (Centered)
    ctx.font = 'bold 32px Times New Roman';
    ctx.fillText('HOD-CSE', width / 2, height - 120);

    // Bottom Green Line (Center to Right)
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(width / 2, height - 20, width / 2, 20); // From center to right
=======
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
>>>>>>> e42b5ca4977371469cdb153dd324e7c562c0c33a

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

<<<<<<< HEAD
    // Email Content with Attachment - Fixed Quotes and Template Literals Here
=======
    // Email Content with Attachment
>>>>>>> e42b5ca4977371469cdb153dd324e7c562c0c33a
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
