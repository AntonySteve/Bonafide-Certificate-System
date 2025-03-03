"use client";

import { useState, useCallback } from "react";
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
    inchargeEmail: "",
    department: "",
    academicYear: "",
    reason: "",
  });

  const tutorData = {
    "Tutor A": "tutora@psnacet.edu.in",
    "Tutor B": "tutorb@psnacet.edu.in",
    "Tutor C": "tutorc@psnacet.edu.in",
    "Tutor D": "tutord@psnacet.edu.in",
  };

  const inchargeData = {
    "Year 1": "year1@psnacet.edu.in",
    "Year 2": "year2@psnacet.edu.in",
    "Year 3": "year3@psnacet.edu.in",
    "Year 4": "year4@psnacet.edu.in",
  };

  const tutors = Object.keys(tutorData);
  const yearIncharges = Object.keys(inchargeData);
  const yearOption = ["I year", "II year", "III year", "IV year"];
  const sectionOption = ["A", "B", "C", "D"];
<<<<<<< HEAD
=======

  //const departments = ["CSE", "ECE", "ME"];

>>>>>>> d7e6dc3c4dd47ab676ed4e79ad8e4a7300998e4c

  // Optimize handleChange using useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tutor" && { tutorEmail: tutorData[value] || "" }),
      ...(name === "yearIncharge" && { inchargeEmail: inchargeData[value] || "" }),
    }));
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams(formData).toString();
    router.push(`/letter?${queryString}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">Bonafide Certificate Form</h2>

      <form className="space-y-6" onSubmit={handleNext}>
        {Object.entries({
          studentName: "Student Name",
          regNo: "Registration Number",
          father: "Father's Name",
          academicYear: "Academic Year",
        }).map(([name, placeholder]) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 font-medium">
              {placeholder}
            </label>
            <input
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        {[
          ["tutor", tutors],
          ["year", yearOption],
          ["section", sectionOption],
          ["yearIncharge", yearIncharges],
        ].map(([name, options]) => (
          <div key={name}>
            <label htmlFor={name} className="block mb-2 font-medium">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </label>
            <select
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select {name.charAt(0).toUpperCase() + name.slice(1)}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label htmlFor="reason" className="block mb-2 font-medium">
            Reason for applying bonafide
          </label>
          <textarea
            id="reason"
            name="reason"
            placeholder="Reason for applying bonafide"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 w-full cursor-pointer transition-all duration-300"
        >
          Next
        </button>
      </form>
    </div>
  );
}