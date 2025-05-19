'use client';

import React, { useEffect, useRef } from 'react';

export default function ImageScanner({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                if (!mounted) return;

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }

                // Scroll blockieren
                document.body.style.overflow = 'hidden';
            } catch (err) {
                console.error('getUserMedia-Fehler:', err);
                onClose();
            }
        };

        startCamera();

        return () => {
            mounted = false;
            stopCamera();
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const stopCamera = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const capture = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            if (blob) {
                onCapture(new File([blob], 'mhd.jpg', { type: blob.type }));
            }
        }, 'image/jpeg');
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden backdrop-blur-sm bg-white/10 flex items-center justify-center">
            <div className="relative bg-black border-4 border-white rounded-lg overflow-hidden w-4/5 h-3/5 max-w-lg max-h-[70vh]">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover bg-transparent"
                    muted
                    playsInline
                />

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-2/3 h-1/3 border-4 border-green-400 rounded-lg shadow-lg" />
                </div>

                <button
                    onClick={capture}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full shadow-md text-white text-xl"
                >
                    📸
                </button>

                <button
                    onClick={() => {
                        stopCamera();
                        onClose();
                    }}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                >
                    ❌
                </button>
            </div>
        </div>
    );
}
