// Letter Page (Letter.jsx)
"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

const BonafideLetter = () => {
  const searchParams = useSearchParams();
  const router = useRouter()
  const letterRef = useRef(null);

  const formData = {
    studentName: searchParams.get("studentName"),
    regNo: searchParams.get("regNo"),
    tutorName: searchParams.get("tutor"),
    tutorEmail: searchParams.get("tutorEmail"),
    reason: searchParams.get("reason"),
    year: searchParams.get("year"),
    section: searchParams.get("section"),
    yearIncharge: searchParams.get("yearIncharge"), 
    inchargeEmail: searchParams.get("inchargeEmail"),
    department: searchParams.get("department"),
    academicYear: searchParams.get("academicYear"),
  };

  const father = {
    fatherName: searchParams.get("father"),
  }

  // const downloadImage = () => {
  //   if (letterRef.current) {
  //     toPng(letterRef.current)
  //       .then((dataUrl) => {
  //         const link = document.createElement("a");
  //         link.href = dataUrl;
  //         link.download = "bonafide-certificate.png";
  //         link.click();
  //       })
  //       .catch((err) => {
  //         console.error("Image generation failed:", err);
  //       });
  //   }
  // };

  const sendFile = async () => {
    try {
      const response = await fetch("/api/send-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await response.json();
      console.log(res);
      //router.push('/progress')
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  return (

    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl text-black">
      <img src="https://psnacet.edu.in/img-1/logo-clr.png" alt="" className="mb-5 center ml-50" />
     

      <h2 className="text-2xl font-bold text-center mb-4">Bonafide Certificate</h2>

      <p>
        This is to certify that <strong>Mr./Ms. {formData.studentName}</strong> S/O or D/O of<strong> {father.fatherName} </strong>(Register No: <strong>{formData.regNo}</strong>)
        is a bonafide student of this college, studying in <strong>{formData.year} B.E.</strong> Degree in <strong>{formData.department} </strong>
         during the academic year <strong>{formData.academicYear}</strong>.
      </p>

      <p className="mt-4">
        This Certificate is issued to him/her for applying to the <strong>{formData.reason}</strong>.
      </p>

      <p className="mt-6 text-right font-bold">HOD-CSE</p>

      {/* <button onClick={downloadImage} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full mt-4">
        Download as Image
      </button> */}
      <button onClick={sendFile} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-full mt-4">
        Send
      </button>
    </div>
  );
};

export default BonafideLetter;
