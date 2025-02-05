var Si = Object.defineProperty;
var ya = (t) => {
  throw TypeError(t);
};
var Ai = (t, e, r) => e in t ? Si(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var E = (t, e, r) => Ai(t, typeof e != "symbol" ? e + "" : e, r), sn = (t, e, r) => e.has(t) || ya("Cannot " + r);
var B = (t, e, r) => (sn(t, e, "read from private field"), r ? r.call(t) : e.get(t)), L = (t, e, r) => e.has(t) ? ya("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), Ye = (t, e, r, a) => (sn(t, e, "write to private field"), a ? a.call(t, r) : e.set(t, r), r), g = (t, e, r) => (sn(t, e, "access private method"), r);
var N;
(function(t) {
  t.assertEqual = (s) => s;
  function e(s) {
  }
  t.assertIs = e;
  function r(s) {
    throw new Error();
  }
  t.assertNever = r, t.arrayToEnum = (s) => {
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
})(N || (N = {}));
var Rn;
(function(t) {
  t.mergeShapes = (e, r) => ({
    ...e,
    ...r
    // second overwrites first
  });
})(Rn || (Rn = {}));
const _ = N.arrayToEnum([
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
]), ve = (t) => {
  switch (typeof t) {
    case "undefined":
      return _.undefined;
    case "string":
      return _.string;
    case "number":
      return isNaN(t) ? _.nan : _.number;
    case "boolean":
      return _.boolean;
    case "function":
      return _.function;
    case "bigint":
      return _.bigint;
    case "symbol":
      return _.symbol;
    case "object":
      return Array.isArray(t) ? _.array : t === null ? _.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? _.promise : typeof Map < "u" && t instanceof Map ? _.map : typeof Set < "u" && t instanceof Set ? _.set : typeof Date < "u" && t instanceof Date ? _.date : _.object;
    default:
      return _.unknown;
  }
}, h = N.arrayToEnum([
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
]), Ii = (t) => JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, "$1:");
class q extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = (a) => {
      this.issues = [...this.issues, a];
    }, this.addIssues = (a = []) => {
      this.issues = [...this.issues, ...a];
    };
    const r = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const r = e || function(i) {
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
          a._errors.push(r(o));
        else {
          let c = a, u = 0;
          for (; u < o.path.length; ) {
            const l = o.path[u];
            u === o.path.length - 1 ? (c[l] = c[l] || { _errors: [] }, c[l]._errors.push(r(o))) : c[l] = c[l] || { _errors: [] }, c = c[l], u++;
          }
        }
    };
    return s(this), a;
  }
  static assert(e) {
    if (!(e instanceof q))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, N.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (r) => r.message) {
    const r = {}, a = [];
    for (const s of this.issues)
      s.path.length > 0 ? (r[s.path[0]] = r[s.path[0]] || [], r[s.path[0]].push(e(s))) : a.push(e(s));
    return { formErrors: a, fieldErrors: r };
  }
  get formErrors() {
    return this.flatten();
  }
}
q.create = (t) => new q(t);
const ct = (t, e) => {
  let r;
  switch (t.code) {
    case h.invalid_type:
      t.received === _.undefined ? r = "Required" : r = `Expected ${t.expected}, received ${t.received}`;
      break;
    case h.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(t.expected, N.jsonStringifyReplacer)}`;
      break;
    case h.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${N.joinValues(t.keys, ", ")}`;
      break;
    case h.invalid_union:
      r = "Invalid input";
      break;
    case h.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${N.joinValues(t.options)}`;
      break;
    case h.invalid_enum_value:
      r = `Invalid enum value. Expected ${N.joinValues(t.options)}, received '${t.received}'`;
      break;
    case h.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case h.invalid_return_type:
      r = "Invalid function return type";
      break;
    case h.invalid_date:
      r = "Invalid date";
      break;
    case h.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (r = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? r = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? r = `Invalid input: must end with "${t.validation.endsWith}"` : N.assertNever(t.validation) : t.validation !== "regex" ? r = `Invalid ${t.validation}` : r = "Invalid";
      break;
    case h.too_small:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : r = "Invalid input";
      break;
    case h.too_big:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? r = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : r = "Invalid input";
      break;
    case h.custom:
      r = "Invalid input";
      break;
    case h.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case h.not_multiple_of:
      r = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case h.not_finite:
      r = "Number must be finite";
      break;
    default:
      r = e.defaultError, N.assertNever(t);
  }
  return { message: r };
};
let os = ct;
function ki(t) {
  os = t;
}
function vr() {
  return os;
}
const _r = (t) => {
  const { data: e, path: r, errorMaps: a, issueData: s } = t, i = [...r, ...s.path || []], o = {
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
}, xi = [];
function v(t, e) {
  const r = vr(), a = _r({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      t.schemaErrorMap,
      r,
      r === ct ? void 0 : ct
      // then global default map
    ].filter((s) => !!s)
  });
  t.common.issues.push(a);
}
class V {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, r) {
    const a = [];
    for (const s of r) {
      if (s.status === "aborted")
        return w;
      s.status === "dirty" && e.dirty(), a.push(s.value);
    }
    return { status: e.value, value: a };
  }
  static async mergeObjectAsync(e, r) {
    const a = [];
    for (const s of r) {
      const i = await s.key, o = await s.value;
      a.push({
        key: i,
        value: o
      });
    }
    return V.mergeObjectSync(e, a);
  }
  static mergeObjectSync(e, r) {
    const a = {};
    for (const s of r) {
      const { key: i, value: o } = s;
      if (i.status === "aborted" || o.status === "aborted")
        return w;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || s.alwaysSet) && (a[i.value] = o.value);
    }
    return { status: e.value, value: a };
  }
}
const w = Object.freeze({
  status: "aborted"
}), et = (t) => ({ status: "dirty", value: t }), W = (t) => ({ status: "valid", value: t }), wn = (t) => t.status === "aborted", Sn = (t) => t.status === "dirty", Mt = (t) => t.status === "valid", Ut = (t) => typeof Promise < "u" && t instanceof Promise;
function br(t, e, r, a) {
  if (typeof e == "function" ? t !== e || !0 : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(t);
}
function cs(t, e, r, a, s) {
  if (typeof e == "function" ? t !== e || !0 : !e.has(t)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(t, r), r;
}
var T;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(T || (T = {}));
var xt, Pt;
class oe {
  constructor(e, r, a, s) {
    this._cachedPath = [], this.parent = e, this.data = r, this._path = a, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const va = (t, e) => {
  if (Mt(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const r = new q(t.common.issues);
      return this._error = r, this._error;
    }
  };
};
function S(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: r, required_error: a, description: s } = t;
  if (e && (r || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (o, c) => {
    var u, l;
    const { message: d } = t;
    return o.code === "invalid_enum_value" ? { message: d ?? c.defaultError } : typeof c.data > "u" ? { message: (u = d ?? a) !== null && u !== void 0 ? u : c.defaultError } : o.code !== "invalid_type" ? { message: c.defaultError } : { message: (l = d ?? r) !== null && l !== void 0 ? l : c.defaultError };
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
    return ve(e.data);
  }
  _getOrReturnCtx(e, r) {
    return r || {
      common: e.parent.common,
      data: e.data,
      parsedType: ve(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new V(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: ve(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const r = this._parse(e);
    if (Ut(r))
      throw new Error("Synchronous parse encountered promise.");
    return r;
  }
  _parseAsync(e) {
    const r = this._parse(e);
    return Promise.resolve(r);
  }
  parse(e, r) {
    const a = this.safeParse(e, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  safeParse(e, r) {
    var a;
    const s = {
      common: {
        issues: [],
        async: (a = r == null ? void 0 : r.async) !== null && a !== void 0 ? a : !1,
        contextualErrorMap: r == null ? void 0 : r.errorMap
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: ve(e)
    }, i = this._parseSync({ data: e, path: s.path, parent: s });
    return va(s, i);
  }
  async parseAsync(e, r) {
    const a = await this.safeParseAsync(e, r);
    if (a.success)
      return a.data;
    throw a.error;
  }
  async safeParseAsync(e, r) {
    const a = {
      common: {
        issues: [],
        contextualErrorMap: r == null ? void 0 : r.errorMap,
        async: !0
      },
      path: (r == null ? void 0 : r.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: ve(e)
    }, s = this._parse({ data: e, path: a.path, parent: a }), i = await (Ut(s) ? s : Promise.resolve(s));
    return va(a, i);
  }
  refine(e, r) {
    const a = (s) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(s) : r;
    return this._refinement((s, i) => {
      const o = e(s), c = () => i.addIssue({
        code: h.custom,
        ...a(s)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((u) => u ? !0 : (c(), !1)) : o ? !0 : (c(), !1);
    });
  }
  refinement(e, r) {
    return this._refinement((a, s) => e(a) ? !0 : (s.addIssue(typeof r == "function" ? r(a, s) : r), !1));
  }
  _refinement(e) {
    return new te({
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return ie.create(this, this._def);
  }
  nullable() {
    return xe.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Q.create(this, this._def);
  }
  promise() {
    return lt.create(this, this._def);
  }
  or(e) {
    return Kt.create([this, e], this._def);
  }
  and(e) {
    return Ft.create(this, e, this._def);
  }
  transform(e) {
    return new te({
      ...S(this._def),
      schema: this,
      typeName: R.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const r = typeof e == "function" ? e : () => e;
    return new Wt({
      ...S(this._def),
      innerType: this,
      defaultValue: r,
      typeName: R.ZodDefault
    });
  }
  brand() {
    return new zn({
      typeName: R.ZodBranded,
      type: this,
      ...S(this._def)
    });
  }
  catch(e) {
    const r = typeof e == "function" ? e : () => e;
    return new Ht({
      ...S(this._def),
      innerType: this,
      catchValue: r,
      typeName: R.ZodCatch
    });
  }
  describe(e) {
    const r = this.constructor;
    return new r({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return nr.create(this, e);
  }
  readonly() {
    return Yt.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Pi = /^c[^\s-]{8,}$/i, Ni = /^[0-9a-z]+$/, Oi = /^[0-9A-HJKMNP-TV-Z]{26}$/, Ci = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, ji = /^[a-z0-9_-]{21}$/i, Mi = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Ui = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Di = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let on;
const $i = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Li = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, Ki = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, us = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Fi = new RegExp(`^${us}$`);
function ls(t) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function Bi(t) {
  return new RegExp(`^${ls(t)}$`);
}
function ds(t) {
  let e = `${us}T${ls(t)}`;
  const r = [];
  return r.push(t.local ? "Z?" : "Z"), t.offset && r.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${r.join("|")})`, new RegExp(`^${e}$`);
}
function Gi(t, e) {
  return !!((e === "v4" || !e) && $i.test(t) || (e === "v6" || !e) && Li.test(t));
}
class X extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== _.string) {
      const i = this._getOrReturnCtx(e);
      return v(i, {
        code: h.invalid_type,
        expected: _.string,
        received: i.parsedType
      }), w;
    }
    const a = new V();
    let s;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (s = this._getOrReturnCtx(e, s), v(s, {
          code: h.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (s = this._getOrReturnCtx(e, s), v(s, {
          code: h.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "length") {
        const o = e.data.length > i.value, c = e.data.length < i.value;
        (o || c) && (s = this._getOrReturnCtx(e, s), o ? v(s, {
          code: h.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : c && v(s, {
          code: h.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), a.dirty());
      } else if (i.kind === "email")
        Ui.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "email",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "emoji")
        on || (on = new RegExp(Di, "u")), on.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "emoji",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "uuid")
        Ci.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "uuid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "nanoid")
        ji.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "nanoid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid")
        Pi.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "cuid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid2")
        Ni.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "cuid2",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "ulid")
        Oi.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
          validation: "ulid",
          code: h.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), v(s, {
            validation: "url",
            code: h.invalid_string,
            message: i.message
          }), a.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        validation: "regex",
        code: h.invalid_string,
        message: i.message
      }), a.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), a.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "datetime" ? ds(i).test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: "datetime",
        message: i.message
      }), a.dirty()) : i.kind === "date" ? Fi.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: "date",
        message: i.message
      }), a.dirty()) : i.kind === "time" ? Bi(i).test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.invalid_string,
        validation: "time",
        message: i.message
      }), a.dirty()) : i.kind === "duration" ? Mi.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        validation: "duration",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "ip" ? Gi(e.data, i.version) || (s = this._getOrReturnCtx(e, s), v(s, {
        validation: "ip",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "base64" ? Ki.test(e.data) || (s = this._getOrReturnCtx(e, s), v(s, {
        validation: "base64",
        code: h.invalid_string,
        message: i.message
      }), a.dirty()) : N.assertNever(i);
    return { status: a.value, value: e.data };
  }
  _regex(e, r, a) {
    return this.refinement((s) => e.test(s), {
      validation: r,
      code: h.invalid_string,
      ...T.errToObj(a)
    });
  }
  _addCheck(e) {
    return new X({
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
    var r, a;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (r = e == null ? void 0 : e.offset) !== null && r !== void 0 ? r : !1,
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
  regex(e, r) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...T.errToObj(r)
    });
  }
  includes(e, r) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: r == null ? void 0 : r.position,
      ...T.errToObj(r == null ? void 0 : r.message)
    });
  }
  startsWith(e, r) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...T.errToObj(r)
    });
  }
  endsWith(e, r) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...T.errToObj(r)
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...T.errToObj(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...T.errToObj(r)
    });
  }
  length(e, r) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...T.errToObj(r)
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
    return new X({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new X({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new X({
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
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
}
X.create = (t) => {
  var e;
  return new X({
    checks: [],
    typeName: R.ZodString,
    coerce: (e = t == null ? void 0 : t.coerce) !== null && e !== void 0 ? e : !1,
    ...S(t)
  });
};
function Zi(t, e) {
  const r = (t.toString().split(".")[1] || "").length, a = (e.toString().split(".")[1] || "").length, s = r > a ? r : a, i = parseInt(t.toFixed(s).replace(".", "")), o = parseInt(e.toFixed(s).replace(".", ""));
  return i % o / Math.pow(10, s);
}
class Ae extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== _.number) {
      const i = this._getOrReturnCtx(e);
      return v(i, {
        code: h.invalid_type,
        expected: _.number,
        received: i.parsedType
      }), w;
    }
    let a;
    const s = new V();
    for (const i of this._def.checks)
      i.kind === "int" ? N.isInteger(e.data) || (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), s.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? Zi(e.data, i.value) !== 0 && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.not_finite,
        message: i.message
      }), s.dirty()) : N.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, T.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, T.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, T.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, T.toString(r));
  }
  setLimit(e, r, a, s) {
    return new Ae({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: T.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ae({
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
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(r)
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
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && N.isInteger(e.value));
  }
  get isFinite() {
    let e = null, r = null;
    for (const a of this._def.checks) {
      if (a.kind === "finite" || a.kind === "int" || a.kind === "multipleOf")
        return !0;
      a.kind === "min" ? (r === null || a.value > r) && (r = a.value) : a.kind === "max" && (e === null || a.value < e) && (e = a.value);
    }
    return Number.isFinite(r) && Number.isFinite(e);
  }
}
Ae.create = (t) => new Ae({
  checks: [],
  typeName: R.ZodNumber,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...S(t)
});
class Ie extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== _.bigint) {
      const i = this._getOrReturnCtx(e);
      return v(i, {
        code: h.invalid_type,
        expected: _.bigint,
        received: i.parsedType
      }), w;
    }
    let a;
    const s = new V();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (a = this._getOrReturnCtx(e, a), v(a, {
        code: h.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : N.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, T.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, T.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, T.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, T.toString(r));
  }
  setLimit(e, r, a, s) {
    return new Ie({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: T.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ie({
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
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: T.toString(r)
    });
  }
  get minValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
}
Ie.create = (t) => {
  var e;
  return new Ie({
    checks: [],
    typeName: R.ZodBigInt,
    coerce: (e = t == null ? void 0 : t.coerce) !== null && e !== void 0 ? e : !1,
    ...S(t)
  });
};
class Dt extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== _.boolean) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.boolean,
        received: a.parsedType
      }), w;
    }
    return W(e.data);
  }
}
Dt.create = (t) => new Dt({
  typeName: R.ZodBoolean,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...S(t)
});
class Fe extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== _.date) {
      const i = this._getOrReturnCtx(e);
      return v(i, {
        code: h.invalid_type,
        expected: _.date,
        received: i.parsedType
      }), w;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return v(i, {
        code: h.invalid_date
      }), w;
    }
    const a = new V();
    let s;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), a.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (s = this._getOrReturnCtx(e, s), v(s, {
        code: h.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), a.dirty()) : N.assertNever(i);
    return {
      status: a.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Fe({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: T.toString(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: T.toString(r)
    });
  }
  get minDate() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const r of this._def.checks)
      r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
}
Fe.create = (t) => new Fe({
  checks: [],
  coerce: (t == null ? void 0 : t.coerce) || !1,
  typeName: R.ZodDate,
  ...S(t)
});
class Er extends I {
  _parse(e) {
    if (this._getType(e) !== _.symbol) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.symbol,
        received: a.parsedType
      }), w;
    }
    return W(e.data);
  }
}
Er.create = (t) => new Er({
  typeName: R.ZodSymbol,
  ...S(t)
});
class $t extends I {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.undefined,
        received: a.parsedType
      }), w;
    }
    return W(e.data);
  }
}
$t.create = (t) => new $t({
  typeName: R.ZodUndefined,
  ...S(t)
});
class Lt extends I {
  _parse(e) {
    if (this._getType(e) !== _.null) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.null,
        received: a.parsedType
      }), w;
    }
    return W(e.data);
  }
}
Lt.create = (t) => new Lt({
  typeName: R.ZodNull,
  ...S(t)
});
class ut extends I {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return W(e.data);
  }
}
ut.create = (t) => new ut({
  typeName: R.ZodAny,
  ...S(t)
});
class $e extends I {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return W(e.data);
  }
}
$e.create = (t) => new $e({
  typeName: R.ZodUnknown,
  ...S(t)
});
class he extends I {
  _parse(e) {
    const r = this._getOrReturnCtx(e);
    return v(r, {
      code: h.invalid_type,
      expected: _.never,
      received: r.parsedType
    }), w;
  }
}
he.create = (t) => new he({
  typeName: R.ZodNever,
  ...S(t)
});
class Tr extends I {
  _parse(e) {
    if (this._getType(e) !== _.undefined) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.void,
        received: a.parsedType
      }), w;
    }
    return W(e.data);
  }
}
Tr.create = (t) => new Tr({
  typeName: R.ZodVoid,
  ...S(t)
});
class Q extends I {
  _parse(e) {
    const { ctx: r, status: a } = this._processInputParams(e), s = this._def;
    if (r.parsedType !== _.array)
      return v(r, {
        code: h.invalid_type,
        expected: _.array,
        received: r.parsedType
      }), w;
    if (s.exactLength !== null) {
      const o = r.data.length > s.exactLength.value, c = r.data.length < s.exactLength.value;
      (o || c) && (v(r, {
        code: o ? h.too_big : h.too_small,
        minimum: c ? s.exactLength.value : void 0,
        maximum: o ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), a.dirty());
    }
    if (s.minLength !== null && r.data.length < s.minLength.value && (v(r, {
      code: h.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), a.dirty()), s.maxLength !== null && r.data.length > s.maxLength.value && (v(r, {
      code: h.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), a.dirty()), r.common.async)
      return Promise.all([...r.data].map((o, c) => s.type._parseAsync(new oe(r, o, r.path, c)))).then((o) => V.mergeArray(a, o));
    const i = [...r.data].map((o, c) => s.type._parseSync(new oe(r, o, r.path, c)));
    return V.mergeArray(a, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new Q({
      ...this._def,
      minLength: { value: e, message: T.toString(r) }
    });
  }
  max(e, r) {
    return new Q({
      ...this._def,
      maxLength: { value: e, message: T.toString(r) }
    });
  }
  length(e, r) {
    return new Q({
      ...this._def,
      exactLength: { value: e, message: T.toString(r) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Q.create = (t, e) => new Q({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: R.ZodArray,
  ...S(e)
});
function qe(t) {
  if (t instanceof U) {
    const e = {};
    for (const r in t.shape) {
      const a = t.shape[r];
      e[r] = ie.create(qe(a));
    }
    return new U({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof Q ? new Q({
    ...t._def,
    type: qe(t.element)
  }) : t instanceof ie ? ie.create(qe(t.unwrap())) : t instanceof xe ? xe.create(qe(t.unwrap())) : t instanceof ce ? ce.create(t.items.map((e) => qe(e))) : t;
}
class U extends I {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), r = N.objectKeys(e);
    return this._cached = { shape: e, keys: r };
  }
  _parse(e) {
    if (this._getType(e) !== _.object) {
      const l = this._getOrReturnCtx(e);
      return v(l, {
        code: h.invalid_type,
        expected: _.object,
        received: l.parsedType
      }), w;
    }
    const { status: a, ctx: s } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), c = [];
    if (!(this._def.catchall instanceof he && this._def.unknownKeys === "strip"))
      for (const l in s.data)
        o.includes(l) || c.push(l);
    const u = [];
    for (const l of o) {
      const d = i[l], y = s.data[l];
      u.push({
        key: { status: "valid", value: l },
        value: d._parse(new oe(s, y, s.path, l)),
        alwaysSet: l in s.data
      });
    }
    if (this._def.catchall instanceof he) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const d of c)
          u.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: s.data[d] }
          });
      else if (l === "strict")
        c.length > 0 && (v(s, {
          code: h.unrecognized_keys,
          keys: c
        }), a.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const d of c) {
        const y = s.data[d];
        u.push({
          key: { status: "valid", value: d },
          value: l._parse(
            new oe(s, y, s.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const l = [];
      for (const d of u) {
        const y = await d.key, p = await d.value;
        l.push({
          key: y,
          value: p,
          alwaysSet: d.alwaysSet
        });
      }
      return l;
    }).then((l) => V.mergeObjectSync(a, l)) : V.mergeObjectSync(a, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return T.errToObj, new U({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (r, a) => {
          var s, i, o, c;
          const u = (o = (i = (s = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(s, r, a).message) !== null && o !== void 0 ? o : a.defaultError;
          return r.code === "unrecognized_keys" ? {
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
  setKey(e, r) {
    return this.augment({ [e]: r });
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
    const r = {};
    return N.objectKeys(e).forEach((a) => {
      e[a] && this.shape[a] && (r[a] = this.shape[a]);
    }), new U({
      ...this._def,
      shape: () => r
    });
  }
  omit(e) {
    const r = {};
    return N.objectKeys(this.shape).forEach((a) => {
      e[a] || (r[a] = this.shape[a]);
    }), new U({
      ...this._def,
      shape: () => r
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return qe(this);
  }
  partial(e) {
    const r = {};
    return N.objectKeys(this.shape).forEach((a) => {
      const s = this.shape[a];
      e && !e[a] ? r[a] = s : r[a] = s.optional();
    }), new U({
      ...this._def,
      shape: () => r
    });
  }
  required(e) {
    const r = {};
    return N.objectKeys(this.shape).forEach((a) => {
      if (e && !e[a])
        r[a] = this.shape[a];
      else {
        let i = this.shape[a];
        for (; i instanceof ie; )
          i = i._def.innerType;
        r[a] = i;
      }
    }), new U({
      ...this._def,
      shape: () => r
    });
  }
  keyof() {
    return fs(N.objectKeys(this.shape));
  }
}
U.create = (t, e) => new U({
  shape: () => t,
  unknownKeys: "strip",
  catchall: he.create(),
  typeName: R.ZodObject,
  ...S(e)
});
U.strictCreate = (t, e) => new U({
  shape: () => t,
  unknownKeys: "strict",
  catchall: he.create(),
  typeName: R.ZodObject,
  ...S(e)
});
U.lazycreate = (t, e) => new U({
  shape: t,
  unknownKeys: "strip",
  catchall: he.create(),
  typeName: R.ZodObject,
  ...S(e)
});
class Kt extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = this._def.options;
    function s(i) {
      for (const c of i)
        if (c.result.status === "valid")
          return c.result;
      for (const c of i)
        if (c.result.status === "dirty")
          return r.common.issues.push(...c.ctx.common.issues), c.result;
      const o = i.map((c) => new q(c.ctx.common.issues));
      return v(r, {
        code: h.invalid_union,
        unionErrors: o
      }), w;
    }
    if (r.common.async)
      return Promise.all(a.map(async (i) => {
        const o = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: r.data,
            path: r.path,
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
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        }, d = u._parseSync({
          data: r.data,
          path: r.path,
          parent: l
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: l }), l.common.issues.length && o.push(l.common.issues);
      }
      if (i)
        return r.common.issues.push(...i.ctx.common.issues), i.result;
      const c = o.map((u) => new q(u));
      return v(r, {
        code: h.invalid_union,
        unionErrors: c
      }), w;
    }
  }
  get options() {
    return this._def.options;
  }
}
Kt.create = (t, e) => new Kt({
  options: t,
  typeName: R.ZodUnion,
  ...S(e)
});
const le = (t) => t instanceof Gt ? le(t.schema) : t instanceof te ? le(t.innerType()) : t instanceof Zt ? [t.value] : t instanceof ke ? t.options : t instanceof Vt ? N.objectValues(t.enum) : t instanceof Wt ? le(t._def.innerType) : t instanceof $t ? [void 0] : t instanceof Lt ? [null] : t instanceof ie ? [void 0, ...le(t.unwrap())] : t instanceof xe ? [null, ...le(t.unwrap())] : t instanceof zn || t instanceof Yt ? le(t.unwrap()) : t instanceof Ht ? le(t._def.innerType) : [];
class zr extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== _.object)
      return v(r, {
        code: h.invalid_type,
        expected: _.object,
        received: r.parsedType
      }), w;
    const a = this.discriminator, s = r.data[a], i = this.optionsMap.get(s);
    return i ? r.common.async ? i._parseAsync({
      data: r.data,
      path: r.path,
      parent: r
    }) : i._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }) : (v(r, {
      code: h.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), w);
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
  static create(e, r, a) {
    const s = /* @__PURE__ */ new Map();
    for (const i of r) {
      const o = le(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const c of o) {
        if (s.has(c))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(c)}`);
        s.set(c, i);
      }
    }
    return new zr({
      typeName: R.ZodDiscriminatedUnion,
      discriminator: e,
      options: r,
      optionsMap: s,
      ...S(a)
    });
  }
}
function An(t, e) {
  const r = ve(t), a = ve(e);
  if (t === e)
    return { valid: !0, data: t };
  if (r === _.object && a === _.object) {
    const s = N.objectKeys(e), i = N.objectKeys(t).filter((c) => s.indexOf(c) !== -1), o = { ...t, ...e };
    for (const c of i) {
      const u = An(t[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (r === _.array && a === _.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const o = t[i], c = e[i], u = An(o, c);
      if (!u.valid)
        return { valid: !1 };
      s.push(u.data);
    }
    return { valid: !0, data: s };
  } else return r === _.date && a === _.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class Ft extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), s = (i, o) => {
      if (wn(i) || wn(o))
        return w;
      const c = An(i.value, o.value);
      return c.valid ? ((Sn(i) || Sn(o)) && r.dirty(), { status: r.value, value: c.data }) : (v(a, {
        code: h.invalid_intersection_types
      }), w);
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
Ft.create = (t, e, r) => new Ft({
  left: t,
  right: e,
  typeName: R.ZodIntersection,
  ...S(r)
});
class ce extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== _.array)
      return v(a, {
        code: h.invalid_type,
        expected: _.array,
        received: a.parsedType
      }), w;
    if (a.data.length < this._def.items.length)
      return v(a, {
        code: h.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), w;
    !this._def.rest && a.data.length > this._def.items.length && (v(a, {
      code: h.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), r.dirty());
    const i = [...a.data].map((o, c) => {
      const u = this._def.items[c] || this._def.rest;
      return u ? u._parse(new oe(a, o, a.path, c)) : null;
    }).filter((o) => !!o);
    return a.common.async ? Promise.all(i).then((o) => V.mergeArray(r, o)) : V.mergeArray(r, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new ce({
      ...this._def,
      rest: e
    });
  }
}
ce.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new ce({
    items: t,
    typeName: R.ZodTuple,
    rest: null,
    ...S(e)
  });
};
class Bt extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== _.object)
      return v(a, {
        code: h.invalid_type,
        expected: _.object,
        received: a.parsedType
      }), w;
    const s = [], i = this._def.keyType, o = this._def.valueType;
    for (const c in a.data)
      s.push({
        key: i._parse(new oe(a, c, a.path, c)),
        value: o._parse(new oe(a, a.data[c], a.path, c)),
        alwaysSet: c in a.data
      });
    return a.common.async ? V.mergeObjectAsync(r, s) : V.mergeObjectSync(r, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, r, a) {
    return r instanceof I ? new Bt({
      keyType: e,
      valueType: r,
      typeName: R.ZodRecord,
      ...S(a)
    }) : new Bt({
      keyType: X.create(),
      valueType: e,
      typeName: R.ZodRecord,
      ...S(r)
    });
  }
}
class Rr extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== _.map)
      return v(a, {
        code: h.invalid_type,
        expected: _.map,
        received: a.parsedType
      }), w;
    const s = this._def.keyType, i = this._def.valueType, o = [...a.data.entries()].map(([c, u], l) => ({
      key: s._parse(new oe(a, c, a.path, [l, "key"])),
      value: i._parse(new oe(a, u, a.path, [l, "value"]))
    }));
    if (a.common.async) {
      const c = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of o) {
          const l = await u.key, d = await u.value;
          if (l.status === "aborted" || d.status === "aborted")
            return w;
          (l.status === "dirty" || d.status === "dirty") && r.dirty(), c.set(l.value, d.value);
        }
        return { status: r.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const l = u.key, d = u.value;
        if (l.status === "aborted" || d.status === "aborted")
          return w;
        (l.status === "dirty" || d.status === "dirty") && r.dirty(), c.set(l.value, d.value);
      }
      return { status: r.value, value: c };
    }
  }
}
Rr.create = (t, e, r) => new Rr({
  valueType: e,
  keyType: t,
  typeName: R.ZodMap,
  ...S(r)
});
class Be extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== _.set)
      return v(a, {
        code: h.invalid_type,
        expected: _.set,
        received: a.parsedType
      }), w;
    const s = this._def;
    s.minSize !== null && a.data.size < s.minSize.value && (v(a, {
      code: h.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), r.dirty()), s.maxSize !== null && a.data.size > s.maxSize.value && (v(a, {
      code: h.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), r.dirty());
    const i = this._def.valueType;
    function o(u) {
      const l = /* @__PURE__ */ new Set();
      for (const d of u) {
        if (d.status === "aborted")
          return w;
        d.status === "dirty" && r.dirty(), l.add(d.value);
      }
      return { status: r.value, value: l };
    }
    const c = [...a.data.values()].map((u, l) => i._parse(new oe(a, u, a.path, l)));
    return a.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, r) {
    return new Be({
      ...this._def,
      minSize: { value: e, message: T.toString(r) }
    });
  }
  max(e, r) {
    return new Be({
      ...this._def,
      maxSize: { value: e, message: T.toString(r) }
    });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Be.create = (t, e) => new Be({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: R.ZodSet,
  ...S(e)
});
class rt extends I {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== _.function)
      return v(r, {
        code: h.invalid_type,
        expected: _.function,
        received: r.parsedType
      }), w;
    function a(c, u) {
      return _r({
        data: c,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          vr(),
          ct
        ].filter((l) => !!l),
        issueData: {
          code: h.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function s(c, u) {
      return _r({
        data: c,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          vr(),
          ct
        ].filter((l) => !!l),
        issueData: {
          code: h.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const i = { errorMap: r.common.contextualErrorMap }, o = r.data;
    if (this._def.returns instanceof lt) {
      const c = this;
      return W(async function(...u) {
        const l = new q([]), d = await c._def.args.parseAsync(u, i).catch((f) => {
          throw l.addIssue(a(u, f)), l;
        }), y = await Reflect.apply(o, this, d);
        return await c._def.returns._def.type.parseAsync(y, i).catch((f) => {
          throw l.addIssue(s(y, f)), l;
        });
      });
    } else {
      const c = this;
      return W(function(...u) {
        const l = c._def.args.safeParse(u, i);
        if (!l.success)
          throw new q([a(u, l.error)]);
        const d = Reflect.apply(o, this, l.data), y = c._def.returns.safeParse(d, i);
        if (!y.success)
          throw new q([s(d, y.error)]);
        return y.data;
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
    return new rt({
      ...this._def,
      args: ce.create(e).rest($e.create())
    });
  }
  returns(e) {
    return new rt({
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
  static create(e, r, a) {
    return new rt({
      args: e || ce.create([]).rest($e.create()),
      returns: r || $e.create(),
      typeName: R.ZodFunction,
      ...S(a)
    });
  }
}
class Gt extends I {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
  }
}
Gt.create = (t, e) => new Gt({
  getter: t,
  typeName: R.ZodLazy,
  ...S(e)
});
class Zt extends I {
  _parse(e) {
    if (e.data !== this._def.value) {
      const r = this._getOrReturnCtx(e);
      return v(r, {
        received: r.data,
        code: h.invalid_literal,
        expected: this._def.value
      }), w;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Zt.create = (t, e) => new Zt({
  value: t,
  typeName: R.ZodLiteral,
  ...S(e)
});
function fs(t, e) {
  return new ke({
    values: t,
    typeName: R.ZodEnum,
    ...S(e)
  });
}
class ke extends I {
  constructor() {
    super(...arguments), xt.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return v(r, {
        expected: N.joinValues(a),
        received: r.parsedType,
        code: h.invalid_type
      }), w;
    }
    if (br(this, xt) || cs(this, xt, new Set(this._def.values)), !br(this, xt).has(e.data)) {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return v(r, {
        received: r.data,
        code: h.invalid_enum_value,
        options: a
      }), w;
    }
    return W(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  get Values() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  get Enum() {
    const e = {};
    for (const r of this._def.values)
      e[r] = r;
    return e;
  }
  extract(e, r = this._def) {
    return ke.create(e, {
      ...this._def,
      ...r
    });
  }
  exclude(e, r = this._def) {
    return ke.create(this.options.filter((a) => !e.includes(a)), {
      ...this._def,
      ...r
    });
  }
}
xt = /* @__PURE__ */ new WeakMap();
ke.create = fs;
class Vt extends I {
  constructor() {
    super(...arguments), Pt.set(this, void 0);
  }
  _parse(e) {
    const r = N.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(e);
    if (a.parsedType !== _.string && a.parsedType !== _.number) {
      const s = N.objectValues(r);
      return v(a, {
        expected: N.joinValues(s),
        received: a.parsedType,
        code: h.invalid_type
      }), w;
    }
    if (br(this, Pt) || cs(this, Pt, new Set(N.getValidEnumValues(this._def.values))), !br(this, Pt).has(e.data)) {
      const s = N.objectValues(r);
      return v(a, {
        received: a.data,
        code: h.invalid_enum_value,
        options: s
      }), w;
    }
    return W(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Pt = /* @__PURE__ */ new WeakMap();
Vt.create = (t, e) => new Vt({
  values: t,
  typeName: R.ZodNativeEnum,
  ...S(e)
});
class lt extends I {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== _.promise && r.common.async === !1)
      return v(r, {
        code: h.invalid_type,
        expected: _.promise,
        received: r.parsedType
      }), w;
    const a = r.parsedType === _.promise ? r.data : Promise.resolve(r.data);
    return W(a.then((s) => this._def.type.parseAsync(s, {
      path: r.path,
      errorMap: r.common.contextualErrorMap
    })));
  }
}
lt.create = (t, e) => new lt({
  type: t,
  typeName: R.ZodPromise,
  ...S(e)
});
class te extends I {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === R.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), s = this._def.effect || null, i = {
      addIssue: (o) => {
        v(a, o), o.fatal ? r.abort() : r.dirty();
      },
      get path() {
        return a.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), s.type === "preprocess") {
      const o = s.transform(a.data, i);
      if (a.common.async)
        return Promise.resolve(o).then(async (c) => {
          if (r.value === "aborted")
            return w;
          const u = await this._def.schema._parseAsync({
            data: c,
            path: a.path,
            parent: a
          });
          return u.status === "aborted" ? w : u.status === "dirty" || r.value === "dirty" ? et(u.value) : u;
        });
      {
        if (r.value === "aborted")
          return w;
        const c = this._def.schema._parseSync({
          data: o,
          path: a.path,
          parent: a
        });
        return c.status === "aborted" ? w : c.status === "dirty" || r.value === "dirty" ? et(c.value) : c;
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
        return c.status === "aborted" ? w : (c.status === "dirty" && r.dirty(), o(c.value), { status: r.value, value: c.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((c) => c.status === "aborted" ? w : (c.status === "dirty" && r.dirty(), o(c.value).then(() => ({ status: r.value, value: c.value }))));
    }
    if (s.type === "transform")
      if (a.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!Mt(o))
          return o;
        const c = s.transform(o.value, i);
        if (c instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: r.value, value: c };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((o) => Mt(o) ? Promise.resolve(s.transform(o.value, i)).then((c) => ({ status: r.value, value: c })) : o);
    N.assertNever(s);
  }
}
te.create = (t, e, r) => new te({
  schema: t,
  typeName: R.ZodEffects,
  effect: e,
  ...S(r)
});
te.createWithPreprocess = (t, e, r) => new te({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: R.ZodEffects,
  ...S(r)
});
class ie extends I {
  _parse(e) {
    return this._getType(e) === _.undefined ? W(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ie.create = (t, e) => new ie({
  innerType: t,
  typeName: R.ZodOptional,
  ...S(e)
});
class xe extends I {
  _parse(e) {
    return this._getType(e) === _.null ? W(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
xe.create = (t, e) => new xe({
  innerType: t,
  typeName: R.ZodNullable,
  ...S(e)
});
class Wt extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    let a = r.data;
    return r.parsedType === _.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Wt.create = (t, e) => new Wt({
  innerType: t,
  typeName: R.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...S(e)
});
class Ht extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = {
      ...r,
      common: {
        ...r.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: a.data,
      path: a.path,
      parent: {
        ...a
      }
    });
    return Ut(s) ? s.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new q(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new q(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Ht.create = (t, e) => new Ht({
  innerType: t,
  typeName: R.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...S(e)
});
class wr extends I {
  _parse(e) {
    if (this._getType(e) !== _.nan) {
      const a = this._getOrReturnCtx(e);
      return v(a, {
        code: h.invalid_type,
        expected: _.nan,
        received: a.parsedType
      }), w;
    }
    return { status: "valid", value: e.data };
  }
}
wr.create = (t) => new wr({
  typeName: R.ZodNaN,
  ...S(t)
});
const Vi = Symbol("zod_brand");
class zn extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = r.data;
    return this._def.type._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class nr extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? w : i.status === "dirty" ? (r.dirty(), et(i.value)) : this._def.out._parseAsync({
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
      return s.status === "aborted" ? w : s.status === "dirty" ? (r.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: a.path,
        parent: a
      });
    }
  }
  static create(e, r) {
    return new nr({
      in: e,
      out: r,
      typeName: R.ZodPipeline
    });
  }
}
class Yt extends I {
  _parse(e) {
    const r = this._def.innerType._parse(e), a = (s) => (Mt(s) && (s.value = Object.freeze(s.value)), s);
    return Ut(r) ? r.then((s) => a(s)) : a(r);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Yt.create = (t, e) => new Yt({
  innerType: t,
  typeName: R.ZodReadonly,
  ...S(e)
});
function hs(t, e = {}, r) {
  return t ? ut.create().superRefine((a, s) => {
    var i, o;
    if (!t(a)) {
      const c = typeof e == "function" ? e(a) : typeof e == "string" ? { message: e } : e, u = (o = (i = c.fatal) !== null && i !== void 0 ? i : r) !== null && o !== void 0 ? o : !0, l = typeof c == "string" ? { message: c } : c;
      s.addIssue({ code: "custom", ...l, fatal: u });
    }
  }) : ut.create();
}
const Wi = {
  object: U.lazycreate
};
var R;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(R || (R = {}));
const Hi = (t, e = {
  message: `Input not instance of ${t.name}`
}) => hs((r) => r instanceof t, e), ps = X.create, gs = Ae.create, Yi = wr.create, zi = Ie.create, ms = Dt.create, qi = Fe.create, Ji = Er.create, Xi = $t.create, Qi = Lt.create, eo = ut.create, to = $e.create, ro = he.create, no = Tr.create, ao = Q.create, so = U.create, io = U.strictCreate, oo = Kt.create, co = zr.create, uo = Ft.create, lo = ce.create, fo = Bt.create, ho = Rr.create, po = Be.create, go = rt.create, mo = Gt.create, yo = Zt.create, vo = ke.create, _o = Vt.create, bo = lt.create, _a = te.create, Eo = ie.create, To = xe.create, Ro = te.createWithPreprocess, wo = nr.create, So = () => ps().optional(), Ao = () => gs().optional(), Io = () => ms().optional(), ko = {
  string: (t) => X.create({ ...t, coerce: !0 }),
  number: (t) => Ae.create({ ...t, coerce: !0 }),
  boolean: (t) => Dt.create({
    ...t,
    coerce: !0
  }),
  bigint: (t) => Ie.create({ ...t, coerce: !0 }),
  date: (t) => Fe.create({ ...t, coerce: !0 })
}, xo = w;
var n = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: ct,
  setErrorMap: ki,
  getErrorMap: vr,
  makeIssue: _r,
  EMPTY_PATH: xi,
  addIssueToContext: v,
  ParseStatus: V,
  INVALID: w,
  DIRTY: et,
  OK: W,
  isAborted: wn,
  isDirty: Sn,
  isValid: Mt,
  isAsync: Ut,
  get util() {
    return N;
  },
  get objectUtil() {
    return Rn;
  },
  ZodParsedType: _,
  getParsedType: ve,
  ZodType: I,
  datetimeRegex: ds,
  ZodString: X,
  ZodNumber: Ae,
  ZodBigInt: Ie,
  ZodBoolean: Dt,
  ZodDate: Fe,
  ZodSymbol: Er,
  ZodUndefined: $t,
  ZodNull: Lt,
  ZodAny: ut,
  ZodUnknown: $e,
  ZodNever: he,
  ZodVoid: Tr,
  ZodArray: Q,
  ZodObject: U,
  ZodUnion: Kt,
  ZodDiscriminatedUnion: zr,
  ZodIntersection: Ft,
  ZodTuple: ce,
  ZodRecord: Bt,
  ZodMap: Rr,
  ZodSet: Be,
  ZodFunction: rt,
  ZodLazy: Gt,
  ZodLiteral: Zt,
  ZodEnum: ke,
  ZodNativeEnum: Vt,
  ZodPromise: lt,
  ZodEffects: te,
  ZodTransformer: te,
  ZodOptional: ie,
  ZodNullable: xe,
  ZodDefault: Wt,
  ZodCatch: Ht,
  ZodNaN: wr,
  BRAND: Vi,
  ZodBranded: zn,
  ZodPipeline: nr,
  ZodReadonly: Yt,
  custom: hs,
  Schema: I,
  ZodSchema: I,
  late: Wi,
  get ZodFirstPartyTypeKind() {
    return R;
  },
  coerce: ko,
  any: eo,
  array: ao,
  bigint: zi,
  boolean: ms,
  date: qi,
  discriminatedUnion: co,
  effect: _a,
  enum: vo,
  function: go,
  instanceof: Hi,
  intersection: uo,
  lazy: mo,
  literal: yo,
  map: ho,
  nan: Yi,
  nativeEnum: _o,
  never: ro,
  null: Qi,
  nullable: To,
  number: gs,
  object: so,
  oboolean: Io,
  onumber: Ao,
  optional: Eo,
  ostring: So,
  pipeline: wo,
  preprocess: Ro,
  promise: bo,
  record: fo,
  set: po,
  strictObject: io,
  string: ps,
  symbol: Ji,
  transformer: _a,
  tuple: lo,
  undefined: Xi,
  union: oo,
  unknown: to,
  void: no,
  NEVER: xo,
  ZodIssueCode: h,
  quotelessJson: Ii,
  ZodError: q
});
const ba = "3.3.13", Po = "HS256", No = "https://id.trigger.dev", Oo = "https://api.trigger.dev";
async function Ea(t) {
  const { SignJWT: e } = await import("./index-BSvgqMFY.js"), r = new TextEncoder().encode(t.secretKey);
  return new e(t.payload).setIssuer(No).setAudience(Oo).setProtectedHeader({ alg: Po }).setIssuedAt().setExpirationTime(t.expirationTime ?? "15m").sign(r);
}
n.object({
  url: n.string().url(),
  authorizationCode: n.string()
});
n.object({
  authorizationCode: n.string()
});
n.object({
  token: n.object({
    token: n.string(),
    obfuscatedToken: n.string()
  }).nullable()
});
const Co = n.union([n.string(), n.number(), n.boolean(), n.null()]), Pe = n.lazy(() => n.union([Co, n.array(Pe), n.record(Pe)])), jo = n.union([
  n.string(),
  n.number(),
  n.boolean(),
  n.null(),
  n.date(),
  n.undefined(),
  n.symbol()
]), Ta = n.lazy(() => n.union([jo, n.array(Ta), n.record(Ta)])), Mo = n.object({
  type: n.literal("update"),
  value: n.record(n.unknown())
}), Uo = n.object({
  type: n.literal("set"),
  key: n.string(),
  value: Pe
}), Do = n.object({
  type: n.literal("delete"),
  key: n.string()
}), $o = n.object({
  type: n.literal("append"),
  key: n.string(),
  value: Pe
}), Lo = n.object({
  type: n.literal("remove"),
  key: n.string(),
  value: Pe
}), Ko = n.object({
  type: n.literal("increment"),
  key: n.string(),
  value: n.number()
}), cn = n.discriminatedUnion("type", [
  Mo,
  Uo,
  Do,
  $o,
  Lo,
  Ko
]), ys = n.object({
  metadata: n.record(Pe).optional(),
  operations: n.array(cn).optional(),
  parentOperations: n.array(cn).optional(),
  rootOperations: n.array(cn).optional()
}), Fo = n.union([
  n.literal(0.25),
  n.literal(0.5),
  n.literal(1),
  n.literal(2),
  n.literal(4)
]), Bo = n.union([
  n.literal(0.25),
  n.literal(0.5),
  n.literal(1),
  n.literal(2),
  n.literal(4),
  n.literal(8)
]), qr = n.enum([
  "micro",
  "small-1x",
  "small-2x",
  "medium-1x",
  "medium-2x",
  "large-1x",
  "large-2x"
]), vs = n.object({
  cpu: Fo.optional(),
  memory: Bo.optional(),
  preset: qr.optional()
}), ar = n.object({
  name: qr,
  cpu: n.number(),
  memory: n.number(),
  centsPerMs: n.number()
}), Go = n.object({
  type: n.literal("BUILT_IN_ERROR"),
  name: n.string(),
  message: n.string(),
  stackTrace: n.string()
}), Zo = n.object({
  type: n.literal("CUSTOM_ERROR"),
  raw: n.string()
}), Vo = n.object({
  type: n.literal("STRING_ERROR"),
  raw: n.string()
}), qn = n.object({
  type: n.literal("INTERNAL_ERROR"),
  code: n.enum([
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
    "OUTDATED_SDK_VERSION",
    "TASK_DID_CONCURRENT_WAIT"
  ]),
  message: n.string().optional(),
  stackTrace: n.string().optional()
}), _s = qn.shape.code.enum, bs = n.discriminatedUnion("type", [
  Go,
  Zo,
  Vo,
  qn
]), Es = n.object({
  id: n.string(),
  payload: n.string(),
  payloadType: n.string(),
  context: n.any(),
  tags: n.array(n.string()),
  isTest: n.boolean().default(!1),
  createdAt: n.coerce.date(),
  startedAt: n.coerce.date().default(() => /* @__PURE__ */ new Date()),
  idempotencyKey: n.string().optional(),
  maxAttempts: n.number().optional(),
  durationMs: n.number().default(0),
  costInCents: n.number().default(0),
  baseCostInCents: n.number().default(0),
  version: n.string().optional(),
  metadata: n.record(Pe).optional(),
  maxDuration: n.number().optional()
}), Ts = n.object({
  id: n.string(),
  filePath: n.string(),
  exportName: n.string()
}), Rs = n.object({
  id: n.string(),
  number: n.number(),
  startedAt: n.coerce.date(),
  backgroundWorkerId: n.string(),
  backgroundWorkerTaskId: n.string(),
  status: n.string()
}), ws = n.object({
  id: n.string(),
  slug: n.string(),
  type: n.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"])
}), Ss = n.object({
  id: n.string(),
  slug: n.string(),
  name: n.string()
}), As = n.object({
  id: n.string(),
  ref: n.string(),
  slug: n.string(),
  name: n.string()
}), Is = n.object({
  id: n.string(),
  name: n.string()
}), ks = n.object({
  id: n.string()
}), pe = n.object({
  task: Ts,
  attempt: Rs,
  run: Es,
  queue: Is,
  environment: ws,
  organization: Ss,
  project: As,
  batch: ks.optional(),
  machine: ar.optional()
});
n.object({
  task: Ts,
  attempt: Rs.omit({
    backgroundWorkerId: !0,
    backgroundWorkerTaskId: !0
  }),
  run: Es.omit({ payload: !0, payloadType: !0, metadata: !0 }),
  queue: Is,
  environment: ws,
  organization: Ss,
  project: As,
  batch: ks.optional(),
  machine: ar.optional()
});
const Wo = n.object({
  timestamp: n.number(),
  delay: n.number(),
  error: n.unknown().optional()
}), xs = n.object({
  durationMs: n.number()
}), Jr = n.object({
  ok: n.literal(!1),
  id: n.string(),
  error: bs,
  retry: Wo.optional(),
  skippedRetrying: n.boolean().optional(),
  usage: xs.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: n.string().optional(),
  metadata: ys.optional()
}), Ho = n.object({
  ok: n.literal(!0),
  id: n.string(),
  output: n.string().optional(),
  outputType: n.string(),
  usage: xs.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: n.string().optional(),
  metadata: ys.optional()
}), re = n.discriminatedUnion("ok", [
  Ho,
  Jr
]), Yo = n.object({
  id: n.string(),
  items: re.array()
}), Ra = n.object({
  message: n.string(),
  name: n.string().optional(),
  stackTrace: n.string().optional()
}), hr = n.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"]);
n.object({
  execution: pe,
  traceContext: n.record(n.unknown()),
  environment: n.record(n.string()).optional()
});
const Jn = pe.extend({
  worker: n.object({
    id: n.string(),
    contentHash: n.string(),
    version: n.string()
  }),
  machine: ar.default({ name: "small-1x", cpu: 1, memory: 1, centsPerMs: 0 })
}), Sr = n.object({
  execution: Jn,
  traceContext: n.record(n.unknown()),
  environment: n.record(n.string()).optional()
}), zo = n.object({
  type: n.literal("fixed-window"),
  limit: n.number(),
  window: n.union([
    n.object({
      seconds: n.number()
    }),
    n.object({
      minutes: n.number()
    }),
    n.object({
      hours: n.number()
    })
  ])
}), qo = n.object({
  type: n.literal("sliding-window"),
  limit: n.number(),
  window: n.union([
    n.object({
      seconds: n.number()
    }),
    n.object({
      minutes: n.number()
    }),
    n.object({
      hours: n.number()
    })
  ])
});
n.discriminatedUnion("type", [
  zo,
  qo
]);
const Ge = n.object({
  /** The number of attempts before giving up */
  maxAttempts: n.number().int().optional(),
  /** The exponential factor to use when calculating the next retry time.
   *
   * Each subsequent retry will be calculated as `previousTimeout * factor`
   */
  factor: n.number().optional(),
  /** The minimum time to wait before retrying */
  minTimeoutInMs: n.number().int().optional(),
  /** The maximum time to wait before retrying */
  maxTimeoutInMs: n.number().int().optional(),
  /** Randomize the timeout between retries.
   *
   * This can be useful to prevent the thundering herd problem where all retries happen at the same time.
   */
  randomize: n.boolean().optional()
}), Xr = n.object({
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
  name: n.string().optional(),
  /** An optional property that specifies the maximum number of concurrent run executions.
   *
   * If this property is omitted, the task can potentially use up the full concurrency of an environment */
  concurrencyLimit: n.number().int().min(0).max(1e3).optional().nullable()
}), Ps = n.object({
  cron: n.string(),
  timezone: n.string()
}), Ns = {
  id: n.string(),
  description: n.string().optional(),
  queue: Xr.optional(),
  retry: Ge.optional(),
  machine: vs.optional(),
  triggerSource: n.string().optional(),
  schedule: Ps.optional(),
  maxDuration: n.number().optional()
};
n.object(Ns);
const Jo = n.object({
  entry: n.string(),
  out: n.string()
}), Os = {
  filePath: n.string(),
  exportName: n.string(),
  entryPoint: n.string()
};
n.object(Os);
const Xo = n.object({
  ...Ns,
  ...Os
});
n.enum(["index", "create", "restore"]);
n.enum(["terminate"]);
const Qo = n.custom((t) => {
  try {
    return typeof t.test == "function";
  } catch {
    return !1;
  }
});
n.object({
  project: n.string(),
  triggerDirectories: n.string().array().optional(),
  triggerUrl: n.string().optional(),
  projectDir: n.string().optional(),
  tsconfigPath: n.string().optional(),
  retries: n.object({
    enabledInDev: n.boolean().default(!0),
    default: Ge.optional()
  }).optional(),
  additionalPackages: n.string().array().optional(),
  additionalFiles: n.string().array().optional(),
  dependenciesToBundle: n.array(n.union([n.string(), Qo])).optional(),
  logLevel: n.string().optional(),
  enableConsoleLogging: n.boolean().optional(),
  postInstall: n.string().optional(),
  extraCACerts: n.string().optional()
});
const Nt = n.enum(["WAIT_FOR_DURATION", "WAIT_FOR_TASK", "WAIT_FOR_BATCH"]), Xn = n.object({
  runId: n.string(),
  attemptCount: n.number().optional(),
  messageId: n.string(),
  isTest: n.boolean(),
  traceContext: n.record(n.unknown()),
  environment: n.record(n.string()).optional()
}), Qn = n.object({
  id: n.string(),
  description: n.string().optional(),
  filePath: n.string(),
  exportName: n.string(),
  queue: Xr.optional(),
  retry: Ge.optional(),
  machine: vs.optional(),
  triggerSource: n.string().optional(),
  schedule: Ps.optional(),
  maxDuration: n.number().optional()
}), ec = n.object({
  filePath: n.string(),
  contents: n.string(),
  contentHash: n.string(),
  taskIds: n.array(n.string())
}), tc = n.object({
  packageVersion: n.string(),
  contentHash: n.string(),
  cliPackageVersion: n.string().optional(),
  tasks: n.array(Qn),
  sourceFiles: n.array(ec).optional()
});
n.object({
  contentHash: n.string(),
  imageTag: n.string()
});
n.object({
  userId: n.string(),
  email: n.string().email(),
  dashboardUrl: n.string()
});
const rc = n.object({
  id: n.string(),
  externalRef: n.string(),
  name: n.string(),
  slug: n.string(),
  createdAt: n.coerce.date(),
  organization: n.object({
    id: n.string(),
    title: n.string(),
    slug: n.string(),
    createdAt: n.coerce.date()
  })
});
n.array(rc);
n.object({
  apiKey: n.string(),
  name: n.string(),
  apiUrl: n.string(),
  projectId: n.string()
});
n.object({
  localOnly: n.boolean(),
  metadata: tc,
  supportsLazyAttempts: n.boolean().optional()
});
n.object({
  id: n.string(),
  version: n.string(),
  contentHash: n.string()
});
const wa = n.string().max(128, "Tags must be less than 128 characters"), ea = n.union([wa, wa.array()]), nc = n.object({
  payload: n.any(),
  context: n.any(),
  options: n.object({
    dependentAttempt: n.string().optional(),
    parentAttempt: n.string().optional(),
    dependentBatch: n.string().optional(),
    parentBatch: n.string().optional(),
    lockToVersion: n.string().optional(),
    queue: Xr.optional(),
    concurrencyKey: n.string().optional(),
    idempotencyKey: n.string().optional(),
    idempotencyKeyTTL: n.string().optional(),
    test: n.boolean().optional(),
    payloadType: n.string().optional(),
    delay: n.string().or(n.coerce.date()).optional(),
    ttl: n.string().or(n.number().nonnegative().int()).optional(),
    tags: ea.optional(),
    maxAttempts: n.number().int().optional(),
    metadata: n.any(),
    metadataType: n.string().optional(),
    maxDuration: n.number().optional(),
    machine: qr.optional()
  }).optional()
}), ac = n.object({
  id: n.string()
});
n.object({
  items: nc.array(),
  dependentAttempt: n.string().optional()
});
const sc = n.object({
  task: n.string(),
  payload: n.any(),
  context: n.any(),
  options: n.object({
    lockToVersion: n.string().optional(),
    queue: Xr.optional(),
    concurrencyKey: n.string().optional(),
    idempotencyKey: n.string().optional(),
    idempotencyKeyTTL: n.string().optional(),
    test: n.boolean().optional(),
    payloadType: n.string().optional(),
    delay: n.string().or(n.coerce.date()).optional(),
    ttl: n.string().or(n.number().nonnegative().int()).optional(),
    tags: ea.optional(),
    maxAttempts: n.number().int().optional(),
    metadata: n.any(),
    metadataType: n.string().optional(),
    maxDuration: n.number().optional(),
    parentAttempt: n.string().optional(),
    machine: qr.optional()
  }).optional()
});
n.object({
  items: sc.array(),
  dependentAttempt: n.string().optional()
});
const ic = n.object({
  id: n.string(),
  isCached: n.boolean(),
  idempotencyKey: n.string().optional(),
  runs: n.array(n.object({
    id: n.string(),
    taskIdentifier: n.string(),
    isCached: n.boolean(),
    idempotencyKey: n.string().optional()
  }))
});
n.object({
  batchId: n.string(),
  runs: n.string().array()
});
n.object({
  id: n.string(),
  items: n.array(n.object({
    id: n.string(),
    taskRunId: n.string(),
    status: n.enum(["PENDING", "CANCELED", "COMPLETED", "FAILED"])
  }))
});
n.object({
  tags: ea
});
n.object({
  delay: n.string().or(n.coerce.date())
});
n.object({
  variables: n.record(n.string())
});
n.object({
  imageReference: n.string(),
  selfHosted: n.boolean().optional()
});
n.object({
  id: n.string(),
  contentHash: n.string()
});
n.object({
  imageReference: n.string(),
  selfHosted: n.boolean().optional(),
  skipRegistryProxy: n.boolean().optional()
});
const oc = n.object({
  buildId: n.string(),
  buildToken: n.string(),
  projectId: n.string()
});
n.object({
  id: n.string(),
  contentHash: n.string(),
  shortCode: n.string(),
  version: n.string(),
  imageTag: n.string(),
  externalBuildData: oc.optional().nullable(),
  registryHost: n.string().optional()
});
n.object({
  contentHash: n.string(),
  userId: n.string().optional(),
  registryHost: n.string().optional(),
  selfHosted: n.boolean().optional(),
  namespace: n.string().optional()
});
const Cs = n.object({
  name: n.string(),
  message: n.string(),
  stack: n.string().optional(),
  stderr: n.string().optional()
});
n.object({
  error: Cs
});
n.object({
  id: n.string()
});
n.object({
  id: n.string(),
  status: n.enum([
    "PENDING",
    "BUILDING",
    "DEPLOYING",
    "DEPLOYED",
    "FAILED",
    "CANCELED",
    "TIMED_OUT"
  ]),
  contentHash: n.string(),
  shortCode: n.string(),
  version: n.string(),
  imageReference: n.string().nullish(),
  errorData: Cs.nullish(),
  worker: n.object({
    id: n.string(),
    version: n.string(),
    tasks: n.array(n.object({
      id: n.string(),
      slug: n.string(),
      filePath: n.string(),
      exportName: n.string()
    }))
  }).optional()
});
const Sa = n.object({
  presignedUrl: n.string()
}), cc = n.object({
  id: n.string()
}), uc = n.object({
  id: n.string()
}), js = n.union([n.literal("DECLARATIVE"), n.literal("IMPERATIVE")]);
n.object({
  /** The schedule id associated with this run (you can have many schedules for the same task).
    You can use this to remove the schedule, update it, etc */
  scheduleId: n.string(),
  /** The type of schedule – `"DECLARATIVE"` or `"IMPERATIVE"`.
   *
   * **DECLARATIVE** – defined inline on your `schedules.task` using the `cron` property. They can only be created, updated or deleted by modifying the `cron` property on your task.
   *
   * **IMPERATIVE** – created using the `schedules.create` functions or in the dashboard.
   */
  type: js,
  /** When the task was scheduled to run.
   * Note this will be slightly different from `new Date()` because it takes a few ms to run the task.
   *
   * This date is UTC. To output it as a string with a timezone you would do this:
   * ```ts
   * const formatted = payload.timestamp.toLocaleString("en-US", {
        timeZone: payload.timezone,
    });
    ```  */
  timestamp: n.date(),
  /** When the task was last run (it has been).
    This can be undefined if it's never been run. This date is UTC. */
  lastTimestamp: n.date().optional(),
  /** You can optionally provide an external id when creating the schedule.
    Usually you would use a userId or some other unique identifier.
    This defaults to undefined if you didn't provide one. */
  externalId: n.string().optional(),
  /** The IANA timezone the schedule is set to. The default is UTC.
   * You can see the full list of supported timezones here: https://cloud.trigger.dev/timezones
   */
  timezone: n.string(),
  /** The next 5 dates this task is scheduled to run */
  upcoming: n.array(n.date())
});
const lc = n.object({
  /** The id of the task you want to attach to. */
  task: n.string(),
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
  cron: n.string(),
  /** You can only create one schedule with this key. If you use it twice, the second call will update the schedule.
   *
   * This is required to prevent you from creating duplicate schedules. */
  deduplicationKey: n.string(),
  /** Optionally, you can specify your own IDs (like a user ID) and then use it inside the run function of your task.
   *
   * This allows you to have per-user CRON tasks.
   */
  externalId: n.string().optional(),
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
  timezone: n.string().optional()
});
lc.omit({ deduplicationKey: !0 });
const Ms = n.object({
  type: n.literal("CRON"),
  expression: n.string(),
  description: n.string()
}), Ce = n.object({
  id: n.string(),
  type: js,
  task: n.string(),
  active: n.boolean(),
  deduplicationKey: n.string().nullish(),
  externalId: n.string().nullish(),
  generator: Ms,
  timezone: n.string(),
  nextRun: n.coerce.date().nullish(),
  environments: n.array(n.object({
    id: n.string(),
    type: n.string(),
    userName: n.string().nullish()
  }))
}), dc = n.object({
  id: n.string()
});
n.object({
  data: n.array(Ce),
  pagination: n.object({
    currentPage: n.number(),
    totalPages: n.number(),
    count: n.number()
  })
});
n.object({
  page: n.number().optional(),
  perPage: n.number().optional()
});
n.object({
  timezones: n.array(n.string())
});
const fc = n.enum([
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
]), hc = n.enum([
  "PENDING",
  "EXECUTING",
  "PAUSED",
  "COMPLETED",
  "FAILED",
  "CANCELED"
]), pc = n.object({
  id: n.string(),
  name: n.string(),
  user: n.string().optional()
}), gc = n.object({
  id: n.string(),
  externalId: n.string().optional(),
  deduplicationKey: n.string().optional(),
  generator: Ms
});
n.enum([
  "triggerAndWait",
  "trigger",
  "batchTriggerAndWait",
  "batchTrigger"
]);
const Us = {
  id: n.string(),
  status: fc,
  taskIdentifier: n.string(),
  idempotencyKey: n.string().optional(),
  version: n.string().optional(),
  isQueued: n.boolean(),
  isExecuting: n.boolean(),
  isCompleted: n.boolean(),
  isSuccess: n.boolean(),
  isFailed: n.boolean(),
  isCancelled: n.boolean(),
  isTest: n.boolean(),
  createdAt: n.coerce.date(),
  updatedAt: n.coerce.date(),
  startedAt: n.coerce.date().optional(),
  finishedAt: n.coerce.date().optional(),
  delayedUntil: n.coerce.date().optional(),
  ttl: n.string().optional(),
  expiredAt: n.coerce.date().optional(),
  tags: n.string().array(),
  costInCents: n.number(),
  baseCostInCents: n.number(),
  durationMs: n.number(),
  metadata: n.record(n.any()).optional()
}, Ds = {
  ...Us,
  depth: n.number(),
  triggerFunction: n.enum(["triggerAndWait", "trigger", "batchTriggerAndWait", "batchTrigger"]),
  batchId: n.string().optional()
}, un = n.object(Ds), Aa = n.object({
  ...Ds,
  payload: n.any().optional(),
  payloadPresignedUrl: n.string().optional(),
  output: n.any().optional(),
  outputPresignedUrl: n.string().optional(),
  error: Ra.optional(),
  schedule: gc.optional(),
  relatedRuns: n.object({
    root: un.optional(),
    parent: un.optional(),
    children: n.array(un).optional()
  }),
  attempts: n.array(n.object({
    id: n.string(),
    status: hc,
    createdAt: n.coerce.date(),
    updatedAt: n.coerce.date(),
    startedAt: n.coerce.date().optional(),
    completedAt: n.coerce.date().optional(),
    error: Ra.optional()
  }).optional()),
  attemptCount: n.number().default(0)
}), In = n.object({
  ...Us,
  env: pc
});
n.object({
  data: n.array(In),
  pagination: n.object({
    next: n.string().optional(),
    previous: n.string().optional()
  })
});
n.object({
  name: n.string(),
  value: n.string()
});
n.object({
  value: n.string()
});
n.object({
  variables: n.record(n.string()),
  override: n.boolean().optional()
});
const ir = n.object({
  success: n.boolean()
}), mc = n.object({
  value: n.string()
}), yc = n.object({
  name: n.string(),
  value: n.string()
}), vc = n.array(yc), Ia = n.object({
  metadata: n.record(Pe)
}), ka = n.string().transform((t) => `${t}Z`).pipe(n.coerce.date()), bt = n.string().nullish().transform((t) => t && /* @__PURE__ */ new Date(`${t}Z`)), _c = n.object({
  id: n.string(),
  idempotencyKey: n.string().nullish(),
  createdAt: ka,
  updatedAt: ka,
  startedAt: bt,
  delayUntil: bt,
  queuedAt: bt,
  expiredAt: bt,
  completedAt: bt,
  taskIdentifier: n.string(),
  friendlyId: n.string(),
  number: n.number(),
  isTest: n.boolean(),
  status: n.string(),
  usageDurationMs: n.number(),
  costInCents: n.number(),
  baseCostInCents: n.number(),
  ttl: n.string().nullish(),
  payload: n.string().nullish(),
  payloadType: n.string().nullish(),
  metadata: n.string().nullish(),
  metadataType: n.string().nullish(),
  output: n.string().nullish(),
  outputType: n.string().nullish(),
  runTags: n.array(n.string()).nullish().default([]),
  error: bs.nullish()
}), bc = n.enum(["PENDING", "COMPLETED"]), Ec = n.object({
  id: n.string(),
  status: bc,
  idempotencyKey: n.string().optional(),
  createdAt: n.coerce.date(),
  updatedAt: n.coerce.date(),
  runCount: n.number()
});
n.object({
  id: n.string(),
  runId: n.string(),
  sequence: n.number(),
  key: n.string(),
  value: n.string(),
  createdAt: n.coerce.date()
});
const Tc = n.object({
  project: n.string(),
  dirs: n.string().array()
}), Rc = n.object({
  name: n.string(),
  version: n.string()
}), wc = n.enum(["dev", "deploy"]), $s = n.enum(["node", "bun"]), Sc = n.object({
  target: wc,
  packageVersion: n.string(),
  cliPackageVersion: n.string(),
  contentHash: n.string(),
  runtime: $s,
  environment: n.string(),
  config: Tc,
  files: n.array(Jo),
  sources: n.record(n.object({
    contents: n.string(),
    contentHash: n.string()
  })),
  outputPath: n.string(),
  runWorkerEntryPoint: n.string(),
  // Dev & Deploy has a runWorkerEntryPoint
  runControllerEntryPoint: n.string().optional(),
  // Only deploy has a runControllerEntryPoint
  indexWorkerEntryPoint: n.string(),
  // Dev & Deploy has a indexWorkerEntryPoint
  indexControllerEntryPoint: n.string().optional(),
  // Only deploy has a indexControllerEntryPoint
  loaderEntryPoint: n.string().optional(),
  configPath: n.string(),
  externals: Rc.array().optional(),
  build: n.object({
    env: n.record(n.string()).optional(),
    commands: n.array(n.string()).optional()
  }),
  customConditions: n.array(n.string()).optional(),
  deploy: n.object({
    env: n.record(n.string()).optional(),
    sync: n.object({
      env: n.record(n.string()).optional()
    }).optional()
  }),
  image: n.object({
    pkgs: n.array(n.string()).optional(),
    instructions: n.array(n.string()).optional()
  }).optional(),
  otelImportHook: n.object({
    include: n.array(n.string()).optional(),
    exclude: n.array(n.string()).optional()
  }).optional()
});
n.object({
  type: n.literal("index"),
  data: n.object({
    build: Sc
  })
});
const Ls = n.object({
  configPath: n.string(),
  tasks: Xo.array(),
  workerEntryPoint: n.string(),
  controllerEntryPoint: n.string().optional(),
  loaderEntryPoint: n.string().optional(),
  runtime: $s,
  customConditions: n.array(n.string()).optional(),
  otelImportHook: n.object({
    include: n.array(n.string()).optional(),
    exclude: n.array(n.string()).optional()
  }).optional()
});
n.object({
  type: n.literal("worker-manifest"),
  data: n.object({
    manifest: Ls
  })
});
const Ac = n.object({
  message: n.string(),
  file: n.string(),
  stack: n.string().optional(),
  name: n.string().optional()
}), Ic = n.array(Ac);
n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1),
    error: n.object({
      name: n.string(),
      message: n.string(),
      stack: n.string().optional(),
      stderr: n.string().optional()
    })
  }),
  n.object({
    success: n.literal(!0)
  })
]);
const Ks = n.discriminatedUnion("type", [
  n.object({
    type: n.literal("CANCEL_ATTEMPT"),
    taskAttemptId: n.string(),
    taskRunId: n.string()
  }),
  n.object({
    type: n.literal("SCHEDULE_ATTEMPT"),
    image: n.string(),
    version: n.string(),
    machine: ar,
    nextAttemptNumber: n.number().optional(),
    // identifiers
    id: n.string().optional(),
    // TODO: Remove this completely in a future release
    envId: n.string(),
    envType: hr,
    orgId: n.string(),
    projectId: n.string(),
    runId: n.string()
  }),
  n.object({
    type: n.literal("EXECUTE_RUN_LAZY_ATTEMPT"),
    payload: Xn
  })
]);
n.object({
  version: n.literal("v1").default("v1"),
  id: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string(),
  data: Ks
});
const Fs = n.discriminatedUnion("type", [
  n.object({
    version: n.literal("v1").default("v1"),
    type: n.literal("TASK_RUN_COMPLETED"),
    completion: re,
    execution: pe
  }),
  n.object({
    version: n.literal("v1").default("v1"),
    type: n.literal("TASK_RUN_FAILED_TO_RUN"),
    completion: Jr
  }),
  n.object({
    version: n.literal("v1").default("v1"),
    type: n.literal("TASK_HEARTBEAT"),
    id: n.string()
  }),
  n.object({
    version: n.literal("v1").default("v1"),
    type: n.literal("TASK_RUN_HEARTBEAT"),
    id: n.string()
  })
]), kc = n.object({
  id: n.string(),
  version: n.string(),
  contentHash: n.string()
});
n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string(),
  inProgressRuns: n.string().array().optional()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string(),
  data: Fs
});
n.object({
  version: n.literal("v1").default("v1"),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional()
  }),
  origin: n.enum(["uncaughtException", "unhandledRejection"])
});
n.object({
  version: n.literal("v1").default("v1"),
  tasks: n.unknown(),
  zodIssues: n.custom((t) => Array.isArray(t) && t.every((e) => typeof e == "object" && "message" in e))
});
n.object({
  version: n.literal("v1").default("v1"),
  manifest: Ls,
  importErrors: Ic
});
n.object({
  version: n.literal("v1").default("v1"),
  execution: pe,
  result: re
}), n.object({
  version: n.literal("v1").default("v1"),
  id: n.string()
}), n.undefined(), n.object({
  version: n.literal("v1").default("v1"),
  ms: n.number(),
  now: n.number(),
  waitThresholdInMs: n.number()
}), n.object({
  version: n.literal("v1").default("v1"),
  friendlyId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  batchFriendlyId: n.string(),
  runFriendlyIds: n.string().array()
});
n.object({
  version: n.literal("v1").default("v1"),
  execution: pe,
  traceContext: n.record(n.unknown()),
  metadata: kc
}), n.discriminatedUnion("version", [
  n.object({
    version: n.literal("v1"),
    completion: re,
    execution: pe
  }),
  n.object({
    version: n.literal("v2"),
    completion: re
  })
]), n.object({
  version: n.literal("v1").default("v1")
}), n.object({
  timeoutInMs: n.number()
}), n.void();
n.object({
  version: n.literal("v1").default("v1"),
  data: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  data: n.string()
}), n.object({
  status: n.literal("ok")
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  reason: n.string().optional(),
  exitCode: n.number().optional(),
  message: n.string().optional(),
  logs: n.string().optional(),
  /** This means we should only update the error if one exists */
  overrideCompletion: n.boolean().optional(),
  errorCode: qn.shape.code.optional()
}), n.object({
  version: n.literal("v1").default("v1"),
  deploymentId: n.string(),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional(),
    stderr: n.string().optional()
  }),
  overrideCompletion: n.boolean().optional()
});
n.object({
  version: n.literal("v1").default("v1"),
  imageTag: n.string(),
  shortCode: n.string(),
  apiKey: n.string(),
  apiUrl: n.string(),
  // identifiers
  envId: n.string(),
  envType: hr,
  orgId: n.string(),
  projectId: n.string(),
  deploymentId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  type: n.enum(["DOCKER", "KUBERNETES"]),
  location: n.string(),
  reason: n.string().optional(),
  imageRef: n.string(),
  attemptNumber: n.number().optional(),
  machine: ar,
  // identifiers
  checkpointId: n.string(),
  envId: n.string(),
  envType: hr,
  orgId: n.string(),
  projectId: n.string(),
  runId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  imageRef: n.string(),
  shortCode: n.string(),
  // identifiers
  envId: n.string(),
  envType: hr,
  orgId: n.string(),
  projectId: n.string(),
  deploymentId: n.string()
});
const xa = n.object({
  projectRef: n.string(),
  envId: n.string(),
  deploymentId: n.string(),
  metadata: n.object({
    cliPackageVersion: n.string().optional(),
    contentHash: n.string(),
    packageVersion: n.string(),
    tasks: Qn.array()
  })
});
n.object({
  version: n.literal("v1").default("v1"),
  metadata: n.any(),
  text: n.string()
}), n.discriminatedUnion("version", [
  xa.extend({
    version: n.literal("v1")
  }),
  xa.extend({
    version: n.literal("v2"),
    supportsLazyAttempts: n.boolean()
  })
]), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1)
  }),
  n.object({
    success: n.literal(!0)
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  envId: n.string()
}), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1),
    reason: n.string().optional()
  }),
  n.object({
    success: n.literal(!0),
    executionPayload: Sr
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  totalCompletions: n.number()
}), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1)
  }),
  n.object({
    success: n.literal(!0),
    payload: Sr
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  envId: n.string(),
  totalCompletions: n.number()
}), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1),
    reason: n.string().optional()
  }),
  n.object({
    success: n.literal(!0),
    lazyPayload: Xn
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  attemptFriendlyId: n.string(),
  type: Nt
}), n.object({
  version: n.enum(["v1", "v2"]).default("v1"),
  execution: Jn,
  completion: re,
  checkpoint: n.object({
    docker: n.boolean(),
    location: n.string()
  }).optional()
}), n.object({
  version: n.literal("v1").default("v1"),
  completion: Jr
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptFriendlyId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string().optional(),
  attemptFriendlyId: n.string(),
  docker: n.boolean(),
  location: n.string(),
  reason: n.discriminatedUnion("type", [
    n.object({
      type: n.literal("WAIT_FOR_DURATION"),
      ms: n.number(),
      now: n.number()
    }),
    n.object({
      type: n.literal("WAIT_FOR_BATCH"),
      batchFriendlyId: n.string(),
      runFriendlyIds: n.string().array()
    }),
    n.object({
      type: n.literal("WAIT_FOR_TASK"),
      friendlyId: n.string()
    }),
    n.object({
      type: n.literal("RETRYING_AFTER_FAILURE"),
      attemptNumber: n.number()
    })
  ])
}), n.object({
  version: n.literal("v1").default("v1"),
  keepRunAlive: n.boolean()
}), n.object({
  version: n.literal("v1").default("v1"),
  deploymentId: n.string(),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional(),
    stderr: n.string().optional()
  })
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional()
  })
});
n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  attemptId: n.string(),
  attemptFriendlyId: n.string(),
  completions: re.array(),
  executions: pe.array()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  attemptId: n.string(),
  attemptFriendlyId: n.string(),
  completions: re.array(),
  executions: pe.array()
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptId: n.string(),
  attemptFriendlyId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptId: n.string(),
  attemptFriendlyId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  delayInMs: n.number().optional()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  checkpointThresholdInMs: n.number()
});
n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string(),
  data: Fs
});
n.object({
  version: n.literal("v1").default("v1"),
  id: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  backgroundWorkerId: n.string(),
  data: Ks
});
const Pa = n.object({
  version: n.literal("v1"),
  deploymentId: n.string(),
  tasks: Qn.array(),
  packageVersion: n.string()
});
n.object({
  version: n.literal("v1").default("v1")
}), n.void(), n.discriminatedUnion("version", [
  Pa.extend({
    version: n.literal("v1")
  }),
  Pa.extend({
    version: n.literal("v2"),
    supportsLazyAttempts: n.boolean()
  })
]), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1)
  }),
  n.object({
    success: n.literal(!0)
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  totalCompletions: n.number()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string(),
  totalCompletions: n.number()
}), n.discriminatedUnion("version", [
  n.object({
    version: n.literal("v1"),
    attemptFriendlyId: n.string(),
    type: Nt
  }),
  n.object({
    version: n.literal("v2"),
    attemptFriendlyId: n.string(),
    attemptNumber: n.number(),
    type: Nt
  })
]), n.object({
  version: n.literal("v1").default("v1")
}), n.discriminatedUnion("version", [
  n.object({
    version: n.literal("v1")
  }),
  n.object({
    version: n.literal("v2"),
    reason: Nt.optional()
  })
]).default({ version: "v1" }), n.object({
  version: n.literal("v2").default("v2"),
  checkpointCanceled: n.boolean(),
  reason: Nt.optional()
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptFriendlyId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string()
}), n.object({
  version: n.enum(["v1", "v2"]).default("v1"),
  execution: Jn,
  completion: re
}), n.object({
  willCheckpointAndRestore: n.boolean(),
  shouldExit: n.boolean()
}), n.object({
  version: n.literal("v1").default("v1"),
  completion: Jr
}), n.object({
  version: n.literal("v1").default("v1"),
  ms: n.number(),
  now: n.number(),
  attemptFriendlyId: n.string()
}), n.object({
  willCheckpointAndRestore: n.boolean()
}), n.object({
  version: n.enum(["v1", "v2"]).default("v1"),
  friendlyId: n.string(),
  // This is the attempt that is waiting
  attemptFriendlyId: n.string()
}), n.object({
  willCheckpointAndRestore: n.boolean()
}), n.object({
  version: n.enum(["v1", "v2"]).default("v1"),
  batchFriendlyId: n.string(),
  runFriendlyIds: n.string().array(),
  // This is the attempt that is waiting
  attemptFriendlyId: n.string()
}), n.object({
  willCheckpointAndRestore: n.boolean()
}), n.object({
  version: n.literal("v1").default("v1"),
  deploymentId: n.string(),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional(),
    stderr: n.string().optional()
  })
}), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string()
}), n.discriminatedUnion("success", [
  n.object({
    success: n.literal(!1),
    reason: n.string().optional()
  }),
  n.object({
    success: n.literal(!0),
    executionPayload: Sr
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  error: n.object({
    name: n.string(),
    message: n.string(),
    stack: n.string().optional()
  })
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptFriendlyId: n.string().optional(),
  attemptNumber: n.string().optional()
});
n.object({
  version: n.literal("v1").default("v1"),
  attemptId: n.string(),
  completions: re.array(),
  executions: pe.array()
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptId: n.string()
}), n.object({
  version: n.literal("v1").default("v1"),
  executionPayload: Sr
}), n.object({
  version: n.literal("v1").default("v1"),
  lazyPayload: Xn
}), n.object({
  version: n.literal("v1").default("v1"),
  attemptId: n.string()
}), n.discriminatedUnion("version", [
  n.object({
    version: n.literal("v1")
  }),
  n.object({
    version: n.literal("v2"),
    delayInMs: n.number().optional()
  })
]), n.object({
  version: n.literal("v1").default("v1"),
  runId: n.string()
});
n.object({
  contentHash: n.string(),
  projectRef: n.string(),
  envId: n.string(),
  runId: n.string(),
  attemptFriendlyId: n.string().optional(),
  attemptNumber: n.string().optional(),
  podName: n.string(),
  deploymentId: n.string(),
  deploymentVersion: n.string(),
  requiresCheckpointResumeWithMessage: n.string().optional()
});
n.object({
  supportsDynamicConfig: n.string().optional()
});
const xc = "primary", Pc = n.enum([xc]), Nc = n.object({
  text: n.string(),
  variant: n.string().optional(),
  url: n.string().optional()
}), Oc = n.object({
  items: n.array(Nc),
  style: n.enum(["codepath"]).optional()
});
n.object({
  icon: n.string().optional(),
  variant: Pc.optional(),
  accessory: Oc.optional()
}).default({
  icon: void 0,
  variant: void 0
});
const Cc = [
  n.object({
    $endsWith: n.string()
  }),
  n.object({
    $startsWith: n.string()
  }),
  n.object({
    $ignoreCaseEquals: n.string()
  })
], jc = n.union([
  /** Match against a string */
  n.array(n.string()),
  /** Match against a number */
  n.array(n.number()),
  /** Match against a boolean */
  n.array(n.boolean()),
  n.array(n.union([
    ...Cc,
    n.object({
      $exists: n.boolean()
    }),
    n.object({
      $isNull: n.boolean()
    }),
    n.object({
      $anythingBut: n.union([n.string(), n.number(), n.boolean()])
    }),
    n.object({
      $anythingBut: n.union([n.array(n.string()), n.array(n.number()), n.array(n.boolean())])
    }),
    n.object({
      $gt: n.number()
    }),
    n.object({
      $lt: n.number()
    }),
    n.object({
      $gte: n.number()
    }),
    n.object({
      $lte: n.number()
    }),
    n.object({
      $between: n.tuple([n.number(), n.number()])
    }),
    n.object({
      $includes: n.union([n.string(), n.number(), n.boolean()])
    }),
    n.object({
      $not: n.union([n.string(), n.number(), n.boolean()])
    })
  ]))
]), ta = n.lazy(() => n.record(n.union([jc, ta]))), Mc = n.object({
  /** The `headers` strategy retries the request using info from the response headers. */
  strategy: n.literal("headers"),
  /** The header to use to determine the maximum number of times to retry the request. */
  limitHeader: n.string(),
  /** The header to use to determine the number of remaining retries. */
  remainingHeader: n.string(),
  /** The header to use to determine the time when the number of remaining retries will be reset. */
  resetHeader: n.string(),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: ta.optional(),
  /** The format of the `resetHeader` value. */
  resetFormat: n.enum([
    "unix_timestamp",
    "unix_timestamp_in_ms",
    "iso_8601",
    "iso_8601_duration_openai_variant"
  ]).default("unix_timestamp").optional()
}), Uc = Ge.extend({
  /** The `backoff` strategy retries the request with an exponential backoff. */
  strategy: n.literal("backoff"),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: ta.optional()
}), Dc = n.discriminatedUnion("strategy", [
  Mc,
  Uc
]), $c = n.record(n.string(), Dc);
n.object({
  /** The maximum time to wait for the request to complete. */
  durationInMs: n.number().optional(),
  retry: Ge.optional()
});
n.object({
  /** The retrying strategy for specific status codes. */
  byStatus: $c.optional(),
  /** The timeout options for the request. */
  timeout: Ge.optional(),
  /**
   * The retrying strategy for connection errors.
   */
  connectionError: Ge.optional()
});
const Lc = n.object({
  type: n.string().optional(),
  message: n.string().optional(),
  stacktrace: n.string().optional()
}), Kc = n.object({
  name: n.literal("exception"),
  time: n.coerce.date(),
  properties: n.object({
    exception: Lc
  })
}), Fc = n.object({
  name: n.literal("cancellation"),
  time: n.coerce.date(),
  properties: n.object({
    reason: n.string()
  })
}), Bc = n.object({
  name: n.string(),
  time: n.coerce.date(),
  properties: n.record(n.unknown())
}), Gc = n.union([Kc, Fc, Bc]);
n.array(Gc);
n.object({
  system: n.string().optional(),
  client_id: n.string().optional(),
  operation: n.enum(["publish", "create", "receive", "deliver"]),
  message: n.any(),
  destination: n.string().optional()
});
const Zc = typeof globalThis == "object" ? globalThis : global, Ar = Symbol.for("dev.trigger.ts.api"), Ir = Zc;
function ee(t, e, r = !1) {
  const a = Ir[Ar] = Ir[Ar] ?? {};
  return !r && a[t] ? !1 : (a[t] = e, !0);
}
function ge(t) {
  var e;
  return (e = Ir[Ar]) == null ? void 0 : e[t];
}
function We(t) {
  const e = Ir[Ar];
  e && delete e[t];
}
const x = {
  ENVIRONMENT_ID: "ctx.environment.id",
  ENVIRONMENT_TYPE: "ctx.environment.type",
  ORGANIZATION_ID: "ctx.organization.id",
  ORGANIZATION_SLUG: "ctx.organization.slug",
  ORGANIZATION_NAME: "ctx.organization.name",
  PROJECT_ID: "ctx.project.id",
  PROJECT_REF: "ctx.project.ref",
  PROJECT_NAME: "ctx.project.title",
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
  STYLE_ICON: "$style.icon",
  STYLE_ACCESSORY: "$style.accessory",
  WORKER_ID: "worker.id",
  WORKER_VERSION: "worker.version",
  IDEMPOTENCY_KEY: "ctx.run.idempotencyKey",
  USAGE_DURATION_MS: "$usage.durationMs",
  USAGE_COST_IN_CENTS: "$usage.costInCents"
}, ln = "task-context";
var st, pr;
const Dr = class Dr {
  constructor() {
    L(this, st);
  }
  static getInstance() {
    return this._instance || (this._instance = new Dr()), this._instance;
  }
  get isInsideTask() {
    return g(this, st, pr).call(this) !== void 0;
  }
  get ctx() {
    var e;
    return (e = g(this, st, pr).call(this)) == null ? void 0 : e.ctx;
  }
  get worker() {
    var e;
    return (e = g(this, st, pr).call(this)) == null ? void 0 : e.worker;
  }
  get attributes() {
    return this.ctx ? {
      ...this.contextAttributes,
      ...this.workerAttributes
    } : {};
  }
  get workerAttributes() {
    return this.worker ? {
      [x.WORKER_ID]: this.worker.id,
      [x.WORKER_VERSION]: this.worker.version
    } : {};
  }
  get contextAttributes() {
    var e, r, a, s, i;
    return this.ctx ? {
      [x.ATTEMPT_ID]: this.ctx.attempt.id,
      [x.ATTEMPT_NUMBER]: this.ctx.attempt.number,
      [x.TASK_SLUG]: this.ctx.task.id,
      [x.TASK_PATH]: this.ctx.task.filePath,
      [x.TASK_EXPORT_NAME]: this.ctx.task.exportName,
      [x.QUEUE_NAME]: this.ctx.queue.name,
      [x.QUEUE_ID]: this.ctx.queue.id,
      [x.ENVIRONMENT_ID]: this.ctx.environment.id,
      [x.ENVIRONMENT_TYPE]: this.ctx.environment.type,
      [x.ORGANIZATION_ID]: this.ctx.organization.id,
      [x.PROJECT_ID]: this.ctx.project.id,
      [x.PROJECT_REF]: this.ctx.project.ref,
      [x.PROJECT_NAME]: this.ctx.project.name,
      [x.RUN_ID]: this.ctx.run.id,
      [x.RUN_IS_TEST]: this.ctx.run.isTest,
      [x.ORGANIZATION_SLUG]: this.ctx.organization.slug,
      [x.ORGANIZATION_NAME]: this.ctx.organization.name,
      [x.BATCH_ID]: (e = this.ctx.batch) == null ? void 0 : e.id,
      [x.IDEMPOTENCY_KEY]: this.ctx.run.idempotencyKey,
      [x.MACHINE_PRESET_NAME]: (r = this.ctx.machine) == null ? void 0 : r.name,
      [x.MACHINE_PRESET_CPU]: (a = this.ctx.machine) == null ? void 0 : a.cpu,
      [x.MACHINE_PRESET_MEMORY]: (s = this.ctx.machine) == null ? void 0 : s.memory,
      [x.MACHINE_PRESET_CENTS_PER_MS]: (i = this.ctx.machine) == null ? void 0 : i.centsPerMs
    } : {};
  }
  disable() {
    We(ln);
  }
  setGlobalTaskContext(e) {
    return ee(ln, e);
  }
};
st = new WeakSet(), pr = function() {
  return ge(ln);
}, E(Dr, "_instance");
let kn = Dr;
const D = kn.getInstance(), Vc = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;
function Wc(t) {
  return t.length === 1 ? t[0].toString() : t.reduce((e, r) => {
    if (typeof r == "number")
      return e + "[" + r.toString() + "]";
    if (r.includes('"'))
      return e + '["' + Hc(r) + '"]';
    if (!Vc.test(r))
      return e + '["' + r + '"]';
    const a = e.length === 0 ? "" : ".";
    return e + a + r;
  }, "");
}
function Hc(t) {
  return t.replace(/"/g, '\\"');
}
function Yc(t) {
  return t.length !== 0;
}
const zc = 99, qc = "; ", Jc = ", or ", Bs = "Validation error", Xc = ": ";
class Qc extends Error {
  constructor(r, a = []) {
    super(r);
    E(this, "details");
    E(this, "name");
    this.details = a, this.name = "ZodValidationError";
  }
  toString() {
    return this.message;
  }
}
function Gs(t, e, r) {
  if (t.code === "invalid_union")
    return t.unionErrors.reduce((a, s) => {
      const i = s.issues.map((o) => Gs(o, e, r)).join(e);
      return a.includes(i) || a.push(i), a;
    }, []).join(r);
  if (Yc(t.path)) {
    if (t.path.length === 1) {
      const a = t.path[0];
      if (typeof a == "number")
        return `${t.message} at index ${a}`;
    }
    return `${t.message} at "${Wc(t.path)}"`;
  }
  return t.message;
}
function eu(t, e, r) {
  return e !== null ? t.length > 0 ? [e, t].join(r) : e : t.length > 0 ? t : Bs;
}
function tu(t, e = {}) {
  const { maxIssuesInMessage: r = zc, issueSeparator: a = qc, unionSeparator: s = Jc, prefixSeparator: i = Xc, prefix: o = Bs } = e, c = t.errors.slice(0, r).map((l) => Gs(l, a, s)).join(a), u = eu(c, o, i);
  return new Qc(u, t.errors);
}
const Zs = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !0
};
function Vs(t, e) {
  const r = { ...Zs, ...t };
  if (e >= r.maxAttempts)
    return;
  const { factor: a, minTimeoutInMs: s, maxTimeoutInMs: i, randomize: o } = r, c = o ? Math.random() + 1 : 1, u = Math.min(i, c * s * Math.pow(a, e - 1));
  return Math.round(u);
}
class Z extends Error {
  constructor(r, a, s, i) {
    super(`${Z.makeMessage(r, a, s)}`);
    E(this, "status");
    E(this, "headers");
    E(this, "error");
    E(this, "code");
    E(this, "param");
    E(this, "type");
    this.name = "TriggerApiError", this.status = r, this.headers = i;
    const o = a;
    this.error = o, this.code = o == null ? void 0 : o.code, this.param = o == null ? void 0 : o.param, this.type = o == null ? void 0 : o.type;
  }
  static makeMessage(r, a, s) {
    const i = a != null && a.message ? typeof a.message == "string" ? a.message : JSON.stringify(a.message) : a ? JSON.stringify(a) : s;
    return r && i ? `${r} ${i}` : r ? `${r} status code (no body)` : i || "(no status code or body)";
  }
  static generate(r, a, s, i) {
    if (!r)
      return new Ws({ cause: du(a) });
    const o = a == null ? void 0 : a.error;
    return r === 400 ? new ru(r, o, s, i) : r === 401 ? new nu(r, o, s, i) : r === 403 ? new au(r, o, s, i) : r === 404 ? new su(r, o, s, i) : r === 409 ? new iu(r, o, s, i) : r === 422 ? new ou(r, o, s, i) : r === 429 ? new cu(r, o, s, i) : r >= 500 ? new uu(r, o, s, i) : new Z(r, o, s, i);
  }
}
class Ws extends Z {
  constructor({ message: r, cause: a }) {
    super(void 0, void 0, r || "Connection error.", void 0);
    E(this, "status");
    a && (this.cause = a);
  }
}
class ru extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 400);
  }
}
class nu extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 401);
  }
}
class au extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 403);
  }
}
class su extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 404);
  }
}
class iu extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 409);
  }
}
class ou extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 422);
  }
}
class cu extends Z {
  constructor() {
    super(...arguments);
    E(this, "status", 429);
  }
  get millisecondsUntilReset() {
    const r = (this.headers ?? {})["x-ratelimit-reset"];
    if (typeof r == "string") {
      const a = parseInt(r, 10);
      return isNaN(a) ? void 0 : Math.max(a - Date.now() + Math.floor(Math.random() * 2e3), 0);
    }
  }
}
class uu extends Z {
}
class lu extends Z {
  constructor({ message: r, cause: a, status: s, rawBody: i, headers: o }) {
    super(s, void 0, r || "Validation error.", o);
    E(this, "status", 200);
    E(this, "rawBody");
    a && (this.cause = a), this.rawBody = i;
  }
}
function du(t) {
  return t instanceof Error ? t : new Error(t);
}
var fu = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, Me = "1.9.0", Na = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function hu(t) {
  var e = /* @__PURE__ */ new Set([t]), r = /* @__PURE__ */ new Set(), a = t.match(Na);
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
    return r.add(c), !1;
  }
  function o(c) {
    return e.add(c), !0;
  }
  return function(u) {
    if (e.has(u))
      return !0;
    if (r.has(u))
      return !1;
    var l = u.match(Na);
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
var pu = hu(Me), gu = Me.split(".")[0], zt = Symbol.for("opentelemetry.js.api." + gu), qt = fu;
function Qr(t, e, r, a) {
  var s;
  a === void 0 && (a = !1);
  var i = qt[zt] = (s = qt[zt]) !== null && s !== void 0 ? s : {
    version: Me
  };
  if (!a && i[t]) {
    var o = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + t);
    return r.error(o.stack || o.message), !1;
  }
  if (i.version !== Me) {
    var o = new Error("@opentelemetry/api: Registration of version v" + i.version + " for " + t + " does not match previously registered API v" + Me);
    return r.error(o.stack || o.message), !1;
  }
  return i[t] = e, r.debug("@opentelemetry/api: Registered a global for " + t + " v" + Me + "."), !0;
}
function dt(t) {
  var e, r, a = (e = qt[zt]) === null || e === void 0 ? void 0 : e.version;
  if (!(!a || !pu(a)))
    return (r = qt[zt]) === null || r === void 0 ? void 0 : r[t];
}
function en(t, e) {
  e.debug("@opentelemetry/api: Unregistering a global for " + t + " v" + Me + ".");
  var r = qt[zt];
  r && delete r[t];
}
var mu = function(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var a = r.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, yu = function(t, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, vu = (
  /** @class */
  function() {
    function t(e) {
      this._namespace = e.namespace || "DiagComponentLogger";
    }
    return t.prototype.debug = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Et("debug", this._namespace, e);
    }, t.prototype.error = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Et("error", this._namespace, e);
    }, t.prototype.info = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Et("info", this._namespace, e);
    }, t.prototype.warn = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Et("warn", this._namespace, e);
    }, t.prototype.verbose = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Et("verbose", this._namespace, e);
    }, t;
  }()
);
function Et(t, e, r) {
  var a = dt("diag");
  if (a)
    return r.unshift(e), a[t].apply(a, yu([], mu(r), !1));
}
var z;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.ERROR = 30] = "ERROR", t[t.WARN = 50] = "WARN", t[t.INFO = 60] = "INFO", t[t.DEBUG = 70] = "DEBUG", t[t.VERBOSE = 80] = "VERBOSE", t[t.ALL = 9999] = "ALL";
})(z || (z = {}));
function _u(t, e) {
  t < z.NONE ? t = z.NONE : t > z.ALL && (t = z.ALL), e = e || {};
  function r(a, s) {
    var i = e[a];
    return typeof i == "function" && t >= s ? i.bind(e) : function() {
    };
  }
  return {
    error: r("error", z.ERROR),
    warn: r("warn", z.WARN),
    info: r("info", z.INFO),
    debug: r("debug", z.DEBUG),
    verbose: r("verbose", z.VERBOSE)
  };
}
var bu = function(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var a = r.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Eu = function(t, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, Tu = "diag", Ze = (
  /** @class */
  function() {
    function t() {
      function e(s) {
        return function() {
          for (var i = [], o = 0; o < arguments.length; o++)
            i[o] = arguments[o];
          var c = dt("diag");
          if (c)
            return c[s].apply(c, Eu([], bu(i), !1));
        };
      }
      var r = this, a = function(s, i) {
        var o, c, u;
        if (i === void 0 && (i = { logLevel: z.INFO }), s === r) {
          var l = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return r.error((o = l.stack) !== null && o !== void 0 ? o : l.message), !1;
        }
        typeof i == "number" && (i = {
          logLevel: i
        });
        var d = dt("diag"), y = _u((c = i.logLevel) !== null && c !== void 0 ? c : z.INFO, s);
        if (d && !i.suppressOverrideMessage) {
          var p = (u = new Error().stack) !== null && u !== void 0 ? u : "<failed to generate stacktrace>";
          d.warn("Current logger will be overwritten from " + p), y.warn("Current logger will overwrite one already registered from " + p);
        }
        return Qr("diag", y, r, !0);
      };
      r.setLogger = a, r.disable = function() {
        en(Tu, r);
      }, r.createComponentLogger = function(s) {
        return new vu(s);
      }, r.verbose = e("verbose"), r.debug = e("debug"), r.info = e("info"), r.warn = e("warn"), r.error = e("error");
    }
    return t.instance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t;
  }()
), Ru = function(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var a = r.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, wu = function(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], a = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && a >= t.length && (t = void 0), { value: t && t[a++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Su = (
  /** @class */
  function() {
    function t(e) {
      this._entries = e ? new Map(e) : /* @__PURE__ */ new Map();
    }
    return t.prototype.getEntry = function(e) {
      var r = this._entries.get(e);
      if (r)
        return Object.assign({}, r);
    }, t.prototype.getAllEntries = function() {
      return Array.from(this._entries.entries()).map(function(e) {
        var r = Ru(e, 2), a = r[0], s = r[1];
        return [a, s];
      });
    }, t.prototype.setEntry = function(e, r) {
      var a = new t(this._entries);
      return a._entries.set(e, r), a;
    }, t.prototype.removeEntry = function(e) {
      var r = new t(this._entries);
      return r._entries.delete(e), r;
    }, t.prototype.removeEntries = function() {
      for (var e, r, a = [], s = 0; s < arguments.length; s++)
        a[s] = arguments[s];
      var i = new t(this._entries);
      try {
        for (var o = wu(a), c = o.next(); !c.done; c = o.next()) {
          var u = c.value;
          i._entries.delete(u);
        }
      } catch (l) {
        e = { error: l };
      } finally {
        try {
          c && !c.done && (r = o.return) && r.call(o);
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
Ze.instance();
function Au(t) {
  return t === void 0 && (t = {}), new Su(new Map(Object.entries(t)));
}
function Hs(t) {
  return Symbol.for(t);
}
var Iu = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e) {
      var r = this;
      r._currentContext = e ? new Map(e) : /* @__PURE__ */ new Map(), r.getValue = function(a) {
        return r._currentContext.get(a);
      }, r.setValue = function(a, s) {
        var i = new t(r._currentContext);
        return i._currentContext.set(a, s), i;
      }, r.deleteValue = function(a) {
        var s = new t(r._currentContext);
        return s._currentContext.delete(a), s;
      };
    }
    return t;
  }()
), ku = new Iu(), xu = {
  get: function(t, e) {
    if (t != null)
      return t[e];
  },
  keys: function(t) {
    return t == null ? [] : Object.keys(t);
  }
}, Pu = {
  set: function(t, e, r) {
    t != null && (t[e] = r);
  }
}, Nu = function(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var a = r.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Ou = function(t, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, Cu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.active = function() {
      return ku;
    }, t.prototype.with = function(e, r, a) {
      for (var s = [], i = 3; i < arguments.length; i++)
        s[i - 3] = arguments[i];
      return r.call.apply(r, Ou([a], Nu(s), !1));
    }, t.prototype.bind = function(e, r) {
      return r;
    }, t.prototype.enable = function() {
      return this;
    }, t.prototype.disable = function() {
      return this;
    }, t;
  }()
), ju = function(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var a = r.call(t), s, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(s = a.next()).done; ) i.push(s.value);
  } catch (c) {
    o = { error: c };
  } finally {
    try {
      s && !s.done && (r = a.return) && r.call(a);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}, Mu = function(t, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return t.concat(i || Array.prototype.slice.call(e));
}, dn = "context", Uu = new Cu(), tn = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalContextManager = function(e) {
      return Qr(dn, e, Ze.instance());
    }, t.prototype.active = function() {
      return this._getContextManager().active();
    }, t.prototype.with = function(e, r, a) {
      for (var s, i = [], o = 3; o < arguments.length; o++)
        i[o - 3] = arguments[o];
      return (s = this._getContextManager()).with.apply(s, Mu([e, r, a], ju(i), !1));
    }, t.prototype.bind = function(e, r) {
      return this._getContextManager().bind(e, r);
    }, t.prototype._getContextManager = function() {
      return dt(dn) || Uu;
    }, t.prototype.disable = function() {
      this._getContextManager().disable(), en(dn, Ze.instance());
    }, t;
  }()
), xn;
(function(t) {
  t[t.NONE = 0] = "NONE", t[t.SAMPLED = 1] = "SAMPLED";
})(xn || (xn = {}));
var Ys = "0000000000000000", zs = "00000000000000000000000000000000", Du = {
  traceId: zs,
  spanId: Ys,
  traceFlags: xn.NONE
}, Ot = (
  /** @class */
  function() {
    function t(e) {
      e === void 0 && (e = Du), this._spanContext = e;
    }
    return t.prototype.spanContext = function() {
      return this._spanContext;
    }, t.prototype.setAttribute = function(e, r) {
      return this;
    }, t.prototype.setAttributes = function(e) {
      return this;
    }, t.prototype.addEvent = function(e, r) {
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
    }, t.prototype.recordException = function(e, r) {
    }, t;
  }()
), ra = Hs("OpenTelemetry Context Key SPAN");
function na(t) {
  return t.getValue(ra) || void 0;
}
function $u() {
  return na(tn.getInstance().active());
}
function aa(t, e) {
  return t.setValue(ra, e);
}
function Lu(t) {
  return t.deleteValue(ra);
}
function Ku(t, e) {
  return aa(t, new Ot(e));
}
function qs(t) {
  var e;
  return (e = na(t)) === null || e === void 0 ? void 0 : e.spanContext();
}
var Fu = /^([0-9a-f]{32})$/i, Bu = /^[0-9a-f]{16}$/i;
function Gu(t) {
  return Fu.test(t) && t !== zs;
}
function Zu(t) {
  return Bu.test(t) && t !== Ys;
}
function Js(t) {
  return Gu(t.traceId) && Zu(t.spanId);
}
function Vu(t) {
  return new Ot(t);
}
var fn = tn.getInstance(), Xs = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.startSpan = function(e, r, a) {
      a === void 0 && (a = fn.active());
      var s = !!(r != null && r.root);
      if (s)
        return new Ot();
      var i = a && qs(a);
      return Wu(i) && Js(i) ? new Ot(i) : new Ot();
    }, t.prototype.startActiveSpan = function(e, r, a, s) {
      var i, o, c;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? c = r : arguments.length === 3 ? (i = r, c = a) : (i = r, o = a, c = s);
        var u = o ?? fn.active(), l = this.startSpan(e, i, u), d = aa(u, l);
        return fn.with(d, c, void 0, l);
      }
    }, t;
  }()
);
function Wu(t) {
  return typeof t == "object" && typeof t.spanId == "string" && typeof t.traceId == "string" && typeof t.traceFlags == "number";
}
var Hu = new Xs(), Yu = (
  /** @class */
  function() {
    function t(e, r, a, s) {
      this._provider = e, this.name = r, this.version = a, this.options = s;
    }
    return t.prototype.startSpan = function(e, r, a) {
      return this._getTracer().startSpan(e, r, a);
    }, t.prototype.startActiveSpan = function(e, r, a, s) {
      var i = this._getTracer();
      return Reflect.apply(i.startActiveSpan, i, arguments);
    }, t.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var e = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return e ? (this._delegate = e, this._delegate) : Hu;
    }, t;
  }()
), zu = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, r, a) {
      return new Xs();
    }, t;
  }()
), qu = new zu(), Oa = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getTracer = function(e, r, a) {
      var s;
      return (s = this.getDelegateTracer(e, r, a)) !== null && s !== void 0 ? s : new Yu(this, e, r, a);
    }, t.prototype.getDelegate = function() {
      var e;
      return (e = this._delegate) !== null && e !== void 0 ? e : qu;
    }, t.prototype.setDelegate = function(e) {
      this._delegate = e;
    }, t.prototype.getDelegateTracer = function(e, r, a) {
      var s;
      return (s = this._delegate) === null || s === void 0 ? void 0 : s.getTracer(e, r, a);
    }, t;
  }()
), Jt;
(function(t) {
  t[t.INTERNAL = 0] = "INTERNAL", t[t.SERVER = 1] = "SERVER", t[t.CLIENT = 2] = "CLIENT", t[t.PRODUCER = 3] = "PRODUCER", t[t.CONSUMER = 4] = "CONSUMER";
})(Jt || (Jt = {}));
var kr;
(function(t) {
  t[t.UNSET = 0] = "UNSET", t[t.OK = 1] = "OK", t[t.ERROR = 2] = "ERROR";
})(kr || (kr = {}));
var gr = tn.getInstance(), Ju = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.inject = function(e, r) {
    }, t.prototype.extract = function(e, r) {
      return e;
    }, t.prototype.fields = function() {
      return [];
    }, t;
  }()
), sa = Hs("OpenTelemetry Baggage Key");
function Qs(t) {
  return t.getValue(sa) || void 0;
}
function Xu() {
  return Qs(tn.getInstance().active());
}
function Qu(t, e) {
  return t.setValue(sa, e);
}
function el(t) {
  return t.deleteValue(sa);
}
var hn = "propagation", tl = new Ju(), rl = (
  /** @class */
  function() {
    function t() {
      this.createBaggage = Au, this.getBaggage = Qs, this.getActiveBaggage = Xu, this.setBaggage = Qu, this.deleteBaggage = el;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalPropagator = function(e) {
      return Qr(hn, e, Ze.instance());
    }, t.prototype.inject = function(e, r, a) {
      return a === void 0 && (a = Pu), this._getGlobalPropagator().inject(e, r, a);
    }, t.prototype.extract = function(e, r, a) {
      return a === void 0 && (a = xu), this._getGlobalPropagator().extract(e, r, a);
    }, t.prototype.fields = function() {
      return this._getGlobalPropagator().fields();
    }, t.prototype.disable = function() {
      en(hn, Ze.instance());
    }, t.prototype._getGlobalPropagator = function() {
      return dt(hn) || tl;
    }, t;
  }()
), ei = rl.getInstance(), pn = "trace", nl = (
  /** @class */
  function() {
    function t() {
      this._proxyTracerProvider = new Oa(), this.wrapSpanContext = Vu, this.isSpanContextValid = Js, this.deleteSpan = Lu, this.getSpan = na, this.getActiveSpan = $u, this.getSpanContext = qs, this.setSpan = aa, this.setSpanContext = Ku;
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalTracerProvider = function(e) {
      var r = Qr(pn, this._proxyTracerProvider, Ze.instance());
      return r && this._proxyTracerProvider.setDelegate(e), r;
    }, t.prototype.getTracerProvider = function() {
      return dt(pn) || this._proxyTracerProvider;
    }, t.prototype.getTracer = function(e, r) {
      return this.getTracerProvider().getTracer(e, r);
    }, t.prototype.disable = function() {
      en(pn, Ze.instance()), this._proxyTracerProvider = new Oa();
    }, t;
  }()
), al = nl.getInstance();
const gn = "$@null((", sl = "$@circular((";
function Pn(t, e, r = /* @__PURE__ */ new WeakSet()) {
  const a = {};
  if (t === void 0)
    return a;
  if (t === null)
    return a[e || ""] = gn, a;
  if (typeof t == "string" || typeof t == "number" || typeof t == "boolean")
    return a[e || ""] = t, a;
  if (t instanceof Date)
    return a[e || ""] = t.toISOString(), a;
  if (t !== null && typeof t == "object" && r.has(t))
    return a[e || ""] = sl, a;
  t !== null && typeof t == "object" && r.add(t);
  for (const [s, i] of Object.entries(t)) {
    const o = `${e ? `${e}.` : ""}${Array.isArray(t) ? `[${s}]` : s}`;
    if (Array.isArray(i))
      for (let c = 0; c < i.length; c++)
        typeof i[c] == "object" && i[c] !== null ? Object.assign(a, Pn(i[c], `${o}.[${c}]`, r)) : i[c] === null ? a[`${o}.[${c}]`] = gn : a[`${o}.[${c}]`] = i[c];
    else il(i) ? Object.assign(a, Pn(i, o, r)) : typeof i == "number" || typeof i == "string" || typeof i == "boolean" ? a[o] = i : i === null && (a[o] = gn);
  }
  return a;
}
function il(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function rn(t) {
  return Pn(t, x.STYLE_ACCESSORY);
}
class ol {
  constructor(e, r, a) {
    E(this, "pageFetcher");
    E(this, "data");
    E(this, "pagination");
    this.pageFetcher = a, this.data = e, this.pagination = r;
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
      for (const r of e.getPaginatedItems())
        yield r;
  }
}
class cl {
  constructor(e, r, a) {
    E(this, "pageFetcher");
    E(this, "data");
    E(this, "pagination");
    this.pageFetcher = a, this.data = e, this.pagination = r;
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
      for (const r of e.getPaginatedItems())
        yield r;
  }
}
var ul = Object.defineProperty, ll = (t, e, r) => e in t ? ul(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, or = (t, e, r) => ll(t, typeof e != "symbol" ? e + "" : e, r);
class Ca extends Error {
  constructor(e, r) {
    super(e), or(this, "type"), or(this, "field"), or(this, "value"), or(this, "line"), this.name = "ParseError", this.type = r.type, this.field = r.field, this.value = r.value, this.line = r.line;
  }
}
function mn(t) {
}
function dl(t) {
  const { onEvent: e = mn, onError: r = mn, onRetry: a = mn, onComment: s } = t;
  let i = "", o = !0, c, u = "", l = "";
  function d(b) {
    const A = o ? b.replace(/^\xEF\xBB\xBF/, "") : b, [$, Y] = fl(`${i}${A}`);
    for (const ue of $)
      y(ue);
    i = Y, o = !1;
  }
  function y(b) {
    if (b === "") {
      f();
      return;
    }
    if (b.startsWith(":")) {
      s && s(b.slice(b.startsWith(": ") ? 2 : 1));
      return;
    }
    const A = b.indexOf(":");
    if (A !== -1) {
      const $ = b.slice(0, A), Y = b[A + 1] === " " ? 2 : 1, ue = b.slice(A + Y);
      p($, ue, b);
      return;
    }
    p(b, "", b);
  }
  function p(b, A, $) {
    switch (b) {
      case "event":
        l = A;
        break;
      case "data":
        u = `${u}${A}
`;
        break;
      case "id":
        c = A.includes("\0") ? void 0 : A;
        break;
      case "retry":
        /^\d+$/.test(A) ? a(parseInt(A, 10)) : r(
          new Ca(`Invalid \`retry\` value: "${A}"`, {
            type: "invalid-retry",
            value: A,
            line: $
          })
        );
        break;
      default:
        r(
          new Ca(
            `Unknown field "${b.length > 20 ? `${b.slice(0, 20)}…` : b}"`,
            { type: "unknown-field", field: b, value: A, line: $ }
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
  function m(b = {}) {
    i && b.consume && y(i), c = void 0, u = "", l = "", i = "";
  }
  return { feed: d, reset: m };
}
function fl(t) {
  const e = [];
  let r = "";
  const a = t.length;
  for (let s = 0; s < a; s++) {
    const i = t[s];
    i === "\r" && t[s + 1] === `
` ? (e.push(r), r = "", s++) : i === "\r" || i === `
` ? (e.push(r), r = "") : r += i;
  }
  return [e, r];
}
const ti = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !1
};
function M(t, e, r, a) {
  return new oa(ia(t, e, r, a));
}
function Nn(t, e, r, a, s) {
  const i = new URLSearchParams(r.query);
  r.limit && i.set("page[size]", String(r.limit)), r.after && i.set("page[after]", r.after), r.before && i.set("page[before]", r.before);
  const o = n.object({
    data: n.array(t),
    pagination: n.object({
      next: n.string().optional(),
      previous: n.string().optional()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = ia(o, c.href, a, s);
  return new _l(u, t, e, r, a, s);
}
function ri(t, e, r, a, s) {
  const i = new URLSearchParams(r.query);
  r.limit && i.set("perPage", String(r.limit)), r.page && i.set("page", String(r.page));
  const o = n.object({
    data: n.array(t),
    pagination: n.object({
      currentPage: n.coerce.number(),
      totalPages: n.coerce.number(),
      count: n.coerce.number()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = ia(o, c.href, a, s);
  return new bl(u, t, e, r, a, s);
}
async function hl(t, e) {
  var i, o, c;
  if (!((i = t.options) != null && i.tracer))
    return e();
  const r = new URL(t.url), a = ((o = t.requestInit) == null ? void 0 : o.method) ?? "GET", s = t.options.name ?? `${a} ${r.pathname}`;
  return await t.options.tracer.startActiveSpan(s, async (u) => await e(u), {
    attributes: {
      [x.STYLE_ICON]: ((c = t.options) == null ? void 0 : c.icon) ?? "api",
      ...t.options.attributes
    }
  });
}
async function ia(t, e, r, a) {
  let s = await r;
  return hl({ url: e, requestInit: s, options: a }, async (i) => {
    s = El(s);
    const o = await On(t, e, s, a);
    return a != null && a.onResponseBody && i && a.onResponseBody(o.data, i), a != null && a.prepareData && (o.data = await a.prepareData(o.data)), o;
  });
}
async function On(t, e, r, a, s = 1) {
  try {
    const i = await fetch(e, vl(r)), o = yl(i.headers);
    if (!i.ok) {
      const d = gl(i, s, a == null ? void 0 : a.retry);
      if (d.retry)
        return await Ma(e, s + 1, d.delay, a, r, i), await On(t, e, r, a, s + 1);
      {
        const y = await i.text().catch((m) => ja(m).message), p = ml(y), f = p ? void 0 : y;
        throw Z.generate(i.status, p, f, o);
      }
    }
    const c = await pl(i), u = t.safeParse(c);
    if (u.success)
      return { data: u.data, response: i };
    const l = tu(u.error);
    throw new lu({
      status: i.status,
      cause: l,
      message: l.message,
      rawBody: c,
      headers: o
    });
  } catch (i) {
    if (i instanceof Z)
      throw i;
    if (a != null && a.retry) {
      const o = { ...ti, ...a.retry }, c = Vs(o, s);
      if (c)
        return await Ma(e, s + 1, c, a, r), await On(t, e, r, a, s + 1);
    }
    throw new Ws({ cause: ja(i) });
  }
}
async function pl(t) {
  try {
    return await t.clone().json();
  } catch {
    return;
  }
}
function ja(t) {
  return t instanceof Error ? t : new Error(t);
}
function gl(t, e, r) {
  function a() {
    const i = { ...ti, ...r }, o = Vs(i, e);
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
    if (e >= (typeof (r == null ? void 0 : r.maxAttempts) == "number" ? r == null ? void 0 : r.maxAttempts : 3))
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
function ml(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function yl(t) {
  return new Proxy(Object.fromEntries(
    // @ts-ignore
    t.entries()
  ), {
    get(e, r) {
      const a = r.toString();
      return e[a.toLowerCase()] || e[a];
    }
  });
}
function vl(t) {
  try {
    const e = {
      ...t,
      cache: "no-cache"
    }, r = new Request("http://localhost", e);
    return e;
  } catch {
    return t ?? {};
  }
}
class oa extends Promise {
  constructor(r) {
    super((a) => {
      a(null);
    });
    E(this, "responsePromise");
    this.responsePromise = r;
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   */
  asResponse() {
    return this.responsePromise.then((r) => r.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   */
  async withResponse() {
    const [r, a] = await Promise.all([this.parse(), this.asResponse()]);
    return { data: r, response: a };
  }
  parse() {
    return this.responsePromise.then((r) => r.data);
  }
  then(r, a) {
    return this.parse().then(r, a);
  }
  catch(r) {
    return this.parse().catch(r);
  }
  finally(r) {
    return this.parse().finally(r);
  }
}
var $r, ni;
class _l extends oa {
  constructor(r, a, s, i, o, c) {
    super(r.then((u) => ({
      data: new ol(u.data.data, u.data.pagination, g(this, $r, ni).bind(this)),
      response: u.response
    })));
    L(this, $r);
    E(this, "schema");
    E(this, "url");
    E(this, "params");
    E(this, "requestInit");
    E(this, "options");
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
    const r = await this;
    for await (const a of r)
      yield a;
  }
}
$r = new WeakSet(), ni = function(r) {
  return Nn(this.schema, this.url, { ...this.params, ...r }, this.requestInit, this.options);
};
var Lr, ai;
class bl extends oa {
  constructor(r, a, s, i, o, c) {
    super(r.then((u) => ({
      data: new cl(u.data.data, u.data.pagination, g(this, Lr, ai).bind(this)),
      response: u.response
    })));
    L(this, Lr);
    E(this, "schema");
    E(this, "url");
    E(this, "params");
    E(this, "requestInit");
    E(this, "options");
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
    const r = await this;
    for await (const a of r)
      yield a;
  }
}
Lr = new WeakSet(), ai = function(r) {
  return ri(this.schema, this.url, { ...this.params, ...r }, this.requestInit, this.options);
};
async function Ma(t, e, r, a, s, i) {
  if (a != null && a.tracer) {
    const o = (s == null ? void 0 : s.method) ?? "GET";
    return a.tracer.startActiveSpan(i ? `wait after ${i.status}` : "wait after error", async (c) => {
      await new Promise((u) => setTimeout(u, r));
    }, {
      attributes: {
        [x.STYLE_ICON]: "wait",
        ...rn({
          items: [
            {
              text: `retrying ${(a == null ? void 0 : a.name) ?? o.toUpperCase()} in ${r}ms`,
              variant: "normal"
            }
          ],
          style: "codepath"
        })
      }
    });
  }
  await new Promise((o) => setTimeout(o, r));
}
function El(t) {
  const e = new Headers(t == null ? void 0 : t.headers);
  if (e.get("x-trigger-worker") !== "true")
    return t;
  const r = Object.fromEntries(e.entries());
  return ei.inject(gr.active(), r), {
    ...t,
    headers: new Headers(r)
  };
}
class Tl extends TransformStream {
  constructor({ onError: e, onRetry: r, onComment: a } = {}) {
    let s;
    super({
      start(i) {
        s = dl({
          onEvent: (o) => {
            i.enqueue(o);
          },
          onError(o) {
            e === "terminate" ? i.error(o) : typeof e == "function" && e(o);
          },
          onRetry: r,
          onComment: a
        });
      },
      transform(i) {
        s.feed(i);
      }
    });
  }
}
const ze = {
  docs: {
    machines: {
      home: "https://trigger.dev/docs/v3/machines"
    },
    upgrade: {
      beta: "https://trigger.dev/docs/upgrading-beta"
    },
    troubleshooting: {
      concurrentWaits: "https://trigger.dev/docs/troubleshooting#parallel-waits-are-not-supported"
    }
  },
  site: {
    contact: "https://trigger.dev/contact"
  }
};
function Rl(t) {
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
function wl(t) {
  const e = Al(t);
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
const Sl = {
  TASK_PROCESS_OOM_KILLED: {
    message: "Your task ran out of memory. Try increasing the machine specs. If this doesn't fix it there might be a memory leak.",
    link: {
      name: "Machines",
      href: ze.docs.machines.home
    }
  },
  TASK_PROCESS_MAYBE_OOM_KILLED: {
    message: "We think your task ran out of memory, but we can't be certain. If this keeps happening, try increasing the machine specs.",
    link: {
      name: "Machines",
      href: ze.docs.machines.home
    }
  },
  TASK_PROCESS_SIGSEGV: {
    message: "Your task crashed with a segmentation fault (SIGSEGV). Most likely there's a bug in a package or binary you're using. If this keeps happening and you're unsure why, please get in touch.",
    link: {
      name: "Contact us",
      href: ze.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  TASK_PROCESS_SIGTERM: {
    message: "Your task exited after receiving SIGTERM but we don't know why. If this keeps happening, please get in touch so we can investigate.",
    link: {
      name: "Contact us",
      href: ze.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  OUTDATED_SDK_VERSION: {
    message: "Your task is using an outdated version of the SDK. Please upgrade to the latest version.",
    link: {
      name: "Beta upgrade guide",
      href: ze.docs.upgrade.beta
    }
  },
  TASK_DID_CONCURRENT_WAIT: {
    message: "Parallel waits are not supported, e.g. using Promise.all() around our wait functions.",
    link: {
      name: "Read the docs for solutions",
      href: ze.docs.troubleshooting.concurrentWaits
    }
  }
}, ne = (t) => ({
  type: "INTERNAL_ERROR",
  code: t,
  ...Sl[t]
}), Ua = (t, e = 100) => {
  if (!t)
    return;
  const r = e ? t.slice(0, e) : t;
  return r.includes("SIGTERM") ? "SIGTERM" : r.includes("SIGSEGV") ? "SIGSEGV" : r.includes("SIGKILL") ? "SIGKILL" : void 0;
};
function Al(t) {
  switch (t.type) {
    case "BUILT_IN_ERROR": {
      if (t.name === "UnexpectedExitError" && t.message.startsWith("Unexpected exit with code -1"))
        switch (Ua(t.stackTrace)) {
          case "SIGTERM":
            return {
              ...ne("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...ne("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...ne("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...ne("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: t.message,
              stackTrace: t.stackTrace
            };
        }
      if (t.name === "Error" && t.message === "ffmpeg was killed with signal SIGKILL")
        return {
          ...ne("TASK_PROCESS_OOM_KILLED")
        };
      break;
    }
    case "STRING_ERROR":
      break;
    case "CUSTOM_ERROR":
      break;
    case "INTERNAL_ERROR": {
      if (t.code === _s.TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE)
        switch (Ua(t.message)) {
          case "SIGTERM":
            return {
              ...ne("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...ne("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...ne("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...ne("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: t.message,
              stackTrace: t.stackTrace
            };
        }
      return {
        ...t,
        ...ne(t.code)
      };
    }
  }
  return t;
}
function Ct(t, e) {
  return typeof process < "u" && typeof process.env == "object" && process.env !== null ? process.env[t] ?? e : e;
}
const Tt = "api-client";
class Il extends Error {
  constructor(e) {
    super(e), this.name = "ApiClientMissingError";
  }
}
var it, mr;
const Kr = class Kr {
  constructor() {
    L(this, it);
  }
  static getInstance() {
    return this._instance || (this._instance = new Kr()), this._instance;
  }
  disable() {
    We(Tt);
  }
  get baseURL() {
    const e = g(this, it, mr).call(this);
    return (e == null ? void 0 : e.baseURL) ?? Ct("TRIGGER_API_URL") ?? "https://api.trigger.dev";
  }
  get accessToken() {
    const e = g(this, it, mr).call(this);
    return (e == null ? void 0 : e.secretKey) ?? (e == null ? void 0 : e.accessToken) ?? Ct("TRIGGER_SECRET_KEY") ?? Ct("TRIGGER_ACCESS_TOKEN");
  }
  get client() {
    if (!(!this.baseURL || !this.accessToken))
      return new Ba(this.baseURL, this.accessToken);
  }
  clientOrThrow() {
    if (!this.baseURL || !this.accessToken)
      throw new Il(this.apiClientMissingError());
    return new Ba(this.baseURL, this.accessToken);
  }
  runWithConfig(e, r) {
    const a = g(this, it, mr).call(this), s = { ...a, ...e };
    return ee(Tt, s, !0), r().finally(() => {
      ee(Tt, a, !0);
    });
  }
  setGlobalAPIClientConfiguration(e) {
    return ee(Tt, e);
  }
  apiClientMissingError() {
    const e = !!this.baseURL, r = !!this.accessToken;
    if (!e && !r)
      return "You need to set the TRIGGER_API_URL and TRIGGER_SECRET_KEY environment variables. See https://trigger.dev/docs/management/overview#authentication";
    if (e) {
      if (!r)
        return "You need to set the TRIGGER_SECRET_KEY environment variable. See https://trigger.dev/docs/management/overview#authentication";
    } else return "You need to set the TRIGGER_API_URL environment variable. See https://trigger.dev/docs/management/overview#authentication";
    return "Unknown error";
  }
};
it = new WeakSet(), mr = function() {
  return ge(Tt);
}, E(Kr, "_instance");
let Cn = Kr;
const sr = Cn.getInstance();
async function ca(t, e) {
  if (t.data)
    switch (t.dataType) {
      case "application/json":
        return JSON.parse(t.data, void 0);
      case "application/super+json":
        const { parse: r } = await ii();
        return r(t.data);
      case "text/plain":
        return t.data;
      case "application/store":
        throw new Error(`Cannot parse an application/store packet (${t.data}). Needs to be imported first.`);
      default:
        return t.data;
    }
}
async function kl(t, e) {
  const r = await si(t, void 0, e);
  return await ca(r);
}
async function nn(t) {
  if (t === void 0)
    return { dataType: "application/json" };
  if (typeof t == "string")
    return { data: t, dataType: "text/plain" };
  try {
    const { stringify: e } = await ii();
    return { data: e(t), dataType: "application/super+json" };
  } catch {
    return { data: t, dataType: "application/json" };
  }
}
const xl = {
  minTimeoutInMs: 500,
  maxTimeoutInMs: 5e3,
  maxAttempts: 5,
  factor: 2,
  randomize: !0
};
async function si(t, e, r) {
  return t.dataType !== "application/store" ? t : e ? await e.startActiveSpan("store.downloadPayload", async (s) => await Da(t, s, r), {
    attributes: {
      [x.STYLE_ICON]: "cloud-download"
    }
  }) ?? t : await Da(t, void 0, r);
}
async function Da(t, e, r) {
  if (!t.data)
    return t;
  const a = r ?? sr.client;
  if (!a)
    return t;
  const s = await a.getPayloadUrl(t.data), i = await M(n.any(), s.presignedUrl, void 0, {
    retry: xl
  }).asResponse();
  if (!i.ok)
    throw new Error(`Failed to import packet ${s.presignedUrl}: ${i.statusText}`);
  const o = await i.text();
  return e == null || e.setAttribute("size", Buffer.byteLength(o, "utf8")), {
    data: o,
    dataType: i.headers.get("content-type") ?? "application/json"
  };
}
async function ii() {
  const t = await import("./index-BycWwh12.js");
  return t.registerCustom({
    isApplicable: (e) => typeof Buffer == "function" && Buffer.isBuffer(e),
    serialize: (e) => [...e],
    deserialize: (e) => Buffer.from(e)
  }, "buffer"), t;
}
var Pl = Object.defineProperty, Nl = Object.defineProperties, Ol = Object.getOwnPropertyDescriptors, xr = Object.getOwnPropertySymbols, oi = Object.prototype.hasOwnProperty, ci = Object.prototype.propertyIsEnumerable, ui = (t) => {
  throw TypeError(t);
}, $a = (t, e, r) => e in t ? Pl(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, ft = (t, e) => {
  for (var r in e || (e = {}))
    oi.call(e, r) && $a(t, r, e[r]);
  if (xr)
    for (var r of xr(e))
      ci.call(e, r) && $a(t, r, e[r]);
  return t;
}, li = (t, e) => Nl(t, Ol(e)), Cl = (t, e) => {
  var r = {};
  for (var a in t)
    oi.call(t, a) && e.indexOf(a) < 0 && (r[a] = t[a]);
  if (t != null && xr)
    for (var a of xr(t))
      e.indexOf(a) < 0 && ci.call(t, a) && (r[a] = t[a]);
  return r;
}, ua = (t, e, r) => e.has(t) || ui("Cannot " + r), P = (t, e, r) => (ua(t, e, "read from private field"), r ? r.call(t) : e.get(t)), F = (t, e, r) => e.has(t) ? ui("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), j = (t, e, r, a) => (ua(t, e, "write to private field"), e.set(t, r), r), se = (t, e, r) => (ua(t, e, "access private method"), r), Ve = (t, e, r) => new Promise((a, s) => {
  var i = (u) => {
    try {
      c(r.next(u));
    } catch (l) {
      s(l);
    }
  }, o = (u) => {
    try {
      c(r.throw(u));
    } catch (l) {
      s(l);
    }
  }, c = (u) => u.done ? a(u.value) : Promise.resolve(u.value).then(i, o);
  c((r = r.apply(t, e)).next());
}), Pr = class di extends Error {
  constructor(e, r, a, s, i, o) {
    super(
      o || `HTTP Error ${e} at ${i}: ${r ?? JSON.stringify(a)}`
    ), this.url = i, this.name = "FetchError", this.status = e, this.text = r, this.json = a, this.headers = s;
  }
  static fromResponse(e, r) {
    return Ve(this, null, function* () {
      const a = e.status, s = Object.fromEntries([...e.headers.entries()]);
      let i, o;
      const c = e.headers.get("content-type");
      return c && c.includes("application/json") ? o = yield e.json() : i = yield e.text(), new di(a, i, o, s, r);
    });
  }
}, fi = class extends Error {
  constructor() {
    super("Fetch with backoff aborted"), this.name = "FetchBackoffAbortError";
  }
}, jl = class extends Error {
  constructor() {
    super("Invalid shape options: missing required url parameter"), this.name = "MissingShapeUrlError";
  }
}, Ml = class extends Error {
  constructor() {
    super("Invalid signal option. It must be an instance of AbortSignal."), this.name = "InvalidSignalError";
  }
}, Ul = class extends Error {
  constructor() {
    super(
      "shapeHandle is required if this isn't an initial fetch (i.e. offset > -1)"
    ), this.name = "MissingShapeHandleError";
  }
}, Dl = class extends Error {
  constructor(t) {
    super(
      `Cannot use reserved Electric parameter names in custom params: ${t.join(", ")}`
    ), this.name = "ReservedParamError";
  }
}, $l = class extends Error {
  constructor(t) {
    super(`Column "${t ?? "unknown"}" does not allow NULL values`), this.name = "ParserNullValueError";
  }
}, Ll = class extends Error {
  constructor(t, e) {
    let r = `The response for the shape request to ${t} didn't include the following required headers:
`;
    e.forEach((a) => {
      r += `- ${a}
`;
    }), r += `
This is often due to a proxy not setting CORS correctly so that all Electric headers can be read by the client.`, r += `
For more information visit the troubleshooting guide: /docs/guides/troubleshooting/missing-headers`, super(r);
  }
}, cr = (t) => Number(t), Kl = (t) => t === "true" || t === "t", Fl = (t) => BigInt(t), La = (t) => JSON.parse(t), Bl = (t) => t, Gl = {
  int2: cr,
  int4: cr,
  int8: Fl,
  bool: Kl,
  float4: cr,
  float8: cr,
  json: La,
  jsonb: La
};
function Zl(t, e) {
  let r = 0, a = null, s = "", i = !1, o = 0, c;
  function u(l) {
    const d = [];
    for (; r < l.length; r++) {
      if (a = l[r], i)
        a === "\\" ? s += l[++r] : a === '"' ? (d.push(e ? e(s) : s), s = "", i = l[r + 1] === '"', o = r + 2) : s += a;
      else if (a === '"')
        i = !0;
      else if (a === "{")
        o = ++r, d.push(u(l));
      else if (a === "}") {
        i = !1, o < r && d.push(e ? e(l.slice(o, r)) : l.slice(o, r)), o = r + 1;
        break;
      } else a === "," && c !== "}" && c !== '"' && (d.push(e ? e(l.slice(o, r)) : l.slice(o, r)), o = r + 1);
      c = a;
    }
    return o < r && d.push(e ? e(l.slice(o, r + 1)) : l.slice(o, r + 1)), d;
  }
  return u(t)[0];
}
var Vl = class {
  constructor(t) {
    this.parser = ft(ft({}, Gl), t);
  }
  parse(t, e) {
    return JSON.parse(t, (r, a) => {
      if (r === "value" && typeof a == "object" && a !== null) {
        const s = a;
        Object.keys(s).forEach((i) => {
          s[i] = this.parseRow(i, s[i], e);
        });
      }
      return a;
    });
  }
  // Parses the message values using the provided parser based on the schema information
  parseRow(t, e, r) {
    var a;
    const s = r[t];
    if (!s)
      return e;
    const i = s, { type: o, dims: c } = i, u = Cl(i, ["type", "dims"]), l = (a = this.parser[o]) != null ? a : Bl, d = Ka(l, s, t);
    return c && c > 0 ? Ka(
      (p, f) => Zl(p, d),
      s,
      t
    )(e) : d(e, u);
  }
};
function Ka(t, e, r) {
  var a;
  const s = !((a = e.not_null) != null && a);
  return (i) => {
    if (Wl(i)) {
      if (!s)
        throw new $l(r ?? "unknown");
      return null;
    }
    return t(i, e);
  };
}
function Wl(t) {
  return t === null || t === "NULL";
}
function hi(t) {
  return "key" in t;
}
function pi(t) {
  return !hi(t);
}
function Hl(t) {
  return pi(t) && t.headers.control === "up-to-date";
}
var Yl = "electric-cursor", jn = "electric-handle", gi = "electric-offset", zl = "electric-schema", ql = "electric-up-to-date", Jl = "columns", mi = "cursor", la = "handle", nt = "live", da = "offset", Xl = "table", Ql = "where", ed = "replica", td = [429], yi = {
  initialDelay: 100,
  maxDelay: 1e4,
  multiplier: 1.3
};
function rd(t, e = yi) {
  const {
    initialDelay: r,
    maxDelay: a,
    multiplier: s,
    debug: i = !1,
    onFailedAttempt: o
  } = e;
  return (...c) => Ve(this, null, function* () {
    var u;
    const l = c[0], d = c[1];
    let y = r, p = 0;
    for (; ; )
      try {
        const f = yield t(...c);
        if (f.ok) return f;
        throw yield Pr.fromResponse(f, l.toString());
      } catch (f) {
        if (o == null || o(), (u = d == null ? void 0 : d.signal) != null && u.aborted)
          throw new fi();
        if (f instanceof Pr && !td.includes(f.status) && f.status >= 400 && f.status < 500)
          throw f;
        yield new Promise((m) => setTimeout(m, y)), y = Math.min(y * s, a), i && (p++, console.log(`Retry attempt #${p} after ${y}ms`));
      }
  });
}
var nd = {
  maxChunksToPrefetch: 2
};
function ad(t, e = nd) {
  const { maxChunksToPrefetch: r } = e;
  let a;
  return (...i) => Ve(this, null, function* () {
    const o = i[0].toString(), c = a == null ? void 0 : a.consume(...i);
    if (c)
      return c;
    a == null || a.abort();
    const u = yield t(...i), l = fa(o, u);
    return l && (a = new ud({
      fetchClient: t,
      maxPrefetchedRequests: r,
      url: l,
      requestInit: i[1]
    })), u;
  });
}
var sd = [
  "electric-offset",
  "electric-handle"
], id = ["electric-cursor"], od = ["electric-schema"];
function cd(t) {
  return (...e) => Ve(this, null, function* () {
    const r = yield t(...e);
    if (r.ok) {
      const a = r.headers, s = [], i = (l) => s.push(...l.filter((d) => !a.has(d)));
      i(sd);
      const c = e[0].toString(), u = new URL(c);
      if (u.searchParams.get(nt) === "true" && i(id), (!u.searchParams.has(nt) || u.searchParams.get(nt) === "false") && i(od), s.length > 0)
        throw new Ll(c, s);
    }
    return r;
  });
}
var Nr, Or, _e, Je, be, jt, Cr, ud = class {
  constructor(t) {
    F(this, jt), F(this, Nr), F(this, Or), F(this, _e, /* @__PURE__ */ new Map()), F(this, Je), F(this, be);
    var e;
    j(this, Nr, (e = t.fetchClient) != null ? e : (...r) => fetch(...r)), j(this, Or, t.maxPrefetchedRequests), j(this, Je, t.url.toString()), j(this, be, P(this, Je)), se(this, jt, Cr).call(this, t.url, t.requestInit);
  }
  abort() {
    P(this, _e).forEach(([t, e]) => e.abort());
  }
  consume(...t) {
    var e;
    const r = t[0].toString(), a = (e = P(this, _e).get(r)) == null ? void 0 : e[0];
    if (!(!a || r !== P(this, Je)))
      return P(this, _e).delete(r), a.then((s) => {
        const i = fa(r, s);
        j(this, Je, i), P(this, be) && !P(this, _e).has(P(this, be)) && se(this, jt, Cr).call(this, P(this, be), t[1]);
      }).catch(() => {
      }), a;
  }
};
Nr = /* @__PURE__ */ new WeakMap();
Or = /* @__PURE__ */ new WeakMap();
_e = /* @__PURE__ */ new WeakMap();
Je = /* @__PURE__ */ new WeakMap();
be = /* @__PURE__ */ new WeakMap();
jt = /* @__PURE__ */ new WeakSet();
Cr = function(...t) {
  var e, r;
  const a = t[0].toString();
  if (P(this, _e).size >= P(this, Or)) return;
  const s = new AbortController();
  try {
    const i = P(this, Nr).call(this, a, li(ft({}, (e = t[1]) != null ? e : {}), {
      signal: ld(s, (r = t[1]) == null ? void 0 : r.signal)
    }));
    P(this, _e).set(a, [i, s]), i.then((o) => {
      if (!o.ok || s.signal.aborted) return;
      const c = fa(a, o);
      if (!c || c === a) {
        j(this, be, void 0);
        return;
      }
      return j(this, be, c), se(this, jt, Cr).call(this, c, t[1]);
    }).catch(() => {
    });
  } catch {
  }
};
function fa(t, e) {
  const r = e.headers.get(jn), a = e.headers.get(gi), s = e.headers.has(ql);
  if (!r || !a || s) return;
  const i = new URL(t);
  if (!i.searchParams.has(nt))
    return i.searchParams.set(la, r), i.searchParams.set(da, a), i.searchParams.sort(), i.toString();
}
function ld(t, e) {
  return e && (e.aborted ? t.abort() : e.addEventListener("abort", () => t.abort(), {
    once: !0
  })), t.signal;
}
var vi = /* @__PURE__ */ new Set([
  mi,
  la,
  nt,
  da
]);
function dd(t) {
  const e = {};
  for (const [r, a] of Object.entries(t))
    e[r] = Array.isArray(a) ? a.join(",") : a;
  return e;
}
var jr, Mr, Ur, Ue, Le, ht, De, we, Ke, Se, at, Xt, de, Mn, Un, _i, Dn, bi = class {
  constructor(t) {
    F(this, de), F(this, jr, null), F(this, Mr), F(this, Ur), F(this, Ue, /* @__PURE__ */ new Map()), F(this, Le), F(this, ht), F(this, De), F(this, we, !1), F(this, Ke, !1), F(this, Se), F(this, at), F(this, Xt);
    var e, r, a;
    this.options = ft({ subscribe: !0 }, t), fd(this.options), j(this, Le, (e = this.options.offset) != null ? e : "-1"), j(this, ht, ""), j(this, Se, this.options.handle), j(this, Ur, new Vl(t.parser)), j(this, Xt, this.options.onError);
    const s = (r = t.fetchClient) != null ? r : (...o) => fetch(...o), i = rd(s, li(ft({}, (a = t.backoffOptions) != null ? a : yi), {
      onFailedAttempt: () => {
        var o, c;
        j(this, Ke, !1), (c = (o = t.backoffOptions) == null ? void 0 : o.onFailedAttempt) == null || c.call(o);
      }
    }));
    j(this, Mr, cd(
      ad(i)
    )), se(this, de, Mn).call(this);
  }
  get shapeHandle() {
    return P(this, Se);
  }
  get error() {
    return P(this, jr);
  }
  get isUpToDate() {
    return P(this, we);
  }
  get lastOffset() {
    return P(this, Le);
  }
  subscribe(t, e = () => {
  }) {
    const r = Math.random();
    return P(this, Ue).set(r, [t, e]), () => {
      P(this, Ue).delete(r);
    };
  }
  unsubscribeAll() {
    P(this, Ue).clear();
  }
  /** Unix time at which we last synced. Undefined when `isLoading` is true. */
  lastSyncedAt() {
    return P(this, De);
  }
  /** Time elapsed since last sync (in ms). Infinity if we did not yet sync. */
  lastSynced() {
    return P(this, De) === void 0 ? 1 / 0 : Date.now() - P(this, De);
  }
  /** Indicates if we are connected to the Electric sync service. */
  isConnected() {
    return P(this, Ke);
  }
  /** True during initial fetch. False afterwise.  */
  isLoading() {
    return !P(this, we);
  }
};
jr = /* @__PURE__ */ new WeakMap();
Mr = /* @__PURE__ */ new WeakMap();
Ur = /* @__PURE__ */ new WeakMap();
Ue = /* @__PURE__ */ new WeakMap();
Le = /* @__PURE__ */ new WeakMap();
ht = /* @__PURE__ */ new WeakMap();
De = /* @__PURE__ */ new WeakMap();
we = /* @__PURE__ */ new WeakMap();
Ke = /* @__PURE__ */ new WeakMap();
Se = /* @__PURE__ */ new WeakMap();
at = /* @__PURE__ */ new WeakMap();
Xt = /* @__PURE__ */ new WeakMap();
de = /* @__PURE__ */ new WeakSet();
Mn = function() {
  return Ve(this, null, function* () {
    var t, e;
    try {
      for (; !((t = this.options.signal) != null && t.aborted) && !P(this, we) || this.options.subscribe; ) {
        const { url: r, signal: a } = this.options, s = new URL(r);
        if (this.options.params) {
          const m = Object.keys(this.options.params).filter(
            ($) => vi.has($)
          );
          if (m.length > 0)
            throw new Error(
              `Cannot use reserved Electric parameter names in custom params: ${m.join(", ")}`
            );
          const b = dd(this.options.params);
          b.table && s.searchParams.set(Xl, b.table), b.where && s.searchParams.set(Ql, b.where), b.columns && s.searchParams.set(Jl, b.columns), b.replica && s.searchParams.set(ed, b.replica);
          const A = ft({}, b);
          delete A.table, delete A.where, delete A.columns, delete A.replica;
          for (const [$, Y] of Object.entries(A))
            s.searchParams.set($, Y);
        }
        s.searchParams.set(da, P(this, Le)), P(this, we) && (s.searchParams.set(nt, "true"), s.searchParams.set(
          mi,
          P(this, ht)
        )), P(this, Se) && s.searchParams.set(
          la,
          P(this, Se)
        ), s.searchParams.sort();
        let i;
        try {
          i = yield P(this, Mr).call(this, s.toString(), {
            signal: a,
            headers: this.options.headers
          }), j(this, Ke, !0);
        } catch (m) {
          if (m instanceof fi) break;
          if (!(m instanceof Pr)) throw m;
          if (m.status == 409) {
            const b = m.headers[jn];
            se(this, de, Dn).call(this, b), yield se(this, de, Un).call(this, m.json);
            continue;
          } else if (m.status >= 400 && m.status < 500)
            throw se(this, de, _i).call(this, m), m;
        }
        const { headers: o, status: c } = i, u = o.get(jn);
        u && j(this, Se, u);
        const l = o.get(gi);
        l && j(this, Le, l);
        const d = o.get(Yl);
        d && j(this, ht, d);
        const y = () => {
          const m = o.get(zl);
          return m ? JSON.parse(m) : {};
        };
        j(this, at, (e = P(this, at)) != null ? e : y());
        const p = c === 204 ? "[]" : yield i.text();
        c === 204 && j(this, De, Date.now());
        const f = P(this, Ur).parse(p, P(this, at));
        if (f.length > 0) {
          const m = f[f.length - 1];
          Hl(m) && (j(this, De, Date.now()), j(this, we, !0)), yield se(this, de, Un).call(this, f);
        }
      }
    } catch (r) {
      if (j(this, jr, r), P(this, Xt)) {
        const a = yield P(this, Xt).call(this, r);
        typeof a == "object" && (se(this, de, Dn).call(this), "params" in a && (this.options.params = a.params), "headers" in a && (this.options.headers = a.headers), se(this, de, Mn).call(this));
        return;
      }
      throw r;
    } finally {
      j(this, Ke, !1);
    }
  });
};
Un = function(t) {
  return Ve(this, null, function* () {
    yield Promise.all(
      Array.from(P(this, Ue).values()).map((e) => Ve(this, [e], function* ([r, a]) {
        try {
          yield r(t);
        } catch (s) {
          queueMicrotask(() => {
            throw s;
          });
        }
      }))
    );
  });
};
_i = function(t) {
  P(this, Ue).forEach(([e, r]) => {
    r == null || r(t);
  });
};
Dn = function(t) {
  j(this, Le, "-1"), j(this, ht, ""), j(this, Se, t), j(this, we, !1), j(this, Ke, !1), j(this, at, void 0);
};
bi.Replica = {
  FULL: "full",
  DEFAULT: "default"
};
function fd(t) {
  if (!t.url)
    throw new jl();
  if (t.signal && !(t.signal instanceof AbortSignal))
    throw new Ml();
  if (t.offset !== void 0 && t.offset !== "-1" && !t.handle)
    throw new Ul();
  if (t.params) {
    const e = Object.keys(t.params).filter(
      (r) => vi.has(r)
    );
    if (e.length > 0)
      throw new Dl(e);
  }
}
function hd(t, e, r) {
  var c;
  const a = new AbortController();
  (c = r == null ? void 0 : r.signal) == null || c.addEventListener("abort", () => {
    a.abort();
  }, { once: !0 });
  const s = new bi({
    url: e,
    headers: {
      ...r == null ? void 0 : r.headers,
      "x-trigger-electric-version": "1.0.0-beta.1"
    },
    fetchClient: r == null ? void 0 : r.fetchClient,
    signal: a.signal,
    onError: (u) => {
      var l;
      (l = r == null ? void 0 : r.onError) == null || l.call(r, u);
    }
  });
  return {
    stream: new gd(s).stream.pipeThrough(new TransformStream({
      async transform(u, l) {
        const d = t.safeParse(u);
        d.success ? l.enqueue(d.data) : l.error(new Error(`Unable to parse shape: ${d.error.message}`));
      }
    })),
    stop: (u) => {
      u ? setTimeout(() => {
        a.signal.aborted || a.abort();
      }, u) : a.abort();
    }
  };
}
function pd(t, e) {
  const r = t.pipeThrough(new TransformStream(e));
  return r[Symbol.asyncIterator] = () => {
    const a = r.getReader();
    return {
      async next() {
        const { done: s, value: i } = await a.read();
        return s ? { done: !0, value: void 0 } : { done: !1, value: i };
      }
    };
  }, r;
}
function Fa(t, e, r) {
  return new ReadableStream({
    async start(a) {
      const i = t.pipeThrough(new TransformStream(e)).getReader();
      for (r.addEventListener("abort", () => {
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
var J, Ee, Qt, ot, er, Fr, Ei;
class gd {
  constructor(e) {
    L(this, Fr);
    L(this, J);
    L(this, Ee, /* @__PURE__ */ new Map());
    L(this, Qt);
    L(this, ot, !1);
    L(this, er);
    Ye(this, J, e);
    const r = new ReadableStream({
      start: (a) => {
        Ye(this, er, B(this, J).subscribe((s) => a.enqueue(s), g(this, Fr, Ei).bind(this)));
      }
    });
    Ye(this, Qt, pd(r, {
      transform: (a, s) => {
        const i = /* @__PURE__ */ new Set();
        for (const o of a)
          if (hi(o)) {
            const c = o.key;
            switch (o.headers.operation) {
              case "insert": {
                B(this, Ee).set(c, o.value), i.add(c);
                break;
              }
              case "update": {
                const u = B(this, Ee).get(c), l = u ? { ...u, ...o.value } : o.value;
                B(this, Ee).set(c, l), i.add(c);
                break;
              }
            }
          } else pi(o) && o.headers.control === "must-refetch" && (B(this, Ee).clear(), Ye(this, ot, !1));
        for (const o of i) {
          const c = B(this, Ee).get(o);
          c && s.enqueue(c);
        }
      }
    }));
  }
  stop() {
    var e;
    (e = B(this, er)) == null || e.call(this);
  }
  get stream() {
    return B(this, Qt);
  }
  get isUpToDate() {
    return B(this, J).isUpToDate;
  }
  get lastOffset() {
    return B(this, J).lastOffset;
  }
  get handle() {
    return B(this, J).shapeHandle;
  }
  get error() {
    return B(this, ot);
  }
  lastSyncedAt() {
    return B(this, J).lastSyncedAt();
  }
  lastSynced() {
    return B(this, J).lastSynced();
  }
  isLoading() {
    return B(this, J).isLoading();
  }
  isConnected() {
    return B(this, J).isConnected();
  }
}
J = new WeakMap(), Ee = new WeakMap(), Qt = new WeakMap(), ot = new WeakMap(), er = new WeakMap(), Fr = new WeakSet(), Ei = function(e) {
  e instanceof Pr && Ye(this, ot, e);
};
class kf extends TransformStream {
  constructor() {
    super({
      transform: (r, a) => {
        this.buffer += r;
        const s = this.buffer.split(`
`);
        this.buffer = s.pop() || "";
        const i = s.filter((o) => o.trim().length > 0);
        i.length > 0 && a.enqueue(i);
      },
      flush: (r) => {
        const a = this.buffer.trim();
        a.length > 0 && r.enqueue([a]);
      }
    });
    E(this, "buffer", "");
  }
}
function yn(t, e) {
  var o;
  const r = new AbortController(), a = new Ti(Ct("TRIGGER_STREAM_URL", Ct("TRIGGER_API_URL")) ?? "https://api.trigger.dev", {
    headers: e == null ? void 0 : e.headers,
    signal: r.signal
  });
  (o = e == null ? void 0 : e.signal) == null || o.addEventListener("abort", () => {
    r.signal.aborted || r.abort();
  }, { once: !0 });
  const s = hd(_c, t, {
    ...e,
    signal: r.signal,
    onError: (c) => {
      var u;
      (u = e == null ? void 0 : e.onFetchError) == null || u.call(e, c);
    }
  }), i = {
    runShapeStream: s.stream,
    stopRunShapeStream: () => s.stop(30 * 1e3),
    streamFactory: a,
    abortController: r,
    ...e
  };
  return new yd(i);
}
class md {
  constructor(e, r) {
    E(this, "url");
    E(this, "options");
    this.url = e, this.options = r;
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
        throw Z.generate(e.status, {}, "Could not subscribe to stream", Object.fromEntries(e.headers));
      if (!e.body)
        throw new Error("No response body");
      return e.body.pipeThrough(new TextDecoderStream()).pipeThrough(new Tl()).pipeThrough(new TransformStream({
        transform(r, a) {
          a.enqueue(_d(r.data));
        }
      }));
    });
  }
}
class Ti {
  constructor(e, r) {
    E(this, "baseUrl");
    E(this, "options");
    this.baseUrl = e, this.options = r;
  }
  createSubscription(e, r, a) {
    if (!e || !r)
      throw new Error("runId and streamKey are required");
    const s = `${a ?? this.baseUrl}/realtime/v1/streams/${e}/${r}`;
    return new md(s, this.options);
  }
}
class yd {
  constructor(e) {
    E(this, "options");
    E(this, "stream");
    E(this, "packetCache", /* @__PURE__ */ new Map());
    E(this, "_closeOnComplete");
    E(this, "_isRunComplete", !1);
    this.options = e, this._closeOnComplete = typeof e.closeOnComplete > "u" ? !0 : e.closeOnComplete, this.stream = Fa(this.options.runShapeStream, {
      transform: async (r, a) => {
        const s = await this.transformRunShape(r);
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
    return Fa(this.stream, {
      transform: async (r, a) => {
        var s;
        if (a.enqueue({
          type: "run",
          run: r
        }), r.metadata && "$$streams" in r.metadata && Array.isArray(r.metadata.$$streams))
          for (const i of r.metadata.$$streams)
            typeof i == "string" && (e.has(i) || (e.add(i), this.options.streamFactory.createSubscription(r.id, i, (s = this.options.client) == null ? void 0 : s.baseUrl).subscribe().then((c) => {
              c.pipeThrough(new TransformStream({
                transform(u, l) {
                  l.enqueue({
                    type: i,
                    chunk: u,
                    run: r
                  });
                }
              })).pipeTo(new WritableStream({
                write(u) {
                  a.enqueue(u);
                }
              })).catch((u) => {
                console.error(`Error in stream ${i}:`, u);
              });
            }).catch((c) => {
              console.error(`Error subscribing to stream ${i}:`, c);
            })));
      }
    }, this.options.abortController.signal);
  }
  async transformRunShape(e) {
    const r = e.payloadType ? { data: e.payload ?? void 0, dataType: e.payloadType } : void 0, a = e.outputType ? { data: e.output ?? void 0, dataType: e.outputType } : void 0, [s, i] = await Promise.all([
      { packet: r, key: "payload" },
      { packet: a, key: "output" }
    ].map(async ({ packet: c, key: u }) => {
      if (!c)
        return;
      const l = this.packetCache.get(`${e.friendlyId}/${u}`);
      if (typeof l < "u")
        return l;
      const d = await kl(c, this.options.client);
      return this.packetCache.set(`${e.friendlyId}/${u}`, d), d;
    })), o = e.metadata && e.metadataType ? await ca({ data: e.metadata, dataType: e.metadataType }) : void 0;
    return {
      id: e.friendlyId,
      payload: s,
      output: i,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      taskIdentifier: e.taskIdentifier,
      number: e.number,
      status: vd(e.status),
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
      error: e.error ? wl(e.error) : void 0,
      isTest: e.isTest,
      metadata: o
    };
  }
}
function vd(t) {
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
    case "TIMED_OUT":
      return "TIMED_OUT";
    default:
      throw new Error(`Unknown status: ${t}`);
  }
}
function _d(t) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}
const bd = () => typeof window < "u" && typeof navigator < "u" && typeof navigator.userAgent == "string" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent) : !1;
var as, ss, is;
bd() && ((as = ReadableStream.prototype).values ?? (as.values = function({ preventCancel: t = !1 } = {}) {
  const e = this.getReader();
  return {
    async next() {
      try {
        const r = await e.read();
        return r.done && e.releaseLock(), r;
      } catch (r) {
        throw e.releaseLock(), r;
      }
    },
    async return(r) {
      if (t)
        e.releaseLock();
      else {
        const a = e.cancel(r);
        e.releaseLock(), await a;
      }
      return { done: !0, value: r };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}), (ss = ReadableStream.prototype)[is = Symbol.asyncIterator] ?? (ss[is] = ReadableStream.prototype.values));
const Ed = {
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 1e3,
    maxTimeoutInMs: 3e4,
    factor: 1.6,
    randomize: !1
  }
};
var k, O, yr;
class Ba {
  constructor(e, r, a = {}) {
    L(this, k);
    E(this, "baseUrl");
    E(this, "accessToken");
    E(this, "defaultRequestOptions");
    this.accessToken = r, this.baseUrl = e.replace(/\/$/, ""), this.defaultRequestOptions = C(Ed, a);
  }
  get fetchClient() {
    const e = g(this, k, O).call(this, !1);
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
    return g(this, k, O).call(this, !1);
  }
  async getRunResult(e, r) {
    try {
      return await M(re, `${this.baseUrl}/api/v1/runs/${e}/result`, {
        method: "GET",
        headers: g(this, k, O).call(this, !1)
      }, C(this.defaultRequestOptions, r));
    } catch (a) {
      if (a instanceof Z && a.status === 404)
        return;
      throw a;
    }
  }
  async getBatchResults(e, r) {
    return await M(Yo, `${this.baseUrl}/api/v1/batches/${e}/results`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  triggerTask(e, r, a, s) {
    const i = encodeURIComponent(e);
    return M(ac, `${this.baseUrl}/api/v1/tasks/${i}/trigger`, {
      method: "POST",
      headers: g(this, k, O).call(this, (a == null ? void 0 : a.spanParentAsLink) ?? !1),
      body: JSON.stringify(r)
    }, C(this.defaultRequestOptions, s)).withResponse().then(async ({ response: o, data: c }) => {
      var p;
      const u = o.headers.get("x-trigger-jwt");
      if (typeof u == "string")
        return {
          ...c,
          publicAccessToken: u
        };
      const l = o.headers.get("x-trigger-jwt-claims"), d = l ? JSON.parse(l) : void 0, y = await Ea({
        secretKey: this.accessToken,
        payload: {
          ...d,
          scopes: [`read:runs:${c.id}`]
        },
        expirationTime: ((p = s == null ? void 0 : s.publicAccessToken) == null ? void 0 : p.expirationTime) ?? "1h"
      });
      return {
        ...c,
        publicAccessToken: y
      };
    });
  }
  batchTriggerV2(e, r, a) {
    return M(ic, `${this.baseUrl}/api/v1/tasks/batch`, {
      method: "POST",
      headers: g(this, k, O).call(this, (r == null ? void 0 : r.spanParentAsLink) ?? !1, {
        "idempotency-key": r == null ? void 0 : r.idempotencyKey,
        "idempotency-key-ttl": r == null ? void 0 : r.idempotencyKeyTTL,
        "batch-processing-strategy": r == null ? void 0 : r.processingStrategy
      }),
      body: JSON.stringify(e)
    }, C(this.defaultRequestOptions, a)).withResponse().then(async ({ response: s, data: i }) => {
      var l;
      const o = s.headers.get("x-trigger-jwt-claims"), c = o ? JSON.parse(o) : void 0, u = await Ea({
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
  createUploadPayloadUrl(e, r) {
    return M(Sa, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "PUT",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  getPayloadUrl(e, r) {
    return M(Sa, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  retrieveRun(e, r) {
    return M(Aa, `${this.baseUrl}/api/v3/runs/${e}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  listRuns(e, r) {
    const a = Ga(e);
    return Nn(In, `${this.baseUrl}/api/v1/runs`, {
      query: a,
      limit: e == null ? void 0 : e.limit,
      after: e == null ? void 0 : e.after,
      before: e == null ? void 0 : e.before
    }, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  listProjectRuns(e, r, a) {
    const s = Ga(r);
    return r != null && r.env && s.append("filter[env]", Array.isArray(r.env) ? r.env.join(",") : r.env), Nn(In, `${this.baseUrl}/api/v1/projects/${e}/runs`, {
      query: s,
      limit: r == null ? void 0 : r.limit,
      after: r == null ? void 0 : r.after,
      before: r == null ? void 0 : r.before
    }, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, a));
  }
  replayRun(e, r) {
    return M(cc, `${this.baseUrl}/api/v1/runs/${e}/replay`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  cancelRun(e, r) {
    return M(uc, `${this.baseUrl}/api/v2/runs/${e}/cancel`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  rescheduleRun(e, r, a) {
    return M(Aa, `${this.baseUrl}/api/v1/runs/${e}/reschedule`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(r)
    }, C(this.defaultRequestOptions, a));
  }
  addTags(e, r, a) {
    return M(n.object({ message: n.string() }), `${this.baseUrl}/api/v1/runs/${e}/tags`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(r)
    }, C(this.defaultRequestOptions, a));
  }
  createSchedule(e, r) {
    return M(Ce, `${this.baseUrl}/api/v1/schedules`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(e)
    }, C(this.defaultRequestOptions, r));
  }
  listSchedules(e, r) {
    const a = new URLSearchParams();
    return e != null && e.page && a.append("page", e.page.toString()), e != null && e.perPage && a.append("perPage", e.perPage.toString()), ri(Ce, `${this.baseUrl}/api/v1/schedules`, {
      page: e == null ? void 0 : e.page,
      limit: e == null ? void 0 : e.perPage
    }, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  retrieveSchedule(e, r) {
    return M(Ce, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  updateSchedule(e, r, a) {
    return M(Ce, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "PUT",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(r)
    }, C(this.defaultRequestOptions, a));
  }
  deactivateSchedule(e, r) {
    return M(Ce, `${this.baseUrl}/api/v1/schedules/${e}/deactivate`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  activateSchedule(e, r) {
    return M(Ce, `${this.baseUrl}/api/v1/schedules/${e}/activate`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  deleteSchedule(e, r) {
    return M(dc, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "DELETE",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  listEnvVars(e, r, a) {
    return M(vc, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, a));
  }
  importEnvVars(e, r, a, s) {
    return M(ir, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/import`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(a)
    }, C(this.defaultRequestOptions, s));
  }
  retrieveEnvVar(e, r, a, s) {
    return M(mc, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, s));
  }
  createEnvVar(e, r, a, s) {
    return M(ir, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(a)
    }, C(this.defaultRequestOptions, s));
  }
  updateEnvVar(e, r, a, s, i) {
    return M(ir, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "PUT",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(s)
    }, C(this.defaultRequestOptions, i));
  }
  deleteEnvVar(e, r, a, s) {
    return M(ir, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "DELETE",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, s));
  }
  updateRunMetadata(e, r, a) {
    return M(Ia, `${this.baseUrl}/api/v1/runs/${e}/metadata`, {
      method: "PUT",
      headers: g(this, k, O).call(this, !1),
      body: JSON.stringify(r)
    }, C(this.defaultRequestOptions, a));
  }
  getRunMetadata(e, r) {
    return M(Ia, `${this.baseUrl}/api/v1/runs/${e}/metadata`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
  subscribeToRun(e, r) {
    return yn(`${this.baseUrl}/realtime/v1/runs/${e}`, {
      closeOnComplete: typeof (r == null ? void 0 : r.closeOnComplete) == "boolean" ? r.closeOnComplete : !0,
      headers: g(this, k, yr).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal,
      onFetchError: r == null ? void 0 : r.onFetchError
    });
  }
  subscribeToRunsWithTag(e, r) {
    const a = Td({
      tags: e
    });
    return yn(`${this.baseUrl}/realtime/v1/runs${a ? `?${a}` : ""}`, {
      closeOnComplete: !1,
      headers: g(this, k, yr).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal,
      onFetchError: r == null ? void 0 : r.onFetchError
    });
  }
  subscribeToBatch(e, r) {
    return yn(`${this.baseUrl}/realtime/v1/batches/${e}`, {
      closeOnComplete: !1,
      headers: g(this, k, yr).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal,
      onFetchError: r == null ? void 0 : r.onFetchError
    });
  }
  async fetchStream(e, r, a) {
    return await new Ti((a == null ? void 0 : a.baseUrl) ?? this.baseUrl, {
      headers: this.getHeaders(),
      signal: a == null ? void 0 : a.signal
    }).createSubscription(e, r).subscribe();
  }
  async generateJWTClaims(e) {
    return M(n.record(n.any()), `${this.baseUrl}/api/v1/auth/jwt/claims`, {
      method: "POST",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, e));
  }
  retrieveBatch(e, r) {
    return M(Ec, `${this.baseUrl}/api/v1/batches/${e}`, {
      method: "GET",
      headers: g(this, k, O).call(this, !1)
    }, C(this.defaultRequestOptions, r));
  }
}
k = new WeakSet(), O = function(e, r) {
  const a = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": ba,
    ...Object.entries(r ?? {}).reduce((s, [i, o]) => (o !== void 0 && (s[i] = o), s), {})
  };
  return D.isInsideTask && (a["x-trigger-worker"] = "true", e && (a["x-trigger-span-parent-as-link"] = "1")), typeof window < "u" && typeof window.document < "u" && (a["x-trigger-client"] = "browser"), a;
}, yr = function() {
  return {
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": ba
  };
};
function Td(t) {
  const e = new URLSearchParams();
  return t && (t.tasks && e.append("tasks", Array.isArray(t.tasks) ? t.tasks.join(",") : t.tasks), t.tags && e.append("tags", Array.isArray(t.tags) ? t.tags.join(",") : t.tags)), e;
}
function Ga(t) {
  const e = new URLSearchParams();
  return t && (t.status && e.append("filter[status]", Array.isArray(t.status) ? t.status.join(",") : t.status), t.taskIdentifier && e.append("filter[taskIdentifier]", Array.isArray(t.taskIdentifier) ? t.taskIdentifier.join(",") : t.taskIdentifier), t.version && e.append("filter[version]", Array.isArray(t.version) ? t.version.join(",") : t.version), t.bulkAction && e.append("filter[bulkAction]", t.bulkAction), t.tag && e.append("filter[tag]", Array.isArray(t.tag) ? t.tag.join(",") : t.tag), t.schedule && e.append("filter[schedule]", t.schedule), typeof t.isTest == "boolean" && e.append("filter[isTest]", String(t.isTest)), t.from && e.append("filter[createdAt][from]", t.from instanceof Date ? t.from.getTime().toString() : t.from.toString()), t.to && e.append("filter[createdAt][to]", t.to instanceof Date ? t.to.getTime().toString() : t.to.toString()), t.period && e.append("filter[createdAt][period]", t.period), t.batch && e.append("filter[batch]", t.batch)), e;
}
function C(t, e) {
  return e ? {
    ...t,
    ...e,
    retry: {
      ...t.retry,
      ...e.retry
    }
  } : t;
}
var Rt = {}, Za;
function Rd() {
  if (Za) return Rt;
  Za = 1;
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
  Object.defineProperty(Rt, "__esModule", { value: !0 }), Rt.PreciseDate = void 0;
  const t = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{4,9}Z/, e = "BigInt only available in Node >= v10.7. Consider using getFullTimeString instead.";
  var r;
  (function(p) {
    p[p.NEGATIVE = -1] = "NEGATIVE", p[p.POSITIVE = 1] = "POSITIVE", p[p.ZERO = 0] = "ZERO";
  })(r || (r = {}));
  class a extends Date {
    constructor(f) {
      if (super(), this._micros = 0, this._nanos = 0, f && typeof f != "number" && !(f instanceof Date)) {
        this.setFullTime(a.parseFull(f));
        return;
      }
      const m = Array.from(arguments), b = m.slice(0, 7), A = new Date(...b), $ = m.length === 9 ? m.pop() : 0, Y = m.length === 8 ? m.pop() : 0;
      this.setTime(A.getTime()), this.setMicroseconds(Y), this.setNanoseconds($);
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
      let m = this._getNanos();
      return m && Math.sign(f) === r.NEGATIVE && (m = 1e9 - m), `${f}${l(m, 9)}`;
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
      const m = Math.abs(f);
      let b = this.getUTCMilliseconds();
      return m >= 1e3 && (b += Math.floor(m / 1e3) * Math.sign(f), f %= 1e3), Math.sign(f) === r.NEGATIVE && (b -= 1, f += 1e3), this._micros = f, this.setUTCMilliseconds(b), this.getFullTimeString();
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
      const m = Math.abs(f);
      let b = this._micros;
      return m >= 1e3 && (b += Math.floor(m / 1e3) * Math.sign(f), f %= 1e3), Math.sign(f) === r.NEGATIVE && (b -= 1, f += 1e3), this._nanos = f, this.setMicroseconds(b);
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
      const m = Math.sign(Number(f));
      f = f.replace(/^-/, "");
      const b = Number(f.substr(0, f.length - 9)) * m, A = Number(f.substr(-9)) * m;
      return this.setTime(b * 1e3), this.setNanoseconds(A);
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
      const f = l(this._micros, 3), m = l(this._nanos, 3);
      return super.toISOString().replace(/z$/i, `${f}${m}Z`);
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
      const m = this._getNanos();
      return Math.sign(f) === r.NEGATIVE && m && (f -= 1), { seconds: f, nanos: m };
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
      const { seconds: f, nanos: m } = this.toStruct();
      return [f, m];
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
      const f = this.getTime(), m = Math.sign(f);
      return Math.floor(Math.abs(f) / 1e3) * m;
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
      const f = this.getUTCMilliseconds() * 1e6, m = this._micros * 1e3;
      return this._nanos + f + m;
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
      const m = new a();
      if (Array.isArray(f)) {
        const [b, A] = f;
        f = { seconds: b, nanos: A };
      }
      if (o(f))
        m.setFullTime(f);
      else if (c(f)) {
        const { seconds: b, nanos: A } = i(f);
        m.setTime(b * 1e3), m.setNanoseconds(A);
      } else u(f) ? m.setFullTime(s(f)) : m.setTime(new Date(f).getTime());
      return m.getFullTimeString();
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
      const m = Date.UTC(...f.slice(0, 7)), b = new a(m);
      return f.length === 9 && b.setNanoseconds(f.pop()), f.length === 8 && b.setMicroseconds(f.pop()), b.getFullTimeString();
    }
  }
  Rt.PreciseDate = a;
  function s(p) {
    let f = "0";
    p = p.replace(/\.(\d+)/, (A, $) => (f = $, ".000"));
    const m = Number(d(f, 9));
    return new a(p).setNanoseconds(m);
  }
  function i({ seconds: p = 0, nanos: f = 0 }) {
    return typeof p.toNumber == "function" && (p = p.toNumber()), p = Number(p), f = Number(f), { seconds: p, nanos: f };
  }
  function o(p) {
    return typeof p == "bigint" || typeof p == "string" && /^\d+$/.test(p);
  }
  function c(p) {
    return typeof p == "object" && typeof p.seconds < "u" || typeof p.nanos == "number";
  }
  function u(p) {
    return typeof p == "string" && t.test(p);
  }
  function l(p, f) {
    return `${y(p, f)}${p}`;
  }
  function d(p, f) {
    const m = y(p, f);
    return `${p}${m}`;
  }
  function y(p, f) {
    const m = Math.max(f - p.toString().length, 0);
    return "0".repeat(m);
  }
  return Rt;
}
var wd = Rd();
class Sd {
  preciseNow() {
    const r = new wd.PreciseDate().toStruct();
    return [r.seconds, r.nanos];
  }
  reset() {
  }
}
const Va = "clock", Ad = new Sd();
var tr, Ln;
const Br = class Br {
  constructor() {
    L(this, tr);
  }
  static getInstance() {
    return this._instance || (this._instance = new Br()), this._instance;
  }
  setGlobalClock(e) {
    return ee(Va, e);
  }
  preciseNow() {
    return g(this, tr, Ln).call(this).preciseNow();
  }
  reset() {
    g(this, tr, Ln).call(this).reset();
  }
};
tr = new WeakSet(), Ln = function() {
  return ge(Va) ?? Ad;
}, E(Br, "_instance");
let $n = Br;
const Wa = $n.getInstance();
var Id = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.emit = function(e) {
    }, t;
  }()
), kd = (
  /** @class */
  function() {
    function t() {
    }
    return t.prototype.getLogger = function(e, r, a) {
      return new Id();
    }, t;
  }()
), Ha = new kd(), xd = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, ur = Symbol.for("io.opentelemetry.js.api.logs"), wt = xd;
function Pd(t, e, r) {
  return function(a) {
    return a === t ? e : r;
  };
}
var Ya = 1, Nd = (
  /** @class */
  function() {
    function t() {
    }
    return t.getInstance = function() {
      return this._instance || (this._instance = new t()), this._instance;
    }, t.prototype.setGlobalLoggerProvider = function(e) {
      return wt[ur] ? this.getLoggerProvider() : (wt[ur] = Pd(Ya, e, Ha), e);
    }, t.prototype.getLoggerProvider = function() {
      var e, r;
      return (r = (e = wt[ur]) === null || e === void 0 ? void 0 : e.call(wt, Ya)) !== null && r !== void 0 ? r : Ha;
    }, t.prototype.getLogger = function(e, r, a) {
      return this.getLoggerProvider().getLogger(e, r, a);
    }, t.prototype.disable = function() {
      delete wt[ur];
    }, t;
  }()
), Od = Nd.getInstance();
class Cd {
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
  trace(e, r) {
    return r({});
  }
}
const vn = "logger", jd = new Cd();
var fe, je;
const Gr = class Gr {
  constructor() {
    L(this, fe);
  }
  static getInstance() {
    return this._instance || (this._instance = new Gr()), this._instance;
  }
  disable() {
    We(vn);
  }
  setGlobalTaskLogger(e) {
    return ee(vn, e);
  }
  debug(e, r) {
    g(this, fe, je).call(this).debug(e, r);
  }
  log(e, r) {
    g(this, fe, je).call(this).log(e, r);
  }
  info(e, r) {
    g(this, fe, je).call(this).info(e, r);
  }
  warn(e, r) {
    g(this, fe, je).call(this).warn(e, r);
  }
  error(e, r) {
    g(this, fe, je).call(this).error(e, r);
  }
  trace(e, r) {
    return g(this, fe, je).call(this).trace(e, r);
  }
};
fe = new WeakSet(), je = function() {
  return ge(vn) ?? jd;
}, E(Gr, "_instance");
let Kn = Gr;
const H = Kn.getInstance();
class Md {
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
        code: _s.CONFIGURED_INCORRECTLY
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
class Ud {
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
const _n = "usage", Dd = new Ud();
var Te, Xe;
const Zr = class Zr {
  constructor() {
    L(this, Te);
  }
  static getInstance() {
    return this._instance || (this._instance = new Zr()), this._instance;
  }
  setGlobalUsageManager(e) {
    return ee(_n, e);
  }
  disable() {
    g(this, Te, Xe).call(this).disable(), We(_n);
  }
  start() {
    return g(this, Te, Xe).call(this).start();
  }
  stop(e) {
    return g(this, Te, Xe).call(this).stop(e);
  }
  pauseAsync(e) {
    return g(this, Te, Xe).call(this).pauseAsync(e);
  }
  sample() {
    return g(this, Te, Xe).call(this).sample();
  }
};
Te = new WeakSet(), Xe = function() {
  return ge(_n) ?? Dd;
}, E(Zr, "_instance");
let Fn = Zr;
const tt = Fn.getInstance(), bn = "runtime", $d = new Md();
var Re, Qe;
const Vr = class Vr {
  constructor() {
    L(this, Re);
  }
  static getInstance() {
    return this._instance || (this._instance = new Vr()), this._instance;
  }
  waitForDuration(e) {
    return tt.pauseAsync(() => g(this, Re, Qe).call(this).waitForDuration(e));
  }
  waitUntil(e) {
    return tt.pauseAsync(() => g(this, Re, Qe).call(this).waitUntil(e));
  }
  waitForTask(e) {
    return tt.pauseAsync(() => g(this, Re, Qe).call(this).waitForTask(e));
  }
  waitForBatch(e) {
    return tt.pauseAsync(() => g(this, Re, Qe).call(this).waitForBatch(e));
  }
  setGlobalRuntimeManager(e) {
    return ee(bn, e);
  }
  disable() {
    g(this, Re, Qe).call(this).disable(), We(bn);
  }
};
Re = new WeakSet(), Qe = function() {
  return ge(bn) ?? $d;
}, E(Vr, "_instance");
let Bn = Vr;
const ha = Bn.getInstance();
class Ld {
  append(e, r) {
    throw new Error("Method not implemented.");
  }
  remove(e, r) {
    throw new Error("Method not implemented.");
  }
  increment(e, r) {
    throw new Error("Method not implemented.");
  }
  decrement(e, r) {
    throw new Error("Method not implemented.");
  }
  stream(e, r) {
    throw new Error("Method not implemented.");
  }
  fetchStream(e, r) {
    throw new Error("Method not implemented.");
  }
  flush(e) {
    throw new Error("Method not implemented.");
  }
  refresh(e) {
    throw new Error("Method not implemented.");
  }
  enterWithMetadata(e) {
  }
  current() {
    throw new Error("Method not implemented.");
  }
  getKey(e) {
    throw new Error("Method not implemented.");
  }
  set(e, r) {
    throw new Error("Method not implemented.");
  }
  del(e) {
    throw new Error("Method not implemented.");
  }
  update(e) {
    throw new Error("Method not implemented.");
  }
  get parent() {
    return {
      append: () => this.parent,
      set: () => this.parent,
      del: () => this.parent,
      increment: () => this.parent,
      decrement: () => this.parent,
      remove: () => this.parent,
      stream: () => Promise.resolve({
        [Symbol.asyncIterator]: () => ({
          next: () => Promise.resolve({ done: !0, value: void 0 })
        })
      }),
      update: () => this.parent
    };
  }
  get root() {
    return {
      append: () => this.root,
      set: () => this.root,
      del: () => this.root,
      increment: () => this.root,
      decrement: () => this.root,
      remove: () => this.root,
      stream: () => Promise.resolve({
        [Symbol.asyncIterator]: () => ({
          next: () => Promise.resolve({ done: !0, value: void 0 })
        })
      }),
      update: () => this.root
    };
  }
}
const za = "run-metadata", Kd = new Ld();
var K, G;
const Wr = class Wr {
  constructor() {
    L(this, K);
  }
  static getInstance() {
    return this._instance || (this._instance = new Wr()), this._instance;
  }
  setGlobalManager(e) {
    return ee(za, e);
  }
  enterWithMetadata(e) {
    g(this, K, G).call(this).enterWithMetadata(e);
  }
  current() {
    return g(this, K, G).call(this).current();
  }
  getKey(e) {
    return g(this, K, G).call(this).getKey(e);
  }
  set(e, r) {
    return g(this, K, G).call(this).set(e, r), this;
  }
  del(e) {
    return g(this, K, G).call(this).del(e), this;
  }
  increment(e, r) {
    return g(this, K, G).call(this).increment(e, r), this;
  }
  decrement(e, r) {
    return g(this, K, G).call(this).decrement(e, r), this;
  }
  append(e, r) {
    return g(this, K, G).call(this).append(e, r), this;
  }
  remove(e, r) {
    return g(this, K, G).call(this).remove(e, r), this;
  }
  update(e) {
    return g(this, K, G).call(this).update(e), this;
  }
  stream(e, r, a) {
    return g(this, K, G).call(this).stream(e, r, a);
  }
  fetchStream(e, r) {
    return g(this, K, G).call(this).fetchStream(e, r);
  }
  flush(e) {
    return g(this, K, G).call(this).flush(e);
  }
  refresh(e) {
    return g(this, K, G).call(this).refresh(e);
  }
  get parent() {
    return g(this, K, G).call(this).parent;
  }
  get root() {
    return g(this, K, G).call(this).root;
  }
};
K = new WeakSet(), G = function() {
  return ge(za) ?? Kd;
}, E(Wr, "_instance");
let Gn = Wr;
var Oe = {}, lr = {}, St = {}, dr = {}, qa;
function an() {
  if (qa) return dr;
  qa = 1, Object.defineProperty(dr, "__esModule", { value: !0 });
  var t = (
    /** @class */
    function() {
      function e(r, a, s) {
        this.depth = 0, this.depth = r, this.path = a, this.object = s;
      }
      return e.prototype.flatten = function() {
        var r = this.object;
        return typeof this.object == "object" && Array.isArray(this.object) && this.depth > 0 && (r = this.object.flat(this.depth)), new e(0, this.path, r);
      }, e;
    }()
  );
  return dr.default = t, dr;
}
var Ja;
function Fd() {
  if (Ja) return St;
  Ja = 1, Object.defineProperty(St, "__esModule", { value: !0 }), St.SimpleKeyPathComponent = void 0;
  var t = an(), e = (
    /** @class */
    function() {
      function r(a) {
        this.isArray = !1, this.keyName = a;
        var s = parseInt(this.keyName, 10);
        if (!isNaN(s)) {
          var i = Number.isInteger(s);
          i && (s < 0 || (this.isArray = !0));
        }
      }
      return r.fromString = function(a) {
        var s = a;
        return r.unescapeExpressions.forEach(function(i) {
          s = s.replace(i.search, i.replacement);
        }), new r(s);
      }, r.prototype.toString = function() {
        var a = this.keyName;
        return r.escapeExpressions.forEach(function(s) {
          a = a.replace(s.search, s.replacement);
        }), a;
      }, r.prototype.jsonPointer = function() {
        var a = this.keyName;
        return a = a.replace(/(\~)/g, "~0"), a = a.replace(/(\/)/g, "~1"), a;
      }, r.prototype.query = function(a) {
        for (var s = [], i = 0; i < a.length; i++) {
          var o = a[i], c = o.object;
          if (typeof c == "object") {
            var u = c[this.keyName];
            if (u !== null) {
              var l = new t.default(o.depth, o.path.child(this.keyName), u);
              s.push(l);
            }
          }
        }
        return s;
      }, r.escapeExpressions = [
        { search: new RegExp(/(\\)/g), replacement: "\\" },
        { search: new RegExp(/(\.)/g), replacement: "\\." }
      ], r.unescapeExpressions = [
        { search: new RegExp(/(\\\.)/g), replacement: "." },
        { search: new RegExp(/(\\\\)/g), replacement: "\\" },
        { search: "~1", replacement: "/" }
      ], r;
    }()
  );
  return St.SimpleKeyPathComponent = e, St;
}
var At = {}, Xa;
function Bd() {
  if (Xa) return At;
  Xa = 1, Object.defineProperty(At, "__esModule", { value: !0 }), At.WildcardPathComponent = void 0;
  var t = an(), e = (
    /** @class */
    function() {
      function r() {
        this.keyName = "*", this.isArray = !0;
      }
      return r.fromString = function(a) {
        return a === "*" ? new r() : null;
      }, r.prototype.toString = function() {
        return this.keyName;
      }, r.prototype.jsonPointer = function() {
        throw Error("JSON Pointers don't work with wildcards");
      }, r.prototype.query = function(a) {
        for (var s = [], i = 0; i < a.length; i++) {
          var o = a[i], c = o.object;
          if (typeof c == "object")
            for (var u in c) {
              var l = c[u], d = new t.default(o.depth + 1, o.path.child(u), l);
              s.push(d);
            }
        }
        return s;
      }, r;
    }()
  );
  return At.WildcardPathComponent = e, At;
}
var fr = {}, Qa;
function Ri() {
  if (Qa) return fr;
  Qa = 1, Object.defineProperty(fr, "__esModule", { value: !0 });
  var t = (
    /** @class */
    function() {
      function e() {
        this.keyName = "$", this.isArray = !1;
      }
      return e.fromString = function(r) {
        return r === "$" ? new e() : null;
      }, e.prototype.toString = function() {
        return this.keyName;
      }, e.prototype.jsonPointer = function() {
        return "";
      }, e.prototype.query = function(r) {
        return r;
      }, e;
    }()
  );
  return fr.default = t, fr;
}
var It = {}, es;
function Gd() {
  if (es) return It;
  es = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.SlicePathComponent = void 0;
  var t = an(), e = (
    /** @class */
    function() {
      function r(a, s) {
        this.endIndex = null, this.isArray = !0, this.startIndex = a, this.endIndex = s;
      }
      return r.fromString = function(a) {
        if (!r.regex.test(a))
          return null;
        r.regex.lastIndex = 0;
        var s = r.regex.exec(a);
        if (s == null || s.groups == null)
          return null;
        var i = s.groups.startIndex, o = s.groups.endIndex, c = i == null || i === "" ? 0 : parseInt(i, 10), u = o == null ? null : parseInt(o, 10);
        if (c == null && u == null)
          return null;
        var l = Number.isInteger(c);
        return l ? new r(c, u) : null;
      }, r.prototype.toString = function() {
        return "[".concat(this.startIndex).concat(this.endIndex == null ? "" : ":" + this.endIndex, "]");
      }, r.prototype.jsonPointer = function() {
        throw Error("JSON Pointers don't work with wildcards");
      }, r.prototype.query = function(a) {
        for (var s = [], i = 0; i < a.length; i++) {
          var o = a[i], c = o.object;
          if (typeof c == "object" && Array.isArray(c)) {
            var u = void 0;
            this.endIndex == null ? u = c.slice(this.startIndex) : u = c.slice(this.startIndex, this.endIndex);
            for (var l = 0; l < u.length; l++) {
              var d = u[l];
              s.push(new t.default(o.depth + 1, o.path.child("".concat(l + this.startIndex)), d));
            }
          }
        }
        return s;
      }, r.regex = /^\[(?<startIndex>[0-9]*):(?<endIndex>\-?[0-9]*)?\]$/g, r;
    }()
  );
  return It.SlicePathComponent = e, It;
}
var ts;
function Zd() {
  if (ts) return lr;
  ts = 1, Object.defineProperty(lr, "__esModule", { value: !0 });
  var t = Fd(), e = Bd(), r = Ri(), a = Gd(), s = (
    /** @class */
    function() {
      function i() {
      }
      return i.prototype.parse = function(o) {
        i.pathPattern.lastIndex = 0;
        var c = o.match(i.pathPattern), u = [new r.default()];
        if (c == null || c.length == 0 || c.length == 1 && c[0] == "")
          return u;
        var l = 0;
        c[0] == "$" && (l = 1);
        for (var d = l; d < c.length; d++) {
          var y = c[d], p = this.parseComponent(y);
          u.push(p);
        }
        return u;
      }, i.prototype.parsePointer = function(o) {
        i.pathPattern.lastIndex = 0;
        var c = o.match(i.pointerPattern), u = [new r.default()];
        if (c == null || c.length == 0 || c.length == 1 && c[0] == "")
          return u;
        for (var l = 0, d = c; l < d.length; l++) {
          var y = d[l];
          u.push(this.parseComponent(y));
        }
        return u;
      }, i.prototype.parseComponent = function(o) {
        var c = e.WildcardPathComponent.fromString(o);
        if (c != null)
          return c;
        if (o == null)
          throw new SyntaxError("Cannot create a path from null");
        if (o == "")
          throw new SyntaxError("Cannot create a path from an empty string");
        var u = a.SlicePathComponent.fromString(o);
        return u ?? t.SimpleKeyPathComponent.fromString(o);
      }, i.pathPattern = /(?:[^\.\\]|\\.)+/g, i.pointerPattern = /(?:[^\/\\]|\\\/)+/g, i;
    }()
  );
  return lr.default = s, lr;
}
var rs;
function Vd() {
  if (rs) return Oe;
  rs = 1;
  var t = Oe && Oe.__spreadArray || function(i, o, c) {
    if (c || arguments.length === 2) for (var u = 0, l = o.length, d; u < l; u++)
      (d || !(u in o)) && (d || (d = Array.prototype.slice.call(o, 0, u)), d[u] = o[u]);
    return i.concat(d || Array.prototype.slice.call(o));
  };
  Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.JSONHeroPath = void 0;
  var e = Zd(), r = an(), a = Ri(), s = (
    /** @class */
    function() {
      function i(o) {
        if (typeof o == "string") {
          var c = new e.default();
          this.components = c.parse(o);
          return;
        }
        o.length == 0 && o.push(new a.default()), o[0] instanceof a.default || o.unshift(new a.default()), this.components = o;
      }
      return i.fromPointer = function(o) {
        var c = new e.default();
        return new i(c.parsePointer(o));
      }, Object.defineProperty(i.prototype, "root", {
        get: function() {
          return new i(this.components.slice(0, 1));
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(i.prototype, "isRoot", {
        get: function() {
          return this.components.length > 1 ? !1 : this.components[0] instanceof a.default;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(i.prototype, "parent", {
        get: function() {
          return this.components.length == 1 ? null : new i(this.components.slice(0, -1));
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(i.prototype, "lastComponent", {
        get: function() {
          if (this.components.length !== 0)
            return this.components[this.components.length - 1];
        },
        enumerable: !1,
        configurable: !0
      }), i.prototype.child = function(o) {
        var c = this.toString();
        return new i(c.concat(".".concat(o)));
      }, i.prototype.replaceComponent = function(o, c) {
        var u = new e.default(), l = u.parseComponent(c), d = t([], this.components, !0);
        return d[o] = l, new i(d);
      }, i.prototype.toString = function() {
        return this.components.map(function(o) {
          return o.toString();
        }).join(".");
      }, i.prototype.jsonPointer = function() {
        return this.components.length === 1 ? "" : this.components.map(function(o) {
          return o.jsonPointer();
        }).join("/");
      }, i.prototype.first = function(o, c) {
        c === void 0 && (c = { includePath: !1 });
        var u = this.all(o, c);
        return u === null || u.length === 0 ? null : u[0];
      }, i.prototype.all = function(o, c) {
        if (c === void 0 && (c = { includePath: !1 }), this.components.length == 0)
          return [o];
        if (this.components.length == 1 && this.components[0] instanceof a.default)
          return [o];
        var u = [], l = new r.default(0, this.root, o);
        u.push(l);
        for (var d = 0; d < this.components.length; d++) {
          var y = this.components[d];
          if (u = y.query(u), u === null || u.length === 0)
            return [];
        }
        var p = u.map(function(A) {
          return A.flatten();
        });
        if (!c.includePath)
          return p.map(function(A) {
            return A.object;
          });
        for (var f = [], d = 0; d < p.length; d++) {
          var m = p[d], b = {
            value: m.object
          };
          c.includePath && (b.path = m.path), f.push(b);
        }
        return f;
      }, i.prototype.set = function(o, c) {
        var u = this.all(o, { includePath: !0 });
        u.forEach(function(l) {
          var d = l.path, y = d.parent, p = y == null ? void 0 : y.first(o);
          d.lastComponent && (p[d.lastComponent.toString()] = c);
        });
      }, i.prototype.merge = function(o, c) {
        var u = this.all(o, { includePath: !0 });
        u.forEach(function(l) {
          var d = l.path, y = d.parent, p = y == null ? void 0 : y.first(o);
          if (d.lastComponent) {
            var f = p[d.lastComponent.toString()];
            if (Array.isArray(f))
              p[d.lastComponent.toString()] = f.concat([c].flat());
            else {
              if (typeof c != "object" || Array.isArray(c))
                return;
              for (var m in c)
                f[m] = c[m];
            }
          }
        });
      }, i;
    }()
  );
  return Oe.JSONHeroPath = s, Oe;
}
Vd();
const me = Gn.getInstance(), En = "timeout";
class Wd {
  abortAfterTimeout(e) {
    return new AbortController().signal;
  }
}
const Hd = new Wd();
var rr, Vn;
const Hr = class Hr {
  constructor() {
    L(this, rr);
  }
  static getInstance() {
    return this._instance || (this._instance = new Hr()), this._instance;
  }
  get signal() {
    return g(this, rr, Vn).call(this).signal;
  }
  abortAfterTimeout(e) {
    return g(this, rr, Vn).call(this).abortAfterTimeout(e);
  }
  setGlobalManager(e) {
    return ee(En, e);
  }
  disable() {
    We(En);
  }
};
rr = new WeakSet(), Vn = function() {
  return ge(En) ?? Hd;
}, E(Hr, "_instance");
let Zn = Hr;
const Yd = Zn.getInstance();
class zd {
  registerTaskMetadata(e) {
  }
  registerTaskFileMetadata(e, r) {
  }
  updateTaskMetadata(e, r) {
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
const Tn = "task-catalog", qd = new zd();
var ae, ye;
const Yr = class Yr {
  constructor() {
    L(this, ae);
  }
  static getInstance() {
    return this._instance || (this._instance = new Yr()), this._instance;
  }
  setGlobalTaskCatalog(e) {
    return ee(Tn, e);
  }
  disable() {
    We(Tn);
  }
  registerTaskMetadata(e) {
    g(this, ae, ye).call(this).registerTaskMetadata(e);
  }
  updateTaskMetadata(e, r) {
    g(this, ae, ye).call(this).updateTaskMetadata(e, r);
  }
  registerTaskFileMetadata(e, r) {
    g(this, ae, ye).call(this).registerTaskFileMetadata(e, r);
  }
  listTaskManifests() {
    return g(this, ae, ye).call(this).listTaskManifests();
  }
  getTaskManifest(e) {
    return g(this, ae, ye).call(this).getTaskManifest(e);
  }
  getTask(e) {
    return g(this, ae, ye).call(this).getTask(e);
  }
  taskExists(e) {
    return g(this, ae, ye).call(this).taskExists(e);
  }
};
ae = new WeakSet(), ye = function() {
  return ge(Tn) ?? qd;
}, E(Yr, "_instance");
let Wn = Yr;
const kt = Wn.getInstance();
class Jd extends Error {
  constructor(r, a, s) {
    var e = (...Gf) => (super(...Gf), E(this, "taskId"), E(this, "runId"), E(this, "cause"), this);
    s instanceof Error ? (e(`Error in ${r}: ${s.message}`), this.cause = s, this.name = "SubtaskUnwrapError") : (e(`Error in ${r}`), this.name = "SubtaskUnwrapError", this.cause = s), this.taskId = r, this.runId = a;
  }
}
class Xd extends Promise {
  constructor(r, a) {
    super(r);
    E(this, "taskId");
    this.taskId = a;
  }
  unwrap() {
    return this.then((r) => {
      if (r.ok)
        return r.output;
      throw new Jd(this.taskId, r.id, r.error);
    });
  }
}
function Qd(t) {
  return typeof t == "string" && t.length === 64;
}
async function Hn(t) {
  if (t)
    return Qd(t) ? t : await ef(t, { scope: "global" });
}
async function ef(t, e) {
  return await rf([...Array.isArray(t) ? t : [t]].concat(tf((e == null ? void 0 : e.scope) ?? "run")));
}
function tf(t) {
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
async function rf(t) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t.join("-")));
  return Array.from(new Uint8Array(e)).map((r) => r.toString(16).padStart(2, "0")).join("");
}
function nf(t, e) {
  e instanceof Error ? t.recordException(af(e)) : typeof e == "string" ? t.recordException(e.replace(/\0/g, "")) : t.recordException(JSON.stringify(e).replace(/\0/g, "")), t.setStatus({ code: kr.ERROR });
}
function af(t) {
  var r;
  const e = new Error(t.message.replace(/\0/g, ""));
  return e.name = t.name.replace(/\0/g, ""), e.stack = (r = t.stack) == null ? void 0 : r.replace(/\0/g, ""), e;
}
class sf {
  constructor(e) {
    E(this, "_config");
    E(this, "_tracer");
    E(this, "_logger");
    this._config = e;
  }
  get tracer() {
    if (!this._tracer) {
      if ("tracer" in this._config)
        return this._config.tracer;
      this._tracer = al.getTracer(this._config.name, this._config.version);
    }
    return this._tracer;
  }
  get logger() {
    if (!this._logger) {
      if ("logger" in this._config)
        return this._config.logger;
      this._logger = Od.getLogger(this._config.name, this._config.version);
    }
    return this._logger;
  }
  extractContext(e) {
    return ei.extract(gr.active(), e ?? {});
  }
  startActiveSpan(e, r, a, s, i) {
    const o = s ?? gr.active(), c = (a == null ? void 0 : a.attributes) ?? {};
    let u = !1;
    return this.tracer.startActiveSpan(e, {
      ...a,
      attributes: c,
      startTime: Wa.preciseNow()
    }, o, async (l) => {
      i == null || i.addEventListener("abort", () => {
        u || (u = !0, nf(l, i.reason), l.end());
      }), D.ctx && this.tracer.startSpan(e, {
        ...a,
        attributes: {
          ...c,
          [x.SPAN_PARTIAL]: !0,
          [x.SPAN_ID]: l.spanContext().spanId
        }
      }, o).end();
      const d = tt.start();
      try {
        return await r(l);
      } catch (y) {
        throw u || ((typeof y == "string" || y instanceof Error) && l.recordException(y), l.setStatus({ code: kr.ERROR })), y;
      } finally {
        if (!u) {
          if (u = !0, D.ctx) {
            const y = tt.stop(d), p = D.ctx.machine;
            l.setAttributes({
              [x.USAGE_DURATION_MS]: y.cpuTime,
              [x.USAGE_COST_IN_CENTS]: p != null && p.centsPerMs ? y.cpuTime * p.centsPerMs : 0
            });
          }
          l.end(Wa.preciseNow());
        }
      }
    });
  }
  startSpan(e, r, a) {
    const s = a ?? gr.active(), i = (r == null ? void 0 : r.attributes) ?? {}, o = this.tracer.startSpan(e, r, a);
    return this.tracer.startSpan(e, {
      ...r,
      attributes: {
        ...i,
        [x.SPAN_PARTIAL]: !0,
        [x.SPAN_ID]: o.spanContext().spanId
      }
    }, s).end(), o;
  }
}
const of = "3.3.13", Ne = new sf({ name: "@trigger.dev/sdk", version: of });
function cf(t) {
  var a;
  const e = t.queue ? {
    name: ((a = t.queue) == null ? void 0 : a.name) ?? `task/${t.id}`,
    ...t.queue
  } : void 0, r = {
    id: t.id,
    description: t.description,
    trigger: async (s, i) => {
      const o = kt.getTaskManifest(t.id);
      return await uf(o && o.exportName ? `${o.exportName}.trigger()` : "trigger()", t.id, s, void 0, {
        queue: e,
        ...i
      });
    },
    batchTrigger: async (s, i) => {
      const o = kt.getTaskManifest(t.id);
      return await lf(o && o.exportName ? `${o.exportName}.batchTrigger()` : "batchTrigger()", t.id, s, i, void 0, void 0, e);
    },
    triggerAndWait: (s, i) => {
      const o = kt.getTaskManifest(t.id);
      return new Xd((c, u) => {
        df(o && o.exportName ? `${o.exportName}.triggerAndWait()` : "triggerAndWait()", t.id, s, void 0, {
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
      const o = kt.getTaskManifest(t.id);
      return await ff(o && o.exportName ? `${o.exportName}.batchTriggerAndWait()` : "batchTriggerAndWait()", t.id, s, void 0, i, void 0, e);
    }
  };
  return kt.registerTaskMetadata({
    id: t.id,
    description: t.description,
    queue: t.queue,
    retry: t.retry ? { ...Zs, ...t.retry } : void 0,
    machine: typeof t.machine == "string" ? { preset: t.machine } : t.machine,
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
  }), r[Symbol.for("trigger.dev/task")] = !0, r;
}
async function uf(t, e, r, a, s, i) {
  var d, y;
  const o = sr.clientOrThrow(), u = await nn(r);
  return await o.triggerTask(e, {
    payload: u.data,
    options: {
      queue: s == null ? void 0 : s.queue,
      concurrencyKey: s == null ? void 0 : s.concurrencyKey,
      test: (d = D.ctx) == null ? void 0 : d.run.isTest,
      payloadType: u.dataType,
      idempotencyKey: await Hn(s == null ? void 0 : s.idempotencyKey),
      idempotencyKeyTTL: s == null ? void 0 : s.idempotencyKeyTTL,
      delay: s == null ? void 0 : s.delay,
      ttl: s == null ? void 0 : s.ttl,
      tags: s == null ? void 0 : s.tags,
      maxAttempts: s == null ? void 0 : s.maxAttempts,
      parentAttempt: (y = D.ctx) == null ? void 0 : y.attempt.id,
      metadata: s == null ? void 0 : s.metadata,
      maxDuration: s == null ? void 0 : s.maxDuration,
      machine: s == null ? void 0 : s.machine
    }
  }, {
    spanParentAsLink: !0
  }, {
    name: t,
    tracer: Ne,
    icon: "trigger",
    onResponseBody: (p, f) => {
      p && typeof p == "object" && !Array.isArray(p) && "id" in p && typeof p.id == "string" && f.setAttribute("runId", p.id);
    },
    ...i
  });
}
async function lf(t, e, r, a, s, i, o) {
  const u = await sr.clientOrThrow().batchTriggerV2({
    items: await Promise.all(r.map(async (d) => {
      var f, m, b, A, $, Y, ue, pt, gt, mt, yt, vt, _t;
      const y = d.payload, p = await nn(y);
      return {
        task: e,
        payload: p.data,
        options: {
          queue: ((f = d.options) == null ? void 0 : f.queue) ?? o,
          concurrencyKey: (m = d.options) == null ? void 0 : m.concurrencyKey,
          test: (b = D.ctx) == null ? void 0 : b.run.isTest,
          payloadType: p.dataType,
          idempotencyKey: await Hn((A = d.options) == null ? void 0 : A.idempotencyKey),
          idempotencyKeyTTL: ($ = d.options) == null ? void 0 : $.idempotencyKeyTTL,
          delay: (Y = d.options) == null ? void 0 : Y.delay,
          ttl: (ue = d.options) == null ? void 0 : ue.ttl,
          tags: (pt = d.options) == null ? void 0 : pt.tags,
          maxAttempts: (gt = d.options) == null ? void 0 : gt.maxAttempts,
          parentAttempt: (mt = D.ctx) == null ? void 0 : mt.attempt.id,
          metadata: (yt = d.options) == null ? void 0 : yt.metadata,
          maxDuration: (vt = d.options) == null ? void 0 : vt.maxDuration,
          machine: (_t = d.options) == null ? void 0 : _t.machine
        }
      };
    }))
  }, {
    spanParentAsLink: !0,
    idempotencyKey: await Hn(a == null ? void 0 : a.idempotencyKey),
    idempotencyKeyTTL: a == null ? void 0 : a.idempotencyKeyTTL,
    processingStrategy: a != null && a.triggerSequentially ? "sequential" : void 0
  }, {
    name: t,
    tracer: Ne,
    icon: "trigger",
    onResponseBody(d, y) {
      d && typeof d == "object" && !Array.isArray(d) && ("id" in d && typeof d.id == "string" && y.setAttribute("batchId", d.id), "runs" in d && Array.isArray(d.runs) && y.setAttribute("runCount", d.runs.length), "isCached" in d && typeof d.isCached == "boolean" && (d.isCached && console.warn("Result is a cached response because the request was idempotent."), y.setAttribute("isCached", d.isCached)), "idempotencyKey" in d && typeof d.idempotencyKey == "string" && y.setAttribute("idempotencyKey", d.idempotencyKey));
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
async function df(t, e, r, a, s, i) {
  const o = D.ctx;
  if (!o)
    throw new Error("triggerAndWait can only be used from inside a task.run()");
  const c = sr.clientOrThrow(), l = await nn(r);
  return await Ne.startActiveSpan(t, async (d) => {
    var f, m;
    const y = await c.triggerTask(e, {
      payload: l.data,
      options: {
        dependentAttempt: o.attempt.id,
        lockToVersion: (f = D.worker) == null ? void 0 : f.version,
        // Lock to current version because we're waiting for it to finish
        queue: s == null ? void 0 : s.queue,
        concurrencyKey: s == null ? void 0 : s.concurrencyKey,
        test: (m = D.ctx) == null ? void 0 : m.run.isTest,
        payloadType: l.dataType,
        delay: s == null ? void 0 : s.delay,
        ttl: s == null ? void 0 : s.ttl,
        tags: s == null ? void 0 : s.tags,
        maxAttempts: s == null ? void 0 : s.maxAttempts,
        metadata: s == null ? void 0 : s.metadata,
        maxDuration: s == null ? void 0 : s.maxDuration,
        machine: s == null ? void 0 : s.machine
      }
    }, {}, i);
    d.setAttribute("runId", y.id);
    const p = await ha.waitForTask({
      id: y.id,
      ctx: o
    });
    return await Yn(p, e);
  }, {
    kind: Jt.PRODUCER,
    attributes: {
      [x.STYLE_ICON]: "trigger",
      ...rn({
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
async function ff(t, e, r, a, s, i, o) {
  const c = D.ctx;
  if (!c)
    throw new Error("batchTriggerAndWait can only be used from inside a task.run()");
  const u = sr.clientOrThrow();
  return await Ne.startActiveSpan(t, async (l) => {
    const d = await u.batchTriggerV2({
      items: await Promise.all(r.map(async (f) => {
        var A, $, Y, ue, pt, gt, mt, yt, vt, _t, ma;
        const m = f.payload, b = await nn(m);
        return {
          task: e,
          payload: b.data,
          options: {
            lockToVersion: (A = D.worker) == null ? void 0 : A.version,
            queue: (($ = f.options) == null ? void 0 : $.queue) ?? o,
            concurrencyKey: (Y = f.options) == null ? void 0 : Y.concurrencyKey,
            test: (ue = D.ctx) == null ? void 0 : ue.run.isTest,
            payloadType: b.dataType,
            delay: (pt = f.options) == null ? void 0 : pt.delay,
            ttl: (gt = f.options) == null ? void 0 : gt.ttl,
            tags: (mt = f.options) == null ? void 0 : mt.tags,
            maxAttempts: (yt = f.options) == null ? void 0 : yt.maxAttempts,
            metadata: (vt = f.options) == null ? void 0 : vt.metadata,
            maxDuration: (_t = f.options) == null ? void 0 : _t.maxDuration,
            machine: (ma = f.options) == null ? void 0 : ma.machine
          }
        };
      })),
      dependentAttempt: c.attempt.id
    }, {
      processingStrategy: s != null && s.triggerSequentially ? "sequential" : void 0
    }, i);
    l.setAttribute("batchId", d.id), l.setAttribute("runCount", d.runs.length), l.setAttribute("isCached", d.isCached), d.isCached && console.warn("Result is a cached response because the request was idempotent."), d.idempotencyKey && l.setAttribute("idempotencyKey", d.idempotencyKey);
    const y = await ha.waitForBatch({
      id: d.id,
      runs: d.runs.map((f) => f.id),
      ctx: c
    }), p = await hf(y.items, e);
    return {
      id: y.id,
      runs: p
    };
  }, {
    kind: Jt.PRODUCER,
    attributes: {
      [x.STYLE_ICON]: "trigger",
      ...rn({
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
async function hf(t, e) {
  return t.some((a) => a.ok && a.outputType === "application/store") ? await Ne.startActiveSpan("store.downloadPayloads", async (a) => await Promise.all(t.map(async (i) => await Yn(i, e))), {
    kind: Jt.INTERNAL,
    [x.STYLE_ICON]: "cloud-download"
  }) : await Promise.all(t.map(async (s) => await Yn(s, e)));
}
async function Yn(t, e) {
  if (t.ok) {
    const r = { data: t.output, dataType: t.outputType }, a = await si(r, Ne);
    return {
      ok: !0,
      id: t.id,
      taskIdentifier: t.taskIdentifier ?? e,
      output: await ca(a)
    };
  } else
    return {
      ok: !1,
      id: t.id,
      taskIdentifier: t.taskIdentifier ?? e,
      error: Rl(t.error)
    };
}
const pa = cf, pf = {
  for: async (t) => Ne.startActiveSpan("wait.for()", async (e) => {
    const r = mf(t);
    await ha.waitForDuration(r);
  }, {
    attributes: {
      [x.STYLE_ICON]: "wait",
      ...rn({
        items: [
          {
            text: gf(t),
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  })
};
function gf(t) {
  return "seconds" in t ? t.seconds === 1 ? "1 second" : `${t.seconds} seconds` : "minutes" in t ? t.minutes === 1 ? "1 minute" : `${t.minutes} minutes` : "hours" in t ? t.hours === 1 ? "1 hour" : `${t.hours} hours` : "days" in t ? t.days === 1 ? "1 day" : `${t.days} days` : "weeks" in t ? t.weeks === 1 ? "1 week" : `${t.weeks} weeks` : "months" in t ? t.months === 1 ? "1 month" : `${t.months} months` : "years" in t ? t.years === 1 ? "1 year" : `${t.years} years` : "NaN";
}
function mf(t) {
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
me.parent;
me.root;
const He = {
  set: yf,
  del: vf,
  append: Ef,
  remove: Tf,
  increment: _f,
  decrement: bf,
  flush: Rf
};
({
  ...He
});
function yf(t, e) {
  return me.set(t, e), He;
}
function vf(t) {
  return me.del(t), He;
}
function _f(t, e = 1) {
  return me.increment(t, e), He;
}
function bf(t, e = 1) {
  return me.decrement(t, e), He;
}
function Ef(t, e) {
  return me.append(t, e), He;
}
function Tf(t, e) {
  return me.remove(t, e), He;
}
async function Rf(t) {
  const e = C({
    tracer: Ne,
    name: "metadata.flush()",
    icon: "code-plus"
  }, t);
  await me.flush(e);
}
Yd.signal;
const ns = process.env.TINYBIRD_TOKEN ?? void 0, xf = pa({
  id: "copy_job",
  run: async (t) => {
    const e = ns ?? t.token;
    if (!e)
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!t.pipeId)
      throw new Error("Pipe ID not found");
    try {
      let r = `https://api.tinybird.co/v0/pipes/${t.pipeId}/copy`;
      if (t.params) {
        const u = new URLSearchParams();
        for (const [l, d] of Object.entries(t.params))
          u.append(l, d.toString());
        r += `?${u.toString()}`;
      }
      const a = await fetch(
        r,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ns}`
          }
        }
      ).then((u) => u.json());
      if (!a || !("job" in a))
        throw H.error(a), new Error("Invalid response from Tinybird API");
      const s = a.job.job_id;
      H.log("Copy job started", { jobId: s });
      let i = "";
      const o = 30;
      let c = 0;
      for (; c < o; ) {
        if (i = (await fetch(
          `https://api.tinybird.co/v0/jobs/${s}`,
          {
            headers: {
              Authorization: `Bearer ${e}`
            }
          }
        ).then((l) => l.json())).status, H.log("Job status check", { jobId: s, status: i, attempt: c + 1 }), i === "done")
          return H.log("Copy job completed successfully", { jobId: s }), { success: !0, jobId: s };
        if (i === "error" || i === "failed")
          throw new Error(`Copy job failed with status: ${i}`);
        await pf.for({ seconds: 5 }), c++;
      }
      throw new Error(`Job timed out after ${o} attempts`);
    } catch (r) {
      throw H.error("Error in Tinybird copy job", { error: r }), r;
    }
  }
}), wf = process.env.TINYBIRD_TOKEN ?? void 0;
var ga = /* @__PURE__ */ ((t) => (t.CSV = "CSV", t.CSVWithNames = "CSVWithNames", t.JSON = "JSON", t.TSV = "TSV", t.TSVWithNames = "TSVWithNames", t.PrettyCompact = "PrettyCompact", t.JSONEachRow = "JSONEachRow", t.Parquet = "Parquet", t))(ga || {});
function wi(t) {
  return Object.values(ga).includes(t);
}
function Sf(t) {
  const e = t.trim().match(/FORMAT\s+(\w+)$/i);
  if (!e) return null;
  const r = e[1].toUpperCase();
  return wi(r) ? r : null;
}
const Pf = pa({
  id: "tinybird-query",
  run: async (t) => {
    var i;
    const e = wf ?? t.token;
    if (!e)
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!t.sql)
      throw new Error("SQL query is required");
    let r = t.sql;
    const a = Sf(r);
    if (t.format && !wi(t.format.toUpperCase()))
      throw new Error(`Invalid format: ${t.format}. Valid formats are: ${Object.values(ga).join(", ")}`);
    const s = ((i = t.format) == null ? void 0 : i.toUpperCase()) ?? a ?? "JSON";
    a || (r += ` FORMAT ${s}`);
    try {
      const o = await fetch(
        "https://api.tinybird.co/v0/sql",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${e}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            q: r,
            ...t.params
          })
        }
      ), c = await o.json();
      if (console.log(c), o.status !== 200) {
        let l = {
          error: "error"
        };
        throw "error" in c && (l = c, H.error("Tinybird query failed", {
          error: l.error,
          detail: l.detail
        })), new Error(`Tinybird query failed: ${l.error}`);
      }
      const u = c;
      return H.info("Query executed successfully", u), u;
    } catch (o) {
      throw H.error("Failed to execute Tinybird query", {
        error: o instanceof Error ? o.message : "Unknown error",
        sql: t.sql
      }), o;
    }
  }
}), Af = process.env.TINYBIRD_TOKEN ?? void 0, Nf = pa({
  id: "tinybird-pipe",
  run: async (t) => {
    const e = Af ?? t.token;
    if (!e)
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!t.name)
      throw new Error("Pipe name is required");
    try {
      H.log(`Calling pipe ${t.name}`);
      const r = new URL(`https://api.tinybird.co/v0/pipes/${t.name}.json`);
      if (t.params) {
        const o = new URLSearchParams();
        for (const [c, u] of Object.entries(t.params))
          o.append(c, u.toString());
        r.search = o.toString();
      }
      H.log(`Calling ${r.toString()}`), H.log(`token ${e}`);
      const a = await fetch(
        r,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${e}`
          }
        }
      ), s = await a.json();
      if (H.log(`Response from pipe ${t.name}. Status: ${a.status}`), a.status !== 200) {
        let o = {
          error: "error"
        };
        throw "error" in s && (o = s, H.error("Tinybird API request failed", {
          error: o.error,
          detail: o.detail
        })), new Error(`Tinybird API request failed: ${o.error}`);
      }
      return s;
    } catch (r) {
      throw H.error("Failed to call Tinybird API", {
        error: r instanceof Error ? r.message : "Unknown error"
      }), r;
    }
  }
});
export {
  xf as tinybirdCopyTask,
  Nf as tinybirdPipeTask,
  Pf as tinybirdQueryTask
};
