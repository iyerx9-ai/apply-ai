import { supabase } from './supabase'

const FREE_LIMITS = {
  searches: 3,
  applications: 5,
}

export const getUsage = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('searches_used, applications_used, plan')
    .eq('id', userId)
    .single()
  return data || { searches_used: 0, applications_used: 0, plan: 'free' }
}

export const incrementSearch = async (userId) => {
  const usage = await getUsage(userId)
  if (usage.plan === 'free' && usage.searches_used >= FREE_LIMITS.searches) {
    return { allowed: false, used: usage.searches_used, limit: FREE_LIMITS.searches }
  }
  await supabase
    .from('profiles')
    .upsert({ id: userId, searches_used: (usage.searches_used || 0) + 1 })
  return { allowed: true, used: usage.searches_used + 1, limit: FREE_LIMITS.searches }
}

export const incrementApplication = async (userId) => {
  const usage = await getUsage(userId)
  if (usage.plan === 'free' && usage.applications_used >= FREE_LIMITS.applications) {
    return { allowed: false, used: usage.applications_used, limit: FREE_LIMITS.applications }
  }
  await supabase
    .from('profiles')
    .upsert({ id: userId, applications_used: (usage.applications_used || 0) + 1 })
  return { allowed: true, used: usage.applications_used + 1, limit: FREE_LIMITS.applications }
}
