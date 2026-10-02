import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")??"";
const SERVICE_ROLE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")??"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")??"";
const SITE_URL="https://sangre-de-luna-public.vercel.app";
const LOGO_URL=`${SITE_URL}/assets/logo-oficial.png`;
const ALLOWED=new Set([SITE_URL,"https://sangre-de-luna-public-hamunaptsoon2015-1175s-projects.vercel.app","http://localhost:3000","http://localhost:5173"]);
const service=createClient(SUPABASE_URL,SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});

const cors=(req:Request)=>{const o=req.headers.get("origin")||"";return{"Access-Control-Allow-Origin":ALLOWED.has(o)?o:SITE_URL,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"}};
const json=(req:Request,body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors(req),"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const esc=(v:unknown)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

async function mailConfig(){const {data,error}=await service.rpc("fanclub_mail_secret");if(error)throw error;return data||{}}
async function sendMail(to:string,subject:string,html:string,text:string){
  const c=await mailConfig();
  if(!c?.configured||!c?.app_password){const e:any=new Error("MAIL_NOT_CONFIGURED");e.code="MAIL_NOT_CONFIGURED";throw e}
  const transporter=nodemailer.createTransport({host:"smtp.gmail.com",port:465,secure:true,auth:{user:c.sender_email,pass:c.app_password}});
  await transporter.sendMail({from:`"${c.sender_name||"Sangre de Luna"}" <${c.sender_email}>`,to,subject,html,text});
}

function recoveryTemplate(name:string,resetUrl:string){
  const n=esc(name||"miembro de La Manada"),u=esc(resetUrl);
  return{
    html:`<!doctype html><html><body style="margin:0;background:#02060a;font-family:Arial,Helvetica,sans-serif;color:#eef8ff"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#02060a;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:linear-gradient(145deg,#071522,#03090f);border:1px solid #29465d;border-radius:22px;overflow:hidden"><tr><td align="center" style="padding:34px 28px 18px;background:radial-gradient(circle at 50% 0,#173b57 0,transparent 68%)"><img src="${LOGO_URL}" width="190" alt="Sangre de Luna" style="display:block;max-width:55%;height:auto;margin:auto"><div style="margin-top:20px;color:#89d4ff;font-size:11px;font-weight:700;letter-spacing:3px">LA MANADA · ACCESO SEGURO</div><h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:30px;color:#f1f8ff">Recuperación de contraseña</h1></td></tr><tr><td style="padding:24px 38px 12px;color:#b9cad8;font-size:15px;line-height:1.7"><p>Hola, <strong style="color:#fff">${n}</strong>:</p><p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el Fan Club oficial de <strong style="color:#fff">Sangre de Luna</strong>.</p><div style="text-align:center;margin:28px 0"><a href="${u}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#edf9ff,#8bd5ff 58%,#4ba9e5);color:#05131d;text-decoration:none;font-weight:800">RESTABLECER MI CONTRASEÑA</a></div><p>Este enlace estará disponible durante <strong style="color:#fff">30 minutos</strong> y solo podrá utilizarse una vez.</p><p>Si tú no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual continuará siendo válida.</p><div style="margin:24px 0;padding:14px 16px;border-left:3px solid #89d4ff;background:#0a1925;color:#c6d7e4"><strong>Nunca compartas tu contraseña ni este enlace de recuperación con otras personas.</strong></div></td></tr><tr><td align="center" style="padding:18px 30px 32px;color:#7690a4;font-size:12px;border-top:1px solid #183044"><strong style="display:block;color:#dff4ff;font-family:Georgia,serif;font-size:17px;margin-bottom:5px">La Ciudadela te espera.</strong>Tu lugar en La Manada permanece protegido.<div style="margin-top:18px">Sangre de Luna · Fan Club Oficial</div></td></tr></table></td></tr></table></body></html>`,
    text:`SANGRE DE LUNA · LA MANADA\n\nHola, ${name||"miembro de La Manada"}.\n\nRestablece tu contraseña aquí:\n${resetUrl}\n\nEl enlace caduca en 30 minutos y solo puede usarse una vez. Si no solicitaste este cambio, ignora este mensaje.`
  }
}
function confirmationTemplate(name:string){const n=esc(name||"miembro de La Manada");return{html:`<!doctype html><html><body style="margin:0;background:#02060a;font-family:Arial;color:#eef8ff"><div style="max-width:620px;margin:28px auto;background:#07121d;border:1px solid #29465d;border-radius:22px;padding:32px;text-align:center"><img src="${LOGO_URL}" width="180" alt="Sangre de Luna"><h1 style="font-family:Georgia,serif">Tu contraseña fue actualizada</h1><p style="color:#b9cad8">Hola, <strong style="color:#fff">${n}</strong>. La contraseña de tu cuenta de La Manada fue actualizada correctamente.</p><p style="color:#b9cad8">Si no reconoces esta modificación, comunícate con nosotros inmediatamente.</p></div></body></html>`,text:`Sangre de Luna · La contraseña de ${name||"tu cuenta"} fue actualizada correctamente.`}}

async function userClient(req:Request){const token=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"").trim();if(!token)throw new Error("UNAUTHORIZED");const client=createClient(SUPABASE_URL,ANON_KEY,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});const {data,error}=await client.auth.getUser(token);if(error||!data.user)throw new Error("UNAUTHORIZED");return{client,user:data.user}}
async function issueAndSend(email:string,requestedBy:"self"|"admin"){
  const {data,error}=await service.rpc("fanclub_issue_password_reset",{p_email:email,p_requested_by:requestedBy});if(error)throw error;
  if(!data?.found||data?.cooldown)return{sent:false,generic:true};
  const resetUrl=`${SITE_URL}/fanclub?restablecer=${encodeURIComponent(data.token)}`,tpl=recoveryTemplate(data.display_name,resetUrl);
  try{await sendMail(data.email,"Sangre de Luna · Recuperación de contraseña",tpl.html,tpl.text);await service.from("fanclub_password_resets").update({sent_at:new Date().toISOString()}).eq("id",data.reset_id);return{sent:true,generic:false}}
  catch(e){await service.from("fanclub_password_resets").update({used_at:new Date().toISOString()}).eq("id",data.reset_id);throw e}
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors(req)});
  if(req.method!=="POST")return json(req,{ok:false,message:"Método no permitido."},405);
  let body:any={};try{body=await req.json()}catch{return json(req,{ok:false,message:"Solicitud inválida."},400)}
  const action=String(body.action||"");
  try{
    if(action==="request"){const email=String(body.email||"").trim().toLowerCase();if(!email||email.length>254||!email.includes("@"))return json(req,{ok:false,message:"Escribe un correo válido."},400);await issueAndSend(email,"self");return json(req,{ok:true,message:"Si ese correo está registrado en La Manada, recibirás un enlace de recuperación. Revisa también la carpeta de spam."})}
    if(action==="reset"){const token=String(body.token||"").trim(),password=String(body.password||"");if(!token||token.length<32)return json(req,{ok:false,message:"El enlace de recuperación no es válido."},400);if(password.length<8||password.length>72)return json(req,{ok:false,message:"La contraseña debe tener entre 8 y 72 caracteres."},400);const {data,error}=await service.rpc("fanclub_consume_password_reset",{p_token:token,p_password:password});if(error)return json(req,{ok:false,message:error.message||"El enlace no es válido o ya expiró."},400);let confirmation=false;try{const t=confirmationTemplate(data.display_name);await sendMail(data.email,"Sangre de Luna · Tu contraseña fue actualizada",t.html,t.text);confirmation=true}catch{}return json(req,{ok:true,confirmation_sent:confirmation,message:"Tu contraseña fue actualizada. Ya puedes ingresar nuevamente a La Manada."})}
    if(action==="admin-status"){const {client}=await userClient(req);const {data,error}=await client.rpc("fanclub_mail_config_status");if(error)return json(req,{ok:false,message:"No autorizado."},403);return json(req,{ok:true,config:data})}
    if(action==="admin-configure"){const {client}=await userClient(req);const {data,error}=await client.rpc("fanclub_mail_config_set",{p_app_password:String(body.app_password||"")});if(error)return json(req,{ok:false,message:error.message},403);return json(req,{ok:true,config:data,message:"Correo de recuperación configurado de forma segura."})}
    if(action==="admin-test"){const {client,user}=await userClient(req);const {error}=await client.rpc("fanclub_mail_config_status");if(error)return json(req,{ok:false,message:"No autorizado."},403);if(!user.email)return json(req,{ok:false,message:"Tu usuario administrador no tiene correo disponible."},400);await sendMail(user.email,"Sangre de Luna · Prueba del correo de recuperación",`<div style="background:#02060a;color:#eef8ff;padding:30px;text-align:center"><img src="${LOGO_URL}" width="180"><h2>Correo de recuperación conectado</h2></div>`,`Sangre de Luna · El correo de recuperación quedó conectado correctamente.`);return json(req,{ok:true,message:`Correo de prueba enviado a ${user.email}.`})}
    if(action==="admin-send"){const {client}=await userClient(req);const {error}=await client.rpc("fanclub_mail_config_status");if(error)return json(req,{ok:false,message:"No autorizado."},403);const {data:m,error:me}=await service.from("fanclub_members").select("id,email,status").eq("id",String(body.member_id||"")).single();if(me||!m||m.status!=="active")return json(req,{ok:false,message:"No se encontró un miembro activo con ese registro."},404);await issueAndSend(m.email,"admin");return json(req,{ok:true,message:"Enlace de recuperación enviado al correo del miembro."})}
    return json(req,{ok:false,message:"Acción desconocida."},400);
  }catch(e:any){if(e?.code==="MAIL_NOT_CONFIGURED"||e?.message==="MAIL_NOT_CONFIGURED")return json(req,{ok:false,code:"mail_not_configured",message:"El correo de recuperación aún no está conectado en el Administrador."},503);if(e?.message==="UNAUTHORIZED")return json(req,{ok:false,message:"No autorizado."},401);console.error("fanclub-password-recovery",e?.message||e);return json(req,{ok:false,message:"No se pudo completar la operación. Intenta nuevamente."},500)}
});
