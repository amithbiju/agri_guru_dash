import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { CropDecision } from '../../types';
import { ArrowLeft, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CropDecisionsPageProps {
  onBack: () => void;
}

const CropDecisionsPage: React.FC<CropDecisionsPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [decisions, setDecisions] = useState<CropDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getCropDecisions(farmer.id);
        setDecisions(data);
        setLoading(false);
      }
    };

    fetchDecisions();
  }, [farmer]);

  const getResultIcon = (result: string) => {
    const lowerResult = result.toLowerCase();
    if (lowerResult.includes('success') || lowerResult.includes('good') || lowerResult.includes('positive')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (lowerResult.includes('fail') || lowerResult.includes('bad') || lowerResult.includes('negative')) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getResultColor = (result: string) => {
    const lowerResult = result.toLowerCase();
    if (lowerResult.includes('success') || lowerResult.includes('good') || lowerResult.includes('positive')) {
      return 'bg-green-50 border-green-200 text-green-800';
    } else if (lowerResult.includes('fail') || lowerResult.includes('bad') || lowerResult.includes('negative')) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop decisions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Crop Decisions</h1>
          <p className="text-gray-600">View all your crop decision history and outcomes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Decisions ({decisions.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {decisions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No crop decisions found</p>
              </div>
            ) : (
              decisions.map((decision) => (
                <div key={decision.id} className="px-6 py-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {decision.event}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{format(decision.timestamp, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Decision Made:</p>
                        <p className="text-gray-900 font-medium">{decision.decision}</p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          {getResultIcon(decision.result)}
                          <span className="text-sm font-medium text-gray-700">Result:</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getResultColor(decision.result)}`}>
                          {decision.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDecisionsPage;