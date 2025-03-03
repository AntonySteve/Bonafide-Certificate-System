'use client';

import React from 'react';
import { useSelector } from 'react-redux';

export default function TutorPage() {
  const user = useSelector((state) => state.user);

  const handleAccept = (id) => {
    console.log("Accepted tutor with ID:", id);  
  };

  const handleDecline = (id) => {
    console.log("Declined tutor with ID:", id); 
  };

  const tutors = [
    {
      _id: '1',
      tutorName: 'Karthik Raja',
      tutorEmail: 'karthik@psnacet.edu.in',
      reason: 'Educational Loan',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      

      {tutors.map((tutor) => (
        <div key={tutor._id} className="flex justify-evenly items-center" style={{
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#696969',
        }}>
          <p className='text-white'><strong>Name:</strong> Karthik Raja </p>
          <p className='text-white'><strong>Register No:</strong> 92132213084</p>
          <p className='text-white'><strong>Reason:</strong> Educational Loan</p>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleAccept(tutor._id)}
              style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white' }}>
              Accept
            </button>
            <button onClick={() => handleDecline(tutor._id)}
              style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white' }}
              className='flex-col align-center'
              >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}