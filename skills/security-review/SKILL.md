# security-review
Use antes de release e após auth/banco/upload.
## Checklist
- [ ] Nenhum segredo no cliente/repo
- [ ] service/secret key somente server-side
- [ ] RLS em tabelas expostas
- [ ] Grants mínimos
- [ ] Papéis owner/editor/viewer testados
- [ ] Upload com tipo/tamanho/alt
- [ ] Rate limit e validação de lead
- [ ] Headers de segurança
- [ ] Audit log para operações sensíveis
