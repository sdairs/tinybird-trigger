var Ce = Object.defineProperty, Oe = Object.defineProperties, We = Object.getOwnPropertyDescriptors, z = Object.getOwnPropertySymbols, ue = Object.prototype.hasOwnProperty, fe = Object.prototype.propertyIsEnumerable, de = (e) => {
  throw TypeError(e);
}, le = (e, t, s) => t in e ? Ce(e, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : e[t] = s, O = (e, t) => {
  for (var s in t || (t = {}))
    ue.call(t, s) && le(e, s, t[s]);
  if (z)
    for (var s of z(t))
      fe.call(t, s) && le(e, s, t[s]);
  return e;
}, pe = (e, t) => Oe(e, We(t)), He = (e, t) => {
  var s = {};
  for (var r in e)
    ue.call(e, r) && t.indexOf(r) < 0 && (s[r] = e[r]);
  if (e != null && z)
    for (var r of z(e))
      t.indexOf(r) < 0 && fe.call(e, r) && (s[r] = e[r]);
  return s;
}, ie = (e, t, s) => t.has(e) || de("Cannot " + s), a = (e, t, s) => (ie(e, t, "read from private field"), s ? s.call(e) : t.get(e)), u = (e, t, s) => t.has(e) ? de("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), h = (e, t, s, r) => (ie(e, t, "write to private field"), t.set(e, s), s), _ = (e, t, s) => (ie(e, t, "access private method"), s), F = (e, t, s) => new Promise((r, i) => {
  var n = (c) => {
    try {
      l(s.next(c));
    } catch (f) {
      i(f);
    }
  }, o = (c) => {
    try {
      l(s.throw(c));
    } catch (f) {
      i(f);
    }
  }, l = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(n, o);
  l((s = s.apply(e, t)).next());
}), Y = (e) => Number(e), Ie = (e) => e === "true" || e === "t", Le = (e) => BigInt(e), ce = (e) => JSON.parse(e), Fe = (e) => e, Ne = {
  int2: Y,
  int4: Y,
  int8: Le,
  bool: Ie,
  float4: Y,
  float8: Y,
  json: ce,
  jsonb: ce
};
function Be(e, t) {
  let s = 0, r = null, i = "", n = !1, o = 0, l;
  function c(f) {
    const d = [];
    for (; s < f.length; s++) {
      if (r = f[s], n)
        r === "\\" ? i += f[++s] : r === '"' ? (d.push(t(i)), i = "", n = f[s + 1] === '"', o = s + 2) : i += r;
      else if (r === '"')
        n = !0;
      else if (r === "{")
        o = ++s, d.push(c(f));
      else if (r === "}") {
        n = !1, o < s && d.push(t(f.slice(o, s))), o = s + 1;
        break;
      } else r === "," && l !== "}" && l !== '"' && (d.push(t(f.slice(o, s))), o = s + 1);
      l = r;
    }
    return o < s && d.push(t(f.slice(o, s + 1))), d;
  }
  return c(e)[0];
}
var qe = class {
  constructor(e) {
    this.parser = O(O({}, Ne), e);
  }
  parse(e, t) {
    return JSON.parse(e, (s, r) => {
      if (s === "value" && typeof r == "object" && r !== null) {
        const i = r;
        Object.keys(i).forEach((n) => {
          i[n] = this.parseRow(n, i[n], t);
        });
      }
      return r;
    });
  }
  // Parses the message values using the provided parser based on the schema information
  parseRow(e, t, s) {
    var r;
    const i = s[e];
    if (!i)
      return t;
    const n = i, { type: o, dims: l } = n, c = He(n, ["type", "dims"]), f = (r = this.parser[o]) != null ? r : Fe, d = oe(f, i, e);
    return l && l > 0 ? oe(
      (k, b) => Be(k, d),
      i,
      e
    )(t) : d(t, c);
  }
};
function oe(e, t, s) {
  var r;
  const i = !((r = t.not_null) != null && r);
  return (n) => {
    if (xe(n)) {
      if (!i)
        throw new Error(`Column ${s ?? "unknown"} is not nullable`);
      return null;
    }
    return e(n, t);
  };
}
function xe(e) {
  return e === null || e === "NULL";
}
function _e(e) {
  return "key" in e;
}
function be(e) {
  return !_e(e);
}
function Qe(e) {
  return be(e) && e.headers.control === "up-to-date";
}
var K = class ve extends Error {
  constructor(t, s, r, i, n, o) {
    super(
      o || `HTTP Error ${t} at ${n}: ${s ?? JSON.stringify(r)}`
    ), this.url = n, this.name = "FetchError", this.status = t, this.text = s, this.json = r, this.headers = i;
  }
  static fromResponse(t, s) {
    return F(this, null, function* () {
      const r = t.status, i = Object.fromEntries([...t.headers.entries()]);
      let n, o;
      const l = t.headers.get("content-type");
      return l && l.includes("application/json") ? o = yield t.json() : n = yield t.text(), new ve(r, n, o, i, s);
    });
  }
}, we = class extends Error {
  constructor() {
    super("Fetch with backoff aborted");
  }
}, je = "electric-cursor", te = "electric-handle", Ee = "electric-offset", Ye = "electric-schema", Ve = "electric-up-to-date", $e = "database_id", Je = "columns", ze = "cursor", ye = "handle", Pe = "live", Ae = "offset", Ke = "table", Ge = "where", Xe = "replica", Ze = [429], me = {
  initialDelay: 100,
  maxDelay: 1e4,
  multiplier: 1.3
};
function et(e, t = me) {
  const {
    initialDelay: s,
    maxDelay: r,
    multiplier: i,
    debug: n = !1,
    onFailedAttempt: o
  } = t;
  return (...l) => F(this, null, function* () {
    var c;
    const f = l[0], d = l[1];
    let E = s, k = 0;
    for (; ; )
      try {
        const b = yield e(...l);
        if (b.ok) return b;
        throw yield K.fromResponse(b, f.toString());
      } catch (b) {
        if (o == null || o(), (c = d == null ? void 0 : d.signal) != null && c.aborted)
          throw new we();
        if (b instanceof K && !Ze.includes(b.status) && b.status >= 400 && b.status < 500)
          throw b;
        yield new Promise((Q) => setTimeout(Q, E)), E = Math.min(E * i, r), n && (k++, console.log(`Retry attempt #${k} after ${E}ms`));
      }
  });
}
var tt = {
  maxChunksToPrefetch: 2
};
function st(e, t = tt) {
  const { maxChunksToPrefetch: s } = t;
  let r;
  return (...n) => F(this, null, function* () {
    const o = n[0].toString(), l = r == null ? void 0 : r.consume(...n);
    if (l)
      return l;
    r == null || r.abort();
    const c = yield e(...n), f = ne(o, c);
    return f && (r = new rt({
      fetchClient: e,
      maxPrefetchedRequests: s,
      url: f,
      requestInit: n[1]
    })), c;
  });
}
var G, X, A, W, m, q, Z, rt = class {
  constructor(e) {
    u(this, q), u(this, G), u(this, X), u(this, A, /* @__PURE__ */ new Map()), u(this, W), u(this, m);
    var t;
    h(this, G, (t = e.fetchClient) != null ? t : (...s) => fetch(...s)), h(this, X, e.maxPrefetchedRequests), h(this, W, e.url.toString()), h(this, m, a(this, W)), _(this, q, Z).call(this, e.url, e.requestInit);
  }
  abort() {
    a(this, A).forEach(([e, t]) => t.abort());
  }
  consume(...e) {
    var t;
    const s = e[0].toString(), r = (t = a(this, A).get(s)) == null ? void 0 : t[0];
    if (!(!r || s !== a(this, W)))
      return a(this, A).delete(s), r.then((i) => {
        const n = ne(s, i);
        h(this, W, n), a(this, m) && !a(this, A).has(a(this, m)) && _(this, q, Z).call(this, a(this, m), e[1]);
      }).catch(() => {
      }), r;
  }
};
G = /* @__PURE__ */ new WeakMap();
X = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakSet();
Z = function(...e) {
  var t, s;
  const r = e[0].toString();
  if (a(this, A).size >= a(this, X)) return;
  const i = new AbortController();
  try {
    const n = a(this, G).call(this, r, pe(O({}, (t = e[1]) != null ? t : {}), {
      signal: at(i, (s = e[1]) == null ? void 0 : s.signal)
    }));
    a(this, A).set(r, [n, i]), n.then((o) => {
      if (!o.ok || i.signal.aborted) return;
      const l = ne(r, o);
      if (!l || l === r) {
        h(this, m, void 0);
        return;
      }
      return h(this, m, l), _(this, q, Z).call(this, l, e[1]);
    }).catch(() => {
    });
  } catch {
  }
};
function ne(e, t) {
  const s = t.headers.get(te), r = t.headers.get(Ee), i = t.headers.has(Ve);
  if (!s || !r || i) return;
  const n = new URL(e);
  if (!n.searchParams.has(Pe))
    return n.searchParams.set(ye, s), n.searchParams.set(Ae, r), n.toString();
}
function at(e, t) {
  return t && (t.aborted ? e.abort() : t.addEventListener("abort", () => e.abort(), {
    once: !0
  })), e.signal;
}
var V, $, g, R, H, I, M, w, T, P, N, L, J, B, y, se, Se, ke, Me, Te, Ue = class re {
  constructor(t) {
    u(this, y), u(this, V), u(this, $), u(this, g, /* @__PURE__ */ new Map()), u(this, R, /* @__PURE__ */ new Map()), u(this, H), u(this, I), u(this, M), u(this, w, !1), u(this, T, !1), u(this, P), u(this, N), u(this, L), u(this, J), u(this, B);
    var s, r, i;
    it(t), this.options = O({ subscribe: !0 }, t), h(this, H, (s = this.options.offset) != null ? s : "-1"), h(this, I, ""), h(this, P, this.options.shapeHandle), h(this, N, this.options.databaseId), h(this, $, new qe(t.parser)), h(this, B, this.options.replica);
    const n = (r = t.fetchClient) != null ? r : (...l) => fetch(...l), o = et(n, pe(O({}, (i = t.backoffOptions) != null ? i : me), {
      onFailedAttempt: () => {
        var l, c;
        h(this, T, !1), (c = (l = t.backoffOptions) == null ? void 0 : l.onFailedAttempt) == null || c.call(l);
      }
    }));
    h(this, V, st(o)), this.start();
  }
  get shapeHandle() {
    return a(this, P);
  }
  get isUpToDate() {
    return a(this, w);
  }
  get error() {
    return a(this, J);
  }
  start() {
    return F(this, null, function* () {
      var t, s;
      h(this, w, !1);
      const { url: r, table: i, where: n, columns: o, signal: l } = this.options;
      try {
        for (; !(l != null && l.aborted) && !a(this, w) || this.options.subscribe; ) {
          const c = new URL(r);
          i && c.searchParams.set(Ke, i), n && c.searchParams.set(Ge, n), o && o.length > 0 && c.searchParams.set(Je, o.join(",")), c.searchParams.set(Ae, a(this, H)), a(this, w) && (c.searchParams.set(Pe, "true"), c.searchParams.set(
            ze,
            a(this, I)
          )), a(this, P) && c.searchParams.set(
            ye,
            a(this, P)
          ), a(this, N) && c.searchParams.set($e, a(this, N)), ((t = a(this, B)) != null ? t : re.Replica.DEFAULT) != re.Replica.DEFAULT && c.searchParams.set(Xe, a(this, B));
          let f;
          try {
            f = yield a(this, V).call(this, c.toString(), {
              signal: l,
              headers: this.options.headers
            }), h(this, T, !0);
          } catch (p) {
            if (p instanceof we) break;
            if (!(p instanceof K)) throw p;
            if (p.status == 409) {
              const ee = p.headers[te];
              _(this, y, Te).call(this, ee), yield _(this, y, se).call(this, p.json);
              continue;
            } else if (p.status >= 400 && p.status < 500)
              throw _(this, y, Me).call(this, p), _(this, y, Se).call(this, p), p;
          }
          const { headers: d, status: E } = f, k = d.get(te);
          k && h(this, P, k);
          const b = d.get(Ee);
          b && h(this, H, b);
          const Q = d.get(je);
          Q && h(this, I, Q);
          const Re = () => {
            const p = d.get(Ye);
            return p ? JSON.parse(p) : {};
          };
          h(this, L, (s = a(this, L)) != null ? s : Re());
          const De = E === 204 ? "[]" : yield f.text();
          E === 204 && h(this, M, Date.now());
          const j = a(this, $).parse(De, a(this, L));
          if (j.length > 0) {
            const p = a(this, w), ee = j[j.length - 1];
            Qe(ee) && (h(this, M, Date.now()), h(this, w, !0)), yield _(this, y, se).call(this, j), !p && a(this, w) && _(this, y, ke).call(this);
          }
        }
      } catch (c) {
        h(this, J, c);
      } finally {
        h(this, T, !1);
      }
    });
  }
  subscribe(t, s) {
    const r = Math.random();
    return a(this, g).set(r, [t, s]), () => {
      a(this, g).delete(r);
    };
  }
  unsubscribeAll() {
    a(this, g).clear();
  }
  subscribeOnceToUpToDate(t, s) {
    const r = Math.random();
    return a(this, R).set(r, [t, s]), () => {
      a(this, R).delete(r);
    };
  }
  unsubscribeAllUpToDateSubscribers() {
    a(this, R).clear();
  }
  /** Unix time at which we last synced. Undefined when `isLoading` is true. */
  lastSyncedAt() {
    return a(this, M);
  }
  /** Time elapsed since last sync (in ms). Infinity if we did not yet sync. */
  lastSynced() {
    return a(this, M) === void 0 ? 1 / 0 : Date.now() - a(this, M);
  }
  /** Indicates if we are connected to the Electric sync service. */
  isConnected() {
    return a(this, T);
  }
  /** True during initial fetch. False afterwise.  */
  isLoading() {
    return !this.isUpToDate;
  }
};
V = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
T = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakMap();
N = /* @__PURE__ */ new WeakMap();
L = /* @__PURE__ */ new WeakMap();
J = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakSet();
se = function(e) {
  return F(this, null, function* () {
    yield Promise.all(
      Array.from(a(this, g).values()).map((t) => F(this, [t], function* ([s, r]) {
        try {
          yield s(e);
        } catch (i) {
          queueMicrotask(() => {
            throw i;
          });
        }
      }))
    );
  });
};
Se = function(e) {
  a(this, g).forEach(([t, s]) => {
    s == null || s(e);
  });
};
ke = function() {
  a(this, R).forEach(([e]) => {
    e();
  });
};
Me = function(e) {
  a(this, R).forEach(
    ([t, s]) => s(e)
  );
};
Te = function(e) {
  h(this, H, "-1"), h(this, I, ""), h(this, P, e), h(this, w, !1), h(this, T, !1), h(this, L, void 0);
};
Ue.Replica = {
  FULL: "full",
  DEFAULT: "default"
};
var nt = Ue;
function it(e) {
  if (!e.url)
    throw new Error("Invalid shape options. It must provide the url");
  if (e.signal && !(e.signal instanceof AbortSignal))
    throw new Error(
      "Invalid signal option. It must be an instance of AbortSignal."
    );
  if (e.offset !== void 0 && e.offset !== "-1" && !e.shapeHandle)
    throw new Error(
      "shapeHandle is required if this isn't an initial fetch (i.e. offset > -1)"
    );
}
var v, S, U, x, D, C, ge, ae, he, ht = class {
  constructor(e) {
    u(this, C), u(this, v), u(this, S, /* @__PURE__ */ new Map()), u(this, U, /* @__PURE__ */ new Map()), u(this, x, !1), u(this, D, !1), h(this, v, e), a(this, v).subscribe(
      _(this, C, ge).bind(this),
      _(this, C, ae).bind(this)
    );
    const t = a(this, v).subscribeOnceToUpToDate(
      () => {
        t();
      },
      (s) => {
        throw _(this, C, ae).call(this, s), s;
      }
    );
  }
  get isUpToDate() {
    return a(this, v).isUpToDate;
  }
  get rows() {
    return this.value.then((e) => Array.from(e.values()));
  }
  get currentRows() {
    return Array.from(this.currentValue.values());
  }
  get value() {
    return new Promise((e, t) => {
      if (a(this, v).isUpToDate)
        e(this.currentValue);
      else {
        const s = this.subscribe(({ value: r }) => {
          s(), a(this, D) && t(a(this, D)), e(r);
        });
      }
    });
  }
  get currentValue() {
    return a(this, S);
  }
  get error() {
    return a(this, D);
  }
  /** Unix time at which we last synced. Undefined when `isLoading` is true. */
  lastSyncedAt() {
    return a(this, v).lastSyncedAt();
  }
  /** Time elapsed since last sync (in ms). Infinity if we did not yet sync. */
  lastSynced() {
    return a(this, v).lastSynced();
  }
  /** True during initial fetch. False afterwise.  */
  isLoading() {
    return a(this, v).isLoading();
  }
  /** Indicates if we are connected to the Electric sync service. */
  isConnected() {
    return a(this, v).isConnected();
  }
  subscribe(e) {
    const t = Math.random();
    return a(this, U).set(t, e), () => {
      a(this, U).delete(t);
    };
  }
  unsubscribeAll() {
    a(this, U).clear();
  }
  get numSubscribers() {
    return a(this, U).size;
  }
};
v = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
ge = function(e) {
  let t = !1, s = !1, r = !1;
  e.forEach((i) => {
    if (_e(i))
      switch (t = ["insert", "update", "delete"].includes(
        i.headers.operation
      ), i.headers.operation) {
        case "insert":
          a(this, S).set(i.key, i.value);
          break;
        case "update":
          a(this, S).set(i.key, O(O({}, a(this, S).get(i.key)), i.value));
          break;
        case "delete":
          a(this, S).delete(i.key);
          break;
      }
    if (be(i))
      switch (i.headers.control) {
        case "up-to-date":
          s = !0, a(this, x) || (r = !0);
          break;
        case "must-refetch":
          a(this, S).clear(), h(this, D, !1), h(this, x, !1), s = !1, r = !1;
          break;
      }
  }), (r || s && t) && (h(this, x, !0), _(this, C, he).call(this));
};
ae = function(e) {
  e instanceof K && (h(this, D, e), _(this, C, he).call(this));
};
he = function() {
  a(this, U).forEach((e) => {
    e({ value: this.currentValue, rows: this.currentRows });
  });
};
export {
  me as BackoffDefaults,
  K as FetchError,
  ht as Shape,
  nt as ShapeStream,
  _e as isChangeMessage,
  be as isControlMessage
};
