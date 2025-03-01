"use client";

import { useSearchParams } from "next/navigation";

const BonafideLetter = () => {
  const searchParams = useSearchParams();

  const formData = {
    studentName: searchParams.get("studentName"),
    regNo: searchParams.get("regNo"),
    year: searchParams.get("year"),
    department: searchParams.get("department"),
    academicYear: searchParams.get("academicYear"),
    reason: searchParams.get("reason"),
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl text-black">
      <h2 className="text-2xl font-bold text-center mb-4 text-black">Bonafide Certificate</h2>
      <p className="text-center font-semibold text-black">PSNA College of Engineering and Technology</p>
      <p className="text-center italic mb-6 text-black">Affiliated to Anna University</p>

      <p>
        This is to certify that <strong>M./Ms. {formData.studentName}</strong> 
        (Register No: <strong>{formData.regNo}</strong>) is a bonafide student of this college,
        studying in <strong>{formData.year} B.E.</strong> Degree in <strong>{formData.department}</strong> 
        during the academic year <strong>{formData.academicYear}</strong>.
      </p>

      <p className="mt-4">
        This Certificate is issued to him/her for applying to the 
        <strong> {formData.reason}</strong>.
      </p>

      <p className="mt-6 text-right font-bold text-black">HOD-{formData.department}</p>
    </div>
  );
};

export default BonafideLetter;
