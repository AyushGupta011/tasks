import type {
  DashboardStats,
  Booking,
  Mechanic,
  PaginatedResponse,
  ApiResponse,
  BookingsQueryParams,
  CustomersQueryParams,
  Customer,
  BookingStatus,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: { message: 'Network error' } }));
      throw new Error(error.error?.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  }

  // Dashboard
  async getDashboardStats(days: number = 30): Promise<DashboardStats> {
    const res = await this.fetch<ApiResponse<DashboardStats>>(`/api/dashboard?days=${days}`);
    return res.data;
  }

  // Bookings
  async getBookings(params: BookingsQueryParams = {}): Promise<PaginatedResponse<Booking>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return this.fetch<PaginatedResponse<Booking>>(`/api/bookings?${searchParams.toString()}`);
  }

  async getBooking(id: string): Promise<Booking> {
    const res = await this.fetch<ApiResponse<Booking>>(`/api/bookings/${id}`);
    return res.data;
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    mechanicId?: string
  ): Promise<Booking> {
    const res = await this.fetch<ApiResponse<Booking>>(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, mechanicId }),
    });
    return res.data;
  }

  // Mechanics
  async getMechanics(status?: string): Promise<Mechanic[]> {
    const query = status ? `?status=${status}` : '';
    const res = await this.fetch<ApiResponse<Mechanic[]>>(`/api/mechanics${query}`);
    return res.data;
  }

  async getMechanic(id: string): Promise<Mechanic> {
    const res = await this.fetch<ApiResponse<Mechanic>>(`/api/mechanics/${id}`);
    return res.data;
  }

  // Customers
  async getCustomers(params: CustomersQueryParams = {}): Promise<PaginatedResponse<Customer>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return this.fetch<PaginatedResponse<Customer>>(`/api/customers?${searchParams.toString()}`);
  }
}

export const api = new ApiClient(BASE_URL);
