// ── Enums (string unions mirroring Prisma enums) ─────────────────────────────

export type BookingStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'MECHANIC_ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type MechanicStatus = 'AVAILABLE' | 'ON_JOB' | 'OFFLINE';

// ── Entities ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  _count?: { bookings: number };
}

export interface Mechanic {
  id: string;
  name: string;
  phone: string;
  status: MechanicStatus;
  jobsCompleted: number;
  currentLat: number | null;
  currentLng: number | null;
  createdAt: string;
  lastBooking?: {
    id: string;
    status: BookingStatus;
    service: string;
    customer: string;
    createdAt: string;
  } | null;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  customerId: string;
  mechanicId: string | null;
  serviceCategoryId: string;
  status: BookingStatus;
  amount: number;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  scheduledAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; email: string; phone: string };
  mechanic: { id: string; name: string; phone: string; status: MechanicStatus } | null;
  serviceCategory: { id: string; name: string };
}

// ── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeMechanics: number;
  newCustomers: number;
  bookingsOverTime: Array<{ date: string; count: number }>;
  revenueOverTime: Array<{ date: string; revenue: number }>;
  statusBreakdown: Array<{ status: BookingStatus; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

export interface ApiResponse<T> {
  data: T;
}

// ── Query Params ─────────────────────────────────────────────────────────────

export interface BookingsQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  mechanicId?: string;
  categoryId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'status' | 'scheduledAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CustomersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
