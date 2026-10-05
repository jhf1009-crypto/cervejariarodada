import {MfaSetup} from '../components/auth-forms';
import {requireAdmin} from '../../lib/auth';

export default async function MFA(){
  const {profile}=await requireAdmin({requireAal2ForOwner:false});
  if(profile.role!=='owner'){
    return <main className="shell"><section className="notice authCard"><h1>MFA</h1><p>Esta etapa é obrigatória apenas para owners.</p></section></main>;
  }
  return <main className="shell"><section className="notice authCard">
    <small>SEGUNDA ETAPA</small>
    <h1>MFA obrigatório</h1>
    <p>Use um aplicativo autenticador compatível com TOTP. O painel só libera owners após a segunda etapa.</p>
    <MfaSetup/>
  </section></main>;
}
