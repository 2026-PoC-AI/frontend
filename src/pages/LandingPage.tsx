import { useNavigate } from 'react-router-dom';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Fake Hunters
                </h1>
                <button
                    onClick={() => navigate('/video')}
                    className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 transition-colors"
                >
                    비디오 딥페이크 탐지
                </button>
            </div>
        </div>
    );
}