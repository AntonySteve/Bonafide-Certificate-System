'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '@/components/ui/loader';

export default function HodPage() {
  const user = useSelector((state) => state.user);
  const [hod, setHod] = useState([]);
  const [hodAccepted, setHodAccepted] = useState([]);
  const [hodRejected, setHodRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

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

  const fetchRequest = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tutoracceptreject?email=${encodeURIComponent(user.email)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch incharge requests: ${response.statusText}`);
      }
      const data = await response.json();
      setHodAccepted(data.acceptedRequests || []);
      setHodRejected(data.rejectedRequests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchHod();
    fetchRequest();
  }, [fetchHod, fetchRequest]);

  const handleRequest = async (url, method, body, successMessage, failureMessage) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(failureMessage);

      alert(successMessage);
      fetchHod();
      fetchRequest();
    } catch (error) {
      console.error(failureMessage, error);
      alert(failureMessage);
    }
  };

  const handleAccept = (hodRequest) => {
    const payload = {
      studentName: hodRequest.studentName,
      studentRegNo: hodRequest.studentRegNo,
      studentEmail: hodRequest.studentEmail,
      year: hodRequest.year,
      academicYear: hodRequest.academicYear,
      tutorName: hodRequest.tutorName,
      inchargeName: hodRequest.inchargeName,
      reason: hodRequest.reason,
      fatherName: hodRequest.fatherName
    };

    handleRequest(`/api/acceptedRequest?email=${encodeURIComponent(user.email)}`, 'POST', payload, 'Request accepted successfully.', 'Failed to accept the request.');
    handleRequest('/api/sendHodEmail', 'POST', payload, 'Email sent successfully.', 'Failed to send email.');
    handleRequest('/api/hoddelete', 'DELETE', { postId: hodRequest._id }, 'Request deleted successfully.', 'Failed to delete the request.');
  };

  const handleDecline = (hodRequest) => {
    if (!declineReason) return alert('Please provide a reason for declining.');

    const declinePayload = {
      studentName: hodRequest.studentName,
      studentEmail: hodRequest.studentEmail,
      studentRegNo: hodRequest.studentRegNo,
      year: hodRequest.year,
      academicYear: hodRequest.academicYear,
      tutorName: hodRequest.tutorName,
      inchargeName: hodRequest.inchargeName,
      reason: declineReason,
    };

    handleRequest(`/api/rejectedRequest?email=${encodeURIComponent(user.email)}`, 'POST', declinePayload, 'Request declined successfully.', 'Failed to decline the request.');
    handleRequest('/api/sendHodDeclineEmail', 'POST', declinePayload, 'Decline email sent successfully.', 'Failed to send decline email.');
    handleRequest('/api/hoddelete', 'DELETE', { postId: hodRequest._id }, 'Request removed successfully.', 'Failed to remove request.');

    setShowDeclineInput(null);
    setDeclineReason('');
  };

  if (loading) return <Loader message="Loading HOD requests..." />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const renderRequests = (requests) => (
    requests.length === 0 ? (
      <p className="text-center text-xl text-gray-600">No requests found.</p>
    ) : (
      <div className="space-y-6">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-white shadow-md rounded-lg p-6 flex justify-between items-start"
          >
            <div>
              <h2 className="text-lg font-semibold">{request.studentName}</h2>
              <p className="text-gray-500">Reg No: {request.studentRegNo}</p>
              <p className="text-gray-500">Tutor: {request.tutorName}</p>
              <p className="text-gray-500">Incharge: {request.inchargeName}</p>
              <p className="text-gray-700 mt-2">Reason: {request.reason}</p>

              {showDeclineInput === request._id && (
                <div className="mt-4">
                  <textarea
                    placeholder="Enter reason for decline"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => handleDecline(request)}
                    className="mt-2 px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Submit Decline Reason
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {activeTab === 'pending' && (
                <>
                  <button
                    onClick={() => handleAccept(request)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setShowDeclineInput(request._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">HOD Requests</h1>

      <div className="flex justify-center mb-6">
        {['pending', 'accepted', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 mx-2 rounded-lg ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {activeTab === 'pending' && renderRequests(hod)}
        {activeTab === 'accepted' && renderRequests(hodAccepted)}
        {activeTab === 'rejected' && renderRequests(hodRejected)}
      </div>
    </div>
  );
}
