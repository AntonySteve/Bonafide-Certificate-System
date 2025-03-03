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
        console.log(tutors)
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
    <div style={{ padding: '20px' }}>
      {tutors.length === 0 ? (
        <p>No tutors found.</p>
      ) : (
        tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="flex justify-evenly items-center"
            style={{
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#696969',
            }}
          >
            <p className="text-white">
              <strong>Name:</strong> {tutor.studentName}
            </p>
            <p className="text-white">
              <strong>Register No:</strong> {tutor.regNo}
            </p>
            <p className="text-white">
              <strong>Reason:</strong> {tutor.reason}
            </p>
    
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleAccept(tutor)}
                style={{
                  marginRight: '10px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                }}
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(tutor._id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#f44336',
                  color: 'white',
                }}
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