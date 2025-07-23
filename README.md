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

## Usage

Test the installation:

```bash
zunda-hooks stop
```
