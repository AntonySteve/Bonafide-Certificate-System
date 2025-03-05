'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '@/components/ui/loader';
import 'react-toastify/dist/ReactToastify.css';

export default function InchargePage() {
  const user = useSelector((state) => state.user);
  const [incharges, setIncharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState({});
  const [showReasonInput, setShowReasonInput] = useState(null);

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

  const handleRequest = async (url, method, payload, successMessage) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed.');
      }

      toast.success(successMessage);
      fetchIncharge();
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const handleAccept = (incharge) => {
    const payload = {
      studentName: incharge.studentName,
      studentRegNo: incharge.studentRegNo,
      studentEmail: incharge.studentEmail,
      year: incharge.year,
      academicYear: incharge.academicYear,
      tutorName: incharge.tutorName,
      inchargeName: incharge.inchargeName,
      reason: incharge.reason,
      fatherName: incharge.fatherName,
    };

    handleRequest('/api/hod', 'POST', payload, 'Request accepted successfully.');
    handleRequest('/api/inchargedelete', 'DELETE', { postId: incharge._id }, '');
    handleRequest('/api/sendInchargeEmail', 'POST', payload, 'Email sent successfully.');
  };

  const handleDecline = (incharge) => {
    if (!declineReason[incharge._id]) {
      toast.error('Please enter a reason for declining.');
      return;
    }

    const payload = {
      studentName: incharge.studentName,
      studentRegNo: incharge.studentRegNo,
      studentEmail: incharge.studentEmail,
      year: incharge.year,
      academicYear: incharge.academicYear,
      tutorName: incharge.tutorName,
      inchargeName: incharge.yearIncharge,
      inchargeEmail: incharge.inchargeEmail,
      reason: declineReason[incharge._id],
      fatherName: incharge.fatherName
    };

    handleRequest('/api/inchargedelete', 'DELETE', { postId: incharge._id }, 'Request declined successfully.');
    handleRequest('/api/sendInchargeDeclineEmail', 'POST', payload, 'Decline email sent successfully.');
    setShowReasonInput(null);
  };

  if (loading) return <Loader className="flex justify-center items-center" />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">Incharge Requests</h1>

      {incharges.length === 0 ? (
        <p className="text-center text-2xl font-semibold text-black">No Incharge requests found.</p>
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
                  className="px-6 py-2 rounded-lg bg-blue-600 cursor-pointer text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Accept
                </button>

                <button
                  onClick={() => setShowReasonInput(incharge._id)}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white cursor-pointer hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  Decline
                </button>
              </div>

              {showReasonInput === incharge._id && (
                <div className="mt-4">
                  <textarea
                    placeholder="Enter reason for decline"
                    value={declineReason[incharge._id] || ''}
                    onChange={(e) => setDeclineReason({ ...declineReason, [incharge._id]: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => handleDecline(incharge)}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Submit Reason
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
