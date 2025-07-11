import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { Reminder } from '../../types';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface RemindersPageProps {
  onBack: () => void;
}

const RemindersPage: React.FC<RemindersPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getReminders(farmer.id);
        setReminders(data);
        setLoading(false);
      }
    };

    fetchReminders();
  }, [farmer]);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM dd, yyyy');
  };

  const getDateColor = (date: Date, isCompleted: boolean) => {
    if (isCompleted) return 'text-green-600 bg-green-50';
    if (isPast(date) && !isToday(date)) return 'text-red-600 bg-red-50';
    if (isToday(date)) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusIcon = (date: Date, isCompleted: boolean) => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isPast(date) && !isToday(date)) return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-blue-500" />;
  };

  const completedReminders = reminders.filter(r => r.is_completed);
  const pendingReminders = reminders.filter(r => !r.is_completed);
  const overdueReminders = pendingReminders.filter(r => isPast(r.date_time) && !isToday(r.date_time));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reminders...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600">Manage your farming tasks and reminders</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-900">{pendingReminders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{overdueReminders.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedReminders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Reminders ({reminders.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reminders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reminders found</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(reminder.date_time, reminder.is_completed)}
                      <div>
                        <h3 className="font-medium text-gray-900">{reminder.task}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{format(reminder.date_time, 'MMM dd, yyyy')}</span>
                          <span>•</span>
                          <span>{format(reminder.date_time, 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDateColor(reminder.date_time, reminder.is_completed)}`}>
                        {reminder.is_completed ? 'Completed' : getDateLabel(reminder.date_time)}
                      </span>
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

export default RemindersPage;