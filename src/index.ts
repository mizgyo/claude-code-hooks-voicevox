#!/usr/bin/env node

import { Command } from 'commander';
import { NotificationHandler } from './handlers/notification.js';
import { ToolName } from './types/index.js';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('zunda-hooks')
    .description('Claude hooks notification system')
    .version('1.0.0');

  program
    .command('tool')
    .description('Play tool notification')
    .argument('<tool_name>', 'Name of the tool')
    .action(async (toolName: ToolName) => {
      console.log(`Running in tool mode...`);
      const handler = new NotificationHandler();
      try {
        await handler.playToolNotification(toolName);
      } catch (error) {
        console.error('Error during tool notification:', error);
        process.exit(1);
      }
    });

  program
    .command('notification')
    .description('Play general notification')
    .action(async () => {
      console.log(`Running in notification mode...`);
      const handler = new NotificationHandler();
      try {
        await handler.playNotification();
      } catch (error) {
        console.error('Error during notification:', error);
        process.exit(1);
      }
    });

  program
    .command('stop')
    .description('Play stop notification')
    .action(async () => {
      console.log(`Running in stop mode...`);
      const handler = new NotificationHandler();
      try {
        await handler.playStopNotification();
      } catch (error) {
        console.error('Error during stop notification:', error);
        process.exit(1);
      }
    });

  await program.parseAsync();
}

main().catch(console.error);