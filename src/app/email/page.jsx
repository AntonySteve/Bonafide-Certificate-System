const BonafideCertificate = ({ studentName, studentRegNo, fatherName, academicYear, reason }) => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="A41 w-[595px] h-[842px] relative bg-white overflow-hidden shadow-lg">
          <img
            className="Image1 w-[291px] h-[99px] left-[13px] top-[65px] absolute"
            src="https://psnacet.edu.in/img-1/logo-clr.png"
            alt="Institution Logo"
          />
          <img
            className="WhatsappImage w-[62px] h-[99px] left-[491px] top-[65px] absolute"
            src="kothandaraman.jpeg"
            alt="Signature"
          />
          <div className="Rectangle1 w-[336px] h-[17px] left-0 top-[17px] absolute bg-[#07bc49]" />
          <div className="Rectangle3 w-[336px] h-[17px] left-0 top-[17px] absolute bg-[#07bc49]" />
          <div className="Rectangle2 w-[336px] h-2 left-[259px] top-[802px] absolute bg-[#07bc49]" />
          
          <div className="BonafideCertificate left-[177px] top-[221px] absolute text-black text-2xl font-extrabold">
            Bonafide Certificate
          </div>
          
          <div className="ToWhomsoever left-[177px] top-[279px] absolute text-black text-[15px] font-medium">
            To whomsoever it may concern
          </div>
          
          <div className="CertificateText w-[560px] left-[23px] top-[328px] absolute text-black text-[15px] font-medium">
            This is to certify that <span className="font-bold">Mr./Ms. {studentName}</span> (Reg No: <span className="font-bold">{studentRegNo}</span>),
            S/o or D/o of <span className="font-bold">{fatherName}</span>, is a student of our institution, currently enrolled
            in the <span className="font-bold">BE Computer Science Engineering</span> during the academic year <span className="font-bold">{academicYear}</span>.
            <br /><br />
            This Certificate is issued for the purpose of <span className="font-bold">{reason}</span>.
            <br /><br />
            <div className="font-bold mt-20 ml-100">HOD-CSE</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default BonafideCertificate;
  