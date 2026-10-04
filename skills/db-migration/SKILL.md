# db-migration
Use em qualquer mudança de schema.
## Passos
1. Com Supabase CLI configurado, criar arquivo via `supabase migration new <nome>`.
2. Aplicar alteração em ambiente de desenvolvimento.
3. Revisar grants e RLS de cada tabela afetada.
4. Rodar advisors/testes disponíveis.
5. Gerar/validar tipos e testar rollback.
## Checklist
- [ ] Migration criada pela CLI
- [ ] RLS/grants revisados
- [ ] Seed compatível
- [ ] Rollback documentado
