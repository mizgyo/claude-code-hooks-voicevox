import { VoicevoxService } from '../services/voicevox.js';
import { 
  TOOL_MESSAGES, 
  QUIET_TOOLS, 
  RARE_NOTIFICATION_TOOLS, 
  NOTIFICATION_MESSAGES, 
  STOP_MESSAGES,
  RARE_NOTIFICATION_PROBABILITY 
} from '../config/index.js';
import { ToolName } from '../types/index.js';
import { randomChoice, shouldSkipRareNotification } from '../utils/index.js';

export class NotificationHandler {
  private voicevox: VoicevoxService;

  constructor(voicevoxService?: VoicevoxService) {
    this.voicevox = voicevoxService ?? new VoicevoxService();
  }

  private getToolMessage(toolName: string): string {
    const messages = TOOL_MESSAGES[toolName] || ["実行します"];
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
    const message = randomChoice(NOTIFICATION_MESSAGES);
    await this.voicevox.speak(message);
  }

  async playStopNotification(): Promise<void> {
    const message = randomChoice(STOP_MESSAGES);
    await this.voicevox.speak(message);
  }
}