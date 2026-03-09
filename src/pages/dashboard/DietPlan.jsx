import React from 'react';
import { Apple, Coffee, Fish, Wheat } from 'lucide-react';
import useAnalysisResult from '../../hooks/useAnalysisResult';

const DietPlan = () => {
    const { analysis } = useAnalysisResult();

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-primary-900 mb-6">Recommended Diet</h1>

            <p className="text-secondary-600 mb-8">
                Diet can play a significant role in managing skin conditions. Here are some anti-inflammatory foods recommended for eczema-prone skin.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recommended Foods */}
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <h2 className="text-lg font-bold text-emerald-800 mb-4">Foods to Include</h2>
                    <div className="space-y-4">
                        {analysis.diet_include.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    {idx % 2 === 0 ? <Fish size={24} /> : <Apple size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary-800">{item}</h3>
                                    <p className="text-sm text-secondary-600">Supports anti-inflammatory skin care goals.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Foods to Avoid */}
                <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                    <h2 className="text-lg font-bold text-rose-800 mb-4">Foods to Limit</h2>
                    <div className="space-y-4">
                        {analysis.diet_avoid.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                                <div className="bg-rose-100 w-12 h-12 rounded-lg flex items-center justify-center text-rose-600 flex-shrink-0">
                                    {idx % 2 === 0 ? <Wheat size={24} /> : <Coffee size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary-800">{item}</h3>
                                    <p className="text-sm text-secondary-600">May trigger or worsen skin inflammation in sensitive users.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DietPlan;
