/**
 * item controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::item.item', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to create an item');
    }

    const { data } = ctx.request.body;

    const newEntry = await strapi.entityService.create('api::item.item', {
      data: {
        ...data,
        user: user.id, // ✅ Automatically associate user
      },
    });

    return { data: newEntry };
  },
}));
