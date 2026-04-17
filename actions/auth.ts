// Mobile equivalent of the web's actions/auth.ts
// Uses Supabase JS client directly (no Next.js server actions on mobile)
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
  role: 'customer' | 'employee';
}) {
  const { data, error } = await supabase.auth.signUp({
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName.trim(),
        role: formData.role,
      },
    },
  });
  if (error) throw error;

  // Create profile row (fire-and-forget, same pattern as web)
  if (data.user) {
    await createProfile({
      id: data.user.id,
      fullName: formData.fullName.trim(),
      role: formData.role,
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function createProfile(profileData: {
  id: string;
  fullName: string;
  role: 'customer' | 'employee';
}): Promise<{ success: boolean; data?: Profile; error?: string }> {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .insert({
      id: profileData.id,
      full_name: profileData.fullName,
      role: profileData.role,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as Profile };
}

export async function getProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data as Profile;
}
