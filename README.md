# @kongyo2/deepwiki-ask

[DeepWiki MCP](https://mcp.deepwiki.com/) の `ask_question` ツールをラッピングした MCP サーバーです。

GitHub リポジトリについて質問すると、AI がコードベースとドキュメントに基づいた回答を返します。

## 特徴

- DeepWiki の `ask_question` ツールのみを公開するシンプルな構成
- 指数バックオフによる自動リトライ（最大3回）
- [neverthrow](https://github.com/supermacro/neverthrow) による型安全なエラーハンドリング
- stdio トランスポートで動作

## インストール

```bash
npm install -g @kongyo2/deepwiki-ask
```

## 使い方

### Claude Code

```bash
claude mcp add deepwiki-ask -- npx @kongyo2/deepwiki-ask
```

### Claude Desktop / Cursor / Windsurf

`settings.json` または MCP 設定ファイルに以下を追加:

```json
{
  "mcpServers": {
    "deepwiki-ask": {
      "command": "npx",
      "args": ["@kongyo2/deepwiki-ask"]
    }
  }
}
```

## ツール

### ask_question

GitHub リポジトリについて質問し、AI によるコンテキストベースの回答を取得します。

**パラメータ:**

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| `repoName` | `string \| string[]` | Yes | GitHub リポジトリ（`owner/repo` 形式、最大10個） |
| `question` | `string` | Yes | リポジトリについての質問 |

**使用例:**

```
repoName: "expressjs/express"
question: "ミドルウェアシステムはどのように動作しますか？"
```

```
repoName: ["facebook/react", "vercel/next.js"]
question: "SSRの実装方法の違いは？"
```

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|---|---|---|
| `DEEPWIKI_MCP_URL` | `https://mcp.deepwiki.com/mcp` | DeepWiki MCP サーバーの URL |

## テスト

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) の CLI モードでテストできます。

```bash
# ビルド
npm run build

# ツール一覧の確認
npx @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list

# ツールの実行
npx @modelcontextprotocol/inspector --cli node dist/index.js \
  --method tools/call \
  --tool-name ask_question \
  --tool-arg repoName=facebook/react \
  --tool-arg 'question=What is the reconciliation algorithm?'
```

## 開発

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build

# Lint
npm run lint

# 開発モード（ファイル変更時に自動再起動）
npm run dev
```

## ライセンス

MIT
