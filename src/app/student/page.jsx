"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useSelector } from "react-redux";
import { setUser } from "@/lib/userSlice";

const BonafideForm = () => {
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
  const yearIncharges = ["Year 1", "Year 2", "Year 3"];
  const yearOption = ["I year", "II year", "III year", "IV year"];
  const sectionOption = ["A", "B", "C", "D"];
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
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-center">Bonafide Certificate Form</h2>

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

        <button
          type="click"  
          onClick={sendFile}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-full"
        >
          Send
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
