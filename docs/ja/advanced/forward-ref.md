---
title: フォワードリファレンス
icon: link
description: forwardRef() で循環依存を解決する
---

循環依存は 2 つのサービスがお互いに依存する場合に発生します。nestelia はこのようなケースを処理するために `forwardRef()` を提供します。

## 問題

```typescript
// これは循環依存を作り出します:
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

解決時に、`ServiceA` は `ServiceB` を必要とし、`ServiceB` は `ServiceA` を必要とします — デッドロックです。

## 解決策

循環参照の少なくとも片方に `forwardRef()` を使用します:

```typescript
import { Injectable, Inject, forwardRef } from "nestelia";

@Injectable()
class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB)) private b: ServiceB
  ) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

`forwardRef(() => ServiceB)` はすべてのプロバイダーが登録されるまで `ServiceB` の解決を遅らせ、循環チェーンを解消します。

## forwardRef を使う場面

- お互いを参照する 2 つのサービス
- サービスがコントローラーを参照し、コントローラーがサービスを参照する場合
- モジュール間の循環インポート

## ベストプラクティス

循環依存は多くの場合、設計上の問題を示しています。`forwardRef()` に頼る前に以下を検討してください:

1. **共有ロジックを抽出する** — 両方が依存できる第 3 のサービスに移す
2. **イベントを使う** — 一方がパブリッシュし、もう一方がサブスクライブする
3. **モジュールを再構成する** — 共有プロバイダーを共通モジュールに移す

リファクタリングが実用的でない場合にのみ `forwardRef()` を使用してください。
