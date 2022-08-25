# hotate

hotate（ほたて）は、Linux / MacOS / Windows で動作する縦書きエディタです。

![image](https://user-images.githubusercontent.com/57034105/186642350-91de5782-c506-412a-8e37-cfb1a4c1fad9.png)
![image_dark](https://user-images.githubusercontent.com/57034105/186642057-d5049f1d-523e-405f-89ae-c698497b613c.png)

## 開発

```sh
pnpm install
pnpm tauri dev
```

## ビルド

```sh
pnpm tauri build
```

`src-tauri/target/release`以下にバイナリ・パッケージ等が出力されます。

## 実装する可能性がある機能

- ファイル自動保存
- 検索
- カスタムテーマ
- テキスト整形（行頭空白挿入など）
- （ルビ記法のプレビュー表示）

## 実装しない機能

- `.txt` ファイル以外の編集
- （ごく簡易的なものを除く）印刷・フォーマット変換
- 組版機能
- その他単純さを損ねる様々なもの
