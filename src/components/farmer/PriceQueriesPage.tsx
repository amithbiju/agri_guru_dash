import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseService } from '../../services/firebaseService';
import { PriceQuery } from '../../types';
import { ArrowLeft, Calendar, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PriceQueriesPageProps {
  onBack: () => void;
}

const PriceQueriesPage: React.FC<PriceQueriesPageProps> = ({ onBack }) => {
  const { farmer } = useAuth();
  const [priceQueries, setPriceQueries] = useState<PriceQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceQueries = async () => {
      if (farmer) {
        setLoading(true);
        const data = await firebaseService.getPriceQueries(farmer.id);
        setPriceQueries(data);
        setLoading(false);
      }
    };

    fetchPriceQueries();
  }, [farmer]);

  const groupedQueries = priceQueries.reduce((acc, query) => {
    const key = query.crop_name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(query);
    return acc;
  }, {} as Record<string, PriceQuery[]>);

  const getAveragePrice = (queries: PriceQuery[]) => {
    const sum = queries.reduce((acc, query) => acc + query.queried_price, 0);
    return (sum / queries.length).toFixed(2);
  };

  const getLatestPrice = (queries: PriceQuery[]) => {
    return queries[0]?.queried_price || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading price queries...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Price Queries</h1>
          <p className="text-gray-600">View all your crop price queries and market trends</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900">{priceQueries.length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crops Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(groupedQueries).length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{priceQueries.length > 0 ? getAveragePrice(priceQueries) : '0'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Grouped by Crop */}
        <div className="space-y-6">
          {Object.keys(groupedQueries).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No price queries found</p>
            </div>
          ) : (
            Object.entries(groupedQueries).map(([cropName, queries]) => (
              <div key={cropName} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{cropName}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Latest: ₹{getLatestPrice(queries)}</span>
                      <span>Average: ₹{getAveragePrice(queries)}</span>
                      <span>{queries.length} queries</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {queries.map((query) => (
                    <div key={query.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{query.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {format(query.query_date, 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ₹{query.queried_price}
                          </div>
                          <div className="text-sm text-gray-500">per unit</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceQueriesPage;