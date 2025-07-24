# claude-code-hooks-voicevox

Voice notifications for Claude Code using VOICEVOX.

## Prerequisites

- WSL environment
- Docker
- Node.js

## Installation

```bash
git clone https://github.com/mizgyo/claude-code-hooks-voicevox.git
cd claude-code-hooks-voicevox
npm install
npm run build
npm install -g .
```

## Setup

Start VOICEVOX server:

```bash
docker run -d -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
```

Copy hooks to your settings file:

```bash
[ -f .claude/settings.local.json ] && jq -s '.[0] * .[1]' .claude/settings.local.json hooks-example.json > temp.json && mv temp.json .claude/settings.local.json || cp hooks-example.json .claude/settings.local.json
```

## Configuration

You can customize the behavior by creating a configuration file:

```bash
cp config.sample.jsonc my-config.jsonc
```

Edit `my-config.jsonc` to customize:
- **voicevoxUrl**: VOICEVOX server URL (default: `http://localhost:50021`)
- **speaker**: Speaker ID (1: ずんだもん ノーマル, see [VOICEVOX Speaker IDs](https://www.voicevox.su-shiki.com/voicevox-id))
- **defaultVolume**: Volume for normal tools (0.0-1.0, default: 1.0)
- **quietVolume**: Volume for quiet tools like Read/Edit (0.0-1.0, default: 0.7)
- **speedScale**: Speech speed (1.0 = normal, 1.5 = 1.5x speed, default: 1.5)
- **tempDir**: Temporary directory for audio files (default: `/tmp/voicevox`)
- **messages**: Customize notification messages
  - **tools**: Messages for each tool (randomly selected if multiple)
  - **notification**: Messages for task completion
  - **stop**: Messages for session end

Use your custom config:

```bash
zunda-hooks --config my-config.jsonc tool Bash
```

## Usage

Basic commands:

```bash
# Play tool notification
zunda-hooks tool <tool_name>

# Play completion notification  
zunda-hooks notification

# Play stop notification
zunda-hooks stop
```

Test the installation:

```bash
zunda-hooks stop
```
