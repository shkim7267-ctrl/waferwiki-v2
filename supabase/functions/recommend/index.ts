import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SERVICE_ROLE_KEY') ?? '';
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'Missing env' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tags')
      .eq('id', user.id)
      .single();

    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('tags')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const tagCounts = new Map<string, number>();
    const addTags = (tags: string[] | null) => {
      if (!tags) return;
      tags.forEach((tag) => {
        const key = tag.trim().toLowerCase();
        if (!key) return;
        tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
      });
    };

    addTags(profile?.tags ?? []);
    (sessions ?? []).forEach((row) => addTags(row.tags ?? []));

    const tags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);

    return new Response(JSON.stringify({ tags }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
