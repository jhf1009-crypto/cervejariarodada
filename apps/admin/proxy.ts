import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';

const PUBLIC_PATHS=['/login','/recover','/auth/callback'];

function isPublic(pathname:string){
  return PUBLIC_PATHS.some(path=>pathname===path||pathname.startsWith(path+'/'));
}

export async function proxy(request:NextRequest){
  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if(!url||!key){
    if(isPublic(request.nextUrl.pathname))return response;
    return NextResponse.redirect(new URL('/login?config=missing',request.url));
  }

  const supabase=createServerClient(url,key,{
    cookies:{
      getAll(){return request.cookies.getAll();},
      setAll(values){
        values.forEach(({name,value})=>request.cookies.set(name,value));
        response=NextResponse.next({request});
        values.forEach(({name,value,options})=>response.cookies.set(name,value,{
          ...options,
          httpOnly:true,
          secure:process.env.NODE_ENV==='production',
          sameSite:'lax',
          path:'/'
        }));
      }
    }
  });

  const {data:{user}}=await supabase.auth.getUser();
  const pathname=request.nextUrl.pathname;

  if(!user){
    if(isPublic(pathname))return response;
    const login=new URL('/login',request.url);
    login.searchParams.set('next',pathname);
    return NextResponse.redirect(login);
  }

  const {data:profile}=await supabase
    .from('admin_profiles')
    .select('role,active')
    .eq('user_id',user.id)
    .maybeSingle();

  if(!profile||profile.active===false){
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?access=denied',request.url));
  }

  if(profile.role==='owner'&&pathname!=='/mfa'){
    const {data:aal}=await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if(aal?.currentLevel!=='aal2')return NextResponse.redirect(new URL('/mfa',request.url));
  }

  if(pathname==='/login')return NextResponse.redirect(new URL('/',request.url));
  return response;
}

export const config={
  matcher:['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
