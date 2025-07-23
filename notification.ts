#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 各ツールに対応したメッセージ
const TOOL_MESSAGES: { [key: string]: string[] } = {
  Task: ["作業開始なのだ", "頑張るのだ", "処理中なのだ"],
  Bash: ["実行します", "コマンドです", "処理します"],
  Glob: ["探します", "どこかなぁ", "見つけましたのだ"],
  Grep: ["探します", "どこだろ", "ありました"],
  LS: ["覗いてみるのだ", "何があるのだ", "見てみるのだ"],
  Read: ["なるほどなのだ", "ふむふむなのだ", "へぇなのだ"],
  Edit: ["よしよしなのだ", "できたのだ", "よしなのだ"],
  MultiEdit: ["一気にやるのだ", "まとめてやるのだ", "よしよしなのだ"],
  Write: ["書き込みます", "作成します", "ファイル作成します"],
  NotebookRead: ["ノートブック読みます"],
  NotebookEdit: ["ノートブック編集します"],
  WebFetch: ["ウェブ取得します"],
  WebSearch: ["ウェブ検索します"],
  TodoRead: ["リスト確認します", "なにするんだっけ..."],
  TodoWrite: ["リスト更新します"],
  exit_plan_mode: ["プランモードを終了します"],
  mcp__todoist__listTasks: ["タスク一覧を取得します"],
  mcp__todoist__getTask: ["タスクを取得します"],
  mcp__todoist__createTask: ["タスクを作成します"],
  mcp__todoist__updateTask: ["タスクを更新します"],
  mcp__todoist__completeTask: ["タスクを完了します"],
  mcp__todoist__reopenTask: ["タスクを再開します"],
  mcp__todoist__deleteTask: ["タスクを削除します"],
  mcp__todoist__listProjects: ["プロジェクト一覧を取得します"],
  mcp__todoist__getProject: ["プロジェクトを取得します"],
  mcp__todoist__createProject: ["プロジェクトを作成します"],
  mcp__todoist__updateProject: ["プロジェクトを更新します"],
  mcp__todoist__archiveProject: ["プロジェクトをアーカイブします"],
  mcp__todoist__unarchiveProject: ["プロジェクトのアーカイブを解除します"],
  mcp__todoist__deleteProject: ["プロジェクトを削除します"],
  mcp__todoist__getProjectCollaborators: ["協力者を取得します"],
  mcp__todoist__listSections: ["セクション一覧を取得します"],
  mcp__todoist__getSection: ["セクションを取得します"],
  mcp__todoist__createSection: ["セクションを作成します"],
  mcp__todoist__updateSection: ["セクションを更新します"],
  mcp__todoist__deleteSection: ["セクションを削除します"],
  mcp__todoist__listComments: ["コメント一覧を取得します"],
  mcp__todoist__getComment: ["コメントを取得します"],
  mcp__todoist__createComment: ["コメントを作成します"],
  mcp__todoist__updateComment: ["コメントを更新します"],
  mcp__todoist__deleteComment: ["コメントを削除します"],
  mcp__todoist__listLabels: ["ラベル一覧を取得します"],
  mcp__todoist__getLabel: ["ラベルを取得します"],
  mcp__todoist__createLabel: ["ラベルを作成します"],
  mcp__todoist__updateLabel: ["ラベルを更新します"],
  mcp__todoist__deleteLabel: ["ラベルを削除します"],
  mcp__todoist__getSharedLabels: ["共有ラベルを取得します"],
  mcp__todoist__renameSharedLabel: ["共有ラベル名を変更します"],
  mcp__todoist__removeSharedLabel: ["共有ラベルを削除します"],
};

// 音量を下げるツール
const QUIET_TOOLS = ["Read", "Edit", "TodoRead", "TodoWrite"];

// 低頻度で通知するツール（10回に1回の確率）
const RARE_NOTIFICATION_TOOLS = ["Read", "Edit", "MultiEdit"];

