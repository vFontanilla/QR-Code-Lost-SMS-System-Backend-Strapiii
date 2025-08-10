"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.toE164 = void 0;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
function toE164(raw) {
    if (!raw)
        return null;
    const digits = raw.replace(/[^\d+]/g, '');
    if (digits.startsWith('+') && digits.length >= 8)
        return digits;
    if (digits.startsWith('0') && digits.length >= 10)
        return `+63${digits.slice(1)}`;
    const def = process.env.SMS_DEFAULT_COUNTRY || '63';
    if (/^\d{8,15}$/.test(digits))
        return `+${def}${digits}`;
    return null;
}
exports.toE164 = toE164;
async function sendSMS(to, body) {
    const from = process.env.TWILIO_FROM; // ✅ use this
    strapi.log.info(`FROM set? ${!!process.env.TWILIO_FROM}`);
    if (!from)
        throw new Error('TWILIO_FROM_NUMBER not set');
    return client.messages.create({ to, from, body });
}
exports.sendSMS = sendSMS;
