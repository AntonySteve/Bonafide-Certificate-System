"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

const BonafideForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    regNo: "",
    tutor: "",
    year: "",
    section: "",
    yearIncharge: "",
    department: "",
    academicYear: "",
    reason: "",

  });

  const tutors = ["Tutor A", "Tutor B", "Tutor C", "Tutor D"];
  const yearIncharges = ["Year 1", "Year 2", "Year 3"];
  const yearOption = ["I year", "II year", "III year", "IV year"];
  const sectionOption = ["A", "B", "C", "B"];
  const departments = ["Computer Science", "Electronics", "Mechanical"];

  const letterRef = useRef(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateLetter = () => {
    return `
PSNA College of Engineering and Technology

From:
     ${formData.studentName},
     ${formData.regNo},
     ${formData.department}/${formData.year}/${formData.section},
     PSNA College of Engineering and Technology,
     Dindigul.

To:
     Head of Department,
     Computer Science and Engineering,
     PSNA Collge of Engineering and Technology,
     Dindigul.

Subject: Request for applying ${formData.reason}

Respected mam,

This is to certify that Mr./Ms. ${formData.studentName} with Registration Number ${formData.regNo} is a bonafide student of our institution. He/She is currently pursuing ${formData.department} under the guidance of ${formData.tutor}. The student is in the academic year ${formData.academicYear}, and the Year Incharge is ${formData.yearIncharge}.

The purpose of applying for this bonafide certificate is: ${formData.reason}.

We certify that the above information is true to the best of our knowledge.

                                                                        Yours faithfully,
                                                                        ${formData.studentName}`;
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
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Bonafide Certificate Form</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <input
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          name="regNo"
          placeholder="Registration Number"
          value={formData.regNo}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <select
          name="tutor"
          value={formData.tutor}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor} value={tutor}>
              {tutor}
            </option>
          ))}
        </select>

        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Year</option>
          {yearOption.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Section</option>
          {sectionOption.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>


        <select
          name="yearIncharge"
          value={formData.yearIncharge}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Year Incharge</option>
          {yearIncharges.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <input
          name="academicYear"
          placeholder="Academic Year"
          value={formData.academicYear}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <textarea
          name="reason"
          placeholder="Reason for applying bonafide"
          value={formData.reason}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <button
          type="button"
          onClick={downloadImage}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full"
        >
          Download as Image
        </button>
      </form>

      {formData.studentName && (
        <div ref={letterRef} className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Generated Bonafide Letter:</h3>
          <pre className="whitespace-pre-wrap">{generateLetter()}</pre>
        </div>
      )}
    </div>
  );
};

export default BonafideForm;
