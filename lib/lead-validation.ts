import {z} from 'zod';

const optionalDate=z.union([z.literal(''),z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{
 const date=new Date(value+'T12:00:00Z');
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
},'Data inválida')]).optional();

export const Lead=z.object({
 name:z.string().trim().min(2).max(120),
 whatsapp:z.string().trim().max(30).regex(/^[+\d\s().-]+$/).transform(value=>value.replace(/\D/g,'')).pipe(z.string().min(10).max(15)),
 email:z.union([z.string().trim().email().max(254),z.literal('')]).optional(),
 event_date:optionalDate,
 city:z.string().trim().max(120).optional(),
 event_type:z.string().trim().max(120).optional(),
 guest_count:z.union([z.literal(''),z.coerce.number().int().positive().max(10000)]).optional(),
 message:z.string().trim().max(1000).optional(),
 website:z.string().max(200).optional()
});
