import Link from 'next/link';
import {RecoverForm} from '../components/auth-forms';

export default function Recover(){
  return <main className="shell"><section className="notice authCard">
    <small>RECUPERAÇÃO</small><h1>Recuperar senha</h1>
    <p>Informe o e-mail autorizado no painel.</p>
    <RecoverForm/>
    <Link href="/login" className="authLink">Voltar para o login</Link>
  </section></main>;
}
