import "reflect-metadata";

export { createElysiaApplication, type ApplicationOptions } from "./application.factory";
export type { ControllerMetadata } from "./controller-metadata.interface";
export {
  addGlobalExceptionFilter,
  createElysiaPlugin,
} from "./elysia-plugin.factory";
export { type HttpAdapter, HttpAdapterHost } from "./http-adapter";
export { Module } from "./module.decorator";
