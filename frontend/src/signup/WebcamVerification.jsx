import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import SignupLayout from './SignupLayout';
import axios from 'axios';
import tick from '@/assets/tick.png'; 

const WebcamVerification = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: 'user',
  };

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  const handleContinue = () => {
    setShowModal(true);
  };

  const handleFinalContinue = async() => {
    const token = localStorage.getItem('token')
    try{
        const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/steps/webcam`,
        { },
        {
          headers: {
            Authorization: token,
          },
        }
      );
        setShowModal(false);
        navigate('/finalize');
    }
    
    catch(error){
        console.error('Error updating webcam step:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <SignupLayout step={5} title="Webcam Verification">
        <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Webcam Verification</h2>

      <ul className="text-sm text-left mb-6 list-disc list-inside text-gray-600">
        <li>Ensure you're in a well-lit space and your face is clearly visible.</li>
        <li>Please remove any spectacles, hats, or masks before proceeding.</li>
      </ul>

      {!imageSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="mx-auto rounded border"
          />
          <button
            onClick={capture}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Capture
          </button>
        </>
      ) : (
        <>
          <img src={imageSrc} alt="Captured" className="mx-auto rounded border mb-4" />
          <div className="flex justify-center gap-4">
            <button
              onClick={handleContinue}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Continue
            </button>
            <button
              onClick={() => setImageSrc(null)}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Re-capture
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 text-center w-80">
            <h3 className="text-xl font-semibold mb-2 text-green-600">Verified </h3>
            <p className="text-sm text-gray-700 mb-4">Your face has been verified successfully.</p>
            <img
              src={tick}
              alt="Verified"
              className="mx-auto rounded border mb-4 w-48 h-auto"
            />
            <button
              onClick={handleFinalContinue}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Create Password
            </button>
          </div>
        </div>
      )}
    </div>
    </SignupLayout>
  );
};

export default WebcamVerification;
