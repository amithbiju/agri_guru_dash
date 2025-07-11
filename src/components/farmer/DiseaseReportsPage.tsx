import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { DiseaseReport } from '../../types';
import { ArrowLeft, Calendar, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface DiseaseReportsPageProps {
  onBack: () => void;
}

const DiseaseReportsPage: React.FC<DiseaseReportsPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [diseaseReports, setDiseaseReports] = useState<DiseaseReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiseaseReports = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getDiseaseReports(farmer.id);
        setDiseaseReports(data);
        setLoading(false);
      }
    };

    fetchDiseaseReports();
  }, [farmer]);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase() || 'unknown') {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase() || 'unknown') {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Activity className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading disease reports...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Disease Reports</h1>
          <p className="text-gray-600">View all your crop disease reports and treatments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Disease Reports ({diseaseReports.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {diseaseReports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No disease reports found</p>
              </div>
            ) : (
              diseaseReports.map((report) => (
                <div key={report.id} className="px-6 py-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.crop_name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{format(report.report_date, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms Observed</h4>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{report.symptoms}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          {getSeverityIcon(report.diagnosis?.severity)}
                          <h4 className="font-medium text-red-800">Diagnosis</h4>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-red-700">Disease:</span>
                            <p className="text-red-900">{report.diagnosis?.disease_name || 'Unknown'}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-red-700">Severity:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.diagnosis?.severity)}`}>
                              {(report.diagnosis?.severity || 'Unknown').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Recommended Treatment</h4>
                        <p className="text-blue-900 text-sm">{report.diagnosis?.treatment || 'No treatment specified'}</p>
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

export default DiseaseReportsPage;