import { supabase } from '../lib/supabase';
import { Complaint } from '../types/complaint';

export const complaintService = {
  async createComplaint(complaint: {
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    studentId: string;
  }) {
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        student_id: complaint.studentId,
        status: 'pending',
      })
      .select(`
        *,
        users!complaints_student_id_fkey(name)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status,
      studentId: data.student_id,
      studentName: data.users?.name || 'Unknown',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      adminNotes: data.admin_notes || undefined,
    } as Complaint;
  },

  async getComplaintsByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        users!complaints_student_id_fkey(name)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      studentId: complaint.student_id,
      studentName: complaint.users?.name || 'Unknown',
      createdAt: complaint.created_at,
      updatedAt: complaint.updated_at,
      adminNotes: complaint.admin_notes || undefined,
    })) as Complaint[];
  },

  async getAllComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        users!complaints_student_id_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      studentId: complaint.student_id,
      studentName: complaint.users?.name || 'Unknown',
      createdAt: complaint.created_at,
      updatedAt: complaint.updated_at,
      adminNotes: complaint.admin_notes || undefined,
    })) as Complaint[];
  },

  async updateComplaintStatus(
    complaintId: string,
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected',
    adminNotes?: string
  ) {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId)
      .select(`
        *,
        users!complaints_student_id_fkey(name)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: data.status,
      studentId: data.student_id,
      studentName: data.users?.name || 'Unknown',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      adminNotes: data.admin_notes || undefined,
    } as Complaint;
  },
};