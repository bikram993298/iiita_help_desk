import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId?: string;
}

export const authService = {
  async signUp(email: string, password: string, name: string, role: 'student' | 'admin', studentId?: string) {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
          student_id: role === 'student' ? studentId : null,
        });

      if (profileError) throw profileError;

      return {
        id: authData.user.id,
        name,
        email,
        role,
        studentId: role === 'student' ? studentId : undefined,
      };
    }

    throw new Error('Failed to create user');
  },

  async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        studentId: profile.student_id || undefined,
      };
    }

    throw new Error('Failed to sign in');
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      studentId: profile.student_id || undefined,
    };
  },
};