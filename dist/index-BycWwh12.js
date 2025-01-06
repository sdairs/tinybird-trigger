class j {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map(), this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(t, r) {
    this.keyToValue.set(t, r), this.valueToKey.set(r, t);
  }
  getByKey(t) {
    return this.keyToValue.get(t);
  }
  getByValue(t) {
    return this.valueToKey.get(t);
  }
  clear() {
    this.keyToValue.clear(), this.valueToKey.clear();
  }
}
class K {
  constructor(t) {
    this.generateIdentifier = t, this.kv = new j();
  }
  register(t, r) {
    this.kv.getByValue(t) || (r || (r = this.generateIdentifier(t)), this.kv.set(r, t));
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(t) {
    return this.kv.getByValue(t);
  }
  getValue(t) {
    return this.kv.getByKey(t);
  }
}
class J extends K {
  constructor() {
    super((t) => t.name), this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(t, r) {
    typeof r == "object" ? (r.allowProps && this.classToAllowedProps.set(t, r.allowProps), super.register(t, r.identifier)) : super.register(t, r);
  }
  getAllowedProps(t) {
    return this.classToAllowedProps.get(t);
  }
}
function ee(e) {
  if ("values" in Object)
    return Object.values(e);
  const t = [];
  for (const r in e)
    e.hasOwnProperty(r) && t.push(e[r]);
  return t;
}
function te(e, t) {
  const r = ee(e);
  if ("find" in r)
    return r.find(t);
  const n = r;
  for (let s = 0; s < n.length; s++) {
    const i = n[s];
    if (t(i))
      return i;
  }
}
function p(e, t) {
  Object.entries(e).forEach(([r, n]) => t(n, r));
}
function A(e, t) {
  return e.indexOf(t) !== -1;
}
function z(e, t) {
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    if (t(n))
      return n;
  }
}
class re {
  constructor() {
    this.transfomers = {};
  }
  register(t) {
    this.transfomers[t.name] = t;
  }
  findApplicable(t) {
    return te(this.transfomers, (r) => r.isApplicable(t));
  }
  findByName(t) {
    return this.transfomers[t];
  }
}
const ne = (e) => Object.prototype.toString.call(e).slice(8, -1), U = (e) => typeof e > "u", se = (e) => e === null, E = (e) => typeof e != "object" || e === null || e === Object.prototype ? !1 : Object.getPrototypeOf(e) === null ? !0 : Object.getPrototypeOf(e) === Object.prototype, T = (e) => E(e) && Object.keys(e).length === 0, g = (e) => Array.isArray(e), ie = (e) => typeof e == "string", oe = (e) => typeof e == "number" && !isNaN(e), ae = (e) => typeof e == "boolean", le = (e) => e instanceof RegExp, R = (e) => e instanceof Map, I = (e) => e instanceof Set, C = (e) => ne(e) === "Symbol", ce = (e) => e instanceof Date && !isNaN(e.valueOf()), ue = (e) => e instanceof Error, B = (e) => typeof e == "number" && isNaN(e), fe = (e) => ae(e) || se(e) || U(e) || oe(e) || ie(e) || C(e), ye = (e) => typeof e == "bigint", ge = (e) => e === 1 / 0 || e === -1 / 0, de = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), me = (e) => e instanceof URL, M = (e) => e.replace(/\./g, "\\."), P = (e) => e.map(String).map(M).join("."), b = (e) => {
  const t = [];
  let r = "";
  for (let s = 0; s < e.length; s++) {
    let i = e.charAt(s);
    if (i === "\\" && e.charAt(s + 1) === ".") {
      r += ".", s++;
      continue;
    }
    if (i === ".") {
      t.push(r), r = "";
      continue;
    }
    r += i;
  }
  const n = r;
  return t.push(n), t;
};
function f(e, t, r, n) {
  return {
    isApplicable: e,
    annotation: t,
    transform: r,
    untransform: n
  };
}
const q = [
  f(U, "undefined", () => null, () => {
  }),
  f(ye, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  f(ce, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  f(ue, "Error", (e, t) => {
    const r = {
      name: e.name,
      message: e.message
    };
    return t.allowedErrorProps.forEach((n) => {
      r[n] = e[n];
    }), r;
  }, (e, t) => {
    const r = new Error(e.message);
    return r.name = e.name, r.stack = e.stack, t.allowedErrorProps.forEach((n) => {
      r[n] = e[n];
    }), r;
  }),
  f(le, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), r = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, r);
  }),
  f(
    I,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  f(R, "map", (e) => [...e.entries()], (e) => new Map(e)),
  f((e) => B(e) || ge(e), "number", (e) => B(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  f((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  f(me, "URL", (e) => e.toString(), (e) => new URL(e))
];
function k(e, t, r, n) {
  return {
    isApplicable: e,
    annotation: t,
    transform: r,
    untransform: n
  };
}
const x = k((e, t) => C(e) ? !!t.symbolRegistry.getIdentifier(e) : !1, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, r) => {
  const n = r.symbolRegistry.getValue(t[1]);
  if (!n)
    throw new Error("Trying to deserialize unknown symbol");
  return n;
}), pe = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), $ = k(de, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const r = pe[t[1]];
  if (!r)
    throw new Error("Trying to deserialize unknown typed array");
  return new r(e);
});
function L(e, t) {
  return e != null && e.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : !1;
}
const F = k(L, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
  const r = t.classRegistry.getAllowedProps(e.constructor);
  if (!r)
    return { ...e };
  const n = {};
  return r.forEach((s) => {
    n[s] = e[s];
  }), n;
}, (e, t, r) => {
  const n = r.classRegistry.getValue(t[1]);
  if (!n)
    throw new Error(`Trying to deserialize unknown class '${t[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  return Object.assign(Object.create(n.prototype), e);
}), G = k((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, r) => {
  const n = r.customTransformerRegistry.findByName(t[1]);
  if (!n)
    throw new Error("Trying to deserialize unknown custom value");
  return n.deserialize(e);
}), we = [F, x, G, $], _ = (e, t) => {
  const r = z(we, (s) => s.isApplicable(e, t));
  if (r)
    return {
      value: r.transform(e, t),
      type: r.annotation(e, t)
    };
  const n = z(q, (s) => s.isApplicable(e, t));
  if (n)
    return {
      value: n.transform(e, t),
      type: n.annotation
    };
}, H = {};
q.forEach((e) => {
  H[e.annotation] = e;
});
const he = (e, t, r) => {
  if (g(t))
    switch (t[0]) {
      case "symbol":
        return x.untransform(e, t, r);
      case "class":
        return F.untransform(e, t, r);
      case "custom":
        return G.untransform(e, t, r);
      case "typed-array":
        return $.untransform(e, t, r);
      default:
        throw new Error("Unknown transformation: " + t);
    }
  else {
    const n = H[t];
    if (!n)
      throw new Error("Unknown transformation: " + t);
    return n.untransform(e, r);
  }
}, m = (e, t) => {
  if (t > e.size)
    throw new Error("index out of bounds");
  const r = e.keys();
  for (; t > 0; )
    r.next(), t--;
  return r.next().value;
};
function Q(e) {
  if (A(e, "__proto__"))
    throw new Error("__proto__ is not allowed as a property");
  if (A(e, "prototype"))
    throw new Error("prototype is not allowed as a property");
  if (A(e, "constructor"))
    throw new Error("constructor is not allowed as a property");
}
const be = (e, t) => {
  Q(t);
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    if (I(e))
      e = m(e, +n);
    else if (R(e)) {
      const s = +n, i = +t[++r] == 0 ? "key" : "value", o = m(e, s);
      switch (i) {
        case "key":
          e = o;
          break;
        case "value":
          e = e.get(o);
          break;
      }
    } else
      e = e[n];
  }
  return e;
}, S = (e, t, r) => {
  if (Q(t), t.length === 0)
    return r(e);
  let n = e;
  for (let i = 0; i < t.length - 1; i++) {
    const o = t[i];
    if (g(n)) {
      const l = +o;
      n = n[l];
    } else if (E(n))
      n = n[o];
    else if (I(n)) {
      const l = +o;
      n = m(n, l);
    } else if (R(n)) {
      if (i === t.length - 2)
        break;
      const c = +o, O = +t[++i] == 0 ? "key" : "value", d = m(n, c);
      switch (O) {
        case "key":
          n = d;
          break;
        case "value":
          n = n.get(d);
          break;
      }
    }
  }
  const s = t[t.length - 1];
  if (g(n) ? n[+s] = r(n[+s]) : E(n) && (n[s] = r(n[s])), I(n)) {
    const i = m(n, +s), o = r(i);
    i !== o && (n.delete(i), n.add(o));
  }
  if (R(n)) {
    const i = +t[t.length - 2], o = m(n, i);
    switch (+s == 0 ? "key" : "value") {
      case "key": {
        const c = r(o);
        n.set(c, n.get(o)), c !== o && n.delete(o);
        break;
      }
      case "value": {
        n.set(o, r(n.get(o)));
        break;
      }
    }
  }
  return e;
};
function V(e, t, r = []) {
  if (!e)
    return;
  if (!g(e)) {
    p(e, (i, o) => V(i, t, [...r, ...b(o)]));
    return;
  }
  const [n, s] = e;
  s && p(s, (i, o) => {
    V(i, t, [...r, ...b(o)]);
  }), t(n, r);
}
function Ee(e, t, r) {
  return V(t, (n, s) => {
    e = S(e, s, (i) => he(i, n, r));
  }), e;
}
function Re(e, t) {
  function r(n, s) {
    const i = be(e, b(s));
    n.map(b).forEach((o) => {
      e = S(e, o, () => i);
    });
  }
  if (g(t)) {
    const [n, s] = t;
    n.forEach((i) => {
      e = S(e, b(i), () => e);
    }), s && p(s, r);
  } else
    p(t, r);
  return e;
}
const Ie = (e, t) => E(e) || g(e) || R(e) || I(e) || L(e, t);
function Oe(e, t, r) {
  const n = r.get(e);
  n ? n.push(t) : r.set(e, [t]);
}
function Ae(e, t) {
  const r = {};
  let n;
  return e.forEach((s) => {
    if (s.length <= 1)
      return;
    t || (s = s.map((l) => l.map(String)).sort((l, c) => l.length - c.length));
    const [i, ...o] = s;
    i.length === 0 ? n = o.map(P) : r[P(i)] = o.map(P);
  }), n ? T(r) ? [n] : [n, r] : T(r) ? void 0 : r;
}
const W = (e, t, r, n, s = [], i = [], o = /* @__PURE__ */ new Map()) => {
  const l = fe(e);
  if (!l) {
    Oe(e, s, t);
    const y = o.get(e);
    if (y)
      return n ? {
        transformedValue: null
      } : y;
  }
  if (!Ie(e, r)) {
    const y = _(e, r), u = y ? {
      transformedValue: y.value,
      annotations: [y.type]
    } : {
      transformedValue: e
    };
    return l || o.set(e, u), u;
  }
  if (A(i, e))
    return {
      transformedValue: null
    };
  const c = _(e, r), O = (c == null ? void 0 : c.value) ?? e, d = g(O) ? [] : {}, w = {};
  p(O, (y, u) => {
    if (u === "__proto__" || u === "constructor" || u === "prototype")
      throw new Error(`Detected property ${u}. This is a prototype pollution risk, please remove it from your object.`);
    const h = W(y, t, r, n, [...s, u], [...i, e], o);
    d[u] = h.transformedValue, g(h.annotations) ? w[u] = h.annotations : E(h.annotations) && p(h.annotations, (Y, Z) => {
      w[M(u) + "." + Z] = Y;
    });
  });
  const N = T(w) ? {
    transformedValue: d,
    annotations: c ? [c.type] : void 0
  } : {
    transformedValue: d,
    annotations: c ? [c.type, w] : w
  };
  return l || o.set(e, N), N;
};
function X(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function D(e) {
  return X(e) === "Array";
}
function ke(e) {
  if (X(e) !== "Object")
    return !1;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function Pe(e, t, r, n, s) {
  const i = {}.propertyIsEnumerable.call(n, t) ? "enumerable" : "nonenumerable";
  i === "enumerable" && (e[t] = r), s && i === "nonenumerable" && Object.defineProperty(e, t, {
    value: r,
    enumerable: !1,
    writable: !0,
    configurable: !0
  });
}
function v(e, t = {}) {
  if (D(e))
    return e.map((s) => v(s, t));
  if (!ke(e))
    return e;
  const r = Object.getOwnPropertyNames(e), n = Object.getOwnPropertySymbols(e);
  return [...r, ...n].reduce((s, i) => {
    if (D(t.props) && !t.props.includes(i))
      return s;
    const o = e[i], l = v(o, t);
    return Pe(s, i, l, e, t.nonenumerable), s;
  }, {});
}
class a {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: t = !1 } = {}) {
    this.classRegistry = new J(), this.symbolRegistry = new K((r) => r.description ?? ""), this.customTransformerRegistry = new re(), this.allowedErrorProps = [], this.dedupe = t;
  }
  serialize(t) {
    const r = /* @__PURE__ */ new Map(), n = W(t, r, this, this.dedupe), s = {
      json: n.transformedValue
    };
    n.annotations && (s.meta = {
      ...s.meta,
      values: n.annotations
    });
    const i = Ae(r, this.dedupe);
    return i && (s.meta = {
      ...s.meta,
      referentialEqualities: i
    }), s;
  }
  deserialize(t) {
    const { json: r, meta: n } = t;
    let s = v(r);
    return n != null && n.values && (s = Ee(s, n.values, this)), n != null && n.referentialEqualities && (s = Re(s, n.referentialEqualities)), s;
  }
  stringify(t) {
    return JSON.stringify(this.serialize(t));
  }
  parse(t) {
    return this.deserialize(JSON.parse(t));
  }
  registerClass(t, r) {
    this.classRegistry.register(t, r);
  }
  registerSymbol(t, r) {
    this.symbolRegistry.register(t, r);
  }
  registerCustom(t, r) {
    this.customTransformerRegistry.register({
      name: r,
      ...t
    });
  }
  allowErrorProps(...t) {
    this.allowedErrorProps.push(...t);
  }
}
a.defaultInstance = new a();
a.serialize = a.defaultInstance.serialize.bind(a.defaultInstance);
a.deserialize = a.defaultInstance.deserialize.bind(a.defaultInstance);
a.stringify = a.defaultInstance.stringify.bind(a.defaultInstance);
a.parse = a.defaultInstance.parse.bind(a.defaultInstance);
a.registerClass = a.defaultInstance.registerClass.bind(a.defaultInstance);
a.registerSymbol = a.defaultInstance.registerSymbol.bind(a.defaultInstance);
a.registerCustom = a.defaultInstance.registerCustom.bind(a.defaultInstance);
a.allowErrorProps = a.defaultInstance.allowErrorProps.bind(a.defaultInstance);
const Te = a.serialize, Se = a.deserialize, Ve = a.stringify, ve = a.parse, Ne = a.registerClass, ze = a.registerCustom, Be = a.registerSymbol, _e = a.allowErrorProps;
export {
  a as SuperJSON,
  _e as allowErrorProps,
  a as default,
  Se as deserialize,
  ve as parse,
  Ne as registerClass,
  ze as registerCustom,
  Be as registerSymbol,
  Te as serialize,
  Ve as stringify
};
