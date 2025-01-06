const J = crypto, H = (t) => t instanceof CryptoKey, S = new TextEncoder(), W = new TextDecoder();
function B(...t) {
  const e = t.reduce((n, { length: o }) => n + o, 0), r = new Uint8Array(e);
  let s = 0;
  for (const n of t)
    r.set(n, s), s += n.length;
  return r;
}
const q = (t) => {
  let e = t;
  typeof e == "string" && (e = S.encode(e));
  const r = 32768, s = [];
  for (let n = 0; n < e.length; n += r)
    s.push(String.fromCharCode.apply(null, e.subarray(n, n + r)));
  return btoa(s.join(""));
}, R = (t) => q(t).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"), z = (t) => {
  const e = atob(t), r = new Uint8Array(e.length);
  for (let s = 0; s < e.length; s++)
    r[s] = e.charCodeAt(s);
  return r;
}, P = (t) => {
  let e = t;
  e instanceof Uint8Array && (e = W.decode(e)), e = e.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return z(e);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
};
class i extends Error {
  constructor(e, r) {
    var s;
    super(e, r), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, (s = Error.captureStackTrace) == null || s.call(Error, this, this.constructor);
  }
}
i.code = "ERR_JOSE_GENERIC";
class Y extends i {
  constructor(e, r, s = "unspecified", n = "unspecified") {
    super(e, { cause: { claim: s, reason: n, payload: r } }), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = s, this.reason = n, this.payload = r;
  }
}
Y.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
class X extends i {
  constructor(e, r, s = "unspecified", n = "unspecified") {
    super(e, { cause: { claim: s, reason: n, payload: r } }), this.code = "ERR_JWT_EXPIRED", this.claim = s, this.reason = n, this.payload = r;
  }
}
X.code = "ERR_JWT_EXPIRED";
class Z extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
}
Z.code = "ERR_JOSE_ALG_NOT_ALLOWED";
class h extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
}
h.code = "ERR_JOSE_NOT_SUPPORTED";
class Q extends i {
  constructor(e = "decryption operation failed", r) {
    super(e, r), this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
}
Q.code = "ERR_JWE_DECRYPTION_FAILED";
class k extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JWE_INVALID";
  }
}
k.code = "ERR_JWE_INVALID";
class f extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JWS_INVALID";
  }
}
f.code = "ERR_JWS_INVALID";
class O extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JWT_INVALID";
  }
}
O.code = "ERR_JWT_INVALID";
class ee extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JWK_INVALID";
  }
}
ee.code = "ERR_JWK_INVALID";
class te extends i {
  constructor() {
    super(...arguments), this.code = "ERR_JWKS_INVALID";
  }
}
te.code = "ERR_JWKS_INVALID";
class re extends i {
  constructor(e = "no applicable key found in the JSON Web Key Set", r) {
    super(e, r), this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
}
re.code = "ERR_JWKS_NO_MATCHING_KEY";
class se extends i {
  constructor(e = "multiple matching keys found in the JSON Web Key Set", r) {
    super(e, r), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
}
se.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
class ne extends i {
  constructor(e = "request timed out", r) {
    super(e, r), this.code = "ERR_JWKS_TIMEOUT";
  }
}
ne.code = "ERR_JWKS_TIMEOUT";
class oe extends i {
  constructor(e = "signature verification failed", r) {
    super(e, r), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
}
oe.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
function c(t, e = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${e} must be ${t}`);
}
function b(t, e) {
  return t.name === e;
}
function T(t) {
  return parseInt(t.name.slice(4), 10);
}
function ae(t) {
  switch (t) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function ie(t, e) {
  if (e.length && !e.some((r) => t.usages.includes(r))) {
    let r = "CryptoKey does not support this operation, its usages must include ";
    if (e.length > 2) {
      const s = e.pop();
      r += `one of ${e.join(", ")}, or ${s}.`;
    } else e.length === 2 ? r += `one of ${e[0]} or ${e[1]}.` : r += `${e[0]}.`;
    throw new TypeError(r);
  }
}
function ce(t, e, ...r) {
  switch (e) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!b(t.algorithm, "HMAC"))
        throw c("HMAC");
      const s = parseInt(e.slice(2), 10);
      if (T(t.algorithm.hash) !== s)
        throw c(`SHA-${s}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!b(t.algorithm, "RSASSA-PKCS1-v1_5"))
        throw c("RSASSA-PKCS1-v1_5");
      const s = parseInt(e.slice(2), 10);
      if (T(t.algorithm.hash) !== s)
        throw c(`SHA-${s}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!b(t.algorithm, "RSA-PSS"))
        throw c("RSA-PSS");
      const s = parseInt(e.slice(2), 10);
      if (T(t.algorithm.hash) !== s)
        throw c(`SHA-${s}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (t.algorithm.name !== "Ed25519" && t.algorithm.name !== "Ed448")
        throw c("Ed25519 or Ed448");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!b(t.algorithm, "ECDSA"))
        throw c("ECDSA");
      const s = ae(e);
      if (t.algorithm.namedCurve !== s)
        throw c(s, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  ie(t, r);
}
function D(t, e, ...r) {
  var s;
  if (r = r.filter(Boolean), r.length > 2) {
    const n = r.pop();
    t += `one of type ${r.join(", ")}, or ${n}.`;
  } else r.length === 2 ? t += `one of type ${r[0]} or ${r[1]}.` : t += `of type ${r[0]}.`;
  return e == null ? t += ` Received ${e}` : typeof e == "function" && e.name ? t += ` Received function ${e.name}` : typeof e == "object" && e != null && (s = e.constructor) != null && s.name && (t += ` Received an instance of ${e.constructor.name}`), t;
}
const v = (t, ...e) => D("Key must be ", t, ...e);
function N(t, e, ...r) {
  return D(`Key for the ${t} algorithm must be `, e, ...r);
}
const $ = (t) => H(t) ? !0 : (t == null ? void 0 : t[Symbol.toStringTag]) === "KeyObject", g = ["CryptoKey"], de = (...t) => {
  const e = t.filter(Boolean);
  if (e.length === 0 || e.length === 1)
    return !0;
  let r;
  for (const s of e) {
    const n = Object.keys(s);
    if (!r || r.size === 0) {
      r = new Set(n);
      continue;
    }
    for (const o of n) {
      if (r.has(o))
        return !1;
      r.add(o);
    }
  }
  return !0;
};
function ue(t) {
  return typeof t == "object" && t !== null;
}
function x(t) {
  if (!ue(t) || Object.prototype.toString.call(t) !== "[object Object]")
    return !1;
  if (Object.getPrototypeOf(t) === null)
    return !0;
  let e = t;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(t) === e;
}
const he = (t, e) => {
  if (t.startsWith("RS") || t.startsWith("PS")) {
    const { modulusLength: r } = e.algorithm;
    if (typeof r != "number" || r < 2048)
      throw new TypeError(`${t} requires key modulusLength to be 2048 bits or larger`);
  }
};
function y(t) {
  return x(t) && typeof t.kty == "string";
}
function le(t) {
  return t.kty !== "oct" && typeof t.d == "string";
}
function pe(t) {
  return t.kty !== "oct" && typeof t.d > "u";
}
function fe(t) {
  return y(t) && t.kty === "oct" && typeof t.k == "string";
}
function me(t) {
  let e, r;
  switch (t.kty) {
    case "RSA": {
      switch (t.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          e = { name: "RSA-PSS", hash: `SHA-${t.alg.slice(-3)}` }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          e = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${t.alg.slice(-3)}` }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          e = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(t.alg.slice(-3), 10) || 1}`
          }, r = t.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new h('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (t.alg) {
        case "ES256":
          e = { name: "ECDSA", namedCurve: "P-256" }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          e = { name: "ECDSA", namedCurve: "P-384" }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          e = { name: "ECDSA", namedCurve: "P-521" }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          e = { name: "ECDH", namedCurve: t.crv }, r = t.d ? ["deriveBits"] : [];
          break;
        default:
          throw new h('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (t.alg) {
        case "EdDSA":
          e = { name: t.crv }, r = t.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          e = { name: t.crv }, r = t.d ? ["deriveBits"] : [];
          break;
        default:
          throw new h('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new h('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm: e, keyUsages: r };
}
const Se = async (t) => {
  if (!t.alg)
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  const { algorithm: e, keyUsages: r } = me(t), s = [
    e,
    t.ext ?? !1,
    t.key_ops ?? r
  ], n = { ...t };
  return delete n.alg, delete n.use, J.subtle.importKey("jwk", n, ...s);
}, L = (t) => P(t);
let l, p;
const M = (t) => (t == null ? void 0 : t[Symbol.toStringTag]) === "KeyObject", A = async (t, e, r, s, n = !1) => {
  let o = t.get(e);
  if (o != null && o[s])
    return o[s];
  const a = await Se({ ...r, alg: s });
  return n && Object.freeze(e), o ? o[s] = a : t.set(e, { [s]: a }), a;
}, ye = (t, e) => {
  if (M(t)) {
    let r = t.export({ format: "jwk" });
    return delete r.d, delete r.dp, delete r.dq, delete r.p, delete r.q, delete r.qi, r.k ? L(r.k) : (p || (p = /* @__PURE__ */ new WeakMap()), A(p, t, r, e));
  }
  return y(t) ? t.k ? P(t.k) : (p || (p = /* @__PURE__ */ new WeakMap()), A(p, t, t, e, !0)) : t;
}, Ee = (t, e) => {
  if (M(t)) {
    let r = t.export({ format: "jwk" });
    return r.k ? L(r.k) : (l || (l = /* @__PURE__ */ new WeakMap()), A(l, t, r, e));
  }
  return y(t) ? t.k ? P(t.k) : (l || (l = /* @__PURE__ */ new WeakMap()), A(l, t, t, e, !0)) : t;
}, _e = { normalizePublicKey: ye, normalizePrivateKey: Ee }, m = (t) => t == null ? void 0 : t[Symbol.toStringTag], I = (t, e, r) => {
  var s, n;
  if (e.use !== void 0 && e.use !== "sig")
    throw new TypeError("Invalid key for this operation, when present its use must be sig");
  if (e.key_ops !== void 0 && ((n = (s = e.key_ops).includes) == null ? void 0 : n.call(s, r)) !== !0)
    throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${r}`);
  if (e.alg !== void 0 && e.alg !== t)
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${t}`);
  return !0;
}, we = (t, e, r, s) => {
  if (!(e instanceof Uint8Array)) {
    if (s && y(e)) {
      if (fe(e) && I(t, e, r))
        return;
      throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
    }
    if (!$(e))
      throw new TypeError(N(t, e, ...g, "Uint8Array", s ? "JSON Web Key" : null));
    if (e.type !== "secret")
      throw new TypeError(`${m(e)} instances for symmetric algorithms must be of type "secret"`);
  }
}, be = (t, e, r, s) => {
  if (s && y(e))
    switch (r) {
      case "sign":
        if (le(e) && I(t, e, r))
          return;
        throw new TypeError("JSON Web Key for this operation be a private JWK");
      case "verify":
        if (pe(e) && I(t, e, r))
          return;
        throw new TypeError("JSON Web Key for this operation be a public JWK");
    }
  if (!$(e))
    throw new TypeError(N(t, e, ...g, s ? "JSON Web Key" : null));
  if (e.type === "secret")
    throw new TypeError(`${m(e)} instances for asymmetric algorithms must not be of type "secret"`);
  if (r === "sign" && e.type === "public")
    throw new TypeError(`${m(e)} instances for asymmetric algorithm signing must be of type "private"`);
  if (r === "decrypt" && e.type === "public")
    throw new TypeError(`${m(e)} instances for asymmetric algorithm decryption must be of type "private"`);
  if (e.algorithm && r === "verify" && e.type === "private")
    throw new TypeError(`${m(e)} instances for asymmetric algorithm verifying must be of type "public"`);
  if (e.algorithm && r === "encrypt" && e.type === "private")
    throw new TypeError(`${m(e)} instances for asymmetric algorithm encryption must be of type "public"`);
};
function U(t, e, r, s) {
  e.startsWith("HS") || e === "dir" || e.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(e) ? we(e, r, s, t) : be(e, r, s, t);
}
U.bind(void 0, !1);
const ge = U.bind(void 0, !0);
function Ae(t, e, r, s, n) {
  if (n.crit !== void 0 && (s == null ? void 0 : s.crit) === void 0)
    throw new t('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!s || s.crit === void 0)
    return /* @__PURE__ */ new Set();
  if (!Array.isArray(s.crit) || s.crit.length === 0 || s.crit.some((a) => typeof a != "string" || a.length === 0))
    throw new t('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  let o;
  r !== void 0 ? o = new Map([...Object.entries(r), ...e.entries()]) : o = e;
  for (const a of s.crit) {
    if (!o.has(a))
      throw new h(`Extension Header Parameter "${a}" is not recognized`);
    if (n[a] === void 0)
      throw new t(`Extension Header Parameter "${a}" is missing`);
    if (o.get(a) && s[a] === void 0)
      throw new t(`Extension Header Parameter "${a}" MUST be integrity protected`);
  }
  return new Set(s.crit);
}
function Re(t, e) {
  const r = `SHA-${t.slice(-3)}`;
  switch (t) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash: r, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash: r, name: "RSA-PSS", saltLength: t.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash: r, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash: r, name: "ECDSA", namedCurve: e.namedCurve };
    case "EdDSA":
      return { name: e.name };
    default:
      throw new h(`alg ${t} is not supported either by JOSE or your javascript runtime`);
  }
}
async function Te(t, e, r) {
  if (e = await _e.normalizePrivateKey(e, t), H(e))
    return ce(e, t, r), e;
  if (e instanceof Uint8Array) {
    if (!t.startsWith("HS"))
      throw new TypeError(v(e, ...g));
    return J.subtle.importKey("raw", e, { hash: `SHA-${t.slice(-3)}`, name: "HMAC" }, !1, [r]);
  }
  throw new TypeError(v(e, ...g, "Uint8Array", "JSON Web Key"));
}
const d = (t) => Math.floor(t.getTime() / 1e3), V = 60, F = V * 60, C = F * 24, Ke = C * 7, We = C * 365.25, Ie = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, K = (t) => {
  const e = Ie.exec(t);
  if (!e || e[4] && e[1])
    throw new TypeError("Invalid time period format");
  const r = parseFloat(e[2]), s = e[3].toLowerCase();
  let n;
  switch (s) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      n = Math.round(r);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      n = Math.round(r * V);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      n = Math.round(r * F);
      break;
    case "day":
    case "days":
    case "d":
      n = Math.round(r * C);
      break;
    case "week":
    case "weeks":
    case "w":
      n = Math.round(r * Ke);
      break;
    default:
      n = Math.round(r * We);
      break;
  }
  return e[1] === "-" || e[4] === "ago" ? -n : n;
}, Je = async (t, e, r) => {
  const s = await Te(t, e, "sign");
  he(t, s);
  const n = await J.subtle.sign(Re(t, s.algorithm), s, r);
  return new Uint8Array(n);
};
class Pe {
  constructor(e) {
    if (!(e instanceof Uint8Array))
      throw new TypeError("payload must be an instance of Uint8Array");
    this._payload = e;
  }
  setProtectedHeader(e) {
    if (this._protectedHeader)
      throw new TypeError("setProtectedHeader can only be called once");
    return this._protectedHeader = e, this;
  }
  setUnprotectedHeader(e) {
    if (this._unprotectedHeader)
      throw new TypeError("setUnprotectedHeader can only be called once");
    return this._unprotectedHeader = e, this;
  }
  async sign(e, r) {
    if (!this._protectedHeader && !this._unprotectedHeader)
      throw new f("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    if (!de(this._protectedHeader, this._unprotectedHeader))
      throw new f("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    const s = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    }, n = Ae(f, /* @__PURE__ */ new Map([["b64", !0]]), r == null ? void 0 : r.crit, this._protectedHeader, s);
    let o = !0;
    if (n.has("b64") && (o = this._protectedHeader.b64, typeof o != "boolean"))
      throw new f('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    const { alg: a } = s;
    if (typeof a != "string" || !a)
      throw new f('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    ge(a, e, "sign");
    let E = this._payload;
    o && (E = S.encode(R(E)));
    let _;
    this._protectedHeader ? _ = S.encode(R(JSON.stringify(this._protectedHeader))) : _ = S.encode("");
    const j = B(_, S.encode("."), E), G = await Je(a, e, j), w = {
      signature: R(G),
      payload: ""
    };
    return o && (w.payload = W.decode(E)), this._unprotectedHeader && (w.header = this._unprotectedHeader), this._protectedHeader && (w.protected = W.decode(_)), w;
  }
}
class Ce {
  constructor(e) {
    this._flattened = new Pe(e);
  }
  setProtectedHeader(e) {
    return this._flattened.setProtectedHeader(e), this;
  }
  async sign(e, r) {
    const s = await this._flattened.sign(e, r);
    if (s.payload === void 0)
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    return `${s.protected}.${s.payload}.${s.signature}`;
  }
}
function u(t, e) {
  if (!Number.isFinite(e))
    throw new TypeError(`Invalid ${t} input`);
  return e;
}
class ve {
  constructor(e = {}) {
    if (!x(e))
      throw new TypeError("JWT Claims Set MUST be an object");
    this._payload = e;
  }
  setIssuer(e) {
    return this._payload = { ...this._payload, iss: e }, this;
  }
  setSubject(e) {
    return this._payload = { ...this._payload, sub: e }, this;
  }
  setAudience(e) {
    return this._payload = { ...this._payload, aud: e }, this;
  }
  setJti(e) {
    return this._payload = { ...this._payload, jti: e }, this;
  }
  setNotBefore(e) {
    return typeof e == "number" ? this._payload = { ...this._payload, nbf: u("setNotBefore", e) } : e instanceof Date ? this._payload = { ...this._payload, nbf: u("setNotBefore", d(e)) } : this._payload = { ...this._payload, nbf: d(/* @__PURE__ */ new Date()) + K(e) }, this;
  }
  setExpirationTime(e) {
    return typeof e == "number" ? this._payload = { ...this._payload, exp: u("setExpirationTime", e) } : e instanceof Date ? this._payload = { ...this._payload, exp: u("setExpirationTime", d(e)) } : this._payload = { ...this._payload, exp: d(/* @__PURE__ */ new Date()) + K(e) }, this;
  }
  setIssuedAt(e) {
    return typeof e > "u" ? this._payload = { ...this._payload, iat: d(/* @__PURE__ */ new Date()) } : e instanceof Date ? this._payload = { ...this._payload, iat: u("setIssuedAt", d(e)) } : typeof e == "string" ? this._payload = {
      ...this._payload,
      iat: u("setIssuedAt", d(/* @__PURE__ */ new Date()) + K(e))
    } : this._payload = { ...this._payload, iat: u("setIssuedAt", e) }, this;
  }
}
class He extends ve {
  setProtectedHeader(e) {
    return this._protectedHeader = e, this;
  }
  async sign(e, r) {
    var n;
    const s = new Ce(S.encode(JSON.stringify(this._payload)));
    if (s.setProtectedHeader(this._protectedHeader), Array.isArray((n = this._protectedHeader) == null ? void 0 : n.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === !1)
      throw new O("JWTs MUST NOT use unencoded payload");
    return s.sign(e, r);
  }
}
export {
  Ce as CompactSign,
  Pe as FlattenedSign,
  He as SignJWT
};
