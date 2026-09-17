export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_path: string;
  caption?: string;
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string;
  description: string;
  status: 'completed' | 'ongoing';
  completion_date?: string | null;
  created_at?: string;
  updated_at?: string;
  images?: ProjectImage[];
  primary_image?: string;
}

export interface Equipment {
  id: number;
  name: string;
  type?: string;
  description: string;
  image: string;
  status: 'available' | 'on-site' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  caption?: string;
  category: string;
  image_path: string;
  created_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'New' | 'read' | 'responded' | 'Contacted' | 'Resolved' | 'Closed' | string;
  created_at?: string;
}

export interface ServiceRequest {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  location?: string;
  description: string;
  preferred_contact_method?: string;
  message?: string;
  admin_notes?: string;
  status: string;
  created_at?: string;
  email_dispatched?: number | boolean;
  email_dispatched_to?: string;
  email_dispatched_at?: string;
}

export interface EmailLog {
  id: number;
  recipient: string;
  sender: string;
  subject: string;
  email_type: string;
  request_id?: number | null;
  status: string;
  details?: string;
  body_preview?: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role?: 'super_admin' | 'admin' | string;
  designation?: string;
  created_at?: string;
}

export interface CompanySettings {
  company_name: string;
  registration_rc: string;
  hotline_1: string;
  hotline_2: string;
  hotline_3: string;
  official_email: string;
  head_office: string;
  operating_hours: string;
  mining_license_status: string;
  quarry_location: string;
  [key: string]: string;
}

export interface SystemDiagnostics {
  driver: string;
  php_version: string;
  server_software: string;
  database_name: string;
  table_counts: Record<string, number>;
  total_database_records: number;
  memory_usage_mb: number;
  server_time: string;
  uptime_status: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  counts: {
    total_projects: number;
    total_services: number;
    total_equipment: number;
    total_enquiries: number;
    new_enquiries: number;
    total_service_requests: number;
    pending_service_requests: number;
    gallery_images: number;
  };
  recent_projects: Array<{
    id: number;
    title: string;
    category: string;
    status: string;
    created_at: string;
  }>;
  recent_requests: Array<{
    id: number;
    name: string;
    company: string;
    service: string;
    status: string;
    created_at: string;
  }>;
  recent_enquiries: Array<{
    id: number;
    name: string;
    subject: string;
    status: string;
    created_at: string;
  }>;
  server_time: string;
  database_engine: string;
}
