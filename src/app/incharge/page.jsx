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
  const [processing, setProcessing] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [inchargeAccepted, setInchargeAccepted] = useState([]);
  const [inchargeRejected, setInchargeRejected] = useState([]);

  const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  };

  const fetchIncharges = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJSON(`/api/inchargefetch?email=${encodeURIComponent(user.email)}`);
      setIncharges(data.incharges || []);
    } catch (err) {
      console.error('Error fetching incharges:', err);
      setError('Failed to load incharges. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  const fetchRequest = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJSON(`/api/tutoracceptreject?email=${encodeURIComponent(user.email)}`);
      setInchargeAccepted(data.acceptedRequests || []);
      setInchargeRejected(data.rejectedRequests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchIncharges();
    fetchRequest();
  }, [fetchIncharges, fetchRequest]);

  const handleRequest = async (url, method, payload, successMsg, id) => {
    setProcessing((p) => ({ ...p, [id]: true }));
    try {
      await fetchJSON(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      toast.success(successMsg);
      fetchIncharges();
      fetchRequest();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setProcessing((p) => ({ ...p, [id]: false }));
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
    const id = incharge._id;
    handleRequest(
      `/api/acceptedRequest?email=${encodeURIComponent(user.email)}`,
      'POST', payload,
      'Request accepted successfully.', id
    );
    handleRequest('/api/hod', 'POST', payload, 'Forwarded to HOD.', id);
    handleRequest('/api/inchargedelete', 'DELETE', { postid: id }, 'Request removed.', id);
    handleRequest('/api/sendInchargeEmail', 'POST', payload, 'Email sent successfully.', id);
  };

  const handleDeclineClick = (id) => {
    setShowReasonInput((curr) => (curr === id ? null : id));
  };

  const handleDecline = (incharge) => {
    const id = incharge._1d;
    const reason = declineReason[id] || '';
    if (!reason.trim()) {
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
      reason,
      fatherName: incharge.fatherName,
    };
    handleRequest(
      `/api/rejectedRequest?email=${encodeURIComponent(user.email)}`,
      'POST', payload,
      'Request declined successfully.', id
    );
    handleRequest('/api/incharge/delete', 'DELETE', { postid: id }, 'Request removed.', id);
    handleRequest('/api/sendInchargeDeclineEmail', 'POST', payload, 'Decline email sent successfully.', id);
    setShowReasonInput(null);
  };

  if (loading) return <Loader className="flex justify-center items-center" />;

  const getRequestsToDisplay = () => {
    if (activeTab === 'accepted') return inchargeAccepted;
    if (activeTab === 'rejected') return inchargeRejected;
    return incharges;
  };

  const requestsToDisplay = getRequestsToDisplay();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/5 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Tabs</h2>
        <ul className="space-y-2">
          {['all', 'accepted', 'rejected'].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {tab === 'all' ? 'All Requests' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-4/5 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
          {activeTab === 'all' ? 'All Requests' : activeTab === 'accepted' ? 'Accepted Requests' : 'Rejected Requests'}
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6">
          {requestsToDisplay.length === 0 ? (
            <p className="text-center text-gray-500">No requests found.</p>
          ) : (
            requestsToDisplay.map((incharge) => (
              <div key={incharge._id} className="border-b py-4">
                <p><strong>Name:</strong> {incharge.studentName}</p>
                <p><strong>Reg No:</strong> {incharge.studentRegNo}</p>
                <p><strong>Tutor Name:</strong> {incharge.tutorName}</p>
                <p><strong>Reason:</strong> {incharge.reason}</p>

                {activeTab === 'all' && (
                  <>
                    <div className="mt-4 flex space-x-4">
                      <button
                        disabled={processing[incharge._id]}
                        onClick={() => handleAccept(incharge)}
                        className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Accept
                      </button>

                      <button
                        disabled={processing[incharge._id]}
                        onClick={() => handleDeclineClick(incharge._id)}
                        className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>

                    {showReasonInput === incharge._id && (
                      <div className="mt-4">
                        <textarea
                          placeholder="Enter reason for declining..."
                          value={declineReason[incharge._id] || ''}
                          onChange={(e) => setDeclineReason(prev => ({ ...prev, [incharge._id]: e.target.value }))}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => handleDecline(incharge)}
                          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
