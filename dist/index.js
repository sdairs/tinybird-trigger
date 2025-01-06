var qs = Object.defineProperty;
var Qn = (t) => {
  throw TypeError(t);
};
var Xs = (t, e, n) => e in t ? qs(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var _ = (t, e, n) => Xs(t, typeof e != "symbol" ? e + "" : e, n), Vr = (t, e, n) => e.has(t) || Qn("Cannot " + n);
var F = (t, e, n) => (Vr(t, e, "read from private field"), n ? n.call(t) : e.get(t)), G = (t, e, n) => e.has(t) ? Qn("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), Be = (t, e, n, a) => (Vr(t, e, "write to private field"), a ? a.call(t, n) : e.set(t, n), n), y = (t, e, n) => (Vr(t, e, "access private method"), n);
var O;
(function(t) {
  t.assertEqual = (s) => s;
  function e(s) {
  }
  t.assertIs = e;
  function n(s) {
    throw new Error();
  }
  t.assertNever = n, t.arrayToEnum = (s) => {
    const i = {};
    for (const o of s)
      i[o] = o;
    return i;
  }, t.getValidEnumValues = (s) => {
    const i = t.objectKeys(s).filter((c) => typeof s[s[c]] != "number"), o = {};
    for (const c of i)
      o[c] = s[c];
    return t.objectValues(o);
  }, t.objectValues = (s) => t.objectKeys(s).map(function(i) {
    return s[i];
  }), t.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const i = [];
    for (const o in s)
      Object.prototype.hasOwnProperty.call(s, o) && i.push(o);
    return i;
  }, t.find = (s, i) => {
    for (const o of s)
      if (i(o))
        return o;
  }, t.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function a(s, i = " | ") {
    return s.map((o) => typeof o == "string" ? `'${o}'` : o).join(i);
  }
  t.joinValues = a, t.jsonStringifyReplacer = (s, i) => typeof i == "bigint" ? i.toString() : i;
})(O || (O = {}));
var cn;
(function(t) {
  t.mergeShapes = (e, n) => ({
    ...e,
    ...n
    // second overwrites first
  });
})(cn || (cn = {}));
const v = O.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), he = (t) => {
  switch (typeof t) {
    case "undefined":
      return v.undefined;
    case "string":
      return v.string;
    case "number":
      return isNaN(t) ? v.nan : v.number;
    case "boolean":
      return v.boolean;
    case "function":
      return v.function;
    case "bigint":
      return v.bigint;
    case "symbol":
      return v.symbol;
    case "object":
      return Array.isArray(t) ? v.array : t === null ? v.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? v.promise : typeof Map < "u" && t instanceof Map ? v.map : typeof Set < "u" && t instanceof Set ? v.set : typeof Date < "u" && t instanceof Date ? v.date : v.object;
    default:
      return v.unknown;
  }
}, h = O.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]), Qs = (t) => JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, "$1:");
class H extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (a) => {
      this.issues = [...this.issues, a];
    }, this.addIssues = (a = []) => {
      this.issues = [...this.issues, ...a];
    };
    const n = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, n) : this.__proto__ = n, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const n = e || function(i) {
      return i.message;
    }, a = { _errors: [] }, s = (i) => {
      for (const o of i.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(s);
        else if (o.code === "invalid_return_type")
          s(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          s(o.argumentsError);
        else if (o.path.length === 0)
          a._errors.push(n(o));
        else {
          let c = a, u = 0;
          for (; u < o.path.length; ) {
            const l = o.path[u];
            u === o.path.length - 1 ? (c[l] = c[l] || { _errors: [] }, c[l]._errors.push(n(o))) : c[l] = c[l] || { _errors: [] }, c = c[l], u++;
          }
        }
    };
    return s(this), a;
  }
  static assert(e) {
    if (!(e instanceof H))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, O.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (n) => n.message) {
    const n = {}, a = [];
    for (const s of this.issues)
      s.path.length > 0 ? (n[s.path[0]] = n[s.path[0]] || [], n[s.path[0]].push(e(s))) : a.push(e(s));
    return { formErrors: a, fieldErrors: n };
  }
  get formErrors() {
    return this.flatten();
  }
}
H.create = (t) => new H(t);
const rt = (t, e) => {
  let n;
  switch (t.code) {
    case h.invalid_type:
      t.received === v.undefined ? n = "Required" : n = `Expected ${t.expected}, received ${t.received}`;
      break;
    case h.invalid_literal:
      n = `Invalid literal value, expected ${JSON.stringify(t.expected, O.jsonStringifyReplacer)}`;
      break;
    case h.unrecognized_keys:
      n = `Unrecognized key(s) in object: ${O.joinValues(t.keys, ", ")}`;
      break;
    case h.invalid_union:
      n = "Invalid input";
      break;
    case h.invalid_union_discriminator:
      n = `Invalid discriminator value. Expected ${O.joinValues(t.options)}`;
      break;
    case h.invalid_enum_value:
      n = `Invalid enum value. Expected ${O.joinValues(t.options)}, received '${t.received}'`;
      break;
    case h.invalid_arguments:
      n = "Invalid function arguments";
      break;
    case h.invalid_return_type:
      n = "Invalid function return type";
      break;
    case h.invalid_date:
      n = "Invalid date";
      break;
    case h.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (n = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? n = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? n = `Invalid input: must end with "${t.validation.endsWith}"` : O.assertNever(t.validation) : t.validation !== "regex" ? n = `Invalid ${t.validation}` : n = "Invalid";
      break;
    case h.too_small:
      t.type === "array" ? n = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? n = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? n = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? n = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : n = "Invalid input";
      break;
    case h.too_big:
      t.type === "array" ? n = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? n = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? n = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? n = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? n = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : n = "Invalid input";
      break;
    case h.custom:
      n = "Invalid input";
      break;
    case h.invalid_intersection_types:
      n = "Intersection results could not be merged";
      break;
    case h.not_multiple_of:
      n = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case h.not_finite:
      n = "Number must be finite";
      break;
    default:
      n = e.defaultError, O.assertNever(t);
  }
  return { message: n };
};
let Na = rt;
function ei(t) {
  Na = t;
}
function ir() {
  return Na;
}
const or = (t) => {
  const { data: e, path: n, errorMaps: a, issueData: s } = t, i = [...n, ...s.path || []], o = {
    ...s,
    path: i
  };
  if (s.message !== void 0)
    return {
      ...s,
      path: i,
      message: s.message
    };
  let c = "";
  const u = a.filter((l) => !!l).slice().reverse();
  for (const l of u)
    c = l(o, { data: e, defaultError: c }).message;
  return {
    ...s,
    path: i,
    message: c
  };
}, ti = [];
function m(t, e) {
  const n = ir(), a = or({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      t.schemaErrorMap,
      n,
      n === rt ? void 0 : rt
      // then global default map
    ].filter((s) => !!s)
  });
  t.common.issues.push(a);
}
class B {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, n) {
    const a = [];
    for (const s of n) {
      if (s.status === "aborted")
        return S;
      s.status === "dirty" && e.dirty(), a.push(s.value);
    }
    return { status: e.value, value: a };
  }
  static async mergeObjectAsync(e, n) {
    const a = [];
    for (const s of n) {
      const i = await s.key, o = await s.value;
      a.push({
        key: i,
        value: o
      });
    }
    return B.mergeObjectSync(e, a);
  }
  static mergeObjectSync(e, n) {
    const a = {};
    for (const s of n) {
      const { key: i, value: o } = s;
      if (i.status === "aborted" || o.status === "aborted")
        return S;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || s.alwaysSet) && (a[i.value] = o.value);
    }
    return { status: e.value, value: a };
  }
}
const S = Object.freeze({
  status: "aborted"
}), Ye = (t) => ({ status: "dirty", value: t }), V = (t) => ({ status: "valid", value: t }), un = (t) => t.status === "aborted", ln = (t) => t.status === "dirty", St = (t) => t.status === "valid", At = (t) => typeof Promise < "u" && t instanceof Promise;
function cr(t, e, n, a) {
  if (typeof e == "function" ? t !== e || !0 : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(t);
}
function Oa(t, e, n, a, s) {
  if (typeof e == "function" ? t !== e || !0 : !e.has(t)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(t, n), n;
}
var T;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(T || (T = {}));
var vt, bt;
class ae {
  constructor(e, n, a, s) {
    this._cachedPath = [], this.parent = e, this.data = n, this._path = a, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ea = (t, e) => {
  if (St(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const n = new H(t.common.issues);
      return this._error = n, this._error;
    }
  };
};
function A(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: n, required_error: a, description: s } = t;
  if (e && (n || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (o, c) => {
    var u, l;
    const { message: d } = t;
    return o.code === "invalid_enum_value" ? { message: d ?? c.defaultError } : typeof c.data > "u" ? { message: (u = d ?? a) !== null && u !== void 0 ? u : c.defaultError } : o.code !== "invalid_type" ? { message: c.defaultError } : { message: (l = d ?? n) !== null && l !== void 0 ? l : c.defaultError };
  }, description: s };
}
class I {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return he(e.data);
  }
  _getOrReturnCtx(e, n) {
    return n || {
      common: e.parent.common,
      data: e.data,
      parsedType: he(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new B(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: he(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const n = this._parse(e);
    if (At(n))
      throw new Error("Synchronous parse encountered promise.");
    return n;
  }
  _parseAsync(e) {
    const n = this._parse(e);
    return Promise.resolve(n);
  }
  parse(e, n) {
    const a = this.safeParse(e, n);
    if (a.success)
      return a.data;
    throw a.error;
  }
  safeParse(e, n) {
    var a;
    const s = {
      common: {
        issues: [],
        async: (a = n == null ? void 0 : n.async) !== null && a !== void 0 ? a : !1,
        contextualErrorMap: n == null ? void 0 : n.errorMap
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: he(e)
    }, i = this._parseSync({ data: e, path: s.path, parent: s });
    return ea(s, i);
  }
  async parseAsync(e, n) {
    const a = await this.safeParseAsync(e, n);
    if (a.success)
      return a.data;
    throw a.error;
  }
  async safeParseAsync(e, n) {
    const a = {
      common: {
        issues: [],
        contextualErrorMap: n == null ? void 0 : n.errorMap,
        async: !0
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: he(e)
    }, s = this._parse({ data: e, path: a.path, parent: a }), i = await (At(s) ? s : Promise.resolve(s));
    return ea(a, i);
  }
  refine(e, n) {
    const a = (s) => typeof n == "string" || typeof n > "u" ? { message: n } : typeof n == "function" ? n(s) : n;
    return this._refinement((s, i) => {
      const o = e(s), c = () => i.addIssue({
        code: h.custom,
        ...a(s)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((u) => u ? !0 : (c(), !1)) : o ? !0 : (c(), !1);
    });
  }
  refinement(e, n) {
    return this._refinement((a, s) => e(a) ? !0 : (s.addIssue(typeof n == "function" ? n(a, s) : n), !1));
  }
  _refinement(e) {
    return new q({
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return re.create(this, this._def);
  }
  nullable() {
    return Ae.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return J.create(this, this._def);
  }
  promise() {
    return at.create(this, this._def);
  }
  or(e) {
    return xt.create([this, e], this._def);
  }
  and(e) {
    return Nt.create(this, e, this._def);
  }
  transform(e) {
    return new q({
      ...A(this._def),
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const n = typeof e == "function" ? e : () => e;
    return new Mt({
      ...A(this._def),
      innerType: this,
      defaultValue: n,
      typeName: R.ZodDefault
    });
  }
  brand() {
    return new Pn({
      typeName: R.ZodBranded,
      type: this,
      ...A(this._def)
    });
  }
  catch(e) {
    const n = typeof e == "function" ? e : () => e;
    return new Ut({
      ...A(this._def),
      innerType: this,
      catchValue: n,
      typeName: R.ZodCatch
    });
  }
  describe(e) {
    const n = this.constructor;
    return new n({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Yt.create(this, e);
  }
  readonly() {
    return Dt.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const ri = /^c[^\s-]{8,}$/i, ni = /^[0-9a-z]+$/, ai = /^[0-9A-HJKMNP-TV-Z]{26}$/, si = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, ii = /^[a-z0-9_-]{21}$/i, oi = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, ci = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ui = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Zr;
const li = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, di = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, fi = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ca = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", hi = new RegExp(`^${Ca}$`);
function Pa(t) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function pi(t) {
  return new RegExp(`^${Pa(t)}$`);
}
function ja(t) {
  let e = `${Ca}T${Pa(t)}`;
  const n = [];
  return n.push(t.local ? "Z?" : "Z"), t.offset && n.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${n.join("|")})`, new RegExp(`^${e}$`);
}
function gi(t, e) {
  return !!((e === "v4" || !e) && li.test(t) || (e === "v6" || !e) && di.test(t));
}
class z extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== v.string) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: v.string,
        received: i.parsedType
      }), S;
    }
    const a = new B();
    let s;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (s = this._getOrReturnCtx(e, s), m(s, {
          code: h.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (s = this._getOrReturnCtx(e, s), m(s, {
          code: h.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "length") {
        const o = e.data.length > i.value, c = e.data.length < i.value;
        (o || c) && (s = this._getOrReturnCtx(e, s), o ? m(s, {
          code: h.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : c && m(s, {
          code: h.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), a.dirty());
      } else if (i.kind === "email")
        ci.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "email",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "emoji")
        Zr || (Zr = new RegExp(ui, "u")), Zr.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "emoji",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "uuid")
        si.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "uuid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "nanoid")
        ii.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "nanoid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid")
        ri.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "cuid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid2")
        ni.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "cuid2",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "ulid")
        ai.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
          validation: "ulid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), m(s, {
            validation: "url",
            code: h.invalid_string,
            message: i.message
          }), a.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        validation: "regex",
        code: h.invalid_string,
        message: i.message
      }), a.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), a.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "datetime" ? ja(i).test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: "datetime",
        message: i.message
      }), a.dirty()) : i.kind === "date" ? hi.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: "date",
        message: i.message
      }), a.dirty()) : i.kind === "time" ? pi(i).test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.invalid_string,
        validation: "time",
        message: i.message
      }), a.dirty()) : i.kind === "duration" ? oi.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        validation: "duration",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "ip" ? gi(e.data, i.version) || (s = this._getOrReturnCtx(e, s), m(s, {
        validation: "ip",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "base64" ? fi.test(e.data) || (s = this._getOrReturnCtx(e, s), m(s, {
        validation: "base64",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : O.assertNever(i);
    return { status: a.value, value: e.data };
  }
  _regex(e, n, a) {
    return this.refinement((s) => e.test(s), {
      validation: n,
      code: h.invalid_string,
      ...T.errToObj(a)
    });
  }
  _addCheck(e) {
    return new z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...T.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...T.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...T.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...T.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...T.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...T.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...T.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...T.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...T.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...T.errToObj(e) });
  }
  datetime(e) {
    var n, a;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (n = e == null ? void 0 : e.offset) !== null && n !== void 0 ? n : !1,
      local: (a = e == null ? void 0 : e.local) !== null && a !== void 0 ? a : !1,
      ...T.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...T.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...T.errToObj(e) });
  }
  regex(e, n) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...T.errToObj(n)
    });
  }
  includes(e, n) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: n == null ? void 0 : n.position,
      ...T.errToObj(n == null ? void 0 : n.message)
    });
  }
  startsWith(e, n) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...T.errToObj(n)
    });
  }
  endsWith(e, n) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...T.errToObj(n)
    });
  }
  min(e, n) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...T.errToObj(n)
    });
  }
  max(e, n) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...T.errToObj(n)
    });
  }
  length(e, n) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...T.errToObj(n)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, T.errToObj(e));
  }
  trim() {
    return new z({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get minLength() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
}
z.create = (t) => {
  var e;
  return new z({
    checks: [],
    typeName: R.ZodString,
    coerce: (e = t == null ? void 0 : t.coerce) !== null && e !== void 0 ? e : !1,
    ...A(t)
  });
};
function mi(t, e) {
  const n = (t.toString().split(".")[1] || "").length, a = (e.toString().split(".")[1] || "").length, s = n > a ? n : a, i = parseInt(t.toFixed(s).replace(".", "")), o = parseInt(e.toFixed(s).replace(".", ""));
  return i % o / Math.pow(10, s);
}
class Te extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== v.number) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: v.number,
        received: i.parsedType
      }), S;
    }
    let a;
    const s = new B();
    for (const i of this._def.checks)
      i.kind === "int" ? O.isInteger(e.data) || (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), s.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? mi(e.data, i.value) !== 0 && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.not_finite,
        message: i.message
      }), s.dirty()) : O.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, n) {
    return this.setLimit("min", e, !0, T.toString(n));
  }
  gt(e, n) {
    return this.setLimit("min", e, !1, T.toString(n));
  }
  lte(e, n) {
    return this.setLimit("max", e, !0, T.toString(n));
  }
  lt(e, n) {
    return this.setLimit("max", e, !1, T.toString(n));
  }
  setLimit(e, n, a, s) {
    return new Te({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: n,
          inclusive: a,
          message: T.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Te({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: T.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: T.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: T.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: T.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: T.toString(e)
    });
  }
  multipleOf(e, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(n)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: T.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: T.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: T.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && O.isInteger(e.value));
  }
  get isFinite() {
    let e = null, n = null;
    for (const a of this._def.checks) {
      if (a.kind === "finite" || a.kind === "int" || a.kind === "multipleOf")
        return !0;
      a.kind === "min" ? (n === null || a.value > n) && (n = a.value) : a.kind === "max" && (e === null || a.value < e) && (e = a.value);
    }
    return Number.isFinite(n) && Number.isFinite(e);
  }
}
Te.create = (t) => new Te({
  checks: [],
  typeName: R.ZodNumber,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...A(t)
});
class Re extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== v.bigint) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: v.bigint,
        received: i.parsedType
      }), S;
    }
    let a;
    const s = new B();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (a = this._getOrReturnCtx(e, a), m(a, {
        code: h.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : O.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, n) {
    return this.setLimit("min", e, !0, T.toString(n));
  }
  gt(e, n) {
    return this.setLimit("min", e, !1, T.toString(n));
  }
  lte(e, n) {
    return this.setLimit("max", e, !0, T.toString(n));
  }
  lt(e, n) {
    return this.setLimit("max", e, !1, T.toString(n));
  }
  setLimit(e, n, a, s) {
    return new Re({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: n,
          inclusive: a,
          message: T.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Re({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: T.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: T.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: T.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: T.toString(e)
    });
  }
  multipleOf(e, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(n)
    });
  }
  get minValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
}
Re.create = (t) => {
  var e;
  return new Re({
    checks: [],
    typeName: R.ZodBigInt,
    coerce: (e = t == null ? void 0 : t.coerce) !== null && e !== void 0 ? e : !1,
    ...A(t)
  });
};
class wt extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== v.boolean) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.boolean,
        received: a.parsedType
      }), S;
    }
    return V(e.data);
  }
}
wt.create = (t) => new wt({
  typeName: R.ZodBoolean,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...A(t)
});
class De extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== v.date) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_type,
        expected: v.date,
        received: i.parsedType
      }), S;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return m(i, {
        code: h.invalid_date
      }), S;
    }
    const a = new B();
    let s;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), a.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (s = this._getOrReturnCtx(e, s), m(s, {
        code: h.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), a.dirty()) : O.assertNever(i);
    return {
      status: a.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new De({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, n) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: T.toString(n)
    });
  }
  max(e, n) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: T.toString(n)
    });
  }
  get minDate() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e != null ? new Date(e) : null;
  }
}
De.create = (t) => new De({
  checks: [],
  coerce: (t == null ? void 0 : t.coerce) || !1,
  typeName: R.ZodDate,
  ...A(t)
});
class ur extends I {
  _parse(e) {
    if (this._getType(e) !== v.symbol) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.symbol,
        received: a.parsedType
      }), S;
    }
    return V(e.data);
  }
}
ur.create = (t) => new ur({
  typeName: R.ZodSymbol,
  ...A(t)
});
class It extends I {
  _parse(e) {
    if (this._getType(e) !== v.undefined) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.undefined,
        received: a.parsedType
      }), S;
    }
    return V(e.data);
  }
}
It.create = (t) => new It({
  typeName: R.ZodUndefined,
  ...A(t)
});
class kt extends I {
  _parse(e) {
    if (this._getType(e) !== v.null) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.null,
        received: a.parsedType
      }), S;
    }
    return V(e.data);
  }
}
kt.create = (t) => new kt({
  typeName: R.ZodNull,
  ...A(t)
});
class nt extends I {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return V(e.data);
  }
}
nt.create = (t) => new nt({
  typeName: R.ZodAny,
  ...A(t)
});
class je extends I {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return V(e.data);
  }
}
je.create = (t) => new je({
  typeName: R.ZodUnknown,
  ...A(t)
});
class le extends I {
  _parse(e) {
    const n = this._getOrReturnCtx(e);
    return m(n, {
      code: h.invalid_type,
      expected: v.never,
      received: n.parsedType
    }), S;
  }
}
le.create = (t) => new le({
  typeName: R.ZodNever,
  ...A(t)
});
class lr extends I {
  _parse(e) {
    if (this._getType(e) !== v.undefined) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.void,
        received: a.parsedType
      }), S;
    }
    return V(e.data);
  }
}
lr.create = (t) => new lr({
  typeName: R.ZodVoid,
  ...A(t)
});
class J extends I {
  _parse(e) {
    const { ctx: n, status: a } = this._processInputParams(e), s = this._def;
    if (n.parsedType !== v.array)
      return m(n, {
        code: h.invalid_type,
        expected: v.array,
        received: n.parsedType
      }), S;
    if (s.exactLength !== null) {
      const o = n.data.length > s.exactLength.value, c = n.data.length < s.exactLength.value;
      (o || c) && (m(n, {
        code: o ? h.too_big : h.too_small,
        minimum: c ? s.exactLength.value : void 0,
        maximum: o ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), a.dirty());
    }
    if (s.minLength !== null && n.data.length < s.minLength.value && (m(n, {
      code: h.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), a.dirty()), s.maxLength !== null && n.data.length > s.maxLength.value && (m(n, {
      code: h.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), a.dirty()), n.common.async)
      return Promise.all([...n.data].map((o, c) => s.type._parseAsync(new ae(n, o, n.path, c)))).then((o) => B.mergeArray(a, o));
    const i = [...n.data].map((o, c) => s.type._parseSync(new ae(n, o, n.path, c)));
    return B.mergeArray(a, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, n) {
    return new J({
      ...this._def,
      minLength: { value: e, message: T.toString(n) }
    });
  }
  max(e, n) {
    return new J({
      ...this._def,
      maxLength: { value: e, message: T.toString(n) }
    });
  }
  length(e, n) {
    return new J({
      ...this._def,
      exactLength: { value: e, message: T.toString(n) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
J.create = (t, e) => new J({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: R.ZodArray,
  ...A(e)
});
function Ve(t) {
  if (t instanceof U) {
    const e = {};
    for (const n in t.shape) {
      const a = t.shape[n];
      e[n] = re.create(Ve(a));
    }
    return new U({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof J ? new J({
    ...t._def,
    type: Ve(t.element)
  }) : t instanceof re ? re.create(Ve(t.unwrap())) : t instanceof Ae ? Ae.create(Ve(t.unwrap())) : t instanceof se ? se.create(t.items.map((e) => Ve(e))) : t;
}
class U extends I {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), n = O.objectKeys(e);
    return this._cached = { shape: e, keys: n };
  }
  _parse(e) {
    if (this._getType(e) !== v.object) {
      const l = this._getOrReturnCtx(e);
      return m(l, {
        code: h.invalid_type,
        expected: v.object,
        received: l.parsedType
      }), S;
    }
    const { status: a, ctx: s } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), c = [];
    if (!(this._def.catchall instanceof le && this._def.unknownKeys === "strip"))
      for (const l in s.data)
        o.includes(l) || c.push(l);
    const u = [];
    for (const l of o) {
      const d = i[l], E = s.data[l];
      u.push({
        key: { status: "valid", value: l },
        value: d._parse(new ae(s, E, s.path, l)),
        alwaysSet: l in s.data
      });
    }
    if (this._def.catchall instanceof le) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const d of c)
          u.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: s.data[d] }
          });
      else if (l === "strict")
        c.length > 0 && (m(s, {
          code: h.unrecognized_keys,
          keys: c
        }), a.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const d of c) {
        const E = s.data[d];
        u.push({
          key: { status: "valid", value: d },
          value: l._parse(
            new ae(s, E, s.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const l = [];
      for (const d of u) {
        const E = await d.key, g = await d.value;
        l.push({
          key: E,
          value: g,
          alwaysSet: d.alwaysSet
        });
      }
      return l;
    }).then((l) => B.mergeObjectSync(a, l)) : B.mergeObjectSync(a, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return T.errToObj, new U({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (n, a) => {
          var s, i, o, c;
          const u = (o = (i = (s = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(s, n, a).message) !== null && o !== void 0 ? o : a.defaultError;
          return n.code === "unrecognized_keys" ? {
            message: (c = T.errToObj(e).message) !== null && c !== void 0 ? c : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new U({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new U({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new U({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new U({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: R.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, n) {
    return this.augment({ [e]: n });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new U({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const n = {};
    return O.objectKeys(e).forEach((a) => {
      e[a] && this.shape[a] && (n[a] = this.shape[a]);
    }), new U({
      ...this._def,
      shape: () => n
    });
  }
  omit(e) {
    const n = {};
    return O.objectKeys(this.shape).forEach((a) => {
      e[a] || (n[a] = this.shape[a]);
    }), new U({
      ...this._def,
      shape: () => n
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Ve(this);
  }
  partial(e) {
    const n = {};
    return O.objectKeys(this.shape).forEach((a) => {
      const s = this.shape[a];
      e && !e[a] ? n[a] = s : n[a] = s.optional();
    }), new U({
      ...this._def,
      shape: () => n
    });
  }
  required(e) {
    const n = {};
    return O.objectKeys(this.shape).forEach((a) => {
      if (e && !e[a])
        n[a] = this.shape[a];
      else {
        let i = this.shape[a];
        for (; i instanceof re; )
          i = i._def.innerType;
        n[a] = i;
      }
    }), new U({
      ...this._def,
      shape: () => n
    });
  }
  keyof() {
    return Ma(O.objectKeys(this.shape));
  }
}
U.create = (t, e) => new U({
  shape: () => t,
  unknownKeys: "strip",
  catchall: le.create(),
  typeName: R.ZodObject,
  ...A(e)
});
U.strictCreate = (t, e) => new U({
  shape: () => t,
  unknownKeys: "strict",
  catchall: le.create(),
  typeName: R.ZodObject,
  ...A(e)
});
U.lazycreate = (t, e) => new U({
  shape: t,
  unknownKeys: "strip",
  catchall: le.create(),
  typeName: R.ZodObject,
  ...A(e)
});
class xt extends I {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), a = this._def.options;
    function s(i) {
      for (const c of i)
        if (c.result.status === "valid")
          return c.result;
      for (const c of i)
        if (c.result.status === "dirty")
          return n.common.issues.push(...c.ctx.common.issues), c.result;
      const o = i.map((c) => new H(c.ctx.common.issues));
      return m(n, {
        code: h.invalid_union,
        unionErrors: o
      }), S;
    }
    if (n.common.async)
      return Promise.all(a.map(async (i) => {
        const o = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: n.data,
            path: n.path,
            parent: o
          }),
          ctx: o
        };
      })).then(s);
    {
      let i;
      const o = [];
      for (const u of a) {
        const l = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        }, d = u._parseSync({
          data: n.data,
          path: n.path,
          parent: l
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: l }), l.common.issues.length && o.push(l.common.issues);
      }
      if (i)
        return n.common.issues.push(...i.ctx.common.issues), i.result;
      const c = o.map((u) => new H(u));
      return m(n, {
        code: h.invalid_union,
        unionErrors: c
      }), S;
    }
  }
  get options() {
    return this._def.options;
  }
}
xt.create = (t, e) => new xt({
  options: t,
  typeName: R.ZodUnion,
  ...A(e)
});
const oe = (t) => t instanceof Ct ? oe(t.schema) : t instanceof q ? oe(t.innerType()) : t instanceof Pt ? [t.value] : t instanceof Se ? t.options : t instanceof jt ? O.objectValues(t.enum) : t instanceof Mt ? oe(t._def.innerType) : t instanceof It ? [void 0] : t instanceof kt ? [null] : t instanceof re ? [void 0, ...oe(t.unwrap())] : t instanceof Ae ? [null, ...oe(t.unwrap())] : t instanceof Pn || t instanceof Dt ? oe(t.unwrap()) : t instanceof Ut ? oe(t._def.innerType) : [];
class Dr extends I {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    if (n.parsedType !== v.object)
      return m(n, {
        code: h.invalid_type,
        expected: v.object,
        received: n.parsedType
      }), S;
    const a = this.discriminator, s = n.data[a], i = this.optionsMap.get(s);
    return i ? n.common.async ? i._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }) : i._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }) : (m(n, {
      code: h.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), S);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, n, a) {
    const s = /* @__PURE__ */ new Map();
    for (const i of n) {
      const o = oe(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const c of o) {
        if (s.has(c))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(c)}`);
        s.set(c, i);
      }
    }
    return new Dr({
      typeName: R.ZodDiscriminatedUnion,
      discriminator: e,
      options: n,
      optionsMap: s,
      ...A(a)
    });
  }
}
function dn(t, e) {
  const n = he(t), a = he(e);
  if (t === e)
    return { valid: !0, data: t };
  if (n === v.object && a === v.object) {
    const s = O.objectKeys(e), i = O.objectKeys(t).filter((c) => s.indexOf(c) !== -1), o = { ...t, ...e };
    for (const c of i) {
      const u = dn(t[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (n === v.array && a === v.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const o = t[i], c = e[i], u = dn(o, c);
      if (!u.valid)
        return { valid: !1 };
      s.push(u.data);
    }
    return { valid: !0, data: s };
  } else return n === v.date && a === v.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class Nt extends I {
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e), s = (i, o) => {
      if (un(i) || un(o))
        return S;
      const c = dn(i.value, o.value);
      return c.valid ? ((ln(i) || ln(o)) && n.dirty(), { status: n.value, value: c.data }) : (m(a, {
        code: h.invalid_intersection_types
      }), S);
    };
    return a.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      }),
      this._def.right._parseAsync({
        data: a.data,
        path: a.path,
        parent: a
      })
    ]).then(([i, o]) => s(i, o)) : s(this._def.left._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }), this._def.right._parseSync({
      data: a.data,
      path: a.path,
      parent: a
    }));
  }
}
Nt.create = (t, e, n) => new Nt({
  left: t,
  right: e,
  typeName: R.ZodIntersection,
  ...A(n)
});
class se extends I {
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== v.array)
      return m(a, {
        code: h.invalid_type,
        expected: v.array,
        received: a.parsedType
      }), S;
    if (a.data.length < this._def.items.length)
      return m(a, {
        code: h.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), S;
    !this._def.rest && a.data.length > this._def.items.length && (m(a, {
      code: h.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), n.dirty());
    const i = [...a.data].map((o, c) => {
      const u = this._def.items[c] || this._def.rest;
      return u ? u._parse(new ae(a, o, a.path, c)) : null;
    }).filter((o) => !!o);
    return a.common.async ? Promise.all(i).then((o) => B.mergeArray(n, o)) : B.mergeArray(n, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new se({
      ...this._def,
      rest: e
    });
  }
}
se.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new se({
    items: t,
    typeName: R.ZodTuple,
    rest: null,
    ...A(e)
  });
};
class Ot extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== v.object)
      return m(a, {
        code: h.invalid_type,
        expected: v.object,
        received: a.parsedType
      }), S;
    const s = [], i = this._def.keyType, o = this._def.valueType;
    for (const c in a.data)
      s.push({
        key: i._parse(new ae(a, c, a.path, c)),
        value: o._parse(new ae(a, a.data[c], a.path, c)),
        alwaysSet: c in a.data
      });
    return a.common.async ? B.mergeObjectAsync(n, s) : B.mergeObjectSync(n, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, n, a) {
    return n instanceof I ? new Ot({
      keyType: e,
      valueType: n,
      typeName: R.ZodRecord,
      ...A(a)
    }) : new Ot({
      keyType: z.create(),
      valueType: e,
      typeName: R.ZodRecord,
      ...A(n)
    });
  }
}
class dr extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== v.map)
      return m(a, {
        code: h.invalid_type,
        expected: v.map,
        received: a.parsedType
      }), S;
    const s = this._def.keyType, i = this._def.valueType, o = [...a.data.entries()].map(([c, u], l) => ({
      key: s._parse(new ae(a, c, a.path, [l, "key"])),
      value: i._parse(new ae(a, u, a.path, [l, "value"]))
    }));
    if (a.common.async) {
      const c = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of o) {
          const l = await u.key, d = await u.value;
          if (l.status === "aborted" || d.status === "aborted")
            return S;
          (l.status === "dirty" || d.status === "dirty") && n.dirty(), c.set(l.value, d.value);
        }
        return { status: n.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const l = u.key, d = u.value;
        if (l.status === "aborted" || d.status === "aborted")
          return S;
        (l.status === "dirty" || d.status === "dirty") && n.dirty(), c.set(l.value, d.value);
      }
      return { status: n.value, value: c };
    }
  }
}
dr.create = (t, e, n) => new dr({
  valueType: e,
  keyType: t,
  typeName: R.ZodMap,
  ...A(n)
});
class $e extends I {
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== v.set)
      return m(a, {
        code: h.invalid_type,
        expected: v.set,
        received: a.parsedType
      }), S;
    const s = this._def;
    s.minSize !== null && a.data.size < s.minSize.value && (m(a, {
      code: h.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), n.dirty()), s.maxSize !== null && a.data.size > s.maxSize.value && (m(a, {
      code: h.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), n.dirty());
    const i = this._def.valueType;
    function o(u) {
      const l = /* @__PURE__ */ new Set();
      for (const d of u) {
        if (d.status === "aborted")
          return S;
        d.status === "dirty" && n.dirty(), l.add(d.value);
      }
      return { status: n.value, value: l };
    }
    const c = [...a.data.values()].map((u, l) => i._parse(new ae(a, u, a.path, l)));
    return a.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, n) {
    return new $e({
      ...this._def,
      minSize: { value: e, message: T.toString(n) }
    });
  }
  max(e, n) {
    return new $e({
      ...this._def,
      maxSize: { value: e, message: T.toString(n) }
    });
  }
  size(e, n) {
    return this.min(e, n).max(e, n);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
$e.create = (t, e) => new $e({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: R.ZodSet,
  ...A(e)
});
class Je extends I {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    if (n.parsedType !== v.function)
      return m(n, {
        code: h.invalid_type,
        expected: v.function,
        received: n.parsedType
      }), S;
    function a(c, u) {
      return or({
        data: c,
        path: n.path,
        errorMaps: [
          n.common.contextualErrorMap,
          n.schemaErrorMap,
          ir(),
          rt
        ].filter((l) => !!l),
        issueData: {
          code: h.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function s(c, u) {
      return or({
        data: c,
        path: n.path,
        errorMaps: [
          n.common.contextualErrorMap,
          n.schemaErrorMap,
          ir(),
          rt
        ].filter((l) => !!l),
        issueData: {
          code: h.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const i = { errorMap: n.common.contextualErrorMap }, o = n.data;
    if (this._def.returns instanceof at) {
      const c = this;
      return V(async function(...u) {
        const l = new H([]), d = await c._def.args.parseAsync(u, i).catch((f) => {
          throw l.addIssue(a(u, f)), l;
        }), E = await Reflect.apply(o, this, d);
        return await c._def.returns._def.type.parseAsync(E, i).catch((f) => {
          throw l.addIssue(s(E, f)), l;
        });
      });
    } else {
      const c = this;
      return V(function(...u) {
        const l = c._def.args.safeParse(u, i);
        if (!l.success)
          throw new H([a(u, l.error)]);
        const d = Reflect.apply(o, this, l.data), E = c._def.returns.safeParse(d, i);
        if (!E.success)
          throw new H([s(d, E.error)]);
        return E.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new Je({
      ...this._def,
      args: se.create(e).rest(je.create())
    });
  }
  returns(e) {
    return new Je({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, n, a) {
    return new Je({
      args: e || se.create([]).rest(je.create()),
      returns: n || je.create(),
      typeName: R.ZodFunction,
      ...A(a)
    });
  }
}
class Ct extends I {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    return this._def.getter()._parse({ data: n.data, path: n.path, parent: n });
  }
}
Ct.create = (t, e) => new Ct({
  getter: t,
  typeName: R.ZodLazy,
  ...A(e)
});
class Pt extends I {
  _parse(e) {
    if (e.data !== this._def.value) {
      const n = this._getOrReturnCtx(e);
      return m(n, {
        received: n.data,
        code: h.invalid_literal,
        expected: this._def.value
      }), S;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Pt.create = (t, e) => new Pt({
  value: t,
  typeName: R.ZodLiteral,
  ...A(e)
});
function Ma(t, e) {
  return new Se({
    values: t,
    typeName: R.ZodEnum,
    ...A(e)
  });
}
class Se extends I {
  constructor() {
    super(...arguments), vt.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const n = this._getOrReturnCtx(e), a = this._def.values;
      return m(n, {
        expected: O.joinValues(a),
        received: n.parsedType,
        code: h.invalid_type
      }), S;
    }
    if (cr(this, vt) || Oa(this, vt, new Set(this._def.values)), !cr(this, vt).has(e.data)) {
      const n = this._getOrReturnCtx(e), a = this._def.values;
      return m(n, {
        received: n.data,
        code: h.invalid_enum_value,
        options: a
      }), S;
    }
    return V(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  get Values() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  get Enum() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  extract(e, n = this._def) {
    return Se.create(e, {
      ...this._def,
      ...n
    });
  }
  exclude(e, n = this._def) {
    return Se.create(this.options.filter((a) => !e.includes(a)), {
      ...this._def,
      ...n
    });
  }
}
vt = /* @__PURE__ */ new WeakMap();
Se.create = Ma;
class jt extends I {
  constructor() {
    super(...arguments), bt.set(this, void 0);
  }
  _parse(e) {
    const n = O.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(e);
    if (a.parsedType !== v.string && a.parsedType !== v.number) {
      const s = O.objectValues(n);
      return m(a, {
        expected: O.joinValues(s),
        received: a.parsedType,
        code: h.invalid_type
      }), S;
    }
    if (cr(this, bt) || Oa(this, bt, new Set(O.getValidEnumValues(this._def.values))), !cr(this, bt).has(e.data)) {
      const s = O.objectValues(n);
      return m(a, {
        received: a.data,
        code: h.invalid_enum_value,
        options: s
      }), S;
    }
    return V(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
bt = /* @__PURE__ */ new WeakMap();
jt.create = (t, e) => new jt({
  values: t,
  typeName: R.ZodNativeEnum,
  ...A(e)
});
class at extends I {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    if (n.parsedType !== v.promise && n.common.async === !1)
      return m(n, {
        code: h.invalid_type,
        expected: v.promise,
        received: n.parsedType
      }), S;
    const a = n.parsedType === v.promise ? n.data : Promise.resolve(n.data);
    return V(a.then((s) => this._def.type.parseAsync(s, {
      path: n.path,
      errorMap: n.common.contextualErrorMap
    })));
  }
}
at.create = (t, e) => new at({
  type: t,
  typeName: R.ZodPromise,
  ...A(e)
});
class q extends I {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === R.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e), s = this._def.effect || null, i = {
      addIssue: (o) => {
        m(a, o), o.fatal ? n.abort() : n.dirty();
      },
      get path() {
        return a.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), s.type === "preprocess") {
      const o = s.transform(a.data, i);
      if (a.common.async)
        return Promise.resolve(o).then(async (c) => {
          if (n.value === "aborted")
            return S;
          const u = await this._def.schema._parseAsync({
            data: c,
            path: a.path,
            parent: a
          });
          return u.status === "aborted" ? S : u.status === "dirty" || n.value === "dirty" ? Ye(u.value) : u;
        });
      {
        if (n.value === "aborted")
          return S;
        const c = this._def.schema._parseSync({
          data: o,
          path: a.path,
          parent: a
        });
        return c.status === "aborted" ? S : c.status === "dirty" || n.value === "dirty" ? Ye(c.value) : c;
      }
    }
    if (s.type === "refinement") {
      const o = (c) => {
        const u = s.refinement(c, i);
        if (a.common.async)
          return Promise.resolve(u);
        if (u instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return c;
      };
      if (a.common.async === !1) {
        const c = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return c.status === "aborted" ? S : (c.status === "dirty" && n.dirty(), o(c.value), { status: n.value, value: c.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((c) => c.status === "aborted" ? S : (c.status === "dirty" && n.dirty(), o(c.value).then(() => ({ status: n.value, value: c.value }))));
    }
    if (s.type === "transform")
      if (a.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!St(o))
          return o;
        const c = s.transform(o.value, i);
        if (c instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: n.value, value: c };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((o) => St(o) ? Promise.resolve(s.transform(o.value, i)).then((c) => ({ status: n.value, value: c })) : o);
    O.assertNever(s);
  }
}
q.create = (t, e, n) => new q({
  schema: t,
  typeName: R.ZodEffects,
  effect: e,
  ...A(n)
});
q.createWithPreprocess = (t, e, n) => new q({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: R.ZodEffects,
  ...A(n)
});
class re extends I {
  _parse(e) {
    return this._getType(e) === v.undefined ? V(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
re.create = (t, e) => new re({
  innerType: t,
  typeName: R.ZodOptional,
  ...A(e)
});
class Ae extends I {
  _parse(e) {
    return this._getType(e) === v.null ? V(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Ae.create = (t, e) => new Ae({
  innerType: t,
  typeName: R.ZodNullable,
  ...A(e)
});
class Mt extends I {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    let a = n.data;
    return n.parsedType === v.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: n.path,
      parent: n
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Mt.create = (t, e) => new Mt({
  innerType: t,
  typeName: R.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...A(e)
});
class Ut extends I {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), a = {
      ...n,
      common: {
        ...n.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: a.data,
      path: a.path,
      parent: {
        ...a
      }
    });
    return At(s) ? s.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new H(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new H(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Ut.create = (t, e) => new Ut({
  innerType: t,
  typeName: R.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...A(e)
});
class fr extends I {
  _parse(e) {
    if (this._getType(e) !== v.nan) {
      const a = this._getOrReturnCtx(e);
      return m(a, {
        code: h.invalid_type,
        expected: v.nan,
        received: a.parsedType
      }), S;
    }
    return { status: "valid", value: e.data };
  }
}
fr.create = (t) => new fr({
  typeName: R.ZodNaN,
  ...A(t)
});
const yi = Symbol("zod_brand");
class Pn extends I {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), a = n.data;
    return this._def.type._parse({
      data: a,
      path: n.path,
      parent: n
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Yt extends I {
  _parse(e) {
    const { status: n, ctx: a } = this._processInputParams(e);
    if (a.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? S : i.status === "dirty" ? (n.dirty(), Ye(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: a.path,
          parent: a
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: a.data,
        path: a.path,
        parent: a
      });
      return s.status === "aborted" ? S : s.status === "dirty" ? (n.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: a.path,
        parent: a
      });
    }
  }
  static create(e, n) {
    return new Yt({
      in: e,
      out: n,
      typeName: R.ZodPipeline
    });
  }
}
class Dt extends I {
  _parse(e) {
    const n = this._def.innerType._parse(e), a = (s) => (St(s) && (s.value = Object.freeze(s.value)), s);
    return At(n) ? n.then((s) => a(s)) : a(n);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Dt.create = (t, e) => new Dt({
  innerType: t,
  typeName: R.ZodReadonly,
  ...A(e)
});
function Ua(t, e = {}, n) {
  return t ? nt.create().superRefine((a, s) => {
    var i, o;
    if (!t(a)) {
      const c = typeof e == "function" ? e(a) : typeof e == "string" ? { message: e } : e, u = (o = (i = c.fatal) !== null && i !== void 0 ? i : n) !== null && o !== void 0 ? o : !0, l = typeof c == "string" ? { message: c } : c;
      s.addIssue({ code: "custom", ...l, fatal: u });
    }
  }) : nt.create();
}
const _i = {
  object: U.lazycreate
};
var R;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(R || (R = {}));
const vi = (t, e = {
  message: `Input not instance of ${t.name}`
}) => Ua((n) => n instanceof t, e), Da = z.create, $a = Te.create, bi = fr.create, Ei = Re.create, La = wt.create, Ti = De.create, Ri = ur.create, Si = It.create, Ai = kt.create, wi = nt.create, Ii = je.create, ki = le.create, xi = lr.create, Ni = J.create, Oi = U.create, Ci = U.strictCreate, Pi = xt.create, ji = Dr.create, Mi = Nt.create, Ui = se.create, Di = Ot.create, $i = dr.create, Li = $e.create, Gi = Je.create, Fi = Ct.create, Ki = Pt.create, Bi = Se.create, Vi = jt.create, Zi = at.create, ta = q.create, Wi = re.create, Hi = Ae.create, Yi = q.createWithPreprocess, zi = Yt.create, Ji = () => Da().optional(), qi = () => $a().optional(), Xi = () => La().optional(), Qi = {
  string: (t) => z.create({ ...t, coerce: !0 }),
  number: (t) => Te.create({ ...t, coerce: !0 }),
  boolean: (t) => wt.create({
    ...t,
    coerce: !0
  }),
  bigint: (t) => Re.create({ ...t, coerce: !0 }),
  date: (t) => De.create({ ...t, coerce: !0 })
}, eo = S;
var r = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: rt,
  setErrorMap: ei,
  getErrorMap: ir,
  makeIssue: or,
  EMPTY_PATH: ti,
  addIssueToContext: m,
  ParseStatus: B,
  INVALID: S,
  DIRTY: Ye,
  OK: V,
  isAborted: un,
  isDirty: ln,
  isValid: St,
  isAsync: At,
  get util() {
    return O;
  },
  get objectUtil() {
    return cn;
  },
  ZodParsedType: v,
  getParsedType: he,
  ZodType: I,
  datetimeRegex: ja,
  ZodString: z,
  ZodNumber: Te,
  ZodBigInt: Re,
  ZodBoolean: wt,
  ZodDate: De,
  ZodSymbol: ur,
  ZodUndefined: It,
  ZodNull: kt,
  ZodAny: nt,
  ZodUnknown: je,
  ZodNever: le,
  ZodVoid: lr,
  ZodArray: J,
  ZodObject: U,
  ZodUnion: xt,
  ZodDiscriminatedUnion: Dr,
  ZodIntersection: Nt,
  ZodTuple: se,
  ZodRecord: Ot,
  ZodMap: dr,
  ZodSet: $e,
  ZodFunction: Je,
  ZodLazy: Ct,
  ZodLiteral: Pt,
  ZodEnum: Se,
  ZodNativeEnum: jt,
  ZodPromise: at,
  ZodEffects: q,
  ZodTransformer: q,
  ZodOptional: re,
  ZodNullable: Ae,
  ZodDefault: Mt,
  ZodCatch: Ut,
  ZodNaN: fr,
  BRAND: yi,
  ZodBranded: Pn,
  ZodPipeline: Yt,
  ZodReadonly: Dt,
  custom: Ua,
  Schema: I,
  ZodSchema: I,
  late: _i,
  get ZodFirstPartyTypeKind() {
    return R;
  },
  coerce: Qi,
  any: wi,
  array: Ni,
  bigint: Ei,
  boolean: La,
  date: Ti,
  discriminatedUnion: ji,
  effect: ta,
  enum: Bi,
  function: Gi,
  instanceof: vi,
  intersection: Mi,
  lazy: Fi,
  literal: Ki,
  map: $i,
  nan: bi,
  nativeEnum: Vi,
  never: ki,
  null: Ai,
  nullable: Hi,
  number: $a,
  object: Oi,
  oboolean: Xi,
  onumber: qi,
  optional: Wi,
  ostring: Ji,
  pipeline: zi,
  preprocess: Yi,
  promise: Zi,
  record: Di,
  set: Li,
  strictObject: Ci,
  string: Da,
  symbol: Ri,
  transformer: ta,
  tuple: Ui,
  undefined: Si,
  union: Pi,
  unknown: Ii,
  void: xi,
  NEVER: eo,
  ZodIssueCode: h,
  quotelessJson: Qs,
  ZodError: H
});
const ra = "3.3.7", to = "HS256", ro = "https://id.trigger.dev", no = "https://api.trigger.dev";
async function na(t) {
  const { SignJWT: e } = await import("./index-BSvgqMFY.js"), n = new TextEncoder().encode(t.secretKey);
  return new e(t.payload).setIssuer(ro).setAudience(no).setProtectedHeader({ alg: to }).setIssuedAt().setExpirationTime(t.expirationTime ?? "15m").sign(n);
}
r.object({
  url: r.string().url(),
  authorizationCode: r.string()
});
r.object({
  authorizationCode: r.string()
});
r.object({
  token: r.object({
    token: r.string(),
    obfuscatedToken: r.string()
  }).nullable()
});
const ao = r.union([r.string(), r.number(), r.boolean(), r.null()]), $t = r.lazy(() => r.union([ao, r.array($t), r.record($t)])), so = r.union([
  r.string(),
  r.number(),
  r.boolean(),
  r.null(),
  r.date(),
  r.undefined(),
  r.symbol()
]), aa = r.lazy(() => r.union([so, r.array(aa), r.record(aa)])), io = r.union([
  r.literal(0.25),
  r.literal(0.5),
  r.literal(1),
  r.literal(2),
  r.literal(4)
]), oo = r.union([
  r.literal(0.25),
  r.literal(0.5),
  r.literal(1),
  r.literal(2),
  r.literal(4),
  r.literal(8)
]), Ga = r.enum([
  "micro",
  "small-1x",
  "small-2x",
  "medium-1x",
  "medium-2x",
  "large-1x",
  "large-2x"
]), Fa = r.object({
  cpu: io.optional(),
  memory: oo.optional(),
  preset: Ga.optional()
}), zt = r.object({
  name: Ga,
  cpu: r.number(),
  memory: r.number(),
  centsPerMs: r.number()
}), co = r.object({
  type: r.literal("BUILT_IN_ERROR"),
  name: r.string(),
  message: r.string(),
  stackTrace: r.string()
}), uo = r.object({
  type: r.literal("CUSTOM_ERROR"),
  raw: r.string()
}), lo = r.object({
  type: r.literal("STRING_ERROR"),
  raw: r.string()
}), jn = r.object({
  type: r.literal("INTERNAL_ERROR"),
  code: r.enum([
    "COULD_NOT_FIND_EXECUTOR",
    "COULD_NOT_FIND_TASK",
    "COULD_NOT_IMPORT_TASK",
    "CONFIGURED_INCORRECTLY",
    "TASK_ALREADY_RUNNING",
    "TASK_EXECUTION_FAILED",
    "TASK_EXECUTION_ABORTED",
    "TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE",
    "TASK_PROCESS_SIGKILL_TIMEOUT",
    "TASK_PROCESS_SIGSEGV",
    "TASK_PROCESS_SIGTERM",
    "TASK_PROCESS_OOM_KILLED",
    "TASK_PROCESS_MAYBE_OOM_KILLED",
    "TASK_RUN_CANCELLED",
    "TASK_INPUT_ERROR",
    "TASK_OUTPUT_ERROR",
    "HANDLE_ERROR_ERROR",
    "GRACEFUL_EXIT_TIMEOUT",
    "TASK_RUN_HEARTBEAT_TIMEOUT",
    "TASK_RUN_CRASHED",
    "MAX_DURATION_EXCEEDED",
    "DISK_SPACE_EXCEEDED",
    "POD_EVICTED",
    "POD_UNKNOWN_ERROR",
    "OUTDATED_SDK_VERSION"
  ]),
  message: r.string().optional(),
  stackTrace: r.string().optional()
}), Ka = jn.shape.code.enum, Ba = r.discriminatedUnion("type", [
  co,
  uo,
  lo,
  jn
]), Va = r.object({
  id: r.string(),
  payload: r.string(),
  payloadType: r.string(),
  context: r.any(),
  tags: r.array(r.string()),
  isTest: r.boolean().default(!1),
  createdAt: r.coerce.date(),
  startedAt: r.coerce.date().default(() => /* @__PURE__ */ new Date()),
  idempotencyKey: r.string().optional(),
  maxAttempts: r.number().optional(),
  durationMs: r.number().default(0),
  costInCents: r.number().default(0),
  baseCostInCents: r.number().default(0),
  version: r.string().optional(),
  metadata: r.record($t).optional(),
  maxDuration: r.number().optional()
}), Za = r.object({
  id: r.string(),
  filePath: r.string(),
  exportName: r.string()
}), Wa = r.object({
  id: r.string(),
  number: r.number(),
  startedAt: r.coerce.date(),
  backgroundWorkerId: r.string(),
  backgroundWorkerTaskId: r.string(),
  status: r.string()
}), Ha = r.object({
  id: r.string(),
  slug: r.string(),
  type: r.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"])
}), Ya = r.object({
  id: r.string(),
  slug: r.string(),
  name: r.string()
}), za = r.object({
  id: r.string(),
  ref: r.string(),
  slug: r.string(),
  name: r.string()
}), Ja = r.object({
  id: r.string(),
  name: r.string()
}), qa = r.object({
  id: r.string()
}), de = r.object({
  task: Za,
  attempt: Wa,
  run: Va,
  queue: Ja,
  environment: Ha,
  organization: Ya,
  project: za,
  batch: qa.optional(),
  machine: zt.optional()
});
r.object({
  task: Za,
  attempt: Wa.omit({
    backgroundWorkerId: !0,
    backgroundWorkerTaskId: !0
  }),
  run: Va.omit({ payload: !0, payloadType: !0, metadata: !0 }),
  queue: Ja,
  environment: Ha,
  organization: Ya,
  project: za,
  batch: qa.optional(),
  machine: zt.optional()
});
const fo = r.object({
  timestamp: r.number(),
  delay: r.number(),
  error: r.unknown().optional()
}), Xa = r.object({
  durationMs: r.number()
}), $r = r.object({
  ok: r.literal(!1),
  id: r.string(),
  error: Ba,
  retry: fo.optional(),
  skippedRetrying: r.boolean().optional(),
  usage: Xa.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: r.string().optional()
}), ho = r.object({
  ok: r.literal(!0),
  id: r.string(),
  output: r.string().optional(),
  outputType: r.string(),
  usage: Xa.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: r.string().optional()
}), X = r.discriminatedUnion("ok", [
  ho,
  $r
]), po = r.object({
  id: r.string(),
  items: X.array()
}), sa = r.object({
  message: r.string(),
  name: r.string().optional(),
  stackTrace: r.string().optional()
}), tr = r.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"]);
r.object({
  execution: de,
  traceContext: r.record(r.unknown()),
  environment: r.record(r.string()).optional()
});
const Mn = de.extend({
  worker: r.object({
    id: r.string(),
    contentHash: r.string(),
    version: r.string()
  }),
  machine: zt.default({ name: "small-1x", cpu: 1, memory: 1, centsPerMs: 0 })
}), hr = r.object({
  execution: Mn,
  traceContext: r.record(r.unknown()),
  environment: r.record(r.string()).optional()
}), go = r.object({
  type: r.literal("fixed-window"),
  limit: r.number(),
  window: r.union([
    r.object({
      seconds: r.number()
    }),
    r.object({
      minutes: r.number()
    }),
    r.object({
      hours: r.number()
    })
  ])
}), mo = r.object({
  type: r.literal("sliding-window"),
  limit: r.number(),
  window: r.union([
    r.object({
      seconds: r.number()
    }),
    r.object({
      minutes: r.number()
    }),
    r.object({
      hours: r.number()
    })
  ])
});
r.discriminatedUnion("type", [
  go,
  mo
]);
const Le = r.object({
  /** The number of attempts before giving up */
  maxAttempts: r.number().int().optional(),
  /** The exponential factor to use when calculating the next retry time.
   *
   * Each subsequent retry will be calculated as `previousTimeout * factor`
   */
  factor: r.number().optional(),
  /** The minimum time to wait before retrying */
  minTimeoutInMs: r.number().int().optional(),
  /** The maximum time to wait before retrying */
  maxTimeoutInMs: r.number().int().optional(),
  /** Randomize the timeout between retries.
   *
   * This can be useful to prevent the thundering herd problem where all retries happen at the same time.
   */
  randomize: r.boolean().optional()
}), Lr = r.object({
  /** You can define a shared queue and then pass the name in to your task.
     *
     * @example
     *
     * ```ts
     * const myQueue = queue({
        name: "my-queue",
        concurrencyLimit: 1,
      });
  
      export const task1 = task({
        id: "task-1",
        queue: {
          name: "my-queue",
        },
        run: async (payload: { message: string }) => {
          // ...
        },
      });
  
      export const task2 = task({
        id: "task-2",
        queue: {
          name: "my-queue",
        },
        run: async (payload: { message: string }) => {
          // ...
        },
      });
     * ```
     */
  name: r.string().optional(),
  /** An optional property that specifies the maximum number of concurrent run executions.
   *
   * If this property is omitted, the task can potentially use up the full concurrency of an environment. */
  concurrencyLimit: r.number().int().min(0).max(1e3).optional()
}), Qa = r.object({
  cron: r.string(),
  timezone: r.string()
}), es = {
  id: r.string(),
  description: r.string().optional(),
  queue: Lr.optional(),
  retry: Le.optional(),
  machine: Fa.optional(),
  triggerSource: r.string().optional(),
  schedule: Qa.optional(),
  maxDuration: r.number().optional()
};
r.object(es);
const yo = r.object({
  entry: r.string(),
  out: r.string()
}), ts = {
  filePath: r.string(),
  exportName: r.string(),
  entryPoint: r.string()
};
r.object(ts);
const _o = r.object({
  ...es,
  ...ts
});
r.enum(["index", "create", "restore"]);
r.enum(["terminate"]);
const vo = r.custom((t) => {
  try {
    return typeof t.test == "function";
  } catch {
    return !1;
  }
});
r.object({
  project: r.string(),
  triggerDirectories: r.string().array().optional(),
  triggerUrl: r.string().optional(),
  projectDir: r.string().optional(),
  tsconfigPath: r.string().optional(),
  retries: r.object({
    enabledInDev: r.boolean().default(!0),
    default: Le.optional()
  }).optional(),
  additionalPackages: r.string().array().optional(),
  additionalFiles: r.string().array().optional(),
  dependenciesToBundle: r.array(r.union([r.string(), vo])).optional(),
  logLevel: r.string().optional(),
  enableConsoleLogging: r.boolean().optional(),
  postInstall: r.string().optional(),
  extraCACerts: r.string().optional()
});
const Et = r.enum(["WAIT_FOR_DURATION", "WAIT_FOR_TASK", "WAIT_FOR_BATCH"]), Un = r.object({
  runId: r.string(),
  attemptCount: r.number().optional(),
  messageId: r.string(),
  isTest: r.boolean(),
  traceContext: r.record(r.unknown()),
  environment: r.record(r.string()).optional()
}), Dn = r.object({
  id: r.string(),
  description: r.string().optional(),
  filePath: r.string(),
  exportName: r.string(),
  queue: Lr.optional(),
  retry: Le.optional(),
  machine: Fa.optional(),
  triggerSource: r.string().optional(),
  schedule: Qa.optional(),
  maxDuration: r.number().optional()
}), bo = r.object({
  filePath: r.string(),
  contents: r.string(),
  contentHash: r.string(),
  taskIds: r.array(r.string())
}), Eo = r.object({
  packageVersion: r.string(),
  contentHash: r.string(),
  cliPackageVersion: r.string().optional(),
  tasks: r.array(Dn),
  sourceFiles: r.array(bo).optional()
});
r.object({
  contentHash: r.string(),
  imageTag: r.string()
});
r.object({
  userId: r.string(),
  email: r.string().email(),
  dashboardUrl: r.string()
});
const To = r.object({
  id: r.string(),
  externalRef: r.string(),
  name: r.string(),
  slug: r.string(),
  createdAt: r.coerce.date(),
  organization: r.object({
    id: r.string(),
    title: r.string(),
    slug: r.string(),
    createdAt: r.coerce.date()
  })
});
r.array(To);
r.object({
  apiKey: r.string(),
  name: r.string(),
  apiUrl: r.string(),
  projectId: r.string()
});
r.object({
  localOnly: r.boolean(),
  metadata: Eo,
  supportsLazyAttempts: r.boolean().optional()
});
r.object({
  id: r.string(),
  version: r.string(),
  contentHash: r.string()
});
const ia = r.string().max(128, "Tags must be less than 128 characters"), $n = r.union([ia, ia.array()]), Ro = r.object({
  payload: r.any(),
  context: r.any(),
  options: r.object({
    dependentAttempt: r.string().optional(),
    parentAttempt: r.string().optional(),
    dependentBatch: r.string().optional(),
    parentBatch: r.string().optional(),
    lockToVersion: r.string().optional(),
    queue: Lr.optional(),
    concurrencyKey: r.string().optional(),
    idempotencyKey: r.string().optional(),
    idempotencyKeyTTL: r.string().optional(),
    test: r.boolean().optional(),
    payloadType: r.string().optional(),
    delay: r.string().or(r.coerce.date()).optional(),
    ttl: r.string().or(r.number().nonnegative().int()).optional(),
    tags: $n.optional(),
    maxAttempts: r.number().int().optional(),
    metadata: r.any(),
    metadataType: r.string().optional(),
    maxDuration: r.number().optional()
  }).optional()
}), So = r.object({
  id: r.string()
});
r.object({
  items: Ro.array(),
  dependentAttempt: r.string().optional()
});
const Ao = r.object({
  task: r.string(),
  payload: r.any(),
  context: r.any(),
  options: r.object({
    lockToVersion: r.string().optional(),
    queue: Lr.optional(),
    concurrencyKey: r.string().optional(),
    idempotencyKey: r.string().optional(),
    idempotencyKeyTTL: r.string().optional(),
    test: r.boolean().optional(),
    payloadType: r.string().optional(),
    delay: r.string().or(r.coerce.date()).optional(),
    ttl: r.string().or(r.number().nonnegative().int()).optional(),
    tags: $n.optional(),
    maxAttempts: r.number().int().optional(),
    metadata: r.any(),
    metadataType: r.string().optional(),
    maxDuration: r.number().optional(),
    parentAttempt: r.string().optional()
  }).optional()
});
r.object({
  items: Ao.array(),
  dependentAttempt: r.string().optional()
});
const wo = r.object({
  id: r.string(),
  isCached: r.boolean(),
  idempotencyKey: r.string().optional(),
  runs: r.array(r.object({
    id: r.string(),
    taskIdentifier: r.string(),
    isCached: r.boolean(),
    idempotencyKey: r.string().optional()
  }))
});
r.object({
  batchId: r.string(),
  runs: r.string().array()
});
r.object({
  id: r.string(),
  items: r.array(r.object({
    id: r.string(),
    taskRunId: r.string(),
    status: r.enum(["PENDING", "CANCELED", "COMPLETED", "FAILED"])
  }))
});
r.object({
  tags: $n
});
r.object({
  delay: r.string().or(r.coerce.date())
});
r.object({
  variables: r.record(r.string())
});
r.object({
  imageReference: r.string(),
  selfHosted: r.boolean().optional()
});
r.object({
  id: r.string(),
  contentHash: r.string()
});
r.object({
  imageReference: r.string(),
  selfHosted: r.boolean().optional()
});
const Io = r.object({
  buildId: r.string(),
  buildToken: r.string(),
  projectId: r.string()
});
r.object({
  id: r.string(),
  contentHash: r.string(),
  shortCode: r.string(),
  version: r.string(),
  imageTag: r.string(),
  externalBuildData: Io.optional().nullable(),
  registryHost: r.string().optional()
});
r.object({
  contentHash: r.string(),
  userId: r.string().optional(),
  registryHost: r.string().optional(),
  selfHosted: r.boolean().optional(),
  namespace: r.string().optional()
});
const rs = r.object({
  name: r.string(),
  message: r.string(),
  stack: r.string().optional(),
  stderr: r.string().optional()
});
r.object({
  error: rs
});
r.object({
  id: r.string()
});
r.object({
  id: r.string(),
  status: r.enum([
    "PENDING",
    "BUILDING",
    "DEPLOYING",
    "DEPLOYED",
    "FAILED",
    "CANCELED",
    "TIMED_OUT"
  ]),
  contentHash: r.string(),
  shortCode: r.string(),
  version: r.string(),
  imageReference: r.string().nullish(),
  errorData: rs.nullish(),
  worker: r.object({
    id: r.string(),
    version: r.string(),
    tasks: r.array(r.object({
      id: r.string(),
      slug: r.string(),
      filePath: r.string(),
      exportName: r.string()
    }))
  }).optional()
});
const oa = r.object({
  presignedUrl: r.string()
}), ko = r.object({
  id: r.string()
}), xo = r.object({
  id: r.string()
}), ns = r.union([r.literal("DECLARATIVE"), r.literal("IMPERATIVE")]);
r.object({
  /** The schedule id associated with this run (you can have many schedules for the same task).
    You can use this to remove the schedule, update it, etc */
  scheduleId: r.string(),
  /** The type of schedule – `"DECLARATIVE"` or `"IMPERATIVE"`.
   *
   * **DECLARATIVE** – defined inline on your `schedules.task` using the `cron` property. They can only be created, updated or deleted by modifying the `cron` property on your task.
   *
   * **IMPERATIVE** – created using the `schedules.create` functions or in the dashboard.
   */
  type: ns,
  /** When the task was scheduled to run.
   * Note this will be slightly different from `new Date()` because it takes a few ms to run the task.
   *
   * This date is UTC. To output it as a string with a timezone you would do this:
   * ```ts
   * const formatted = payload.timestamp.toLocaleString("en-US", {
        timeZone: payload.timezone,
    });
    ```  */
  timestamp: r.date(),
  /** When the task was last run (it has been).
    This can be undefined if it's never been run. This date is UTC. */
  lastTimestamp: r.date().optional(),
  /** You can optionally provide an external id when creating the schedule.
    Usually you would use a userId or some other unique identifier.
    This defaults to undefined if you didn't provide one. */
  externalId: r.string().optional(),
  /** The IANA timezone the schedule is set to. The default is UTC.
   * You can see the full list of supported timezones here: https://cloud.trigger.dev/timezones
   */
  timezone: r.string(),
  /** The next 5 dates this task is scheduled to run */
  upcoming: r.array(r.date())
});
const No = r.object({
  /** The id of the task you want to attach to. */
  task: r.string(),
  /**  The schedule in CRON format.
     *
     * ```txt
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬
  │    │    │    │    |
  │    │    │    │    └ day of week (0 - 7, 1L - 7L) (0 or 7 is Sun)
  │    │    │    └───── month (1 - 12)
  │    │    └────────── day of month (1 - 31, L)
  │    └─────────────── hour (0 - 23)
  └──────────────────── minute (0 - 59)
     * ```
  
  "L" means the last. In the "day of week" field, 1L means the last Monday of the month. In the day of month field, L means the last day of the month.
  
     */
  cron: r.string(),
  /** You can only create one schedule with this key. If you use it twice, the second call will update the schedule.
   *
   * This is required to prevent you from creating duplicate schedules. */
  deduplicationKey: r.string(),
  /** Optionally, you can specify your own IDs (like a user ID) and then use it inside the run function of your task.
   *
   * This allows you to have per-user CRON tasks.
   */
  externalId: r.string().optional(),
  /** Optionally, you can specify a timezone in the IANA format. If unset it will use UTC.
   * If specified then the CRON will be evaluated in that timezone and will respect daylight savings.
   *
   * If you set the CRON to `0 0 * * *` and the timezone to `America/New_York` then the task will run at midnight in New York time, no matter whether it's daylight savings or not.
   *
   * You can see the full list of supported timezones here: https://cloud.trigger.dev/timezones
   *
   * @example "America/New_York", "Europe/London", "Asia/Tokyo", "Africa/Cairo"
   *
   */
  timezone: r.string().optional()
});
No.omit({ deduplicationKey: !0 });
const as = r.object({
  type: r.literal("CRON"),
  expression: r.string(),
  description: r.string()
}), ke = r.object({
  id: r.string(),
  type: ns,
  task: r.string(),
  active: r.boolean(),
  deduplicationKey: r.string().nullish(),
  externalId: r.string().nullish(),
  generator: as,
  timezone: r.string(),
  nextRun: r.coerce.date().nullish(),
  environments: r.array(r.object({
    id: r.string(),
    type: r.string(),
    userName: r.string().nullish()
  }))
}), Oo = r.object({
  id: r.string()
});
r.object({
  data: r.array(ke),
  pagination: r.object({
    currentPage: r.number(),
    totalPages: r.number(),
    count: r.number()
  })
});
r.object({
  page: r.number().optional(),
  perPage: r.number().optional()
});
r.object({
  timezones: r.array(r.string())
});
const Co = r.enum([
  /// Task hasn't been deployed yet but is waiting to be executed
  "WAITING_FOR_DEPLOY",
  /// Task is waiting to be executed by a worker
  "QUEUED",
  /// Task is currently being executed by a worker
  "EXECUTING",
  /// Task has failed and is waiting to be retried
  "REATTEMPTING",
  /// Task has been paused by the system, and will be resumed by the system
  "FROZEN",
  /// Task has been completed successfully
  "COMPLETED",
  /// Task has been canceled by the user
  "CANCELED",
  /// Task has been completed with errors
  "FAILED",
  /// Task has crashed and won't be retried, most likely the worker ran out of resources, e.g. memory or storage
  "CRASHED",
  /// Task was interrupted during execution, mostly this happens in development environments
  "INTERRUPTED",
  /// Task has failed to complete, due to an error in the system
  "SYSTEM_FAILURE",
  /// Task has been scheduled to run at a specific time
  "DELAYED",
  /// Task has expired and won't be executed
  "EXPIRED",
  /// Task has reached it's maxDuration and has been stopped
  "TIMED_OUT"
]), Po = r.enum([
  "PENDING",
  "EXECUTING",
  "PAUSED",
  "COMPLETED",
  "FAILED",
  "CANCELED"
]), jo = r.object({
  id: r.string(),
  name: r.string(),
  user: r.string().optional()
}), Mo = r.object({
  id: r.string(),
  externalId: r.string().optional(),
  deduplicationKey: r.string().optional(),
  generator: as
});
r.enum([
  "triggerAndWait",
  "trigger",
  "batchTriggerAndWait",
  "batchTrigger"
]);
const ss = {
  id: r.string(),
  status: Co,
  taskIdentifier: r.string(),
  idempotencyKey: r.string().optional(),
  version: r.string().optional(),
  isQueued: r.boolean(),
  isExecuting: r.boolean(),
  isCompleted: r.boolean(),
  isSuccess: r.boolean(),
  isFailed: r.boolean(),
  isCancelled: r.boolean(),
  isTest: r.boolean(),
  createdAt: r.coerce.date(),
  updatedAt: r.coerce.date(),
  startedAt: r.coerce.date().optional(),
  finishedAt: r.coerce.date().optional(),
  delayedUntil: r.coerce.date().optional(),
  ttl: r.string().optional(),
  expiredAt: r.coerce.date().optional(),
  tags: r.string().array(),
  costInCents: r.number(),
  baseCostInCents: r.number(),
  durationMs: r.number(),
  metadata: r.record(r.any()).optional()
}, is = {
  ...ss,
  depth: r.number(),
  triggerFunction: r.enum(["triggerAndWait", "trigger", "batchTriggerAndWait", "batchTrigger"]),
  batchId: r.string().optional()
}, Wr = r.object(is), ca = r.object({
  ...is,
  payload: r.any().optional(),
  payloadPresignedUrl: r.string().optional(),
  output: r.any().optional(),
  outputPresignedUrl: r.string().optional(),
  error: sa.optional(),
  schedule: Mo.optional(),
  relatedRuns: r.object({
    root: Wr.optional(),
    parent: Wr.optional(),
    children: r.array(Wr).optional()
  }),
  attempts: r.array(r.object({
    id: r.string(),
    status: Po,
    createdAt: r.coerce.date(),
    updatedAt: r.coerce.date(),
    startedAt: r.coerce.date().optional(),
    completedAt: r.coerce.date().optional(),
    error: sa.optional()
  }).optional()),
  attemptCount: r.number().default(0)
}), fn = r.object({
  ...ss,
  env: jo
});
r.object({
  data: r.array(fn),
  pagination: r.object({
    next: r.string().optional(),
    previous: r.string().optional()
  })
});
r.object({
  name: r.string(),
  value: r.string()
});
r.object({
  value: r.string()
});
r.object({
  variables: r.record(r.string()),
  override: r.boolean().optional()
});
const qt = r.object({
  success: r.boolean()
}), Uo = r.object({
  value: r.string()
}), Do = r.object({
  name: r.string(),
  value: r.string()
}), $o = r.array(Do);
r.object({
  metadata: r.record($t),
  metadataType: r.string().optional()
});
const Lo = r.object({
  metadata: r.record($t)
}), Go = r.object({
  id: r.string(),
  idempotencyKey: r.string().nullish(),
  createdAt: r.coerce.date(),
  updatedAt: r.coerce.date(),
  startedAt: r.coerce.date().nullish(),
  delayUntil: r.coerce.date().nullish(),
  queuedAt: r.coerce.date().nullish(),
  expiredAt: r.coerce.date().nullish(),
  completedAt: r.coerce.date().nullish(),
  taskIdentifier: r.string(),
  friendlyId: r.string(),
  number: r.number(),
  isTest: r.boolean(),
  status: r.string(),
  usageDurationMs: r.number(),
  costInCents: r.number(),
  baseCostInCents: r.number(),
  ttl: r.string().nullish(),
  payload: r.string().nullish(),
  payloadType: r.string().nullish(),
  metadata: r.string().nullish(),
  metadataType: r.string().nullish(),
  output: r.string().nullish(),
  outputType: r.string().nullish(),
  runTags: r.array(r.string()).nullish().default([]),
  error: Ba.nullish()
}), Fo = r.enum(["PENDING", "COMPLETED"]), Ko = r.object({
  id: r.string(),
  status: Fo,
  idempotencyKey: r.string().optional(),
  createdAt: r.coerce.date(),
  updatedAt: r.coerce.date(),
  runCount: r.number()
}), Bo = r.object({
  id: r.string(),
  runId: r.string(),
  sequence: r.number(),
  key: r.string(),
  value: r.string(),
  createdAt: r.coerce.date()
}), Vo = r.object({
  project: r.string(),
  dirs: r.string().array()
}), Zo = r.object({
  name: r.string(),
  version: r.string()
}), Wo = r.enum(["dev", "deploy"]), os = r.enum(["node", "bun"]), Ho = r.object({
  target: Wo,
  packageVersion: r.string(),
  cliPackageVersion: r.string(),
  contentHash: r.string(),
  runtime: os,
  environment: r.string(),
  config: Vo,
  files: r.array(yo),
  sources: r.record(r.object({
    contents: r.string(),
    contentHash: r.string()
  })),
  outputPath: r.string(),
  runWorkerEntryPoint: r.string(),
  // Dev & Deploy has a runWorkerEntryPoint
  runControllerEntryPoint: r.string().optional(),
  // Only deploy has a runControllerEntryPoint
  indexWorkerEntryPoint: r.string(),
  // Dev & Deploy has a indexWorkerEntryPoint
  indexControllerEntryPoint: r.string().optional(),
  // Only deploy has a indexControllerEntryPoint
  loaderEntryPoint: r.string().optional(),
  configPath: r.string(),
  externals: Zo.array().optional(),
  build: r.object({
    env: r.record(r.string()).optional(),
    commands: r.array(r.string()).optional()
  }),
  customConditions: r.array(r.string()).optional(),
  deploy: r.object({
    env: r.record(r.string()).optional(),
    sync: r.object({
      env: r.record(r.string()).optional()
    }).optional()
  }),
  image: r.object({
    pkgs: r.array(r.string()).optional(),
    instructions: r.array(r.string()).optional()
  }).optional(),
  otelImportHook: r.object({
    include: r.array(r.string()).optional(),
    exclude: r.array(r.string()).optional()
  }).optional()
});
r.object({
  type: r.literal("index"),
  data: r.object({
    build: Ho
  })
});
const cs = r.object({
  configPath: r.string(),
  tasks: _o.array(),
  workerEntryPoint: r.string(),
  controllerEntryPoint: r.string().optional(),
  loaderEntryPoint: r.string().optional(),
  runtime: os,
  customConditions: r.array(r.string()).optional(),
  otelImportHook: r.object({
    include: r.array(r.string()).optional(),
    exclude: r.array(r.string()).optional()
  }).optional()
});
r.object({
  type: r.literal("worker-manifest"),
  data: r.object({
    manifest: cs
  })
});
const Yo = r.object({
  message: r.string(),
  file: r.string(),
  stack: r.string().optional(),
  name: r.string().optional()
}), zo = r.array(Yo), us = r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1),
    error: r.object({
      name: r.string(),
      message: r.string(),
      stack: r.string().optional(),
      stderr: r.string().optional()
    })
  }),
  r.object({
    success: r.literal(!0)
  })
]), ls = r.discriminatedUnion("type", [
  r.object({
    type: r.literal("CANCEL_ATTEMPT"),
    taskAttemptId: r.string(),
    taskRunId: r.string()
  }),
  r.object({
    type: r.literal("SCHEDULE_ATTEMPT"),
    image: r.string(),
    version: r.string(),
    machine: zt,
    nextAttemptNumber: r.number().optional(),
    // identifiers
    id: r.string().optional(),
    // TODO: Remove this completely in a future release
    envId: r.string(),
    envType: tr,
    orgId: r.string(),
    projectId: r.string(),
    runId: r.string()
  }),
  r.object({
    type: r.literal("EXECUTE_RUN_LAZY_ATTEMPT"),
    payload: Un
  })
]);
r.object({
  version: r.literal("v1").default("v1"),
  id: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string(),
  data: ls
});
const ds = r.discriminatedUnion("type", [
  r.object({
    version: r.literal("v1").default("v1"),
    type: r.literal("TASK_RUN_COMPLETED"),
    completion: X,
    execution: de
  }),
  r.object({
    version: r.literal("v1").default("v1"),
    type: r.literal("TASK_RUN_FAILED_TO_RUN"),
    completion: $r
  }),
  r.object({
    version: r.literal("v1").default("v1"),
    type: r.literal("TASK_HEARTBEAT"),
    id: r.string()
  }),
  r.object({
    version: r.literal("v1").default("v1"),
    type: r.literal("TASK_RUN_HEARTBEAT"),
    id: r.string()
  })
]), Jo = r.object({
  id: r.string(),
  version: r.string(),
  contentHash: r.string()
});
r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string(),
  inProgressRuns: r.string().array().optional()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string(),
  data: ds
});
const fs = r.object({
  version: r.literal("v1").default("v1"),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional()
  }),
  origin: r.enum(["uncaughtException", "unhandledRejection"])
}), qo = r.object({
  version: r.literal("v1").default("v1"),
  tasks: r.unknown(),
  zodIssues: r.custom((t) => Array.isArray(t) && t.every((e) => typeof e == "object" && "message" in e))
});
r.object({
  version: r.literal("v1").default("v1"),
  manifest: cs,
  importErrors: zo
});
r.object({
  version: r.literal("v1").default("v1"),
  execution: de,
  result: X
}), r.object({
  version: r.literal("v1").default("v1"),
  id: r.string()
}), r.undefined(), r.object({
  version: r.literal("v1").default("v1"),
  ms: r.number(),
  now: r.number(),
  waitThresholdInMs: r.number()
}), r.object({
  version: r.literal("v1").default("v1"),
  friendlyId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  batchFriendlyId: r.string(),
  runFriendlyIds: r.string().array()
});
r.object({
  version: r.literal("v1").default("v1"),
  execution: de,
  traceContext: r.record(r.unknown()),
  metadata: Jo
}), r.discriminatedUnion("version", [
  r.object({
    version: r.literal("v1"),
    completion: X,
    execution: de
  }),
  r.object({
    version: r.literal("v2"),
    completion: X
  })
]), r.object({
  version: r.literal("v1").default("v1")
}), r.object({
  timeoutInMs: r.number()
}), r.void();
r.object({
  version: r.literal("v1").default("v1"),
  data: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  data: r.string()
}), r.object({
  status: r.literal("ok")
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  reason: r.string().optional(),
  exitCode: r.number().optional(),
  message: r.string().optional(),
  logs: r.string().optional(),
  /** This means we should only update the error if one exists */
  overrideCompletion: r.boolean().optional(),
  errorCode: jn.shape.code.optional()
}), r.object({
  version: r.literal("v1").default("v1"),
  deploymentId: r.string(),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional(),
    stderr: r.string().optional()
  }),
  overrideCompletion: r.boolean().optional()
});
r.object({
  version: r.literal("v1").default("v1"),
  imageTag: r.string(),
  shortCode: r.string(),
  apiKey: r.string(),
  apiUrl: r.string(),
  // identifiers
  envId: r.string(),
  envType: tr,
  orgId: r.string(),
  projectId: r.string(),
  deploymentId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  type: r.enum(["DOCKER", "KUBERNETES"]),
  location: r.string(),
  reason: r.string().optional(),
  imageRef: r.string(),
  attemptNumber: r.number().optional(),
  machine: zt,
  // identifiers
  checkpointId: r.string(),
  envId: r.string(),
  envType: tr,
  orgId: r.string(),
  projectId: r.string(),
  runId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  imageRef: r.string(),
  shortCode: r.string(),
  // identifiers
  envId: r.string(),
  envType: tr,
  orgId: r.string(),
  projectId: r.string(),
  deploymentId: r.string()
});
const ua = r.object({
  projectRef: r.string(),
  envId: r.string(),
  deploymentId: r.string(),
  metadata: r.object({
    cliPackageVersion: r.string().optional(),
    contentHash: r.string(),
    packageVersion: r.string(),
    tasks: Dn.array()
  })
});
r.object({
  version: r.literal("v1").default("v1"),
  metadata: r.any(),
  text: r.string()
}), r.discriminatedUnion("version", [
  ua.extend({
    version: r.literal("v1")
  }),
  ua.extend({
    version: r.literal("v2"),
    supportsLazyAttempts: r.boolean()
  })
]), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1)
  }),
  r.object({
    success: r.literal(!0)
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  envId: r.string()
}), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1),
    reason: r.string().optional()
  }),
  r.object({
    success: r.literal(!0),
    executionPayload: hr
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  totalCompletions: r.number()
}), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1)
  }),
  r.object({
    success: r.literal(!0),
    payload: hr
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  envId: r.string(),
  totalCompletions: r.number()
}), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1),
    reason: r.string().optional()
  }),
  r.object({
    success: r.literal(!0),
    lazyPayload: Un
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  attemptFriendlyId: r.string(),
  type: Et
}), r.object({
  version: r.enum(["v1", "v2"]).default("v1"),
  execution: Mn,
  completion: X,
  checkpoint: r.object({
    docker: r.boolean(),
    location: r.string()
  }).optional()
}), r.object({
  version: r.literal("v1").default("v1"),
  completion: $r
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptFriendlyId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string().optional(),
  attemptFriendlyId: r.string(),
  docker: r.boolean(),
  location: r.string(),
  reason: r.discriminatedUnion("type", [
    r.object({
      type: r.literal("WAIT_FOR_DURATION"),
      ms: r.number(),
      now: r.number()
    }),
    r.object({
      type: r.literal("WAIT_FOR_BATCH"),
      batchFriendlyId: r.string(),
      runFriendlyIds: r.string().array()
    }),
    r.object({
      type: r.literal("WAIT_FOR_TASK"),
      friendlyId: r.string()
    }),
    r.object({
      type: r.literal("RETRYING_AFTER_FAILURE"),
      attemptNumber: r.number()
    })
  ])
}), r.object({
  version: r.literal("v1").default("v1"),
  keepRunAlive: r.boolean()
}), r.object({
  version: r.literal("v1").default("v1"),
  deploymentId: r.string(),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional(),
    stderr: r.string().optional()
  })
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional()
  })
});
r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  attemptId: r.string(),
  attemptFriendlyId: r.string(),
  completions: X.array(),
  executions: de.array()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  attemptId: r.string(),
  attemptFriendlyId: r.string(),
  completions: X.array(),
  executions: de.array()
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptId: r.string(),
  attemptFriendlyId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptId: r.string(),
  attemptFriendlyId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  delayInMs: r.number().optional()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  checkpointThresholdInMs: r.number()
});
r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string(),
  data: ds
});
r.object({
  version: r.literal("v1").default("v1"),
  id: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  backgroundWorkerId: r.string(),
  data: ls
});
const la = r.object({
  version: r.literal("v1"),
  deploymentId: r.string(),
  tasks: Dn.array(),
  packageVersion: r.string()
});
r.object({
  version: r.literal("v1").default("v1")
}), r.void(), r.discriminatedUnion("version", [
  la.extend({
    version: r.literal("v1")
  }),
  la.extend({
    version: r.literal("v2"),
    supportsLazyAttempts: r.boolean()
  })
]), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1)
  }),
  r.object({
    success: r.literal(!0)
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  totalCompletions: r.number()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string(),
  totalCompletions: r.number()
}), r.discriminatedUnion("version", [
  r.object({
    version: r.literal("v1"),
    attemptFriendlyId: r.string(),
    type: Et
  }),
  r.object({
    version: r.literal("v2"),
    attemptFriendlyId: r.string(),
    attemptNumber: r.number(),
    type: Et
  })
]), r.object({
  version: r.literal("v1").default("v1")
}), r.discriminatedUnion("version", [
  r.object({
    version: r.literal("v1")
  }),
  r.object({
    version: r.literal("v2"),
    reason: Et.optional()
  })
]).default({ version: "v1" }), r.object({
  version: r.literal("v2").default("v2"),
  checkpointCanceled: r.boolean(),
  reason: Et.optional()
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptFriendlyId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string()
}), r.object({
  version: r.enum(["v1", "v2"]).default("v1"),
  execution: Mn,
  completion: X
}), r.object({
  willCheckpointAndRestore: r.boolean(),
  shouldExit: r.boolean()
}), r.object({
  version: r.literal("v1").default("v1"),
  completion: $r
}), r.object({
  version: r.literal("v1").default("v1"),
  ms: r.number(),
  now: r.number(),
  attemptFriendlyId: r.string()
}), r.object({
  willCheckpointAndRestore: r.boolean()
}), r.object({
  version: r.enum(["v1", "v2"]).default("v1"),
  friendlyId: r.string(),
  // This is the attempt that is waiting
  attemptFriendlyId: r.string()
}), r.object({
  willCheckpointAndRestore: r.boolean()
}), r.object({
  version: r.enum(["v1", "v2"]).default("v1"),
  batchFriendlyId: r.string(),
  runFriendlyIds: r.string().array(),
  // This is the attempt that is waiting
  attemptFriendlyId: r.string()
}), r.object({
  willCheckpointAndRestore: r.boolean()
}), r.object({
  version: r.literal("v1").default("v1"),
  deploymentId: r.string(),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional(),
    stderr: r.string().optional()
  })
}), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string()
}), r.discriminatedUnion("success", [
  r.object({
    success: r.literal(!1),
    reason: r.string().optional()
  }),
  r.object({
    success: r.literal(!0),
    executionPayload: hr
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  error: r.object({
    name: r.string(),
    message: r.string(),
    stack: r.string().optional()
  })
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptFriendlyId: r.string().optional(),
  attemptNumber: r.string().optional()
});
r.object({
  version: r.literal("v1").default("v1"),
  attemptId: r.string(),
  completions: X.array(),
  executions: de.array()
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptId: r.string()
}), r.object({
  version: r.literal("v1").default("v1"),
  executionPayload: hr
}), r.object({
  version: r.literal("v1").default("v1"),
  lazyPayload: Un
}), r.object({
  version: r.literal("v1").default("v1"),
  attemptId: r.string()
}), r.discriminatedUnion("version", [
  r.object({
    version: r.literal("v1")
  }),
  r.object({
    version: r.literal("v2"),
    delayInMs: r.number().optional()
  })
]), r.object({
  version: r.literal("v1").default("v1"),
  runId: r.string()
});
r.object({
  contentHash: r.string(),
  projectRef: r.string(),
  envId: r.string(),
  runId: r.string(),
  attemptFriendlyId: r.string().optional(),
  attemptNumber: r.string().optional(),
  podName: r.string(),
  deploymentId: r.string(),
  deploymentVersion: r.string(),
  requiresCheckpointResumeWithMessage: r.string().optional()
});
r.object({
  supportsDynamicConfig: r.string().optional()
});
const Xo = "primary", Qo = r.enum([Xo]), ec = r.object({
  text: r.string(),
  variant: r.string().optional(),
  url: r.string().optional()
}), tc = r.object({
  items: r.array(ec),
  style: r.enum(["codepath"]).optional()
});
r.object({
  icon: r.string().optional(),
  variant: Qo.optional(),
  accessory: tc.optional()
}).default({
  icon: void 0,
  variant: void 0
});
const rc = [
  r.object({
    $endsWith: r.string()
  }),
  r.object({
    $startsWith: r.string()
  }),
  r.object({
    $ignoreCaseEquals: r.string()
  })
], nc = r.union([
  /** Match against a string */
  r.array(r.string()),
  /** Match against a number */
  r.array(r.number()),
  /** Match against a boolean */
  r.array(r.boolean()),
  r.array(r.union([
    ...rc,
    r.object({
      $exists: r.boolean()
    }),
    r.object({
      $isNull: r.boolean()
    }),
    r.object({
      $anythingBut: r.union([r.string(), r.number(), r.boolean()])
    }),
    r.object({
      $anythingBut: r.union([r.array(r.string()), r.array(r.number()), r.array(r.boolean())])
    }),
    r.object({
      $gt: r.number()
    }),
    r.object({
      $lt: r.number()
    }),
    r.object({
      $gte: r.number()
    }),
    r.object({
      $lte: r.number()
    }),
    r.object({
      $between: r.tuple([r.number(), r.number()])
    }),
    r.object({
      $includes: r.union([r.string(), r.number(), r.boolean()])
    }),
    r.object({
      $not: r.union([r.string(), r.number(), r.boolean()])
    })
  ]))
]), Ln = r.lazy(() => r.record(r.union([nc, Ln]))), ac = r.object({
  /** The `headers` strategy retries the request using info from the response headers. */
  strategy: r.literal("headers"),
  /** The header to use to determine the maximum number of times to retry the request. */
  limitHeader: r.string(),
  /** The header to use to determine the number of remaining retries. */
  remainingHeader: r.string(),
  /** The header to use to determine the time when the number of remaining retries will be reset. */
  resetHeader: r.string(),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: Ln.optional(),
  /** The format of the `resetHeader` value. */
  resetFormat: r.enum([
    "unix_timestamp",
    "unix_timestamp_in_ms",
    "iso_8601",
    "iso_8601_duration_openai_variant"
  ]).default("unix_timestamp").optional()
}), sc = Le.extend({
  /** The `backoff` strategy retries the request with an exponential backoff. */
  strategy: r.literal("backoff"),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: Ln.optional()
}), ic = r.discriminatedUnion("strategy", [
  ac,
  sc
]), oc = r.record(r.string(), ic);
r.object({
  /** The maximum time to wait for the request to complete. */
  durationInMs: r.number().optional(),
  retry: Le.optional()
});
r.object({
  /** The retrying strategy for specific status codes. */
  byStatus: oc.optional(),
  /** The timeout options for the request. */
  timeout: Le.optional(),
  /**
   * The retrying strategy for connection errors.
   */
  connectionError: Le.optional()
});
const cc = r.object({
  type: r.string().optional(),
  message: r.string().optional(),
  stacktrace: r.string().optional()
}), uc = r.object({
  name: r.literal("exception"),
  time: r.coerce.date(),
  properties: r.object({
    exception: cc
  })
}), lc = r.object({
  name: r.literal("cancellation"),
  time: r.coerce.date(),
  properties: r.object({
    reason: r.string()
  })
}), dc = r.object({
  name: r.string(),
  time: r.coerce.date(),
  properties: r.record(r.unknown())
}), fc = r.union([uc, lc, dc]);
r.array(fc);
r.object({
  system: r.string().optional(),
  client_id: r.string().optional(),
  operation: r.enum(["publish", "create", "receive", "deliver"]),
  message: r.any(),
  destination: r.string().optional()
});
const hc = typeof globalThis == "object" ? globalThis : global, pr = Symbol.for("dev.trigger.ts.api"), gr = hc;
function ne(t, e, n = !1) {
  const a = gr[pr] = gr[pr] ?? {};
  return !n && a[t] ? !1 : (a[t] = e, !0);
}
function Ie(t) {
  var e;
  return (e = gr[pr]) == null ? void 0 : e[t];
}
function Ke(t) {
  const e = gr[pr];
  e && delete e[t];
}
const w = {
  ENVIRONMENT_ID: "ctx.environment.id",
  ENVIRONMENT_TYPE: "ctx.environment.type",
  ORGANIZATION_ID: "ctx.organization.id",
  ORGANIZATION_SLUG: "ctx.organization.slug",
  ORGANIZATION_NAME: "ctx.organization.name",
  PROJECT_ID: "ctx.project.id",
  PROJECT_REF: "ctx.project.ref",
  PROJECT_NAME: "ctx.project.title",
  PROJECT_DIR: "project.dir",
  ATTEMPT_ID: "ctx.attempt.id",
  ATTEMPT_NUMBER: "ctx.attempt.number",
  RUN_ID: "ctx.run.id",
  RUN_IS_TEST: "ctx.run.isTest",
  BATCH_ID: "ctx.batch.id",
  TASK_SLUG: "ctx.task.id",
  TASK_PATH: "ctx.task.filePath",
  TASK_EXPORT_NAME: "ctx.task.exportName",
  QUEUE_NAME: "ctx.queue.name",
  QUEUE_ID: "ctx.queue.id",
  MACHINE_PRESET_NAME: "ctx.machine.name",
  MACHINE_PRESET_CPU: "ctx.machine.cpu",
  MACHINE_PRESET_MEMORY: "ctx.machine.memory",
  MACHINE_PRESET_CENTS_PER_MS: "ctx.machine.centsPerMs",
  SPAN_PARTIAL: "$span.partial",
  SPAN_ID: "$span.span_id",
  OUTPUT: "$output",
  OUTPUT_TYPE: "$mime_type_output",
  STYLE: "$style",
  STYLE_ICON: "$style.icon",
  STYLE_VARIANT: "$style.variant",
  STYLE_ACCESSORY: "$style.accessory",
  METADATA: "$metadata",
  TRIGGER: "$trigger",
  PAYLOAD: "$payload",
  PAYLOAD_TYPE: "$mime_type_payload",
  SHOW: "$show",
  SHOW_ACTIONS: "$show.actions",
  WORKER_ID: "worker.id",
  WORKER_VERSION: "worker.version",
  CLI_VERSION: "cli.version",
  SDK_VERSION: "sdk.version",
  SDK_LANGUAGE: "sdk.language",
  RETRY_AT: "retry.at",
  RETRY_DELAY: "retry.delay",
  RETRY_COUNT: "retry.count",
  LINK_TITLE: "$link.title",
  IDEMPOTENCY_KEY: "ctx.run.idempotencyKey",
  USAGE_DURATION_MS: "$usage.durationMs",
  USAGE_COST_IN_CENTS: "$usage.costInCents",
  RATE_LIMIT_LIMIT: "response.rateLimit.limit",
  RATE_LIMIT_REMAINING: "response.rateLimit.remaining",
  RATE_LIMIT_RESET: "response.rateLimit.reset"
}, Hr = "task-context";
var Qe, rr;
const wr = class wr {
  constructor() {
    G(this, Qe);
  }
  static getInstance() {
    return this._instance || (this._instance = new wr()), this._instance;
  }
  get isInsideTask() {
    return y(this, Qe, rr).call(this) !== void 0;
  }
  get ctx() {
    var e;
    return (e = y(this, Qe, rr).call(this)) == null ? void 0 : e.ctx;
  }
  get worker() {
    var e;
    return (e = y(this, Qe, rr).call(this)) == null ? void 0 : e.worker;
  }
  get attributes() {
    return this.ctx ? {
      ...this.contextAttributes,
      ...this.workerAttributes
    } : {};
  }
  get workerAttributes() {
    return this.worker ? {
      [w.WORKER_ID]: this.worker.id,
      [w.WORKER_VERSION]: this.worker.version
    } : {};
  }
  get contextAttributes() {
    var e, n, a, s, i;
    return this.ctx ? {
      [w.ATTEMPT_ID]: this.ctx.attempt.id,
      [w.ATTEMPT_NUMBER]: this.ctx.attempt.number,
      [w.TASK_SLUG]: this.ctx.task.id,
      [w.TASK_PATH]: this.ctx.task.filePath,
      [w.TASK_EXPORT_NAME]: this.ctx.task.exportName,
      [w.QUEUE_NAME]: this.ctx.queue.name,
      [w.QUEUE_ID]: this.ctx.queue.id,
      [w.ENVIRONMENT_ID]: this.ctx.environment.id,
      [w.ENVIRONMENT_TYPE]: this.ctx.environment.type,
      [w.ORGANIZATION_ID]: this.ctx.organization.id,
      [w.PROJECT_ID]: this.ctx.project.id,
      [w.PROJECT_REF]: this.ctx.project.ref,
      [w.PROJECT_NAME]: this.ctx.project.name,
      [w.RUN_ID]: this.ctx.run.id,
      [w.RUN_IS_TEST]: this.ctx.run.isTest,
      [w.ORGANIZATION_SLUG]: this.ctx.organization.slug,
      [w.ORGANIZATION_NAME]: this.ctx.organization.name,
      [w.BATCH_ID]: (e = this.ctx.batch) == null ? void 0 : e.id,
      [w.IDEMPOTENCY_KEY]: this.ctx.run.idempotencyKey,
      [w.MACHINE_PRESET_NAME]: (n = this.ctx.machine) == null ? void 0 : n.name,
      [w.MACHINE_PRESET_CPU]: (a = this.ctx.machine) == null ? void 0 : a.cpu,
      [w.MACHINE_PRESET_MEMORY]: (s = this.ctx.machine) == null ? void 0 : s.memory,
      [w.MACHINE_PRESET_CENTS_PER_MS]: (i = this.ctx.machine) == null ? void 0 : i.centsPerMs
    } : {};
  }
  disable() {
    Ke(Hr);
  }
  setGlobalTaskContext(e) {
    return ne(Hr, e);
  }
};
Qe = new WeakSet(), rr = function() {
  return Ie(Hr);
}, _(wr, "_instance");
let hn = wr;
const D = hn.getInstance(), pc = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;
function gc(t) {
  return t.length === 1 ? t[0].toString() : t.reduce((e, n) => {
    if (typeof n == "number")
      return e + "[" + n.toString() + "]";
    if (n.includes('"'))
      return e + '["' + mc(n) + '"]';
    if (!pc.test(n))
      return e + '["' + n + '"]';
    const a = e.length === 0 ? "" : ".";
    return e + a + n;
  }, "");
}
function mc(t) {
  return t.replace(/"/g, '\\"');
}
function yc(t) {
  return t.length !== 0;
}
const _c = 99, vc = "; ", bc = ", or ", hs = "Validation error", Ec = ": ";
class Tc extends Error {
  constructor(n, a = []) {
    super(n);
    _(this, "details");
    _(this, "name");
    this.details = a, this.name = "ZodValidationError";
  }
  toString() {
    return this.message;
  }
}
function ps(t, e, n) {
  if (t.code === "invalid_union")
    return t.unionErrors.reduce((a, s) => {
      const i = s.issues.map((o) => ps(o, e, n)).join(e);
      return a.includes(i) || a.push(i), a;
    }, []).join(n);
  if (yc(t.path)) {
    if (t.path.length === 1) {
      const a = t.path[0];
      if (typeof a == "number")
        return `${t.message} at index ${a}`;
    }
    return `${t.message} at "${gc(t.path)}"`;
  }
  return t.message;
}
function Rc(t, e, n) {
  return e !== null ? t.length > 0 ? [e, t].join(n) : e : t.length > 0 ? t : hs;
}
function Sc(t, e = {}) {
  const { maxIssuesInMessage: n = _c, issueSeparator: a = vc, unionSeparator: s = bc, prefixSeparator: i = Ec, prefix: o = hs } = e, c = t.errors.slice(0, n).map((l) => ps(l, a, s)).join(a), u = Rc(c, o, i);
  return new Tc(u, t.errors);
}
const gs = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !0
};
function ms(t, e) {
  const n = { ...gs, ...t };
  if (e >= n.maxAttempts)
    return;
  const { factor: a, minTimeoutInMs: s, maxTimeoutInMs: i, randomize: o } = n, c = o ? Math.random() + 1 : 1, u = Math.min(i, c * s * Math.pow(a, e - 1));
  return Math.round(u);
}
class K extends Error {
  constructor(n, a, s, i) {
    super(`${K.makeMessage(n, a, s)}`);
    _(this, "status");
    _(this, "headers");
    _(this, "error");
    _(this, "code");
    _(this, "param");
    _(this, "type");
    this.name = "TriggerApiError", this.status = n, this.headers = i;
    const o = a;
    this.error = o, this.code = o == null ? void 0 : o.code, this.param = o == null ? void 0 : o.param, this.type = o == null ? void 0 : o.type;
  }
  static makeMessage(n, a, s) {
    const i = a != null && a.message ? typeof a.message == "string" ? a.message : JSON.stringify(a.message) : a ? JSON.stringify(a) : s;
    return n && i ? `${n} ${i}` : n ? `${n} status code (no body)` : i || "(no status code or body)";
  }
  static generate(n, a, s, i) {
    if (!n)
      return new ys({ cause: jc(a) });
    const o = a == null ? void 0 : a.error;
    return n === 400 ? new Ac(n, o, s, i) : n === 401 ? new wc(n, o, s, i) : n === 403 ? new Ic(n, o, s, i) : n === 404 ? new kc(n, o, s, i) : n === 409 ? new xc(n, o, s, i) : n === 422 ? new Nc(n, o, s, i) : n === 429 ? new Oc(n, o, s, i) : n >= 500 ? new Cc(n, o, s, i) : new K(n, o, s, i);
  }
}
class ys extends K {
  constructor({ message: n, cause: a }) {
    super(void 0, void 0, n || "Connection error.", void 0);
    _(this, "status");
    a && (this.cause = a);
  }
}
class Ac extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 400);
  }
}
class wc extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 401);
  }
}
class Ic extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 403);
  }
}
class kc extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 404);
  }
}
class xc extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 409);
  }
}
class Nc extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 422);
  }
}
class Oc extends K {
  constructor() {
    super(...arguments);
    _(this, "status", 429);
  }
  get millisecondsUntilReset() {
    const n = (this.headers ?? {})["x-ratelimit-reset"];
    if (typeof n == "string") {
      const a = parseInt(n, 10);
      return isNaN(a) ? void 0 : Math.max(a - Date.now() + Math.floor(Math.random() * 2e3), 0);
    }
  }
}
class Cc extends K {
}
class Pc extends K {
  constructor({ message: n, cause: a, status: s, rawBody: i, headers: o }) {
    super(s, void 0, n || "Validation error.", o);
    _(this, "status", 200);
    _(this, "rawBody");
    a && (this.cause = a), this.rawBody = i;
  }
}
function jc(t) {
  return t instanceof Error ? t : new Error(t);
}
var Mc = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, Ne = "1.9.0", da = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function Uc(t) {
  var e = /* @__PURE__ */ new Set([t]), n = /* @__PURE__ */ new Set(), a = t.match(da);
  if (!a)
    return function() {
      return !1;
    };
  var s = {
    major: +a[1],
    minor: +a[2],
    patch: +a[3],
    prerelease: a[4]
  };
  if (s.prerelease != null)
    return function(u) {
      return u === t;
    };
  function i(c) {
    return n.add(c), !1;
  }
  function o(c) {
    return e.add(c), !0;
  }
  return function(u) {
    if (e.has(u))
      return !0;
    if (n.has(u))
      return !1;
    var l = u.match(da);
    if (!l)
      return i(u);
    var d = {
      major: +l[1],
      minor: +l[2],
      patch: +l[3],
      prerelease: l[4]
    };
    return d.prerelease != null || s.major !== d.major ? i(u) : s.major === 0 ? s.minor === d.minor && s.patch <= d.patch ? o(u) : i(u) : s.minor <= d.minor ? o(u) : i(u);
  };
}
var Dc = Uc(Ne), $c = Ne.split(".")[0], Lt = Symbol.for("opentelemetry.js.api." + $c), Gt = Mc;
function Gr(t, e, n, a) {
  var s;
  a === void 0 && (a = !1);
  var i = Gt[Lt] = (s = Gt[Lt]) !== null && s !== void 0 ? s : {
    version: Ne
  };
  if (!a && i[t]) {
    var o = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + t);
    return n.error(o.stack || o.message), !1;
  }
  if (i.version !== Ne) {
    var o = new Error("@opentelemetry/api: Registration of version v" + i.version + " for " + t + " does not match previously registered API v" + Ne);
    return n.error(o.stack || o.message), !1;
  }
  return i[t] = e, n.debug("@opentelemetry/api: Registered a global for " + t + " v" + Ne + "."), !0;
}
function st(t) {
  var e, n, a = (e = Gt[Lt]) === null || e === void 0 ? void 0 : e.version;
  if (!(!a || !Dc(a)))
    return (n = Gt[Lt]) === null || n === void 0 ? void 0 : n[t];
}
function Fr(t, e) {
  e.debug("@opentelemetry/api: Unregistering a global for " + t + " v" + Ne + ".");
  var n = Gt[Lt];
  n && delete n[t];
}
var Lc = function(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var a = n.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (n = a.return) && n.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Gc = function(t, e, n) {
  if (n || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, Fc = (
  /** @class */
  function() {
    function t(e) {
      this._namespace = e.namespace || "DiagComponentLogger";
    }
    return t.prototype.debug = function() {
      for (var e = [], n = 0; n < arguments.length; n++)
        e[n] = arguments[n];
      return ht("debug", this._namespace, e);
    }, t.prototype.error = function() {
      for (var e = [], n = 0; n < arguments.length; n++)
        e[n] = arguments[n];
      return ht("error", this._namespace, e);
    }, t.prototype.info = function() {
      for (var e = [], n = 0; n < arguments.length; n++)
        e[n] = arguments[n];
      return ht("info", this._namespace, e);
    }, t.prototype.warn = function() {
      for (var e = [], n = 0; n < arguments.length; n++)
        e[n] = arguments[n];
      return ht("warn", this._namespace, e);
    }, t.prototype.verbose = function() {
      for (var e = [], n = 0; n < arguments.length; n++)
        e[n] = arguments[n];
      return ht("verbose", this._namespace, e);
    }, t;
  }()
);
function ht(t, e, n) {
  var a = st("diag");
  if (a)
    return n.unshift(e), a[t].apply(a, Gc([], Lc(n), !1));
}
var W;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.ERROR = 30] = "ERROR", t[t.WARN = 50] = "WARN", t[t.INFO = 60] = "INFO", t[t.DEBUG = 70] = "DEBUG", t[t.VERBOSE = 80] = "VERBOSE", t[t.ALL = 9999] = "ALL";
})(W || (W = {}));
function Kc(t, e) {
  t < W.NONE ? t = W.NONE : t > W.ALL && (t = W.ALL), e = e || {};
  function n(a, s) {
    var i = e[a];
    return typeof i == "function" && t >= s ? i.bind(e) : function() {
    };
  }
  return {
    error: n("error", W.ERROR),
    warn: n("warn", W.WARN),
    info: n("info", W.INFO),
    debug: n("debug", W.DEBUG),
    verbose: n("verbose", W.VERBOSE)
  };
}
var Bc = function(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var a = n.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (n = a.return) && n.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Vc = function(t, e, n) {
  if (n || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, Zc = "diag", Ge = (
  /** @class */
  function() {
    function t() {
      function e(s) {
        return function() {
          for (var i = [], o = 0; o < arguments.length; o++)
            i[o] = arguments[o];
          var c = st("diag");
          if (c)
            return c[s].apply(c, Vc([], Bc(i), !1));
        };
      }
      var n = this, a = function(s, i) {
        var o, c, u;
        if (i === void 0 && (i = { logLevel: W.INFO }), s === n) {
          var l = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return n.error((o = l.stack) !== null && o !== void 0 ? o : l.message), !1;
        }
        typeof i == "number" && (i = {
          logLevel: i
        });
        var d = st("diag"), E = Kc((c = i.logLevel) !== null && c !== void 0 ? c : W.INFO, s);
        if (d && !i.suppressOverrideMessage) {
          var g = (u = new Error().stack) !== null && u !== void 0 ? u : "<failed to generate stacktrace>";
          d.warn("Current logger will be overwritten from " + g), E.warn("Current logger will overwrite one already registered from " + g);
        }
        return Gr("diag", E, n, !0);
      };
      n.setLogger = a, n.disable = function() {
        Fr(Zc, n);
      }, n.createComponentLogger = function(s) {
        return new Fc(s);
      }, n.verbose = e("verbose"), n.debug = e("debug"), n.info = e("info"), n.warn = e("warn"), n.error = e("error");
    }
    return t.instance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t;
  }()
), Wc = function(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var a = n.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (n = a.return) && n.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Hc = function(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, n = e && t[e], a = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && a >= t.length && (t = void 0), { value: t && t[a++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Yc = (
  /** @class */
  function() {
    function t(e) {
      this._entries = e ? new Map(e) : /* @__PURE__ */ new Map();
    }
    return t.prototype.getEntry = function(e) {
      var n = this._entries.get(e);
      if (n)
        return Object.assign({}, n);
    }, t.prototype.getAllEntries = function() {
      return Array.from(this._entries.entries()).map(function(e) {
        var n = Wc(e, 2), a = n[0], s = n[1];
        return [a, s];
      });
    }, t.prototype.setEntry = function(e, n) {
      var a = new t(this._entries);
      return a._entries.set(e, n), a;
    }, t.prototype.removeEntry = function(e) {
      var n = new t(this._entries);
      return n._entries.delete(e), n;
    }, t.prototype.removeEntries = function() {
      for (var e, n, a = [], s = 0; s < arguments.length; s++)
        a[s] = arguments[s];
      var i = new t(this._entries);
      try {
        for (var o = Hc(a), c = o.next(); !c.done; c = o.next()) {
          var u = c.value;
          i._entries.delete(u);
        }
      } catch (l) {
        e = { error: l };
      } finally {
        try {
          c && !c.done && (n = o.return) && n.call(o);
        } finally {
          if (e) throw e.error;
        }
      }
      return i;
    }, t.prototype.clear = function() {
      return new t();
    }, t;
  }()
);
Ge.instance();
function zc(t) {
  return t === void 0 && (t = {}), new Yc(new Map(Object.entries(t)));
}
function _s(t) {
  return Symbol.for(t);
}
var Jc = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e) {
      var n = this;
      n._currentContext = e ? new Map(e) : /* @__PURE__ */ new Map(), n.getValue = function(a) {
        return n._currentContext.get(a);
      }, n.setValue = function(a, s) {
        var i = new t(n._currentContext);
        return i._currentContext.set(a, s), i;
      }, n.deleteValue = function(a) {
        var s = new t(n._currentContext);
        return s._currentContext.delete(a), s;
      };
    }
    return t;
  }()
), qc = new Jc(), Xc = {
  get: function(t, e) {
    if (t != null)
      return t[e];
  },
  keys: function(t) {
    return t == null ? [] : Object.keys(t);
  }
}, Qc = {
  set: function(t, e, n) {
    t != null && (t[e] = n);
  }
}, eu = function(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var a = n.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (n = a.return) && n.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, tu = function(t, e, n) {
  if (n || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, ru = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.active = function() {
      return qc;
    }, t.prototype.with = function(e, n, a) {
      for (var s = [], i = 3; i < arguments.length; i++)
        s[i - 3] = arguments[i];
      return n.call.apply(n, tu([a], eu(s), !1));
    }, t.prototype.bind = function(e, n) {
      return n;
    }, t.prototype.enable = function() {
      return this;
    }, t.prototype.disable = function() {
      return this;
    }, t;
  }()
), nu = function(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var a = n.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (n = a.return) && n.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, au = function(t, e, n) {
  if (n || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, Yr = "context", su = new ru(), Kr = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalContextManager = function(e) {
      return Gr(Yr, e, Ge.instance());
    }, t.prototype.active = function() {
      return this._getContextManager().active();
    }, t.prototype.with = function(e, n, a) {
      for (var s, i = [], o = 3; o < arguments.length; o++)
        i[o - 3] = arguments[o];
      return (s = this._getContextManager()).with.apply(s, au([e, n, a], nu(i), !1));
    }, t.prototype.bind = function(e, n) {
      return this._getContextManager().bind(e, n);
    }, t.prototype._getContextManager = function() {
      return st(Yr) || su;
    }, t.prototype.disable = function() {
      this._getContextManager().disable(), Fr(Yr, Ge.instance());
    }, t;
  }()
), pn;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.SAMPLED = 1] = "SAMPLED";
})(pn || (pn = {}));
var vs = "0000000000000000", bs = "00000000000000000000000000000000", iu = {
  traceId: bs,
  spanId: vs,
  traceFlags: pn.NONE
}, Tt = (
  /** @class */
  function() {
    function t(e) {
      e === void 0 && (e = iu), this._spanContext = e;
    }
    return t.prototype.spanContext = function() {
      return this._spanContext;
    }, t.prototype.setAttribute = function(e, n) {
      return this;
    }, t.prototype.setAttributes = function(e) {
      return this;
    }, t.prototype.addEvent = function(e, n) {
      return this;
    }, t.prototype.addLink = function(e) {
      return this;
    }, t.prototype.addLinks = function(e) {
      return this;
    }, t.prototype.setStatus = function(e) {
      return this;
    }, t.prototype.updateName = function(e) {
      return this;
    }, t.prototype.end = function(e) {
    }, t.prototype.isRecording = function() {
      return !1;
    }, t.prototype.recordException = function(e, n) {
    }, t;
  }()
), Gn = _s("OpenTelemetry Context Key SPAN");
function Fn(t) {
  return t.getValue(Gn) || void 0;
}
function ou() {
  return Fn(Kr.getInstance().active());
}
function Kn(t, e) {
  return t.setValue(Gn, e);
}
function cu(t) {
  return t.deleteValue(Gn);
}
function uu(t, e) {
  return Kn(t, new Tt(e));
}
function Es(t) {
  var e;
  return (e = Fn(t)) === null || e === void 0 ? void 0 : e.spanContext();
}
var lu = /^([0-9a-f]{32})$/i, du = /^[0-9a-f]{16}$/i;
function fu(t) {
  return lu.test(t) && t !== bs;
}
function hu(t) {
  return du.test(t) && t !== vs;
}
function Ts(t) {
  return fu(t.traceId) && hu(t.spanId);
}
function pu(t) {
  return new Tt(t);
}
var zr = Kr.getInstance(), Rs = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.startSpan = function(e, n, a) {
      a === void 0 && (a = zr.active());
      var s = !!(n != null && n.root);
      if (s)
        return new Tt();
      var i = a && Es(a);
      return gu(i) && Ts(i) ? new Tt(i) : new Tt();
    }, t.prototype.startActiveSpan = function(e, n, a, s) {
      var i, o, c;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? c = n : arguments.length === 3 ? (i = n, c = a) : (i = n, o = a, c = s);
        var u = o ?? zr.active(), l = this.startSpan(e, i, u), d = Kn(u, l);
        return zr.with(d, c, void 0, l);
      }
    }, t;
  }()
);
function gu(t) {
  return typeof t == "object" && typeof t.spanId == "string" && typeof t.traceId == "string" && typeof t.traceFlags == "number";
}
var mu = new Rs(), yu = (
  /** @class */
  function() {
    function t(e, n, a, s) {
      this._provider = e, this.name = n, this.version = a, this.options = s;
    }
    return t.prototype.startSpan = function(e, n, a) {
      return this._getTracer().startSpan(e, n, a);
    }, t.prototype.startActiveSpan = function(e, n, a, s) {
      var i = this._getTracer();
      return Reflect.apply(i.startActiveSpan, i, arguments);
    }, t.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var e = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return e ? (this._delegate = e, this._delegate) : mu;
    }, t;
  }()
), _u = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, n, a) {
      return new Rs();
    }, t;
  }()
), vu = new _u(), fa = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, n, a) {
      var s;
      return (s = this.getDelegateTracer(e, n, a)) !== null && s !== void 0 ? s : new yu(this, e, n, a);
    }, t.prototype.getDelegate = function() {
      var e;
      return (e = this._delegate) !== null && e !== void 0 ? e : vu;
    }, t.prototype.setDelegate = function(e) {
      this._delegate = e;
    }, t.prototype.getDelegateTracer = function(e, n, a) {
      var s;
      return (s = this._delegate) === null || s === void 0 ? void 0 : s.getTracer(e, n, a);
    }, t;
  }()
), Ft;
(function(t) {
  t[t.INTERNAL = 0] = "INTERNAL", t[t.SERVER = 1] = "SERVER", t[t.CLIENT = 2] = "CLIENT", t[t.PRODUCER = 3] = "PRODUCER", t[t.CONSUMER = 4] = "CONSUMER";
})(Ft || (Ft = {}));
var mr;
(function(t) {
  t[t.UNSET = 0] = "UNSET", t[t.OK = 1] = "OK", t[t.ERROR = 2] = "ERROR";
})(mr || (mr = {}));
var nr = Kr.getInstance(), bu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.inject = function(e, n) {
    }, t.prototype.extract = function(e, n) {
      return e;
    }, t.prototype.fields = function() {
      return [];
    }, t;
  }()
), Bn = _s("OpenTelemetry Baggage Key");
function Ss(t) {
  return t.getValue(Bn) || void 0;
}
function Eu() {
  return Ss(Kr.getInstance().active());
}
function Tu(t, e) {
  return t.setValue(Bn, e);
}
function Ru(t) {
  return t.deleteValue(Bn);
}
var Jr = "propagation", Su = new bu(), Au = (
  /** @class */
  function() {
    function t() {
      this.createBaggage = zc, this.getBaggage = Ss, this.getActiveBaggage = Eu, this.setBaggage = Tu, this.deleteBaggage = Ru;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalPropagator = function(e) {
      return Gr(Jr, e, Ge.instance());
    }, t.prototype.inject = function(e, n, a) {
      return a === void 0 && (a = Qc), this._getGlobalPropagator().inject(e, n, a);
    }, t.prototype.extract = function(e, n, a) {
      return a === void 0 && (a = Xc), this._getGlobalPropagator().extract(e, n, a);
    }, t.prototype.fields = function() {
      return this._getGlobalPropagator().fields();
    }, t.prototype.disable = function() {
      Fr(Jr, Ge.instance());
    }, t.prototype._getGlobalPropagator = function() {
      return st(Jr) || Su;
    }, t;
  }()
), As = Au.getInstance(), qr = "trace", wu = (
  /** @class */
  function() {
    function t() {
      this._proxyTracerProvider = new fa(), this.wrapSpanContext = pu, this.isSpanContextValid = Ts, this.deleteSpan = cu, this.getSpan = Fn, this.getActiveSpan = ou, this.getSpanContext = Es, this.setSpan = Kn, this.setSpanContext = uu;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalTracerProvider = function(e) {
      var n = Gr(qr, this._proxyTracerProvider, Ge.instance());
      return n && this._proxyTracerProvider.setDelegate(e), n;
    }, t.prototype.getTracerProvider = function() {
      return st(qr) || this._proxyTracerProvider;
    }, t.prototype.getTracer = function(e, n) {
      return this.getTracerProvider().getTracer(e, n);
    }, t.prototype.disable = function() {
      Fr(qr, Ge.instance()), this._proxyTracerProvider = new fa();
    }, t;
  }()
), Iu = wu.getInstance();
const Xr = "$@null((", ku = "$@circular((";
function gn(t, e, n = /* @__PURE__ */ new WeakSet()) {
  const a = {};
  if (t === void 0)
    return a;
  if (t === null)
    return a[e || ""] = Xr, a;
  if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
    return a[e || ""] = t, a;
  if (t instanceof Date)
    return a[e || ""] = t.toISOString(), a;
  if (t !== null && typeof t == "object" && n.has(t))
    return a[e || ""] = ku, a;
  t !== null && typeof t == "object" && n.add(t);
  for (const [s, i] of Object.entries(t)) {
    const o = `${e ? `${e}.` : ""}${Array.isArray(t) ? `[${s}]` : s}`;
    if (Array.isArray(i))
      for (let c = 0; c < i.length; c++)
        typeof i[c] == "object" && i[c] !== null ? Object.assign(a, gn(i[c], `${o}.[${c}]`, n)) : i[c] === null ? a[`${o}.[${c}]`] = Xr : a[`${o}.[${c}]`] = i[c];
    else xu(i) ? Object.assign(a, gn(i, o, n)) : typeof i == "number" || typeof i == "string" || typeof i == "boolean" ? a[o] = i : i === null && (a[o] = Xr);
  }
  return a;
}
function xu(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function Kt(t) {
  return gn(t, w.STYLE_ACCESSORY);
}
class Nu {
  constructor(e, n, a) {
    _(this, "pageFetcher");
    _(this, "data");
    _(this, "pagination");
    this.pageFetcher = a, this.data = e, this.pagination = n;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return !!this.pagination.next;
  }
  hasPreviousPage() {
    return !!this.pagination.previous;
  }
  getNextPage() {
    if (!this.pagination.next)
      throw new Error("No next page available");
    return this.pageFetcher({ after: this.pagination.next });
  }
  getPreviousPage() {
    if (!this.pagination.previous)
      throw new Error("No previous page available");
    return this.pageFetcher({ before: this.pagination.previous });
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[Symbol.asyncIterator]() {
    for await (const e of this.iterPages())
      for (const n of e.getPaginatedItems())
        yield n;
  }
}
class Ou {
  constructor(e, n, a) {
    _(this, "pageFetcher");
    _(this, "data");
    _(this, "pagination");
    this.pageFetcher = a, this.data = e, this.pagination = n;
  }
  getPaginatedItems() {
    return this.data ?? [];
  }
  hasNextPage() {
    return this.pagination.currentPage < this.pagination.totalPages;
  }
  hasPreviousPage() {
    return this.pagination.currentPage > 1;
  }
  getNextPage() {
    if (!this.hasNextPage())
      throw new Error("No next page available");
    return this.pageFetcher({
      page: this.pagination.currentPage + 1
    });
  }
  getPreviousPage() {
    if (!this.hasPreviousPage())
      throw new Error("No previous page available");
    return this.pageFetcher({
      page: this.pagination.currentPage - 1
    });
  }
  async *iterPages() {
    let e = this;
    for (yield e; e.hasNextPage(); )
      e = await e.getNextPage(), yield e;
  }
  async *[Symbol.asyncIterator]() {
    for await (const e of this.iterPages())
      for (const n of e.getPaginatedItems())
        yield n;
  }
}
const ws = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !1
};
function M(t, e, n, a) {
  return new Zn(Vn(t, e, n, a));
}
function mn(t, e, n, a, s) {
  const i = new URLSearchParams(n.query);
  n.limit && i.set("page[size]", String(n.limit)), n.after && i.set("page[after]", n.after), n.before && i.set("page[before]", n.before);
  const o = r.object({
    data: r.array(t),
    pagination: r.object({
      next: r.string().optional(),
      previous: r.string().optional()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = Vn(o, c.href, a, s);
  return new $u(u, t, e, n, a, s);
}
function Is(t, e, n, a, s) {
  const i = new URLSearchParams(n.query);
  n.limit && i.set("perPage", String(n.limit)), n.page && i.set("page", String(n.page));
  const o = r.object({
    data: r.array(t),
    pagination: r.object({
      currentPage: r.coerce.number(),
      totalPages: r.coerce.number(),
      count: r.coerce.number()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = Vn(o, c.href, a, s);
  return new Lu(u, t, e, n, a, s);
}
async function Cu(t, e) {
  var i, o, c;
  if (!((i = t.options) != null && i.tracer))
    return e();
  const n = new URL(t.url), a = ((o = t.requestInit) == null ? void 0 : o.method) ?? "GET", s = t.options.name ?? `${a} ${n.pathname}`;
  return await t.options.tracer.startActiveSpan(s, async (u) => await e(u), {
    attributes: {
      [w.STYLE_ICON]: ((c = t.options) == null ? void 0 : c.icon) ?? "api",
      ...t.options.attributes
    }
  });
}
async function Vn(t, e, n, a) {
  let s = await n;
  return Cu({ url: e, requestInit: s, options: a }, async (i) => {
    s = Gu(s);
    const o = await yn(t, e, s, a);
    return a != null && a.onResponseBody && i && a.onResponseBody(o.data, i), o;
  });
}
async function yn(t, e, n, a, s = 1) {
  try {
    const i = await fetch(e, Du(n)), o = Uu(i.headers);
    if (!i.ok) {
      const d = ju(i, s, a == null ? void 0 : a.retry);
      if (d.retry)
        return await pa(e, s + 1, d.delay, a, n, i), await yn(t, e, n, a, s + 1);
      {
        const E = await i.text().catch((p) => ha(p).message), g = Mu(E), f = g ? void 0 : E;
        throw K.generate(i.status, g, f, o);
      }
    }
    const c = await Pu(i), u = t.safeParse(c);
    if (u.success)
      return { data: u.data, response: i };
    const l = Sc(u.error);
    throw new Pc({
      status: i.status,
      cause: l,
      message: l.message,
      rawBody: c,
      headers: o
    });
  } catch (i) {
    if (i instanceof K)
      throw i;
    if (a != null && a.retry) {
      const o = { ...ws, ...a.retry }, c = ms(o, s);
      if (c)
        return await pa(e, s + 1, c, a, n), await yn(t, e, n, a, s + 1);
    }
    throw new ys({ cause: ha(i) });
  }
}
async function Pu(t) {
  try {
    return await t.clone().json();
  } catch {
    return;
  }
}
function ha(t) {
  return t instanceof Error ? t : new Error(t);
}
function ju(t, e, n) {
  function a() {
    const i = { ...ws, ...n }, o = ms(i, e);
    return o ? { retry: !0, delay: o } : { retry: !1 };
  }
  const s = t.headers.get("x-should-retry");
  if (s === "true")
    return a();
  if (s === "false")
    return { retry: !1 };
  if (t.status === 408 || t.status === 409)
    return a();
  if (t.status === 429) {
    if (e >= (typeof (n == null ? void 0 : n.maxAttempts) == "number" ? n == null ? void 0 : n.maxAttempts : 3))
      return { retry: !1 };
    const i = t.headers.get("x-ratelimit-reset");
    if (i) {
      const c = parseInt(i, 10) - Date.now() + Math.floor(Math.random() * 1e3);
      if (c > 0)
        return { retry: !0, delay: c };
    }
    return a();
  }
  return t.status >= 500 ? a() : { retry: !1 };
}
function Mu(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function Uu(t) {
  return new Proxy(Object.fromEntries(
    // @ts-ignore
    t.entries()
  ), {
    get(e, n) {
      const a = n.toString();
      return e[a.toLowerCase()] || e[a];
    }
  });
}
function Du(t) {
  try {
    const e = {
      ...t,
      cache: "no-cache"
    }, n = new Request("http://localhost", e);
    return e;
  } catch {
    return t ?? {};
  }
}
class Zn extends Promise {
  constructor(n) {
    super((a) => {
      a(null);
    });
    _(this, "responsePromise");
    this.responsePromise = n;
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   */
  asResponse() {
    return this.responsePromise.then((n) => n.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   */
  async withResponse() {
    const [n, a] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: n, response: a };
  }
  parse() {
    return this.responsePromise.then((n) => n.data);
  }
  then(n, a) {
    return this.parse().then(n, a);
  }
  catch(n) {
    return this.parse().catch(n);
  }
  finally(n) {
    return this.parse().finally(n);
  }
}
var Ir, ks;
class $u extends Zn {
  constructor(n, a, s, i, o, c) {
    super(n.then((u) => ({
      data: new Nu(u.data.data, u.data.pagination, y(this, Ir, ks).bind(this)),
      response: u.response
    })));
    G(this, Ir);
    _(this, "schema");
    _(this, "url");
    _(this, "params");
    _(this, "requestInit");
    _(this, "options");
    this.schema = a, this.url = s, this.params = i, this.requestInit = o, this.options = c;
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const n = await this;
    for await (const a of n)
      yield a;
  }
}
Ir = new WeakSet(), ks = function(n) {
  return mn(this.schema, this.url, { ...this.params, ...n }, this.requestInit, this.options);
};
var kr, xs;
class Lu extends Zn {
  constructor(n, a, s, i, o, c) {
    super(n.then((u) => ({
      data: new Ou(u.data.data, u.data.pagination, y(this, kr, xs).bind(this)),
      response: u.response
    })));
    G(this, kr);
    _(this, "schema");
    _(this, "url");
    _(this, "params");
    _(this, "requestInit");
    _(this, "options");
    this.schema = a, this.url = s, this.params = i, this.requestInit = o, this.options = c;
  }
  /**
   * Allow auto-paginating iteration on an unawaited list call, eg:
   *
   *    for await (const item of client.items.list()) {
   *      console.log(item)
   *    }
   */
  async *[Symbol.asyncIterator]() {
    const n = await this;
    for await (const a of n)
      yield a;
  }
}
kr = new WeakSet(), xs = function(n) {
  return Is(this.schema, this.url, { ...this.params, ...n }, this.requestInit, this.options);
};
async function pa(t, e, n, a, s, i) {
  if (a != null && a.tracer) {
    const o = (s == null ? void 0 : s.method) ?? "GET";
    return a.tracer.startActiveSpan(i ? `wait after ${i.status}` : "wait after error", async (c) => {
      await new Promise((u) => setTimeout(u, n));
    }, {
      attributes: {
        [w.STYLE_ICON]: "wait",
        ...Kt({
          items: [
            {
              text: `retrying ${(a == null ? void 0 : a.name) ?? o.toUpperCase()} in ${n}ms`,
              variant: "normal"
            }
          ],
          style: "codepath"
        })
      }
    });
  }
  await new Promise((o) => setTimeout(o, n));
}
function Gu(t) {
  const e = new Headers(t == null ? void 0 : t.headers);
  if (e.get("x-trigger-worker") !== "true")
    return t;
  const n = Object.fromEntries(e.entries());
  return As.inject(nr.active(), n), {
    ...t,
    headers: new Headers(n)
  };
}
var Fu = Object.defineProperty, Ku = (t, e, n) => e in t ? Fu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Xt = (t, e, n) => Ku(t, typeof e != "symbol" ? e + "" : e, n);
class ga extends Error {
  constructor(e, n) {
    super(e), Xt(this, "type"), Xt(this, "field"), Xt(this, "value"), Xt(this, "line"), this.name = "ParseError", this.type = n.type, this.field = n.field, this.value = n.value, this.line = n.line;
  }
}
function Qr(t) {
}
function Bu(t) {
  const { onEvent: e = Qr, onError: n = Qr, onRetry: a = Qr, onComment: s } = t;
  let i = "", o = !0, c, u = "", l = "";
  function d(b) {
    const N = o ? b.replace(/^\xEF\xBB\xBF/, "") : b, [$, Z] = Vu(`${i}${N}`);
    for (const ie of $)
      E(ie);
    i = Z, o = !1;
  }
  function E(b) {
    if (b === "") {
      f();
      return;
    }
    if (b.startsWith(":")) {
      s && s(b.slice(b.startsWith(": ") ? 2 : 1));
      return;
    }
    const N = b.indexOf(":");
    if (N !== -1) {
      const $ = b.slice(0, N), Z = b[N + 1] === " " ? 2 : 1, ie = b.slice(N + Z);
      g($, ie, b);
      return;
    }
    g(b, "", b);
  }
  function g(b, N, $) {
    switch (b) {
      case "event":
        l = N;
        break;
      case "data":
        u = `${u}${N}
`;
        break;
      case "id":
        c = N.includes("\0") ? void 0 : N;
        break;
      case "retry":
        /^\d+$/.test(N) ? a(parseInt(N, 10)) : n(
          new ga(`Invalid \`retry\` value: "${N}"`, {
            type: "invalid-retry",
            value: N,
            line: $
          })
        );
        break;
      default:
        n(
          new ga(
            `Unknown field "${b.length > 20 ? `${b.slice(0, 20)}…` : b}"`,
            { type: "unknown-field", field: b, value: N, line: $ }
          )
        );
        break;
    }
  }
  function f() {
    u.length > 0 && e({
      id: c,
      event: l || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: u.endsWith(`
`) ? u.slice(0, -1) : u
    }), c = void 0, u = "", l = "";
  }
  function p(b = {}) {
    i && b.consume && E(i), c = void 0, u = "", l = "", i = "";
  }
  return { feed: d, reset: p };
}
function Vu(t) {
  const e = [];
  let n = "";
  const a = t.length;
  for (let s = 0; s < a; s++) {
    const i = t[s];
    i === "\r" && t[s + 1] === `
` ? (e.push(n), n = "", s++) : i === "\r" || i === `
` ? (e.push(n), n = "") : n += i;
  }
  return [e, n];
}
class Zu extends TransformStream {
  constructor({ onError: e, onRetry: n, onComment: a } = {}) {
    let s;
    super({
      start(i) {
        s = Bu({
          onEvent: (o) => {
            i.enqueue(o);
          },
          onError(o) {
            e === "terminate" ? i.error(o) : typeof e == "function" && e(o);
          },
          onRetry: n,
          onComment: a
        });
      },
      transform(i) {
        s.feed(i);
      }
    });
  }
}
const pt = {
  docs: {
    config: {
      home: "https://trigger.dev/docs/config/config-file",
      additionalPackages: "https://trigger.dev/docs/config/config-file#additionalpackages",
      extensions: "https://trigger.dev/docs/config/config-file#extensions",
      prisma: "https://trigger.dev/docs/config/config-file#prisma"
    },
    machines: {
      home: "https://trigger.dev/docs/v3/machines"
    },
    upgrade: {
      beta: "https://trigger.dev/docs/upgrading-beta"
    }
  },
  site: {
    home: "https://trigger.dev",
    contact: "https://trigger.dev/contact"
  }
};
function Wu(t) {
  switch (t.type) {
    case "BUILT_IN_ERROR": {
      const e = new Error(t.message);
      return e.name = t.name, e.stack = t.stackTrace, e;
    }
    case "STRING_ERROR":
      return t.raw;
    case "CUSTOM_ERROR":
      return JSON.parse(t.raw);
    case "INTERNAL_ERROR": {
      const e = new Error(t.message ?? `Internal error (${t.code})`);
      return e.name = t.code, e.stack = t.stackTrace, e;
    }
  }
}
function Hu(t) {
  const e = zu(t);
  switch (e.type) {
    case "BUILT_IN_ERROR":
      return {
        name: e.name,
        message: e.message,
        stackTrace: e.stackTrace
      };
    case "STRING_ERROR":
      return {
        message: e.raw
      };
    case "CUSTOM_ERROR":
      return {
        message: e.raw
      };
    case "INTERNAL_ERROR":
      return {
        message: `trigger.dev internal error (${e.code})`
      };
  }
}
const Yu = {
  TASK_PROCESS_OOM_KILLED: {
    message: "Your task ran out of memory. Try increasing the machine specs. If this doesn't fix it there might be a memory leak.",
    link: {
      name: "Machines",
      href: pt.docs.machines.home
    }
  },
  TASK_PROCESS_MAYBE_OOM_KILLED: {
    message: "We think your task ran out of memory, but we can't be certain. If this keeps happening, try increasing the machine specs.",
    link: {
      name: "Machines",
      href: pt.docs.machines.home
    }
  },
  TASK_PROCESS_SIGSEGV: {
    message: "Your task crashed with a segmentation fault (SIGSEGV). Most likely there's a bug in a package or binary you're using. If this keeps happening and you're unsure why, please get in touch.",
    link: {
      name: "Contact us",
      href: pt.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  TASK_PROCESS_SIGTERM: {
    message: "Your task exited after receiving SIGTERM but we don't know why. If this keeps happening, please get in touch so we can investigate.",
    link: {
      name: "Contact us",
      href: pt.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  OUTDATED_SDK_VERSION: {
    message: "Your task is using an outdated version of the SDK. Please upgrade to the latest version.",
    link: {
      name: "Beta upgrade guide",
      href: pt.docs.upgrade.beta
    }
  }
}, Q = (t) => ({
  type: "INTERNAL_ERROR",
  code: t,
  ...Yu[t]
}), ma = (t, e = 100) => {
  if (!t)
    return;
  const n = e ? t.slice(0, e) : t;
  return n.includes("SIGTERM") ? "SIGTERM" : n.includes("SIGSEGV") ? "SIGSEGV" : n.includes("SIGKILL") ? "SIGKILL" : void 0;
};
function zu(t) {
  switch (t.type) {
    case "BUILT_IN_ERROR": {
      if (t.name === "UnexpectedExitError" && t.message.startsWith("Unexpected exit with code -1"))
        switch (ma(t.stackTrace)) {
          case "SIGTERM":
            return {
              ...Q("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...Q("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...Q("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...Q("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: t.message,
              stackTrace: t.stackTrace
            };
        }
      if (t.name === "Error" && t.message === "ffmpeg was killed with signal SIGKILL")
        return {
          ...Q("TASK_PROCESS_OOM_KILLED")
        };
      break;
    }
    case "STRING_ERROR":
      break;
    case "CUSTOM_ERROR":
      break;
    case "INTERNAL_ERROR": {
      if (t.code === Ka.TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE)
        switch (ma(t.message)) {
          case "SIGTERM":
            return {
              ...Q("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...Q("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...Q("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...Q("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: t.message,
              stackTrace: t.stackTrace
            };
        }
      return {
        ...t,
        ...Q(t.code)
      };
    }
  }
  return t;
}
function Oe(t, e) {
  return typeof process < "u" && typeof process.env == "object" && process.env !== null ? process.env[t] ?? e : e;
}
const gt = "api-client";
class Ju extends Error {
  constructor(e) {
    super(e), this.name = "ApiClientMissingError";
  }
}
var et, ar;
const xr = class xr {
  constructor() {
    G(this, et);
  }
  static getInstance() {
    return this._instance || (this._instance = new xr()), this._instance;
  }
  disable() {
    Ke(gt);
  }
  get baseURL() {
    const e = y(this, et, ar).call(this);
    return (e == null ? void 0 : e.baseURL) ?? Oe("TRIGGER_API_URL") ?? "https://api.trigger.dev";
  }
  get accessToken() {
    const e = y(this, et, ar).call(this);
    return (e == null ? void 0 : e.secretKey) ?? (e == null ? void 0 : e.accessToken) ?? Oe("TRIGGER_SECRET_KEY") ?? Oe("TRIGGER_ACCESS_TOKEN");
  }
  get client() {
    if (!(!this.baseURL || !this.accessToken))
      return new Ta(this.baseURL, this.accessToken);
  }
  clientOrThrow() {
    if (!this.baseURL || !this.accessToken)
      throw new Ju(this.apiClientMissingError());
    return new Ta(this.baseURL, this.accessToken);
  }
  runWithConfig(e, n) {
    const a = y(this, et, ar).call(this), s = { ...a, ...e };
    return ne(gt, s, !0), n().finally(() => {
      ne(gt, a, !0);
    });
  }
  setGlobalAPIClientConfiguration(e) {
    return ne(gt, e);
  }
  apiClientMissingError() {
    const e = !!this.baseURL, n = !!this.accessToken;
    if (!e && !n)
      return "You need to set the TRIGGER_API_URL and TRIGGER_SECRET_KEY environment variables. See https://trigger.dev/docs/management/overview#authentication";
    if (e) {
      if (!n)
        return "You need to set the TRIGGER_SECRET_KEY environment variable. See https://trigger.dev/docs/management/overview#authentication";
    } else return "You need to set the TRIGGER_API_URL environment variable. See https://trigger.dev/docs/management/overview#authentication";
    return "Unknown error";
  }
};
et = new WeakSet(), ar = function() {
  return Ie(gt);
}, _(xr, "_instance");
let _n = xr;
const Jt = _n.getInstance();
async function Wn(t, e) {
  if (t.data)
    switch (t.dataType) {
      case "application/json":
        return JSON.parse(t.data, void 0);
      case "application/super+json":
        const { parse: n } = await Os();
        return n(t.data);
      case "text/plain":
        return t.data;
      case "application/store":
        throw new Error(`Cannot parse an application/store packet (${t.data}). Needs to be imported first.`);
      default:
        return t.data;
    }
}
async function qu(t, e) {
  const n = await Ns(t, void 0, e);
  return await Wn(n);
}
async function Br(t) {
  if (t === void 0)
    return { dataType: "application/json" };
  if (typeof t == "string")
    return { data: t, dataType: "text/plain" };
  try {
    const { stringify: e } = await Os();
    return { data: e(t), dataType: "application/super+json" };
  } catch {
    return { data: t, dataType: "application/json" };
  }
}
const Xu = {
  minTimeoutInMs: 500,
  maxTimeoutInMs: 5e3,
  maxAttempts: 5,
  factor: 2,
  randomize: !0
};
async function Ns(t, e, n) {
  return t.dataType !== "application/store" ? t : e ? await e.startActiveSpan("store.downloadPayload", async (s) => await ya(t, s, n), {
    attributes: {
      [w.STYLE_ICON]: "cloud-download"
    }
  }) ?? t : await ya(t, void 0, n);
}
async function ya(t, e, n) {
  if (!t.data)
    return t;
  const a = n ?? Jt.client;
  if (!a)
    return t;
  const s = await a.getPayloadUrl(t.data), i = await M(r.any(), s.presignedUrl, void 0, {
    retry: Xu
  }).asResponse();
  if (!i.ok)
    throw new Error(`Failed to import packet ${s.presignedUrl}: ${i.statusText}`);
  const o = await i.text();
  return e == null || e.setAttribute("size", Buffer.byteLength(o, "utf8")), {
    data: o,
    dataType: i.headers.get("content-type") ?? "application/json"
  };
}
async function Os() {
  const t = await import("./index-BycWwh12.js");
  return t.registerCustom({
    isApplicable: (e) => typeof Buffer == "function" && Buffer.isBuffer(e),
    serialize: (e) => [...e],
    deserialize: (e) => Buffer.from(e)
  }, "buffer"), t;
}
var Qu = Object.defineProperty, el = Object.defineProperties, tl = Object.getOwnPropertyDescriptors, yr = Object.getOwnPropertySymbols, Cs = Object.prototype.hasOwnProperty, Ps = Object.prototype.propertyIsEnumerable, js = (t) => {
  throw TypeError(t);
}, _a = (t, e, n) => e in t ? Qu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, it = (t, e) => {
  for (var n in e || (e = {}))
    Cs.call(e, n) && _a(t, n, e[n]);
  if (yr)
    for (var n of yr(e))
      Ps.call(e, n) && _a(t, n, e[n]);
  return t;
}, Ms = (t, e) => el(t, tl(e)), rl = (t, e) => {
  var n = {};
  for (var a in t)
    Cs.call(t, a) && e.indexOf(a) < 0 && (n[a] = t[a]);
  if (t != null && yr)
    for (var a of yr(t))
      e.indexOf(a) < 0 && Ps.call(t, a) && (n[a] = t[a]);
  return n;
}, Hn = (t, e, n) => e.has(t) || js("Cannot " + n), k = (t, e, n) => (Hn(t, e, "read from private field"), n ? n.call(t) : e.get(t)), L = (t, e, n) => e.has(t) ? js("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), j = (t, e, n, a) => (Hn(t, e, "write to private field"), e.set(t, n), n), te = (t, e, n) => (Hn(t, e, "access private method"), n), Fe = (t, e, n) => new Promise((a, s) => {
  var i = (u) => {
    try {
      c(n.next(u));
    } catch (l) {
      s(l);
    }
  }, o = (u) => {
    try {
      c(n.throw(u));
    } catch (l) {
      s(l);
    }
  }, c = (u) => u.done ? a(u.value) : Promise.resolve(u.value).then(i, o);
  c((n = n.apply(t, e)).next());
}), _r = class Us extends Error {
  constructor(e, n, a, s, i, o) {
    super(
      o || `HTTP Error ${e} at ${i}: ${n ?? JSON.stringify(a)}`
    ), this.url = i, this.name = "FetchError", this.status = e, this.text = n, this.json = a, this.headers = s;
  }
  static fromResponse(e, n) {
    return Fe(this, null, function* () {
      const a = e.status, s = Object.fromEntries([...e.headers.entries()]);
      let i, o;
      const c = e.headers.get("content-type");
      return c && c.includes("application/json") ? o = yield e.json() : i = yield e.text(), new Us(a, i, o, s, n);
    });
  }
}, Ds = class extends Error {
  constructor() {
    super("Fetch with backoff aborted"), this.name = "FetchBackoffAbortError";
  }
}, nl = class extends Error {
  constructor() {
    super("Invalid shape options: missing required url parameter"), this.name = "MissingShapeUrlError";
  }
}, al = class extends Error {
  constructor() {
    super("Invalid signal option. It must be an instance of AbortSignal."), this.name = "InvalidSignalError";
  }
}, sl = class extends Error {
  constructor() {
    super(
      "shapeHandle is required if this isn't an initial fetch (i.e. offset > -1)"
    ), this.name = "MissingShapeHandleError";
  }
}, il = class extends Error {
  constructor(t) {
    super(
      `Cannot use reserved Electric parameter names in custom params: ${t.join(", ")}`
    ), this.name = "ReservedParamError";
  }
}, ol = class extends Error {
  constructor(t) {
    super(`Column "${t ?? "unknown"}" does not allow NULL values`), this.name = "ParserNullValueError";
  }
}, cl = class extends Error {
  constructor(t, e) {
    let n = `The response for the shape request to ${t} didn't include the following required headers:
`;
    e.forEach((a) => {
      n += `- ${a}
`;
    }), n += `
This is often due to a proxy not setting CORS correctly so that all Electric headers can be read by the client.`, n += `
For more information visit the troubleshooting guide: /docs/guides/troubleshooting/missing-headers`, super(n);
  }
}, Qt = (t) => Number(t), ul = (t) => t === "true" || t === "t", ll = (t) => BigInt(t), va = (t) => JSON.parse(t), dl = (t) => t, fl = {
  int2: Qt,
  int4: Qt,
  int8: ll,
  bool: ul,
  float4: Qt,
  float8: Qt,
  json: va,
  jsonb: va
};
function hl(t, e) {
  let n = 0, a = null, s = "", i = !1, o = 0, c;
  function u(l) {
    const d = [];
    for (; n < l.length; n++) {
      if (a = l[n], i)
        a === "\\" ? s += l[++n] : a === '"' ? (d.push(e(s)), s = "", i = l[n + 1] === '"', o = n + 2) : s += a;
      else if (a === '"')
        i = !0;
      else if (a === "{")
        o = ++n, d.push(u(l));
      else if (a === "}") {
        i = !1, o < n && d.push(e(l.slice(o, n))), o = n + 1;
        break;
      } else a === "," && c !== "}" && c !== '"' && (d.push(e(l.slice(o, n))), o = n + 1);
      c = a;
    }
    return o < n && d.push(e(l.slice(o, n + 1))), d;
  }
  return u(t)[0];
}
var pl = class {
  constructor(t) {
    this.parser = it(it({}, fl), t);
  }
  parse(t, e) {
    return JSON.parse(t, (n, a) => {
      if (n === "value" && typeof a == "object" && a !== null) {
        const s = a;
        Object.keys(s).forEach((i) => {
          s[i] = this.parseRow(i, s[i], e);
        });
      }
      return a;
    });
  }
  // Parses the message values using the provided parser based on the schema information
  parseRow(t, e, n) {
    var a;
    const s = n[t];
    if (!s)
      return e;
    const i = s, { type: o, dims: c } = i, u = rl(i, ["type", "dims"]), l = (a = this.parser[o]) != null ? a : dl, d = ba(l, s, t);
    return c && c > 0 ? ba(
      (g, f) => hl(g, d),
      s,
      t
    )(e) : d(e, u);
  }
};
function ba(t, e, n) {
  var a;
  const s = !((a = e.not_null) != null && a);
  return (i) => {
    if (gl(i)) {
      if (!s)
        throw new ol(n ?? "unknown");
      return null;
    }
    return t(i, e);
  };
}
function gl(t) {
  return t === null || t === "NULL";
}
function $s(t) {
  return "key" in t;
}
function Ls(t) {
  return !$s(t);
}
function ml(t) {
  return Ls(t) && t.headers.control === "up-to-date";
}
var yl = "electric-cursor", vn = "electric-handle", Gs = "electric-offset", _l = "electric-schema", vl = "electric-up-to-date", bl = "columns", Fs = "cursor", Yn = "handle", qe = "live", zn = "offset", El = "table", Tl = "where", Rl = "replica", Sl = [429], Ks = {
  initialDelay: 100,
  maxDelay: 1e4,
  multiplier: 1.3
};
function Al(t, e = Ks) {
  const {
    initialDelay: n,
    maxDelay: a,
    multiplier: s,
    debug: i = !1,
    onFailedAttempt: o
  } = e;
  return (...c) => Fe(this, null, function* () {
    var u;
    const l = c[0], d = c[1];
    let E = n, g = 0;
    for (; ; )
      try {
        const f = yield t(...c);
        if (f.ok) return f;
        throw yield _r.fromResponse(f, l.toString());
      } catch (f) {
        if (o == null || o(), (u = d == null ? void 0 : d.signal) != null && u.aborted)
          throw new Ds();
        if (f instanceof _r && !Sl.includes(f.status) && f.status >= 400 && f.status < 500)
          throw f;
        yield new Promise((p) => setTimeout(p, E)), E = Math.min(E * s, a), i && (g++, console.log(`Retry attempt #${g} after ${E}ms`));
      }
  });
}
var wl = {
  maxChunksToPrefetch: 2
};
function Il(t, e = wl) {
  const { maxChunksToPrefetch: n } = e;
  let a;
  return (...i) => Fe(this, null, function* () {
    const o = i[0].toString(), c = a == null ? void 0 : a.consume(...i);
    if (c)
      return c;
    a == null || a.abort();
    const u = yield t(...i), l = Jn(o, u);
    return l && (a = new Cl({
      fetchClient: t,
      maxPrefetchedRequests: n,
      url: l,
      requestInit: i[1]
    })), u;
  });
}
var kl = [
  "electric-offset",
  "electric-handle"
], xl = ["electric-cursor"], Nl = ["electric-schema"];
function Ol(t) {
  return (...e) => Fe(this, null, function* () {
    const n = yield t(...e);
    if (n.ok) {
      const a = n.headers, s = [], i = (l) => s.push(...l.filter((d) => !a.has(d)));
      i(kl);
      const c = e[0].toString(), u = new URL(c);
      if (u.searchParams.get(qe) === "true" && i(xl), (!u.searchParams.has(qe) || u.searchParams.get(qe) === "false") && i(Nl), s.length > 0)
        throw new cl(c, s);
    }
    return n;
  });
}
var vr, br, pe, Ze, ge, Rt, Er, Cl = class {
  constructor(t) {
    L(this, Rt), L(this, vr), L(this, br), L(this, pe, /* @__PURE__ */ new Map()), L(this, Ze), L(this, ge);
    var e;
    j(this, vr, (e = t.fetchClient) != null ? e : (...n) => fetch(...n)), j(this, br, t.maxPrefetchedRequests), j(this, Ze, t.url.toString()), j(this, ge, k(this, Ze)), te(this, Rt, Er).call(this, t.url, t.requestInit);
  }
  abort() {
    k(this, pe).forEach(([t, e]) => e.abort());
  }
  consume(...t) {
    var e;
    const n = t[0].toString(), a = (e = k(this, pe).get(n)) == null ? void 0 : e[0];
    if (!(!a || n !== k(this, Ze)))
      return k(this, pe).delete(n), a.then((s) => {
        const i = Jn(n, s);
        j(this, Ze, i), k(this, ge) && !k(this, pe).has(k(this, ge)) && te(this, Rt, Er).call(this, k(this, ge), t[1]);
      }).catch(() => {
      }), a;
  }
};
vr = /* @__PURE__ */ new WeakMap();
br = /* @__PURE__ */ new WeakMap();
pe = /* @__PURE__ */ new WeakMap();
Ze = /* @__PURE__ */ new WeakMap();
ge = /* @__PURE__ */ new WeakMap();
Rt = /* @__PURE__ */ new WeakSet();
Er = function(...t) {
  var e, n;
  const a = t[0].toString();
  if (k(this, pe).size >= k(this, br)) return;
  const s = new AbortController();
  try {
    const i = k(this, vr).call(this, a, Ms(it({}, (e = t[1]) != null ? e : {}), {
      signal: Pl(s, (n = t[1]) == null ? void 0 : n.signal)
    }));
    k(this, pe).set(a, [i, s]), i.then((o) => {
      if (!o.ok || s.signal.aborted) return;
      const c = Jn(a, o);
      if (!c || c === a) {
        j(this, ge, void 0);
        return;
      }
      return j(this, ge, c), te(this, Rt, Er).call(this, c, t[1]);
    }).catch(() => {
    });
  } catch {
  }
};
function Jn(t, e) {
  const n = e.headers.get(vn), a = e.headers.get(Gs), s = e.headers.has(vl);
  if (!n || !a || s) return;
  const i = new URL(t);
  if (!i.searchParams.has(qe))
    return i.searchParams.set(Yn, n), i.searchParams.set(zn, a), i.searchParams.sort(), i.toString();
}
function Pl(t, e) {
  return e && (e.aborted ? t.abort() : e.addEventListener("abort", () => t.abort(), {
    once: !0
  })), t.signal;
}
var Bs = /* @__PURE__ */ new Set([
  Fs,
  Yn,
  qe,
  zn
]);
function jl(t) {
  const e = {};
  for (const [n, a] of Object.entries(t))
    e[n] = Array.isArray(a) ? a.join(",") : a;
  return e;
}
var Tr, Rr, Sr, Ce, Me, ot, Pe, be, Ue, Ee, Xe, Bt, ce, bn, En, Vs, Tn, Zs = class {
  constructor(t) {
    L(this, ce), L(this, Tr, null), L(this, Rr), L(this, Sr), L(this, Ce, /* @__PURE__ */ new Map()), L(this, Me), L(this, ot), L(this, Pe), L(this, be, !1), L(this, Ue, !1), L(this, Ee), L(this, Xe), L(this, Bt);
    var e, n, a;
    this.options = it({ subscribe: !0 }, t), Ml(this.options), j(this, Me, (e = this.options.offset) != null ? e : "-1"), j(this, ot, ""), j(this, Ee, this.options.handle), j(this, Sr, new pl(t.parser)), j(this, Bt, this.options.onError);
    const s = (n = t.fetchClient) != null ? n : (...o) => fetch(...o), i = Al(s, Ms(it({}, (a = t.backoffOptions) != null ? a : Ks), {
      onFailedAttempt: () => {
        var o, c;
        j(this, Ue, !1), (c = (o = t.backoffOptions) == null ? void 0 : o.onFailedAttempt) == null || c.call(o);
      }
    }));
    j(this, Rr, Ol(
      Il(i)
    )), te(this, ce, bn).call(this);
  }
  get shapeHandle() {
    return k(this, Ee);
  }
  get error() {
    return k(this, Tr);
  }
  get isUpToDate() {
    return k(this, be);
  }
  get lastOffset() {
    return k(this, Me);
  }
  subscribe(t, e = () => {
  }) {
    const n = Math.random();
    return k(this, Ce).set(n, [t, e]), () => {
      k(this, Ce).delete(n);
    };
  }
  unsubscribeAll() {
    k(this, Ce).clear();
  }
  /** Unix time at which we last synced. Undefined when `isLoading` is true. */
  lastSyncedAt() {
    return k(this, Pe);
  }
  /** Time elapsed since last sync (in ms). Infinity if we did not yet sync. */
  lastSynced() {
    return k(this, Pe) === void 0 ? 1 / 0 : Date.now() - k(this, Pe);
  }
  /** Indicates if we are connected to the Electric sync service. */
  isConnected() {
    return k(this, Ue);
  }
  /** True during initial fetch. False afterwise.  */
  isLoading() {
    return !k(this, be);
  }
};
Tr = /* @__PURE__ */ new WeakMap();
Rr = /* @__PURE__ */ new WeakMap();
Sr = /* @__PURE__ */ new WeakMap();
Ce = /* @__PURE__ */ new WeakMap();
Me = /* @__PURE__ */ new WeakMap();
ot = /* @__PURE__ */ new WeakMap();
Pe = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakMap();
Ue = /* @__PURE__ */ new WeakMap();
Ee = /* @__PURE__ */ new WeakMap();
Xe = /* @__PURE__ */ new WeakMap();
Bt = /* @__PURE__ */ new WeakMap();
ce = /* @__PURE__ */ new WeakSet();
bn = function() {
  return Fe(this, null, function* () {
    var t, e;
    try {
      for (; !((t = this.options.signal) != null && t.aborted) && !k(this, be) || this.options.subscribe; ) {
        const { url: n, signal: a } = this.options, s = new URL(n);
        if (this.options.params) {
          const p = Object.keys(this.options.params).filter(
            ($) => Bs.has($)
          );
          if (p.length > 0)
            throw new Error(
              `Cannot use reserved Electric parameter names in custom params: ${p.join(", ")}`
            );
          const b = jl(this.options.params);
          b.table && s.searchParams.set(El, b.table), b.where && s.searchParams.set(Tl, b.where), b.columns && s.searchParams.set(bl, b.columns), b.replica && s.searchParams.set(Rl, b.replica);
          const N = it({}, b);
          delete N.table, delete N.where, delete N.columns, delete N.replica;
          for (const [$, Z] of Object.entries(N))
            s.searchParams.set($, Z);
        }
        s.searchParams.set(zn, k(this, Me)), k(this, be) && (s.searchParams.set(qe, "true"), s.searchParams.set(
          Fs,
          k(this, ot)
        )), k(this, Ee) && s.searchParams.set(
          Yn,
          k(this, Ee)
        ), s.searchParams.sort();
        let i;
        try {
          i = yield k(this, Rr).call(this, s.toString(), {
            signal: a,
            headers: this.options.headers
          }), j(this, Ue, !0);
        } catch (p) {
          if (p instanceof Ds) break;
          if (!(p instanceof _r)) throw p;
          if (p.status == 409) {
            const b = p.headers[vn];
            te(this, ce, Tn).call(this, b), yield te(this, ce, En).call(this, p.json);
            continue;
          } else if (p.status >= 400 && p.status < 500)
            throw te(this, ce, Vs).call(this, p), p;
        }
        const { headers: o, status: c } = i, u = o.get(vn);
        u && j(this, Ee, u);
        const l = o.get(Gs);
        l && j(this, Me, l);
        const d = o.get(yl);
        d && j(this, ot, d);
        const E = () => {
          const p = o.get(_l);
          return p ? JSON.parse(p) : {};
        };
        j(this, Xe, (e = k(this, Xe)) != null ? e : E());
        const g = c === 204 ? "[]" : yield i.text();
        c === 204 && j(this, Pe, Date.now());
        const f = k(this, Sr).parse(g, k(this, Xe));
        if (f.length > 0) {
          const p = f[f.length - 1];
          ml(p) && (j(this, Pe, Date.now()), j(this, be, !0)), yield te(this, ce, En).call(this, f);
        }
      }
    } catch (n) {
      if (j(this, Tr, n), k(this, Bt)) {
        const a = yield k(this, Bt).call(this, n);
        typeof a == "object" && (te(this, ce, Tn).call(this), "params" in a && (this.options.params = a.params), "headers" in a && (this.options.headers = a.headers), te(this, ce, bn).call(this));
        return;
      }
      throw n;
    } finally {
      j(this, Ue, !1);
    }
  });
};
En = function(t) {
  return Fe(this, null, function* () {
    yield Promise.all(
      Array.from(k(this, Ce).values()).map((e) => Fe(this, [e], function* ([n, a]) {
        try {
          yield n(t);
        } catch (s) {
          queueMicrotask(() => {
            throw s;
          });
        }
      }))
    );
  });
};
Vs = function(t) {
  k(this, Ce).forEach(([e, n]) => {
    n == null || n(t);
  });
};
Tn = function(t) {
  j(this, Me, "-1"), j(this, ot, ""), j(this, Ee, t), j(this, be, !1), j(this, Ue, !1), j(this, Xe, void 0);
};
Zs.Replica = {
  FULL: "full",
  DEFAULT: "default"
};
function Ml(t) {
  if (!t.url)
    throw new nl();
  if (t.signal && !(t.signal instanceof AbortSignal))
    throw new al();
  if (t.offset !== void 0 && t.offset !== "-1" && !t.handle)
    throw new sl();
  if (t.params) {
    const e = Object.keys(t.params).filter(
      (n) => Bs.has(n)
    );
    if (e.length > 0)
      throw new il(e);
  }
}
function Ws(t, e, n) {
  var c;
  const a = new AbortController();
  (c = n == null ? void 0 : n.signal) == null || c.addEventListener("abort", () => {
    a.abort();
  }, { once: !0 });
  const s = new Zs({
    url: e,
    headers: {
      ...n == null ? void 0 : n.headers,
      "x-trigger-electric-version": "1.0.0-beta.1"
    },
    fetchClient: n == null ? void 0 : n.fetchClient,
    signal: a.signal
  });
  return {
    stream: new Dl(s).stream.pipeThrough(new TransformStream({
      async transform(u, l) {
        const d = t.safeParse(u);
        d.success ? l.enqueue(d.data) : l.error(new Error(`Unable to parse shape: ${d.error.message}`));
      }
    })),
    stop: () => {
      a.abort();
    }
  };
}
function Ul(t, e) {
  const n = t.pipeThrough(new TransformStream(e));
  return n[Symbol.asyncIterator] = () => {
    const a = n.getReader();
    return {
      async next() {
        const { done: s, value: i } = await a.read();
        return s ? { done: !0, value: void 0 } : { done: !1, value: i };
      }
    };
  }, n;
}
function Ea(t, e, n) {
  return new ReadableStream({
    async start(a) {
      const i = t.pipeThrough(new TransformStream(e)).getReader();
      for (n.addEventListener("abort", () => {
        queueMicrotask(() => {
          i.cancel(), a.close();
        });
      }); ; ) {
        const { done: o, value: c } = await i.read();
        if (o) {
          a.close();
          break;
        }
        a.enqueue(c);
      }
    }
  });
}
var Y, ye, Vt, tt, Zt, Nr, Hs;
class Dl {
  constructor(e) {
    G(this, Nr);
    G(this, Y);
    G(this, ye, /* @__PURE__ */ new Map());
    G(this, Vt);
    G(this, tt, !1);
    G(this, Zt);
    Be(this, Y, e);
    const n = new ReadableStream({
      start: (a) => {
        Be(this, Zt, F(this, Y).subscribe((s) => a.enqueue(s), y(this, Nr, Hs).bind(this)));
      }
    });
    Be(this, Vt, Ul(n, {
      transform: (a, s) => {
        const i = /* @__PURE__ */ new Set();
        for (const o of a)
          if ($s(o)) {
            const c = o.key;
            switch (o.headers.operation) {
              case "insert": {
                F(this, ye).set(c, o.value), i.add(c);
                break;
              }
              case "update": {
                const u = F(this, ye).get(c), l = u ? { ...u, ...o.value } : o.value;
                F(this, ye).set(c, l), i.add(c);
                break;
              }
            }
          } else Ls(o) && o.headers.control === "must-refetch" && (F(this, ye).clear(), Be(this, tt, !1));
        for (const o of i) {
          const c = F(this, ye).get(o);
          c && s.enqueue(c);
        }
      }
    }));
  }
  stop() {
    var e;
    (e = F(this, Zt)) == null || e.call(this);
  }
  get stream() {
    return F(this, Vt);
  }
  get isUpToDate() {
    return F(this, Y).isUpToDate;
  }
  get lastOffset() {
    return F(this, Y).lastOffset;
  }
  get handle() {
    return F(this, Y).shapeHandle;
  }
  get error() {
    return F(this, tt);
  }
  lastSyncedAt() {
    return F(this, Y).lastSyncedAt();
  }
  lastSynced() {
    return F(this, Y).lastSynced();
  }
  isLoading() {
    return F(this, Y).isLoading();
  }
  isConnected() {
    return F(this, Y).isConnected();
  }
}
Y = new WeakMap(), ye = new WeakMap(), Vt = new WeakMap(), tt = new WeakMap(), Zt = new WeakMap(), Nr = new WeakSet(), Hs = function(e) {
  e instanceof _r && Be(this, tt, e);
};
class $l extends TransformStream {
  constructor() {
    super({
      transform: (n, a) => {
        this.buffer += n;
        const s = this.buffer.split(`
`);
        this.buffer = s.pop() || "";
        const i = s.filter((o) => o.trim().length > 0);
        i.length > 0 && a.enqueue(i);
      },
      flush: (n) => {
        const a = this.buffer.trim();
        a.length > 0 && n.enqueue([a]);
      }
    });
    _(this, "buffer", "");
  }
}
function en(t, e) {
  var c;
  const n = new AbortController(), a = new Gl(Oe("TRIGGER_STREAM_URL", Oe("TRIGGER_API_URL")) ?? "https://api.trigger.dev", {
    headers: e == null ? void 0 : e.headers,
    signal: n.signal
  }), s = new Kl(Oe("TRIGGER_STREAM_URL", Oe("TRIGGER_API_URL")) ?? "https://api.trigger.dev", {
    headers: e == null ? void 0 : e.headers,
    signal: n.signal
  });
  (c = e == null ? void 0 : e.signal) == null || c.addEventListener("abort", () => {
    n.signal.aborted || n.abort();
  }, { once: !0 });
  const i = Ws(Go, t, {
    ...e,
    signal: n.signal
  }), o = {
    runShapeStream: i.stream,
    stopRunShapeStream: i.stop,
    streamFactory: new Bl(a, s),
    abortController: n,
    ...e
  };
  return new Vl(o);
}
class Ll {
  constructor(e, n) {
    _(this, "url");
    _(this, "options");
    this.url = e, this.options = n;
  }
  async subscribe() {
    return fetch(this.url, {
      headers: {
        Accept: "text/event-stream",
        ...this.options.headers
      },
      signal: this.options.signal
    }).then((e) => {
      if (!e.ok)
        throw K.generate(e.status, {}, "Could not subscribe to stream", Object.fromEntries(e.headers));
      if (!e.body)
        throw new Error("No response body");
      return e.body.pipeThrough(new TextDecoderStream()).pipeThrough(new Zu()).pipeThrough(new TransformStream({
        transform(n, a) {
          a.enqueue(Ys(n.data));
        }
      }));
    });
  }
}
class Gl {
  constructor(e, n) {
    _(this, "baseUrl");
    _(this, "options");
    this.baseUrl = e, this.options = n;
  }
  createSubscription(e, n, a, s) {
    if (!n || !a)
      throw new Error("runId and streamKey are required");
    const i = `${s ?? this.baseUrl}/realtime/v1/streams/${n}/${a}`;
    return new Ll(i, this.options);
  }
}
class Fl {
  constructor(e, n) {
    _(this, "url");
    _(this, "options");
    this.url = e, this.options = n;
  }
  async subscribe() {
    return Ws(Bo, this.url, this.options).stream.pipeThrough(new TransformStream({
      transform(e, n) {
        n.enqueue(e.value);
      }
    })).pipeThrough(new $l()).pipeThrough(new TransformStream({
      transform(e, n) {
        for (const a of e)
          n.enqueue(Ys(a));
      }
    }));
  }
}
class Kl {
  constructor(e, n) {
    _(this, "baseUrl");
    _(this, "options");
    this.baseUrl = e, this.options = n;
  }
  createSubscription(e, n, a, s) {
    if (!n || !a)
      throw new Error("runId and streamKey are required");
    return new Fl(`${s ?? this.baseUrl}/realtime/v2/streams/${n}/${a}`, this.options);
  }
}
class Bl {
  constructor(e, n) {
    _(this, "version1");
    _(this, "version2");
    this.version1 = e, this.version2 = n;
  }
  createSubscription(e, n, a, s) {
    if (!n || !a)
      throw new Error("runId and streamKey are required");
    const i = typeof e.$$streamsVersion == "string" ? e.$$streamsVersion : "v1", o = typeof e.$$streamsBaseUrl == "string" ? e.$$streamsBaseUrl : s;
    if (i === "v1")
      return this.version1.createSubscription(e, n, a, o);
    if (i === "v2")
      return this.version2.createSubscription(e, n, a, o);
    throw new Error(`Unknown stream version: ${i}`);
  }
}
class Vl {
  constructor(e) {
    _(this, "options");
    _(this, "stream");
    _(this, "packetCache", /* @__PURE__ */ new Map());
    _(this, "_closeOnComplete");
    _(this, "_isRunComplete", !1);
    this.options = e, this._closeOnComplete = typeof e.closeOnComplete > "u" ? !0 : e.closeOnComplete, this.stream = Ea(this.options.runShapeStream, {
      transform: async (n, a) => {
        const s = await this.transformRunShape(n);
        a.enqueue(s), this._isRunComplete = !!s.finishedAt, this._closeOnComplete && this._isRunComplete && !this.options.abortController.signal.aborted && this.options.stopRunShapeStream();
      }
    }, this.options.abortController.signal);
  }
  unsubscribe() {
    this.options.abortController.signal.aborted || this.options.abortController.abort(), this.options.stopRunShapeStream();
  }
  [Symbol.asyncIterator]() {
    return this.stream[Symbol.asyncIterator]();
  }
  getReader() {
    return this.stream.getReader();
  }
  withStreams() {
    const e = /* @__PURE__ */ new Set();
    return Ea(this.stream, {
      transform: async (n, a) => {
        var s;
        if (a.enqueue({
          type: "run",
          run: n
        }), n.metadata && "$$streams" in n.metadata && Array.isArray(n.metadata.$$streams))
          for (const i of n.metadata.$$streams)
            typeof i == "string" && (e.has(i) || (e.add(i), (await this.options.streamFactory.createSubscription(n.metadata, n.id, i, (s = this.options.client) == null ? void 0 : s.baseUrl).subscribe()).pipeThrough(new TransformStream({
              transform(u, l) {
                l.enqueue({
                  type: i,
                  chunk: u,
                  run: n
                });
              }
            })).pipeTo(new WritableStream({
              write(u) {
                a.enqueue(u);
              }
            })).catch((u) => {
              console.error(`Error in stream ${i}:`, u);
            })));
      }
    }, this.options.abortController.signal);
  }
  async transformRunShape(e) {
    const n = e.payloadType ? { data: e.payload ?? void 0, dataType: e.payloadType } : void 0, a = e.outputType ? { data: e.output ?? void 0, dataType: e.outputType } : void 0, [s, i] = await Promise.all([
      { packet: n, key: "payload" },
      { packet: a, key: "output" }
    ].map(async ({ packet: c, key: u }) => {
      if (!c)
        return;
      const l = this.packetCache.get(`${e.friendlyId}/${u}`);
      if (typeof l < "u")
        return l;
      const d = await qu(c, this.options.client);
      return this.packetCache.set(`${e.friendlyId}/${u}`, d), d;
    })), o = e.metadata && e.metadataType ? await Wn({ data: e.metadata, dataType: e.metadataType }) : void 0;
    return {
      id: e.friendlyId,
      payload: s,
      output: i,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      taskIdentifier: e.taskIdentifier,
      number: e.number,
      status: Zl(e.status),
      durationMs: e.usageDurationMs,
      costInCents: e.costInCents,
      baseCostInCents: e.baseCostInCents,
      tags: e.runTags ?? [],
      idempotencyKey: e.idempotencyKey ?? void 0,
      expiredAt: e.expiredAt ?? void 0,
      finishedAt: e.completedAt ?? void 0,
      startedAt: e.startedAt ?? void 0,
      delayedUntil: e.delayUntil ?? void 0,
      queuedAt: e.queuedAt ?? void 0,
      error: e.error ? Hu(e.error) : void 0,
      isTest: e.isTest,
      metadata: o
    };
  }
}
function Zl(t) {
  switch (t) {
    case "DELAYED":
      return "DELAYED";
    case "WAITING_FOR_DEPLOY":
      return "WAITING_FOR_DEPLOY";
    case "PENDING":
      return "QUEUED";
    case "PAUSED":
    case "WAITING_TO_RESUME":
      return "FROZEN";
    case "RETRYING_AFTER_FAILURE":
      return "REATTEMPTING";
    case "EXECUTING":
      return "EXECUTING";
    case "CANCELED":
      return "CANCELED";
    case "COMPLETED_SUCCESSFULLY":
      return "COMPLETED";
    case "SYSTEM_FAILURE":
      return "SYSTEM_FAILURE";
    case "INTERRUPTED":
      return "INTERRUPTED";
    case "CRASHED":
      return "CRASHED";
    case "COMPLETED_WITH_ERRORS":
      return "FAILED";
    case "EXPIRED":
      return "EXPIRED";
    default:
      throw new Error(`Unknown status: ${t}`);
  }
}
function Ys(t) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}
const Wl = {
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 1e3,
    maxTimeoutInMs: 3e4,
    factor: 1.6,
    randomize: !1
  }
};
var x, C, sr;
class Ta {
  constructor(e, n, a = {}) {
    G(this, x);
    _(this, "baseUrl");
    _(this, "accessToken");
    _(this, "defaultRequestOptions");
    this.accessToken = n, this.baseUrl = e.replace(/\/$/, ""), this.defaultRequestOptions = P(Wl, a);
  }
  get fetchClient() {
    const e = y(this, x, C).call(this, !1);
    return (a, s) => {
      const i = {
        ...s,
        headers: {
          ...s == null ? void 0 : s.headers,
          ...e
        }
      };
      return fetch(a, i);
    };
  }
  getHeaders() {
    return y(this, x, C).call(this, !1);
  }
  async getRunResult(e, n) {
    try {
      return await M(X, `${this.baseUrl}/api/v1/runs/${e}/result`, {
        method: "GET",
        headers: y(this, x, C).call(this, !1)
      }, P(this.defaultRequestOptions, n));
    } catch (a) {
      if (a instanceof K && a.status === 404)
        return;
      throw a;
    }
  }
  async getBatchResults(e, n) {
    return await M(po, `${this.baseUrl}/api/v1/batches/${e}/results`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  triggerTask(e, n, a, s) {
    const i = encodeURIComponent(e);
    return M(So, `${this.baseUrl}/api/v1/tasks/${i}/trigger`, {
      method: "POST",
      headers: y(this, x, C).call(this, (a == null ? void 0 : a.spanParentAsLink) ?? !1),
      body: JSON.stringify(n)
    }, P(this.defaultRequestOptions, s)).withResponse().then(async ({ response: o, data: c }) => {
      var g;
      const u = o.headers.get("x-trigger-jwt");
      if (typeof u == "string")
        return {
          ...c,
          publicAccessToken: u
        };
      const l = o.headers.get("x-trigger-jwt-claims"), d = l ? JSON.parse(l) : void 0, E = await na({
        secretKey: this.accessToken,
        payload: {
          ...d,
          scopes: [`read:runs:${c.id}`]
        },
        expirationTime: ((g = s == null ? void 0 : s.publicAccessToken) == null ? void 0 : g.expirationTime) ?? "1h"
      });
      return {
        ...c,
        publicAccessToken: E
      };
    });
  }
  batchTriggerV2(e, n, a) {
    return M(wo, `${this.baseUrl}/api/v1/tasks/batch`, {
      method: "POST",
      headers: y(this, x, C).call(this, (n == null ? void 0 : n.spanParentAsLink) ?? !1, {
        "idempotency-key": n == null ? void 0 : n.idempotencyKey,
        "idempotency-key-ttl": n == null ? void 0 : n.idempotencyKeyTTL,
        "batch-processing-strategy": n == null ? void 0 : n.processingStrategy
      }),
      body: JSON.stringify(e)
    }, P(this.defaultRequestOptions, a)).withResponse().then(async ({ response: s, data: i }) => {
      var l;
      const o = s.headers.get("x-trigger-jwt-claims"), c = o ? JSON.parse(o) : void 0, u = await na({
        secretKey: this.accessToken,
        payload: {
          ...c,
          scopes: [`read:batch:${i.id}`]
        },
        expirationTime: ((l = a == null ? void 0 : a.publicAccessToken) == null ? void 0 : l.expirationTime) ?? "1h"
      });
      return {
        ...i,
        publicAccessToken: u
      };
    });
  }
  createUploadPayloadUrl(e, n) {
    return M(oa, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "PUT",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  getPayloadUrl(e, n) {
    return M(oa, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  retrieveRun(e, n) {
    return M(ca, `${this.baseUrl}/api/v3/runs/${e}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  listRuns(e, n) {
    const a = Ra(e);
    return mn(fn, `${this.baseUrl}/api/v1/runs`, {
      query: a,
      limit: e == null ? void 0 : e.limit,
      after: e == null ? void 0 : e.after,
      before: e == null ? void 0 : e.before
    }, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  listProjectRuns(e, n, a) {
    const s = Ra(n);
    return n != null && n.env && s.append("filter[env]", Array.isArray(n.env) ? n.env.join(",") : n.env), mn(fn, `${this.baseUrl}/api/v1/projects/${e}/runs`, {
      query: s,
      limit: n == null ? void 0 : n.limit,
      after: n == null ? void 0 : n.after,
      before: n == null ? void 0 : n.before
    }, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, a));
  }
  replayRun(e, n) {
    return M(ko, `${this.baseUrl}/api/v1/runs/${e}/replay`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  cancelRun(e, n) {
    return M(xo, `${this.baseUrl}/api/v2/runs/${e}/cancel`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  rescheduleRun(e, n, a) {
    return M(ca, `${this.baseUrl}/api/v1/runs/${e}/reschedule`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(n)
    }, P(this.defaultRequestOptions, a));
  }
  addTags(e, n, a) {
    return M(r.object({ message: r.string() }), `${this.baseUrl}/api/v1/runs/${e}/tags`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(n)
    }, P(this.defaultRequestOptions, a));
  }
  createSchedule(e, n) {
    return M(ke, `${this.baseUrl}/api/v1/schedules`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(e)
    }, P(this.defaultRequestOptions, n));
  }
  listSchedules(e, n) {
    const a = new URLSearchParams();
    return e != null && e.page && a.append("page", e.page.toString()), e != null && e.perPage && a.append("perPage", e.perPage.toString()), Is(ke, `${this.baseUrl}/api/v1/schedules`, {
      page: e == null ? void 0 : e.page,
      limit: e == null ? void 0 : e.perPage
    }, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  retrieveSchedule(e, n) {
    return M(ke, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  updateSchedule(e, n, a) {
    return M(ke, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "PUT",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(n)
    }, P(this.defaultRequestOptions, a));
  }
  deactivateSchedule(e, n) {
    return M(ke, `${this.baseUrl}/api/v1/schedules/${e}/deactivate`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  activateSchedule(e, n) {
    return M(ke, `${this.baseUrl}/api/v1/schedules/${e}/activate`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  deleteSchedule(e, n) {
    return M(Oo, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "DELETE",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
  listEnvVars(e, n, a) {
    return M($o, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, a));
  }
  importEnvVars(e, n, a, s) {
    return M(qt, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}/import`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(a)
    }, P(this.defaultRequestOptions, s));
  }
  retrieveEnvVar(e, n, a, s) {
    return M(Uo, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}/${a}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, s));
  }
  createEnvVar(e, n, a, s) {
    return M(qt, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(a)
    }, P(this.defaultRequestOptions, s));
  }
  updateEnvVar(e, n, a, s, i) {
    return M(qt, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}/${a}`, {
      method: "PUT",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(s)
    }, P(this.defaultRequestOptions, i));
  }
  deleteEnvVar(e, n, a, s) {
    return M(qt, `${this.baseUrl}/api/v1/projects/${e}/envvars/${n}/${a}`, {
      method: "DELETE",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, s));
  }
  updateRunMetadata(e, n, a) {
    return M(Lo, `${this.baseUrl}/api/v1/runs/${e}/metadata`, {
      method: "PUT",
      headers: y(this, x, C).call(this, !1),
      body: JSON.stringify(n)
    }, P(this.defaultRequestOptions, a));
  }
  subscribeToRun(e, n) {
    return en(`${this.baseUrl}/realtime/v1/runs/${e}`, {
      closeOnComplete: !0,
      headers: y(this, x, sr).call(this),
      client: this,
      signal: n == null ? void 0 : n.signal
    });
  }
  subscribeToRunsWithTag(e, n) {
    const a = Hl({
      tags: e
    });
    return en(`${this.baseUrl}/realtime/v1/runs${a ? `?${a}` : ""}`, {
      closeOnComplete: !1,
      headers: y(this, x, sr).call(this),
      client: this,
      signal: n == null ? void 0 : n.signal
    });
  }
  subscribeToBatch(e, n) {
    return en(`${this.baseUrl}/realtime/v1/batches/${e}`, {
      closeOnComplete: !1,
      headers: y(this, x, sr).call(this),
      client: this,
      signal: n == null ? void 0 : n.signal
    });
  }
  async generateJWTClaims(e) {
    return M(r.record(r.any()), `${this.baseUrl}/api/v1/auth/jwt/claims`, {
      method: "POST",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, e));
  }
  retrieveBatch(e, n) {
    return M(Ko, `${this.baseUrl}/api/v1/batches/${e}`, {
      method: "GET",
      headers: y(this, x, C).call(this, !1)
    }, P(this.defaultRequestOptions, n));
  }
}
x = new WeakSet(), C = function(e, n) {
  const a = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": ra,
    ...Object.entries(n ?? {}).reduce((s, [i, o]) => (o !== void 0 && (s[i] = o), s), {})
  };
  return D.isInsideTask && (a["x-trigger-worker"] = "true", e && (a["x-trigger-span-parent-as-link"] = "1")), typeof window < "u" && typeof window.document < "u" && (a["x-trigger-client"] = "browser"), a;
}, sr = function() {
  return {
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": ra
  };
};
function Hl(t) {
  const e = new URLSearchParams();
  return t.tasks && e.append("tasks", Array.isArray(t.tasks) ? t.tasks.join(",") : t.tasks), t.tags && e.append("tags", Array.isArray(t.tags) ? t.tags.join(",") : t.tags), e;
}
function Ra(t) {
  const e = new URLSearchParams();
  return t && (t.status && e.append("filter[status]", Array.isArray(t.status) ? t.status.join(",") : t.status), t.taskIdentifier && e.append("filter[taskIdentifier]", Array.isArray(t.taskIdentifier) ? t.taskIdentifier.join(",") : t.taskIdentifier), t.version && e.append("filter[version]", Array.isArray(t.version) ? t.version.join(",") : t.version), t.bulkAction && e.append("filter[bulkAction]", t.bulkAction), t.tag && e.append("filter[tag]", Array.isArray(t.tag) ? t.tag.join(",") : t.tag), t.schedule && e.append("filter[schedule]", t.schedule), typeof t.isTest == "boolean" && e.append("filter[isTest]", String(t.isTest)), t.from && e.append("filter[createdAt][from]", t.from instanceof Date ? t.from.getTime().toString() : t.from.toString()), t.to && e.append("filter[createdAt][to]", t.to instanceof Date ? t.to.getTime().toString() : t.to.toString()), t.period && e.append("filter[createdAt][period]", t.period), t.batch && e.append("filter[batch]", t.batch)), e;
}
function P(t, e) {
  return e ? {
    ...t,
    ...e,
    retry: {
      ...t.retry,
      ...e.retry
    }
  } : t;
}
var mt = {}, Sa;
function Yl() {
  if (Sa) return mt;
  Sa = 1;
  /*!
   * Copyright 2019 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  Object.defineProperty(mt, "__esModule", { value: !0 }), mt.PreciseDate = void 0;
  const t = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{4,9}Z/, e = "BigInt only available in Node >= v10.7. Consider using getFullTimeString instead.";
  var n;
  (function(g) {
    g[g.NEGATIVE = -1] = "NEGATIVE", g[g.POSITIVE = 1] = "POSITIVE", g[g.ZERO = 0] = "ZERO";
  })(n || (n = {}));
  class a extends Date {
    constructor(f) {
      if (super(), this._micros = 0, this._nanos = 0, f && typeof f != "number" && !(f instanceof Date)) {
        this.setFullTime(a.parseFull(f));
        return;
      }
      const p = Array.from(arguments), b = p.slice(0, 7), N = new Date(...b), $ = p.length === 9 ? p.pop() : 0, Z = p.length === 8 ? p.pop() : 0;
      this.setTime(N.getTime()), this.setMicroseconds(Z), this.setNanoseconds($);
    }
    /**
     * Returns the specified date represented in nanoseconds according to
     * universal time.
     *
     * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
     * Use {@link PreciseDate#getFullTimeString} to get the time as a string.
     *
     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
     *
     * @throws {error} If `BigInt` is unavailable.
     * @returns {bigint}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
     *
     * console.log(date.getFullTime());
     * // expected output: 1549622069481145231n
     */
    getFullTime() {
      if (typeof BigInt != "function")
        throw new Error(e);
      return BigInt(this.getFullTimeString());
    }
    /**
     * Returns a string of the specified date represented in nanoseconds according
     * to universal time.
     *
     * @returns {string}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
     *
     * console.log(date.getFullTimeString());
     * // expected output: "1549622069481145231"
     */
    getFullTimeString() {
      const f = this._getSeconds();
      let p = this._getNanos();
      return p && Math.sign(f) === n.NEGATIVE && (p = 1e9 - p), `${f}${l(p, 9)}`;
    }
    /**
     * Returns the microseconds in the specified date according to universal time.
     *
     * @returns {number}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145Z');
     *
     * console.log(date.getMicroseconds());
     * // expected output: 145
     */
    getMicroseconds() {
      return this._micros;
    }
    /**
     * Returns the nanoseconds in the specified date according to universal time.
     *
     * @returns {number}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
     *
     * console.log(date.getNanoseconds());
     * // expected output: 231
     */
    getNanoseconds() {
      return this._nanos;
    }
    /**
     * Sets the microseconds for a specified date according to universal time.
     *
     * @param {number} microseconds A number representing the microseconds.
     * @returns {string} Returns a string representing the nanoseconds in the
     *     specified date according to universal time.
     *
     * @example
     * const date = new PreciseDate();
     *
     * date.setMicroseconds(149);
     *
     * console.log(date.getMicroseconds());
     * // expected output: 149
     */
    setMicroseconds(f) {
      const p = Math.abs(f);
      let b = this.getUTCMilliseconds();
      return p >= 1e3 && (b += Math.floor(p / 1e3) * Math.sign(f), f %= 1e3), Math.sign(f) === n.NEGATIVE && (b -= 1, f += 1e3), this._micros = f, this.setUTCMilliseconds(b), this.getFullTimeString();
    }
    /**
     * Sets the nanoseconds for a specified date according to universal time.
     *
     * @param {number} nanoseconds A number representing the nanoseconds.
     * @returns {string} Returns a string representing the nanoseconds in the
     *     specified date according to universal time.
     *
     * @example
     * const date = new PreciseDate();
     *
     * date.setNanoseconds(231);
     *
     * console.log(date.getNanoseconds());
     * // expected output: 231
     */
    setNanoseconds(f) {
      const p = Math.abs(f);
      let b = this._micros;
      return p >= 1e3 && (b += Math.floor(p / 1e3) * Math.sign(f), f %= 1e3), Math.sign(f) === n.NEGATIVE && (b -= 1, f += 1e3), this._nanos = f, this.setMicroseconds(b);
    }
    /**
     * Sets the PreciseDate object to the time represented by a number of
     * nanoseconds since January 1, 1970, 00:00:00 UTC.
     *
     * @param {bigint|number|string} time Value representing the number of
     *     nanoseconds since January 1, 1970, 00:00:00 UTC.
     * @returns {string} Returns a string representing the nanoseconds in the
     *     specified date according to universal time (effectively, the value of
     *     the argument).
     *
     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
     *
     * @example <caption>With a nanosecond string.</caption>
     * const date = new PreciseDate();
     * date.setFullTime('1549622069481145231');
     *
     * @example <caption>With a BigInt</caption>
     * date.setFullTime(1549622069481145231n);
     */
    setFullTime(f) {
      typeof f != "string" && (f = f.toString());
      const p = Math.sign(Number(f));
      f = f.replace(/^-/, "");
      const b = Number(f.substr(0, f.length - 9)) * p, N = Number(f.substr(-9)) * p;
      return this.setTime(b * 1e3), this.setNanoseconds(N);
    }
    /**
     * Sets the PreciseDate object to the time represented by a number of
     * milliseconds since January 1, 1970, 00:00:00 UTC. Calling this method will
     * reset both the microseconds and nanoseconds to 0.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime|Date#setTime}
     *
     * @param {number} time Value representing the number of milliseconds since
     *     January 1, 1970, 00:00:00 UTC.
     * @returns {string} The number of milliseconds between January 1, 1970,
     *     00:00:00 UTC and the updated date (effectively, the value of the
     *     argument).
     */
    setTime(f) {
      return this._micros = 0, this._nanos = 0, super.setTime(f);
    }
    /**
     * Returns a string in RFC 3339 format. Unlike the native `Date#toISOString`,
     * this will return 9 digits to represent sub-second precision.
     *
     * @see {@link https://tools.ietf.org/html/rfc3339|RFC 3339}
     *
     * @returns {string}
     *
     * @example
     * const date = new PreciseDate(1549622069481145231n);
     *
     * console.log(date.toISOString());
     * // expected output: "2019-02-08T10:34:29.481145231Z"
     */
    toISOString() {
      const f = l(this._micros, 3), p = l(this._nanos, 3);
      return super.toISOString().replace(/z$/i, `${f}${p}Z`);
    }
    /**
     * Returns an object representing the specified date according to universal
     * time.
     *
     * @see {@link https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#timestamp|google.protobuf.Timestamp}
     *
     * @returns {DateStruct}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
     *
     * console.log(date.toStruct());
     * // expected output: {seconds: 1549622069, nanos: 481145231}
     */
    toStruct() {
      let f = this._getSeconds();
      const p = this._getNanos();
      return Math.sign(f) === n.NEGATIVE && p && (f -= 1), { seconds: f, nanos: p };
    }
    /**
     * Returns a tuple representing the specified date according to universal
     * time.
     *
     * @returns {DateTuple}
     *
     * @example
     * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
     *
     * console.log(date.toTuple());
     * // expected output: [1549622069, 481145231]
     */
    toTuple() {
      const { seconds: f, nanos: p } = this.toStruct();
      return [f, p];
    }
    /**
     * Returns the total number of seconds in the specified date since Unix epoch.
     * Numbers representing < epoch will be negative.
     *
     * @private
     *
     * @returns {number}
     */
    _getSeconds() {
      const f = this.getTime(), p = Math.sign(f);
      return Math.floor(Math.abs(f) / 1e3) * p;
    }
    /**
     * Returns the sub-second precision of the specified date. This will always be
     * a positive number.
     *
     * @private
     *
     * @returns {number}
     */
    _getNanos() {
      const f = this.getUTCMilliseconds() * 1e6, p = this._micros * 1e3;
      return this._nanos + f + p;
    }
    /**
     * Parses a precise time.
     *
     * @static
     *
     * @param {string|bigint|DateTuple|DateStruct} time The precise time value.
     * @returns {string} Returns a string representing the nanoseconds in the
     *     specified date according to universal time.
     *
     * @example <caption>From a RFC 3339 formatted string.</caption>
     * const time = PreciseDate.parseFull('2019-02-08T10:34:29.481145231Z');
     * console.log(time); // expected output: "1549622069481145231"
     *
     * @example <caption>From a nanosecond timestamp string.</caption>
     * const time = PreciseDate.parseFull('1549622069481145231');
     * console.log(time); // expected output: "1549622069481145231"
     *
     * @example <caption>From a BigInt (requires Node >= v10.7)</caption>
     * const time = PreciseDate.parseFull(1549622069481145231n);
     * console.log(time); // expected output: "1549622069481145231"
     *
     * @example <caption>From a tuple.</caption>
     * const time = PreciseDate.parseFull([1549622069, 481145231]);
     * console.log(time); // expected output: "1549622069481145231"
     *
     * @example <caption>From an object.</caption>
     * const struct = {seconds: 1549622069, nanos: 481145231};
     * const time = PreciseDate.parseFull(struct);
     * console.log(time); // expected output: "1549622069481145231"
     */
    static parseFull(f) {
      const p = new a();
      if (Array.isArray(f)) {
        const [b, N] = f;
        f = { seconds: b, nanos: N };
      }
      if (o(f))
        p.setFullTime(f);
      else if (c(f)) {
        const { seconds: b, nanos: N } = i(f);
        p.setTime(b * 1e3), p.setNanoseconds(N);
      } else u(f) ? p.setFullTime(s(f)) : p.setTime(new Date(f).getTime());
      return p.getFullTimeString();
    }
    /**
     * Accepts the same number parameters as the PreciseDate constructor, but
     * treats them as UTC. It returns a string that represents the number of
     * nanoseconds since January 1, 1970, 00:00:00 UTC.
     *
     * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
     *
     * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
     *
     * @static
     *
     * @throws {error} If `BigInt` is unavailable.
     *
     * @param {...number} [dateFields] The date fields.
     * @returns {bigint}
     *
     * @example
     * const time = PreciseDate.fullUTC(2019, 1, 8, 10, 34, 29, 481, 145, 231);
     * console.log(time); // expected output: 1549622069481145231n
     */
    static fullUTC(...f) {
      if (typeof BigInt != "function")
        throw new Error(e);
      return BigInt(a.fullUTCString(...f));
    }
    /**
     * Accepts the same number parameters as the PreciseDate constructor, but
     * treats them as UTC. It returns a string that represents the number of
     * nanoseconds since January 1, 1970, 00:00:00 UTC.
     *
     * @static
     *
     * @param {...number} [dateFields] The date fields.
     * @returns {string}
     *
     * @example
     * const time = PreciseDate.fullUTCString(2019, 1, 8, 10, 34, 29, 481, 145,
     * 231); console.log(time); // expected output: '1549622069481145231'
     */
    static fullUTCString(...f) {
      const p = Date.UTC(...f.slice(0, 7)), b = new a(p);
      return f.length === 9 && b.setNanoseconds(f.pop()), f.length === 8 && b.setMicroseconds(f.pop()), b.getFullTimeString();
    }
  }
  mt.PreciseDate = a;
  function s(g) {
    let f = "0";
    g = g.replace(/\.(\d+)/, (N, $) => (f = $, ".000"));
    const p = Number(d(f, 9));
    return new a(g).setNanoseconds(p);
  }
  function i({ seconds: g = 0, nanos: f = 0 }) {
    return typeof g.toNumber == "function" && (g = g.toNumber()), g = Number(g), f = Number(f), { seconds: g, nanos: f };
  }
  function o(g) {
    return typeof g == "bigint" || typeof g == "string" && /^\d+$/.test(g);
  }
  function c(g) {
    return typeof g == "object" && typeof g.seconds < "u" || typeof g.nanos == "number";
  }
  function u(g) {
    return typeof g == "string" && t.test(g);
  }
  function l(g, f) {
    return `${E(g, f)}${g}`;
  }
  function d(g, f) {
    const p = E(g, f);
    return `${g}${p}`;
  }
  function E(g, f) {
    const p = Math.max(f - g.toString().length, 0);
    return "0".repeat(p);
  }
  return mt;
}
var zl = Yl();
class Jl {
  preciseNow() {
    const n = new zl.PreciseDate().toStruct();
    return [n.seconds, n.nanos];
  }
  reset() {
  }
}
const Aa = "clock", ql = new Jl();
var Wt, Sn;
const Or = class Or {
  constructor() {
    G(this, Wt);
  }
  static getInstance() {
    return this._instance || (this._instance = new Or()), this._instance;
  }
  setGlobalClock(e) {
    return ne(Aa, e);
  }
  preciseNow() {
    return y(this, Wt, Sn).call(this).preciseNow();
  }
  reset() {
    y(this, Wt, Sn).call(this).reset();
  }
};
Wt = new WeakSet(), Sn = function() {
  return Ie(Aa) ?? ql;
}, _(Or, "_instance");
let Rn = Or;
const wa = Rn.getInstance();
var Xl = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.emit = function(e) {
    }, t;
  }()
), Ql = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getLogger = function(e, n, a) {
      return new Xl();
    }, t;
  }()
), Ia = new Ql(), ed = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, er = Symbol.for("io.opentelemetry.js.api.logs"), yt = ed;
function td(t, e, n) {
  return function(a) {
    return a === t ? e : n;
  };
}
var ka = 1, rd = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalLoggerProvider = function(e) {
      return yt[er] ? this.getLoggerProvider() : (yt[er] = td(ka, e, Ia), e);
    }, t.prototype.getLoggerProvider = function() {
      var e, n;
      return (n = (e = yt[er]) === null || e === void 0 ? void 0 : e.call(yt, ka)) !== null && n !== void 0 ? n : Ia;
    }, t.prototype.getLogger = function(e, n, a) {
      return this.getLoggerProvider().getLogger(e, n, a);
    }, t.prototype.disable = function() {
      delete yt[er];
    }, t;
  }()
), nd = rd.getInstance();
class ad {
  debug() {
  }
  log() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
  trace(e, n) {
    return n({});
  }
}
const tn = "logger", sd = new ad();
var ue, xe;
const Cr = class Cr {
  constructor() {
    G(this, ue);
  }
  static getInstance() {
    return this._instance || (this._instance = new Cr()), this._instance;
  }
  disable() {
    Ke(tn);
  }
  setGlobalTaskLogger(e) {
    return ne(tn, e);
  }
  debug(e, n) {
    y(this, ue, xe).call(this).debug(e, n);
  }
  log(e, n) {
    y(this, ue, xe).call(this).log(e, n);
  }
  info(e, n) {
    y(this, ue, xe).call(this).info(e, n);
  }
  warn(e, n) {
    y(this, ue, xe).call(this).warn(e, n);
  }
  error(e, n) {
    y(this, ue, xe).call(this).error(e, n);
  }
  trace(e, n) {
    return y(this, ue, xe).call(this).trace(e, n);
  }
};
ue = new WeakSet(), xe = function() {
  return Ie(tn) ?? sd;
}, _(Cr, "_instance");
let An = Cr;
const me = An.getInstance();
class id {
  disable() {
  }
  waitForDuration(e) {
    return Promise.resolve();
  }
  waitUntil(e) {
    return Promise.resolve();
  }
  waitForTask(e) {
    return Promise.resolve({
      ok: !1,
      id: e.id,
      error: {
        type: "INTERNAL_ERROR",
        code: Ka.CONFIGURED_INCORRECTLY
      }
    });
  }
  waitForBatch(e) {
    return Promise.resolve({
      id: e.id,
      items: []
    });
  }
}
class od {
  disable() {
  }
  start() {
    return {
      sample: () => ({ cpuTime: 0, wallTime: 0 })
    };
  }
  stop(e) {
    return e.sample();
  }
  pauseAsync(e) {
    return e();
  }
  sample() {
  }
}
const rn = "usage", cd = new od();
var _e, We;
const Pr = class Pr {
  constructor() {
    G(this, _e);
  }
  static getInstance() {
    return this._instance || (this._instance = new Pr()), this._instance;
  }
  setGlobalUsageManager(e) {
    return ne(rn, e);
  }
  disable() {
    y(this, _e, We).call(this).disable(), Ke(rn);
  }
  start() {
    return y(this, _e, We).call(this).start();
  }
  stop(e) {
    return y(this, _e, We).call(this).stop(e);
  }
  pauseAsync(e) {
    return y(this, _e, We).call(this).pauseAsync(e);
  }
  sample() {
    return y(this, _e, We).call(this).sample();
  }
};
_e = new WeakSet(), We = function() {
  return Ie(rn) ?? cd;
}, _(Pr, "_instance");
let wn = Pr;
const ze = wn.getInstance(), nn = "runtime", ud = new id();
var ve, He;
const jr = class jr {
  constructor() {
    G(this, ve);
  }
  static getInstance() {
    return this._instance || (this._instance = new jr()), this._instance;
  }
  waitForDuration(e) {
    return ze.pauseAsync(() => y(this, ve, He).call(this).waitForDuration(e));
  }
  waitUntil(e) {
    return ze.pauseAsync(() => y(this, ve, He).call(this).waitUntil(e));
  }
  waitForTask(e) {
    return ze.pauseAsync(() => y(this, ve, He).call(this).waitForTask(e));
  }
  waitForBatch(e) {
    return ze.pauseAsync(() => y(this, ve, He).call(this).waitForBatch(e));
  }
  setGlobalRuntimeManager(e) {
    return ne(nn, e);
  }
  disable() {
    y(this, ve, He).call(this).disable(), Ke(nn);
  }
};
ve = new WeakSet(), He = function() {
  return Ie(nn) ?? ud;
}, _(jr, "_instance");
let In = jr;
const Ar = In.getInstance(), an = "timeout";
class ld {
  abortAfterTimeout(e) {
    return new AbortController().signal;
  }
}
const dd = new ld();
var Ht, xn;
const Mr = class Mr {
  constructor() {
    G(this, Ht);
  }
  static getInstance() {
    return this._instance || (this._instance = new Mr()), this._instance;
  }
  get signal() {
    return y(this, Ht, xn).call(this).signal;
  }
  abortAfterTimeout(e) {
    return y(this, Ht, xn).call(this).abortAfterTimeout(e);
  }
  setGlobalManager(e) {
    return ne(an, e);
  }
  disable() {
    Ke(an);
  }
};
Ht = new WeakSet(), xn = function() {
  return Ie(an) ?? dd;
}, _(Mr, "_instance");
let kn = Mr;
const fd = kn.getInstance();
class hd {
  registerTaskMetadata(e) {
  }
  registerTaskFileMetadata(e, n) {
  }
  updateTaskMetadata(e, n) {
  }
  listTaskManifests() {
    return [];
  }
  getTaskManifest(e) {
  }
  getTask(e) {
  }
  taskExists(e) {
    return !1;
  }
  disable() {
  }
}
const sn = "task-catalog", pd = new hd();
var ee, fe;
const Ur = class Ur {
  constructor() {
    G(this, ee);
  }
  static getInstance() {
    return this._instance || (this._instance = new Ur()), this._instance;
  }
  setGlobalTaskCatalog(e) {
    return ne(sn, e);
  }
  disable() {
    Ke(sn);
  }
  registerTaskMetadata(e) {
    y(this, ee, fe).call(this).registerTaskMetadata(e);
  }
  updateTaskMetadata(e, n) {
    y(this, ee, fe).call(this).updateTaskMetadata(e, n);
  }
  registerTaskFileMetadata(e, n) {
    y(this, ee, fe).call(this).registerTaskFileMetadata(e, n);
  }
  listTaskManifests() {
    return y(this, ee, fe).call(this).listTaskManifests();
  }
  getTaskManifest(e) {
    return y(this, ee, fe).call(this).getTaskManifest(e);
  }
  getTask(e) {
    return y(this, ee, fe).call(this).getTask(e);
  }
  taskExists(e) {
    return y(this, ee, fe).call(this).taskExists(e);
  }
};
ee = new WeakSet(), fe = function() {
  return Ie(sn) ?? pd;
}, _(Ur, "_instance");
let Nn = Ur;
const _t = Nn.getInstance();
class gd extends Error {
  constructor(n, a, s) {
    var e = (...Jd) => (super(...Jd), _(this, "taskId"), _(this, "runId"), _(this, "cause"), this);
    s instanceof Error ? (e(`Error in ${n}: ${s.message}`), this.cause = s, this.name = "SubtaskUnwrapError") : (e(`Error in ${n}`), this.name = "SubtaskUnwrapError", this.cause = s), this.taskId = n, this.runId = a;
  }
}
class md extends Promise {
  constructor(n, a) {
    super(n);
    _(this, "taskId");
    this.taskId = a;
  }
  unwrap() {
    return this.then((n) => {
      if (n.ok)
        return n.output;
      throw new gd(this.taskId, n.id, n.error);
    });
  }
}
function yd(t) {
  return typeof t == "string" && t.length === 64;
}
async function On(t) {
  if (t)
    return yd(t) ? t : await _d(t, { scope: "global" });
}
async function _d(t, e) {
  return await bd([...Array.isArray(t) ? t : [t]].concat(vd((e == null ? void 0 : e.scope) ?? "run")));
}
function vd(t) {
  switch (t) {
    case "run": {
      if (D != null && D.ctx)
        return [D.ctx.run.id];
      break;
    }
    case "attempt": {
      if (D != null && D.ctx)
        return [D.ctx.attempt.id];
      break;
    }
  }
  return [];
}
async function bd(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t.join("-")));
  return Array.from(new Uint8Array(e)).map((n) => n.toString(16).padStart(2, "0")).join("");
}
function Ed(t, e) {
  e instanceof Error ? t.recordException(Td(e)) : typeof e == "string" ? t.recordException(e.replace(/\0/g, "")) : t.recordException(JSON.stringify(e).replace(/\0/g, "")), t.setStatus({ code: mr.ERROR });
}
function Td(t) {
  var n;
  const e = new Error(t.message.replace(/\0/g, ""));
  return e.name = t.name.replace(/\0/g, ""), e.stack = (n = t.stack) == null ? void 0 : n.replace(/\0/g, ""), e;
}
class Rd {
  constructor(e) {
    _(this, "_config");
    _(this, "_tracer");
    _(this, "_logger");
    this._config = e;
  }
  get tracer() {
    if (!this._tracer) {
      if ("tracer" in this._config)
        return this._config.tracer;
      this._tracer = Iu.getTracer(this._config.name, this._config.version);
    }
    return this._tracer;
  }
  get logger() {
    if (!this._logger) {
      if ("logger" in this._config)
        return this._config.logger;
      this._logger = nd.getLogger(this._config.name, this._config.version);
    }
    return this._logger;
  }
  extractContext(e) {
    return As.extract(nr.active(), e ?? {});
  }
  startActiveSpan(e, n, a, s, i) {
    const o = s ?? nr.active(), c = (a == null ? void 0 : a.attributes) ?? {};
    let u = !1;
    return this.tracer.startActiveSpan(e, {
      ...a,
      attributes: c,
      startTime: wa.preciseNow()
    }, o, async (l) => {
      i == null || i.addEventListener("abort", () => {
        u || (u = !0, Ed(l, i.reason), l.end());
      }), D.ctx && this.tracer.startSpan(e, {
        ...a,
        attributes: {
          ...c,
          [w.SPAN_PARTIAL]: !0,
          [w.SPAN_ID]: l.spanContext().spanId
        }
      }, o).end();
      const d = ze.start();
      try {
        return await n(l);
      } catch (E) {
        throw u || ((typeof E == "string" || E instanceof Error) && l.recordException(E), l.setStatus({ code: mr.ERROR })), E;
      } finally {
        if (!u) {
          if (u = !0, D.ctx) {
            const E = ze.stop(d), g = D.ctx.machine;
            l.setAttributes({
              [w.USAGE_DURATION_MS]: E.cpuTime,
              [w.USAGE_COST_IN_CENTS]: g != null && g.centsPerMs ? E.cpuTime * g.centsPerMs : 0
            });
          }
          l.end(wa.preciseNow());
        }
      }
    });
  }
  startSpan(e, n, a) {
    const s = a ?? nr.active(), i = (n == null ? void 0 : n.attributes) ?? {}, o = this.tracer.startSpan(e, n, a);
    return this.tracer.startSpan(e, {
      ...n,
      attributes: {
        ...i,
        [w.SPAN_PARTIAL]: !0,
        [w.SPAN_ID]: o.spanContext().spanId
      }
    }, s).end(), o;
  }
}
const Sd = "3.3.7", we = new Rd({ name: "@trigger.dev/sdk", version: Sd });
function Ad(t) {
  var a;
  const e = t.queue ? {
    name: ((a = t.queue) == null ? void 0 : a.name) ?? `task/${t.id}`,
    ...t.queue
  } : void 0, n = {
    id: t.id,
    description: t.description,
    trigger: async (s, i) => {
      const o = _t.getTaskManifest(t.id);
      return await wd(o && o.exportName ? `${o.exportName}.trigger()` : "trigger()", t.id, s, void 0, {
        queue: e,
        ...i
      });
    },
    batchTrigger: async (s, i) => {
      const o = _t.getTaskManifest(t.id);
      return await Id(o && o.exportName ? `${o.exportName}.batchTrigger()` : "batchTrigger()", t.id, s, i, void 0, void 0, e);
    },
    triggerAndWait: (s, i) => {
      const o = _t.getTaskManifest(t.id);
      return new md((c, u) => {
        kd(o && o.exportName ? `${o.exportName}.triggerAndWait()` : "triggerAndWait()", t.id, s, void 0, {
          queue: e,
          ...i
        }).then((l) => {
          c(l);
        }).catch((l) => {
          u(l);
        });
      }, t.id);
    },
    batchTriggerAndWait: async (s, i) => {
      const o = _t.getTaskManifest(t.id);
      return await xd(o && o.exportName ? `${o.exportName}.batchTriggerAndWait()` : "batchTriggerAndWait()", t.id, s, void 0, i, void 0, e);
    }
  };
  return _t.registerTaskMetadata({
    id: t.id,
    description: t.description,
    queue: t.queue,
    retry: t.retry ? { ...gs, ...t.retry } : void 0,
    machine: t.machine,
    maxDuration: t.maxDuration,
    fns: {
      run: t.run,
      init: t.init,
      cleanup: t.cleanup,
      middleware: t.middleware,
      handleError: t.handleError,
      onSuccess: t.onSuccess,
      onFailure: t.onFailure,
      onStart: t.onStart
    }
  }), n[Symbol.for("trigger.dev/task")] = !0, n;
}
async function wd(t, e, n, a, s, i) {
  var d, E;
  const o = Jt.clientOrThrow(), u = await Br(n);
  return await o.triggerTask(e, {
    payload: u.data,
    options: {
      queue: s == null ? void 0 : s.queue,
      concurrencyKey: s == null ? void 0 : s.concurrencyKey,
      test: (d = D.ctx) == null ? void 0 : d.run.isTest,
      payloadType: u.dataType,
      idempotencyKey: await On(s == null ? void 0 : s.idempotencyKey),
      idempotencyKeyTTL: s == null ? void 0 : s.idempotencyKeyTTL,
      delay: s == null ? void 0 : s.delay,
      ttl: s == null ? void 0 : s.ttl,
      tags: s == null ? void 0 : s.tags,
      maxAttempts: s == null ? void 0 : s.maxAttempts,
      parentAttempt: (E = D.ctx) == null ? void 0 : E.attempt.id,
      metadata: s == null ? void 0 : s.metadata,
      maxDuration: s == null ? void 0 : s.maxDuration
    }
  }, {
    spanParentAsLink: !0
  }, {
    name: t,
    tracer: we,
    icon: "trigger",
    onResponseBody: (g, f) => {
      g && typeof g == "object" && !Array.isArray(g) && "id" in g && typeof g.id == "string" && f.setAttribute("runId", g.id);
    },
    ...i
  });
}
async function Id(t, e, n, a, s, i, o) {
  const u = await Jt.clientOrThrow().batchTriggerV2({
    items: await Promise.all(n.map(async (d) => {
      var f, p, b, N, $, Z, ie, ct, ut, lt, dt, ft;
      const E = d.payload, g = await Br(E);
      return {
        task: e,
        payload: g.data,
        options: {
          queue: ((f = d.options) == null ? void 0 : f.queue) ?? o,
          concurrencyKey: (p = d.options) == null ? void 0 : p.concurrencyKey,
          test: (b = D.ctx) == null ? void 0 : b.run.isTest,
          payloadType: g.dataType,
          idempotencyKey: await On((N = d.options) == null ? void 0 : N.idempotencyKey),
          idempotencyKeyTTL: ($ = d.options) == null ? void 0 : $.idempotencyKeyTTL,
          delay: (Z = d.options) == null ? void 0 : Z.delay,
          ttl: (ie = d.options) == null ? void 0 : ie.ttl,
          tags: (ct = d.options) == null ? void 0 : ct.tags,
          maxAttempts: (ut = d.options) == null ? void 0 : ut.maxAttempts,
          parentAttempt: (lt = D.ctx) == null ? void 0 : lt.attempt.id,
          metadata: (dt = d.options) == null ? void 0 : dt.metadata,
          maxDuration: (ft = d.options) == null ? void 0 : ft.maxDuration
        }
      };
    }))
  }, {
    spanParentAsLink: !0,
    idempotencyKey: await On(a == null ? void 0 : a.idempotencyKey),
    idempotencyKeyTTL: a == null ? void 0 : a.idempotencyKeyTTL,
    processingStrategy: a != null && a.triggerSequentially ? "sequential" : void 0
  }, {
    name: t,
    tracer: we,
    icon: "trigger",
    onResponseBody(d, E) {
      d && typeof d == "object" && !Array.isArray(d) && ("id" in d && typeof d.id == "string" && E.setAttribute("batchId", d.id), "runs" in d && Array.isArray(d.runs) && E.setAttribute("runCount", d.runs.length), "isCached" in d && typeof d.isCached == "boolean" && (d.isCached && console.warn("Result is a cached response because the request was idempotent."), E.setAttribute("isCached", d.isCached)), "idempotencyKey" in d && typeof d.idempotencyKey == "string" && E.setAttribute("idempotencyKey", d.idempotencyKey));
    },
    ...i
  });
  return {
    batchId: u.id,
    isCached: u.isCached,
    idempotencyKey: u.idempotencyKey,
    runs: u.runs,
    publicAccessToken: u.publicAccessToken
  };
}
async function kd(t, e, n, a, s, i) {
  const o = D.ctx;
  if (!o)
    throw new Error("triggerAndWait can only be used from inside a task.run()");
  const c = Jt.clientOrThrow(), l = await Br(n);
  return await we.startActiveSpan(t, async (d) => {
    var f, p;
    const E = await c.triggerTask(e, {
      payload: l.data,
      options: {
        dependentAttempt: o.attempt.id,
        lockToVersion: (f = D.worker) == null ? void 0 : f.version,
        // Lock to current version because we're waiting for it to finish
        queue: s == null ? void 0 : s.queue,
        concurrencyKey: s == null ? void 0 : s.concurrencyKey,
        test: (p = D.ctx) == null ? void 0 : p.run.isTest,
        payloadType: l.dataType,
        delay: s == null ? void 0 : s.delay,
        ttl: s == null ? void 0 : s.ttl,
        tags: s == null ? void 0 : s.tags,
        maxAttempts: s == null ? void 0 : s.maxAttempts,
        metadata: s == null ? void 0 : s.metadata,
        maxDuration: s == null ? void 0 : s.maxDuration
      }
    }, {}, i);
    d.setAttribute("runId", E.id);
    const g = await Ar.waitForTask({
      id: E.id,
      ctx: o
    });
    return await Cn(g, e);
  }, {
    kind: Ft.PRODUCER,
    attributes: {
      [w.STYLE_ICON]: "trigger",
      ...Kt({
        items: [
          {
            text: e,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
}
async function xd(t, e, n, a, s, i, o) {
  const c = D.ctx;
  if (!c)
    throw new Error("batchTriggerAndWait can only be used from inside a task.run()");
  const u = Jt.clientOrThrow();
  return await we.startActiveSpan(t, async (l) => {
    const d = await u.batchTriggerV2({
      items: await Promise.all(n.map(async (f) => {
        var N, $, Z, ie, ct, ut, lt, dt, ft, Xn;
        const p = f.payload, b = await Br(p);
        return {
          task: e,
          payload: b.data,
          options: {
            lockToVersion: (N = D.worker) == null ? void 0 : N.version,
            queue: (($ = f.options) == null ? void 0 : $.queue) ?? o,
            concurrencyKey: (Z = f.options) == null ? void 0 : Z.concurrencyKey,
            test: (ie = D.ctx) == null ? void 0 : ie.run.isTest,
            payloadType: b.dataType,
            delay: (ct = f.options) == null ? void 0 : ct.delay,
            ttl: (ut = f.options) == null ? void 0 : ut.ttl,
            tags: (lt = f.options) == null ? void 0 : lt.tags,
            maxAttempts: (dt = f.options) == null ? void 0 : dt.maxAttempts,
            metadata: (ft = f.options) == null ? void 0 : ft.metadata,
            maxDuration: (Xn = f.options) == null ? void 0 : Xn.maxDuration
          }
        };
      })),
      dependentAttempt: c.attempt.id
    }, {
      processingStrategy: s != null && s.triggerSequentially ? "sequential" : void 0
    }, i);
    l.setAttribute("batchId", d.id), l.setAttribute("runCount", d.runs.length), l.setAttribute("isCached", d.isCached), d.isCached && console.warn("Result is a cached response because the request was idempotent."), d.idempotencyKey && l.setAttribute("idempotencyKey", d.idempotencyKey);
    const E = await Ar.waitForBatch({
      id: d.id,
      runs: d.runs.map((f) => f.id),
      ctx: c
    }), g = await Nd(E.items, e);
    return {
      id: E.id,
      runs: g
    };
  }, {
    kind: Ft.PRODUCER,
    attributes: {
      [w.STYLE_ICON]: "trigger",
      ...Kt({
        items: [
          {
            text: e,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
}
async function Nd(t, e) {
  return t.some((a) => a.ok && a.outputType === "application/store") ? await we.startActiveSpan("store.downloadPayloads", async (a) => await Promise.all(t.map(async (i) => await Cn(i, e))), {
    kind: Ft.INTERNAL,
    [w.STYLE_ICON]: "cloud-download"
  }) : await Promise.all(t.map(async (s) => await Cn(s, e)));
}
async function Cn(t, e) {
  if (t.ok) {
    const n = { data: t.output, dataType: t.outputType }, a = await Ns(n, we);
    return {
      ok: !0,
      id: t.id,
      taskIdentifier: t.taskIdentifier ?? e,
      output: await Wn(a)
    };
  } else
    return {
      ok: !1,
      id: t.id,
      taskIdentifier: t.taskIdentifier ?? e,
      error: Wu(t.error)
    };
}
const zs = Ad, Od = {
  for: async (t) => we.startActiveSpan("wait.for()", async (e) => {
    const n = Pd(t);
    await Ar.waitForDuration(n);
  }, {
    attributes: {
      [w.STYLE_ICON]: "wait",
      ...Kt({
        items: [
          {
            text: Cd(t),
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }),
  until: async (t) => we.startActiveSpan("wait.until()", async (e) => {
    const n = Date.now();
    if (t.throwIfInThePast && t.date < /* @__PURE__ */ new Date())
      throw new Error("Date is in the past");
    const a = t.date.getTime() - n;
    await Ar.waitForDuration(a);
  }, {
    attributes: {
      [w.STYLE_ICON]: "wait",
      ...Kt({
        items: [
          {
            text: t.date.toISOString(),
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  })
};
function Cd(t) {
  return "seconds" in t ? t.seconds === 1 ? "1 second" : `${t.seconds} seconds` : "minutes" in t ? t.minutes === 1 ? "1 minute" : `${t.minutes} minutes` : "hours" in t ? t.hours === 1 ? "1 hour" : `${t.hours} hours` : "days" in t ? t.days === 1 ? "1 day" : `${t.days} days` : "weeks" in t ? t.weeks === 1 ? "1 week" : `${t.weeks} weeks` : "months" in t ? t.months === 1 ? "1 month" : `${t.months} months` : "years" in t ? t.years === 1 ? "1 year" : `${t.years} years` : "NaN";
}
function Pd(t) {
  if ("seconds" in t)
    return t.seconds * 1e3;
  if ("minutes" in t)
    return t.minutes * 1e3 * 60;
  if ("hours" in t)
    return t.hours * 1e3 * 60 * 60;
  if ("days" in t)
    return t.days * 1e3 * 60 * 60 * 24;
  if ("weeks" in t)
    return t.weeks * 1e3 * 60 * 60 * 24 * 7;
  if ("months" in t)
    return t.months * 1e3 * 60 * 60 * 24 * 30;
  if ("years" in t)
    return t.years * 1e3 * 60 * 60 * 24 * 365;
  throw new Error("Invalid options");
}
const jd = 2147483647;
fd.signal;
const on = process.env.TINYBIRD_TOKEN ?? void 0, Dd = zs({
  id: "copy_job",
  run: async (t) => {
    if (!(on ?? t.token))
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!t.pipeId)
      throw new Error("Pipe ID not found");
    try {
      let n = `https://api.tinybird.co/v0/pipes/${t.pipeId}/copy`;
      if (t.params) {
        const u = new URLSearchParams();
        for (const [l, d] of Object.entries(t.params))
          u.append(l, d.toString());
        n += `?${u.toString()}`;
      }
      const a = await fetch(
        n,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${on}`
          }
        }
      ).then((u) => u.json());
      if (!a || !("job" in a))
        throw me.error(a), new Error("Invalid response from Tinybird API");
      const s = a.job.job_id;
      me.log("Copy job started", { jobId: s });
      let i = "";
      const o = 30;
      let c = 0;
      for (; c < o; ) {
        if (i = (await fetch(
          `https://api.tinybird.co/v0/jobs/${s}`,
          {
            headers: {
              Authorization: `Bearer ${on}`
            }
          }
        ).then((l) => l.json())).status, me.log("Job status check", { jobId: s, status: i, attempt: c + 1 }), i === "done")
          return me.log("Copy job completed successfully", { jobId: s }), { success: !0, jobId: s };
        if (i === "error" || i === "failed")
          throw new Error(`Copy job failed with status: ${i}`);
        await Od.for({ seconds: 5 }), c++;
      }
      throw new Error(`Job timed out after ${o} attempts`);
    } catch (n) {
      throw me.error("Error in Tinybird copy job", { error: n }), n;
    }
  }
}), xa = process.env.TINYBIRD_TOKEN ?? void 0;
var qn = /* @__PURE__ */ ((t) => (t.CSV = "CSV", t.CSVWithNames = "CSVWithNames", t.JSON = "JSON", t.TSV = "TSV", t.TSVWithNames = "TSVWithNames", t.PrettyCompact = "PrettyCompact", t.JSONEachRow = "JSONEachRow", t.Parquet = "Parquet", t))(qn || {});
function Js(t) {
  return Object.values(qn).includes(t);
}
function Md(t) {
  const e = t.trim().match(/FORMAT\s+(\w+)$/i);
  if (!e) return null;
  const n = e[1].toUpperCase();
  return Js(n) ? n : null;
}
const $d = zs({
  id: "tinybird-query",
  run: async (t) => {
    var i;
    if (!(xa ?? t.token))
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!t.sql)
      throw new Error("SQL query is required");
    let n = t.sql;
    const a = Md(n);
    if (t.format && !Js(t.format.toUpperCase()))
      throw new Error(`Invalid format: ${t.format}. Valid formats are: ${Object.values(qn).join(", ")}`);
    const s = ((i = t.format) == null ? void 0 : i.toUpperCase()) ?? a ?? "JSON";
    a || (n += ` FORMAT ${s}`);
    try {
      const o = await fetch(
        "https://api.tinybird.co/v0/sql",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${xa}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            q: n,
            ...t.params
          })
        }
      ), c = await o.json();
      if (console.log(c), o.status !== 200) {
        let l = {
          error: "error"
        };
        throw "error" in c && (l = c, me.error("Tinybird query failed", {
          error: l.error,
          detail: l.detail
        })), new Error(`Tinybird query failed: ${l.error}`);
      }
      const u = c;
      return me.info("Query executed successfully", u), u;
    } catch (o) {
      throw me.error("Failed to execute Tinybird query", {
        error: o instanceof Error ? o.message : "Unknown error",
        sql: t.sql
      }), o;
    }
  }
});
export {
  Dd as tinybirdCopyTask,
  $d as tinybirdQueryTask
};
