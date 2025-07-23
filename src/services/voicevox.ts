import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { VoicevoxQuery, NotificationConfig } from '../types/index.js';
import { DEFAULT_CONFIG } from '../config/index.js';

export class VoicevoxService {
  private config: NotificationConfig;

  constructor(config: Partial<NotificationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ensureTempDir();
  }

  private ensureTempDir(): void {
    if (!existsSync(this.config.tempDir)) {
      mkdirSync(this.config.tempDir, { recursive: true });
    }
  }

  private async fetchQuery(text: string): Promise<VoicevoxQuery> {
    const textEncoded = encodeURIComponent(text);
    const queryUrl = `${this.config.voicevoxUrl}/audio_query?text=${textEncoded}&speaker=${this.config.speaker}`;

    const response = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch query: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async synthesizeSpeech(queryData: VoicevoxQuery): Promise<ArrayBuffer> {
    const synthesisUrl = `${this.config.voicevoxUrl}/synthesis?speaker=${this.config.speaker}&enable_interrogative_upspeak=true`;

    const response = await fetch(synthesisUrl, {
      method: 'POST',
      headers: {
        accept: 'audio/wav',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to synthesize speech: ${response.status} ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  private generateRandomFilename(): string {
    return `output_${Math.random().toString(36).substr(2, 8)}.wav`;
  }

  async speak(text: string, volumeScale: number = this.config.defaultVolume): Promise<void> {
    if (!text) {
      return;
    }

    try {
      const queryData = await this.fetchQuery(text);
      
      queryData.speedScale = this.config.speedScale;
      queryData.volumeScale = volumeScale;

      const audioData = await this.synthesizeSpeech(queryData);

      const outputFile = join(this.config.tempDir, this.generateRandomFilename());
      writeFileSync(outputFile, Buffer.from(audioData));

      execSync(`aplay -q "${outputFile}"`, { stdio: 'ignore' });
    } catch (error) {
      console.error('VOICEVOX API error:', error);
    }
  }

  async speakQuiet(text: string): Promise<void> {
    await this.speak(text, this.config.quietVolume);
  }
}