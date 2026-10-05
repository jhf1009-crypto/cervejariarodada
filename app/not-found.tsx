import Link from 'next/link';

export default function NotFound(){return <main className="productPage"><Link className="productBack" href="/">← VOLTAR</Link><section className="productHeroCopy"><p className="eyebrow">404</p><h1>PÁGINA<br/>NÃO ENCONTRADA.</h1><p className="productDescription">Essa página não faz parte da Rodada. Volte para o início e continue navegando pelos produtos e eventos.</p><div className="productActions"><Link className="primary" href="/">VOLTAR AO INÍCIO</Link><Link className="secondary" href="/produtos">VER PRODUTOS</Link></div></section></main>}
