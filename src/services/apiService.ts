// API Service for connecting to Express.js backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    studentId?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async logout() {
    localStorage.removeItem('authToken');
  }

  // User endpoints
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUserProfile(userData: { name?: string; studentId?: string }) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  // Complaint endpoints
  async getComplaints() {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createComplaint(complaintData: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(complaintData)
    });
    return this.handleResponse(response);
  }

  async updateComplaintStatus(complaintId: string, status: string, adminNotes?: string) {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes })
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();