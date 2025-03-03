'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function InchargePage() {
  const user = useSelector((state) => state.user);
  const [incharges, setIncharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncharge = async () => {
      try {
        const response = await fetch(`/api/inchargefetch?email=${user?.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tutors');
        }

        const data = await response.json();
        setIncharges(data.incharges || []);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchIncharge();
  }, [user?.email]);

  const handleAccept = async (incharge) => {
    try {
      const response = await fetch('/api/hod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: incharge.studentName,
          regNo: incharge.regNo,
          tutorName: incharge.tutorName,
          inchargeName: incharge.inchargeName,
          reason: incharge.reason,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to accept tutor request');
      }
      alert('Tutor request accepted successfully');
      setIncharges((prevIncharges) => prevIncharges.filter((i) => i._id !== incharge._id));
    } catch (error) {
      console.error('Error accepting tutor request:', error);
      alert('Failed to accept tutor request');
    }
  };

  const handleDecline = (id) => {
    console.log('Declined tutor with ID:', id);
  };

  if (loading) {
    return <p>Loading Incharge...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {incharges.length === 0 ? (
        <p>No Incharges found.</p>
      ) : (
        incharges.map((incharge) => (
          <div
            key={incharge._id}
            className="flex justify-between items-center p-6 mb-6 rounded-2xl shadow-lg bg-gray-800"
          >
            <div className="text-white">
              <p><strong>Name:</strong> {incharge.studentName}</p>
              <p><strong>Register No:</strong> {incharge.regNo}</p>
              <p><strong>Tutor Name:</strong> {incharge.tutorName}</p>
              <p><strong>Reason:</strong> {incharge.reason}</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAccept(incharge)}
                className="px-6 py-2 rounded-xl cursor-pointer bg-green-600 text-white hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(incharge._id)}
                className="px-6 py-2 rounded-xl cursor-pointer bg-red-600 text-white hover:bg-red-700 transition"
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