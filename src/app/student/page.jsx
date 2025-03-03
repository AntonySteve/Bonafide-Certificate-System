"use client";

// Form Page (page.jsx)
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
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
  const departments = ["Computer Science", "Electronics", "Mechanical"];

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
    const queryString = new URLSearchParams(formData).toString();
    router.push(`/letter?${queryString}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl text-black">
      <h2 className="text-3xl font-bold mb-8 text-center">Bonafide Certificate Form</h2>

      <form className="space-y-6" onSubmit={handleNext}>
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
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full"
        >
          Next
        </button>
      </form>
    </div>
  );
}
