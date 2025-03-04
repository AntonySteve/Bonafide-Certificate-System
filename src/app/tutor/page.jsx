'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function TutorPage() {
  const user = useSelector((state) => state.user);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(`/api/retrieve?email=${user?.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tutors');
        }

        const data = await response.json();
        setTutors(data.tutors || []);
        console.log(tutors);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchTutors();
  }, [user?.email]);

  const handleAccept = async (tutor) => {
    try {
      const response = await fetch('/api/incharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: tutor.studentName,
          regNo: tutor.regNo,
          tutorName: tutor.tutorName,
          inchargeName: tutor.yearIncharge,
          inchargeEmail: tutor.inchargeEmail,
          reason: tutor.reason,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to accept tutor request');
      }
      alert('Tutor request accepted successfully');
      setTutors((prevTutors) => prevTutors.filter((t) => t._id !== tutor._id));
    } catch (error) {
      console.error('Error accepting tutor request:', error);
      alert('Failed to accept tutor request');
    }
  };

  const handleDecline = (id) => {
    console.log('Declined tutor with ID:', id);
  };

  if (loading) {
    return <p>Loading tutors...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Tutor Requests</h1>
      {tutors.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No Requests found.</p>
      ) : (
        tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="flex justify-between items-center bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex flex-col">
              <p className="text-lg text-gray-800">
                <strong>Name:</strong> {tutor.studentName}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Register No:</strong> {tutor.regNo}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Reason:</strong> {tutor.reason}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleAccept(tutor)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(tutor._id)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition duration-200"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
