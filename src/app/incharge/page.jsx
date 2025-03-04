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
      setError('Failed to load incharges. Please try again later.');
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
    const payload = {
      studentName: incharge.studentName,
      studentRegNo: incharge.studentRegNo,
      studentEmail: incharge.studentEmail,
      tutorName: incharge.tutorName,
      inchargeName: incharge.yearIncharge,
      reason: tutor.reason,
    };
    handleRequest('/api/hod','POST', payload,'Request accepted successfully.','Failed to accept the request.');
    handleRequest('/api/inchargedelete', 'DELETE', { postId: incharge._id }, '');
    handleRequest('/api/sendInchargeEmail', 'POST', {
      ...payload,
      studentEmail: incharge.studentEmail,
    }, 'Email sent successfully.');
  };

  const handleDecline = (incharge) => {
    handleRequest(
      '/api/inchargedelete',
      'DELETE',
      { postId: incharge._id },
      'Request declined successfully.',
      'Failed to decline the request.'
    );
  };

  if (loading) return <p className="text-center text-gray-500">Loading Requests...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">Incharge Requests</h1>

      {incharges.length === 0 ? (
        <p className="text-center text-2xl text-semibold text-black">No Incharge requests found.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {incharges.map((incharge) => (
            <div
              key={incharge._id}
              className="bg-white shadow-lg rounded-xl p-8 flex justify-between items-start transition-transform transform hover:scale-105"
            >
              <div>
                <h2 className="text-xl font-medium text-gray-900">{incharge.studentName}</h2>
                <p className="text-gray-600">Reg No: {incharge.studentRegNo}</p>
                <p className="text-gray-600">Tutor: {incharge.tutorName}</p>
                <p className="text-gray-600 mt-2">Reason: {incharge.reason}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAccept(incharge)}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleDecline(incharge)}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}