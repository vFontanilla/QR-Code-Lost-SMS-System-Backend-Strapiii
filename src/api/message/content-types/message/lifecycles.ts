import { toE164, sendSMS } from '../../../../utils/sms';

type MessageEntity = {
  id: number;
  message?: string | null;
  sender_name?: string | null;
  sender_email?: string | null;
  sender_phone?: string | null;
  item?: number | { id?: number } | null;
};

type ItemEntity = {
  id: number;
  name?: string | null;
  documentId?: string | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
};

type MessageLifecycle = { afterCreate(event: unknown): Promise<void> | void };

const lifecycles: MessageLifecycle = {
  async afterCreate(event) {
    try {
      const created = (event as any).result as MessageEntity;
      strapi.log.info(`[afterCreate] New message created with ID: ${created.id}`);
      strapi.log.info(`[afterCreate] Sender phone from submission: ${created.sender_phone || 'N/A'}`);

      // Re-fetch with populate to ensure we have item + owner's phone
      const message = await strapi.db.query('api::message.message').findOne({
        where: { id: created.id },
        select: ['id', 'message', 'sender_name', 'sender_email', 'sender_phone'],
        populate: {
          item: {
            select: ['id', 'name', 'documentId', 'ownerName', 'ownerPhone'],
          },
        },
      });

      const item = (message as any)?.item as ItemEntity | undefined;
      if (!item) {
        strapi.log.warn(`[afterCreate] No related item found for message ID: ${created.id}`);
        return;
      }

      strapi.log.info(`[afterCreate] Found related item ID: ${item.id}`);
      strapi.log.info(`[afterCreate] Item documentId: ${item.documentId || 'N/A'}`);
      strapi.log.info(`[afterCreate] Item ownerPhone: ${item.ownerPhone || 'N/A'}`);

      const ownerPhone = item?.ownerPhone;
      if (!ownerPhone) {
        strapi.log.warn(`[afterCreate] Owner phone missing for item ID: ${item.id}`);
        return;
      }

      const to = toE164(ownerPhone);
      if (!to) {
        strapi.log.warn(`[afterCreate] Owner phone number invalid format: ${ownerPhone}`);
        return;
      }

      // Compose SMS
      const lines: string[] = [];
      lines.push(`Someone reported your item "${item?.name ?? 'Unknown'}" as FOUND.`);
      if (message?.message) lines.push(`Message: ${message.message}`);
      const contactBits: string[] = [];
      if (message?.sender_name) contactBits.push(`Name: ${message.sender_name}`);
      if (message?.sender_phone) contactBits.push(`Phone: ${message.sender_phone}`);
      if (message?.sender_email) contactBits.push(`Email: ${message.sender_email}`);
      if (contactBits.length) {
        lines.push('Finder contact:');
        lines.push(contactBits.join(' | '));
      }
      lines.push('Please reach out to coordinate pickup.');

      const body = lines.join('\n');
      strapi.log.info(`[afterCreate] Sending SMS to: ${to}`);
      strapi.log.debug(`[afterCreate] SMS body:\n${body}`);

      await sendSMS(to, body);
      strapi.log.info(`[afterCreate] SMS successfully sent to: ${to}`);
    } catch (err) {
      strapi.log.error('[message.afterCreate] SMS send failed:', err);
    }
  },
};

export default lifecycles;
