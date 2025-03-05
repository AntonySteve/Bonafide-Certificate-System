'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '@/components/ui/loader';

export default function HodPage() {
  const user = useSelector((state) => state.user);
  const [hod, setHod] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const fetchHod = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/hodfetch', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch HOD requests');
      }

      const data = await response.json();
      setHod(data.hod || []);
    } catch (err) {
      console.error('Error fetching HOD requests:', err);
      setError('Failed to load HOD requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchHod();
  }, [fetchHod]);

  const handleRequest = async (url, method, body, successMessage, failureMessage, actionId) => {
    setLoadingAction(actionId);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(failureMessage);

      alert(successMessage);
      fetchHod();
    } catch (error) {
      console.error(failureMessage, error);
      alert(failureMessage);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAccept = (hodRequest) => {
    const payload = {
      studentName: hodRequest.studentName,
      studentRegNo: hodRequest.studentRegNo,
      studentEmail: hodRequest.studentEmail,
      year: hodRequest.year,
      academicYear: hodRequest.academicYear,
      inchargeName: hodRequest.inchargeName,
      reason: hodRequest.reason,
      fatherName: hodRequest.fatherName
    };
    handleRequest('/api/sendHodEmail', 'POST', payload, 'Email sent successfully.', '', hodRequest._id + '-accept');
    handleRequest('/api/hoddelete', 'DELETE', { postId: hodRequest._id }, '', '', hodRequest._id + '-delete');
  };

  const handleDecline = (hodRequest) => {
    if (!declineReason) return alert('Please provide a reason for declining.');

    const declinePayload = {
      studentName: hodRequest.studentName,
      studentEmail: hodRequest.studentEmail,
      studentRegNo: hodRequest.studentRegNo,
      year: hodRequest.year,
      academicYear: hodRequest.academicYear,
      inchargeName: hodRequest.inchargeName,
      reason: declineReason,
    };

    handleRequest('/api/sendHodDeclineEmail', 'POST', declinePayload, 'Decline email sent successfully.', 'Failed to send decline email.', hodRequest._id + '-decline');
    handleRequest('/api/hoddelete', 'DELETE', { postId: hodRequest._id }, 'Request declined successfully.', 'Failed to decline the request.', hodRequest._id + '-delete');

    setShowDeclineInput(null);
    setDeclineReason('');
  };

  if (loading) return <Loader message="Loading HOD requests..." />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">HOD Requests</h1>

      {hod.length === 0 ? (
        <p className="text-center text-2xl text-semibold text-black">No HOD requests found.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {hod.map((hodRequest) => (
            <div
              key={hodRequest._id}
              className="bg-white shadow-lg rounded-xl p-8 flex justify-between items-start transition-transform transform hover:scale-102"
            >
              <div>
                <h2 className="text-xl font-medium text-gray-900">{hodRequest.studentName}</h2>
                <p className="text-gray-600">Reg No: {hodRequest.studentRegNo}</p>
                <p className="text-gray-600">Tutor: {hodRequest.tutorName}</p>
                <p className="text-gray-600">Incharge: {hodRequest.inchargeName}</p>
                <p className="text-gray-600 mt-2">Reason: {hodRequest.reason}</p>

                {showDeclineInput === hodRequest._id && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Enter reason for decline"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <button
                      onClick={() => handleDecline(hodRequest)}
                      disabled={loadingAction === hodRequest._id + '-decline'}
                      className="mt-2 px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
                    >
                      {loadingAction === hodRequest._id + '-decline' ? 'Declining...' : 'Submit Decline Reason'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAccept(hodRequest)}
                  disabled={loadingAction === hodRequest._id + '-accept'}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {loadingAction === hodRequest._id + '-accept' ? 'Accepting...' : 'Accept'}
                </button>

                <button
                  onClick={() => setShowDeclineInput(hodRequest._id)}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
