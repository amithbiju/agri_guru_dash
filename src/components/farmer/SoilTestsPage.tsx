import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { SoilTest } from '../../types';
import { ArrowLeft, Calendar, Thermometer, Droplets, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

interface SoilTestsPageProps {
  onBack: () => void;
}

const SoilTestsPage: React.FC<SoilTestsPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoilTests = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getSoilTests(farmer.id);
        setSoilTests(data);
        setLoading(false);
      }
    };

    fetchSoilTests();
  }, [farmer]);

  const getPHColor = (pH: number) => {
    if (pH < 6.0) return 'text-red-600 bg-red-50';
    if (pH > 8.0) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getPHStatus = (pH: number) => {
    if (pH < 6.0) return 'Acidic';
    if (pH > 8.0) return 'Alkaline';
    return 'Optimal';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading soil tests...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Soil Tests</h1>
          <p className="text-gray-600">View all your soil test results and recommendations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Soil Tests ({soilTests.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {soilTests.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Thermometer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No soil tests found</p>
              </div>
            ) : (
              soilTests.map((test) => (
                <div key={test.id} className="px-6 py-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {test.crop_type} - {test.soil_type}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{format(test.test_date, 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-700">pH Level</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPHColor(test.pH)}`}>
                          {test.pH} ({getPHStatus(test.pH)})
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Droplets className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-700">Organic Matter</span>
                        </div>
                        <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
                          {test.organic_matter}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800">Recommendations</h4>
                      </div>
                      <p className="text-yellow-700 text-sm mb-2">{test.recommendations.advice}</p>
                      {test.recommendations.fertilizer_needed && (
                        <div className="inline-flex items-center px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">
                          Fertilizer Recommended
                        </div>
                      )}
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

export default SoilTestsPage;