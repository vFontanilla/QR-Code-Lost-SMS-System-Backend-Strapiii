"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sms_1 = require("../../../../utils/sms");
const lifecycles = {
    async afterCreate(event) {
        var _a;
        try {
            const created = event.result;
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
            const item = message === null || message === void 0 ? void 0 : message.item;
            if (!item) {
                strapi.log.warn(`[afterCreate] No related item found for message ID: ${created.id}`);
                return;
            }
            strapi.log.info(`[afterCreate] Found related item ID: ${item.id}`);
            strapi.log.info(`[afterCreate] Item documentId: ${item.documentId || 'N/A'}`);
            strapi.log.info(`[afterCreate] Item ownerPhone: ${item.ownerPhone || 'N/A'}`);
            const ownerPhone = item === null || item === void 0 ? void 0 : item.ownerPhone;
            if (!ownerPhone) {
                strapi.log.warn(`[afterCreate] Owner phone missing for item ID: ${item.id}`);
                return;
            }
            const to = (0, sms_1.toE164)(ownerPhone);
            if (!to) {
                strapi.log.warn(`[afterCreate] Owner phone number invalid format: ${ownerPhone}`);
                return;
            }
            // Compose SMS
            const lines = [];
            lines.push(`Someone reported your item "${(_a = item === null || item === void 0 ? void 0 : item.name) !== null && _a !== void 0 ? _a : 'Unknown'}" as FOUND.`);
            if (message === null || message === void 0 ? void 0 : message.message)
                lines.push(`Message: ${message.message}`);
            const contactBits = [];
            if (message === null || message === void 0 ? void 0 : message.sender_name)
                contactBits.push(`Name: ${message.sender_name}`);
            if (message === null || message === void 0 ? void 0 : message.sender_phone)
                contactBits.push(`Phone: ${message.sender_phone}`);
            if (message === null || message === void 0 ? void 0 : message.sender_email)
                contactBits.push(`Email: ${message.sender_email}`);
            if (contactBits.length) {
                lines.push('Finder contact:');
                lines.push(contactBits.join(' | '));
            }
            lines.push('Please reach out to coordinate pickup.');
            const body = lines.join('\n');
            strapi.log.info(`[afterCreate] Sending SMS to: ${to}`);
            strapi.log.debug(`[afterCreate] SMS body:\n${body}`);
            await (0, sms_1.sendSMS)(to, body);
            strapi.log.info(`[afterCreate] SMS successfully sent to: ${to}`);
        }
        catch (err) {
            strapi.log.error('[message.afterCreate] SMS send failed:', err);
        }
    },
};
exports.default = lifecycles;
