import React from 'react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const DiseaseName = () => {
    const { analysis } = useAnalysisResult();

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-primary-900 mb-6">Condition Details</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                        {analysis.disease.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-primary-900">{analysis.disease}</h2>
                        <p className="text-secondary-500 text-lg">{analysis.condition_name}</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-secondary-700 leading-relaxed">
                        {analysis.observation}
                    </p>

                    <h3 className="text-lg font-semibold text-primary-900 mt-6 mb-2">Common Symptoms</h3>
                    <ul className="list-disc pl-5 space-y-2 text-secondary-700">
                        {analysis.precautions_do.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DiseaseName;
