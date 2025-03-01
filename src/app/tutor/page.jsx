'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function TutorPage() {
  const user = useSelector((state) => state.user);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      if (!user?.email) return; // Ensure email exists

      try {
        console.log("User Email:", user.email);

        const response = await fetch('/api/retrieve',{
            method: "GET",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user.email),
        }
        );
        const data = await response.json();

        if (response.ok) {
          console.log("Matching Tutors:", data.tutors);
          setTutors(data.tutors || []);
        } else {
          console.error("Error:", data.error || "Unknown error");
          setTutors([]);
        }

      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false); // Stop loading once request completes
      }
    };

    fetchTutors();
  }, [user.email]);

  return (
    <div>
      <h1>Tutor Page</h1>

      {loading ? (
        <p>Loading tutors...</p>
      ) : tutors.length > 0 ? (
        tutors.map((tutor) => (
          <div key={tutor._id}>
            <p>Name: {tutor.name}</p>
            <p>Email: {tutor.email}</p>
            <p>Subject: {tutor.subject}</p>
          </div>
        ))
      ) : (
        <p>No matching tutors found.</p>
      )}
    </div>
  );
}
