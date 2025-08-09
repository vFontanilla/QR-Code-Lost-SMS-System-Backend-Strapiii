import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::message.message', ({ strapi }) => ({
  async createByDocumentId(ctx) {
    const { documentId, message, sender_name, sender_email, sender_phone } = ctx.request.body || {};

    if (!documentId || !message?.trim()) {
      return ctx.badRequest('documentId and message are required.');
    }

    // IMPORTANT: Use the Query Engine to filter by documentId
    // Try camelCase first; if your Strapi version maps system fields differently,
    // switch to { document_id: documentId }.
    const item = await strapi.db.query('api::item.item').findOne({
      where: { document_id: documentId },                 // <- if this errors, try: where: { document_id: documentId }
      select: ['id', 'name', 'documentId', 'ownerName', 'ownerPhone'],
    });

    if (!item) return ctx.notFound('Item not found for documentId.');

    // Create the message and link the item
    const created = await strapi.entityService.create('api::message.message', {
    data: {
        message: message.trim(),
        sender_name: sender_name?.trim() || null,
        sender_email: sender_email?.trim() || null,
        sender_phone: sender_phone?.trim() || null,

        item: item.id,
    },
    // you can omit populate, or keep this simple form:
    // populate: ['item'],
    });

    ctx.body = { data: created };
  },
}));
