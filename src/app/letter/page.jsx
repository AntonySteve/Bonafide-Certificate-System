"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

const BonafideLetter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const letterRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const formData = {
    studentName: searchParams.get("studentName"),
    studentRegNo: searchParams.get("studentRegNo"),
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

  const downloadImage = async () => {
    if (!letterRef.current) return;

    try {
      setLoading(true);
      const dataUrl = await toPng(letterRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `bonafide-certificate-${formData.regNo}.png`;
      link.click();
    } catch (err) {
      console.error("Image generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendFile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/send-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send the file");
      }

      const res = await response.json();
      console.log("File sent successfully:", res);
      router.push("/Sprogress");
    } catch (error) {
      console.error("Error sending file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={letterRef} className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl text-black">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="https://psnacet.edu.in/img-1/logo-clr.png"
          alt="PSNACET Logo"
          className="w-32 h-auto"
        />
      </div>

      <h2 className="text-3xl font-extrabold text-center mb-6">Bonafide Certificate</h2>
      {/* Certificate Content */}
      <p className="leading-7 mb-4">
        This is to certify that <strong>Mr./Ms. {formData.studentName}</strong>, S/O or D/O of
        <strong> {formData.fatherName}</strong> (Register No: <strong>{formData.studentRegNo}</strong>) is a bonafide
        student of this college, studying in <strong>{formData.year} B.E.</strong> Degree in
        <strong> {formData.department}</strong> during the academic year <strong>{formData.academicYear}</strong>.
      </p>

      <p className="leading-7 mb-8">
        This certificate is issued to him/her for applying to the
        <strong> {formData.reason}</strong>.
      </p>

      <p className="text-right font-bold text-lg">HOD - CSE</p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={downloadImage}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 transition w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Processing..." : "Download as Image"}
        </button>

        <button
          onClick={sendFile}
          className="bg-green-600 text-white p-3 rounded-lg cursor-pointer hover:bg-green-800 transition w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default BonafideLetter;
