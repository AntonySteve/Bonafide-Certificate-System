"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

const BonafideLetter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const letterRef = useRef(null);

  const formData = {
    studentName: searchParams.get("studentName"),
    studentRegNo: searchParams.get("studentRegNo"),
    studentEmail: searchParams.get("studentEmail"),
    tutorName: searchParams.get("tutor"),
    tutorEmail: searchParams.get("tutorEmail"),
    reason: searchParams.get("reason"),
    year: searchParams.get("year"),
    section: searchParams.get("section"),
    yearIncharge: searchParams.get("yearIncharge"),
    inchargeEmail: searchParams.get("inchargeEmail"),
    academicYear: searchParams.get("academicYear"),
    fatherName: searchParams.get("father"),
  };

  const father = {
    fatherName: searchParams.get("father"),
  };

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
      router.push("/student");
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };


  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg text-black relative border-4 border-white mt-10">
      {/* Green Top Left Corner */}
      

      <div className="p-8">
        {/* <div className="flex justify-between items-start mb-5">
          <div className="flex-1 flex justify-center">
            <img
              src="https://psnacet.edu.in/img-1/logo-clr.png"
              alt="College Logo"
              className="mb-5 mx-auto ml-0 mt-5 cursor-pointer"
            />
          </div>
          <img
            src="kothandaraman.jpeg"
            alt="Founder of PSNACET"
            className="w-30 h-40 "
          />
        </div> */}
        <h2 className="text-2xl font-bold text-center mb-4">Bonafide Certificate</h2>
        <h2 className="text-center font-semibold mb-5 mt-5 text-xl">
          To whomsoever it may concern
        </h2>

        <p>
          This is to certify that <strong>Mr./Ms. {formData.studentName}</strong> (Register No: <strong>{formData.studentRegNo}</strong>)  S/O or D/O of
          <strong> {father.fatherName} </strong> is a student of our
          college, studying in <strong>{formData.year} B.E.</strong> Degree in
          <strong> {formData.department} </strong> during the academic year
          <strong> {formData.academicYear}</strong>.
        </p>

        <p className="mt-4">
          This Certificate is issued to him/her for applying to the
          <strong> {formData.reason}</strong>.
        </p>
      </div>

      <button
        onClick={sendFile}
        className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-30 mt-4 cursor-pointer"
      >
        Send
      </button>
    </div>
  );
};

export default BonafideLetter;
