'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '@/components/ui/loader';

export default function TutorPage() {
  const user = useSelector((state) => state.user);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState({});
  const [showReasonInput, setShowReasonInput] = useState(null);
  const [processing, setProcessing] = useState({});

  const fetchTutors = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/retrieve?email=${encodeURIComponent(user.email)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tutors: ${response.statusText}`);
      }
      const data = await response.json();
      setTutors(data.tutors || []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Failed to load tutors. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const handleRequest = async (url, method, payload, successMessage, tutorId) => {
    setProcessing((prev) => ({ ...prev, [tutorId]: true }));
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed.');
      }

      toast.success(successMessage);
      fetchTutors();
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error(error.message || 'An error occurred. Please try again later.');
    } finally {
      setProcessing((prev) => ({ ...prev, [tutorId]: false }));
    }
  };

  const handleAccept = (tutor) => {
    const payload = {
      studentName: tutor.studentName,
      studentRegNo: tutor.studentRegNo,
      studentEmail: tutor.studentEmail,
      year: tutor.year,
      academicYear: tutor.academicYear,
      tutorName: tutor.tutorName,
      inchargeName: tutor.yearIncharge,
      inchargeEmail: tutor.inchargeEmail,
      reason: tutor.reason,
      fatherName: tutor.fatherName,
    };

    handleRequest('/api/incharge', 'POST', payload, 'Tutor request accepted successfully.', tutor._id);
    handleRequest('/api/tutordelete', 'DELETE', { postid: tutor._id }, 'Request removed.', tutor._id);
    handleRequest('/api/sendTutorEmail', 'POST', payload, 'Email sent successfully.', tutor._id);
  };

  const handleDecline = (tutor) => {
    if (!declineReason[tutor._id]) {
      toast.error('Please enter a reason for declining.');
      return;
    }

    const payload = {
      studentName: tutor.studentName,
      studentRegNo: tutor.studentRegNo,
      studentEmail: tutor.studentEmail,
      year: tutor.year,
      academicYear: tutor.academicYear,
      tutorName: tutor.tutorName,
      inchargeName: tutor.yearIncharge,
      inchargeEmail: tutor.inchargeEmail,
      reason: declineReason[tutor._id],
      fatherName: tutor.fatherName,
    };

    handleRequest('/api/tutordelete', 'DELETE', { postid: tutor._id }, 'Tutor request declined successfully.', tutor._id);
    handleRequest('/api/sendTutorDeclineEmail', 'POST', payload, 'Decline email sent successfully.', tutor._id);
    setShowReasonInput(null);
  };

  if (loading) return <Loader className="flex justify-center items-center" />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">Tutor Requests</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg shadow">
          {error}
          <button
            onClick={fetchTutors}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Retry
          </button>
        </div>
      )}

      {tutors.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No Requests found.</p>
      ) : (
        tutors.map((tutor) => (
          <div
            key={tutor._id}
            className="bg-white mt-8 shadow-lg rounded-xl p-8 flex justify-between items-start transition-transform transform hover:scale-102"
          >
            <p className="text-lg text-gray-800"><strong>Name:</strong> {tutor.studentName}</p>
            <p className="text-lg text-gray-800"><strong>Register No:</strong> {tutor.studentRegNo}</p>
            <p className="text-lg text-gray-800"><strong>Reason:</strong> {tutor.reason}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleAccept(tutor)}
                disabled={processing[tutor._id]}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                {processing[tutor._id] ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={() => setShowReasonInput(tutor._id)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Decline
              </button>
            </div>

            {showReasonInput === tutor._id && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter reason for declining..."
                  value={declineReason[tutor._id] || ''}
                  onChange={(e) => setDeclineReason({ ...declineReason, [tutor._id]: e.target.value })}
                />
                <button
                  onClick={() => handleDecline(tutor)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit Reason
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}