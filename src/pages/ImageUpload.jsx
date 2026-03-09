import React, { useEffect, useRef, useState } from 'react';
import { Upload, X, FileImage, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { analyzeImage } from '../services/api';

const MAX_SAMPLES = 4;

const ImageUpload = () => {
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [samples, setSamples] = useState(Array(MAX_SAMPLES).fill(null));
    const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        return () => {
            samples.forEach((sample) => {
                if (sample?.previewUrl) {
                    URL.revokeObjectURL(sample.previewUrl);
                }
            });
        };
    }, [samples]);

    const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
            setError('');

            setSamples((previousSamples) => {
                const emptySlotIndex = previousSamples.findIndex((sample) => sample === null);
                if (emptySlotIndex === -1) {
                    setError('You can upload only 4 images. Remove one sample to add a new image.');
                    return previousSamples;
                }

                const previewUrl = URL.createObjectURL(file);
                const updated = [...previousSamples];
                updated[emptySlotIndex] = {
                    id: Date.now() + emptySlotIndex,
                    file,
                    previewUrl,
                    name: file.name,
                };
                setSelectedSampleIndex(emptySlotIndex);
                return updated;
            });
        } else {
            alert("Please upload an image file");
        }
    };

    const removeSample = (index) => {
        setSamples((previousSamples) => {
            const updated = [...previousSamples];
            const removed = updated[index];
            if (removed?.previewUrl) {
                URL.revokeObjectURL(removed.previewUrl);
            }
            updated[index] = null;

            if (selectedSampleIndex === index) {
                const nextSelected = updated.findIndex((sample) => sample !== null);
                setSelectedSampleIndex(nextSelected === -1 ? null : nextSelected);
            }

            return updated;
        });
        setError('');
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = async () => {
        const selectedSample = selectedSampleIndex !== null ? samples[selectedSampleIndex] : null;

        if (!selectedSample?.file) {
            setError('Please upload and select an image sample to analyze.');
            return;
        }

        try {
            setIsAnalyzing(true);
            setError('');
            // Backend connection: send the selected image for analysis.
            await analyzeImage(selectedSample.file);
            navigate('/dashboard');
        } catch (apiError) {
            setError(apiError.message || 'Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const uploadedCount = samples.filter((sample) => sample !== null).length;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Side: Upload Box */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Upload Skin Image</h1>
                        <p className="text-slate-600 mb-8">Upload a clear image of the affected skin area for instant AI analysis.</p>

                        <div
                            className={clsx(
                                "border-2 border-dashed rounded-xl p-8 text-center transition-colors h-64 flex flex-col items-center justify-center cursor-pointer",
                                dragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-primary-400 hover:bg-slate-50",
                                uploadedCount > 0 ? "bg-slate-50 border-solid" : ""
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                                accept="image/jpeg,image/png,image/jpg"
                            />

                            <>
                                <div className="bg-primary-100 p-4 rounded-full text-primary-600 mb-4">
                                    <Upload size={32} />
                                </div>
                                <p className="text-slate-900 font-medium text-lg">Click to upload or drag and drop</p>
                                <p className="text-slate-500 mt-2">JPG, PNG, JPEG (up to 4 images)</p>
                                <p className="text-xs text-slate-500 mt-3">Uploaded: {uploadedCount}/{MAX_SAMPLES}</p>
                            </>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={handleSubmit}
                                className="w-full btn btn-primary py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isAnalyzing || uploadedCount === 0}
                            >
                                {isAnalyzing ? 'Analyzing...' : 'Analyze the Samples'}
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
                        </div>
                    </div>
                </div>

                {/* Right Side: Samples and Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <FileImage size={20} className="text-primary-600" />
                            Sample Images
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {samples.map((sample, index) => (
                                <div
                                    key={index}
                                    className={clsx(
                                        "aspect-square rounded-lg overflow-hidden relative border-2 transition-all",
                                        sample ? "bg-white border-slate-200" : "bg-slate-100 border-transparent",
                                        selectedSampleIndex === index ? "ring-2 ring-primary-500 border-primary-400" : ""
                                    )}
                                >
                                    {sample ? (
                                        <>
                                            <img
                                                src={sample.previewUrl}
                                                alt={`Sample ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onClick={() => setSelectedSampleIndex(index)}
                                            />
                                            <button
                                                onClick={() => setSelectedSampleIndex(index)}
                                                className="absolute left-2 bottom-2 text-[10px] font-semibold px-2 py-1 rounded-full bg-black/60 text-white"
                                            >
                                                {selectedSampleIndex === index ? 'Selected' : `Sample ${index + 1}`}
                                            </button>
                                            <button
                                                onClick={() => removeSample(index)}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md border border-slate-200 hover:bg-red-50 text-red-500"
                                                aria-label={`Remove sample ${index + 1}`}
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium">
                                            Sample {index + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            * Upload up to 4 images. Click any sample to select it for analysis. Use X to remove and re-upload.
                        </p>
                    </div>

                    <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                        <h3 className="font-semibold text-primary-900 mb-2 flex items-center gap-2">
                            <CheckCircle size={20} />
                            Best Practices
                        </h3>
                        <ul className="space-y-2 text-sm text-primary-800">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></span>
                                Ensure good lighting when taking the photo.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></span>
                                Keep the affected area in main focus.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></span>
                                Avoid using filters or digital enhancements.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
