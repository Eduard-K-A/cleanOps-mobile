// Mobile equivalent of the web's app/actions/jobs.ts
import { supabase } from '@/lib/supabase';
import type { Job, JobStatus, JobUrgency } from '@/types';

export async function createJob(jobData: {
  tasks: string[];
  urgency: JobUrgency;
  address: string;
  distance: number;
  price: number;
  size: string;
}): Promise<Job> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check balance and top-up if needed (same logic as web)
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('money_balance')
    .eq('id', user.id)
    .single();

  const priceDecimal = jobData.price / 100;
  const balance = (profile as any)?.money_balance ?? 0;

  if (balance < priceDecimal) {
    await (supabase as any)
      .from('profiles')
      .update({ money_balance: priceDecimal + 1000 })
      .eq('id', user.id);
  }

  const { data: updated } = await (supabase as any)
    .from('profiles')
    .select('money_balance')
    .eq('id', user.id)
    .single();

  await (supabase as any)
    .from('profiles')
    .update({ money_balance: (updated as any).money_balance - priceDecimal })
    .eq('id', user.id);

  const { data, error } = await (supabase as any)
    .from('jobs')
    .insert([{
      customer_id: user.id,
      urgency: jobData.urgency,
      location_address: jobData.address,
      distance: jobData.distance,
      price_amount: jobData.price,
      status: 'OPEN',
      tasks: jobData.tasks,
      size: jobData.size,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function getCustomerJobs(status?: JobStatus): Promise<Job[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let query = (supabase as any)
    .from('jobs')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function getOpenJobs(): Promise<Job[]> {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('status', 'OPEN')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function getAllOpenJobs(): Promise<Job[]> {
  return getOpenJobs();
}

export async function getEmployeeJobs(status?: JobStatus): Promise<Job[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let query = (supabase as any)
    .from('jobs')
    .select('*')
    .eq('employee_id', user.id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function getAllJobs(): Promise<Job[]> {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function getJob(id: string): Promise<Job> {
  const { data, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Job;
}

export async function claimJob(jobId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await (supabase as any).rpc('claim_job', {
    p_job_id: jobId,
    p_employee_id: user.id,
  });

  if (error) throw error;
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  proofOfWork?: string[],
  proofDescription?: string,
): Promise<void> {
  const updateData: Record<string, any> = { status };
  if (proofOfWork) updateData.proof_urls = proofOfWork;
  if (proofDescription) updateData.proof_description = proofDescription;

  const { error } = await (supabase as any)
    .from('jobs')
    .update(updateData)
    .eq('id', jobId);

  if (error) throw error;
}

export async function approveJobCompletion(jobId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: job } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (!job || (job as any).customer_id !== user.id) throw new Error('Forbidden');

  // Release funds to employee (85% payout)
  if ((job as any).employee_id) {
    const payout = ((job as any).price_amount * 0.85) / 100;
    const { data: empProfile } = await (supabase as any)
      .from('profiles')
      .select('money_balance')
      .eq('id', (job as any).employee_id)
      .single();

    if (empProfile) {
      await (supabase as any)
        .from('profiles')
        .update({ money_balance: (empProfile as any).money_balance + payout })
        .eq('id', (job as any).employee_id);
    }
  }

  await updateJobStatus(jobId, 'COMPLETED');
}

export async function getNearbyJobs(lat: number, lng: number, radiusMeters = 50000): Promise<Job[]> {
  const { data, error } = await (supabase as any).rpc('get_nearby_jobs', {
    lat,
    lng,
    radius_meters: radiusMeters,
  });
  if (error) throw error;
  return (data ?? []) as Job[];
}
