import React, { useContext } from 'react'
import SignupLayout from './SignupLayout'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Profile = () => {
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');

    const [maritalStatus, setMaritalStatus] = useState('');
    const [income, setIncome] = useState('');
    const [experience, setExperience] = useState('');
    const [occupation, setOccupation] = useState('');
    const [settlementPref, setSettlementPref] = useState('');
    const [pepStatus, setPepStatus] = useState('');
    const navigate =useNavigate();

    const handleContinue = async () => {
        const token = localStorage.getItem('token');

        try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/steps/profile`,
            {
  fatherName, motherName, maritalStatus, income,
  experience, occupation, settlementPref, pepStatus
}
,
            {
            headers: {
                Authorization: token,
            },
            }
        );

        
        navigate('/bank');
        } catch (error) {
        console.error('Error updating profile step:', error);
        alert('Something went wrong!');
        }
    };

  return (

    <SignupLayout step={3} title="Profile Details">
  <div className="flex justify-center items-start min-h-[80vh] px-4">
    <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Let's Get to Know You
      </h2>

      {/* Parents’ Names */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Father's Name"
          className="w-full px-4 py-2 border rounded-md placeholder:font-medium"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mother's Name"
          className="w-full px-4 py-2 border rounded-md placeholder:font-medium"
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
        />

      </div>

      <hr className="my-6" />

      {/* Marital Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Marital Status</label>
        <div className="flex gap-4 flex-wrap">
          {['Single', 'Married'].map((status) => (
            <button
              key={status}
              onClick={() => setMaritalStatus(status)}
              className={`px-4 py-2 rounded-full border ${
                maritalStatus === status ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Annual Income */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Annual Income</label>
        <p className="text-sm text-blue-500 mb-2">
          Your account may be blocked if incorrect details are provided
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['>1 Cr', '25L - 1 Cr', '10L - 25L', '5L - 10L', '1L - 5L', '<1 Lakh'].map((bracket) => (
            <button
              key={bracket}
              onClick={() => setIncome(bracket)}
              className={`px-4 py-2 rounded-full border text-sm ${
                income === bracket ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {bracket}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* Trading Experience */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Trading Experience</label>
        <div className="flex flex-wrap gap-3">
          {['New', '1-5 yrs', '5-10 yrs', '10-15 yrs', '15+ yrs'].map((exp) => (
            <button
              key={exp}
              onClick={() => setExperience(exp)}
              className={`px-4 py-2 rounded-full border ${
                experience === exp ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Occupation */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Occupation</label>
        <div className="flex flex-wrap gap-3">
          {[
            'Business',
            'Housewife',
            'Student',
            'Professional',
            'Private Sector',
            'Agriculturist',
            'Government Service',
            'Public Sector',
            'Retired',
            'Others',
          ].map((job) => (
            <button
              key={job}
              onClick={() => setOccupation(job)}
              className={`px-4 py-2 rounded-full border ${
                occupation === job ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {job}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* Running Account Settlement Preference */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Preference for Running Account Settlement
        </label>
        <div className="flex gap-4 flex-wrap">
          {['Quarterly', 'Monthly'].map((pref) => (
            <button
              key={pref}
              onClick={() => setSettlementPref(pref)}
              className={`px-4 py-2 rounded-full border ${
                settlementPref === pref ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* PEP */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Are you a politically exposed person (PEP)?
        </label>
        <div className="space-y-2">
          {['No', 'Yes', 'Related to One'].map((opt) => (
            <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pep"
                value={opt}
                checked={pepStatus === opt}
                onChange={() => setPepStatus(opt)}
                className="peer hidden"
              />
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center peer-checked:bg-blue-600`}
              >
                {pepStatus === opt && <span className="w-2 h-2 rounded-full bg-white"></span>}
              </span>
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleContinue}
          disabled={
        !fatherName ||
        !motherName ||
        !maritalStatus ||
        !income ||
        !experience ||
        !occupation ||
        !settlementPref ||
        !pepStatus
      }

          className={`w-full max-w-xs px-6 py-2 rounded-md text-white font-medium transition ${
            !maritalStatus ||
            !income ||
            !experience ||
            !occupation ||
            !settlementPref ||
            !pepStatus
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</SignupLayout>

    )
}

export default Profile
