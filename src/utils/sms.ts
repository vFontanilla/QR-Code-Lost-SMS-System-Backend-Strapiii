import Twilio from 'twilio';

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

export function toE164(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+') && digits.length >= 8) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return `+63${digits.slice(1)}`;
  const def = process.env.SMS_DEFAULT_COUNTRY || '63';
  if (/^\d{8,15}$/.test(digits)) return `+${def}${digits}`;
  return null;
}

export async function sendSMS(to: string, body: string) {
  const from = process.env.TWILIO_FROM;  // ✅ use this
  strapi.log.info(`FROM set? ${!!process.env.TWILIO_FROM}`);
  if (!from) throw new Error('TWILIO_FROM_NUMBER not set');
  return client.messages.create({ to, from, body });
}
