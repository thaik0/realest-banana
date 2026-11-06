import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';

export const dynamic = 'force-dynamic';
export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Sign in required'}, {status:401});
  const row = await env.DB.prepare('SELECT payload, revision FROM tracker_data WHERE user_id = ?').bind(user.userId).first<{payload:string, revision:number}>();
  return Response.json(row ? {data:JSON.parse(row.payload),revision:row.revision} : {data:null,revision:0}, {headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({error:'Sign in required'}, {status:401});
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({error:'Invalid origin'}, {status:403});
  let body;
  try { body=await request.json() as {data:unknown,revision:number}; } catch { return Response.json({error:'Invalid JSON'}, {status:400}); }
  const data=body.data as {problems?:unknown[],attempts?:unknown[]};
  if (!data || !Array.isArray(data.problems) || !Array.isArray(data.attempts) || !Number.isSafeInteger(body.revision) || body.revision<0) return Response.json({error:'Invalid data'}, {status:400});
  const payload=JSON.stringify(data);
  if (payload.length>2000000) return Response.json({error:'Data too large'}, {status:413});
  const result=body.revision===0
    ? await env.DB.prepare('INSERT INTO tracker_data (user_id,payload,revision) VALUES (?,?,1) ON CONFLICT(user_id) DO NOTHING').bind(user.userId,payload).run()
    : await env.DB.prepare('UPDATE tracker_data SET payload=?, revision=revision+1 WHERE user_id=? AND revision=?').bind(payload,user.userId,body.revision).run();
  if (!result.meta.changes) return Response.json({error:'Data changed on another device'}, {status:409});
  return Response.json({revision:body.revision+1});
}
