import {
  MK_BOOL,
  MK_NATIVE_FN,
  MK_NULL,
  MK_NUMBER,
  RuntimeVal,
} from "./values.ts";

export function createGlobalEnv() {
  const env = new Environment();
  // Create Default Global Environment
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(true), true);
  env.declareVar("null", MK_NULL(), true);

  // Define a native builtin method;
  env.declareVar(
    "print",
    MK_NATIVE_FN((args, scope) => {
      console.log(...args);
      return MK_NULL();
    }),
    true,
  );

  function timeFunction(args: RuntimeVal[], env: Environment): RuntimeVal {
    return MK_NUMBER(Date.now());
  }
  env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

  return env;
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(
    varname: string,
    value: RuntimeVal,
    constant: boolean,
  ): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Variable ${varname} already declared.`;
    }
    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    // Connot assign to constant
    if (env.constants.has(varname)) {
      throw `Cannot assign to constant ${varname}.`;
    }
    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent === void 0) {
      throw `Variable ${varname} not declared.`;
    }
    return this.parent.resolve(varname);
  }
}
