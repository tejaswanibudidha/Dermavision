
import React from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const Precautions = () => {
    const { analysis } = useAnalysisResult();

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-primary-900 mb-6">Precautions & Care</h1>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                    <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
                        <ShieldCheck /> Do's
                    </h2>
                    <ul className="space-y-4">
                        {analysis.precautions_do.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                <span className="text-secondary-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-6">
                    <h2 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
                        <XCircle /> Don'ts
                    </h2>
                    <ul className="space-y-4">
                        {analysis.precautions_dont.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                                <span className="text-secondary-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Precautions;
