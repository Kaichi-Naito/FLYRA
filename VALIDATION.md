# 初版の検証記録

## v1.1 更新の検証

- 独立したテスト用オリジンで `ui-tests.html`：15 passed / 0 failed。右端のレイヤー列、調整列、候補の描画、取消時のピクセル一致、クリック確定と1回のUndo、Esc、ロック、画像効果、選択変更、素材生成、サイズ変更、保存データへのプレビュー非混入を確認。
- 既存 `tests.html`：15 passed / 0 failed。ブラウザのエラー・警告ログなし。1280×720で画面配置を目視確認。
- UIテストは作品を自動保存するため、普段使うブラウザの公開版ではなく、テスト用ブラウザまたは別オリジンで実行してください。

## v1.0

2026-09-24、Chromium ベースのブラウザで localhost 配信を検証。

- `tests.html`: **15 passed / 0 failed**。12テンプレートの描画・保存形式・PNG化、18合成モード、ハードミックスの画素演算と透明度、シードの再現性、ロック保持、粒子レイヤーの増殖防止、回転後の当たり判定、サイズ変更、不正な編集データの拒否、全画像加工・マスク。
- UI: 日本語タイトルの編集、生成アイコン2点の一括追加、ハードミックスへの切替、1080×1350 PNG 書き出し。
- 自動保存: ページを開き直した後にタイトル・画像を含む作品が復元されることを確認。
- 素材棚: ローカルPNGの登録、再読込後も登録素材が残ることを確認。
- 画像生成素材: 6点の元PNGを同梱。アイコン3点のアルファチャンネルが0〜255であることを確認。
- JavaScript: Node.js の構文チェックに合格。操作確認中のブラウザエラーログなし。

直接 `file://` で開く自動操作は検証ブラウザのURLポリシーで許可されず、実機確認は未実施です。アプリは外部通信・fetch・ES modulesに依存せず、画像を同梱JavaScriptに埋め込む構成です。GitHub Pages 公開後の実URL確認は公開設定後に行う必要があります。

この検証はすべての端末・ブラウザでの動作保証を意味しません。PDF/CMYK、任意パス編集、PSD/AIの入出力は初版の対象外です。

## v1.2 検証

- 内蔵12素材の原本をdownload.pngへ改名しても素材名を復元。無関係なファイル名は保持。
- 18書体の対応ウェイトを保存・検証・再読込。追加14書体の最小・最大ウェイトを実際に読み込み。
- 描画・データの既存15テストが成功。
- 追加書体はGoogle Fontsへの通信を使用。初回のオンライン接続が必要。
- v1.2追加45項目・UI20項目が成功。直接アップロード、ドラッグ＆ドロップ、素材棚登録の3経路で素材名を確認。

## v1.3 Template Pack 02

- 16種類追加、合計28種類の描画・保存・PNG出力を含む既存15テストが成功。
- 新16種類の編集用テキスト、正方形・縦長サイズ、4マスクの透明領域と保存に関する36項目が成功。
- UIから4種類の写真枠に画像を取り込み、切り抜き形状が保持される4項目が成功。
- 16種類の一覧をブラウザで目視確認。画像部分は写真差し替え用のベクター風景です。
素材取り込み更新：PR #1の12素材と利用者アップロード9画像を含む33点すべてでデコード・Canvas描画・保存・名前復元を確認。JPEGのMIMEとビルド再実行時の重複防止を検証。

## v1.4
transform-tests.html: 27 passed / 0 failed (four corners at four rotations, live numeric/slider rendering, undo/cancel, handle rotation/resize, center snap). ui-tests.html: 20 passed / 0 failed.


Photo frames: mask-tests.html 8 passed / 0 failed. Drop replacement, geometry/mask preservation, saved project validation, transparent corner pixels, filled center pixels, double-click picker.


## v1.5 管理画面
admin-tests.html: 10 checks passed with a mock repository (no real credentials). admin-api-tests.cjs: atomic tree/commit, conflict refusal, restricted paths, permissions error, token lifecycle. site-library-tests.cjs: category overrides, hidden/path filtering, canonical names. Browser-authenticated production write requires user's own GitHub token and was not exercised.


## v1.6
layer-dnd-tests.html: 12 passed (ordering, indicators, cancellation, locks, history, persistence). history-frame-tests.html: 14 passed (numeric/text input undo, dropdown undo, pending input, parent/child controls, photo dragging, removal/restore, project validation).


Wheel zoom: wheel-tests.html 10 passed / 0 failed. Direction, line deltas, cursor anchor, 40–300% limits, panel isolation, fit reset, unchanged project/undo. Canvas fit uses outer viewport dimensions to avoid scrollbar-dependent zoom drift.
