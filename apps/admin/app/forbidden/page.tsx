import Link from 'next/link';

export default function Forbidden(){
  return <main className="shell"><section className="notice authCard"><small>403</small><h1>Acesso negado</h1><p>Seu papel não permite acessar esta área.</p><Link href="/">Voltar ao painel</Link></section></main>;
}
