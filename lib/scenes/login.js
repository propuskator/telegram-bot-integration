import { Scenes } from 'telegraf';

import { login as runLoginCommand } from '../commands/index.js';

export const LOGIN_SCENE_ID = 'LOGIN_SCENE_ID';

const loginScene = new Scenes.WizardScene(
    LOGIN_SCENE_ID,
    async ctx => {
        const { wizard, wizard: { state } } = ctx;

        state.loginData = {};
        state.messagesIdsToDelete = [];

        const workspacePromptMessage = await ctx.reply('Please, enter your workspace name:');

        state.messagesIdsToDelete.push(workspacePromptMessage.message_id);

        return wizard.next();
    },
    async ctx => {
        const { wizard, wizard: { state } } = ctx;

        state.messagesIdsToDelete.push(ctx.message.message_id);
        state.loginData.workspaceName = ctx.message.text;

        const emailPromptMessage = await ctx.reply('Please, enter your email:');

        state.messagesIdsToDelete.push(emailPromptMessage.message_id);

        return wizard.next();
    },
    async ctx => {
        const { wizard, wizard: { state } } = ctx;

        state.messagesIdsToDelete.push(ctx.message.message_id);
        state.loginData.email = ctx.message.text;

        const passwordPromptMessage = await ctx.reply('Please, enter your password:');

        state.messagesIdsToDelete.push(passwordPromptMessage.message_id);

        return wizard.next();
    },
    async ctx => {
        const { wizard: { state } } = ctx;

        state.messagesIdsToDelete.push(ctx.message.message_id);
        state.loginData.password = ctx.message.text;

        await ctx.scene.leave();
        await runLoginCommand(ctx);
    }
);

export default loginScene;
