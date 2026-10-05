import {UpdatePasswordForm} from '../components/auth-forms';

export default function UpdatePassword(){
  return <main className="shell"><section className="notice authCard">
    <small>SEGURANÇA</small><h1>Definir nova senha</h1>
    <p>Use uma senha longa e exclusiva para o painel.</p>
    <UpdatePasswordForm/>
  </section></main>;
}
