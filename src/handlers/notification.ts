import { VoicevoxService } from '../services/voicevox.js';
import { 
  TOOL_MESSAGES, 
  QUIET_TOOLS, 
  RARE_NOTIFICATION_TOOLS, 
  NOTIFICATION_MESSAGES, 
  STOP_MESSAGES,
  RARE_NOTIFICATION_PROBABILITY,
  DEFAULT_CONFIG
} from '../config/index.js';
import { ToolName, NotificationConfig } from '../types/index.js';
import { randomChoice, shouldSkipRareNotification } from '../utils/index.js';

export class NotificationHandler {
  private voicevox: VoicevoxService;
  private config: NotificationConfig;

  constructor(voicevoxService?: VoicevoxService, config?: NotificationConfig) {
    this.config = config ?? DEFAULT_CONFIG;
    this.voicevox = voicevoxService ?? new VoicevoxService(this.config);
  }

  private getToolMessage(toolName: string): string {
    const toolMessages = this.config.messages?.tools ?? TOOL_MESSAGES;
    const messages = toolMessages[toolName] || ["実行します"];
    return randomChoice(messages);
  }

  async playToolNotification(toolName: ToolName): Promise<void> {
    if (RARE_NOTIFICATION_TOOLS.includes(toolName)) {
      if (shouldSkipRareNotification(RARE_NOTIFICATION_PROBABILITY)) {
        return;
      }
    }

    const message = this.getToolMessage(toolName);

    if (QUIET_TOOLS.includes(toolName)) {
      await this.voicevox.speakQuiet(message);
    } else {
      await this.voicevox.speak(message);
    }
  }

  async playNotification(): Promise<void> {
    const messages = this.config.messages?.notification ?? NOTIFICATION_MESSAGES;
    const message = randomChoice(messages);
    await this.voicevox.speak(message);
  }

  async playStopNotification(): Promise<void> {
    const messages = this.config.messages?.stop ?? STOP_MESSAGES;
    const message = randomChoice(messages);
    await this.voicevox.speak(message);
  }
}