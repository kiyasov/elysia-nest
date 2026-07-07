/**
 * Event system public exports.
 *
 * Historically this barrel exported a standalone placeholder emitter that
 * implemented only `on`/`emit`. That produced a split-brain: the framework
 * internals (`registerEventHandlers`, `Container.clear()`) operated on a
 * DIFFERENT singleton defined in `event-emitter.container.ts`, which has full
 * `off`/`once`/`removeAllListeners` support that `Container.clear()` actually
 * resets. Public consumers therefore leaked listeners (no removal API existed)
 * and never received events emitted through the `@OnEvent` decorator path.
 *
 * This barrel now re-exports the single, unified emitter so there is exactly
 * ONE global event emitter. `getEventEmitter()` still returns an object with
 * `.on`/`.emit`, and now ALSO exposes `.off`/`.once`/`.removeAllListeners`.
 */
export * from "./event-emitter";
export * from "./event-emitter.interface";
export { getEventEmitter } from "./event-emitter.container";
export {
  EVENTS_METADATA,
  EventSubscriber,
  OnEvent,
  registerEventHandlers,
} from "./event.decorators";
export type { OnEventOptions } from "./event.decorators";
