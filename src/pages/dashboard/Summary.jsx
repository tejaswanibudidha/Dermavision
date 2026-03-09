import React from 'react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const Summary = () => {
    const { analysis } = useAnalysisResult();

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-primary-900 mb-6">Analysis Summary</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">Clinical Observation</h3>
                    <p className="text-secondary-700 leading-relaxed">
                        {analysis.observation}
                    </p>
                </div>

                <hr className="border-secondary-100" />

                <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">Severity Assessment</h3>
                    <p className="text-secondary-700 leading-relaxed">
                        The condition appears to be of <strong>{analysis.severity}</strong> severity based on uploaded image features and model confidence of <strong>{analysis.confidence}%</strong>.
                    </p>
                </div>

                <hr className="border-secondary-100" />

                <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-2">Recommendation</h3>
                    <p className="text-secondary-700 leading-relaxed">
                        {analysis.recommendation}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Summary;
