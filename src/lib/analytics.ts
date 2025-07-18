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

    // Get all appointments
    const { data: appointments } = await supabase
      .from('rendezvous')
      .select('*');

    if (!appointments) {
      throw new Error('Erreur lors de la récupération des données');
    }

    // Basic stats
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'termine').length;
    const pendingAppointments = appointments.filter(a => a.status === 'nouveau' || a.status === 'confirme').length;

    // Service statistics
    const serviceStats = new Map<string, { count: number }>();
    
    appointments.forEach(appointment => {
      const current = serviceStats.get(appointment.service) || { count: 0 };
      current.count += 1;
      serviceStats.set(appointment.service, current);
    });

    const topServices: ServiceStats[] = Array.from(serviceStats.entries())
      .map(([service, { count }]) => ({
        service,
        count,
        revenue: 0,
        percentage: (count / totalAppointments) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

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
      totalRevenue: 0,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      conversionRate: 0,
      averageServiceValue: 0,
      topServices,
      revenueByMonth: [],
      popularTimeSlots,
      statusDistribution
    };
  },

  async getServicePerformance() {
    if (!supabase) throw new Error('Supabase non configuré');

    const { data: appointments } = await supabase
      .from('rendezvous')
      .select('service, status, created_at');

    if (!appointments) return [];

    const servicePerformance = new Map();

    appointments?.forEach(appointment => {
      const service = appointment.service;
      if (!servicePerformance.has(service)) {
        servicePerformance.set(service, {
          name: service,
          total: 0,
          completed: 0,
          conversionRate: 0
        });
      }

      const stats = servicePerformance.get(service);
      stats.total += 1;
      
      if (appointment.status === 'termine') {
        stats.completed += 1;
      }
    });

    // Calculate conversion rates
    servicePerformance.forEach(stats => {
      stats.conversionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    });

    return Array.from(servicePerformance.values())
      .sort((a, b) => b.total - a.total);
  }
};