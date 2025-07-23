# claude-code-hooks-voicevox

claude code hooks ずんだもんを設定
wsl のみ対応

## how to use

```bash
# install command
git clone git@github.com:mizgyo/claude-code-hooks-voicevox.git
cd claude-code-hooks-voicevox
npm install
npm run build
npm install -g .

# execute installed command
zunda-hooks stop

# prepare voicevox server
docker run -d -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest

# copy hooks to your favorite settings file (below is a sample command)
cat hooks-example.json | jq #あとなんとかして .claude/settings.local.jsonのhooksのところに追記する
```
