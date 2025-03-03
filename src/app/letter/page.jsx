"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { toPng } from "html-to-image";
const BonafideLetter = () => {
  const searchParams = useSearchParams();
   const letterRef = useRef(null);
  const formData = {
    studentName: searchParams.get("studentName"),
    regNo: searchParams.get("regNo"),
    year: searchParams.get("year"),
    department: searchParams.get("department"),
    academicYear: searchParams.get("academicYear"),
    reason: searchParams.get("reason"),
  };

    const downloadImage = () => {
      if (letterRef.current) {
        toPng(letterRef.current)
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "bonafide-certificate.png";
            link.click();
          })
          .catch((err) => {
            console.error("Image generation failed:", err);
          });
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl text-black">
      <img src="https://psnacet.edu.in/img-1/logo-clr.png" alt="" className="relative mb-5" />
     
     

      <h2 className="text-2xl font-bold text-center mb-4 text-black">Bonafide Certificate</h2>

      <p>
        This is to certify that <strong>Mr./Ms. {formData.studentName}</strong> 
        (Register No: <strong>{formData.regNo}</strong>) is a bonafide student of this college,
        studying in <strong>{formData.year} B.E.</strong> Degree in <strong>{formData.department}</strong> 
        during the academic year <strong>{formData.academicYear}</strong>.
      </p>

      <p className="mt-4">
        This Certificate is issued to him/her for applying to the 
        <strong> {formData.reason}</strong>.
      </p>

      <p className="mt-6 text-right font-bold text-black">HOD-{formData.department}</p>
      <button
          type="button"
          onClick={downloadImage}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full"
        >
          Download as Image
        </button>
    </div>
  );
};

export default BonafideLetter;
