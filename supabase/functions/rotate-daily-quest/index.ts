import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date().toISOString().split('T')[0];

    // Check if quest for today already exists
    const { data: existing } = await supabase
      .from('active_daily_quest')
      .select('id')
      .eq('quest_date', today)
      .single();

    if (existing) {
      console.log('Quest for today already exists');
      return new Response(
        JSON.stringify({ message: 'Quest already set for today' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all scammers
    const { data: scammers, error: scammersError } = await supabase
      .from('daily_scammers')
      .select('id');

    if (scammersError || !scammers || scammers.length === 0) {
      throw new Error('No scammers available');
    }

    // Get the last used scammer
    const { data: lastQuest } = await supabase
      .from('active_daily_quest')
      .select('scammer_id')
      .order('quest_date', { ascending: false })
      .limit(1)
      .single();

    // Select next scammer (rotate through pool)
    let nextScammer;
    if (!lastQuest) {
      // First quest - pick random
      nextScammer = scammers[Math.floor(Math.random() * scammers.length)];
    } else {
      // Find next scammer in rotation
      const lastIndex = scammers.findIndex(s => s.id === lastQuest.scammer_id);
      const nextIndex = (lastIndex + 1) % scammers.length;
      nextScammer = scammers[nextIndex];
    }

    // Create new active quest
    const { error: insertError } = await supabase
      .from('active_daily_quest')
      .insert({
        scammer_id: nextScammer.id,
        quest_date: today,
      });

    if (insertError) {
      throw insertError;
    }

    console.log(`Quest rotated successfully for ${today}`);

    return new Response(
      JSON.stringify({
        message: 'Quest rotated successfully',
        scammerId: nextScammer.id,
        date: today,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in rotate-daily-quest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});