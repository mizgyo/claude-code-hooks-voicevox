import { readFile } from 'fs/promises';
import * as jsonc from 'jsonc-parser';
import { DEFAULT_CONFIG } from './index.js';
import { NotificationConfig } from '../types/index.js';

export async function loadConfig(configPath?: string): Promise<NotificationConfig> {
  if (!configPath) {
    return DEFAULT_CONFIG;
  }

  try {
    const configData = await readFile(configPath, 'utf8');
    const userConfig = jsonc.parse(configData) as Partial<NotificationConfig>;
    
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      messages: {
        ...DEFAULT_CONFIG.messages,
        ...userConfig.messages,
        tools: {
          ...DEFAULT_CONFIG.messages?.tools,
          ...userConfig.messages?.tools
        }
      }
    };
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.warn('Using default configuration');
    return DEFAULT_CONFIG;
  }
}