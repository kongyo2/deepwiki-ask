# @kongyo2/deepwiki-ask

[![npm version](https://img.shields.io/npm/v/%40kongyo2%2Fdeepwiki-ask)](https://www.npmjs.com/package/@kongyo2/deepwiki-ask)
[![CI](https://github.com/kongyo2/deepwiki-ask/actions/workflows/ci.yml/badge.svg)](https://github.com/kongyo2/deepwiki-ask/actions/workflows/ci.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kongyo2/deepwiki-ask)

[DeepWiki MCP](https://mcp.deepwiki.com/) の `ask_question` ツールをラッピングした MCP サーバーです。

GitHub リポジトリについて質問すると、AI がコードベースとドキュメントに基づいた回答を返します。

## 特徴

- DeepWiki の `ask_question` ツールのみを公開するシンプルな構成
- 指数バックオフによる自動リトライ（最大3回）
- [neverthrow](https://github.com/supermacro/neverthrow) による型安全なエラーハンドリング
- stdio トランスポートで動作

## MCP Client Configuration

### Claude Code

Install via CLI (MCP only):

```bash
claude mcp add --scope user deepwiki-ask -- npx -y @kongyo2/deepwiki-ask
```

### Codex

```bash
codex mcp add deepwiki-ask -- npx -y @kongyo2/deepwiki-ask
```

## ライセンス

MIT
