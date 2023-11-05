import { Stmt } from "../frontend/ast.ts";
import Environment from "./environment.ts";

export type ValueTypes =
  | "null"
  | "number"
  | "boolean"
  | "object"
  | "native-fn"
  | "function";

export interface RuntimeVal {
  type: ValueTypes;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export function MK_NULL(): NullVal {
  return { type: "null", value: null };
}

export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export function MK_BOOL(b = true): BooleanVal {
  return { type: "boolean", value: b };
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MK_NUMBER(n = 0): NumberVal {
  return { type: "number", value: n };
}

export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
  type: "native-fn";
  call: FunctionCall;
}

export function MK_NATIVE_FN(call: FunctionCall): NativeFnValue {
  return { type: "native-fn", call };
}

export interface FunctionValue extends RuntimeVal {
  type: "function";
  name: string;
  parameters: string[];
  declarationEnv: Environment;
  body: Stmt[];
}
