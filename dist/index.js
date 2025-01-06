var Fa = Object.defineProperty;
var cr = (n) => {
  throw TypeError(n);
};
var Za = (n, e, r) => e in n ? Fa(n, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[e] = r;
var m = (n, e, r) => Za(n, typeof e != "symbol" ? e + "" : e, r), Ba = (n, e, r) => e.has(n) || cr("Cannot " + r);
var F = (n, e, r) => e.has(n) ? cr("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, r);
var p = (n, e, r) => (Ba(n, e, "access private method"), r);
var S;
(function(n) {
  n.assertEqual = (s) => s;
  function e(s) {
  }
  n.assertIs = e;
  function r(s) {
    throw new Error();
  }
  n.assertNever = r, n.arrayToEnum = (s) => {
    const i = {};
    for (const o of s)
      i[o] = o;
    return i;
  }, n.getValidEnumValues = (s) => {
    const i = n.objectKeys(s).filter((c) => typeof s[s[c]] != "number"), o = {};
    for (const c of i)
      o[c] = s[c];
    return n.objectValues(o);
  }, n.objectValues = (s) => n.objectKeys(s).map(function(i) {
    return s[i];
  }), n.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const i = [];
    for (const o in s)
      Object.prototype.hasOwnProperty.call(s, o) && i.push(o);
    return i;
  }, n.find = (s, i) => {
    for (const o of s)
      if (i(o))
        return o;
  }, n.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function a(s, i = " | ") {
    return s.map((o) => typeof o == "string" ? `'${o}'` : o).join(i);
  }
  n.joinValues = a, n.jsonStringifyReplacer = (s, i) => typeof i == "bigint" ? i.toString() : i;
})(S || (S = {}));
var An;
(function(n) {
  n.mergeShapes = (e, r) => ({
    ...e,
    ...r
    // second overwrites first
  });
})(An || (An = {}));
const g = S.arrayToEnum([
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
]), ie = (n) => {
  switch (typeof n) {
    case "undefined":
      return g.undefined;
    case "string":
      return g.string;
    case "number":
      return isNaN(n) ? g.nan : g.number;
    case "boolean":
      return g.boolean;
    case "function":
      return g.function;
    case "bigint":
      return g.bigint;
    case "symbol":
      return g.symbol;
    case "object":
      return Array.isArray(n) ? g.array : n === null ? g.null : n.then && typeof n.then == "function" && n.catch && typeof n.catch == "function" ? g.promise : typeof Map < "u" && n instanceof Map ? g.map : typeof Set < "u" && n instanceof Set ? g.set : typeof Date < "u" && n instanceof Date ? g.date : g.object;
    default:
      return g.unknown;
  }
}, f = S.arrayToEnum([
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
]), Va = (n) => JSON.stringify(n, null, 2).replace(/"([^"]+)":/g, "$1:");
class L extends Error {
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
            const d = o.path[u];
            u === o.path.length - 1 ? (c[d] = c[d] || { _errors: [] }, c[d]._errors.push(r(o))) : c[d] = c[d] || { _errors: [] }, c = c[d], u++;
          }
        }
    };
    return s(this), a;
  }
  static assert(e) {
    if (!(e instanceof L))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, S.jsonStringifyReplacer, 2);
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
L.create = (n) => new L(n);
const Me = (n, e) => {
  let r;
  switch (n.code) {
    case f.invalid_type:
      n.received === g.undefined ? r = "Required" : r = `Expected ${n.expected}, received ${n.received}`;
      break;
    case f.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(n.expected, S.jsonStringifyReplacer)}`;
      break;
    case f.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${S.joinValues(n.keys, ", ")}`;
      break;
    case f.invalid_union:
      r = "Invalid input";
      break;
    case f.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${S.joinValues(n.options)}`;
      break;
    case f.invalid_enum_value:
      r = `Invalid enum value. Expected ${S.joinValues(n.options)}, received '${n.received}'`;
      break;
    case f.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case f.invalid_return_type:
      r = "Invalid function return type";
      break;
    case f.invalid_date:
      r = "Invalid date";
      break;
    case f.invalid_string:
      typeof n.validation == "object" ? "includes" in n.validation ? (r = `Invalid input: must include "${n.validation.includes}"`, typeof n.validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${n.validation.position}`)) : "startsWith" in n.validation ? r = `Invalid input: must start with "${n.validation.startsWith}"` : "endsWith" in n.validation ? r = `Invalid input: must end with "${n.validation.endsWith}"` : S.assertNever(n.validation) : n.validation !== "regex" ? r = `Invalid ${n.validation}` : r = "Invalid";
      break;
    case f.too_small:
      n.type === "array" ? r = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "more than"} ${n.minimum} element(s)` : n.type === "string" ? r = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at least" : "over"} ${n.minimum} character(s)` : n.type === "number" ? r = `Number must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${n.minimum}` : n.type === "date" ? r = `Date must be ${n.exact ? "exactly equal to " : n.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(n.minimum))}` : r = "Invalid input";
      break;
    case f.too_big:
      n.type === "array" ? r = `Array must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "less than"} ${n.maximum} element(s)` : n.type === "string" ? r = `String must contain ${n.exact ? "exactly" : n.inclusive ? "at most" : "under"} ${n.maximum} character(s)` : n.type === "number" ? r = `Number must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "bigint" ? r = `BigInt must be ${n.exact ? "exactly" : n.inclusive ? "less than or equal to" : "less than"} ${n.maximum}` : n.type === "date" ? r = `Date must be ${n.exact ? "exactly" : n.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(n.maximum))}` : r = "Invalid input";
      break;
    case f.custom:
      r = "Invalid input";
      break;
    case f.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case f.not_multiple_of:
      r = `Number must be a multiple of ${n.multipleOf}`;
      break;
    case f.not_finite:
      r = "Number must be finite";
      break;
    default:
      r = e.defaultError, S.assertNever(n);
  }
  return { message: r };
};
let Ur = Me;
function Wa(n) {
  Ur = n;
}
function Ct() {
  return Ur;
}
const Pt = (n) => {
  const { data: e, path: r, errorMaps: a, issueData: s } = n, i = [...r, ...s.path || []], o = {
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
  const u = a.filter((d) => !!d).slice().reverse();
  for (const d of u)
    c = d(o, { data: e, defaultError: c }).message;
  return {
    ...s,
    path: i,
    message: c
  };
}, Ya = [];
function h(n, e) {
  const r = Ct(), a = Pt({
    issueData: e,
    data: n.data,
    path: n.path,
    errorMaps: [
      n.common.contextualErrorMap,
      n.schemaErrorMap,
      r,
      r === Me ? void 0 : Me
      // then global default map
    ].filter((s) => !!s)
  });
  n.common.issues.push(a);
}
class U {
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
        return b;
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
    return U.mergeObjectSync(e, a);
  }
  static mergeObjectSync(e, r) {
    const a = {};
    for (const s of r) {
      const { key: i, value: o } = s;
      if (i.status === "aborted" || o.status === "aborted")
        return b;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || s.alwaysSet) && (a[i.value] = o.value);
    }
    return { status: e.value, value: a };
  }
}
const b = Object.freeze({
  status: "aborted"
}), we = (n) => ({ status: "dirty", value: n }), D = (n) => ({ status: "valid", value: n }), Sn = (n) => n.status === "aborted", kn = (n) => n.status === "dirty", et = (n) => n.status === "valid", tt = (n) => typeof Promise < "u" && n instanceof Promise;
function jt(n, e, r, a) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return e.get(n);
}
function Dr(n, e, r, a, s) {
  if (typeof e == "function" ? n !== e || !0 : !e.has(n)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return e.set(n, r), r;
}
var y;
(function(n) {
  n.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, n.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(y || (y = {}));
var He, Je;
class X {
  constructor(e, r, a, s) {
    this._cachedPath = [], this.parent = e, this.data = r, this._path = a, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ur = (n, e) => {
  if (et(e))
    return { success: !0, data: e.value };
  if (!n.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const r = new L(n.common.issues);
      return this._error = r, this._error;
    }
  };
};
function E(n) {
  if (!n)
    return {};
  const { errorMap: e, invalid_type_error: r, required_error: a, description: s } = n;
  if (e && (r || a))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (o, c) => {
    var u, d;
    const { message: l } = n;
    return o.code === "invalid_enum_value" ? { message: l ?? c.defaultError } : typeof c.data > "u" ? { message: (u = l ?? a) !== null && u !== void 0 ? u : c.defaultError } : o.code !== "invalid_type" ? { message: c.defaultError } : { message: (d = l ?? r) !== null && d !== void 0 ? d : c.defaultError };
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
    return ie(e.data);
  }
  _getOrReturnCtx(e, r) {
    return r || {
      common: e.parent.common,
      data: e.data,
      parsedType: ie(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new U(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: ie(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const r = this._parse(e);
    if (tt(r))
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
      parsedType: ie(e)
    }, i = this._parseSync({ data: e, path: s.path, parent: s });
    return ur(s, i);
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
      parsedType: ie(e)
    }, s = this._parse({ data: e, path: a.path, parent: a }), i = await (tt(s) ? s : Promise.resolve(s));
    return ur(a, i);
  }
  refine(e, r) {
    const a = (s) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(s) : r;
    return this._refinement((s, i) => {
      const o = e(s), c = () => i.addIssue({
        code: f.custom,
        ...a(s)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((u) => u ? !0 : (c(), !1)) : o ? !0 : (c(), !1);
    });
  }
  refinement(e, r) {
    return this._refinement((a, s) => e(a) ? !0 : (s.addIssue(typeof r == "function" ? r(a, s) : r), !1));
  }
  _refinement(e) {
    return new V({
      schema: this,
      typeName: _.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return H.create(this, this._def);
  }
  nullable() {
    return he.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return B.create(this, this._def);
  }
  promise() {
    return De.create(this, this._def);
  }
  or(e) {
    return st.create([this, e], this._def);
  }
  and(e) {
    return it.create(this, e, this._def);
  }
  transform(e) {
    return new V({
      ...E(this._def),
      schema: this,
      typeName: _.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const r = typeof e == "function" ? e : () => e;
    return new lt({
      ...E(this._def),
      innerType: this,
      defaultValue: r,
      typeName: _.ZodDefault
    });
  }
  brand() {
    return new Wn({
      typeName: _.ZodBranded,
      type: this,
      ...E(this._def)
    });
  }
  catch(e) {
    const r = typeof e == "function" ? e : () => e;
    return new ft({
      ...E(this._def),
      innerType: this,
      catchValue: r,
      typeName: _.ZodCatch
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
    return Tt.create(this, e);
  }
  readonly() {
    return ht.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const za = /^c[^\s-]{8,}$/i, Ha = /^[0-9a-z]+$/, Ja = /^[0-9A-HJKMNP-TV-Z]{26}$/, Xa = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Qa = /^[a-z0-9_-]{21}$/i, qa = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, es = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, ts = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let cn;
const ns = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, rs = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/, as = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, $r = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", ss = new RegExp(`^${$r}$`);
function Lr(n) {
  let e = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
  return n.precision ? e = `${e}\\.\\d{${n.precision}}` : n.precision == null && (e = `${e}(\\.\\d+)?`), e;
}
function is(n) {
  return new RegExp(`^${Lr(n)}$`);
}
function Gr(n) {
  let e = `${$r}T${Lr(n)}`;
  const r = [];
  return r.push(n.local ? "Z?" : "Z"), n.offset && r.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${r.join("|")})`, new RegExp(`^${e}$`);
}
function os(n, e) {
  return !!((e === "v4" || !e) && ns.test(n) || (e === "v6" || !e) && rs.test(n));
}
class Z extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== g.string) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: g.string,
        received: i.parsedType
      }), b;
    }
    const a = new U();
    let s;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (s = this._getOrReturnCtx(e, s), h(s, {
          code: f.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (s = this._getOrReturnCtx(e, s), h(s, {
          code: f.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), a.dirty());
      else if (i.kind === "length") {
        const o = e.data.length > i.value, c = e.data.length < i.value;
        (o || c) && (s = this._getOrReturnCtx(e, s), o ? h(s, {
          code: f.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : c && h(s, {
          code: f.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), a.dirty());
      } else if (i.kind === "email")
        es.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "email",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "emoji")
        cn || (cn = new RegExp(ts, "u")), cn.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "emoji",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "uuid")
        Xa.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "uuid",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "nanoid")
        Qa.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "nanoid",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid")
        za.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "cuid",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "cuid2")
        Ha.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "cuid2",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "ulid")
        Ja.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
          validation: "ulid",
          code: f.invalid_string,
          message: i.message
        }), a.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), h(s, {
            validation: "url",
            code: f.invalid_string,
            message: i.message
          }), a.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        validation: "regex",
        code: f.invalid_string,
        message: i.message
      }), a.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), a.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), a.dirty()) : i.kind === "datetime" ? Gr(i).test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: "datetime",
        message: i.message
      }), a.dirty()) : i.kind === "date" ? ss.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: "date",
        message: i.message
      }), a.dirty()) : i.kind === "time" ? is(i).test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.invalid_string,
        validation: "time",
        message: i.message
      }), a.dirty()) : i.kind === "duration" ? qa.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        validation: "duration",
        code: f.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "ip" ? os(e.data, i.version) || (s = this._getOrReturnCtx(e, s), h(s, {
        validation: "ip",
        code: f.invalid_string,
        message: i.message
      }), a.dirty()) : i.kind === "base64" ? as.test(e.data) || (s = this._getOrReturnCtx(e, s), h(s, {
        validation: "base64",
        code: f.invalid_string,
        message: i.message
      }), a.dirty()) : S.assertNever(i);
    return { status: a.value, value: e.data };
  }
  _regex(e, r, a) {
    return this.refinement((s) => e.test(s), {
      validation: r,
      code: f.invalid_string,
      ...y.errToObj(a)
    });
  }
  _addCheck(e) {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...y.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...y.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...y.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...y.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...y.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...y.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...y.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...y.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...y.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...y.errToObj(e) });
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
      ...y.errToObj(e == null ? void 0 : e.message)
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
      ...y.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...y.errToObj(e) });
  }
  regex(e, r) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...y.errToObj(r)
    });
  }
  includes(e, r) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: r == null ? void 0 : r.position,
      ...y.errToObj(r == null ? void 0 : r.message)
    });
  }
  startsWith(e, r) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...y.errToObj(r)
    });
  }
  endsWith(e, r) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...y.errToObj(r)
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...y.errToObj(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...y.errToObj(r)
    });
  }
  length(e, r) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...y.errToObj(r)
    });
  }
  /**
   * @deprecated Use z.string().min(1) instead.
   * @see {@link ZodString.min}
   */
  nonempty(e) {
    return this.min(1, y.errToObj(e));
  }
  trim() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Z({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Z({
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
Z.create = (n) => {
  var e;
  return new Z({
    checks: [],
    typeName: _.ZodString,
    coerce: (e = n == null ? void 0 : n.coerce) !== null && e !== void 0 ? e : !1,
    ...E(n)
  });
};
function cs(n, e) {
  const r = (n.toString().split(".")[1] || "").length, a = (e.toString().split(".")[1] || "").length, s = r > a ? r : a, i = parseInt(n.toFixed(s).replace(".", "")), o = parseInt(e.toFixed(s).replace(".", ""));
  return i % o / Math.pow(10, s);
}
class de extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== g.number) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: g.number,
        received: i.parsedType
      }), b;
    }
    let a;
    const s = new U();
    for (const i of this._def.checks)
      i.kind === "int" ? S.isInteger(e.data) || (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), s.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? cs(e.data, i.value) !== 0 && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.not_finite,
        message: i.message
      }), s.dirty()) : S.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, y.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, y.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, y.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, y.toString(r));
  }
  setLimit(e, r, a, s) {
    return new de({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: y.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new de({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: y.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(r)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: y.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: y.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: y.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && S.isInteger(e.value));
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
de.create = (n) => new de({
  checks: [],
  typeName: _.ZodNumber,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ...E(n)
});
class le extends I {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== g.bigint) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: g.bigint,
        received: i.parsedType
      }), b;
    }
    let a;
    const s = new U();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (a = this._getOrReturnCtx(e, a), h(a, {
        code: f.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : S.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, y.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, y.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, y.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, y.toString(r));
  }
  setLimit(e, r, a, s) {
    return new le({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: r,
          inclusive: a,
          message: y.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new le({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: y.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: y.toString(e)
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: y.toString(r)
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
le.create = (n) => {
  var e;
  return new le({
    checks: [],
    typeName: _.ZodBigInt,
    coerce: (e = n == null ? void 0 : n.coerce) !== null && e !== void 0 ? e : !1,
    ...E(n)
  });
};
class nt extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== g.boolean) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.boolean,
        received: a.parsedType
      }), b;
    }
    return D(e.data);
  }
}
nt.create = (n) => new nt({
  typeName: _.ZodBoolean,
  coerce: (n == null ? void 0 : n.coerce) || !1,
  ...E(n)
});
class Te extends I {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== g.date) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_type,
        expected: g.date,
        received: i.parsedType
      }), b;
    }
    if (isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: f.invalid_date
      }), b;
    }
    const a = new U();
    let s;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), a.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (s = this._getOrReturnCtx(e, s), h(s, {
        code: f.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), a.dirty()) : S.assertNever(i);
    return {
      status: a.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Te({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: y.toString(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: y.toString(r)
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
Te.create = (n) => new Te({
  checks: [],
  coerce: (n == null ? void 0 : n.coerce) || !1,
  typeName: _.ZodDate,
  ...E(n)
});
class Mt extends I {
  _parse(e) {
    if (this._getType(e) !== g.symbol) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.symbol,
        received: a.parsedType
      }), b;
    }
    return D(e.data);
  }
}
Mt.create = (n) => new Mt({
  typeName: _.ZodSymbol,
  ...E(n)
});
class rt extends I {
  _parse(e) {
    if (this._getType(e) !== g.undefined) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.undefined,
        received: a.parsedType
      }), b;
    }
    return D(e.data);
  }
}
rt.create = (n) => new rt({
  typeName: _.ZodUndefined,
  ...E(n)
});
class at extends I {
  _parse(e) {
    if (this._getType(e) !== g.null) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.null,
        received: a.parsedType
      }), b;
    }
    return D(e.data);
  }
}
at.create = (n) => new at({
  typeName: _.ZodNull,
  ...E(n)
});
class Ue extends I {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return D(e.data);
  }
}
Ue.create = (n) => new Ue({
  typeName: _.ZodAny,
  ...E(n)
});
class be extends I {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return D(e.data);
  }
}
be.create = (n) => new be({
  typeName: _.ZodUnknown,
  ...E(n)
});
class re extends I {
  _parse(e) {
    const r = this._getOrReturnCtx(e);
    return h(r, {
      code: f.invalid_type,
      expected: g.never,
      received: r.parsedType
    }), b;
  }
}
re.create = (n) => new re({
  typeName: _.ZodNever,
  ...E(n)
});
class Ut extends I {
  _parse(e) {
    if (this._getType(e) !== g.undefined) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.void,
        received: a.parsedType
      }), b;
    }
    return D(e.data);
  }
}
Ut.create = (n) => new Ut({
  typeName: _.ZodVoid,
  ...E(n)
});
class B extends I {
  _parse(e) {
    const { ctx: r, status: a } = this._processInputParams(e), s = this._def;
    if (r.parsedType !== g.array)
      return h(r, {
        code: f.invalid_type,
        expected: g.array,
        received: r.parsedType
      }), b;
    if (s.exactLength !== null) {
      const o = r.data.length > s.exactLength.value, c = r.data.length < s.exactLength.value;
      (o || c) && (h(r, {
        code: o ? f.too_big : f.too_small,
        minimum: c ? s.exactLength.value : void 0,
        maximum: o ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), a.dirty());
    }
    if (s.minLength !== null && r.data.length < s.minLength.value && (h(r, {
      code: f.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), a.dirty()), s.maxLength !== null && r.data.length > s.maxLength.value && (h(r, {
      code: f.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), a.dirty()), r.common.async)
      return Promise.all([...r.data].map((o, c) => s.type._parseAsync(new X(r, o, r.path, c)))).then((o) => U.mergeArray(a, o));
    const i = [...r.data].map((o, c) => s.type._parseSync(new X(r, o, r.path, c)));
    return U.mergeArray(a, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new B({
      ...this._def,
      minLength: { value: e, message: y.toString(r) }
    });
  }
  max(e, r) {
    return new B({
      ...this._def,
      maxLength: { value: e, message: y.toString(r) }
    });
  }
  length(e, r) {
    return new B({
      ...this._def,
      exactLength: { value: e, message: y.toString(r) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
B.create = (n, e) => new B({
  type: n,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: _.ZodArray,
  ...E(e)
});
function Se(n) {
  if (n instanceof O) {
    const e = {};
    for (const r in n.shape) {
      const a = n.shape[r];
      e[r] = H.create(Se(a));
    }
    return new O({
      ...n._def,
      shape: () => e
    });
  } else return n instanceof B ? new B({
    ...n._def,
    type: Se(n.element)
  }) : n instanceof H ? H.create(Se(n.unwrap())) : n instanceof he ? he.create(Se(n.unwrap())) : n instanceof Q ? Q.create(n.items.map((e) => Se(e))) : n;
}
class O extends I {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), r = S.objectKeys(e);
    return this._cached = { shape: e, keys: r };
  }
  _parse(e) {
    if (this._getType(e) !== g.object) {
      const d = this._getOrReturnCtx(e);
      return h(d, {
        code: f.invalid_type,
        expected: g.object,
        received: d.parsedType
      }), b;
    }
    const { status: a, ctx: s } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), c = [];
    if (!(this._def.catchall instanceof re && this._def.unknownKeys === "strip"))
      for (const d in s.data)
        o.includes(d) || c.push(d);
    const u = [];
    for (const d of o) {
      const l = i[d], v = s.data[d];
      u.push({
        key: { status: "valid", value: d },
        value: l._parse(new X(s, v, s.path, d)),
        alwaysSet: d in s.data
      });
    }
    if (this._def.catchall instanceof re) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const l of c)
          u.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: s.data[l] }
          });
      else if (d === "strict")
        c.length > 0 && (h(s, {
          code: f.unrecognized_keys,
          keys: c
        }), a.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const l of c) {
        const v = s.data[l];
        u.push({
          key: { status: "valid", value: l },
          value: d._parse(
            new X(s, v, s.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const l of u) {
        const v = await l.key, T = await l.value;
        d.push({
          key: v,
          value: T,
          alwaysSet: l.alwaysSet
        });
      }
      return d;
    }).then((d) => U.mergeObjectSync(a, d)) : U.mergeObjectSync(a, u);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return y.errToObj, new O({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (r, a) => {
          var s, i, o, c;
          const u = (o = (i = (s = this._def).errorMap) === null || i === void 0 ? void 0 : i.call(s, r, a).message) !== null && o !== void 0 ? o : a.defaultError;
          return r.code === "unrecognized_keys" ? {
            message: (c = y.errToObj(e).message) !== null && c !== void 0 ? c : u
          } : {
            message: u
          };
        }
      } : {}
    });
  }
  strip() {
    return new O({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new O({
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
    return new O({
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
    return new O({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: _.ZodObject
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
    return new O({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const r = {};
    return S.objectKeys(e).forEach((a) => {
      e[a] && this.shape[a] && (r[a] = this.shape[a]);
    }), new O({
      ...this._def,
      shape: () => r
    });
  }
  omit(e) {
    const r = {};
    return S.objectKeys(this.shape).forEach((a) => {
      e[a] || (r[a] = this.shape[a]);
    }), new O({
      ...this._def,
      shape: () => r
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return Se(this);
  }
  partial(e) {
    const r = {};
    return S.objectKeys(this.shape).forEach((a) => {
      const s = this.shape[a];
      e && !e[a] ? r[a] = s : r[a] = s.optional();
    }), new O({
      ...this._def,
      shape: () => r
    });
  }
  required(e) {
    const r = {};
    return S.objectKeys(this.shape).forEach((a) => {
      if (e && !e[a])
        r[a] = this.shape[a];
      else {
        let i = this.shape[a];
        for (; i instanceof H; )
          i = i._def.innerType;
        r[a] = i;
      }
    }), new O({
      ...this._def,
      shape: () => r
    });
  }
  keyof() {
    return Kr(S.objectKeys(this.shape));
  }
}
O.create = (n, e) => new O({
  shape: () => n,
  unknownKeys: "strip",
  catchall: re.create(),
  typeName: _.ZodObject,
  ...E(e)
});
O.strictCreate = (n, e) => new O({
  shape: () => n,
  unknownKeys: "strict",
  catchall: re.create(),
  typeName: _.ZodObject,
  ...E(e)
});
O.lazycreate = (n, e) => new O({
  shape: n,
  unknownKeys: "strip",
  catchall: re.create(),
  typeName: _.ZodObject,
  ...E(e)
});
class st extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e), a = this._def.options;
    function s(i) {
      for (const c of i)
        if (c.result.status === "valid")
          return c.result;
      for (const c of i)
        if (c.result.status === "dirty")
          return r.common.issues.push(...c.ctx.common.issues), c.result;
      const o = i.map((c) => new L(c.ctx.common.issues));
      return h(r, {
        code: f.invalid_union,
        unionErrors: o
      }), b;
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
        const d = {
          ...r,
          common: {
            ...r.common,
            issues: []
          },
          parent: null
        }, l = u._parseSync({
          data: r.data,
          path: r.path,
          parent: d
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !i && (i = { result: l, ctx: d }), d.common.issues.length && o.push(d.common.issues);
      }
      if (i)
        return r.common.issues.push(...i.ctx.common.issues), i.result;
      const c = o.map((u) => new L(u));
      return h(r, {
        code: f.invalid_union,
        unionErrors: c
      }), b;
    }
  }
  get options() {
    return this._def.options;
  }
}
st.create = (n, e) => new st({
  options: n,
  typeName: _.ZodUnion,
  ...E(e)
});
const te = (n) => n instanceof ct ? te(n.schema) : n instanceof V ? te(n.innerType()) : n instanceof ut ? [n.value] : n instanceof fe ? n.options : n instanceof dt ? S.objectValues(n.enum) : n instanceof lt ? te(n._def.innerType) : n instanceof rt ? [void 0] : n instanceof at ? [null] : n instanceof H ? [void 0, ...te(n.unwrap())] : n instanceof he ? [null, ...te(n.unwrap())] : n instanceof Wn || n instanceof ht ? te(n.unwrap()) : n instanceof ft ? te(n._def.innerType) : [];
class en extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== g.object)
      return h(r, {
        code: f.invalid_type,
        expected: g.object,
        received: r.parsedType
      }), b;
    const a = this.discriminator, s = r.data[a], i = this.optionsMap.get(s);
    return i ? r.common.async ? i._parseAsync({
      data: r.data,
      path: r.path,
      parent: r
    }) : i._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }) : (h(r, {
      code: f.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [a]
    }), b);
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
      const o = te(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const c of o) {
        if (s.has(c))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(c)}`);
        s.set(c, i);
      }
    }
    return new en({
      typeName: _.ZodDiscriminatedUnion,
      discriminator: e,
      options: r,
      optionsMap: s,
      ...E(a)
    });
  }
}
function xn(n, e) {
  const r = ie(n), a = ie(e);
  if (n === e)
    return { valid: !0, data: n };
  if (r === g.object && a === g.object) {
    const s = S.objectKeys(e), i = S.objectKeys(n).filter((c) => s.indexOf(c) !== -1), o = { ...n, ...e };
    for (const c of i) {
      const u = xn(n[c], e[c]);
      if (!u.valid)
        return { valid: !1 };
      o[c] = u.data;
    }
    return { valid: !0, data: o };
  } else if (r === g.array && a === g.array) {
    if (n.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let i = 0; i < n.length; i++) {
      const o = n[i], c = e[i], u = xn(o, c);
      if (!u.valid)
        return { valid: !1 };
      s.push(u.data);
    }
    return { valid: !0, data: s };
  } else return r === g.date && a === g.date && +n == +e ? { valid: !0, data: n } : { valid: !1 };
}
class it extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), s = (i, o) => {
      if (Sn(i) || Sn(o))
        return b;
      const c = xn(i.value, o.value);
      return c.valid ? ((kn(i) || kn(o)) && r.dirty(), { status: r.value, value: c.data }) : (h(a, {
        code: f.invalid_intersection_types
      }), b);
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
it.create = (n, e, r) => new it({
  left: n,
  right: e,
  typeName: _.ZodIntersection,
  ...E(r)
});
class Q extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== g.array)
      return h(a, {
        code: f.invalid_type,
        expected: g.array,
        received: a.parsedType
      }), b;
    if (a.data.length < this._def.items.length)
      return h(a, {
        code: f.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), b;
    !this._def.rest && a.data.length > this._def.items.length && (h(a, {
      code: f.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), r.dirty());
    const i = [...a.data].map((o, c) => {
      const u = this._def.items[c] || this._def.rest;
      return u ? u._parse(new X(a, o, a.path, c)) : null;
    }).filter((o) => !!o);
    return a.common.async ? Promise.all(i).then((o) => U.mergeArray(r, o)) : U.mergeArray(r, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Q({
      ...this._def,
      rest: e
    });
  }
}
Q.create = (n, e) => {
  if (!Array.isArray(n))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Q({
    items: n,
    typeName: _.ZodTuple,
    rest: null,
    ...E(e)
  });
};
class ot extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== g.object)
      return h(a, {
        code: f.invalid_type,
        expected: g.object,
        received: a.parsedType
      }), b;
    const s = [], i = this._def.keyType, o = this._def.valueType;
    for (const c in a.data)
      s.push({
        key: i._parse(new X(a, c, a.path, c)),
        value: o._parse(new X(a, a.data[c], a.path, c)),
        alwaysSet: c in a.data
      });
    return a.common.async ? U.mergeObjectAsync(r, s) : U.mergeObjectSync(r, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, r, a) {
    return r instanceof I ? new ot({
      keyType: e,
      valueType: r,
      typeName: _.ZodRecord,
      ...E(a)
    }) : new ot({
      keyType: Z.create(),
      valueType: e,
      typeName: _.ZodRecord,
      ...E(r)
    });
  }
}
class Dt extends I {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== g.map)
      return h(a, {
        code: f.invalid_type,
        expected: g.map,
        received: a.parsedType
      }), b;
    const s = this._def.keyType, i = this._def.valueType, o = [...a.data.entries()].map(([c, u], d) => ({
      key: s._parse(new X(a, c, a.path, [d, "key"])),
      value: i._parse(new X(a, u, a.path, [d, "value"]))
    }));
    if (a.common.async) {
      const c = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const u of o) {
          const d = await u.key, l = await u.value;
          if (d.status === "aborted" || l.status === "aborted")
            return b;
          (d.status === "dirty" || l.status === "dirty") && r.dirty(), c.set(d.value, l.value);
        }
        return { status: r.value, value: c };
      });
    } else {
      const c = /* @__PURE__ */ new Map();
      for (const u of o) {
        const d = u.key, l = u.value;
        if (d.status === "aborted" || l.status === "aborted")
          return b;
        (d.status === "dirty" || l.status === "dirty") && r.dirty(), c.set(d.value, l.value);
      }
      return { status: r.value, value: c };
    }
  }
}
Dt.create = (n, e, r) => new Dt({
  valueType: e,
  keyType: n,
  typeName: _.ZodMap,
  ...E(r)
});
class Ee extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.parsedType !== g.set)
      return h(a, {
        code: f.invalid_type,
        expected: g.set,
        received: a.parsedType
      }), b;
    const s = this._def;
    s.minSize !== null && a.data.size < s.minSize.value && (h(a, {
      code: f.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), r.dirty()), s.maxSize !== null && a.data.size > s.maxSize.value && (h(a, {
      code: f.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), r.dirty());
    const i = this._def.valueType;
    function o(u) {
      const d = /* @__PURE__ */ new Set();
      for (const l of u) {
        if (l.status === "aborted")
          return b;
        l.status === "dirty" && r.dirty(), d.add(l.value);
      }
      return { status: r.value, value: d };
    }
    const c = [...a.data.values()].map((u, d) => i._parse(new X(a, u, a.path, d)));
    return a.common.async ? Promise.all(c).then((u) => o(u)) : o(c);
  }
  min(e, r) {
    return new Ee({
      ...this._def,
      minSize: { value: e, message: y.toString(r) }
    });
  }
  max(e, r) {
    return new Ee({
      ...this._def,
      maxSize: { value: e, message: y.toString(r) }
    });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ee.create = (n, e) => new Ee({
  valueType: n,
  minSize: null,
  maxSize: null,
  typeName: _.ZodSet,
  ...E(e)
});
class Ce extends I {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== g.function)
      return h(r, {
        code: f.invalid_type,
        expected: g.function,
        received: r.parsedType
      }), b;
    function a(c, u) {
      return Pt({
        data: c,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          Ct(),
          Me
        ].filter((d) => !!d),
        issueData: {
          code: f.invalid_arguments,
          argumentsError: u
        }
      });
    }
    function s(c, u) {
      return Pt({
        data: c,
        path: r.path,
        errorMaps: [
          r.common.contextualErrorMap,
          r.schemaErrorMap,
          Ct(),
          Me
        ].filter((d) => !!d),
        issueData: {
          code: f.invalid_return_type,
          returnTypeError: u
        }
      });
    }
    const i = { errorMap: r.common.contextualErrorMap }, o = r.data;
    if (this._def.returns instanceof De) {
      const c = this;
      return D(async function(...u) {
        const d = new L([]), l = await c._def.args.parseAsync(u, i).catch((M) => {
          throw d.addIssue(a(u, M)), d;
        }), v = await Reflect.apply(o, this, l);
        return await c._def.returns._def.type.parseAsync(v, i).catch((M) => {
          throw d.addIssue(s(v, M)), d;
        });
      });
    } else {
      const c = this;
      return D(function(...u) {
        const d = c._def.args.safeParse(u, i);
        if (!d.success)
          throw new L([a(u, d.error)]);
        const l = Reflect.apply(o, this, d.data), v = c._def.returns.safeParse(l, i);
        if (!v.success)
          throw new L([s(l, v.error)]);
        return v.data;
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
    return new Ce({
      ...this._def,
      args: Q.create(e).rest(be.create())
    });
  }
  returns(e) {
    return new Ce({
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
    return new Ce({
      args: e || Q.create([]).rest(be.create()),
      returns: r || be.create(),
      typeName: _.ZodFunction,
      ...E(a)
    });
  }
}
class ct extends I {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
  }
}
ct.create = (n, e) => new ct({
  getter: n,
  typeName: _.ZodLazy,
  ...E(e)
});
class ut extends I {
  _parse(e) {
    if (e.data !== this._def.value) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        received: r.data,
        code: f.invalid_literal,
        expected: this._def.value
      }), b;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ut.create = (n, e) => new ut({
  value: n,
  typeName: _.ZodLiteral,
  ...E(e)
});
function Kr(n, e) {
  return new fe({
    values: n,
    typeName: _.ZodEnum,
    ...E(e)
  });
}
class fe extends I {
  constructor() {
    super(...arguments), He.set(this, void 0);
  }
  _parse(e) {
    if (typeof e.data != "string") {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return h(r, {
        expected: S.joinValues(a),
        received: r.parsedType,
        code: f.invalid_type
      }), b;
    }
    if (jt(this, He) || Dr(this, He, new Set(this._def.values)), !jt(this, He).has(e.data)) {
      const r = this._getOrReturnCtx(e), a = this._def.values;
      return h(r, {
        received: r.data,
        code: f.invalid_enum_value,
        options: a
      }), b;
    }
    return D(e.data);
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
    return fe.create(e, {
      ...this._def,
      ...r
    });
  }
  exclude(e, r = this._def) {
    return fe.create(this.options.filter((a) => !e.includes(a)), {
      ...this._def,
      ...r
    });
  }
}
He = /* @__PURE__ */ new WeakMap();
fe.create = Kr;
class dt extends I {
  constructor() {
    super(...arguments), Je.set(this, void 0);
  }
  _parse(e) {
    const r = S.getValidEnumValues(this._def.values), a = this._getOrReturnCtx(e);
    if (a.parsedType !== g.string && a.parsedType !== g.number) {
      const s = S.objectValues(r);
      return h(a, {
        expected: S.joinValues(s),
        received: a.parsedType,
        code: f.invalid_type
      }), b;
    }
    if (jt(this, Je) || Dr(this, Je, new Set(S.getValidEnumValues(this._def.values))), !jt(this, Je).has(e.data)) {
      const s = S.objectValues(r);
      return h(a, {
        received: a.data,
        code: f.invalid_enum_value,
        options: s
      }), b;
    }
    return D(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Je = /* @__PURE__ */ new WeakMap();
dt.create = (n, e) => new dt({
  values: n,
  typeName: _.ZodNativeEnum,
  ...E(e)
});
class De extends I {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    if (r.parsedType !== g.promise && r.common.async === !1)
      return h(r, {
        code: f.invalid_type,
        expected: g.promise,
        received: r.parsedType
      }), b;
    const a = r.parsedType === g.promise ? r.data : Promise.resolve(r.data);
    return D(a.then((s) => this._def.type.parseAsync(s, {
      path: r.path,
      errorMap: r.common.contextualErrorMap
    })));
  }
}
De.create = (n, e) => new De({
  type: n,
  typeName: _.ZodPromise,
  ...E(e)
});
class V extends I {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === _.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e), s = this._def.effect || null, i = {
      addIssue: (o) => {
        h(a, o), o.fatal ? r.abort() : r.dirty();
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
            return b;
          const u = await this._def.schema._parseAsync({
            data: c,
            path: a.path,
            parent: a
          });
          return u.status === "aborted" ? b : u.status === "dirty" || r.value === "dirty" ? we(u.value) : u;
        });
      {
        if (r.value === "aborted")
          return b;
        const c = this._def.schema._parseSync({
          data: o,
          path: a.path,
          parent: a
        });
        return c.status === "aborted" ? b : c.status === "dirty" || r.value === "dirty" ? we(c.value) : c;
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
        return c.status === "aborted" ? b : (c.status === "dirty" && r.dirty(), o(c.value), { status: r.value, value: c.value });
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((c) => c.status === "aborted" ? b : (c.status === "dirty" && r.dirty(), o(c.value).then(() => ({ status: r.value, value: c.value }))));
    }
    if (s.type === "transform")
      if (a.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: a.data,
          path: a.path,
          parent: a
        });
        if (!et(o))
          return o;
        const c = s.transform(o.value, i);
        if (c instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: r.value, value: c };
      } else
        return this._def.schema._parseAsync({ data: a.data, path: a.path, parent: a }).then((o) => et(o) ? Promise.resolve(s.transform(o.value, i)).then((c) => ({ status: r.value, value: c })) : o);
    S.assertNever(s);
  }
}
V.create = (n, e, r) => new V({
  schema: n,
  typeName: _.ZodEffects,
  effect: e,
  ...E(r)
});
V.createWithPreprocess = (n, e, r) => new V({
  schema: e,
  effect: { type: "preprocess", transform: n },
  typeName: _.ZodEffects,
  ...E(r)
});
class H extends I {
  _parse(e) {
    return this._getType(e) === g.undefined ? D(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
H.create = (n, e) => new H({
  innerType: n,
  typeName: _.ZodOptional,
  ...E(e)
});
class he extends I {
  _parse(e) {
    return this._getType(e) === g.null ? D(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
he.create = (n, e) => new he({
  innerType: n,
  typeName: _.ZodNullable,
  ...E(e)
});
class lt extends I {
  _parse(e) {
    const { ctx: r } = this._processInputParams(e);
    let a = r.data;
    return r.parsedType === g.undefined && (a = this._def.defaultValue()), this._def.innerType._parse({
      data: a,
      path: r.path,
      parent: r
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
lt.create = (n, e) => new lt({
  innerType: n,
  typeName: _.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...E(e)
});
class ft extends I {
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
    return tt(s) ? s.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new L(a.common.issues);
        },
        input: a.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new L(a.common.issues);
        },
        input: a.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ft.create = (n, e) => new ft({
  innerType: n,
  typeName: _.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...E(e)
});
class $t extends I {
  _parse(e) {
    if (this._getType(e) !== g.nan) {
      const a = this._getOrReturnCtx(e);
      return h(a, {
        code: f.invalid_type,
        expected: g.nan,
        received: a.parsedType
      }), b;
    }
    return { status: "valid", value: e.data };
  }
}
$t.create = (n) => new $t({
  typeName: _.ZodNaN,
  ...E(n)
});
const us = Symbol("zod_brand");
class Wn extends I {
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
class Tt extends I {
  _parse(e) {
    const { status: r, ctx: a } = this._processInputParams(e);
    if (a.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: a.data,
          path: a.path,
          parent: a
        });
        return i.status === "aborted" ? b : i.status === "dirty" ? (r.dirty(), we(i.value)) : this._def.out._parseAsync({
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
      return s.status === "aborted" ? b : s.status === "dirty" ? (r.dirty(), {
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
    return new Tt({
      in: e,
      out: r,
      typeName: _.ZodPipeline
    });
  }
}
class ht extends I {
  _parse(e) {
    const r = this._def.innerType._parse(e), a = (s) => (et(s) && (s.value = Object.freeze(s.value)), s);
    return tt(r) ? r.then((s) => a(s)) : a(r);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ht.create = (n, e) => new ht({
  innerType: n,
  typeName: _.ZodReadonly,
  ...E(e)
});
function Fr(n, e = {}, r) {
  return n ? Ue.create().superRefine((a, s) => {
    var i, o;
    if (!n(a)) {
      const c = typeof e == "function" ? e(a) : typeof e == "string" ? { message: e } : e, u = (o = (i = c.fatal) !== null && i !== void 0 ? i : r) !== null && o !== void 0 ? o : !0, d = typeof c == "string" ? { message: c } : c;
      s.addIssue({ code: "custom", ...d, fatal: u });
    }
  }) : Ue.create();
}
const ds = {
  object: O.lazycreate
};
var _;
(function(n) {
  n.ZodString = "ZodString", n.ZodNumber = "ZodNumber", n.ZodNaN = "ZodNaN", n.ZodBigInt = "ZodBigInt", n.ZodBoolean = "ZodBoolean", n.ZodDate = "ZodDate", n.ZodSymbol = "ZodSymbol", n.ZodUndefined = "ZodUndefined", n.ZodNull = "ZodNull", n.ZodAny = "ZodAny", n.ZodUnknown = "ZodUnknown", n.ZodNever = "ZodNever", n.ZodVoid = "ZodVoid", n.ZodArray = "ZodArray", n.ZodObject = "ZodObject", n.ZodUnion = "ZodUnion", n.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", n.ZodIntersection = "ZodIntersection", n.ZodTuple = "ZodTuple", n.ZodRecord = "ZodRecord", n.ZodMap = "ZodMap", n.ZodSet = "ZodSet", n.ZodFunction = "ZodFunction", n.ZodLazy = "ZodLazy", n.ZodLiteral = "ZodLiteral", n.ZodEnum = "ZodEnum", n.ZodEffects = "ZodEffects", n.ZodNativeEnum = "ZodNativeEnum", n.ZodOptional = "ZodOptional", n.ZodNullable = "ZodNullable", n.ZodDefault = "ZodDefault", n.ZodCatch = "ZodCatch", n.ZodPromise = "ZodPromise", n.ZodBranded = "ZodBranded", n.ZodPipeline = "ZodPipeline", n.ZodReadonly = "ZodReadonly";
})(_ || (_ = {}));
const ls = (n, e = {
  message: `Input not instance of ${n.name}`
}) => Fr((r) => r instanceof n, e), Zr = Z.create, Br = de.create, fs = $t.create, hs = le.create, Vr = nt.create, ps = Te.create, gs = Mt.create, ms = rt.create, ys = at.create, _s = Ue.create, vs = be.create, bs = re.create, Ts = Ut.create, Es = B.create, Rs = O.create, Is = O.strictCreate, As = st.create, Ss = en.create, ks = it.create, xs = Q.create, ws = ot.create, Ns = Dt.create, Os = Ee.create, Cs = Ce.create, Ps = ct.create, js = ut.create, Ms = fe.create, Us = dt.create, Ds = De.create, dr = V.create, $s = H.create, Ls = he.create, Gs = V.createWithPreprocess, Ks = Tt.create, Fs = () => Zr().optional(), Zs = () => Br().optional(), Bs = () => Vr().optional(), Vs = {
  string: (n) => Z.create({ ...n, coerce: !0 }),
  number: (n) => de.create({ ...n, coerce: !0 }),
  boolean: (n) => nt.create({
    ...n,
    coerce: !0
  }),
  bigint: (n) => le.create({ ...n, coerce: !0 }),
  date: (n) => Te.create({ ...n, coerce: !0 })
}, Ws = b;
var t = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: Me,
  setErrorMap: Wa,
  getErrorMap: Ct,
  makeIssue: Pt,
  EMPTY_PATH: Ya,
  addIssueToContext: h,
  ParseStatus: U,
  INVALID: b,
  DIRTY: we,
  OK: D,
  isAborted: Sn,
  isDirty: kn,
  isValid: et,
  isAsync: tt,
  get util() {
    return S;
  },
  get objectUtil() {
    return An;
  },
  ZodParsedType: g,
  getParsedType: ie,
  ZodType: I,
  datetimeRegex: Gr,
  ZodString: Z,
  ZodNumber: de,
  ZodBigInt: le,
  ZodBoolean: nt,
  ZodDate: Te,
  ZodSymbol: Mt,
  ZodUndefined: rt,
  ZodNull: at,
  ZodAny: Ue,
  ZodUnknown: be,
  ZodNever: re,
  ZodVoid: Ut,
  ZodArray: B,
  ZodObject: O,
  ZodUnion: st,
  ZodDiscriminatedUnion: en,
  ZodIntersection: it,
  ZodTuple: Q,
  ZodRecord: ot,
  ZodMap: Dt,
  ZodSet: Ee,
  ZodFunction: Ce,
  ZodLazy: ct,
  ZodLiteral: ut,
  ZodEnum: fe,
  ZodNativeEnum: dt,
  ZodPromise: De,
  ZodEffects: V,
  ZodTransformer: V,
  ZodOptional: H,
  ZodNullable: he,
  ZodDefault: lt,
  ZodCatch: ft,
  ZodNaN: $t,
  BRAND: us,
  ZodBranded: Wn,
  ZodPipeline: Tt,
  ZodReadonly: ht,
  custom: Fr,
  Schema: I,
  ZodSchema: I,
  late: ds,
  get ZodFirstPartyTypeKind() {
    return _;
  },
  coerce: Vs,
  any: _s,
  array: Es,
  bigint: hs,
  boolean: Vr,
  date: ps,
  discriminatedUnion: Ss,
  effect: dr,
  enum: Ms,
  function: Cs,
  instanceof: ls,
  intersection: ks,
  lazy: Ps,
  literal: js,
  map: Ns,
  nan: fs,
  nativeEnum: Us,
  never: bs,
  null: ys,
  nullable: Ls,
  number: Br,
  object: Rs,
  oboolean: Bs,
  onumber: Zs,
  optional: $s,
  ostring: Fs,
  pipeline: Ks,
  preprocess: Gs,
  promise: Ds,
  record: ws,
  set: Os,
  strictObject: Is,
  string: Zr,
  symbol: gs,
  transformer: dr,
  tuple: xs,
  undefined: ms,
  union: As,
  unknown: vs,
  void: Ts,
  NEVER: Ws,
  ZodIssueCode: f,
  quotelessJson: Va,
  ZodError: L
});
const lr = "3.3.5", Ys = "HS256", zs = "https://id.trigger.dev", Hs = "https://api.trigger.dev";
async function fr(n) {
  const { SignJWT: e } = await import("./index-BSvgqMFY.js"), r = new TextEncoder().encode(n.secretKey);
  return new e(n.payload).setIssuer(zs).setAudience(Hs).setProtectedHeader({ alg: Ys }).setIssuedAt().setExpirationTime(n.expirationTime ?? "15m").sign(r);
}
t.object({
  url: t.string().url(),
  authorizationCode: t.string()
});
t.object({
  authorizationCode: t.string()
});
t.object({
  token: t.object({
    token: t.string(),
    obfuscatedToken: t.string()
  }).nullable()
});
const Js = t.union([t.string(), t.number(), t.boolean(), t.null()]), pt = t.lazy(() => t.union([Js, t.array(pt), t.record(pt)])), Xs = t.union([
  t.string(),
  t.number(),
  t.boolean(),
  t.null(),
  t.date(),
  t.undefined(),
  t.symbol()
]), hr = t.lazy(() => t.union([Xs, t.array(hr), t.record(hr)])), Qs = t.union([
  t.literal(0.25),
  t.literal(0.5),
  t.literal(1),
  t.literal(2),
  t.literal(4)
]), qs = t.union([
  t.literal(0.25),
  t.literal(0.5),
  t.literal(1),
  t.literal(2),
  t.literal(4),
  t.literal(8)
]), Wr = t.enum([
  "micro",
  "small-1x",
  "small-2x",
  "medium-1x",
  "medium-2x",
  "large-1x",
  "large-2x"
]), Yr = t.object({
  cpu: Qs.optional(),
  memory: qs.optional(),
  preset: Wr.optional()
}), Et = t.object({
  name: Wr,
  cpu: t.number(),
  memory: t.number(),
  centsPerMs: t.number()
}), ei = t.object({
  type: t.literal("BUILT_IN_ERROR"),
  name: t.string(),
  message: t.string(),
  stackTrace: t.string()
}), ti = t.object({
  type: t.literal("CUSTOM_ERROR"),
  raw: t.string()
}), ni = t.object({
  type: t.literal("STRING_ERROR"),
  raw: t.string()
}), Yn = t.object({
  type: t.literal("INTERNAL_ERROR"),
  code: t.enum([
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
  message: t.string().optional(),
  stackTrace: t.string().optional()
}), zr = Yn.shape.code.enum, Hr = t.discriminatedUnion("type", [
  ei,
  ti,
  ni,
  Yn
]), Jr = t.object({
  id: t.string(),
  payload: t.string(),
  payloadType: t.string(),
  context: t.any(),
  tags: t.array(t.string()),
  isTest: t.boolean().default(!1),
  createdAt: t.coerce.date(),
  startedAt: t.coerce.date().default(() => /* @__PURE__ */ new Date()),
  idempotencyKey: t.string().optional(),
  maxAttempts: t.number().optional(),
  durationMs: t.number().default(0),
  costInCents: t.number().default(0),
  baseCostInCents: t.number().default(0),
  version: t.string().optional(),
  metadata: t.record(pt).optional(),
  maxDuration: t.number().optional()
}), Xr = t.object({
  id: t.string(),
  filePath: t.string(),
  exportName: t.string()
}), Qr = t.object({
  id: t.string(),
  number: t.number(),
  startedAt: t.coerce.date(),
  backgroundWorkerId: t.string(),
  backgroundWorkerTaskId: t.string(),
  status: t.string()
}), qr = t.object({
  id: t.string(),
  slug: t.string(),
  type: t.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"])
}), ea = t.object({
  id: t.string(),
  slug: t.string(),
  name: t.string()
}), ta = t.object({
  id: t.string(),
  ref: t.string(),
  slug: t.string(),
  name: t.string()
}), na = t.object({
  id: t.string(),
  name: t.string()
}), ra = t.object({
  id: t.string()
}), ae = t.object({
  task: Xr,
  attempt: Qr,
  run: Jr,
  queue: na,
  environment: qr,
  organization: ea,
  project: ta,
  batch: ra.optional(),
  machine: Et.optional()
});
t.object({
  task: Xr,
  attempt: Qr.omit({
    backgroundWorkerId: !0,
    backgroundWorkerTaskId: !0
  }),
  run: Jr.omit({ payload: !0, payloadType: !0, metadata: !0 }),
  queue: na,
  environment: qr,
  organization: ea,
  project: ta,
  batch: ra.optional(),
  machine: Et.optional()
});
const ri = t.object({
  timestamp: t.number(),
  delay: t.number(),
  error: t.unknown().optional()
}), aa = t.object({
  durationMs: t.number()
}), tn = t.object({
  ok: t.literal(!1),
  id: t.string(),
  error: Hr,
  retry: ri.optional(),
  skippedRetrying: t.boolean().optional(),
  usage: aa.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: t.string().optional()
}), ai = t.object({
  ok: t.literal(!0),
  id: t.string(),
  output: t.string().optional(),
  outputType: t.string(),
  usage: aa.optional(),
  // Optional for now for backwards compatibility
  taskIdentifier: t.string().optional()
}), W = t.discriminatedUnion("ok", [
  ai,
  tn
]), si = t.object({
  id: t.string(),
  items: W.array()
}), pr = t.object({
  message: t.string(),
  name: t.string().optional(),
  stackTrace: t.string().optional()
}), kt = t.enum(["PRODUCTION", "STAGING", "DEVELOPMENT", "PREVIEW"]);
t.object({
  execution: ae,
  traceContext: t.record(t.unknown()),
  environment: t.record(t.string()).optional()
});
const zn = ae.extend({
  worker: t.object({
    id: t.string(),
    contentHash: t.string(),
    version: t.string()
  }),
  machine: Et.default({ name: "small-1x", cpu: 1, memory: 1, centsPerMs: 0 })
}), Lt = t.object({
  execution: zn,
  traceContext: t.record(t.unknown()),
  environment: t.record(t.string()).optional()
}), ii = t.object({
  type: t.literal("fixed-window"),
  limit: t.number(),
  window: t.union([
    t.object({
      seconds: t.number()
    }),
    t.object({
      minutes: t.number()
    }),
    t.object({
      hours: t.number()
    })
  ])
}), oi = t.object({
  type: t.literal("sliding-window"),
  limit: t.number(),
  window: t.union([
    t.object({
      seconds: t.number()
    }),
    t.object({
      minutes: t.number()
    }),
    t.object({
      hours: t.number()
    })
  ])
});
t.discriminatedUnion("type", [
  ii,
  oi
]);
const Re = t.object({
  /** The number of attempts before giving up */
  maxAttempts: t.number().int().optional(),
  /** The exponential factor to use when calculating the next retry time.
   *
   * Each subsequent retry will be calculated as `previousTimeout * factor`
   */
  factor: t.number().optional(),
  /** The minimum time to wait before retrying */
  minTimeoutInMs: t.number().int().optional(),
  /** The maximum time to wait before retrying */
  maxTimeoutInMs: t.number().int().optional(),
  /** Randomize the timeout between retries.
   *
   * This can be useful to prevent the thundering herd problem where all retries happen at the same time.
   */
  randomize: t.boolean().optional()
}), nn = t.object({
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
  name: t.string().optional(),
  /** An optional property that specifies the maximum number of concurrent run executions.
   *
   * If this property is omitted, the task can potentially use up the full concurrency of an environment. */
  concurrencyLimit: t.number().int().min(0).max(1e3).optional()
}), sa = t.object({
  cron: t.string(),
  timezone: t.string()
}), ia = {
  id: t.string(),
  description: t.string().optional(),
  queue: nn.optional(),
  retry: Re.optional(),
  machine: Yr.optional(),
  triggerSource: t.string().optional(),
  schedule: sa.optional(),
  maxDuration: t.number().optional()
};
t.object(ia);
const ci = t.object({
  entry: t.string(),
  out: t.string()
}), oa = {
  filePath: t.string(),
  exportName: t.string(),
  entryPoint: t.string()
};
t.object(oa);
const ui = t.object({
  ...ia,
  ...oa
});
t.enum(["index", "create", "restore"]);
t.enum(["terminate"]);
const di = t.custom((n) => {
  try {
    return typeof n.test == "function";
  } catch {
    return !1;
  }
});
t.object({
  project: t.string(),
  triggerDirectories: t.string().array().optional(),
  triggerUrl: t.string().optional(),
  projectDir: t.string().optional(),
  tsconfigPath: t.string().optional(),
  retries: t.object({
    enabledInDev: t.boolean().default(!0),
    default: Re.optional()
  }).optional(),
  additionalPackages: t.string().array().optional(),
  additionalFiles: t.string().array().optional(),
  dependenciesToBundle: t.array(t.union([t.string(), di])).optional(),
  logLevel: t.string().optional(),
  enableConsoleLogging: t.boolean().optional(),
  postInstall: t.string().optional(),
  extraCACerts: t.string().optional()
});
const Xe = t.enum(["WAIT_FOR_DURATION", "WAIT_FOR_TASK", "WAIT_FOR_BATCH"]), Hn = t.object({
  runId: t.string(),
  attemptCount: t.number().optional(),
  messageId: t.string(),
  isTest: t.boolean(),
  traceContext: t.record(t.unknown()),
  environment: t.record(t.string()).optional()
}), Jn = t.object({
  id: t.string(),
  description: t.string().optional(),
  filePath: t.string(),
  exportName: t.string(),
  queue: nn.optional(),
  retry: Re.optional(),
  machine: Yr.optional(),
  triggerSource: t.string().optional(),
  schedule: sa.optional(),
  maxDuration: t.number().optional()
}), li = t.object({
  filePath: t.string(),
  contents: t.string(),
  contentHash: t.string(),
  taskIds: t.array(t.string())
}), fi = t.object({
  packageVersion: t.string(),
  contentHash: t.string(),
  cliPackageVersion: t.string().optional(),
  tasks: t.array(Jn),
  sourceFiles: t.array(li).optional()
});
t.object({
  contentHash: t.string(),
  imageTag: t.string()
});
t.object({
  userId: t.string(),
  email: t.string().email(),
  dashboardUrl: t.string()
});
const hi = t.object({
  id: t.string(),
  externalRef: t.string(),
  name: t.string(),
  slug: t.string(),
  createdAt: t.coerce.date(),
  organization: t.object({
    id: t.string(),
    title: t.string(),
    slug: t.string(),
    createdAt: t.coerce.date()
  })
});
t.array(hi);
t.object({
  apiKey: t.string(),
  name: t.string(),
  apiUrl: t.string(),
  projectId: t.string()
});
t.object({
  localOnly: t.boolean(),
  metadata: fi,
  supportsLazyAttempts: t.boolean().optional()
});
t.object({
  id: t.string(),
  version: t.string(),
  contentHash: t.string()
});
const gr = t.string().max(128, "Tags must be less than 128 characters"), Xn = t.union([gr, gr.array()]), pi = t.object({
  payload: t.any(),
  context: t.any(),
  options: t.object({
    dependentAttempt: t.string().optional(),
    parentAttempt: t.string().optional(),
    dependentBatch: t.string().optional(),
    parentBatch: t.string().optional(),
    lockToVersion: t.string().optional(),
    queue: nn.optional(),
    concurrencyKey: t.string().optional(),
    idempotencyKey: t.string().optional(),
    idempotencyKeyTTL: t.string().optional(),
    test: t.boolean().optional(),
    payloadType: t.string().optional(),
    delay: t.string().or(t.coerce.date()).optional(),
    ttl: t.string().or(t.number().nonnegative().int()).optional(),
    tags: Xn.optional(),
    maxAttempts: t.number().int().optional(),
    metadata: t.any(),
    metadataType: t.string().optional(),
    maxDuration: t.number().optional()
  }).optional()
}), gi = t.object({
  id: t.string()
});
t.object({
  items: pi.array(),
  dependentAttempt: t.string().optional()
});
const mi = t.object({
  task: t.string(),
  payload: t.any(),
  context: t.any(),
  options: t.object({
    lockToVersion: t.string().optional(),
    queue: nn.optional(),
    concurrencyKey: t.string().optional(),
    idempotencyKey: t.string().optional(),
    idempotencyKeyTTL: t.string().optional(),
    test: t.boolean().optional(),
    payloadType: t.string().optional(),
    delay: t.string().or(t.coerce.date()).optional(),
    ttl: t.string().or(t.number().nonnegative().int()).optional(),
    tags: Xn.optional(),
    maxAttempts: t.number().int().optional(),
    metadata: t.any(),
    metadataType: t.string().optional(),
    maxDuration: t.number().optional(),
    parentAttempt: t.string().optional()
  }).optional()
});
t.object({
  items: mi.array(),
  dependentAttempt: t.string().optional()
});
const yi = t.object({
  id: t.string(),
  isCached: t.boolean(),
  idempotencyKey: t.string().optional(),
  runs: t.array(t.object({
    id: t.string(),
    taskIdentifier: t.string(),
    isCached: t.boolean(),
    idempotencyKey: t.string().optional()
  }))
});
t.object({
  batchId: t.string(),
  runs: t.string().array()
});
t.object({
  id: t.string(),
  items: t.array(t.object({
    id: t.string(),
    taskRunId: t.string(),
    status: t.enum(["PENDING", "CANCELED", "COMPLETED", "FAILED"])
  }))
});
t.object({
  tags: Xn
});
t.object({
  delay: t.string().or(t.coerce.date())
});
t.object({
  variables: t.record(t.string())
});
t.object({
  imageReference: t.string(),
  selfHosted: t.boolean().optional()
});
t.object({
  id: t.string(),
  contentHash: t.string()
});
t.object({
  imageReference: t.string(),
  selfHosted: t.boolean().optional()
});
const _i = t.object({
  buildId: t.string(),
  buildToken: t.string(),
  projectId: t.string()
});
t.object({
  id: t.string(),
  contentHash: t.string(),
  shortCode: t.string(),
  version: t.string(),
  imageTag: t.string(),
  externalBuildData: _i.optional().nullable(),
  registryHost: t.string().optional()
});
t.object({
  contentHash: t.string(),
  userId: t.string().optional(),
  registryHost: t.string().optional(),
  selfHosted: t.boolean().optional(),
  namespace: t.string().optional()
});
const ca = t.object({
  name: t.string(),
  message: t.string(),
  stack: t.string().optional(),
  stderr: t.string().optional()
});
t.object({
  error: ca
});
t.object({
  id: t.string()
});
t.object({
  id: t.string(),
  status: t.enum([
    "PENDING",
    "BUILDING",
    "DEPLOYING",
    "DEPLOYED",
    "FAILED",
    "CANCELED",
    "TIMED_OUT"
  ]),
  contentHash: t.string(),
  shortCode: t.string(),
  version: t.string(),
  imageReference: t.string().nullish(),
  errorData: ca.nullish(),
  worker: t.object({
    id: t.string(),
    version: t.string(),
    tasks: t.array(t.object({
      id: t.string(),
      slug: t.string(),
      filePath: t.string(),
      exportName: t.string()
    }))
  }).optional()
});
const mr = t.object({
  presignedUrl: t.string()
}), vi = t.object({
  id: t.string()
}), bi = t.object({
  id: t.string()
}), ua = t.union([t.literal("DECLARATIVE"), t.literal("IMPERATIVE")]);
t.object({
  /** The schedule id associated with this run (you can have many schedules for the same task).
    You can use this to remove the schedule, update it, etc */
  scheduleId: t.string(),
  /** The type of schedule – `"DECLARATIVE"` or `"IMPERATIVE"`.
   *
   * **DECLARATIVE** – defined inline on your `schedules.task` using the `cron` property. They can only be created, updated or deleted by modifying the `cron` property on your task.
   *
   * **IMPERATIVE** – created using the `schedules.create` functions or in the dashboard.
   */
  type: ua,
  /** When the task was scheduled to run.
   * Note this will be slightly different from `new Date()` because it takes a few ms to run the task.
   *
   * This date is UTC. To output it as a string with a timezone you would do this:
   * ```ts
   * const formatted = payload.timestamp.toLocaleString("en-US", {
        timeZone: payload.timezone,
    });
    ```  */
  timestamp: t.date(),
  /** When the task was last run (it has been).
    This can be undefined if it's never been run. This date is UTC. */
  lastTimestamp: t.date().optional(),
  /** You can optionally provide an external id when creating the schedule.
    Usually you would use a userId or some other unique identifier.
    This defaults to undefined if you didn't provide one. */
  externalId: t.string().optional(),
  /** The IANA timezone the schedule is set to. The default is UTC.
   * You can see the full list of supported timezones here: https://cloud.trigger.dev/timezones
   */
  timezone: t.string(),
  /** The next 5 dates this task is scheduled to run */
  upcoming: t.array(t.date())
});
const Ti = t.object({
  /** The id of the task you want to attach to. */
  task: t.string(),
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
  cron: t.string(),
  /** You can only create one schedule with this key. If you use it twice, the second call will update the schedule.
   *
   * This is required to prevent you from creating duplicate schedules. */
  deduplicationKey: t.string(),
  /** Optionally, you can specify your own IDs (like a user ID) and then use it inside the run function of your task.
   *
   * This allows you to have per-user CRON tasks.
   */
  externalId: t.string().optional(),
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
  timezone: t.string().optional()
});
Ti.omit({ deduplicationKey: !0 });
const da = t.object({
  type: t.literal("CRON"),
  expression: t.string(),
  description: t.string()
}), me = t.object({
  id: t.string(),
  type: ua,
  task: t.string(),
  active: t.boolean(),
  deduplicationKey: t.string().nullish(),
  externalId: t.string().nullish(),
  generator: da,
  timezone: t.string(),
  nextRun: t.coerce.date().nullish(),
  environments: t.array(t.object({
    id: t.string(),
    type: t.string(),
    userName: t.string().nullish()
  }))
}), Ei = t.object({
  id: t.string()
});
t.object({
  data: t.array(me),
  pagination: t.object({
    currentPage: t.number(),
    totalPages: t.number(),
    count: t.number()
  })
});
t.object({
  page: t.number().optional(),
  perPage: t.number().optional()
});
t.object({
  timezones: t.array(t.string())
});
const Ri = t.enum([
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
]), Ii = t.enum([
  "PENDING",
  "EXECUTING",
  "PAUSED",
  "COMPLETED",
  "FAILED",
  "CANCELED"
]), Ai = t.object({
  id: t.string(),
  name: t.string(),
  user: t.string().optional()
}), Si = t.object({
  id: t.string(),
  externalId: t.string().optional(),
  deduplicationKey: t.string().optional(),
  generator: da
});
t.enum([
  "triggerAndWait",
  "trigger",
  "batchTriggerAndWait",
  "batchTrigger"
]);
const la = {
  id: t.string(),
  status: Ri,
  taskIdentifier: t.string(),
  idempotencyKey: t.string().optional(),
  version: t.string().optional(),
  isQueued: t.boolean(),
  isExecuting: t.boolean(),
  isCompleted: t.boolean(),
  isSuccess: t.boolean(),
  isFailed: t.boolean(),
  isCancelled: t.boolean(),
  isTest: t.boolean(),
  createdAt: t.coerce.date(),
  updatedAt: t.coerce.date(),
  startedAt: t.coerce.date().optional(),
  finishedAt: t.coerce.date().optional(),
  delayedUntil: t.coerce.date().optional(),
  ttl: t.string().optional(),
  expiredAt: t.coerce.date().optional(),
  tags: t.string().array(),
  costInCents: t.number(),
  baseCostInCents: t.number(),
  durationMs: t.number(),
  metadata: t.record(t.any()).optional()
}, fa = {
  ...la,
  depth: t.number(),
  triggerFunction: t.enum(["triggerAndWait", "trigger", "batchTriggerAndWait", "batchTrigger"]),
  batchId: t.string().optional()
}, un = t.object(fa), yr = t.object({
  ...fa,
  payload: t.any().optional(),
  payloadPresignedUrl: t.string().optional(),
  output: t.any().optional(),
  outputPresignedUrl: t.string().optional(),
  error: pr.optional(),
  schedule: Si.optional(),
  relatedRuns: t.object({
    root: un.optional(),
    parent: un.optional(),
    children: t.array(un).optional()
  }),
  attempts: t.array(t.object({
    id: t.string(),
    status: Ii,
    createdAt: t.coerce.date(),
    updatedAt: t.coerce.date(),
    startedAt: t.coerce.date().optional(),
    completedAt: t.coerce.date().optional(),
    error: pr.optional()
  }).optional()),
  attemptCount: t.number().default(0)
}), wn = t.object({
  ...la,
  env: Ai
});
t.object({
  data: t.array(wn),
  pagination: t.object({
    next: t.string().optional(),
    previous: t.string().optional()
  })
});
t.object({
  name: t.string(),
  value: t.string()
});
t.object({
  value: t.string()
});
t.object({
  variables: t.record(t.string()),
  override: t.boolean().optional()
});
const It = t.object({
  success: t.boolean()
}), ki = t.object({
  value: t.string()
}), xi = t.object({
  name: t.string(),
  value: t.string()
}), wi = t.array(xi);
t.object({
  metadata: t.record(pt),
  metadataType: t.string().optional()
});
const Ni = t.object({
  metadata: t.record(pt)
}), Oi = t.object({
  id: t.string(),
  idempotencyKey: t.string().nullish(),
  createdAt: t.coerce.date(),
  updatedAt: t.coerce.date(),
  startedAt: t.coerce.date().nullish(),
  delayUntil: t.coerce.date().nullish(),
  queuedAt: t.coerce.date().nullish(),
  expiredAt: t.coerce.date().nullish(),
  completedAt: t.coerce.date().nullish(),
  taskIdentifier: t.string(),
  friendlyId: t.string(),
  number: t.number(),
  isTest: t.boolean(),
  status: t.string(),
  usageDurationMs: t.number(),
  costInCents: t.number(),
  baseCostInCents: t.number(),
  ttl: t.string().nullish(),
  payload: t.string().nullish(),
  payloadType: t.string().nullish(),
  metadata: t.string().nullish(),
  metadataType: t.string().nullish(),
  output: t.string().nullish(),
  outputType: t.string().nullish(),
  runTags: t.array(t.string()).nullish().default([]),
  error: Hr.nullish()
}), Ci = t.enum(["PENDING", "COMPLETED"]), Pi = t.object({
  id: t.string(),
  status: Ci,
  idempotencyKey: t.string().optional(),
  createdAt: t.coerce.date(),
  updatedAt: t.coerce.date(),
  runCount: t.number()
}), ji = t.object({
  project: t.string(),
  dirs: t.string().array()
}), Mi = t.object({
  name: t.string(),
  version: t.string()
}), Ui = t.enum(["dev", "deploy"]), ha = t.enum(["node", "bun"]), Di = t.object({
  target: Ui,
  packageVersion: t.string(),
  cliPackageVersion: t.string(),
  contentHash: t.string(),
  runtime: ha,
  environment: t.string(),
  config: ji,
  files: t.array(ci),
  sources: t.record(t.object({
    contents: t.string(),
    contentHash: t.string()
  })),
  outputPath: t.string(),
  runWorkerEntryPoint: t.string(),
  // Dev & Deploy has a runWorkerEntryPoint
  runControllerEntryPoint: t.string().optional(),
  // Only deploy has a runControllerEntryPoint
  indexWorkerEntryPoint: t.string(),
  // Dev & Deploy has a indexWorkerEntryPoint
  indexControllerEntryPoint: t.string().optional(),
  // Only deploy has a indexControllerEntryPoint
  loaderEntryPoint: t.string().optional(),
  configPath: t.string(),
  externals: Mi.array().optional(),
  build: t.object({
    env: t.record(t.string()).optional(),
    commands: t.array(t.string()).optional()
  }),
  customConditions: t.array(t.string()).optional(),
  deploy: t.object({
    env: t.record(t.string()).optional(),
    sync: t.object({
      env: t.record(t.string()).optional()
    }).optional()
  }),
  image: t.object({
    pkgs: t.array(t.string()).optional(),
    instructions: t.array(t.string()).optional()
  }).optional(),
  otelImportHook: t.object({
    include: t.array(t.string()).optional(),
    exclude: t.array(t.string()).optional()
  }).optional()
});
t.object({
  type: t.literal("index"),
  data: t.object({
    build: Di
  })
});
const pa = t.object({
  configPath: t.string(),
  tasks: ui.array(),
  workerEntryPoint: t.string(),
  controllerEntryPoint: t.string().optional(),
  loaderEntryPoint: t.string().optional(),
  runtime: ha,
  customConditions: t.array(t.string()).optional(),
  otelImportHook: t.object({
    include: t.array(t.string()).optional(),
    exclude: t.array(t.string()).optional()
  }).optional()
});
t.object({
  type: t.literal("worker-manifest"),
  data: t.object({
    manifest: pa
  })
});
const $i = t.object({
  message: t.string(),
  file: t.string(),
  stack: t.string().optional(),
  name: t.string().optional()
}), Li = t.array($i), ga = t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1),
    error: t.object({
      name: t.string(),
      message: t.string(),
      stack: t.string().optional(),
      stderr: t.string().optional()
    })
  }),
  t.object({
    success: t.literal(!0)
  })
]), ma = t.discriminatedUnion("type", [
  t.object({
    type: t.literal("CANCEL_ATTEMPT"),
    taskAttemptId: t.string(),
    taskRunId: t.string()
  }),
  t.object({
    type: t.literal("SCHEDULE_ATTEMPT"),
    image: t.string(),
    version: t.string(),
    machine: Et,
    nextAttemptNumber: t.number().optional(),
    // identifiers
    id: t.string().optional(),
    // TODO: Remove this completely in a future release
    envId: t.string(),
    envType: kt,
    orgId: t.string(),
    projectId: t.string(),
    runId: t.string()
  }),
  t.object({
    type: t.literal("EXECUTE_RUN_LAZY_ATTEMPT"),
    payload: Hn
  })
]);
t.object({
  version: t.literal("v1").default("v1"),
  id: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string(),
  data: ma
});
const ya = t.discriminatedUnion("type", [
  t.object({
    version: t.literal("v1").default("v1"),
    type: t.literal("TASK_RUN_COMPLETED"),
    completion: W,
    execution: ae
  }),
  t.object({
    version: t.literal("v1").default("v1"),
    type: t.literal("TASK_RUN_FAILED_TO_RUN"),
    completion: tn
  }),
  t.object({
    version: t.literal("v1").default("v1"),
    type: t.literal("TASK_HEARTBEAT"),
    id: t.string()
  }),
  t.object({
    version: t.literal("v1").default("v1"),
    type: t.literal("TASK_RUN_HEARTBEAT"),
    id: t.string()
  })
]), Gi = t.object({
  id: t.string(),
  version: t.string(),
  contentHash: t.string()
});
t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string(),
  inProgressRuns: t.string().array().optional()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string(),
  data: ya
});
const _a = t.object({
  version: t.literal("v1").default("v1"),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional()
  }),
  origin: t.enum(["uncaughtException", "unhandledRejection"])
}), Ki = t.object({
  version: t.literal("v1").default("v1"),
  tasks: t.unknown(),
  zodIssues: t.custom((n) => Array.isArray(n) && n.every((e) => typeof e == "object" && "message" in e))
});
t.object({
  version: t.literal("v1").default("v1"),
  manifest: pa,
  importErrors: Li
});
t.object({
  version: t.literal("v1").default("v1"),
  execution: ae,
  result: W
}), t.object({
  version: t.literal("v1").default("v1"),
  id: t.string()
}), t.undefined(), t.object({
  version: t.literal("v1").default("v1"),
  ms: t.number(),
  now: t.number(),
  waitThresholdInMs: t.number()
}), t.object({
  version: t.literal("v1").default("v1"),
  friendlyId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  batchFriendlyId: t.string(),
  runFriendlyIds: t.string().array()
});
t.object({
  version: t.literal("v1").default("v1"),
  execution: ae,
  traceContext: t.record(t.unknown()),
  metadata: Gi
}), t.discriminatedUnion("version", [
  t.object({
    version: t.literal("v1"),
    completion: W,
    execution: ae
  }),
  t.object({
    version: t.literal("v2"),
    completion: W
  })
]), t.object({
  version: t.literal("v1").default("v1")
}), t.object({
  timeoutInMs: t.number()
}), t.void();
t.object({
  version: t.literal("v1").default("v1"),
  data: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  data: t.string()
}), t.object({
  status: t.literal("ok")
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  reason: t.string().optional(),
  exitCode: t.number().optional(),
  message: t.string().optional(),
  logs: t.string().optional(),
  /** This means we should only update the error if one exists */
  overrideCompletion: t.boolean().optional(),
  errorCode: Yn.shape.code.optional()
}), t.object({
  version: t.literal("v1").default("v1"),
  deploymentId: t.string(),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional(),
    stderr: t.string().optional()
  }),
  overrideCompletion: t.boolean().optional()
});
t.object({
  version: t.literal("v1").default("v1"),
  imageTag: t.string(),
  shortCode: t.string(),
  apiKey: t.string(),
  apiUrl: t.string(),
  // identifiers
  envId: t.string(),
  envType: kt,
  orgId: t.string(),
  projectId: t.string(),
  deploymentId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  type: t.enum(["DOCKER", "KUBERNETES"]),
  location: t.string(),
  reason: t.string().optional(),
  imageRef: t.string(),
  attemptNumber: t.number().optional(),
  machine: Et,
  // identifiers
  checkpointId: t.string(),
  envId: t.string(),
  envType: kt,
  orgId: t.string(),
  projectId: t.string(),
  runId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  imageRef: t.string(),
  shortCode: t.string(),
  // identifiers
  envId: t.string(),
  envType: kt,
  orgId: t.string(),
  projectId: t.string(),
  deploymentId: t.string()
});
const _r = t.object({
  projectRef: t.string(),
  envId: t.string(),
  deploymentId: t.string(),
  metadata: t.object({
    cliPackageVersion: t.string().optional(),
    contentHash: t.string(),
    packageVersion: t.string(),
    tasks: Jn.array()
  })
});
t.object({
  version: t.literal("v1").default("v1"),
  metadata: t.any(),
  text: t.string()
}), t.discriminatedUnion("version", [
  _r.extend({
    version: t.literal("v1")
  }),
  _r.extend({
    version: t.literal("v2"),
    supportsLazyAttempts: t.boolean()
  })
]), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1)
  }),
  t.object({
    success: t.literal(!0)
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  envId: t.string()
}), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1),
    reason: t.string().optional()
  }),
  t.object({
    success: t.literal(!0),
    executionPayload: Lt
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  totalCompletions: t.number()
}), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1)
  }),
  t.object({
    success: t.literal(!0),
    payload: Lt
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  envId: t.string(),
  totalCompletions: t.number()
}), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1),
    reason: t.string().optional()
  }),
  t.object({
    success: t.literal(!0),
    lazyPayload: Hn
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  attemptFriendlyId: t.string(),
  type: Xe
}), t.object({
  version: t.enum(["v1", "v2"]).default("v1"),
  execution: zn,
  completion: W,
  checkpoint: t.object({
    docker: t.boolean(),
    location: t.string()
  }).optional()
}), t.object({
  version: t.literal("v1").default("v1"),
  completion: tn
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptFriendlyId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string().optional(),
  attemptFriendlyId: t.string(),
  docker: t.boolean(),
  location: t.string(),
  reason: t.discriminatedUnion("type", [
    t.object({
      type: t.literal("WAIT_FOR_DURATION"),
      ms: t.number(),
      now: t.number()
    }),
    t.object({
      type: t.literal("WAIT_FOR_BATCH"),
      batchFriendlyId: t.string(),
      runFriendlyIds: t.string().array()
    }),
    t.object({
      type: t.literal("WAIT_FOR_TASK"),
      friendlyId: t.string()
    }),
    t.object({
      type: t.literal("RETRYING_AFTER_FAILURE"),
      attemptNumber: t.number()
    })
  ])
}), t.object({
  version: t.literal("v1").default("v1"),
  keepRunAlive: t.boolean()
}), t.object({
  version: t.literal("v1").default("v1"),
  deploymentId: t.string(),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional(),
    stderr: t.string().optional()
  })
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional()
  })
});
t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  attemptId: t.string(),
  attemptFriendlyId: t.string(),
  completions: W.array(),
  executions: ae.array()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  attemptId: t.string(),
  attemptFriendlyId: t.string(),
  completions: W.array(),
  executions: ae.array()
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptId: t.string(),
  attemptFriendlyId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptId: t.string(),
  attemptFriendlyId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  delayInMs: t.number().optional()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  checkpointThresholdInMs: t.number()
});
t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string(),
  data: ya
});
t.object({
  version: t.literal("v1").default("v1"),
  id: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  backgroundWorkerId: t.string(),
  data: ma
});
const vr = t.object({
  version: t.literal("v1"),
  deploymentId: t.string(),
  tasks: Jn.array(),
  packageVersion: t.string()
});
t.object({
  version: t.literal("v1").default("v1")
}), t.void(), t.discriminatedUnion("version", [
  vr.extend({
    version: t.literal("v1")
  }),
  vr.extend({
    version: t.literal("v2"),
    supportsLazyAttempts: t.boolean()
  })
]), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1)
  }),
  t.object({
    success: t.literal(!0)
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  totalCompletions: t.number()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string(),
  totalCompletions: t.number()
}), t.discriminatedUnion("version", [
  t.object({
    version: t.literal("v1"),
    attemptFriendlyId: t.string(),
    type: Xe
  }),
  t.object({
    version: t.literal("v2"),
    attemptFriendlyId: t.string(),
    attemptNumber: t.number(),
    type: Xe
  })
]), t.object({
  version: t.literal("v1").default("v1")
}), t.discriminatedUnion("version", [
  t.object({
    version: t.literal("v1")
  }),
  t.object({
    version: t.literal("v2"),
    reason: Xe.optional()
  })
]).default({ version: "v1" }), t.object({
  version: t.literal("v2").default("v2"),
  checkpointCanceled: t.boolean(),
  reason: Xe.optional()
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptFriendlyId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string()
}), t.object({
  version: t.enum(["v1", "v2"]).default("v1"),
  execution: zn,
  completion: W
}), t.object({
  willCheckpointAndRestore: t.boolean(),
  shouldExit: t.boolean()
}), t.object({
  version: t.literal("v1").default("v1"),
  completion: tn
}), t.object({
  version: t.literal("v1").default("v1"),
  ms: t.number(),
  now: t.number(),
  attemptFriendlyId: t.string()
}), t.object({
  willCheckpointAndRestore: t.boolean()
}), t.object({
  version: t.enum(["v1", "v2"]).default("v1"),
  friendlyId: t.string(),
  // This is the attempt that is waiting
  attemptFriendlyId: t.string()
}), t.object({
  willCheckpointAndRestore: t.boolean()
}), t.object({
  version: t.enum(["v1", "v2"]).default("v1"),
  batchFriendlyId: t.string(),
  runFriendlyIds: t.string().array(),
  // This is the attempt that is waiting
  attemptFriendlyId: t.string()
}), t.object({
  willCheckpointAndRestore: t.boolean()
}), t.object({
  version: t.literal("v1").default("v1"),
  deploymentId: t.string(),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional(),
    stderr: t.string().optional()
  })
}), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string()
}), t.discriminatedUnion("success", [
  t.object({
    success: t.literal(!1),
    reason: t.string().optional()
  }),
  t.object({
    success: t.literal(!0),
    executionPayload: Lt
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  error: t.object({
    name: t.string(),
    message: t.string(),
    stack: t.string().optional()
  })
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptFriendlyId: t.string().optional(),
  attemptNumber: t.string().optional()
});
t.object({
  version: t.literal("v1").default("v1"),
  attemptId: t.string(),
  completions: W.array(),
  executions: ae.array()
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptId: t.string()
}), t.object({
  version: t.literal("v1").default("v1"),
  executionPayload: Lt
}), t.object({
  version: t.literal("v1").default("v1"),
  lazyPayload: Hn
}), t.object({
  version: t.literal("v1").default("v1"),
  attemptId: t.string()
}), t.discriminatedUnion("version", [
  t.object({
    version: t.literal("v1")
  }),
  t.object({
    version: t.literal("v2"),
    delayInMs: t.number().optional()
  })
]), t.object({
  version: t.literal("v1").default("v1"),
  runId: t.string()
});
t.object({
  contentHash: t.string(),
  projectRef: t.string(),
  envId: t.string(),
  runId: t.string(),
  attemptFriendlyId: t.string().optional(),
  attemptNumber: t.string().optional(),
  podName: t.string(),
  deploymentId: t.string(),
  deploymentVersion: t.string(),
  requiresCheckpointResumeWithMessage: t.string().optional()
});
t.object({
  supportsDynamicConfig: t.string().optional()
});
const Fi = "primary", Zi = t.enum([Fi]), Bi = t.object({
  text: t.string(),
  variant: t.string().optional(),
  url: t.string().optional()
}), Vi = t.object({
  items: t.array(Bi),
  style: t.enum(["codepath"]).optional()
});
t.object({
  icon: t.string().optional(),
  variant: Zi.optional(),
  accessory: Vi.optional()
}).default({
  icon: void 0,
  variant: void 0
});
const Wi = [
  t.object({
    $endsWith: t.string()
  }),
  t.object({
    $startsWith: t.string()
  }),
  t.object({
    $ignoreCaseEquals: t.string()
  })
], Yi = t.union([
  /** Match against a string */
  t.array(t.string()),
  /** Match against a number */
  t.array(t.number()),
  /** Match against a boolean */
  t.array(t.boolean()),
  t.array(t.union([
    ...Wi,
    t.object({
      $exists: t.boolean()
    }),
    t.object({
      $isNull: t.boolean()
    }),
    t.object({
      $anythingBut: t.union([t.string(), t.number(), t.boolean()])
    }),
    t.object({
      $anythingBut: t.union([t.array(t.string()), t.array(t.number()), t.array(t.boolean())])
    }),
    t.object({
      $gt: t.number()
    }),
    t.object({
      $lt: t.number()
    }),
    t.object({
      $gte: t.number()
    }),
    t.object({
      $lte: t.number()
    }),
    t.object({
      $between: t.tuple([t.number(), t.number()])
    }),
    t.object({
      $includes: t.union([t.string(), t.number(), t.boolean()])
    }),
    t.object({
      $not: t.union([t.string(), t.number(), t.boolean()])
    })
  ]))
]), Qn = t.lazy(() => t.record(t.union([Yi, Qn]))), zi = t.object({
  /** The `headers` strategy retries the request using info from the response headers. */
  strategy: t.literal("headers"),
  /** The header to use to determine the maximum number of times to retry the request. */
  limitHeader: t.string(),
  /** The header to use to determine the number of remaining retries. */
  remainingHeader: t.string(),
  /** The header to use to determine the time when the number of remaining retries will be reset. */
  resetHeader: t.string(),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: Qn.optional(),
  /** The format of the `resetHeader` value. */
  resetFormat: t.enum([
    "unix_timestamp",
    "unix_timestamp_in_ms",
    "iso_8601",
    "iso_8601_duration_openai_variant"
  ]).default("unix_timestamp").optional()
}), Hi = Re.extend({
  /** The `backoff` strategy retries the request with an exponential backoff. */
  strategy: t.literal("backoff"),
  /** The event filter to use to determine if the request should be retried. */
  bodyFilter: Qn.optional()
}), Ji = t.discriminatedUnion("strategy", [
  zi,
  Hi
]), Xi = t.record(t.string(), Ji);
t.object({
  /** The maximum time to wait for the request to complete. */
  durationInMs: t.number().optional(),
  retry: Re.optional()
});
t.object({
  /** The retrying strategy for specific status codes. */
  byStatus: Xi.optional(),
  /** The timeout options for the request. */
  timeout: Re.optional(),
  /**
   * The retrying strategy for connection errors.
   */
  connectionError: Re.optional()
});
const Qi = t.object({
  type: t.string().optional(),
  message: t.string().optional(),
  stacktrace: t.string().optional()
}), qi = t.object({
  name: t.literal("exception"),
  time: t.coerce.date(),
  properties: t.object({
    exception: Qi
  })
}), eo = t.object({
  name: t.literal("cancellation"),
  time: t.coerce.date(),
  properties: t.object({
    reason: t.string()
  })
}), to = t.object({
  name: t.string(),
  time: t.coerce.date(),
  properties: t.record(t.unknown())
}), no = t.union([qi, eo, to]);
t.array(no);
t.object({
  system: t.string().optional(),
  client_id: t.string().optional(),
  operation: t.enum(["publish", "create", "receive", "deliver"]),
  message: t.any(),
  destination: t.string().optional()
});
const ro = typeof globalThis == "object" ? globalThis : global, Gt = Symbol.for("dev.trigger.ts.api"), Kt = ro;
function J(n, e, r = !1) {
  const a = Kt[Gt] = Kt[Gt] ?? {};
  return !r && a[n] ? !1 : (a[n] = e, !0);
}
function ge(n) {
  var e;
  return (e = Kt[Gt]) == null ? void 0 : e[n];
}
function Ae(n) {
  const e = Kt[Gt];
  e && delete e[n];
}
const R = {
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
}, dn = "task-context";
var Pe, xt;
const Bt = class Bt {
  constructor() {
    F(this, Pe);
  }
  static getInstance() {
    return this._instance || (this._instance = new Bt()), this._instance;
  }
  get isInsideTask() {
    return p(this, Pe, xt).call(this) !== void 0;
  }
  get ctx() {
    var e;
    return (e = p(this, Pe, xt).call(this)) == null ? void 0 : e.ctx;
  }
  get worker() {
    var e;
    return (e = p(this, Pe, xt).call(this)) == null ? void 0 : e.worker;
  }
  get attributes() {
    return this.ctx ? {
      ...this.contextAttributes,
      ...this.workerAttributes
    } : {};
  }
  get workerAttributes() {
    return this.worker ? {
      [R.WORKER_ID]: this.worker.id,
      [R.WORKER_VERSION]: this.worker.version
    } : {};
  }
  get contextAttributes() {
    var e, r, a, s, i;
    return this.ctx ? {
      [R.ATTEMPT_ID]: this.ctx.attempt.id,
      [R.ATTEMPT_NUMBER]: this.ctx.attempt.number,
      [R.TASK_SLUG]: this.ctx.task.id,
      [R.TASK_PATH]: this.ctx.task.filePath,
      [R.TASK_EXPORT_NAME]: this.ctx.task.exportName,
      [R.QUEUE_NAME]: this.ctx.queue.name,
      [R.QUEUE_ID]: this.ctx.queue.id,
      [R.ENVIRONMENT_ID]: this.ctx.environment.id,
      [R.ENVIRONMENT_TYPE]: this.ctx.environment.type,
      [R.ORGANIZATION_ID]: this.ctx.organization.id,
      [R.PROJECT_ID]: this.ctx.project.id,
      [R.PROJECT_REF]: this.ctx.project.ref,
      [R.PROJECT_NAME]: this.ctx.project.name,
      [R.RUN_ID]: this.ctx.run.id,
      [R.RUN_IS_TEST]: this.ctx.run.isTest,
      [R.ORGANIZATION_SLUG]: this.ctx.organization.slug,
      [R.ORGANIZATION_NAME]: this.ctx.organization.name,
      [R.BATCH_ID]: (e = this.ctx.batch) == null ? void 0 : e.id,
      [R.IDEMPOTENCY_KEY]: this.ctx.run.idempotencyKey,
      [R.MACHINE_PRESET_NAME]: (r = this.ctx.machine) == null ? void 0 : r.name,
      [R.MACHINE_PRESET_CPU]: (a = this.ctx.machine) == null ? void 0 : a.cpu,
      [R.MACHINE_PRESET_MEMORY]: (s = this.ctx.machine) == null ? void 0 : s.memory,
      [R.MACHINE_PRESET_CENTS_PER_MS]: (i = this.ctx.machine) == null ? void 0 : i.centsPerMs
    } : {};
  }
  disable() {
    Ae(dn);
  }
  setGlobalTaskContext(e) {
    return J(dn, e);
  }
};
Pe = new WeakSet(), xt = function() {
  return ge(dn);
}, m(Bt, "_instance");
let Nn = Bt;
const P = Nn.getInstance(), ao = /[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u;
function so(n) {
  return n.length === 1 ? n[0].toString() : n.reduce((e, r) => {
    if (typeof r == "number")
      return e + "[" + r.toString() + "]";
    if (r.includes('"'))
      return e + '["' + io(r) + '"]';
    if (!ao.test(r))
      return e + '["' + r + '"]';
    const a = e.length === 0 ? "" : ".";
    return e + a + r;
  }, "");
}
function io(n) {
  return n.replace(/"/g, '\\"');
}
function oo(n) {
  return n.length !== 0;
}
const co = 99, uo = "; ", lo = ", or ", va = "Validation error", fo = ": ";
class ho extends Error {
  constructor(r, a = []) {
    super(r);
    m(this, "details");
    m(this, "name");
    this.details = a, this.name = "ZodValidationError";
  }
  toString() {
    return this.message;
  }
}
function ba(n, e, r) {
  if (n.code === "invalid_union")
    return n.unionErrors.reduce((a, s) => {
      const i = s.issues.map((o) => ba(o, e, r)).join(e);
      return a.includes(i) || a.push(i), a;
    }, []).join(r);
  if (oo(n.path)) {
    if (n.path.length === 1) {
      const a = n.path[0];
      if (typeof a == "number")
        return `${n.message} at index ${a}`;
    }
    return `${n.message} at "${so(n.path)}"`;
  }
  return n.message;
}
function po(n, e, r) {
  return e !== null ? n.length > 0 ? [e, n].join(r) : e : n.length > 0 ? n : va;
}
function go(n, e = {}) {
  const { maxIssuesInMessage: r = co, issueSeparator: a = uo, unionSeparator: s = lo, prefixSeparator: i = fo, prefix: o = va } = e, c = n.errors.slice(0, r).map((d) => ba(d, a, s)).join(a), u = po(c, o, i);
  return new ho(u, n.errors);
}
const Ta = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !0
};
function Ea(n, e) {
  const r = { ...Ta, ...n };
  if (e >= r.maxAttempts)
    return;
  const { factor: a, minTimeoutInMs: s, maxTimeoutInMs: i, randomize: o } = r, c = o ? Math.random() + 1 : 1, u = Math.min(i, c * s * Math.pow(a, e - 1));
  return Math.round(u);
}
class j extends Error {
  constructor(r, a, s, i) {
    super(`${j.makeMessage(r, a, s)}`);
    m(this, "status");
    m(this, "headers");
    m(this, "error");
    m(this, "code");
    m(this, "param");
    m(this, "type");
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
      return new Ra({ cause: Ao(a) });
    const o = a == null ? void 0 : a.error;
    return r === 400 ? new mo(r, o, s, i) : r === 401 ? new yo(r, o, s, i) : r === 403 ? new _o(r, o, s, i) : r === 404 ? new vo(r, o, s, i) : r === 409 ? new bo(r, o, s, i) : r === 422 ? new To(r, o, s, i) : r === 429 ? new Eo(r, o, s, i) : r >= 500 ? new Ro(r, o, s, i) : new j(r, o, s, i);
  }
}
class Ra extends j {
  constructor({ message: r, cause: a }) {
    super(void 0, void 0, r || "Connection error.", void 0);
    m(this, "status");
    a && (this.cause = a);
  }
}
class mo extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 400);
  }
}
class yo extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 401);
  }
}
class _o extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 403);
  }
}
class vo extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 404);
  }
}
class bo extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 409);
  }
}
class To extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 422);
  }
}
class Eo extends j {
  constructor() {
    super(...arguments);
    m(this, "status", 429);
  }
  get millisecondsUntilReset() {
    const r = (this.headers ?? {})["x-ratelimit-reset"];
    if (typeof r == "string") {
      const a = parseInt(r, 10);
      return isNaN(a) ? void 0 : Math.max(a - Date.now() + Math.floor(Math.random() * 2e3), 0);
    }
  }
}
class Ro extends j {
}
class Io extends j {
  constructor({ message: r, cause: a, status: s, rawBody: i, headers: o }) {
    super(s, void 0, r || "Validation error.", o);
    m(this, "status", 200);
    m(this, "rawBody");
    a && (this.cause = a), this.rawBody = i;
  }
}
function Ao(n) {
  return n instanceof Error ? n : new Error(n);
}
var So = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, _e = "1.9.0", br = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function ko(n) {
  var e = /* @__PURE__ */ new Set([n]), r = /* @__PURE__ */ new Set(), a = n.match(br);
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
      return u === n;
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
    var d = u.match(br);
    if (!d)
      return i(u);
    var l = {
      major: +d[1],
      minor: +d[2],
      patch: +d[3],
      prerelease: d[4]
    };
    return l.prerelease != null || s.major !== l.major ? i(u) : s.major === 0 ? s.minor === l.minor && s.patch <= l.patch ? o(u) : i(u) : s.minor <= l.minor ? o(u) : i(u);
  };
}
var xo = ko(_e), wo = _e.split(".")[0], gt = Symbol.for("opentelemetry.js.api." + wo), mt = So;
function rn(n, e, r, a) {
  var s;
  a === void 0 && (a = !1);
  var i = mt[gt] = (s = mt[gt]) !== null && s !== void 0 ? s : {
    version: _e
  };
  if (!a && i[n]) {
    var o = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + n);
    return r.error(o.stack || o.message), !1;
  }
  if (i.version !== _e) {
    var o = new Error("@opentelemetry/api: Registration of version v" + i.version + " for " + n + " does not match previously registered API v" + _e);
    return r.error(o.stack || o.message), !1;
  }
  return i[n] = e, r.debug("@opentelemetry/api: Registered a global for " + n + " v" + _e + "."), !0;
}
function $e(n) {
  var e, r, a = (e = mt[gt]) === null || e === void 0 ? void 0 : e.version;
  if (!(!a || !xo(a)))
    return (r = mt[gt]) === null || r === void 0 ? void 0 : r[n];
}
function an(n, e) {
  e.debug("@opentelemetry/api: Unregistering a global for " + n + " v" + _e + ".");
  var r = mt[gt];
  r && delete r[n];
}
var No = function(n, e) {
  var r = typeof Symbol == "function" && n[Symbol.iterator];
  if (!r) return n;
  var a = r.call(n), s, i = [], o;
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
}, Oo = function(n, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return n.concat(i || Array.prototype.slice.call(e));
}, Co = (
  /** @class */
  function() {
    function n(e) {
      this._namespace = e.namespace || "DiagComponentLogger";
    }
    return n.prototype.debug = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Be("debug", this._namespace, e);
    }, n.prototype.error = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Be("error", this._namespace, e);
    }, n.prototype.info = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Be("info", this._namespace, e);
    }, n.prototype.warn = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Be("warn", this._namespace, e);
    }, n.prototype.verbose = function() {
      for (var e = [], r = 0; r < arguments.length; r++)
        e[r] = arguments[r];
      return Be("verbose", this._namespace, e);
    }, n;
  }()
);
function Be(n, e, r) {
  var a = $e("diag");
  if (a)
    return r.unshift(e), a[n].apply(a, Oo([], No(r), !1));
}
var $;
(function(n) {
  n[n.NONE = 0] = "NONE", n[n.ERROR = 30] = "ERROR", n[n.WARN = 50] = "WARN", n[n.INFO = 60] = "INFO", n[n.DEBUG = 70] = "DEBUG", n[n.VERBOSE = 80] = "VERBOSE", n[n.ALL = 9999] = "ALL";
})($ || ($ = {}));
function Po(n, e) {
  n < $.NONE ? n = $.NONE : n > $.ALL && (n = $.ALL), e = e || {};
  function r(a, s) {
    var i = e[a];
    return typeof i == "function" && n >= s ? i.bind(e) : function() {
    };
  }
  return {
    error: r("error", $.ERROR),
    warn: r("warn", $.WARN),
    info: r("info", $.INFO),
    debug: r("debug", $.DEBUG),
    verbose: r("verbose", $.VERBOSE)
  };
}
var jo = function(n, e) {
  var r = typeof Symbol == "function" && n[Symbol.iterator];
  if (!r) return n;
  var a = r.call(n), s, i = [], o;
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
}, Mo = function(n, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return n.concat(i || Array.prototype.slice.call(e));
}, Uo = "diag", Ie = (
  /** @class */
  function() {
    function n() {
      function e(s) {
        return function() {
          for (var i = [], o = 0; o < arguments.length; o++)
            i[o] = arguments[o];
          var c = $e("diag");
          if (c)
            return c[s].apply(c, Mo([], jo(i), !1));
        };
      }
      var r = this, a = function(s, i) {
        var o, c, u;
        if (i === void 0 && (i = { logLevel: $.INFO }), s === r) {
          var d = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          return r.error((o = d.stack) !== null && o !== void 0 ? o : d.message), !1;
        }
        typeof i == "number" && (i = {
          logLevel: i
        });
        var l = $e("diag"), v = Po((c = i.logLevel) !== null && c !== void 0 ? c : $.INFO, s);
        if (l && !i.suppressOverrideMessage) {
          var T = (u = new Error().stack) !== null && u !== void 0 ? u : "<failed to generate stacktrace>";
          l.warn("Current logger will be overwritten from " + T), v.warn("Current logger will overwrite one already registered from " + T);
        }
        return rn("diag", v, r, !0);
      };
      r.setLogger = a, r.disable = function() {
        an(Uo, r);
      }, r.createComponentLogger = function(s) {
        return new Co(s);
      }, r.verbose = e("verbose"), r.debug = e("debug"), r.info = e("info"), r.warn = e("warn"), r.error = e("error");
    }
    return n.instance = function() {
      return this._instance || (this._instance = new n()), this._instance;
    }, n;
  }()
), Do = function(n, e) {
  var r = typeof Symbol == "function" && n[Symbol.iterator];
  if (!r) return n;
  var a = r.call(n), s, i = [], o;
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
}, $o = function(n) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && n[e], a = 0;
  if (r) return r.call(n);
  if (n && typeof n.length == "number") return {
    next: function() {
      return n && a >= n.length && (n = void 0), { value: n && n[a++], done: !n };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Lo = (
  /** @class */
  function() {
    function n(e) {
      this._entries = e ? new Map(e) : /* @__PURE__ */ new Map();
    }
    return n.prototype.getEntry = function(e) {
      var r = this._entries.get(e);
      if (r)
        return Object.assign({}, r);
    }, n.prototype.getAllEntries = function() {
      return Array.from(this._entries.entries()).map(function(e) {
        var r = Do(e, 2), a = r[0], s = r[1];
        return [a, s];
      });
    }, n.prototype.setEntry = function(e, r) {
      var a = new n(this._entries);
      return a._entries.set(e, r), a;
    }, n.prototype.removeEntry = function(e) {
      var r = new n(this._entries);
      return r._entries.delete(e), r;
    }, n.prototype.removeEntries = function() {
      for (var e, r, a = [], s = 0; s < arguments.length; s++)
        a[s] = arguments[s];
      var i = new n(this._entries);
      try {
        for (var o = $o(a), c = o.next(); !c.done; c = o.next()) {
          var u = c.value;
          i._entries.delete(u);
        }
      } catch (d) {
        e = { error: d };
      } finally {
        try {
          c && !c.done && (r = o.return) && r.call(o);
        } finally {
          if (e) throw e.error;
        }
      }
      return i;
    }, n.prototype.clear = function() {
      return new n();
    }, n;
  }()
);
Ie.instance();
function Go(n) {
  return n === void 0 && (n = {}), new Lo(new Map(Object.entries(n)));
}
function Ia(n) {
  return Symbol.for(n);
}
var Ko = (
  /** @class */
  /* @__PURE__ */ function() {
    function n(e) {
      var r = this;
      r._currentContext = e ? new Map(e) : /* @__PURE__ */ new Map(), r.getValue = function(a) {
        return r._currentContext.get(a);
      }, r.setValue = function(a, s) {
        var i = new n(r._currentContext);
        return i._currentContext.set(a, s), i;
      }, r.deleteValue = function(a) {
        var s = new n(r._currentContext);
        return s._currentContext.delete(a), s;
      };
    }
    return n;
  }()
), Fo = new Ko(), Zo = {
  get: function(n, e) {
    if (n != null)
      return n[e];
  },
  keys: function(n) {
    return n == null ? [] : Object.keys(n);
  }
}, Bo = {
  set: function(n, e, r) {
    n != null && (n[e] = r);
  }
}, Vo = function(n, e) {
  var r = typeof Symbol == "function" && n[Symbol.iterator];
  if (!r) return n;
  var a = r.call(n), s, i = [], o;
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
}, Wo = function(n, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return n.concat(i || Array.prototype.slice.call(e));
}, Yo = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.active = function() {
      return Fo;
    }, n.prototype.with = function(e, r, a) {
      for (var s = [], i = 3; i < arguments.length; i++)
        s[i - 3] = arguments[i];
      return r.call.apply(r, Wo([a], Vo(s), !1));
    }, n.prototype.bind = function(e, r) {
      return r;
    }, n.prototype.enable = function() {
      return this;
    }, n.prototype.disable = function() {
      return this;
    }, n;
  }()
), zo = function(n, e) {
  var r = typeof Symbol == "function" && n[Symbol.iterator];
  if (!r) return n;
  var a = r.call(n), s, i = [], o;
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
}, Ho = function(n, e, r) {
  if (r || arguments.length === 2) for (var a = 0, s = e.length, i; a < s; a++)
    (i || !(a in e)) && (i || (i = Array.prototype.slice.call(e, 0, a)), i[a] = e[a]);
  return n.concat(i || Array.prototype.slice.call(e));
}, ln = "context", Jo = new Yo(), sn = (
  /** @class */
  function() {
    function n() {
    }
    return n.getInstance = function() {
      return this._instance || (this._instance = new n()), this._instance;
    }, n.prototype.setGlobalContextManager = function(e) {
      return rn(ln, e, Ie.instance());
    }, n.prototype.active = function() {
      return this._getContextManager().active();
    }, n.prototype.with = function(e, r, a) {
      for (var s, i = [], o = 3; o < arguments.length; o++)
        i[o - 3] = arguments[o];
      return (s = this._getContextManager()).with.apply(s, Ho([e, r, a], zo(i), !1));
    }, n.prototype.bind = function(e, r) {
      return this._getContextManager().bind(e, r);
    }, n.prototype._getContextManager = function() {
      return $e(ln) || Jo;
    }, n.prototype.disable = function() {
      this._getContextManager().disable(), an(ln, Ie.instance());
    }, n;
  }()
), On;
(function(n) {
  n[n.NONE = 0] = "NONE", n[n.SAMPLED = 1] = "SAMPLED";
})(On || (On = {}));
var Aa = "0000000000000000", Sa = "00000000000000000000000000000000", Xo = {
  traceId: Sa,
  spanId: Aa,
  traceFlags: On.NONE
}, Qe = (
  /** @class */
  function() {
    function n(e) {
      e === void 0 && (e = Xo), this._spanContext = e;
    }
    return n.prototype.spanContext = function() {
      return this._spanContext;
    }, n.prototype.setAttribute = function(e, r) {
      return this;
    }, n.prototype.setAttributes = function(e) {
      return this;
    }, n.prototype.addEvent = function(e, r) {
      return this;
    }, n.prototype.addLink = function(e) {
      return this;
    }, n.prototype.addLinks = function(e) {
      return this;
    }, n.prototype.setStatus = function(e) {
      return this;
    }, n.prototype.updateName = function(e) {
      return this;
    }, n.prototype.end = function(e) {
    }, n.prototype.isRecording = function() {
      return !1;
    }, n.prototype.recordException = function(e, r) {
    }, n;
  }()
), qn = Ia("OpenTelemetry Context Key SPAN");
function er(n) {
  return n.getValue(qn) || void 0;
}
function Qo() {
  return er(sn.getInstance().active());
}
function tr(n, e) {
  return n.setValue(qn, e);
}
function qo(n) {
  return n.deleteValue(qn);
}
function ec(n, e) {
  return tr(n, new Qe(e));
}
function ka(n) {
  var e;
  return (e = er(n)) === null || e === void 0 ? void 0 : e.spanContext();
}
var tc = /^([0-9a-f]{32})$/i, nc = /^[0-9a-f]{16}$/i;
function rc(n) {
  return tc.test(n) && n !== Sa;
}
function ac(n) {
  return nc.test(n) && n !== Aa;
}
function xa(n) {
  return rc(n.traceId) && ac(n.spanId);
}
function sc(n) {
  return new Qe(n);
}
var fn = sn.getInstance(), wa = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.startSpan = function(e, r, a) {
      a === void 0 && (a = fn.active());
      var s = !!(r != null && r.root);
      if (s)
        return new Qe();
      var i = a && ka(a);
      return ic(i) && xa(i) ? new Qe(i) : new Qe();
    }, n.prototype.startActiveSpan = function(e, r, a, s) {
      var i, o, c;
      if (!(arguments.length < 2)) {
        arguments.length === 2 ? c = r : arguments.length === 3 ? (i = r, c = a) : (i = r, o = a, c = s);
        var u = o ?? fn.active(), d = this.startSpan(e, i, u), l = tr(u, d);
        return fn.with(l, c, void 0, d);
      }
    }, n;
  }()
);
function ic(n) {
  return typeof n == "object" && typeof n.spanId == "string" && typeof n.traceId == "string" && typeof n.traceFlags == "number";
}
var oc = new wa(), cc = (
  /** @class */
  function() {
    function n(e, r, a, s) {
      this._provider = e, this.name = r, this.version = a, this.options = s;
    }
    return n.prototype.startSpan = function(e, r, a) {
      return this._getTracer().startSpan(e, r, a);
    }, n.prototype.startActiveSpan = function(e, r, a, s) {
      var i = this._getTracer();
      return Reflect.apply(i.startActiveSpan, i, arguments);
    }, n.prototype._getTracer = function() {
      if (this._delegate)
        return this._delegate;
      var e = this._provider.getDelegateTracer(this.name, this.version, this.options);
      return e ? (this._delegate = e, this._delegate) : oc;
    }, n;
  }()
), uc = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.getTracer = function(e, r, a) {
      return new wa();
    }, n;
  }()
), dc = new uc(), Tr = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.getTracer = function(e, r, a) {
      var s;
      return (s = this.getDelegateTracer(e, r, a)) !== null && s !== void 0 ? s : new cc(this, e, r, a);
    }, n.prototype.getDelegate = function() {
      var e;
      return (e = this._delegate) !== null && e !== void 0 ? e : dc;
    }, n.prototype.setDelegate = function(e) {
      this._delegate = e;
    }, n.prototype.getDelegateTracer = function(e, r, a) {
      var s;
      return (s = this._delegate) === null || s === void 0 ? void 0 : s.getTracer(e, r, a);
    }, n;
  }()
), yt;
(function(n) {
  n[n.INTERNAL = 0] = "INTERNAL", n[n.SERVER = 1] = "SERVER", n[n.CLIENT = 2] = "CLIENT", n[n.PRODUCER = 3] = "PRODUCER", n[n.CONSUMER = 4] = "CONSUMER";
})(yt || (yt = {}));
var Ft;
(function(n) {
  n[n.UNSET = 0] = "UNSET", n[n.OK = 1] = "OK", n[n.ERROR = 2] = "ERROR";
})(Ft || (Ft = {}));
var wt = sn.getInstance(), lc = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.inject = function(e, r) {
    }, n.prototype.extract = function(e, r) {
      return e;
    }, n.prototype.fields = function() {
      return [];
    }, n;
  }()
), nr = Ia("OpenTelemetry Baggage Key");
function Na(n) {
  return n.getValue(nr) || void 0;
}
function fc() {
  return Na(sn.getInstance().active());
}
function hc(n, e) {
  return n.setValue(nr, e);
}
function pc(n) {
  return n.deleteValue(nr);
}
var hn = "propagation", gc = new lc(), mc = (
  /** @class */
  function() {
    function n() {
      this.createBaggage = Go, this.getBaggage = Na, this.getActiveBaggage = fc, this.setBaggage = hc, this.deleteBaggage = pc;
    }
    return n.getInstance = function() {
      return this._instance || (this._instance = new n()), this._instance;
    }, n.prototype.setGlobalPropagator = function(e) {
      return rn(hn, e, Ie.instance());
    }, n.prototype.inject = function(e, r, a) {
      return a === void 0 && (a = Bo), this._getGlobalPropagator().inject(e, r, a);
    }, n.prototype.extract = function(e, r, a) {
      return a === void 0 && (a = Zo), this._getGlobalPropagator().extract(e, r, a);
    }, n.prototype.fields = function() {
      return this._getGlobalPropagator().fields();
    }, n.prototype.disable = function() {
      an(hn, Ie.instance());
    }, n.prototype._getGlobalPropagator = function() {
      return $e(hn) || gc;
    }, n;
  }()
), Oa = mc.getInstance(), pn = "trace", yc = (
  /** @class */
  function() {
    function n() {
      this._proxyTracerProvider = new Tr(), this.wrapSpanContext = sc, this.isSpanContextValid = xa, this.deleteSpan = qo, this.getSpan = er, this.getActiveSpan = Qo, this.getSpanContext = ka, this.setSpan = tr, this.setSpanContext = ec;
    }
    return n.getInstance = function() {
      return this._instance || (this._instance = new n()), this._instance;
    }, n.prototype.setGlobalTracerProvider = function(e) {
      var r = rn(pn, this._proxyTracerProvider, Ie.instance());
      return r && this._proxyTracerProvider.setDelegate(e), r;
    }, n.prototype.getTracerProvider = function() {
      return $e(pn) || this._proxyTracerProvider;
    }, n.prototype.getTracer = function(e, r) {
      return this.getTracerProvider().getTracer(e, r);
    }, n.prototype.disable = function() {
      an(pn, Ie.instance()), this._proxyTracerProvider = new Tr();
    }, n;
  }()
), _c = yc.getInstance();
const gn = "$@null((", vc = "$@circular((";
function Cn(n, e, r = /* @__PURE__ */ new WeakSet()) {
  const a = {};
  if (n === void 0)
    return a;
  if (n === null)
    return a[e || ""] = gn, a;
  if (typeof n == "string" || typeof n == "number" || typeof n == "boolean")
    return a[e || ""] = n, a;
  if (n instanceof Date)
    return a[e || ""] = n.toISOString(), a;
  if (n !== null && typeof n == "object" && r.has(n))
    return a[e || ""] = vc, a;
  n !== null && typeof n == "object" && r.add(n);
  for (const [s, i] of Object.entries(n)) {
    const o = `${e ? `${e}.` : ""}${Array.isArray(n) ? `[${s}]` : s}`;
    if (Array.isArray(i))
      for (let c = 0; c < i.length; c++)
        typeof i[c] == "object" && i[c] !== null ? Object.assign(a, Cn(i[c], `${o}.[${c}]`, r)) : i[c] === null ? a[`${o}.[${c}]`] = gn : a[`${o}.[${c}]`] = i[c];
    else bc(i) ? Object.assign(a, Cn(i, o, r)) : typeof i == "number" || typeof i == "string" || typeof i == "boolean" ? a[o] = i : i === null && (a[o] = gn);
  }
  return a;
}
function bc(n) {
  return n !== null && typeof n == "object" && !Array.isArray(n);
}
function _t(n) {
  return Cn(n, R.STYLE_ACCESSORY);
}
class Tc {
  constructor(e, r, a) {
    m(this, "pageFetcher");
    m(this, "data");
    m(this, "pagination");
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
class Ec {
  constructor(e, r, a) {
    m(this, "pageFetcher");
    m(this, "data");
    m(this, "pagination");
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
const Ca = {
  maxAttempts: 3,
  factor: 2,
  minTimeoutInMs: 1e3,
  maxTimeoutInMs: 6e4,
  randomize: !1
};
function N(n, e, r, a) {
  return new ar(rr(n, e, r, a));
}
function Pn(n, e, r, a, s) {
  const i = new URLSearchParams(r.query);
  r.limit && i.set("page[size]", String(r.limit)), r.after && i.set("page[after]", r.after), r.before && i.set("page[before]", r.before);
  const o = t.object({
    data: t.array(n),
    pagination: t.object({
      next: t.string().optional(),
      previous: t.string().optional()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = rr(o, c.href, a, s);
  return new wc(u, n, e, r, a, s);
}
function Pa(n, e, r, a, s) {
  const i = new URLSearchParams(r.query);
  r.limit && i.set("perPage", String(r.limit)), r.page && i.set("page", String(r.page));
  const o = t.object({
    data: t.array(n),
    pagination: t.object({
      currentPage: t.coerce.number(),
      totalPages: t.coerce.number(),
      count: t.coerce.number()
    })
  }), c = new URL(e);
  c.search = i.toString();
  const u = rr(o, c.href, a, s);
  return new Nc(u, n, e, r, a, s);
}
async function Rc(n, e) {
  var i, o, c;
  if (!((i = n.options) != null && i.tracer))
    return e();
  const r = new URL(n.url), a = ((o = n.requestInit) == null ? void 0 : o.method) ?? "GET", s = n.options.name ?? `${a} ${r.pathname}`;
  return await n.options.tracer.startActiveSpan(s, async (u) => await e(u), {
    attributes: {
      [R.STYLE_ICON]: ((c = n.options) == null ? void 0 : c.icon) ?? "api",
      ...n.options.attributes
    }
  });
}
async function rr(n, e, r, a) {
  let s = await r;
  return Rc({ url: e, requestInit: s, options: a }, async (i) => {
    s = Oc(s);
    const o = await jn(n, e, s, a);
    return a != null && a.onResponseBody && i && a.onResponseBody(o.data, i), o;
  });
}
async function jn(n, e, r, a, s = 1) {
  try {
    const i = await fetch(e, xc(r)), o = kc(i.headers);
    if (!i.ok) {
      const l = Ac(i, s, a == null ? void 0 : a.retry);
      if (l.retry)
        return await Rr(e, s + 1, l.delay, a, r, i), await jn(n, e, r, a, s + 1);
      {
        const v = await i.text().catch((G) => Er(G).message), T = Sc(v), M = T ? void 0 : v;
        throw j.generate(i.status, T, M, o);
      }
    }
    const c = await Ic(i), u = n.safeParse(c);
    if (u.success)
      return { data: u.data, response: i };
    const d = go(u.error);
    throw new Io({
      status: i.status,
      cause: d,
      message: d.message,
      rawBody: c,
      headers: o
    });
  } catch (i) {
    if (i instanceof j)
      throw i;
    if (a != null && a.retry) {
      const o = { ...Ca, ...a.retry }, c = Ea(o, s);
      if (c)
        return await Rr(e, s + 1, c, a, r), await jn(n, e, r, a, s + 1);
    }
    throw new Ra({ cause: Er(i) });
  }
}
async function Ic(n) {
  try {
    return await n.clone().json();
  } catch {
    return;
  }
}
function Er(n) {
  return n instanceof Error ? n : new Error(n);
}
function Ac(n, e, r) {
  function a() {
    const i = { ...Ca, ...r }, o = Ea(i, e);
    return o ? { retry: !0, delay: o } : { retry: !1 };
  }
  const s = n.headers.get("x-should-retry");
  if (s === "true")
    return a();
  if (s === "false")
    return { retry: !1 };
  if (n.status === 408 || n.status === 409)
    return a();
  if (n.status === 429) {
    if (e >= (typeof (r == null ? void 0 : r.maxAttempts) == "number" ? r == null ? void 0 : r.maxAttempts : 3))
      return { retry: !1 };
    const i = n.headers.get("x-ratelimit-reset");
    if (i) {
      const c = parseInt(i, 10) - Date.now() + Math.floor(Math.random() * 1e3);
      if (c > 0)
        return { retry: !0, delay: c };
    }
    return a();
  }
  return n.status >= 500 ? a() : { retry: !1 };
}
function Sc(n) {
  try {
    return JSON.parse(n);
  } catch {
    return;
  }
}
function kc(n) {
  return new Proxy(Object.fromEntries(
    // @ts-ignore
    n.entries()
  ), {
    get(e, r) {
      const a = r.toString();
      return e[a.toLowerCase()] || e[a];
    }
  });
}
function xc(n) {
  try {
    const e = {
      ...n,
      cache: "no-cache"
    }, r = new Request("http://localhost", e);
    return e;
  } catch {
    return n ?? {};
  }
}
class ar extends Promise {
  constructor(r) {
    super((a) => {
      a(null);
    });
    m(this, "responsePromise");
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
var Vt, ja;
class wc extends ar {
  constructor(r, a, s, i, o, c) {
    super(r.then((u) => ({
      data: new Tc(u.data.data, u.data.pagination, p(this, Vt, ja).bind(this)),
      response: u.response
    })));
    F(this, Vt);
    m(this, "schema");
    m(this, "url");
    m(this, "params");
    m(this, "requestInit");
    m(this, "options");
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
Vt = new WeakSet(), ja = function(r) {
  return Pn(this.schema, this.url, { ...this.params, ...r }, this.requestInit, this.options);
};
var Wt, Ma;
class Nc extends ar {
  constructor(r, a, s, i, o, c) {
    super(r.then((u) => ({
      data: new Ec(u.data.data, u.data.pagination, p(this, Wt, Ma).bind(this)),
      response: u.response
    })));
    F(this, Wt);
    m(this, "schema");
    m(this, "url");
    m(this, "params");
    m(this, "requestInit");
    m(this, "options");
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
Wt = new WeakSet(), Ma = function(r) {
  return Pa(this.schema, this.url, { ...this.params, ...r }, this.requestInit, this.options);
};
async function Rr(n, e, r, a, s, i) {
  if (a != null && a.tracer) {
    const o = (s == null ? void 0 : s.method) ?? "GET";
    return a.tracer.startActiveSpan(i ? `wait after ${i.status}` : "wait after error", async (c) => {
      await new Promise((u) => setTimeout(u, r));
    }, {
      attributes: {
        [R.STYLE_ICON]: "wait",
        ..._t({
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
function Oc(n) {
  const e = new Headers(n == null ? void 0 : n.headers);
  if (e.get("x-trigger-worker") !== "true")
    return n;
  const r = Object.fromEntries(e.entries());
  return Oa.inject(wt.active(), r), {
    ...n,
    headers: new Headers(r)
  };
}
const Ve = {
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
function Cc(n) {
  switch (n.type) {
    case "BUILT_IN_ERROR": {
      const e = new Error(n.message);
      return e.name = n.name, e.stack = n.stackTrace, e;
    }
    case "STRING_ERROR":
      return n.raw;
    case "CUSTOM_ERROR":
      return JSON.parse(n.raw);
    case "INTERNAL_ERROR": {
      const e = new Error(n.message ?? `Internal error (${n.code})`);
      return e.name = n.code, e.stack = n.stackTrace, e;
    }
  }
}
function Pc(n) {
  const e = Mc(n);
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
const jc = {
  TASK_PROCESS_OOM_KILLED: {
    message: "Your task ran out of memory. Try increasing the machine specs. If this doesn't fix it there might be a memory leak.",
    link: {
      name: "Machines",
      href: Ve.docs.machines.home
    }
  },
  TASK_PROCESS_MAYBE_OOM_KILLED: {
    message: "We think your task ran out of memory, but we can't be certain. If this keeps happening, try increasing the machine specs.",
    link: {
      name: "Machines",
      href: Ve.docs.machines.home
    }
  },
  TASK_PROCESS_SIGSEGV: {
    message: "Your task crashed with a segmentation fault (SIGSEGV). Most likely there's a bug in a package or binary you're using. If this keeps happening and you're unsure why, please get in touch.",
    link: {
      name: "Contact us",
      href: Ve.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  TASK_PROCESS_SIGTERM: {
    message: "Your task exited after receiving SIGTERM but we don't know why. If this keeps happening, please get in touch so we can investigate.",
    link: {
      name: "Contact us",
      href: Ve.site.contact,
      magic: "CONTACT_FORM"
    }
  },
  OUTDATED_SDK_VERSION: {
    message: "Your task is using an outdated version of the SDK. Please upgrade to the latest version.",
    link: {
      name: "Beta upgrade guide",
      href: Ve.docs.upgrade.beta
    }
  }
}, Y = (n) => ({
  type: "INTERNAL_ERROR",
  code: n,
  ...jc[n]
}), Ir = (n, e = 100) => {
  if (!n)
    return;
  const r = e ? n.slice(0, e) : n;
  return r.includes("SIGTERM") ? "SIGTERM" : r.includes("SIGSEGV") ? "SIGSEGV" : r.includes("SIGKILL") ? "SIGKILL" : void 0;
};
function Mc(n) {
  switch (n.type) {
    case "BUILT_IN_ERROR": {
      if (n.name === "UnexpectedExitError" && n.message.startsWith("Unexpected exit with code -1"))
        switch (Ir(n.stackTrace)) {
          case "SIGTERM":
            return {
              ...Y("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...Y("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...Y("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...Y("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: n.message,
              stackTrace: n.stackTrace
            };
        }
      if (n.name === "Error" && n.message === "ffmpeg was killed with signal SIGKILL")
        return {
          ...Y("TASK_PROCESS_OOM_KILLED")
        };
      break;
    }
    case "STRING_ERROR":
      break;
    case "CUSTOM_ERROR":
      break;
    case "INTERNAL_ERROR": {
      if (n.code === zr.TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE)
        switch (Ir(n.message)) {
          case "SIGTERM":
            return {
              ...Y("TASK_PROCESS_SIGTERM")
            };
          case "SIGSEGV":
            return {
              ...Y("TASK_PROCESS_SIGSEGV")
            };
          case "SIGKILL":
            return {
              ...Y("TASK_PROCESS_MAYBE_OOM_KILLED")
            };
          default:
            return {
              ...Y("TASK_PROCESS_EXITED_WITH_NON_ZERO_CODE"),
              message: n.message,
              stackTrace: n.stackTrace
            };
        }
      return {
        ...n,
        ...Y(n.code)
      };
    }
  }
  return n;
}
function qe(n, e) {
  return typeof process < "u" && typeof process.env == "object" && process.env !== null ? process.env[n] ?? e : e;
}
const We = "api-client";
class Uc extends Error {
  constructor(e) {
    super(e), this.name = "ApiClientMissingError";
  }
}
var je, Nt;
const Yt = class Yt {
  constructor() {
    F(this, je);
  }
  static getInstance() {
    return this._instance || (this._instance = new Yt()), this._instance;
  }
  disable() {
    Ae(We);
  }
  get baseURL() {
    const e = p(this, je, Nt).call(this);
    return (e == null ? void 0 : e.baseURL) ?? qe("TRIGGER_API_URL") ?? "https://api.trigger.dev";
  }
  get accessToken() {
    const e = p(this, je, Nt).call(this);
    return (e == null ? void 0 : e.secretKey) ?? (e == null ? void 0 : e.accessToken) ?? qe("TRIGGER_SECRET_KEY") ?? qe("TRIGGER_ACCESS_TOKEN");
  }
  get client() {
    if (!(!this.baseURL || !this.accessToken))
      return new xr(this.baseURL, this.accessToken);
  }
  clientOrThrow() {
    if (!this.baseURL || !this.accessToken)
      throw new Uc(this.apiClientMissingError());
    return new xr(this.baseURL, this.accessToken);
  }
  runWithConfig(e, r) {
    const a = p(this, je, Nt).call(this), s = { ...a, ...e };
    return J(We, s, !0), r().finally(() => {
      J(We, a, !0);
    });
  }
  setGlobalAPIClientConfiguration(e) {
    return J(We, e);
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
je = new WeakSet(), Nt = function() {
  return ge(We);
}, m(Yt, "_instance");
let Mn = Yt;
const Rt = Mn.getInstance();
async function sr(n) {
  if (n.data)
    switch (n.dataType) {
      case "application/json":
        return JSON.parse(n.data);
      case "application/super+json":
        const { parse: e } = await Da();
        return e(n.data);
      case "text/plain":
        return n.data;
      case "application/store":
        throw new Error(`Cannot parse an application/store packet (${n.data}). Needs to be imported first.`);
      default:
        return n.data;
    }
}
async function Dc(n, e) {
  const r = await Ua(n, void 0, e);
  return await sr(r);
}
async function on(n) {
  if (n === void 0)
    return { dataType: "application/json" };
  if (typeof n == "string")
    return { data: n, dataType: "text/plain" };
  try {
    const { stringify: e } = await Da();
    return { data: e(n), dataType: "application/super+json" };
  } catch {
    return { data: n, dataType: "application/json" };
  }
}
const $c = {
  minTimeoutInMs: 500,
  maxTimeoutInMs: 5e3,
  maxAttempts: 5,
  factor: 2,
  randomize: !0
};
async function Ua(n, e, r) {
  return n.dataType !== "application/store" ? n : e ? await e.startActiveSpan("store.downloadPayload", async (s) => await Ar(n, s, r), {
    attributes: {
      [R.STYLE_ICON]: "cloud-download"
    }
  }) ?? n : await Ar(n, void 0, r);
}
async function Ar(n, e, r) {
  if (!n.data)
    return n;
  const a = r ?? Rt.client;
  if (!a)
    return n;
  const s = await a.getPayloadUrl(n.data), i = await N(t.any(), s.presignedUrl, void 0, {
    retry: $c
  }).asResponse();
  if (!i.ok)
    throw new Error(`Failed to import packet ${s.presignedUrl}: ${i.statusText}`);
  const o = await i.text();
  return e == null || e.setAttribute("size", Buffer.byteLength(o, "utf8")), {
    data: o,
    dataType: i.headers.get("content-type") ?? "application/json"
  };
}
async function Da() {
  const n = await import("./index-5RTI5hVe.js");
  return n.registerCustom({
    isApplicable: (e) => typeof Buffer == "function" && Buffer.isBuffer(e),
    serialize: (e) => [...e],
    deserialize: (e) => Buffer.from(e)
  }, "buffer"), n;
}
async function Lc(n, e, r, a) {
  const { ShapeStream: s, Shape: i, FetchError: o } = await import("./index-BjV8Sln9.js"), c = new s({
    url: e,
    headers: {
      ...a == null ? void 0 : a.headers,
      "x-trigger-electric-version": "0.8.1"
    },
    fetchClient: a == null ? void 0 : a.fetchClient,
    signal: a == null ? void 0 : a.signal
  });
  try {
    const u = new i(c), d = await u.rows;
    for (const l of d)
      await r(n.parse(l));
    return u.subscribe(async (l) => {
      for (const v of l.rows)
        await r(n.parse(v));
    });
  } catch (u) {
    throw u instanceof o ? j.generate(u.status, u.json, u.message, u.headers) : u;
  }
}
function Sr(n, e) {
  const r = n.pipeThrough(new TransformStream(e));
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
var Gc = Object.defineProperty, Kc = (n, e, r) => e in n ? Gc(n, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[e] = r, At = (n, e, r) => Kc(n, typeof e != "symbol" ? e + "" : e, r);
class kr extends Error {
  constructor(e, r) {
    super(e), At(this, "type"), At(this, "field"), At(this, "value"), At(this, "line"), this.name = "ParseError", this.type = r.type, this.field = r.field, this.value = r.value, this.line = r.line;
  }
}
function mn(n) {
}
function Fc(n) {
  const { onEvent: e = mn, onError: r = mn, onRetry: a = mn, onComment: s } = n;
  let i = "", o = !0, c, u = "", d = "";
  function l(w) {
    const C = o ? w.replace(/^\xEF\xBB\xBF/, "") : w, [K, q] = Zc(`${i}${C}`);
    for (const ee of K)
      v(ee);
    i = q, o = !1;
  }
  function v(w) {
    if (w === "") {
      M();
      return;
    }
    if (w.startsWith(":")) {
      s && s(w.slice(w.startsWith(": ") ? 2 : 1));
      return;
    }
    const C = w.indexOf(":");
    if (C !== -1) {
      const K = w.slice(0, C), q = w[C + 1] === " " ? 2 : 1, ee = w.slice(C + q);
      T(K, ee, w);
      return;
    }
    T(w, "", w);
  }
  function T(w, C, K) {
    switch (w) {
      case "event":
        d = C;
        break;
      case "data":
        u = `${u}${C}
`;
        break;
      case "id":
        c = C.includes("\0") ? void 0 : C;
        break;
      case "retry":
        /^\d+$/.test(C) ? a(parseInt(C, 10)) : r(
          new kr(`Invalid \`retry\` value: "${C}"`, {
            type: "invalid-retry",
            value: C,
            line: K
          })
        );
        break;
      default:
        r(
          new kr(
            `Unknown field "${w.length > 20 ? `${w.slice(0, 20)}…` : w}"`,
            { type: "unknown-field", field: w, value: C, line: K }
          )
        );
        break;
    }
  }
  function M() {
    u.length > 0 && e({
      id: c,
      event: d || void 0,
      // If the data buffer's last character is a U+000A LINE FEED (LF) character,
      // then remove the last character from the data buffer.
      data: u.endsWith(`
`) ? u.slice(0, -1) : u
    }), c = void 0, u = "", d = "";
  }
  function G(w = {}) {
    i && w.consume && v(i), c = void 0, u = "", d = "", i = "";
  }
  return { feed: l, reset: G };
}
function Zc(n) {
  const e = [];
  let r = "";
  const a = n.length;
  for (let s = 0; s < a; s++) {
    const i = n[s];
    i === "\r" && n[s + 1] === `
` ? (e.push(r), r = "", s++) : i === "\r" || i === `
` ? (e.push(r), r = "") : r += i;
  }
  return [e, r];
}
class Bc extends TransformStream {
  constructor({ onError: e, onRetry: r, onComment: a } = {}) {
    let s;
    super({
      start(i) {
        s = Fc({
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
function yn(n, e) {
  const r = {
    provider: {
      async onShape(a) {
        return Lc(Oi, n, a, e);
      }
    },
    streamFactory: new Wc(qe("TRIGGER_STREAM_URL", qe("TRIGGER_API_URL")) ?? "https://api.trigger.dev", {
      headers: e == null ? void 0 : e.headers,
      signal: e == null ? void 0 : e.signal
    }),
    ...e
  };
  return new Yc(r);
}
class Vc {
  constructor(e, r) {
    m(this, "url");
    m(this, "options");
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
        throw j.generate(e.status, {}, "Could not subscribe to stream", Object.fromEntries(e.headers));
      if (!e.body)
        throw new Error("No response body");
      return e.body.pipeThrough(new TextDecoderStream()).pipeThrough(new Bc()).pipeThrough(new TransformStream({
        transform(r, a) {
          a.enqueue(Hc(r.data));
        }
      }));
    });
  }
}
class Wc {
  constructor(e, r) {
    m(this, "baseUrl");
    m(this, "options");
    this.baseUrl = e, this.options = r;
  }
  createSubscription(e, r, a) {
    if (!e || !r)
      throw new Error("runId and streamKey are required");
    const s = `${a ?? this.baseUrl}/realtime/v1/streams/${e}/${r}`;
    return new Vc(s, this.options);
  }
}
class Yc {
  constructor(e) {
    m(this, "options");
    m(this, "abortController");
    m(this, "unsubscribeShape");
    m(this, "stream");
    m(this, "packetCache", /* @__PURE__ */ new Map());
    m(this, "_closeOnComplete");
    m(this, "_isRunComplete", !1);
    this.options = e, this.abortController = new AbortController(), this._closeOnComplete = typeof e.closeOnComplete > "u" ? !0 : e.closeOnComplete;
    const r = new ReadableStream({
      start: async (a) => {
        this.unsubscribeShape = await this.options.provider.onShape(async (s) => {
          a.enqueue(s), this._isRunComplete = !!s.completedAt, this._closeOnComplete && this._isRunComplete && !this.abortController.signal.aborted && (a.close(), this.abortController.abort());
        });
      },
      cancel: () => {
        this.unsubscribe();
      }
    });
    this.stream = Sr(r, {
      transform: async (a, s) => {
        const i = await this.transformRunShape(a);
        s.enqueue(i);
      }
    });
  }
  unsubscribe() {
    var e;
    this.abortController.signal.aborted || this.abortController.abort(), (e = this.unsubscribeShape) == null || e.call(this);
  }
  [Symbol.asyncIterator]() {
    return this.stream[Symbol.asyncIterator]();
  }
  getReader() {
    return this.stream.getReader();
  }
  withStreams() {
    const e = /* @__PURE__ */ new Set();
    return Sr(this.stream, {
      transform: async (r, a) => {
        var s;
        if (a.enqueue({
          type: "run",
          run: r
        }), r.metadata && "$$streams" in r.metadata && Array.isArray(r.metadata.$$streams))
          for (const i of r.metadata.$$streams)
            typeof i == "string" && (e.has(i) || (e.add(i), (await this.options.streamFactory.createSubscription(r.id, i, (s = this.options.client) == null ? void 0 : s.baseUrl).subscribe()).pipeThrough(new TransformStream({
              transform(u, d) {
                d.enqueue({
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
            })));
      }
    });
  }
  async transformRunShape(e) {
    const r = e.payloadType ? { data: e.payload ?? void 0, dataType: e.payloadType } : void 0, a = e.outputType ? { data: e.output ?? void 0, dataType: e.outputType } : void 0, [s, i] = await Promise.all([
      { packet: r, key: "payload" },
      { packet: a, key: "output" }
    ].map(async ({ packet: c, key: u }) => {
      if (!c)
        return;
      const d = this.packetCache.get(`${e.friendlyId}/${u}`);
      if (typeof d < "u")
        return d;
      const l = await Dc(c, this.options.client);
      return this.packetCache.set(`${e.friendlyId}/${u}`, l), l;
    })), o = e.metadata && e.metadataType ? await sr({ data: e.metadata, dataType: e.metadataType }) : void 0;
    return {
      id: e.friendlyId,
      payload: s,
      output: i,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      taskIdentifier: e.taskIdentifier,
      number: e.number,
      status: zc(e.status),
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
      error: e.error ? Pc(e.error) : void 0,
      isTest: e.isTest,
      metadata: o
    };
  }
}
function zc(n) {
  switch (n) {
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
      throw new Error(`Unknown status: ${n}`);
  }
}
function Hc(n) {
  try {
    return JSON.parse(n);
  } catch {
    return n;
  }
}
const Jc = {
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 1e3,
    maxTimeoutInMs: 3e4,
    factor: 1.6,
    randomize: !1
  }
};
var A, k, Ot;
class xr {
  constructor(e, r, a = {}) {
    F(this, A);
    m(this, "baseUrl");
    m(this, "accessToken");
    m(this, "defaultRequestOptions");
    this.accessToken = r, this.baseUrl = e.replace(/\/$/, ""), this.defaultRequestOptions = x(Jc, a);
  }
  get fetchClient() {
    const e = p(this, A, k).call(this, !1);
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
  async getRunResult(e, r) {
    try {
      return await N(W, `${this.baseUrl}/api/v1/runs/${e}/result`, {
        method: "GET",
        headers: p(this, A, k).call(this, !1)
      }, x(this.defaultRequestOptions, r));
    } catch (a) {
      if (a instanceof j && a.status === 404)
        return;
      throw a;
    }
  }
  async getBatchResults(e, r) {
    return await N(si, `${this.baseUrl}/api/v1/batches/${e}/results`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  triggerTask(e, r, a, s) {
    const i = encodeURIComponent(e);
    return N(gi, `${this.baseUrl}/api/v1/tasks/${i}/trigger`, {
      method: "POST",
      headers: p(this, A, k).call(this, (a == null ? void 0 : a.spanParentAsLink) ?? !1),
      body: JSON.stringify(r)
    }, x(this.defaultRequestOptions, s)).withResponse().then(async ({ response: o, data: c }) => {
      var T;
      const u = o.headers.get("x-trigger-jwt");
      if (typeof u == "string")
        return {
          ...c,
          publicAccessToken: u
        };
      const d = o.headers.get("x-trigger-jwt-claims"), l = d ? JSON.parse(d) : void 0, v = await fr({
        secretKey: this.accessToken,
        payload: {
          ...l,
          scopes: [`read:runs:${c.id}`]
        },
        expirationTime: ((T = s == null ? void 0 : s.publicAccessToken) == null ? void 0 : T.expirationTime) ?? "1h"
      });
      return {
        ...c,
        publicAccessToken: v
      };
    });
  }
  batchTriggerV2(e, r, a) {
    return N(yi, `${this.baseUrl}/api/v1/tasks/batch`, {
      method: "POST",
      headers: p(this, A, k).call(this, (r == null ? void 0 : r.spanParentAsLink) ?? !1, {
        "idempotency-key": r == null ? void 0 : r.idempotencyKey,
        "idempotency-key-ttl": r == null ? void 0 : r.idempotencyKeyTTL
      }),
      body: JSON.stringify(e)
    }, x(this.defaultRequestOptions, a)).withResponse().then(async ({ response: s, data: i }) => {
      var d;
      const o = s.headers.get("x-trigger-jwt-claims"), c = o ? JSON.parse(o) : void 0, u = await fr({
        secretKey: this.accessToken,
        payload: {
          ...c,
          scopes: [`read:batch:${i.id}`]
        },
        expirationTime: ((d = a == null ? void 0 : a.publicAccessToken) == null ? void 0 : d.expirationTime) ?? "1h"
      });
      return {
        ...i,
        publicAccessToken: u
      };
    });
  }
  createUploadPayloadUrl(e, r) {
    return N(mr, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "PUT",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  getPayloadUrl(e, r) {
    return N(mr, `${this.baseUrl}/api/v1/packets/${e}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  retrieveRun(e, r) {
    return N(yr, `${this.baseUrl}/api/v3/runs/${e}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  listRuns(e, r) {
    const a = wr(e);
    return Pn(wn, `${this.baseUrl}/api/v1/runs`, {
      query: a,
      limit: e == null ? void 0 : e.limit,
      after: e == null ? void 0 : e.after,
      before: e == null ? void 0 : e.before
    }, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  listProjectRuns(e, r, a) {
    const s = wr(r);
    return r != null && r.env && s.append("filter[env]", Array.isArray(r.env) ? r.env.join(",") : r.env), Pn(wn, `${this.baseUrl}/api/v1/projects/${e}/runs`, {
      query: s,
      limit: r == null ? void 0 : r.limit,
      after: r == null ? void 0 : r.after,
      before: r == null ? void 0 : r.before
    }, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, a));
  }
  replayRun(e, r) {
    return N(vi, `${this.baseUrl}/api/v1/runs/${e}/replay`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  cancelRun(e, r) {
    return N(bi, `${this.baseUrl}/api/v2/runs/${e}/cancel`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  rescheduleRun(e, r, a) {
    return N(yr, `${this.baseUrl}/api/v1/runs/${e}/reschedule`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(r)
    }, x(this.defaultRequestOptions, a));
  }
  addTags(e, r, a) {
    return N(t.object({ message: t.string() }), `${this.baseUrl}/api/v1/runs/${e}/tags`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(r)
    }, x(this.defaultRequestOptions, a));
  }
  createSchedule(e, r) {
    return N(me, `${this.baseUrl}/api/v1/schedules`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(e)
    }, x(this.defaultRequestOptions, r));
  }
  listSchedules(e, r) {
    const a = new URLSearchParams();
    return e != null && e.page && a.append("page", e.page.toString()), e != null && e.perPage && a.append("perPage", e.perPage.toString()), Pa(me, `${this.baseUrl}/api/v1/schedules`, {
      page: e == null ? void 0 : e.page,
      limit: e == null ? void 0 : e.perPage
    }, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  retrieveSchedule(e, r) {
    return N(me, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  updateSchedule(e, r, a) {
    return N(me, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "PUT",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(r)
    }, x(this.defaultRequestOptions, a));
  }
  deactivateSchedule(e, r) {
    return N(me, `${this.baseUrl}/api/v1/schedules/${e}/deactivate`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  activateSchedule(e, r) {
    return N(me, `${this.baseUrl}/api/v1/schedules/${e}/activate`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  deleteSchedule(e, r) {
    return N(Ei, `${this.baseUrl}/api/v1/schedules/${e}`, {
      method: "DELETE",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
  listEnvVars(e, r, a) {
    return N(wi, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, a));
  }
  importEnvVars(e, r, a, s) {
    return N(It, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/import`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(a)
    }, x(this.defaultRequestOptions, s));
  }
  retrieveEnvVar(e, r, a, s) {
    return N(ki, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, s));
  }
  createEnvVar(e, r, a, s) {
    return N(It, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(a)
    }, x(this.defaultRequestOptions, s));
  }
  updateEnvVar(e, r, a, s, i) {
    return N(It, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "PUT",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(s)
    }, x(this.defaultRequestOptions, i));
  }
  deleteEnvVar(e, r, a, s) {
    return N(It, `${this.baseUrl}/api/v1/projects/${e}/envvars/${r}/${a}`, {
      method: "DELETE",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, s));
  }
  updateRunMetadata(e, r, a) {
    return N(Ni, `${this.baseUrl}/api/v1/runs/${e}/metadata`, {
      method: "PUT",
      headers: p(this, A, k).call(this, !1),
      body: JSON.stringify(r)
    }, x(this.defaultRequestOptions, a));
  }
  subscribeToRun(e, r) {
    return yn(`${this.baseUrl}/realtime/v1/runs/${e}`, {
      closeOnComplete: !0,
      headers: p(this, A, Ot).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal
    });
  }
  subscribeToRunsWithTag(e, r) {
    const a = Xc({
      tags: e
    });
    return yn(`${this.baseUrl}/realtime/v1/runs${a ? `?${a}` : ""}`, {
      closeOnComplete: !1,
      headers: p(this, A, Ot).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal
    });
  }
  subscribeToBatch(e, r) {
    return yn(`${this.baseUrl}/realtime/v1/batches/${e}`, {
      closeOnComplete: !1,
      headers: p(this, A, Ot).call(this),
      client: this,
      signal: r == null ? void 0 : r.signal
    });
  }
  async generateJWTClaims(e) {
    return N(t.record(t.any()), `${this.baseUrl}/api/v1/auth/jwt/claims`, {
      method: "POST",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, e));
  }
  retrieveBatch(e, r) {
    return N(Pi, `${this.baseUrl}/api/v1/batches/${e}`, {
      method: "GET",
      headers: p(this, A, k).call(this, !1)
    }, x(this.defaultRequestOptions, r));
  }
}
A = new WeakSet(), k = function(e, r) {
  const a = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": lr,
    ...Object.entries(r ?? {}).reduce((s, [i, o]) => (o !== void 0 && (s[i] = o), s), {})
  };
  return P.isInsideTask && (a["x-trigger-worker"] = "true", e && (a["x-trigger-span-parent-as-link"] = "1")), typeof window < "u" && typeof window.document < "u" && (a["x-trigger-client"] = "browser"), a;
}, Ot = function() {
  return {
    Authorization: `Bearer ${this.accessToken}`,
    "trigger-version": lr
  };
};
function Xc(n) {
  const e = new URLSearchParams();
  return n.tasks && e.append("tasks", Array.isArray(n.tasks) ? n.tasks.join(",") : n.tasks), n.tags && e.append("tags", Array.isArray(n.tags) ? n.tags.join(",") : n.tags), e;
}
function wr(n) {
  const e = new URLSearchParams();
  return n && (n.status && e.append("filter[status]", Array.isArray(n.status) ? n.status.join(",") : n.status), n.taskIdentifier && e.append("filter[taskIdentifier]", Array.isArray(n.taskIdentifier) ? n.taskIdentifier.join(",") : n.taskIdentifier), n.version && e.append("filter[version]", Array.isArray(n.version) ? n.version.join(",") : n.version), n.bulkAction && e.append("filter[bulkAction]", n.bulkAction), n.tag && e.append("filter[tag]", Array.isArray(n.tag) ? n.tag.join(",") : n.tag), n.schedule && e.append("filter[schedule]", n.schedule), typeof n.isTest == "boolean" && e.append("filter[isTest]", String(n.isTest)), n.from && e.append("filter[createdAt][from]", n.from instanceof Date ? n.from.getTime().toString() : n.from.toString()), n.to && e.append("filter[createdAt][to]", n.to instanceof Date ? n.to.getTime().toString() : n.to.toString()), n.period && e.append("filter[createdAt][period]", n.period), n.batch && e.append("filter[batch]", n.batch)), e;
}
function x(n, e) {
  return e ? {
    ...n,
    ...e,
    retry: {
      ...n.retry,
      ...e.retry
    }
  } : n;
}
var ir = {};
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
Object.defineProperty(ir, "__esModule", { value: !0 });
var $a = ir.PreciseDate = void 0;
const Qc = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{4,9}Z/, Nr = "BigInt only available in Node >= v10.7. Consider using getFullTimeString instead.";
var Ne;
(function(n) {
  n[n.NEGATIVE = -1] = "NEGATIVE", n[n.POSITIVE = 1] = "POSITIVE", n[n.ZERO = 0] = "ZERO";
})(Ne || (Ne = {}));
class ve extends Date {
  constructor(e) {
    if (super(), this._micros = 0, this._nanos = 0, e && typeof e != "number" && !(e instanceof Date)) {
      this.setFullTime(ve.parseFull(e));
      return;
    }
    const r = Array.from(arguments), a = r.slice(0, 7), s = new Date(...a), i = r.length === 9 ? r.pop() : 0, o = r.length === 8 ? r.pop() : 0;
    this.setTime(s.getTime()), this.setMicroseconds(o), this.setNanoseconds(i);
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
      throw new Error(Nr);
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
    const e = this._getSeconds();
    let r = this._getNanos();
    return r && Math.sign(e) === Ne.NEGATIVE && (r = 1e9 - r), `${e}${_n(r, 9)}`;
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
  setMicroseconds(e) {
    const r = Math.abs(e);
    let a = this.getUTCMilliseconds();
    return r >= 1e3 && (a += Math.floor(r / 1e3) * Math.sign(e), e %= 1e3), Math.sign(e) === Ne.NEGATIVE && (a -= 1, e += 1e3), this._micros = e, this.setUTCMilliseconds(a), this.getFullTimeString();
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
  setNanoseconds(e) {
    const r = Math.abs(e);
    let a = this._micros;
    return r >= 1e3 && (a += Math.floor(r / 1e3) * Math.sign(e), e %= 1e3), Math.sign(e) === Ne.NEGATIVE && (a -= 1, e += 1e3), this._nanos = e, this.setMicroseconds(a);
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
  setFullTime(e) {
    typeof e != "string" && (e = e.toString());
    const r = Math.sign(Number(e));
    e = e.replace(/^-/, "");
    const a = Number(e.substr(0, e.length - 9)) * r, s = Number(e.substr(-9)) * r;
    return this.setTime(a * 1e3), this.setNanoseconds(s);
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
  setTime(e) {
    return this._micros = 0, this._nanos = 0, super.setTime(e);
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
    const e = _n(this._micros, 3), r = _n(this._nanos, 3);
    return super.toISOString().replace(/z$/i, `${e}${r}Z`);
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
    let e = this._getSeconds();
    const r = this._getNanos();
    return Math.sign(e) === Ne.NEGATIVE && r && (e -= 1), { seconds: e, nanos: r };
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
    const { seconds: e, nanos: r } = this.toStruct();
    return [e, r];
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
    const e = this.getTime(), r = Math.sign(e);
    return Math.floor(Math.abs(e) / 1e3) * r;
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
    const e = this.getUTCMilliseconds() * 1e6, r = this._micros * 1e3;
    return this._nanos + e + r;
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
  static parseFull(e) {
    const r = new ve();
    if (Array.isArray(e)) {
      const [a, s] = e;
      e = { seconds: a, nanos: s };
    }
    if (tu(e))
      r.setFullTime(e);
    else if (nu(e)) {
      const { seconds: a, nanos: s } = eu(e);
      r.setTime(a * 1e3), r.setNanoseconds(s);
    } else ru(e) ? r.setFullTime(qc(e)) : r.setTime(new Date(e).getTime());
    return r.getFullTimeString();
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
  static fullUTC(...e) {
    if (typeof BigInt != "function")
      throw new Error(Nr);
    return BigInt(ve.fullUTCString(...e));
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
  static fullUTCString(...e) {
    const r = Date.UTC(...e.slice(0, 7)), a = new ve(r);
    return e.length === 9 && a.setNanoseconds(e.pop()), e.length === 8 && a.setMicroseconds(e.pop()), a.getFullTimeString();
  }
}
$a = ir.PreciseDate = ve;
function qc(n) {
  let e = "0";
  n = n.replace(/\.(\d+)/, (s, i) => (e = i, ".000"));
  const r = Number(au(e, 9));
  return new ve(n).setNanoseconds(r);
}
function eu({ seconds: n = 0, nanos: e = 0 }) {
  return typeof n.toNumber == "function" && (n = n.toNumber()), n = Number(n), e = Number(e), { seconds: n, nanos: e };
}
function tu(n) {
  return typeof n == "bigint" || typeof n == "string" && /^\d+$/.test(n);
}
function nu(n) {
  return typeof n == "object" && typeof n.seconds < "u" || typeof n.nanos == "number";
}
function ru(n) {
  return typeof n == "string" && Qc.test(n);
}
function _n(n, e) {
  return `${La(n, e)}${n}`;
}
function au(n, e) {
  const r = La(n, e);
  return `${n}${r}`;
}
function La(n, e) {
  const r = Math.max(e - n.toString().length, 0);
  return "0".repeat(r);
}
class su {
  preciseNow() {
    const r = new $a().toStruct();
    return [r.seconds, r.nanos];
  }
  reset() {
  }
}
const Or = "clock", iu = new su();
var vt, Dn;
const zt = class zt {
  constructor() {
    F(this, vt);
  }
  static getInstance() {
    return this._instance || (this._instance = new zt()), this._instance;
  }
  setGlobalClock(e) {
    return J(Or, e);
  }
  preciseNow() {
    return p(this, vt, Dn).call(this).preciseNow();
  }
  reset() {
    p(this, vt, Dn).call(this).reset();
  }
};
vt = new WeakSet(), Dn = function() {
  return ge(Or) ?? iu;
}, m(zt, "_instance");
let Un = zt;
const Cr = Un.getInstance();
var ou = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.emit = function(e) {
    }, n;
  }()
), cu = (
  /** @class */
  function() {
    function n() {
    }
    return n.prototype.getLogger = function(e, r, a) {
      return new ou();
    }, n;
  }()
), Pr = new cu(), uu = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global == "object" ? global : {}, St = Symbol.for("io.opentelemetry.js.api.logs"), Ye = uu;
function du(n, e, r) {
  return function(a) {
    return a === n ? e : r;
  };
}
var jr = 1, lu = (
  /** @class */
  function() {
    function n() {
    }
    return n.getInstance = function() {
      return this._instance || (this._instance = new n()), this._instance;
    }, n.prototype.setGlobalLoggerProvider = function(e) {
      return Ye[St] ? this.getLoggerProvider() : (Ye[St] = du(jr, e, Pr), e);
    }, n.prototype.getLoggerProvider = function() {
      var e, r;
      return (r = (e = Ye[St]) === null || e === void 0 ? void 0 : e.call(Ye, jr)) !== null && r !== void 0 ? r : Pr;
    }, n.prototype.getLogger = function(e, r, a) {
      return this.getLoggerProvider().getLogger(e, r, a);
    }, n.prototype.disable = function() {
      delete Ye[St];
    }, n;
  }()
), fu = lu.getInstance();
class hu {
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
const vn = "logger", pu = new hu();
var ne, ye;
const Ht = class Ht {
  constructor() {
    F(this, ne);
  }
  static getInstance() {
    return this._instance || (this._instance = new Ht()), this._instance;
  }
  disable() {
    Ae(vn);
  }
  setGlobalTaskLogger(e) {
    return J(vn, e);
  }
  debug(e, r) {
    p(this, ne, ye).call(this).debug(e, r);
  }
  log(e, r) {
    p(this, ne, ye).call(this).log(e, r);
  }
  info(e, r) {
    p(this, ne, ye).call(this).info(e, r);
  }
  warn(e, r) {
    p(this, ne, ye).call(this).warn(e, r);
  }
  error(e, r) {
    p(this, ne, ye).call(this).error(e, r);
  }
  trace(e, r) {
    return p(this, ne, ye).call(this).trace(e, r);
  }
};
ne = new WeakSet(), ye = function() {
  return ge(vn) ?? pu;
}, m(Ht, "_instance");
let $n = Ht;
const oe = $n.getInstance();
class gu {
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
        code: zr.CONFIGURED_INCORRECTLY
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
class mu {
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
const bn = "usage", yu = new mu();
var ce, ke;
const Jt = class Jt {
  constructor() {
    F(this, ce);
  }
  static getInstance() {
    return this._instance || (this._instance = new Jt()), this._instance;
  }
  setGlobalUsageManager(e) {
    return J(bn, e);
  }
  disable() {
    p(this, ce, ke).call(this).disable(), Ae(bn);
  }
  start() {
    return p(this, ce, ke).call(this).start();
  }
  stop(e) {
    return p(this, ce, ke).call(this).stop(e);
  }
  pauseAsync(e) {
    return p(this, ce, ke).call(this).pauseAsync(e);
  }
  sample() {
    return p(this, ce, ke).call(this).sample();
  }
};
ce = new WeakSet(), ke = function() {
  return ge(bn) ?? yu;
}, m(Jt, "_instance");
let Ln = Jt;
const Oe = Ln.getInstance(), Tn = "runtime", _u = new gu();
var ue, xe;
const Xt = class Xt {
  constructor() {
    F(this, ue);
  }
  static getInstance() {
    return this._instance || (this._instance = new Xt()), this._instance;
  }
  waitForDuration(e) {
    return Oe.pauseAsync(() => p(this, ue, xe).call(this).waitForDuration(e));
  }
  waitUntil(e) {
    return Oe.pauseAsync(() => p(this, ue, xe).call(this).waitUntil(e));
  }
  waitForTask(e) {
    return Oe.pauseAsync(() => p(this, ue, xe).call(this).waitForTask(e));
  }
  waitForBatch(e) {
    return Oe.pauseAsync(() => p(this, ue, xe).call(this).waitForBatch(e));
  }
  setGlobalRuntimeManager(e) {
    return J(Tn, e);
  }
  disable() {
    p(this, ue, xe).call(this).disable(), Ae(Tn);
  }
};
ue = new WeakSet(), xe = function() {
  return ge(Tn) ?? _u;
}, m(Xt, "_instance");
let Gn = Xt;
const Zt = Gn.getInstance(), En = "timeout";
class vu {
  abortAfterTimeout(e) {
    return new AbortController().signal;
  }
}
const bu = new vu();
var bt, Fn;
const Qt = class Qt {
  constructor() {
    F(this, bt);
  }
  static getInstance() {
    return this._instance || (this._instance = new Qt()), this._instance;
  }
  get signal() {
    return p(this, bt, Fn).call(this).signal;
  }
  abortAfterTimeout(e) {
    return p(this, bt, Fn).call(this).abortAfterTimeout(e);
  }
  setGlobalManager(e) {
    return J(En, e);
  }
  disable() {
    Ae(En);
  }
};
bt = new WeakSet(), Fn = function() {
  return ge(En) ?? bu;
}, m(Qt, "_instance");
let Kn = Qt;
const Tu = Kn.getInstance();
class Eu {
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
const Rn = "task-catalog", Ru = new Eu();
var z, se;
const qt = class qt {
  constructor() {
    F(this, z);
  }
  static getInstance() {
    return this._instance || (this._instance = new qt()), this._instance;
  }
  setGlobalTaskCatalog(e) {
    return J(Rn, e);
  }
  disable() {
    Ae(Rn);
  }
  registerTaskMetadata(e) {
    p(this, z, se).call(this).registerTaskMetadata(e);
  }
  updateTaskMetadata(e, r) {
    p(this, z, se).call(this).updateTaskMetadata(e, r);
  }
  registerTaskFileMetadata(e, r) {
    p(this, z, se).call(this).registerTaskFileMetadata(e, r);
  }
  listTaskManifests() {
    return p(this, z, se).call(this).listTaskManifests();
  }
  getTaskManifest(e) {
    return p(this, z, se).call(this).getTaskManifest(e);
  }
  getTask(e) {
    return p(this, z, se).call(this).getTask(e);
  }
  taskExists(e) {
    return p(this, z, se).call(this).taskExists(e);
  }
};
z = new WeakSet(), se = function() {
  return ge(Rn) ?? Ru;
}, m(qt, "_instance");
let Zn = qt;
const ze = Zn.getInstance();
class Iu extends Error {
  constructor(r, a, s) {
    var e = (...Hu) => (super(...Hu), m(this, "taskId"), m(this, "runId"), m(this, "cause"), this);
    s instanceof Error ? (e(`Error in ${r}: ${s.message}`), this.cause = s, this.name = "SubtaskUnwrapError") : (e(`Error in ${r}`), this.name = "SubtaskUnwrapError", this.cause = s), this.taskId = r, this.runId = a;
  }
}
class Au extends Promise {
  constructor(r, a) {
    super(r);
    m(this, "taskId");
    this.taskId = a;
  }
  unwrap() {
    return this.then((r) => {
      if (r.ok)
        return r.output;
      throw new Iu(this.taskId, r.id, r.error);
    });
  }
}
function Su(n) {
  return typeof n == "string" && n.length === 64;
}
async function Bn(n) {
  if (n)
    return Su(n) ? n : await ku(n, { scope: "global" });
}
async function ku(n, e) {
  return await wu([...Array.isArray(n) ? n : [n]].concat(xu((e == null ? void 0 : e.scope) ?? "run")));
}
function xu(n) {
  switch (n) {
    case "run": {
      if (P != null && P.ctx)
        return [P.ctx.run.id];
      break;
    }
    case "attempt": {
      if (P != null && P.ctx)
        return [P.ctx.attempt.id];
      break;
    }
  }
  return [];
}
async function wu(n) {
  const e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(n.join("-")));
  return Array.from(new Uint8Array(e)).map((r) => r.toString(16).padStart(2, "0")).join("");
}
function Nu(n, e) {
  e instanceof Error ? n.recordException(Ou(e)) : typeof e == "string" ? n.recordException(e.replace(/\0/g, "")) : n.recordException(JSON.stringify(e).replace(/\0/g, "")), n.setStatus({ code: Ft.ERROR });
}
function Ou(n) {
  var r;
  const e = new Error(n.message.replace(/\0/g, ""));
  return e.name = n.name.replace(/\0/g, ""), e.stack = (r = n.stack) == null ? void 0 : r.replace(/\0/g, ""), e;
}
class Cu {
  constructor(e) {
    m(this, "_config");
    m(this, "_tracer");
    m(this, "_logger");
    this._config = e;
  }
  get tracer() {
    if (!this._tracer) {
      if ("tracer" in this._config)
        return this._config.tracer;
      this._tracer = _c.getTracer(this._config.name, this._config.version);
    }
    return this._tracer;
  }
  get logger() {
    if (!this._logger) {
      if ("logger" in this._config)
        return this._config.logger;
      this._logger = fu.getLogger(this._config.name, this._config.version);
    }
    return this._logger;
  }
  extractContext(e) {
    return Oa.extract(wt.active(), e ?? {});
  }
  startActiveSpan(e, r, a, s, i) {
    const o = s ?? wt.active(), c = (a == null ? void 0 : a.attributes) ?? {};
    let u = !1;
    return this.tracer.startActiveSpan(e, {
      ...a,
      attributes: c,
      startTime: Cr.preciseNow()
    }, o, async (d) => {
      i == null || i.addEventListener("abort", () => {
        u || (u = !0, Nu(d, i.reason), d.end());
      }), P.ctx && this.tracer.startSpan(e, {
        ...a,
        attributes: {
          ...c,
          [R.SPAN_PARTIAL]: !0,
          [R.SPAN_ID]: d.spanContext().spanId
        }
      }, o).end();
      const l = Oe.start();
      try {
        return await r(d);
      } catch (v) {
        throw u || ((typeof v == "string" || v instanceof Error) && d.recordException(v), d.setStatus({ code: Ft.ERROR })), v;
      } finally {
        if (!u) {
          if (u = !0, P.ctx) {
            const v = Oe.stop(l), T = P.ctx.machine;
            d.setAttributes({
              [R.USAGE_DURATION_MS]: v.cpuTime,
              [R.USAGE_COST_IN_CENTS]: T != null && T.centsPerMs ? v.cpuTime * T.centsPerMs : 0
            });
          }
          d.end(Cr.preciseNow());
        }
      }
    });
  }
  startSpan(e, r, a) {
    const s = a ?? wt.active(), i = (r == null ? void 0 : r.attributes) ?? {}, o = this.tracer.startSpan(e, r, a);
    return this.tracer.startSpan(e, {
      ...r,
      attributes: {
        ...i,
        [R.SPAN_PARTIAL]: !0,
        [R.SPAN_ID]: o.spanContext().spanId
      }
    }, s).end(), o;
  }
}
const Pu = "3.3.5", pe = new Cu({ name: "@trigger.dev/sdk", version: Pu });
function ju(n) {
  var a;
  const e = n.queue ? {
    name: ((a = n.queue) == null ? void 0 : a.name) ?? `task/${n.id}`,
    ...n.queue
  } : void 0, r = {
    id: n.id,
    description: n.description,
    trigger: async (s, i) => {
      const o = ze.getTaskManifest(n.id);
      return await Mu(o && o.exportName ? `${o.exportName}.trigger()` : "trigger()", n.id, s, void 0, {
        queue: e,
        ...i
      });
    },
    batchTrigger: async (s, i) => {
      const o = ze.getTaskManifest(n.id);
      return await Uu(o && o.exportName ? `${o.exportName}.batchTrigger()` : "batchTrigger()", n.id, s, i, void 0, void 0, e);
    },
    triggerAndWait: (s, i) => {
      const o = ze.getTaskManifest(n.id);
      return new Au((c, u) => {
        Du(o && o.exportName ? `${o.exportName}.triggerAndWait()` : "triggerAndWait()", n.id, s, void 0, {
          queue: e,
          ...i
        }).then((d) => {
          c(d);
        }).catch((d) => {
          u(d);
        });
      }, n.id);
    },
    batchTriggerAndWait: async (s) => {
      const i = ze.getTaskManifest(n.id);
      return await $u(i && i.exportName ? `${i.exportName}.batchTriggerAndWait()` : "batchTriggerAndWait()", n.id, s, void 0, void 0, e);
    }
  };
  return ze.registerTaskMetadata({
    id: n.id,
    description: n.description,
    queue: n.queue,
    retry: n.retry ? { ...Ta, ...n.retry } : void 0,
    machine: n.machine,
    maxDuration: n.maxDuration,
    fns: {
      run: n.run,
      init: n.init,
      cleanup: n.cleanup,
      middleware: n.middleware,
      handleError: n.handleError,
      onSuccess: n.onSuccess,
      onFailure: n.onFailure,
      onStart: n.onStart
    }
  }), r[Symbol.for("trigger.dev/task")] = !0, r;
}
async function Mu(n, e, r, a, s, i) {
  var l, v;
  const o = Rt.clientOrThrow(), u = await on(r);
  return await o.triggerTask(e, {
    payload: u.data,
    options: {
      queue: s == null ? void 0 : s.queue,
      concurrencyKey: s == null ? void 0 : s.concurrencyKey,
      test: (l = P.ctx) == null ? void 0 : l.run.isTest,
      payloadType: u.dataType,
      idempotencyKey: await Bn(s == null ? void 0 : s.idempotencyKey),
      idempotencyKeyTTL: s == null ? void 0 : s.idempotencyKeyTTL,
      delay: s == null ? void 0 : s.delay,
      ttl: s == null ? void 0 : s.ttl,
      tags: s == null ? void 0 : s.tags,
      maxAttempts: s == null ? void 0 : s.maxAttempts,
      parentAttempt: (v = P.ctx) == null ? void 0 : v.attempt.id,
      metadata: s == null ? void 0 : s.metadata,
      maxDuration: s == null ? void 0 : s.maxDuration
    }
  }, {
    spanParentAsLink: !0
  }, {
    name: n,
    tracer: pe,
    icon: "trigger",
    onResponseBody: (T, M) => {
      T && typeof T == "object" && !Array.isArray(T) && "id" in T && typeof T.id == "string" && M.setAttribute("runId", T.id);
    },
    ...i
  });
}
async function Uu(n, e, r, a, s, i, o) {
  const u = await Rt.clientOrThrow().batchTriggerV2({
    items: await Promise.all(r.map(async (l) => {
      var M, G, w, C, K, q, ee, Le, Ge, Ke, Fe, Ze;
      const v = l.payload, T = await on(v);
      return {
        task: e,
        payload: T.data,
        options: {
          queue: ((M = l.options) == null ? void 0 : M.queue) ?? o,
          concurrencyKey: (G = l.options) == null ? void 0 : G.concurrencyKey,
          test: (w = P.ctx) == null ? void 0 : w.run.isTest,
          payloadType: T.dataType,
          idempotencyKey: await Bn((C = l.options) == null ? void 0 : C.idempotencyKey),
          idempotencyKeyTTL: (K = l.options) == null ? void 0 : K.idempotencyKeyTTL,
          delay: (q = l.options) == null ? void 0 : q.delay,
          ttl: (ee = l.options) == null ? void 0 : ee.ttl,
          tags: (Le = l.options) == null ? void 0 : Le.tags,
          maxAttempts: (Ge = l.options) == null ? void 0 : Ge.maxAttempts,
          parentAttempt: (Ke = P.ctx) == null ? void 0 : Ke.attempt.id,
          metadata: (Fe = l.options) == null ? void 0 : Fe.metadata,
          maxDuration: (Ze = l.options) == null ? void 0 : Ze.maxDuration
        }
      };
    }))
  }, {
    spanParentAsLink: !0,
    idempotencyKey: await Bn(a == null ? void 0 : a.idempotencyKey),
    idempotencyKeyTTL: a == null ? void 0 : a.idempotencyKeyTTL
  }, {
    name: n,
    tracer: pe,
    icon: "trigger",
    onResponseBody(l, v) {
      l && typeof l == "object" && !Array.isArray(l) && ("id" in l && typeof l.id == "string" && v.setAttribute("batchId", l.id), "runs" in l && Array.isArray(l.runs) && v.setAttribute("runCount", l.runs.length), "isCached" in l && typeof l.isCached == "boolean" && (l.isCached && console.warn("Result is a cached response because the request was idempotent."), v.setAttribute("isCached", l.isCached)), "idempotencyKey" in l && typeof l.idempotencyKey == "string" && v.setAttribute("idempotencyKey", l.idempotencyKey));
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
async function Du(n, e, r, a, s, i) {
  const o = P.ctx;
  if (!o)
    throw new Error("triggerAndWait can only be used from inside a task.run()");
  const c = Rt.clientOrThrow(), d = await on(r);
  return await pe.startActiveSpan(n, async (l) => {
    var M, G;
    const v = await c.triggerTask(e, {
      payload: d.data,
      options: {
        dependentAttempt: o.attempt.id,
        lockToVersion: (M = P.worker) == null ? void 0 : M.version,
        // Lock to current version because we're waiting for it to finish
        queue: s == null ? void 0 : s.queue,
        concurrencyKey: s == null ? void 0 : s.concurrencyKey,
        test: (G = P.ctx) == null ? void 0 : G.run.isTest,
        payloadType: d.dataType,
        delay: s == null ? void 0 : s.delay,
        ttl: s == null ? void 0 : s.ttl,
        tags: s == null ? void 0 : s.tags,
        maxAttempts: s == null ? void 0 : s.maxAttempts,
        metadata: s == null ? void 0 : s.metadata,
        maxDuration: s == null ? void 0 : s.maxDuration
      }
    }, {}, i);
    l.setAttribute("runId", v.id);
    const T = await Zt.waitForTask({
      id: v.id,
      ctx: o
    });
    return await Vn(T, e);
  }, {
    kind: yt.PRODUCER,
    attributes: {
      [R.STYLE_ICON]: "trigger",
      ..._t({
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
async function $u(n, e, r, a, s, i) {
  const o = P.ctx;
  if (!o)
    throw new Error("batchTriggerAndWait can only be used from inside a task.run()");
  const c = Rt.clientOrThrow();
  return await pe.startActiveSpan(n, async (u) => {
    const d = await c.batchTriggerV2({
      items: await Promise.all(r.map(async (T) => {
        var w, C, K, q, ee, Le, Ge, Ke, Fe, Ze;
        const M = T.payload, G = await on(M);
        return {
          task: e,
          payload: G.data,
          options: {
            lockToVersion: (w = P.worker) == null ? void 0 : w.version,
            queue: ((C = T.options) == null ? void 0 : C.queue) ?? i,
            concurrencyKey: (K = T.options) == null ? void 0 : K.concurrencyKey,
            test: (q = P.ctx) == null ? void 0 : q.run.isTest,
            payloadType: G.dataType,
            delay: (ee = T.options) == null ? void 0 : ee.delay,
            ttl: (Le = T.options) == null ? void 0 : Le.ttl,
            tags: (Ge = T.options) == null ? void 0 : Ge.tags,
            maxAttempts: (Ke = T.options) == null ? void 0 : Ke.maxAttempts,
            metadata: (Fe = T.options) == null ? void 0 : Fe.metadata,
            maxDuration: (Ze = T.options) == null ? void 0 : Ze.maxDuration
          }
        };
      })),
      dependentAttempt: o.attempt.id
    }, {}, s);
    u.setAttribute("batchId", d.id), u.setAttribute("runCount", d.runs.length), u.setAttribute("isCached", d.isCached), d.isCached && console.warn("Result is a cached response because the request was idempotent."), d.idempotencyKey && u.setAttribute("idempotencyKey", d.idempotencyKey);
    const l = await Zt.waitForBatch({
      id: d.id,
      runs: d.runs.map((T) => T.id),
      ctx: o
    }), v = await Lu(l.items, e);
    return {
      id: l.id,
      runs: v
    };
  }, {
    kind: yt.PRODUCER,
    attributes: {
      [R.STYLE_ICON]: "trigger",
      ..._t({
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
async function Lu(n, e) {
  return n.some((a) => a.ok && a.outputType === "application/store") ? await pe.startActiveSpan("store.downloadPayloads", async (a) => await Promise.all(n.map(async (i) => await Vn(i, e))), {
    kind: yt.INTERNAL,
    [R.STYLE_ICON]: "cloud-download"
  }) : await Promise.all(n.map(async (s) => await Vn(s, e)));
}
async function Vn(n, e) {
  if (n.ok) {
    const r = { data: n.output, dataType: n.outputType }, a = await Ua(r, pe);
    return {
      ok: !0,
      id: n.id,
      taskIdentifier: n.taskIdentifier ?? e,
      output: await sr(a)
    };
  } else
    return {
      ok: !1,
      id: n.id,
      taskIdentifier: n.taskIdentifier ?? e,
      error: Cc(n.error)
    };
}
const Ga = ju, Gu = {
  for: async (n) => pe.startActiveSpan("wait.for()", async (e) => {
    const r = Fu(n);
    await Zt.waitForDuration(r);
  }, {
    attributes: {
      [R.STYLE_ICON]: "wait",
      ..._t({
        items: [
          {
            text: Ku(n),
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }),
  until: async (n) => pe.startActiveSpan("wait.until()", async (e) => {
    const r = Date.now();
    if (n.throwIfInThePast && n.date < /* @__PURE__ */ new Date())
      throw new Error("Date is in the past");
    const a = n.date.getTime() - r;
    await Zt.waitForDuration(a);
  }, {
    attributes: {
      [R.STYLE_ICON]: "wait",
      ..._t({
        items: [
          {
            text: n.date.toISOString(),
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  })
};
function Ku(n) {
  return "seconds" in n ? n.seconds === 1 ? "1 second" : `${n.seconds} seconds` : "minutes" in n ? n.minutes === 1 ? "1 minute" : `${n.minutes} minutes` : "hours" in n ? n.hours === 1 ? "1 hour" : `${n.hours} hours` : "days" in n ? n.days === 1 ? "1 day" : `${n.days} days` : "weeks" in n ? n.weeks === 1 ? "1 week" : `${n.weeks} weeks` : "months" in n ? n.months === 1 ? "1 month" : `${n.months} months` : "years" in n ? n.years === 1 ? "1 year" : `${n.years} years` : "NaN";
}
function Fu(n) {
  if ("seconds" in n)
    return n.seconds * 1e3;
  if ("minutes" in n)
    return n.minutes * 1e3 * 60;
  if ("hours" in n)
    return n.hours * 1e3 * 60 * 60;
  if ("days" in n)
    return n.days * 1e3 * 60 * 60 * 24;
  if ("weeks" in n)
    return n.weeks * 1e3 * 60 * 60 * 24 * 7;
  if ("months" in n)
    return n.months * 1e3 * 60 * 60 * 24 * 30;
  if ("years" in n)
    return n.years * 1e3 * 60 * 60 * 24 * 365;
  throw new Error("Invalid options");
}
const Zu = 2147483647;
Tu.signal;
const In = process.env.TINYBIRD_TOKEN ?? void 0, Wu = Ga({
  id: "copy_job",
  run: async (n) => {
    if (!(In ?? n.token))
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!n.pipeId)
      throw new Error("Pipe ID not found");
    try {
      let r = `https://api.tinybird.co/v0/pipes/${n.pipeId}/copy`;
      if (n.params) {
        const u = new URLSearchParams();
        for (const [d, l] of Object.entries(n.params))
          u.append(d, l.toString());
        r += `?${u.toString()}`;
      }
      const a = await fetch(
        r,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${In}`
          }
        }
      ).then((u) => u.json());
      if (!a || !("job" in a))
        throw oe.error(a), new Error("Invalid response from Tinybird API");
      const s = a.job.job_id;
      oe.log("Copy job started", { jobId: s });
      let i = "";
      const o = 30;
      let c = 0;
      for (; c < o; ) {
        if (i = (await fetch(
          `https://api.tinybird.co/v0/jobs/${s}`,
          {
            headers: {
              Authorization: `Bearer ${In}`
            }
          }
        ).then((d) => d.json())).status, oe.log("Job status check", { jobId: s, status: i, attempt: c + 1 }), i === "done")
          return oe.log("Copy job completed successfully", { jobId: s }), { success: !0, jobId: s };
        if (i === "error" || i === "failed")
          throw new Error(`Copy job failed with status: ${i}`);
        await Gu.for({ seconds: 5 }), c++;
      }
      throw new Error(`Job timed out after ${o} attempts`);
    } catch (r) {
      throw oe.error("Error in Tinybird copy job", { error: r }), r;
    }
  }
}), Mr = process.env.TINYBIRD_TOKEN ?? void 0;
var or = /* @__PURE__ */ ((n) => (n.CSV = "CSV", n.CSVWithNames = "CSVWithNames", n.JSON = "JSON", n.TSV = "TSV", n.TSVWithNames = "TSVWithNames", n.PrettyCompact = "PrettyCompact", n.JSONEachRow = "JSONEachRow", n.Parquet = "Parquet", n))(or || {});
function Ka(n) {
  return Object.values(or).includes(n);
}
function Bu(n) {
  const e = n.trim().match(/FORMAT\s+(\w+)$/i);
  if (!e) return null;
  const r = e[1].toUpperCase();
  return Ka(r) ? r : null;
}
const Yu = Ga({
  id: "tinybird-query",
  run: async (n) => {
    var i;
    if (!(Mr ?? n.token))
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    if (!n.sql)
      throw new Error("SQL query is required");
    let r = n.sql;
    const a = Bu(r);
    if (n.format && !Ka(n.format.toUpperCase()))
      throw new Error(`Invalid format: ${n.format}. Valid formats are: ${Object.values(or).join(", ")}`);
    const s = ((i = n.format) == null ? void 0 : i.toUpperCase()) ?? a ?? "JSON";
    a || (r += ` FORMAT ${s}`);
    try {
      const o = await fetch(
        "https://api.tinybird.co/v0/sql",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Mr}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            q: r,
            ...n.params
          })
        }
      ), c = await o.json();
      if (console.log(c), o.status !== 200) {
        let d = {
          error: "error"
        };
        throw "error" in c && (d = c, oe.error("Tinybird query failed", {
          error: d.error,
          detail: d.detail
        })), new Error(`Tinybird query failed: ${d.error}`);
      }
      const u = c;
      return oe.info("Query executed successfully", u), u;
    } catch (o) {
      throw oe.error("Failed to execute Tinybird query", {
        error: o instanceof Error ? o.message : "Unknown error",
        sql: n.sql
      }), o;
    }
  }
});
export {
  Wu as tinybirdCopyTask,
  Yu as tinybirdQueryTask
};
