import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
    const webcamRef = useRef<Webcam>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    };

    // Error handling for webcam access issues (so people can check their permissions if they don't see the preview)
    const handleUserCameraError = (error: string | DOMException) => {
        console.error('Webcam error:', error);
        setError('Unable to access your camera. Please check permissions.');
    };

    return (
        <div className="camera-container">
            {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm">
                    {error}
                </div>
            )}
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
                height={300}
                onUserMediaError={handleUserCameraError}
            />

            <div className="camera-controls flex flex-col items-center mt-4">
                <button
                    onClick={handleCapture}
                    className=" relative h-12 w-12 rounded-full bg-white border-4 border-white/70 shadow-md hover:scale-105 active:scale-95 transition-transform"
                >
                    <div className="h-8 w-8 rounded-full bg-acm-gradient mx-auto" />
                </button>
                <button
                    onClick={onClose}
                    className="mt-3 text-sm text-red-500 hover:text-red-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};