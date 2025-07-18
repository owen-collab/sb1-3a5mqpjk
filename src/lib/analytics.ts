import { supabase } from './supabase';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, subMonths } from 'date-fns';

export interface ServiceStats {
  service: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface RevenueStats {
  period: string;
  revenue: number;
  appointments: number;
}

export interface TimeSlotStats {
  heure: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  conversionRate: number;
  averageServiceValue: number;
  topServices: ServiceStats[];
  revenueByMonth: RevenueStats[];
  popularTimeSlots: TimeSlotStats[];
  statusDistribution: { status: string; count: number; percentage: number }[];
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (!supabase) throw new Error('Supabase non configuré');

    // Get all appointments and payments
    const { data: appointments } = await supabase
      .from('rendezvous')
      .select('*');

    const { data: payments } = await supabase
      .from('payments')
      .select('*');

    if (!appointments || !payments) {
      throw new Error('Erreur lors de la récupération des données');
    }

    // Basic stats
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'termine').length;
    const pendingAppointments = appointments.filter(a => a.status === 'nouveau' || a.status === 'confirme').length;
    const successfulPayments = payments.filter(p => p.status === 'succeeded');
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    const conversionRate = totalAppointments > 0 ? (successfulPayments.length / totalAppointments) * 100 : 0;
    const averageServiceValue = successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0;

    // Service statistics
    const serviceStats = new Map<string, { count: number; revenue: number }>();
    
    appointments.forEach(appointment => {
      const current = serviceStats.get(appointment.service) || { count: 0, revenue: 0 };
      current.count += 1;
      
      // Find corresponding payment
      const payment = payments.find(p => p.rendezvous_id === appointment.id && p.status === 'succeeded');
      if (payment) {
        current.revenue += payment.amount;
      }
      
      serviceStats.set(appointment.service, current);
    });

    const topServices: ServiceStats[] = Array.from(serviceStats.entries())
      .map(([service, stats]) => ({
        service,
        count: stats.count,
        revenue: stats.revenue,
        percentage: (stats.count / totalAppointments) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue by month (last 6 months)
    const revenueByMonth: RevenueStats[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= monthStart && paymentDate <= monthEnd && p.status === 'succeeded';
      });
      
      const monthAppointments = appointments.filter(a => {
        const appointmentDate = new Date(a.created_at);
        return appointmentDate >= monthStart && appointmentDate <= monthEnd;
      });

      revenueByMonth.push({
        period: format(date, 'MMM yyyy'),
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        appointments: monthAppointments.length
      });
    }

    // Popular time slots
    const timeSlotStats = new Map<string, number>();
    appointments.forEach(appointment => {
      if (appointment.heure) {
        const current = timeSlotStats.get(appointment.heure) || 0;
        timeSlotStats.set(appointment.heure, current + 1);
      }
    });

    const popularTimeSlots: TimeSlotStats[] = Array.from(timeSlotStats.entries())
      .map(([heure, count]) => ({
        heure,
        count,
        percentage: (count / totalAppointments) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Status distribution
    const statusStats = new Map<string, number>();
    appointments.forEach(appointment => {
      const current = statusStats.get(appointment.status) || 0;
      statusStats.set(appointment.status, current + 1);
    });

    const statusDistribution = Array.from(statusStats.entries())
      .map(([status, count]) => ({
        status,
        count,
        percentage: (count / totalAppointments) * 100
      }));

    return {
      totalRevenue,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      conversionRate,
      averageServiceValue,
      topServices,
      revenueByMonth,
      popularTimeSlots,
      statusDistribution
    };
  },

  async getServicePerformance() {
    if (!supabase) throw new Error('Supabase non configuré');

    const { data: appointments } = await supabase
      .from('rendezvous')
      .select('service, status, created_at');

    const { data: payments } = await supabase
      .from('payments')
      .select('rendezvous_id, amount, status');

    if (!appointments || !payments) return [];

    const servicePerformance = new Map();

    appointments?.forEach(appointment => {
      const service = appointment.service;
      if (!servicePerformance.has(service)) {
        servicePerformance.set(service, {
          name: service,
          total: 0,
          completed: 0,
          revenue: 0,
          conversionRate: 0
        });
      }

      const stats = servicePerformance.get(service);
      stats.total += 1;
      
      if (appointment.status === 'termine') {
        stats.completed += 1;
      }

      // Find payment for this appointment
      const payment = payments.find(p => p.rendezvous_id === appointment.id && p.status === 'succeeded');
      if (payment) {
        stats.revenue += payment.amount;
      }
    });

    // Calculate conversion rates
    servicePerformance.forEach(stats => {
      stats.conversionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    });

    return Array.from(servicePerformance.values())
      .sort((a, b) => b.revenue - a.revenue);
  }
};