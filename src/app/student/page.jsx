"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

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

  const tutors = ["Tutor A", "Tutor B", "Tutor C", "Tutor D"];
  const yearIncharges = ["Year 1", "Year 2", "Year 3"];
  const yearOption = ["I year", "II year", "III year", "IV year"];
  const sectionOption = ["A", "B", "C", "D"];
  const departments = ["CSE", "ECE", "ME"];

  const letterRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tutor" && { tutorEmail: tutorData[value] || "" }),
    }));
    console.log(formData)
    };
 
  const handleNext = (e) => {
    e.preventDefault();
    router.push("/letter", { formData });
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
      });
      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.error("Error sending file:", error);
      setError("Failed to send the file.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl color-black text-black">
      <h2 className="text-3xl font-bold mb-8 text-center">Bonafide Certificate Form</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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

        {[
          ["tutor", tutors],
          ["year", yearOption],
          ["section", sectionOption],
          ["yearIncharge", yearIncharges],
          ["department", departments],
        ].map(([name, options]) => (
          <select
            key={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select {name.charAt(0).toUpperCase() + name.slice(1)}</option>
            {options.map((option) => (
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
        <button type="button" onClick={handleNext}
         className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full"
        >Next</button>
        <button
          type="button"
          onClick={sendFile}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 w-full"
        >
          Send
        </button>
      </form>

      {formData.studentName && <div ref={letterRef}>{/* Bonafide Letter Preview */}</div>}
    </div>
  );
};
