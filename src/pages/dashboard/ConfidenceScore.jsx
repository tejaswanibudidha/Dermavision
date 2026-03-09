import React from 'react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const ConfidenceScore = () => {
    const { analysis } = useAnalysisResult();
    const score = analysis.confidence;

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-primary-900 mb-6">AI Confidence Assessment</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-primary-600 mb-2">{score}%</div>
                    <p className="text-secondary-500">Confidence Score</p>
                </div>

                <div className="w-full bg-secondary-100 rounded-full h-4 mb-6 overflow-hidden">
                    <div
                        className="bg-primary-600 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${score}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-3 text-center text-sm text-secondary-500 mb-8">
                    <div>Low</div>
                    <div>Medium</div>
                    <div>High</div>
                </div>

                <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                    <h3 className="font-semibold text-primary-900 mb-2">What does this mean?</h3>
                    <p className="text-primary-800 text-sm">
                        The AI model is <strong>{score}%</strong> confident that the detected condition is {analysis.disease} ({analysis.condition_name}). This score indicates how closely the uploaded image matches learned clinical patterns.
                    </p>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-primary-900 mb-4">Other Possibilities</h3>
                    <div className="space-y-3">
                        {analysis.alternatives.map((option, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                                <span className="text-secondary-700 font-medium">{option.name}</span>
                                <span className="text-secondary-500">{option.confidence}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfidenceScore;
