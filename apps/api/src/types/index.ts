import { BookingStatus, MechanicStatus } from '@prisma/client';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(statusCode: number, message: string, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

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

export interface BookingWithRelations {
  id: string;
  customerId: string;
  mechanicId: string | null;
  serviceCategoryId: string;
  status: BookingStatus;
  amount: number;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  scheduledAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: { id: string; name: string; email: string; phone: string };
  mechanic: { id: string; name: string; phone: string; status: MechanicStatus } | null;
  serviceCategory: { id: string; name: string };
}

// Valid status transitions for the booking state machine
export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
  [BookingStatus.ASSIGNED]: [BookingStatus.MECHANIC_ON_THE_WAY, BookingStatus.CANCELLED],
  [BookingStatus.MECHANIC_ON_THE_WAY]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
  [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
};

// Forward-only transition chain for the BullMQ auto-advance worker
export const STATUS_CHAIN: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.ASSIGNED,
  BookingStatus.MECHANIC_ON_THE_WAY,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
];
