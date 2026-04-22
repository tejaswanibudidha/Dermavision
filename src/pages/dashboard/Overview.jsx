import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const Overview = () => {
    const { analysis, error } = useAnalysisResult();

    const diseaseImageMap = {
        melanoma: 'https://images.unsplash.com/photo-1514751492572-4e1fd377fe07?auto=format&fit=crop&w=400&h=300&q=80',
        nevus: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=400&h=300&q=80',
        bkl: 'https://images.unsplash.com/photo-1600488991457-27df2317b45f?auto=format&fit=crop&w=400&h=300&q=80',
        bcc: 'https://images.unsplash.com/photo-1580490407553-0fb577e0e3d8?auto=format&fit=crop&w=400&h=300&q=80',
        akiec: 'https://images.unsplash.com/photo-1552960473-022b7a5195aa?auto=format&fit=crop&w=400&h=300&q=80',
        df: 'https://images.unsplash.com/photo-1587073956350-0946af055b90?auto=format&fit=crop&w=400&h=300&q=80',
        vasc: 'https://images.unsplash.com/photo-1540569014011-73026803e3ee?auto=format&fit=crop&w=400&h=300&q=80',
        default: 'https://images.unsplash.com/photo-1542736667-069246bdbc82?auto=format&fit=crop&w=400&h=300&q=80',
    };

    const [diseaseImage, setDiseaseImage] = useState(diseaseImageMap.default);
    const [uploadedImage, setUploadedImage] = useState(null);

    useEffect(() => {
        const storedImage = localStorage.getItem('dermavision.latestUploadedImage');
        if (storedImage) {
            setUploadedImage(storedImage);
        }

        if (analysis?.disease) {
            const key = analysis.disease.toLowerCase();
            setDiseaseImage(diseaseImageMap[key] || diseaseImageMap.default);
        } else {
            setDiseaseImage(diseaseImageMap.default);
        }
    }, [analysis]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-primary-900">Analysis Overview</h1>

            {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-6 md:p-8 bg-secondary-50 flex items-center justify-center">
                        <div className="relative rounded-lg overflow-hidden shadow-md">
                            <img
                                src={uploadedImage || diseaseImage}
                                alt={`Sample for ${analysis?.disease ?? 'Skin'} disease`}
                                className="max-w-full h-auto object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = diseaseImageMap.default;
                                }}
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-tl-lg">
                                Best Match Preview
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-primary-900 mb-4">Detection Result</h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <span className="text-sm text-secondary-500 block">Identified Condition</span>
                                <span className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                                    {analysis.disease} ({analysis.condition_name})
                                    <CheckCircle size={20} className="text-green-500" />
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-secondary-500 block">Confidence Score</span>
                                    <span className="text-lg font-semibold text-primary-900">{analysis.confidence}%</span>
                                </div>
                                <div>
                                    <span className="text-sm text-secondary-500 block">Severity Levels</span>
                                    <span className="text-lg font-semibold text-orange-500">{analysis.severity}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-sm text-secondary-500 block">Overview</span>
                                <p className="text-sm text-primary-700">{analysis.overview || analysis.observation}</p>
                            </div>

                            <p className="text-sm text-secondary-500">Image: {analysis.image_name}</p>
                        </div>

                        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
                            <div className="flex gap-3">
                                <AlertCircle className="text-primary-500 flex-shrink-0" size={20} />
                                <p className="text-sm text-primary-700">
                                    This analysis is generated by AI and should not be considered a final medical diagnosis. Please consult a dermatologist for professional advice.
                                </p>
                            </div>
                        </div>

                        <Link to="/dashboard/summary" className="btn btn-primary w-full sm:w-auto">
                            View Detailed Report <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
