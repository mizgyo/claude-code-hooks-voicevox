#!/usr/bin/env node

import { Command } from 'commander';
import { NotificationHandler } from './handlers/notification.js';
import { ToolName } from './types/index.js';
import { loadConfig } from './config/loader.js';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('zunda-hooks')
    .description('Claude hooks notification system')
    .version('0.0.2')
    .option('-c, --config <path>', 'Path to config JSON file');

  program
    .command('tool')
    .description('Play tool notification')
    .argument('<tool_name>', 'Name of the tool')
    .action(async (toolName: ToolName, options, command) => {
      console.log(`Running in tool mode...`);
      const config = await loadConfig(command.parent?.opts().config);
      const handler = new NotificationHandler(undefined, config);
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
    .action(async (options, command) => {
      console.log(`Running in notification mode...`);
      const config = await loadConfig(command.parent?.opts().config);
      const handler = new NotificationHandler(undefined, config);
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
    .action(async (options, command) => {
      console.log(`Running in stop mode...`);
      const config = await loadConfig(command.parent?.opts().config);
      const handler = new NotificationHandler(undefined, config);
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