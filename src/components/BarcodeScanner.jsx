'use client';
import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeScanner({ onDetected, onClose }) {
    const videoRef = useRef(null);
    const controlsRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let active = true;

        const startScanner = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                console.log('[Scanner] Verfügbare Kameras:', devices);
                const deviceId = devices[0]?.deviceId;

                if (deviceId && active && videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId }
                    });
                    streamRef.current = stream;
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();

                    const controls = await codeReader.decodeFromVideoDevice(
                        deviceId,
                        videoRef.current,
                        (result) => {
                            if (result) {
                                onDetected(result.getText());
                            }
                        }
                    );
                    controlsRef.current = controls;
                }
            } catch (err) {
                console.error('[Scanner] Kamera-Fehler:', err);
            }
        };

        startScanner();

        return () => {
            // Cleanup bei Komponentenausblendung
            active = false;
            if (controlsRef.current?.stop) {
                controlsRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [onDetected]);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 overflow-hidden backdrop-blur-sm bg-white/10 flex items-center justify-center">
            <div className="relative bg-black border-4 border-white rounded-lg overflow-hidden w-4/5 h-3/5 max-w-lg max-h-[70vh]">
                <video ref={videoRef} className="w-full h-full object-cover" />

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-2/3 h-1/3 border-4 border-green-400 rounded-lg shadow-lg" />
                </div>

                <button
                    onClick={() => {
                        if (controlsRef.current?.stop) controlsRef.current.stop();
                        if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => track.stop());
                            streamRef.current = null;
                        }
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
