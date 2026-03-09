import { useEffect, useState } from 'react';
import { getLatestAnalysis } from '../services/api';

export const defaultAnalysis = {
    disease: 'Eczema',
    condition_name: 'Atopic Dermatitis',
    confidence: 94,
    severity: 'Moderate',
    observation: 'The image shows inflamed and dry patches that are consistent with eczema.',
    summary: 'AI visual features strongly match atopic dermatitis patterns.',
    recommendation: 'Use gentle moisturizers and consult a dermatologist if symptoms persist beyond 7 days.',
    precautions_do: [
        'Moisturize affected skin at least twice daily.',
        'Use fragrance-free cleansers and skincare products.',
        'Wear breathable cotton fabrics.',
        'Keep nails short to reduce skin injury from scratching.',
    ],
    precautions_dont: [
        'Avoid hot showers and harsh soaps.',
        'Do not scratch inflamed areas.',
        'Avoid known irritants and allergens.',
        'Do not self-medicate with steroid creams long-term.',
    ],
    diet_include: [
        'Fatty fish rich in omega-3',
        'Leafy greens and colorful vegetables',
        'Hydrating fruits',
        'Probiotic foods',
    ],
    diet_avoid: [
        'Ultra-processed foods',
        'Excess sugar',
        'Potential personal trigger foods',
    ],
    alternatives: [
        { name: 'Psoriasis', confidence: 4 },
        { name: 'Contact Dermatitis', confidence: 2 },
    ],
    image_name: 'latest-upload.jpg',
};

export default function useAnalysisResult() {
    const [analysis, setAnalysis] = useState(defaultAnalysis);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        async function loadAnalysis() {
            try {
                const latest = await getLatestAnalysis();
                if (mounted) {
                    setAnalysis(latest);
                    setError('');
                }
            } catch (apiError) {
                if (mounted) {
                    setError(apiError.message || 'Unable to load latest analysis. Showing defaults.');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadAnalysis();

        return () => {
            mounted = false;
        };
    }, []);

    return { analysis, loading, error };
}
