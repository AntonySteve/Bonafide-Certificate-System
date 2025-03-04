'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function HodPage() {
  const user = useSelector((state) => state.user);
  const [hod, setHod] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHod = async () => {
      try {
        const response = await fetch('/api/hodfetch', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch HOD requests');
        }

        const data = await response.json();
        setHod(data.hod || []);
      } catch (err) {
        console.error('Error fetching HOD requests:', err);
        setError('Failed to load HOD requests');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchHod();
  }, [user?.email]);

  const handleAccept = async (hodRequest) => {
    try {
      await fetch('/api/hoddelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({postId : hodRequest._id}),
      })
    } catch (error) {
      console.log(error)
    }
  };

  const handleDecline = async (hodRequest) => {
    try {
      await fetch('/api/hoddelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({postId : hodRequest._id})
      })
    } catch (error) {
      console.log(error)
    }
  };

  if (loading) {
    return <p>Loading HOD requests...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {hod.length === 0 ? (
        <p>No HOD requests found.</p>
      ) : (
        hod.map((hodRequest) => (
          <div
            key={hodRequest._id}
            className="flex justify-between items-center p-6 mb-6 rounded-2xl shadow-lg bg-gray-800"
          >
            <div className="text-white">
              <p><strong>Name:</strong> {hodRequest.studentName}</p>
              <p><strong>Register No:</strong> {hodRequest.regNo}</p>
              <p><strong>Tutor Name:</strong> {hodRequest.tutorName}</p>
              <p><strong>Incharge Name:</strong> {hodRequest.inchargeName}</p>
              <p><strong>Reason:</strong> {hodRequest.reason}</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAccept(hodRequest)}
                className="px-6 py-2 rounded-xl cursor-pointer bg-green-600 text-white hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(hodRequest._id)}
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
