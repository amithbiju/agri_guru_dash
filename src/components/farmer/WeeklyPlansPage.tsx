import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { WeeklyPlan } from '../../types';
import { ArrowLeft, Calendar, Cloud, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface WeeklyPlansPageProps {
  onBack: () => void;
}

const WeeklyPlansPage: React.FC<WeeklyPlansPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyPlans = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getWeeklyPlans(farmer.id);
        setWeeklyPlans(data);
        setLoading(false);
      }
    };

    fetchWeeklyPlans();
  }, [farmer]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weekly plans...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Weekly Plans</h1>
          <p className="text-gray-600">View all your weekly farming plans and tasks</p>
        </div>

        <div className="space-y-6">
          {weeklyPlans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No weekly plans found</p>
            </div>
          ) : (
            weeklyPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-green-600" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Week of {format(plan.week_start, 'MMM dd, yyyy')}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {format(startOfWeek(plan.week_start), 'MMM dd')} - {format(endOfWeek(plan.week_start), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {plan.crop_stage}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Cloud className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium text-gray-900">Weather Considerations</h3>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {plan.weather_considerations}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Tasks ({plan.tasks.length})
                      </h3>
                      <div className="space-y-2">
                        {plan.tasks.map((task, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getPriorityIcon(task.priority)}
                              <div>
                                <p className="font-medium text-gray-900">{task.task}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <span>{task.estimated_duration}h</span>
                                  {task.weather_dependent && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                      Weather Dependent
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        ))}
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
  );
};

export default WeeklyPlansPage;