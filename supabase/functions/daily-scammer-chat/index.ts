import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, message, isImage } = await req.json();
    
    if (!userId || !message) {
      throw new Error('userId and message are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get today's active quest
    const today = new Date().toISOString().split('T')[0];
    const { data: activeQuest, error: questError } = await supabase
      .from('active_daily_quest')
      .select('scammer_id')
      .eq('quest_date', today)
      .single();

    if (questError || !activeQuest) {
      throw new Error('No active quest for today');
    }

    // Get scammer details
    const { data: scammer, error: scammerError } = await supabase
      .from('daily_scammers')
      .select('*')
      .eq('id', activeQuest.scammer_id)
      .single();

    if (scammerError || !scammer) {
      throw new Error('Scammer not found');
    }

    // Get user's progress for context
    const { data: progress } = await supabase
      .from('user_daily_progress')
      .select('messages')
      .eq('user_id', userId)
      .eq('quest_date', today)
      .single();

    const chatHistory = progress?.messages || [];

    // Process image if provided
    let userContent = message;
    if (isImage) {
      // Use OpenAI GPT-4 Vision for image recognition
      const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Опиши что изображено на этом изображении детально на русском языке.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: message, // base64 image
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });

      if (!visionResponse.ok) {
        throw new Error('Vision API error');
      }

      const visionData = await visionResponse.json();
      userContent = `Пользователь прислал изображение. Описание: ${visionData.choices[0].message.content}`;
      console.log('Vision description:', userContent);
    }

    // Build conversation history for AI
    const conversationMessages = [
      {
        role: 'system',
        content: scammer.system_prompt,
      },
      ...chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: userContent,
      },
    ];

    // Call Gemini 2.5 Flash AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: conversationMessages,
        tools: [
          {
            type: 'function',
            function: {
              name: 'confession',
              description: 'Вызови эту функцию когда ты решишь признаться что ты мошенник. Это важный момент в игре - пользователь должен сам тебя разоблачить через диалог, а ты должен признаться когда он собрал достаточно улик.',
              parameters: {
                type: 'object',
                properties: {},
                required: [],
              }
            }
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('AI Gateway error');
    }

    const aiData = await aiResponse.json();
    console.log('AI Response:', JSON.stringify(aiData, null, 2));
    
    const choice = aiData.choices[0];
    let scammerResponse = choice.message.content || '';
    let confessed = false;

    // Check if AI called the confession function
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const confessionCall = choice.message.tool_calls.find(
        (tc: any) => tc.function.name === 'confession'
      );
      if (confessionCall) {
        confessed = true;
        console.log('AI confessed via function call!');
      }
    }

    // Save messages to progress
    const updatedMessages = [
      ...chatHistory,
      { role: 'user', content: userContent, timestamp: new Date().toISOString() },
      { role: 'assistant', content: scammerResponse, timestamp: new Date().toISOString() },
    ];

    // Update or insert progress
    const { error: updateError } = await supabase
      .from('user_daily_progress')
      .upsert({
        user_id: userId,
        quest_date: today,
        scammer_id: activeQuest.scammer_id,
        messages: updatedMessages,
      }, {
        onConflict: 'user_id,quest_date',
      });

    if (updateError) {
      console.error('Error updating progress:', updateError);
    }

    return new Response(
      JSON.stringify({
        response: scammerResponse,
        scammerName: scammer.name,
        scammerRole: scammer.role,
        confessed: confessed,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in daily-scammer-chat:', error);
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