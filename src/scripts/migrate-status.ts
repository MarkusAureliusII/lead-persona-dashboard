// Migrate lead status system programmatically
import { supabase } from '../integrations/supabase/client';

async function migrateLeadStatus() {
  console.log('🔄 Starting lead status migration...');
  
  try {
    // 1. Check current status distribution
    const { data: currentStats, error: statsError } = await supabase
      .from('leads')
      .select('status')
      .then(result => {
        if (result.error) throw result.error;
        const distribution = result.data.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return { data: distribution, error: null };
      });

    if (statsError) throw statsError;
    
    console.log('📊 Current status distribution:', currentStats);

    // 2. Update qualified → ready_for_outreach
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'ready_for_outreach' })
      .eq('status', 'qualified');

    if (updateError) throw updateError;

    // 3. Verify migration
    const { data: newStats } = await supabase
      .from('leads')
      .select('status')
      .then(result => {
        const distribution = result.data?.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return { data: distribution };
      });

    console.log('✅ Migration completed! New distribution:', newStats);
    
    return {
      success: true,
      before: currentStats,
      after: newStats
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for use in components if needed
export { migrateLeadStatus };

// Run if called directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).migrateLeadStatus = migrateLeadStatus;
  console.log('🔧 Migration function available as window.migrateLeadStatus()');
}