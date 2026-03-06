import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

type ChatRequest = {
  question: string;
  context?: {
    pageUrl?: string;
    contentId?: string;
  };
};

type ChatResponse = {
  answer: string;
  title: string;
  summary: string;
  tags: string[];
  sessionId?: string;
};

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
    const upstageKey = Deno.env.get('UPSTAGE_API_KEY') ?? '';

    if (!supabaseUrl || !serviceKey || !upstageKey) {
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

    const body = (await req.json()) as ChatRequest;
    if (!body?.question) {
      return new Response(JSON.stringify({ error: 'Question required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const contextLine = body.context?.pageUrl ? `참고 링크: ${body.context.pageUrl}` : '';
    const systemPrompt = [
      '당신은 반도체 학습 허브의 AI 조력자입니다.',
      '투자 조언/종목 추천/가격 전망을 하지 않습니다.',
      '기업 내부정보/전형 유출/허위 사실 단정을 금지합니다.',
      '출력은 반드시 JSON 1개 객체입니다.'
    ].join(' ');

    const userPrompt = [
      `질문: ${body.question}`,
      contextLine,
      '',
      '아래 스키마로만 JSON을 출력하세요.',
      '{',
      '  \"answer\":\"...\",',
      '  \"title\":\"...\",',
      '  \"summary\":\"...\",',
      '  \"tags\":[\"tag1\",\"tag2\"]',
      '}',
      '',
      '제약: 한국어로 간결하게. tags는 2~6개.'
    ].join('\\n');

    const upstageResp = await fetch('https://api.upstage.ai/v1/solar/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstageKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'solar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    const upstageJson = await upstageResp.json();
    const content = upstageJson?.choices?.[0]?.message?.content ?? '';

    let parsed: ChatResponse | null = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }

    const answer = parsed?.answer ?? content ?? '';
    const title = parsed?.title ?? '질문 요약';
    const summary = parsed?.summary ?? answer.slice(0, 140);
    const tags = Array.isArray(parsed?.tags) ? parsed?.tags.slice(0, 6) : [];

    const { data: insertData } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title,
        summary,
        tags
      })
      .select('id')
      .single();

    const response: ChatResponse = {
      answer,
      title,
      summary,
      tags,
      sessionId: insertData?.id
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
