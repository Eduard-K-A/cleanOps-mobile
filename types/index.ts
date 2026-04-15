export type UserRole = 'customer' | 'employee' | 'admin';
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'CANCELLED';
export type JobUrgency = 'LOW' | 'NORMAL' | 'HIGH';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  money_balance: number;
  onboarding_completed?: boolean;
  rating?: number;
  total_jobs?: number;
  created_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  employee_id?: string;
  status: JobStatus;
  urgency: JobUrgency;
  size?: string;
  tasks: string[];
  location_address: string;
  distance?: number;
  price_amount: number;
  proof_urls?: string[];
  proof_description?: string;
  customer_name?: string;
  customer_phone?: string;
  employee_name?: string;
  employee_phone?: string;
  custom_instructions?: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}
