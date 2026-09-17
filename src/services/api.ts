import {
  Service,
  Project,
  Equipment,
  GalleryItem,
  ContactMessage,
  ServiceRequest,
  AdminUser,
  DashboardStats,
  ApiResponse,
  CompanySettings,
  SystemDiagnostics,
  EmailLog,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('davcom_admin_token') || sessionStorage.getItem('davcom_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';

  if (text.trim().length === 0) {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return {} as T;
  }

  // Attempt JSON parsing if indicated by header or starting with { or [
  const isLikelyJson = contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[');
  if (isLikelyJson) {
    try {
      const json: ApiResponse<T> = JSON.parse(text);
      if (!res.ok || json.success === false) {
        throw new Error(json.message || `Request failed with status ${res.status}`);
      }
      return json.data !== undefined ? (json.data as T) : (json as unknown as T);
    } catch (err: any) {
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${text.slice(0, 100)}`);
      }
      // If parsing failed but was not JSON
      throw new Error(err?.message ? `Invalid response format: ${err.message}` : 'Invalid JSON response from server');
    }
  }

  if (!res.ok) {
    throw new Error(`Server returned HTTP ${res.status}: ${text.slice(0, 100)}`);
  }
  return text as unknown as T;
}

export const api = {
  // Services
  async getServices(): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services`);
    return handleResponse<Service[]>(res);
  },

  async getServiceBySlug(slug: string): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${slug}`);
    return handleResponse<Service>(res);
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(res);
  },

  async updateService(data: Partial<Service> & { id: number }): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(res);
  },

  async deleteService(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/services/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Projects
  async getProjects(category?: string, status?: string): Promise<Project[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (status && status !== 'all') params.append('status', status);
    const url = `${API_BASE}/projects${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    return handleResponse<Project[]>(res);
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    return handleResponse<Project>(res);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async updateProject(
    idOrData: number | (Partial<Project> & { id: number }),
    data?: Partial<Project>
  ): Promise<Project> {
    const payload = typeof idOrData === 'number' ? { id: idOrData, ...data } : idOrData;
    const res = await fetch(`${API_BASE}/projects/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<Project>(res);
  },

  async deleteProject(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/projects/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Equipment
  async getEquipment(status?: string): Promise<Equipment[]> {
    const url = status && status !== 'all' ? `${API_BASE}/equipment?status=${status}` : `${API_BASE}/equipment`;
    const res = await fetch(url);
    return handleResponse<Equipment[]>(res);
  },

  async createEquipment(data: Partial<Equipment>): Promise<Equipment> {
    const res = await fetch(`${API_BASE}/equipment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Equipment>(res);
  },

  async updateEquipment(
    idOrData: number | (Partial<Equipment> & { id: number }),
    data?: Partial<Equipment>
  ): Promise<Equipment> {
    const payload = typeof idOrData === 'number' ? { id: idOrData, ...data } : idOrData;
    const res = await fetch(`${API_BASE}/equipment/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<Equipment>(res);
  },

  async deleteEquipment(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/equipment/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const url = category && category !== 'all' ? `${API_BASE}/gallery?category=${category}` : `${API_BASE}/gallery`;
    const res = await fetch(url);
    return handleResponse<GalleryItem[]>(res);
  },

  async createGalleryItem(data: Partial<GalleryItem>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<GalleryItem>(res);
  },

  async uploadGalleryImage(formData: FormData): Promise<{ gallery_item: GalleryItem; image_path: string; message: string }> {
    const res = await fetch(`${API_BASE}/gallery/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<{ gallery_item: GalleryItem; image_path: string; message: string }>(res);
  },

  async deleteGalleryItem(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/gallery/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // General image upload (for projects, machinery, gallery)
  async uploadImage(file: File): Promise<{ file_path: string; filename?: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse<{ file_path: string; filename?: string; message: string }>(res);
  },

  // Contact
  async sendContact(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(res);
  },

  async getContactMessages(status?: string): Promise<ContactMessage[]> {
    const url = status && status !== 'all' ? `${API_BASE}/contact/messages?status=${status}` : `${API_BASE}/contact/messages`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ContactMessage[]>(res);
  },

  async updateContactStatus(id: number, status: string): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/contact/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, status }),
    });
    return handleResponse<ContactMessage>(res);
  },

  async updateContactMessage(id: number, status: string): Promise<ContactMessage> {
    return this.updateContactStatus(id, status);
  },

  async deleteContactMessage(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/contact/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Service Requests
  async sendServiceRequest(data: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    service: string;
    location?: string;
    description: string;
    preferred_contact_method?: string;
    message?: string;
  }): Promise<{ request_id: number; message: string; email_dispatched?: boolean; company_recipients?: string[] }> {
    const res = await fetch(`${API_BASE}/service-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ request_id: number; message: string; email_dispatched?: boolean; company_recipients?: string[] }>(res);
  },

  async resendServiceRequestEmail(id: number, custom_email?: string): Promise<{ message: string; recipients?: string[]; result?: any }> {
    const res = await fetch(`${API_BASE}/service-requests/resend-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, custom_email }),
    });
    return handleResponse<{ message: string; recipients?: string[]; result?: any }>(res);
  },

  async sendTestEmail(target_email?: string): Promise<{ message: string; target_email: string; result?: any }> {
    const res = await fetch(`${API_BASE}/admin/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ target_email }),
    });
    return handleResponse<{ message: string; target_email: string; result?: any }>(res);
  },

  async getEmailLogs(limit: number = 50): Promise<EmailLog[]> {
    const res = await fetch(`${API_BASE}/admin/email-logs?limit=${limit}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<EmailLog[]>(res);
  },

  async getServiceRequests(status?: string): Promise<ServiceRequest[]> {
    const url = status && status !== 'all' ? `${API_BASE}/service-requests/all?status=${status}` : `${API_BASE}/service-requests/all`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ServiceRequest[]>(res);
  },

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest> {
    const res = await fetch(`${API_BASE}/service-requests/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, status }),
    });
    return handleResponse<ServiceRequest>(res);
  },

  async updateServiceRequest(id: number, data: { status: string; admin_notes?: string }): Promise<ServiceRequest> {
    const res = await fetch(`${API_BASE}/service-requests/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id, ...data }),
    });
    return handleResponse<ServiceRequest>(res);
  },

  async deleteServiceRequest(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/service-requests/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Auth & Admin
  async login(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; admin: AdminUser }>(res);
  },

  async getMe(): Promise<{ admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ admin: AdminUser }>(res);
  },

  async logout(): Promise<{ message: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
      return handleResponse<{ message: string }>(res);
    } catch (_) {
      return { message: 'Logged out' };
    }
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<DashboardStats>(res);
  },

  // Super Admin Methods
  async getAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AdminUser[]>(res);
  },

  async createAdminUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    designation?: string;
  }): Promise<{ user: AdminUser; message: string }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ user: AdminUser; message: string }>(res);
  },

  async deleteAdminUser(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/admin/delete-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async getCompanySettings(): Promise<CompanySettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<CompanySettings>(res);
  },

  async updateCompanySettings(settings: Partial<CompanySettings>): Promise<{ settings: CompanySettings; message: string }> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(settings),
    });
    return handleResponse<{ settings: CompanySettings; message: string }>(res);
  },

  async getSystemDiagnostics(): Promise<SystemDiagnostics> {
    const res = await fetch(`${API_BASE}/admin/system`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<SystemDiagnostics>(res);
  },
};