// 通知完了メッセージ
const NOTIFICATION_MESSAGES = [
  "完了したのだ",
  "終わったのだ",
  "できたのだ",
  "おわりなのだ",
  "やったのだ",
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function playSound(soundFile: string): void {
  try {
    if (existsSync(soundFile)) {
      execSync(`aplay "${soundFile}"`, { stdio: "ignore" });
    }
  } catch (error) {
    // エラーは無視
  }
}

function dosuru(): void {
  const audioFile = "/home/yuu/claude-hooks/audio/dosuru.wav";
  playSound(audioFile);
}

function shuryou(): void {
  const audioFile = "/home/yuu/claude-hooks/audio/shuryou.wav";
  playSound(audioFile);
}

function slackNotify(message: string): void {
  const webhookUrl =
    "https://hooks.slack.com/triggers/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";

  try {
    const data = JSON.stringify({ text: message });
    execSync(
      `curl -X POST -H 'Content-type: application/json' --data '${data}' "${webhookUrl}"`,
      { stdio: "ignore" }
    );
  } catch (error) {
    // エラーは無視
  }
}

async function voicevox(
  text: string,
  volumeScale: number = 1.0
): Promise<void> {
  if (!text) {
    return;
  }

  try {
    // 一時ディレクトリを作成
    const tempDir = "/tmp/voicevox";
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    // テキストをURLエンコード
    const textEncoded = encodeURIComponent(text);

    // 音声クエリを取得
    const queryUrl = `http://localhost:50021/audio_query?text=${textEncoded}&speaker=1`;

    const queryResponse = await fetch(queryUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    });

    const queryData = await queryResponse.json();

    // 速度と音量を調整
    queryData.speedScale = 1.5;
    queryData.volumeScale = volumeScale;

    // 音声合成
    const synthesisUrl =
      "http://localhost:50021/synthesis?speaker=1&enable_interrogative_upspeak=true";

    const synthesisResponse = await fetch(synthesisUrl, {
      method: "POST",
      headers: {
        accept: "audio/wav",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryData),
    });

    const audioData = await synthesisResponse.arrayBuffer();

    // 音声ファイルに保存（ランダムファイル名）
    const randomFilename = `output_${Math.random()
      .toString(36)
      .substr(2, 8)}.wav`;
    const outputFile = join(tempDir, randomFilename);
    writeFileSync(outputFile, Buffer.from(audioData));

    // 音声を再生
    execSync(`aplay -q "${outputFile}"`, { stdio: "ignore" });
  } catch (error) {
    // エラーは無視
  }
}

function getToolMessage(toolName: string): string {
  const messages = TOOL_MESSAGES[toolName] || ["実行します"];
  return randomChoice(messages);
}

async function playToolNotification(toolName: string): Promise<void> {
  // 低頻度通知ツールの場合は10回に1回の確率でのみ通知
  if (RARE_NOTIFICATION_TOOLS.includes(toolName)) {
    if (Math.floor(Math.random() * 10) + 1 !== 1) {
      return; // 90%の確率で通知をスキップ
    }
  }

  const message = getToolMessage(toolName);

  if (QUIET_TOOLS.includes(toolName)) {
    // 音量を下げて再生
    await voicevox(message, 0.7);
  } else {
    // 通常音量で再生
    await voicevox(message);
  }
}

async function playNotification(): Promise<void> {
  const message = randomChoice(NOTIFICATION_MESSAGES);
  await voicevox(message);
}

async function playStopNotification(): Promise<void> {
  const stopMessages = [
    "終了しました",
    "完了です",
    "おつかれさまです",
    "お疲れ様でした",
    "作業終了です",
  ];
  const message = randomChoice(stopMessages);
  await voicevox(message);
}

async function main(): Promise<void> {
  if (process.argv.length < 3) {
    console.log("Usage: node notification.js <mode> [tool_name]");
    console.log("Modes: tool, notification, stop");
    process.exit(1);
  }

  const mode = process.argv[2];

  if (mode === "tool") {
    if (process.argv.length < 4) {
      console.log("Tool name required for tool mode");
      process.exit(1);
    }
    const toolName = process.argv[3];
    await playToolNotification(toolName);
  } else if (mode === "notification") {
    await playNotification();
  } else if (mode === "stop") {
    await playStopNotification();
  } else {
    console.log(`Unknown mode: ${mode}`);
    process.exit(1);
  }
}

main().catch(console.error);
