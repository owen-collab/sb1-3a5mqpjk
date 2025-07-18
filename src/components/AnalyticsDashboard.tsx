import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users, Clock, Award, RefreshCw } from 'lucide-react';
import { analyticsService, DashboardStats } from '../lib/analytics';

const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyticsService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#000000', '#DC2626', '#7F1D1D', '#991B1B', '#B91C1C'];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
        <p className="text-gray-600">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Rapports & Statistiques</h2>
          <p className="text-gray-600">Analyse détaillée des performances</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalRevenue.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rendez-vous</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-black rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Award className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageServiceValue.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Month */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution des Revenus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus']} />
              <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Services les Plus Demandés</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topServices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition des Statuts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} (${percentage.toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Time Slots */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Créneaux Populaires</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.popularTimeSlots}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="heure" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Performance par Service</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.topServices.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.revenue.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-black to-red-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Rendez-vous Terminés</p>
              <p className="text-3xl font-bold">{stats.completedAppointments}</p>
            </div>
            <Users className="h-12 w-12 text-white/60" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-black text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">En Attente</p>
              <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
            </div>
            <Clock className="h-12 w-12 text-white/60" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-red-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Taux de Réussite</p>
              <p className="text-3xl font-bold">
                {stats.totalAppointments > 0 
                  ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1)
                  : 0
                }%
              </p>
            </div>
            <Award className="h-12 w-12 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;