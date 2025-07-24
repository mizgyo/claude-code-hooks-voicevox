import { NotificationConfig, ToolMessage, ToolName } from '../types/index.js';

export const TOOL_MESSAGES: ToolMessage = {
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
};

export const QUIET_TOOLS: ToolName[] = ["Read", "Edit", "TodoRead", "TodoWrite"];

export const RARE_NOTIFICATION_TOOLS: ToolName[] = ["Read", "Edit", "MultiEdit"];

export const NOTIFICATION_MESSAGES: string[] = [
  "完了したのだ",
  "終わったのだ",
  "できたのだ",
  "おわりなのだ",
  "やったのだ",
];

export const STOP_MESSAGES: string[] = [
  "終了しました",
  "完了です",
  "おつかれさまです",
  "お疲れ様でした",
  "作業終了です",
];

export const DEFAULT_CONFIG: NotificationConfig = {
  voicevoxUrl: 'http://localhost:50021',
  speaker: 1,
  defaultVolume: 1.0,
  quietVolume: 0.7,
  speedScale: 1.5,
  tempDir: '/tmp/voicevox',
  messages: {
    tools: TOOL_MESSAGES,
    notification: NOTIFICATION_MESSAGES,
    stop: STOP_MESSAGES,
  },
};

export const RARE_NOTIFICATION_PROBABILITY = 0.1;