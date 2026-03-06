import React, { useRef } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
    const webcamRef = useRef<Webcam>(null);

    const handleCapture = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    };

    return (
        <div className="camera-container">
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={500}
                height={300}
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