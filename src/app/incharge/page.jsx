'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

export default function InchargePage() {
  const user = useSelector((state) => state.user);
  const [incharges, setIncharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncharge = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`/api/inchargefetch?email=${user.email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch incharges');
      }

      const data = await response.json();
      setIncharges(data.incharges || []);
    } catch (err) {
      console.error('Error fetching incharges:', err);
      setError('Failed to load incharges. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchIncharge();
  }, [fetchIncharge]);

  const handleRequest = async (url, method, body, successMessage, failureMessage) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(failureMessage);

      alert(successMessage);
      fetchIncharge();
    } catch (error) {
      console.error(failureMessage, error);
      alert(failureMessage);
    }
  };

  const handleAccept = (incharge) => {
    handleRequest(
      '/api/hod',
      'POST',
      {
        studentName: incharge.studentName,
        studentRegNo: incharge.studentRegNo,
        tutorName: incharge.tutorName,
        inchargeName: incharge.inchargeName,
        reason: incharge.reason,
      },
      'Tutor request accepted successfully',
      'Failed to accept tutor request'
    );
    handleRequest(
      '/api/inchargedelete',
      'DELETE',
      { postId: incharge._id },
      ''
    );
  };

  const handleDecline = (incharge) => {
    handleRequest(
      '/api/inchargedelete',
      'DELETE',
      { postId : incharge._id },
      'Tutor request declined successfully',
      'Failed to decline tutor request'
    );
  };

  if (loading) return <p>Loading Requests...</p>;

  if (error) return <p>Error: {error}</p>;

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
              <p><strong>Register No:</strong> {incharge.studentRegNo}</p>
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
                onClick={() => handleDecline(incharge)}
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