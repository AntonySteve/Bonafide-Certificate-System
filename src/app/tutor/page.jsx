'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TutorPage() {
  const user = useSelector((state) => state.user);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  


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

  const handleRequest = async (url, method, payload, successMessage) => {
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
    }
  };

  const handleAccept = (tutor) => {
    const payload = {
      studentName: tutor.studentName,
      studentRegNo: tutor.studentRegNo,
      studentEmail: tutor.studentEmail,
      tutorName: tutor.tutorName,
      inchargeName: tutor.yearIncharge,
      inchargeEmail: tutor.inchargeEmail,
      reason: tutor.reason,
    };

    handleRequest('/api/incharge', 'POST', payload, 'Tutor request accepted successfully.');
    handleRequest('/api/tutordelete', 'DELETE', { postid: tutor._id }, 'Request removed.');
    handleRequest('/api/sendTutorEmail', 'POST', {
      ...payload,
      studentEmail: tutor.studentEmail,
    }, 'Email sent successfully.');
  };

  const handleDecline = (id) => {
    handleRequest('/api/tutordelete', 'DELETE', { postid: id }, 'Tutor request declined successfully.');
  };

  if (loading) return <p className="text-center text-xl text-gray-600">Loading tutors...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Tutor Requests</h1>

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
            className="flex justify-between items-center bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex flex-col">
              <p className="text-lg text-gray-800"><strong>Name:</strong> {tutor.studentName}</p>
              <p className="text-lg text-gray-800"><strong>Register No:</strong> {tutor.studentRegNo}</p>
              <p className="text-lg text-gray-800"><strong>Reason:</strong> {tutor.reason}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleAccept(tutor)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(tutor._id)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
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