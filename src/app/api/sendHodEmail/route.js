import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { studentName, studentEmail, studentRegNo, tutorName, inchargeName, reason } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: 'Bonafide Certificate',
        address: process.env.USER,
      },
      to: studentEmail,
      subject: 'Tutor Request Accepted',
      html: `
        <h2>Tutor Request Accepted</h2>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Register No:</strong> ${studentRegNo}</p>
        <p><strong>Tutor:</strong> ${tutorName}</p>
        <p><strong>Incharge:</strong> ${inchargeName}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>This tutor request has been accepted successfully.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
  }
}
