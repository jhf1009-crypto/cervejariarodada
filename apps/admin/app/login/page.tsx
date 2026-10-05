import Link from 'next/link';
import {LoginForm} from '../components/auth-forms';

export default function Login(){
  return <main className="shell">
    <section className="notice authCard">
      <small>ACESSO RESTRITO</small>
      <h1>Entrar</h1>
      <p>Não há cadastro público. Contas são convidadas por um owner.</p>
      <LoginForm/>
      <Link href="/recover" className="authLink">Esqueci minha senha</Link>
    </section>
  </main>;
}
