## Arcade Vault

Es una plataforma para jugar online y competir por la mayor cantidad de puntos.

## Usa Spec Driven Design

Basado en /spec y /spec-impl

Siguiendo las buenas practicas recomendadas aquí:
https://github.com/Klerith/fernando-skills

## Skills usadas

```bash
npx skills@latest add Klerith/fernando-skills
```

## Variables de entorno

El formulario de contacto de `/about` envía un correo al equipo con [Resend](https://resend.com). Crea un archivo `.env.local` en la raíz (ya está ignorado por `.gitignore`) con estas variables. Son solo de servidor: nunca les pongas el prefijo `NEXT_PUBLIC_`.

| Variable | Obligatoria | Ejemplo |
| --- | --- | --- |
| `RESEND_API_KEY` | Sí | `re_xxxxxxxx` |
| `CONTACT_TO_EMAIL` | Sí | correo del equipo |
| `CONTACT_FROM_EMAIL` | No | `Arcade Vault <onboarding@resend.dev>` (valor por defecto) |

```bash
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=equipo@ejemplo.com
# CONTACT_FROM_EMAIL="Arcade Vault <onboarding@resend.dev>"
```

> **Aviso:** con el remitente por defecto `onboarding@resend.dev`, Resend solo entrega correos a la dirección dueña de la cuenta de Resend. Si `CONTACT_TO_EMAIL` es otra dirección, el envío falla. Para producción, verifica un dominio propio en Resend y fija `CONTACT_FROM_EMAIL` con una dirección de ese dominio.

Si falta `RESEND_API_KEY` o `CONTACT_TO_EMAIL`, el formulario muestra un error genérico y el motivo queda registrado en el log del servidor.

## Hola mundo