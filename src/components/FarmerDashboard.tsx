import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { 
  BarChart3, 
  Thermometer, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  LogOut,
  User,
  MapPin,
  Sprout,
  Clock,
  HelpCircle
} from 'lucide-react';
import CropDecisionChart from './charts/CropDecisionChart';
import SoilTestChart from './charts/SoilTestChart';
import PriceChart from './charts/PriceChart';
import CropDecisionsPage from './farmer/CropDecisionsPage';
import SoilTestsPage from './farmer/SoilTestsPage';
import PriceQueriesPage from './farmer/PriceQueriesPage';
import DiseaseReportsPage from './farmer/DiseaseReportsPage';
import WeeklyPlansPage from './farmer/WeeklyPlansPage';
import RemindersPage from './farmer/RemindersPage';

const FarmerDashboard: React.FC = () => {
  const { farmer, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getFarmerData(farmer.id);
        setDashboardData(data);
        setLoading(false);
      }
    };

    fetchData();
  }, [farmer]);

  const renderPage = () => {
    switch (currentPage) {
      case 'crop-decisions':
        return <CropDecisionsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'soil-tests':
        return <SoilTestsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'price-queries':
        return <PriceQueriesPage onBack={() => setCurrentPage('dashboard')} />;
      case 'disease-reports':
        return <DiseaseReportsPage onBack={() => setCurrentPage('dashboard')} />;
      case 'weekly-plans':
        return <WeeklyPlansPage onBack={() => setCurrentPage('dashboard')} />;
      case 'reminders':
        return <RemindersPage onBack={() => setCurrentPage('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Crop Decisions',
      value: dashboardData?.cropDecisions?.length || 0,
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      label: 'Soil Tests',
      value: dashboardData?.soilTests?.length || 0,
      icon: Thermometer,
      color: 'bg-green-500'
    },
    {
      label: 'Price Queries',
      value: dashboardData?.priceQueries?.length || 0,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      label: 'Disease Reports',
      value: dashboardData?.diseaseReports?.length || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      onClick: () => setCurrentPage('disease-reports')
    },
    {
      label: 'Weekly Plans',
      value: dashboardData?.weeklyPlans?.length || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      onClick: () => setCurrentPage('weekly-plans')
    },
    {
      label: 'Reminders',
      value: dashboardData?.reminders?.length || 0,
      icon: Clock,
      color: 'bg-indigo-500',
      onClick: () => setCurrentPage('reminders')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Farmer Dashboard</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {farmer?.name}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {farmer?.place}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Farm Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Farm Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Land Size</p>
                <p className="text-lg font-semibold text-gray-900">{farmer?.land_size} acres</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Soil Type</p>
                <p className="text-lg font-semibold text-gray-900">{farmer?.soil_type}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-lg font-semibold text-gray-900">{farmer?.experience_years} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-semibold text-gray-900">{farmer?.age} years</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Crops Grown</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {farmer?.crops_grown?.map((crop, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dashboardData?.cropDecisions?.length > 0 && (
            <CropDecisionChart decisions={dashboardData.cropDecisions} />
          )}
          
          {dashboardData?.soilTests?.length > 0 && (
            <SoilTestChart soilTests={dashboardData.soilTests} />
          )}
          
          {dashboardData?.priceQueries?.length > 0 && (
            <PriceChart priceQueries={dashboardData.priceQueries} />
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {dashboardData?.cropDecisions?.slice(0, 5).map((decision: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {decision.event}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Decision: {decision.decision}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(decision.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  };

  return renderPage();
};

export default FarmerDashboard;