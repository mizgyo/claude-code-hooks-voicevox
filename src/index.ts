#!/usr/bin/env node

import { NotificationHandler } from './handlers/notification.js';
import { NotificationMode, ToolName } from './types/index.js';

function printUsage(): void {
  console.log("Usage: zunda-hooks <mode> [tool_name]");
  console.log("Modes: tool, notification, stop");
}

async function main(): Promise<void> {
  if (process.argv.length < 3) {
    printUsage();
    process.exit(1);
  }

  const mode = process.argv[2] as NotificationMode;
  console.log(`Running in ${mode} mode...`);

  const handler = new NotificationHandler();

  try {
    switch (mode) {
      case 'tool':
        if (process.argv.length < 4) {
          console.log("Tool name required for tool mode");
          process.exit(1);
        }
        const toolName = process.argv[3] as ToolName;
        await handler.playToolNotification(toolName);
        break;

      case 'notification':
        await handler.playNotification();
        break;

      case 'stop':
        await handler.playStopNotification();
        break;

      default:
        console.log(`Unknown mode: ${mode}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error during notification:', error);
    process.exit(1);
  }
}

main().catch(console.error);