"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BonafideLetter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const letterRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
    department: searchParams.get("department"),
  };

  const sendFile = async () => {
    setIsLoading(true);
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

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/student");
      }, 2000);
    } catch (error) {
      console.error("Error sending file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {showPopup && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          ✅ Bonafide Certificate sent successfully!
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-lg text-black relative border-4 border-white mt-10">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Bonafide Certificate</h2>
          <h2 className="text-center font-semibold mb-5 mt-5 text-xl">
            To whomsoever it may concern
          </h2>

          <p>
            This is to certify that <strong>Mr./Ms. {formData.studentName}</strong> (Register No: <strong>{formData.studentRegNo}</strong>) S/O or D/O of
            <strong> {formData.fatherName} </strong> is a student of our
            college, studying in <strong>{formData.year} B.E.</strong> Degree in
            <strong> {formData.department} </strong> during the academic year
            <strong> {formData.academicYear}</strong>.
          </p>

          <p className="mt-4">
            This Certificate is issued to him/her for applying to the
            <strong> {formData.reason}</strong>.
          </p>

          <button
            onClick={sendFile}
            className={`bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-30 mt-4 cursor-pointer ${isLoading ? 'opacity-70' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BonafideLetter;
