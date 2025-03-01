"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";// Import the letter component

const BonafideForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studentName: "",
    regNo: "",
    father: "",
    tutor: "",
    tutorEmail: "",
    year: "",
    section: "",
    yearIncharge: "",
    department: "",
    academicYear: "",
    reason: "",
  });

  const [error, setError] = useState("");

  const tutorData = {
    "Tutor A": "tutora@example.com",
    "Tutor B": "tutorb@example.com",
    "Tutor C": "tutorc@example.com",
    "Tutor D": "tutord@example.com",
  };

  const user = useSelector((state) => state.user);

  const tutors = Object.keys(tutorData);

  const tutors = ["Tutor A", "Tutor B", "Tutor C", "Tutor D"];
  const yearIncharges = ["Year 1", "Year 2", "Year 3"];
  const yearOption = ["I year", "II year", "III year", "IV year"];
  const sectionOption = ["A", "B", "C", "D"];
  const sectionOption = ["A", "B", "C"];
  const departments = ["Computer Science", "Electronics", "Mechanical"];

  const letterRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "tutor") {
      setFormData((prev) => ({
        ...prev,
        tutorEmail: tutorData[value] || "",
      }));
    }
    console.log(formData);
  };

  const generateLetter = () => {
    return `
  PSNA College of Engineering and Technology

  This is to certify that Mr./Ms. ${formData.studentName} S/O. ${formData.father} (Register No: ${formData.regNo}) is a bonafide student of this college, studying in ${formData.year} B.E. Degree in ${formData.department} during the academic year ${formData.academicYear}.

  This Certificate is issued to him for applying to the ${formData.reason}.

                                                               HOD-CSE`;
  };
  const handleClick = (e) =>{
    e.preventDefault();
    router.push('/letter', {formData})
  }

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

  const sendFile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/send-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.error("Error sending file:", error);
      setError("Failed to send the file.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl color-black text-black ">
      <h2 className="text-3xl font-bold color-black mb-8 text-center ">Bonafide Certificate Form</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form className="space-y-6">
        {Object.entries({
          studentName: "Student Name",
          regNo: "Registration Number",
          father: "Father's Name",
          academicYear: "Academic Year",
        }).map(([name, placeholder]) => (
          <input
            key={name}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        ))}

        {["tutor", "year", "section", "yearIncharge", "department"].map((name) => (
          <select
            key={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select {name.charAt(0).toUpperCase() + name.slice(1)}</option>
            {(name === "tutor"
              ? tutors
              : name === "year"
              ? yearOption
              : name === "section"
              ? sectionOption
              : name === "yearIncharge"
              ? yearIncharges
              : departments
            ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 font-black">
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
          onClick={handleClick}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full"
        >
          Download as Image
        </button>

        <button
          type="click"  
          onClick={sendFile}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-full"
        >
          Send
          Next
        </button>
      </form>

      {formData.studentName && <BonafideLetter ref={letterRef} formData={formData} />}
    </div>
  );
};

export default BonafideForm;
