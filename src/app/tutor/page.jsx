'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '@/components/ui/loader';


function RequestCard({
  tutor,
  showActions,
  processing,
  showDecline,
  declineReason,
  inlineError,
  onAccept,
  onDeclineClick,
  onDeclineChange,
  onDeclineSubmit,
}) {
  return (
    <div className="border-b py-4" aria-busy={processing}>
      <p><strong>Name:</strong> {tutor.studentName}</p>
      <p><strong>Register No:</strong> {tutor.studentRegNo}</p>
      <p><strong>Reason:</strong> {tutor.reason}</p>

      {showActions && (
        <>
          <div className="mt-4 flex space-x-4">
            <button
              disabled={processing}
              onClick={onAccept}
              className={`px-4 py-2 rounded-lg cursor-pointer text-white ${
                processing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {processing ? 'Processing…' : 'Accept'}
            </button>

            <button
              disabled={processing}
              onClick={onDeclineClick}
              className={`px-4 py-2 rounded-lg cursor-pointer text-white ${
                processing ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Decline
            </button>
          </div>

          {showDecline && (
            <div className="mt-4">
              <textarea
                placeholder="Enter reason for declining..."
                value={declineReason}
                onChange={onDeclineChange}
                className={`w-full p-2 border rounded-lg ${
                  inlineError ? 'border-red-500' : ''
                }`}
              />
              {inlineError && (
                <p className="text-red-500 text-sm mt-1">{inlineError}</p>
              )}
              <button
                disabled={processing}
                onClick={onDeclineSubmit}
                className={`mt-2 px-4 py-2 rounded-lg text-white ${
                  processing ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {processing ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TutorPage() {
  const user = useSelector((state) => state.user);

  // Separate loading & error states
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorTutors, setErrorTutors] = useState(null);
  const [errorRequests, setErrorRequests] = useState(null);

  const [tutors, setTutors] = useState([]);
  const [tutorAccepted, setTutorAccepted] = useState([]);
  const [tutorRejected, setTutorRejected] = useState([]);

  // Decline reasons & UI state
  const [declineReason, setDeclineReason] = useState({});
  const [declineError, setDeclineError] = useState({});
  const [showReasonInput, setShowReasonInput] = useState(null);

  // Tracks in-flight requests per tutor ID
  const [processing, setProcessing] = useState({});

  const [activeTab, setActiveTab] = useState('all');

  // Utility fetch wrappers
  const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  };

  // Fetch all tutor requests
  const fetchTutors = useCallback(async () => {
    if (!user?.email) return;
    setLoadingTutors(true);
    setErrorTutors(null);
    try {
      const data = await fetchJSON(
        `/api/retrieve?email=${encodeURIComponent(user.email)}`
      );
      setTutors(data.tutors || []);
    } catch (err) {
      console.error('Error fetching tutors:', err);
      setErrorTutors('Failed to load tutors.');
    } finally {
      setLoadingTutors(false);
    }
  }, [user?.email]);

  // Fetch accepted/rejected state
  const fetchRequests = useCallback(async () => {
    if (!user?.email) return;
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      const data = await fetchJSON(
        `/api/tutoracceptreject?email=${encodeURIComponent(user.email)}`
      );
      setTutorAccepted(data.acceptedRequests || []);
      setTutorRejected(data.rejectedRequests || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setErrorRequests('Failed to load request statuses.');
    } finally {
      setLoadingRequests(false);
    }
  }, [user?.email]);


  useEffect(() => {
    fetchTutors();
    fetchRequests();
  }, [fetchTutors, fetchRequests]);


  const refetchAll = () => {
    fetchTutors();
    fetchRequests();
  };

  // Handler for accepting
  const handleAccept = async (tutor) => {
    const id = tutor._id;
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

    setProcessing((p) => ({ ...p, [id]: true }));
    try {
      // Chain calls in order
      await fetchJSON(
        `/api/acceptedRequest?email=${encodeURIComponent(user.email)}`,
        { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }
      );
      await fetchJSON('/api/incharge', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      await fetchJSON('/api/tutordelete', { method: 'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ postid: id }) });
      await fetchJSON('/api/sendTutorEmail', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });

      toast.success('Tutor request accepted successfully.');
      refetchAll();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setProcessing((p) => ({ ...p, [id]: false }));
    }
  };

  const handleDeclineClick = (id) => {
    setShowReasonInput((curr) => (curr === id ? null : id));
    setDeclineError((e) => ({ ...e, [id]: '' }));
  };

  const handleDeclineSubmit = async (tutor) => {
    const id = tutor._id;
    const reason = declineReason[id] || '';
    if (!reason.trim()) {
      setDeclineError((e) => ({ ...e, [id]: 'Reason is required.' }));
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
      reason,
      fatherName: tutor.fatherName,
    };

    setProcessing((p) => ({ ...p, [id]: true }));
    try {
      await fetchJSON(
        `/api/rejectedRequest?email=${encodeURIComponent(user.email)}`,
        { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }
      );
      await fetchJSON('/api/tutordelete', { method: 'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ postid: id }) });
      await fetchJSON('/api/sendTutorDeclineEmail', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });

      toast.success('Tutor request declined.');
      setShowReasonInput(null);
      refetchAll();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setProcessing((p) => ({ ...p, [id]: false }));
    }
  };

  const getRequests = () => {
    if (activeTab === 'accepted') return tutorAccepted;
    if (activeTab === 'rejected') return tutorRejected;
    return tutors;
  };

  const requestsToDisplay = getRequests();
  const isLoading = loadingTutors || loadingRequests;
  const hasError = errorTutors || errorRequests;

  if (isLoading) return <Loader className="flex justify-center items-center" />;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Tabs */}
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

      {/* Main Content */}
      <div className="w-4/5 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">
          {activeTab === 'all'
            ? 'All Requests'
            : activeTab === 'accepted'
            ? 'Accepted Requests'
            : 'Rejected Requests'}
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-6">
          {hasError && (
            <p className="text-center text-red-500 mb-4">
              {errorTutors || errorRequests}
            </p>
          )}

          {requestsToDisplay.length === 0 ? (
            <p className="text-center text-gray-500">No requests found.</p>
          ) : (
            requestsToDisplay.map((tutor) => (
              <RequestCard
                key={tutor._id}
                tutor={tutor}
                showActions={activeTab === 'all'}
                processing={!!processing[tutor._id]}
                showDecline={showReasonInput === tutor._id}
                declineReason={declineReason[tutor._id] || ''}
                inlineError={declineError[tutor._id]}
                onAccept={() => handleAccept(tutor)}
                onDeclineClick={() => handleDeclineClick(tutor._id)}
                onDeclineChange={(e) =>
                  setDeclineReason((prev) => ({
                    ...prev,
                    [tutor._id]: e.target.value,
                  }))
                }
                onDeclineSubmit={() => handleDeclineSubmit(tutor)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
