/*! For license information please see index.bunde.js.LICENSE.txt */
(() => {
  "use strict";
  var e = {};
  e.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })();
  const t = function (e) {
      const t = [];
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        let r = e.charCodeAt(i);
        r < 128
          ? (t[n++] = r)
          : r < 2048
          ? ((t[n++] = (r >> 6) | 192), (t[n++] = (63 & r) | 128))
          : 55296 == (64512 & r) &&
            i + 1 < e.length &&
            56320 == (64512 & e.charCodeAt(i + 1))
          ? ((r = 65536 + ((1023 & r) << 10) + (1023 & e.charCodeAt(++i))),
            (t[n++] = (r >> 18) | 240),
            (t[n++] = ((r >> 12) & 63) | 128),
            (t[n++] = ((r >> 6) & 63) | 128),
            (t[n++] = (63 & r) | 128))
          : ((t[n++] = (r >> 12) | 224),
            (t[n++] = ((r >> 6) & 63) | 128),
            (t[n++] = (63 & r) | 128));
      }
      return t;
    },
    n = {
      byteToCharMap_: null,
      charToByteMap_: null,
      byteToCharMapWebSafe_: null,
      charToByteMapWebSafe_: null,
      ENCODED_VALS_BASE:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/=";
      },
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_.";
      },
      HAS_NATIVE_SUPPORT: "function" == typeof atob,
      encodeByteArray(e, t) {
        if (!Array.isArray(e))
          throw Error("encodeByteArray takes an array as a parameter");
        this.init_();
        const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          i = [];
        for (let t = 0; t < e.length; t += 3) {
          const r = e[t],
            s = t + 1 < e.length,
            o = s ? e[t + 1] : 0,
            a = t + 2 < e.length,
            h = a ? e[t + 2] : 0,
            c = r >> 2,
            l = ((3 & r) << 4) | (o >> 4);
          let u = ((15 & o) << 2) | (h >> 6),
            d = 63 & h;
          a || ((d = 64), s || (u = 64)), i.push(n[c], n[l], n[u], n[d]);
        }
        return i.join("");
      },
      encodeString(e, n) {
        return this.HAS_NATIVE_SUPPORT && !n
          ? btoa(e)
          : this.encodeByteArray(t(e), n);
      },
      decodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? atob(e)
          : (function (e) {
              const t = [];
              let n = 0,
                i = 0;
              for (; n < e.length; ) {
                const r = e[n++];
                if (r < 128) t[i++] = String.fromCharCode(r);
                else if (r > 191 && r < 224) {
                  const s = e[n++];
                  t[i++] = String.fromCharCode(((31 & r) << 6) | (63 & s));
                } else if (r > 239 && r < 365) {
                  const s =
                    (((7 & r) << 18) |
                      ((63 & e[n++]) << 12) |
                      ((63 & e[n++]) << 6) |
                      (63 & e[n++])) -
                    65536;
                  (t[i++] = String.fromCharCode(55296 + (s >> 10))),
                    (t[i++] = String.fromCharCode(56320 + (1023 & s)));
                } else {
                  const s = e[n++],
                    o = e[n++];
                  t[i++] = String.fromCharCode(
                    ((15 & r) << 12) | ((63 & s) << 6) | (63 & o)
                  );
                }
              }
              return t.join("");
            })(this.decodeStringToByteArray(e, t));
      },
      decodeStringToByteArray(e, t) {
        this.init_();
        const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          r = [];
        for (let t = 0; t < e.length; ) {
          const s = n[e.charAt(t++)],
            o = t < e.length ? n[e.charAt(t)] : 0;
          ++t;
          const a = t < e.length ? n[e.charAt(t)] : 64;
          ++t;
          const h = t < e.length ? n[e.charAt(t)] : 64;
          if ((++t, null == s || null == o || null == a || null == h))
            throw new i();
          const c = (s << 2) | (o >> 4);
          if ((r.push(c), 64 !== a)) {
            const e = ((o << 4) & 240) | (a >> 2);
            if ((r.push(e), 64 !== h)) {
              const e = ((a << 6) & 192) | h;
              r.push(e);
            }
          }
        }
        return r;
      },
      init_() {
        if (!this.byteToCharMap_) {
          (this.byteToCharMap_ = {}),
            (this.charToByteMap_ = {}),
            (this.byteToCharMapWebSafe_ = {}),
            (this.charToByteMapWebSafe_ = {});
          for (let e = 0; e < this.ENCODED_VALS.length; e++)
            (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
              (this.charToByteMap_[this.byteToCharMap_[e]] = e),
              (this.byteToCharMapWebSafe_[e] =
                this.ENCODED_VALS_WEBSAFE.charAt(e)),
              (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
              e >= this.ENCODED_VALS_BASE.length &&
                ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
        }
      },
    };
  class i extends Error {
    constructor() {
      super(...arguments), (this.name = "DecodeBase64StringError");
    }
  }
  const r = function (e) {
      return (function (e) {
        const i = t(e);
        return n.encodeByteArray(i, !0);
      })(e).replace(/\./g, "");
    },
    s = function (e) {
      try {
        return n.decodeString(e, !0);
      } catch (e) {
        console.error("base64Decode failed: ", e);
      }
      return null;
    },
    o = () => {
      try {
        return (
          (function () {
            if ("undefined" != typeof self) return self;
            if ("undefined" != typeof window) return window;
            if (void 0 !== e.g) return e.g;
            throw new Error("Unable to locate global object.");
          })().__FIREBASE_DEFAULTS__ ||
          (() => {
            if ("undefined" == typeof process || void 0 === process.env) return;
            const e = process.env.__FIREBASE_DEFAULTS__;
            return e ? JSON.parse(e) : void 0;
          })() ||
          (() => {
            if ("undefined" == typeof document) return;
            let e;
            try {
              e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
            } catch (e) {
              return;
            }
            const t = e && s(e[1]);
            return t && JSON.parse(t);
          })()
        );
      } catch (e) {
        return void console.info(
          `Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
        );
      }
    },
    a = () => {
      var e;
      return null === (e = o()) || void 0 === e ? void 0 : e.config;
    },
    h = (e) => {
      var t;
      return null === (t = o()) || void 0 === t ? void 0 : t[`_${e}`];
    };
  class c {
    constructor() {
      (this.reject = () => {}),
        (this.resolve = () => {}),
        (this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        }));
    }
    wrapCallback(e) {
      return (t, n) => {
        t ? this.reject(t) : this.resolve(n),
          "function" == typeof e &&
            (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
      };
    }
  }
  function l() {
    return "undefined" != typeof navigator &&
      "string" == typeof navigator.userAgent
      ? navigator.userAgent
      : "";
  }
  class u extends Error {
    constructor(e, t, n) {
      super(t),
        (this.code = e),
        (this.customData = n),
        (this.name = "FirebaseError"),
        Object.setPrototypeOf(this, u.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, d.prototype.create);
    }
  }
  class d {
    constructor(e, t, n) {
      (this.service = e), (this.serviceName = t), (this.errors = n);
    }
    create(e, ...t) {
      const n = t[0] || {},
        i = `${this.service}/${e}`,
        r = this.errors[e],
        s = r
          ? (function (e, t) {
              return e.replace(p, (e, n) => {
                const i = t[n];
                return null != i ? String(i) : `<${n}?>`;
              });
            })(r, n)
          : "Error",
        o = `${this.serviceName}: ${s} (${i}).`;
      return new u(i, o, n);
    }
  }
  const p = /\{\$([^}]+)}/g;
  function f(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
      i = Object.keys(t);
    for (const r of n) {
      if (!i.includes(r)) return !1;
      const n = e[r],
        s = t[r];
      if (g(n) && g(s)) {
        if (!f(n, s)) return !1;
      } else if (n !== s) return !1;
    }
    for (const e of i) if (!n.includes(e)) return !1;
    return !0;
  }
  function g(e) {
    return null !== e && "object" == typeof e;
  }
  function m(e) {
    const t = [];
    for (const [n, i] of Object.entries(e))
      Array.isArray(i)
        ? i.forEach((e) => {
            t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e));
          })
        : t.push(encodeURIComponent(n) + "=" + encodeURIComponent(i));
    return t.length ? "&" + t.join("&") : "";
  }
  function v(e) {
    const t = {};
    return (
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((e) => {
          if (e) {
            const [n, i] = e.split("=");
            t[decodeURIComponent(n)] = decodeURIComponent(i);
          }
        }),
      t
    );
  }
  function y(e) {
    const t = e.indexOf("?");
    if (!t) return "";
    const n = e.indexOf("#", t);
    return e.substring(t, n > 0 ? n : void 0);
  }
  class w {
    constructor(e, t) {
      (this.observers = []),
        (this.unsubscribes = []),
        (this.observerCount = 0),
        (this.task = Promise.resolve()),
        (this.finalized = !1),
        (this.onNoObservers = t),
        this.task
          .then(() => {
            e(this);
          })
          .catch((e) => {
            this.error(e);
          });
    }
    next(e) {
      this.forEachObserver((t) => {
        t.next(e);
      });
    }
    error(e) {
      this.forEachObserver((t) => {
        t.error(e);
      }),
        this.close(e);
    }
    complete() {
      this.forEachObserver((e) => {
        e.complete();
      }),
        this.close();
    }
    subscribe(e, t, n) {
      let i;
      if (void 0 === e && void 0 === t && void 0 === n)
        throw new Error("Missing Observer.");
      (i = (function (e, t) {
        if ("object" != typeof e || null === e) return !1;
        for (const t of ["next", "error", "complete"])
          if (t in e && "function" == typeof e[t]) return !0;
        return !1;
      })(e)
        ? e
        : { next: e, error: t, complete: n }),
        void 0 === i.next && (i.next = _),
        void 0 === i.error && (i.error = _),
        void 0 === i.complete && (i.complete = _);
      const r = this.unsubscribeOne.bind(this, this.observers.length);
      return (
        this.finalized &&
          this.task.then(() => {
            try {
              this.finalError ? i.error(this.finalError) : i.complete();
            } catch (e) {}
          }),
        this.observers.push(i),
        r
      );
    }
    unsubscribeOne(e) {
      void 0 !== this.observers &&
        void 0 !== this.observers[e] &&
        (delete this.observers[e],
        (this.observerCount -= 1),
        0 === this.observerCount &&
          void 0 !== this.onNoObservers &&
          this.onNoObservers(this));
    }
    forEachObserver(e) {
      if (!this.finalized)
        for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
    }
    sendOne(e, t) {
      this.task.then(() => {
        if (void 0 !== this.observers && void 0 !== this.observers[e])
          try {
            t(this.observers[e]);
          } catch (e) {
            "undefined" != typeof console && console.error && console.error(e);
          }
      });
    }
    close(e) {
      this.finalized ||
        ((this.finalized = !0),
        void 0 !== e && (this.finalError = e),
        this.task.then(() => {
          (this.observers = void 0), (this.onNoObservers = void 0);
        }));
    }
  }
  function _() {}
  function b(e) {
    return e && e._delegate ? e._delegate : e;
  }
  class I {
    constructor(e, t, n) {
      (this.name = e),
        (this.instanceFactory = t),
        (this.type = n),
        (this.multipleInstances = !1),
        (this.serviceProps = {}),
        (this.instantiationMode = "LAZY"),
        (this.onInstanceCreated = null);
    }
    setInstantiationMode(e) {
      return (this.instantiationMode = e), this;
    }
    setMultipleInstances(e) {
      return (this.multipleInstances = e), this;
    }
    setServiceProps(e) {
      return (this.serviceProps = e), this;
    }
    setInstanceCreatedCallback(e) {
      return (this.onInstanceCreated = e), this;
    }
  }
  const E = "[DEFAULT]";
  class T {
    constructor(e, t) {
      (this.name = e),
        (this.container = t),
        (this.component = null),
        (this.instances = new Map()),
        (this.instancesDeferred = new Map()),
        (this.instancesOptions = new Map()),
        (this.onInitCallbacks = new Map());
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new c();
        if (
          (this.instancesDeferred.set(t, e),
          this.isInitialized(t) || this.shouldAutoInitialize())
        )
          try {
            const n = this.getOrInitializeService({ instanceIdentifier: t });
            n && e.resolve(n);
          } catch (e) {}
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(
          null == e ? void 0 : e.identifier
        ),
        i = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (i) return null;
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({ instanceIdentifier: n });
      } catch (e) {
        if (i) return null;
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name)
        throw Error(
          `Mismatching Component ${e.name} for Provider ${this.name}.`
        );
      if (this.component)
        throw Error(`Component for ${this.name} has already been provided`);
      if (((this.component = e), this.shouldAutoInitialize())) {
        if (
          (function (e) {
            return "EAGER" === e.instantiationMode;
          })(e)
        )
          try {
            this.getOrInitializeService({ instanceIdentifier: E });
          } catch (e) {}
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({ instanceIdentifier: n });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = E) {
      this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([
        ...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
        ...e.filter((e) => "_delete" in e).map((e) => e._delete()),
      ]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = E) {
      return this.instances.has(e);
    }
    getOptions(e = E) {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const { options: t = {} } = e,
        n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n))
        throw Error(`${this.name}(${n}) has already been initialized`);
      if (!this.isComponentSet())
        throw Error(`Component ${this.name} has not been registered yet`);
      const i = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t,
      });
      for (const [e, t] of this.instancesDeferred.entries())
        n === this.normalizeInstanceIdentifier(e) && t.resolve(i);
      return i;
    }
    onInit(e, t) {
      var n;
      const i = this.normalizeInstanceIdentifier(t),
        r =
          null !== (n = this.onInitCallbacks.get(i)) && void 0 !== n
            ? n
            : new Set();
      r.add(e), this.onInitCallbacks.set(i, r);
      const s = this.instances.get(i);
      return (
        s && e(s, i),
        () => {
          r.delete(e);
        }
      );
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n)
        for (const i of n)
          try {
            i(e, t);
          } catch (e) {}
    }
    getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
      let n = this.instances.get(e);
      if (
        !n &&
        this.component &&
        ((n = this.component.instanceFactory(this.container, {
          instanceIdentifier: ((i = e), i === E ? void 0 : i),
          options: t,
        })),
        this.instances.set(e, n),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(n, e),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      var i;
      return n || null;
    }
    normalizeInstanceIdentifier(e = E) {
      return this.component ? (this.component.multipleInstances ? e : E) : e;
    }
    shouldAutoInitialize() {
      return (
        !!this.component && "EXPLICIT" !== this.component.instantiationMode
      );
    }
  }
  class S {
    constructor(e) {
      (this.name = e), (this.providers = new Map());
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet())
        throw new Error(
          `Component ${e.name} has already been registered with ${this.name}`
        );
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      this.getProvider(e.name).isComponentSet() &&
        this.providers.delete(e.name),
        this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) return this.providers.get(e);
      const t = new T(e, this);
      return this.providers.set(e, t), t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const k = [];
  var C;
  !(function (e) {
    (e[(e.DEBUG = 0)] = "DEBUG"),
      (e[(e.VERBOSE = 1)] = "VERBOSE"),
      (e[(e.INFO = 2)] = "INFO"),
      (e[(e.WARN = 3)] = "WARN"),
      (e[(e.ERROR = 4)] = "ERROR"),
      (e[(e.SILENT = 5)] = "SILENT");
  })(C || (C = {}));
  const A = {
      debug: C.DEBUG,
      verbose: C.VERBOSE,
      info: C.INFO,
      warn: C.WARN,
      error: C.ERROR,
      silent: C.SILENT,
    },
    R = C.INFO,
    P = {
      [C.DEBUG]: "log",
      [C.VERBOSE]: "log",
      [C.INFO]: "info",
      [C.WARN]: "warn",
      [C.ERROR]: "error",
    },
    O = (e, t, ...n) => {
      if (t < e.logLevel) return;
      const i = new Date().toISOString(),
        r = P[t];
      if (!r)
        throw new Error(
          `Attempted to log a message with an invalid logType (value: ${t})`
        );
      console[r](`[${i}]  ${e.name}:`, ...n);
    };
  class N {
    constructor(e) {
      (this.name = e),
        (this._logLevel = R),
        (this._logHandler = O),
        (this._userLogHandler = null),
        k.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in C))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = "string" == typeof e ? A[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ("function" != typeof e)
        throw new TypeError(
          "Value assigned to `logHandler` must be a function"
        );
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, C.DEBUG, ...e),
        this._logHandler(this, C.DEBUG, ...e);
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, C.VERBOSE, ...e),
        this._logHandler(this, C.VERBOSE, ...e);
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, C.INFO, ...e),
        this._logHandler(this, C.INFO, ...e);
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, C.WARN, ...e),
        this._logHandler(this, C.WARN, ...e);
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, C.ERROR, ...e),
        this._logHandler(this, C.ERROR, ...e);
    }
  }
  const L = (e, t) => t.some((t) => e instanceof t);
  let D, M;
  const U = new WeakMap(),
    x = new WeakMap(),
    j = new WeakMap(),
    F = new WeakMap(),
    V = new WeakMap();
  let B = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ("done" === t) return x.get(e);
        if ("objectStoreNames" === t) return e.objectStoreNames || j.get(e);
        if ("store" === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return z(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
      t in e,
  };
  function H(e) {
    return "function" == typeof e
      ? (t = e) !== IDBDatabase.prototype.transaction ||
        "objectStoreNames" in IDBTransaction.prototype
        ? (
            M ||
            (M = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply($(this), e), z(U.get(this));
            }
          : function (...e) {
              return z(t.apply($(this), e));
            }
        : function (e, ...n) {
            const i = t.call($(this), e, ...n);
            return j.set(i, e.sort ? e.sort() : [e]), z(i);
          }
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (x.has(e)) return;
            const t = new Promise((t, n) => {
              const i = () => {
                  e.removeEventListener("complete", r),
                    e.removeEventListener("error", s),
                    e.removeEventListener("abort", s);
                },
                r = () => {
                  t(), i();
                },
                s = () => {
                  n(e.error || new DOMException("AbortError", "AbortError")),
                    i();
                };
              e.addEventListener("complete", r),
                e.addEventListener("error", s),
                e.addEventListener("abort", s);
            });
            x.set(e, t);
          })(e),
        L(
          e,
          D ||
            (D = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
        )
          ? new Proxy(e, B)
          : e);
    var t;
  }
  function z(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const i = () => {
              e.removeEventListener("success", r),
                e.removeEventListener("error", s);
            },
            r = () => {
              t(z(e.result)), i();
            },
            s = () => {
              n(e.error), i();
            };
          e.addEventListener("success", r), e.addEventListener("error", s);
        });
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && U.set(t, e);
            })
            .catch(() => {}),
          V.set(t, e),
          t
        );
      })(e);
    if (F.has(e)) return F.get(e);
    const t = H(e);
    return t !== e && (F.set(e, t), V.set(t, e)), t;
  }
  const $ = (e) => V.get(e),
    W = ["get", "getKey", "getAll", "getAllKeys", "count"],
    K = ["put", "add", "delete", "clear"],
    q = new Map();
  function G(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
    if (q.get(t)) return q.get(t);
    const n = t.replace(/FromIndex$/, ""),
      i = t !== n,
      r = K.includes(n);
    if (
      !(n in (i ? IDBIndex : IDBObjectStore).prototype) ||
      (!r && !W.includes(n))
    )
      return;
    const s = async function (e, ...t) {
      const s = this.transaction(e, r ? "readwrite" : "readonly");
      let o = s.store;
      return (
        i && (o = o.index(t.shift())),
        (await Promise.all([o[n](...t), r && s.done]))[0]
      );
    };
    return q.set(t, s), s;
  }
  var J;
  (J = B),
    (B = {
      ...J,
      get: (e, t, n) => G(e, t) || J.get(e, t, n),
      has: (e, t) => !!G(e, t) || J.has(e, t),
    });
  class X {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container
        .getProviders()
        .map((e) => {
          if (
            (function (e) {
              const t = e.getComponent();
              return "VERSION" === (null == t ? void 0 : t.type);
            })(e)
          ) {
            const t = e.getImmediate();
            return `${t.library}/${t.version}`;
          }
          return null;
        })
        .filter((e) => e)
        .join(" ");
    }
  }
  const Y = "@firebase/app",
    Q = "0.10.3",
    Z = new N("@firebase/app"),
    ee = "@firebase/app-compat",
    te = "@firebase/analytics-compat",
    ne = "@firebase/analytics",
    ie = "@firebase/app-check-compat",
    re = "@firebase/app-check",
    se = "@firebase/auth",
    oe = "@firebase/auth-compat",
    ae = "@firebase/database",
    he = "@firebase/database-compat",
    ce = "@firebase/functions",
    le = "@firebase/functions-compat",
    ue = "@firebase/installations",
    de = "@firebase/installations-compat",
    pe = "@firebase/messaging",
    fe = "@firebase/messaging-compat",
    ge = "@firebase/performance",
    me = "@firebase/performance-compat",
    ve = "@firebase/remote-config",
    ye = "@firebase/remote-config-compat",
    we = "@firebase/storage",
    _e = "@firebase/storage-compat",
    be = "@firebase/firestore",
    Ie = "@firebase/vertexai-preview",
    Ee = "@firebase/firestore-compat",
    Te = "firebase",
    Se = "[DEFAULT]",
    ke = {
      [Y]: "fire-core",
      [ee]: "fire-core-compat",
      [ne]: "fire-analytics",
      [te]: "fire-analytics-compat",
      [re]: "fire-app-check",
      [ie]: "fire-app-check-compat",
      [se]: "fire-auth",
      [oe]: "fire-auth-compat",
      [ae]: "fire-rtdb",
      [he]: "fire-rtdb-compat",
      [ce]: "fire-fn",
      [le]: "fire-fn-compat",
      [ue]: "fire-iid",
      [de]: "fire-iid-compat",
      [pe]: "fire-fcm",
      [fe]: "fire-fcm-compat",
      [ge]: "fire-perf",
      [me]: "fire-perf-compat",
      [ve]: "fire-rc",
      [ye]: "fire-rc-compat",
      [we]: "fire-gcs",
      [_e]: "fire-gcs-compat",
      [be]: "fire-fst",
      [Ee]: "fire-fst-compat",
      [Ie]: "fire-vertex",
      "fire-js": "fire-js",
      [Te]: "fire-js-all",
    },
    Ce = new Map(),
    Ae = new Map(),
    Re = new Map();
  function Pe(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      Z.debug(
        `Component ${t.name} failed to register with FirebaseApp ${e.name}`,
        n
      );
    }
  }
  function Oe(e) {
    const t = e.name;
    if (Re.has(t))
      return (
        Z.debug(`There were multiple attempts to register component ${t}.`), !1
      );
    Re.set(t, e);
    for (const t of Ce.values()) Pe(t, e);
    for (const t of Ae.values()) Pe(t, e);
    return !0;
  }
  function Ne(e, t) {
    const n = e.container
      .getProvider("heartbeat")
      .getImmediate({ optional: !0 });
    return n && n.triggerHeartbeat(), e.container.getProvider(t);
  }
  function Le(e) {
    return void 0 !== e.settings;
  }
  const De = new d("app", "Firebase", {
    "no-app":
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}'",
    "duplicate-app":
      "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "server-app-deleted": "Firebase Server App has been deleted",
    "no-options":
      "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument":
      "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument":
      "First argument to `onLog` must be null or a function.",
    "idb-open":
      "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get":
      "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set":
      "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete":
      "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    "finalization-registry-not-supported":
      "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    "invalid-server-app-environment":
      "FirebaseServerApp is not for use in browser environments.",
  });
  class Me {
    constructor(e, t, n) {
      (this._isDeleted = !1),
        (this._options = Object.assign({}, e)),
        (this._config = Object.assign({}, t)),
        (this._name = t.name),
        (this._automaticDataCollectionEnabled =
          t.automaticDataCollectionEnabled),
        (this._container = n),
        this.container.addComponent(new I("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      return this.checkDestroyed(), this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
    }
    get name() {
      return this.checkDestroyed(), this._name;
    }
    get options() {
      return this.checkDestroyed(), this._options;
    }
    get config() {
      return this.checkDestroyed(), this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted)
        throw De.create("app-deleted", { appName: this._name });
    }
  }
  const Ue = "10.12.0";
  function xe(e, t = {}) {
    let n = e;
    "object" != typeof t && (t = { name: t });
    const i = Object.assign(
        { name: Se, automaticDataCollectionEnabled: !1 },
        t
      ),
      r = i.name;
    if ("string" != typeof r || !r)
      throw De.create("bad-app-name", { appName: String(r) });
    if ((n || (n = a()), !n)) throw De.create("no-options");
    const s = Ce.get(r);
    if (s) {
      if (f(n, s.options) && f(i, s.config)) return s;
      throw De.create("duplicate-app", { appName: r });
    }
    const o = new S(r);
    for (const e of Re.values()) o.addComponent(e);
    const h = new Me(n, i, o);
    return Ce.set(r, h), h;
  }
  function je(e, t, n) {
    var i;
    let r = null !== (i = ke[e]) && void 0 !== i ? i : e;
    n && (r += `-${n}`);
    const s = r.match(/\s|\//),
      o = t.match(/\s|\//);
    if (s || o) {
      const e = [`Unable to register library "${r}" with version "${t}":`];
      return (
        s &&
          e.push(
            `library name "${r}" contains illegal characters (whitespace or "/")`
          ),
        s && o && e.push("and"),
        o &&
          e.push(
            `version name "${t}" contains illegal characters (whitespace or "/")`
          ),
        void Z.warn(e.join(" "))
      );
    }
    Oe(new I(`${r}-version`, () => ({ library: r, version: t }), "VERSION"));
  }
  const Fe = "firebase-heartbeat-database",
    Ve = 1,
    Be = "firebase-heartbeat-store";
  let He = null;
  function ze() {
    return (
      He ||
        (He = (function (
          e,
          t,
          { blocked: n, upgrade: i, blocking: r, terminated: s } = {}
        ) {
          const o = indexedDB.open(e, t),
            a = z(o);
          return (
            i &&
              o.addEventListener("upgradeneeded", (e) => {
                i(z(o.result), e.oldVersion, e.newVersion, z(o.transaction), e);
              }),
            n &&
              o.addEventListener("blocked", (e) =>
                n(e.oldVersion, e.newVersion, e)
              ),
            a
              .then((e) => {
                s && e.addEventListener("close", () => s()),
                  r &&
                    e.addEventListener("versionchange", (e) =>
                      r(e.oldVersion, e.newVersion, e)
                    );
              })
              .catch(() => {}),
            a
          );
        })(Fe, Ve, {
          upgrade: (e, t) => {
            if (0 === t)
              try {
                e.createObjectStore(Be);
              } catch (e) {
                console.warn(e);
              }
          },
        }).catch((e) => {
          throw De.create("idb-open", { originalErrorMessage: e.message });
        })),
      He
    );
  }
  async function $e(e, t) {
    try {
      const n = (await ze()).transaction(Be, "readwrite"),
        i = n.objectStore(Be);
      await i.put(t, We(e)), await n.done;
    } catch (e) {
      if (e instanceof u) Z.warn(e.message);
      else {
        const t = De.create("idb-set", {
          originalErrorMessage: null == e ? void 0 : e.message,
        });
        Z.warn(t.message);
      }
    }
  }
  function We(e) {
    return `${e.name}!${e.options.appId}`;
  }
  class Ke {
    constructor(e) {
      (this.container = e), (this._heartbeatsCache = null);
      const t = this.container.getProvider("app").getImmediate();
      (this._storage = new Ge(t)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((e) => ((this._heartbeatsCache = e), e)));
    }
    async triggerHeartbeat() {
      var e, t;
      const n = this.container
          .getProvider("platform-logger")
          .getImmediate()
          .getPlatformInfoString(),
        i = qe();
      if (
        (null !=
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) ||
          ((this._heartbeatsCache = await this._heartbeatsCachePromise),
          null !=
            (null === (t = this._heartbeatsCache) || void 0 === t
              ? void 0
              : t.heartbeats))) &&
        this._heartbeatsCache.lastSentHeartbeatDate !== i &&
        !this._heartbeatsCache.heartbeats.some((e) => e.date === i)
      )
        return (
          this._heartbeatsCache.heartbeats.push({ date: i, agent: n }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter((e) => {
              const t = new Date(e.date).valueOf();
              return Date.now() - t <= 2592e6;
            })),
          this._storage.overwrite(this._heartbeatsCache)
        );
    }
    async getHeartbeatsHeader() {
      var e;
      if (
        (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
        null ==
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) || 0 === this._heartbeatsCache.heartbeats.length)
      )
        return "";
      const t = qe(),
        { heartbeatsToSend: n, unsentEntries: i } = (function (e, t = 1024) {
          const n = [];
          let i = e.slice();
          for (const r of e) {
            const e = n.find((e) => e.agent === r.agent);
            if (e) {
              if ((e.dates.push(r.date), Je(n) > t)) {
                e.dates.pop();
                break;
              }
            } else if (
              (n.push({ agent: r.agent, dates: [r.date] }), Je(n) > t)
            ) {
              n.pop();
              break;
            }
            i = i.slice(1);
          }
          return { heartbeatsToSend: n, unsentEntries: i };
        })(this._heartbeatsCache.heartbeats),
        s = r(JSON.stringify({ version: 2, heartbeats: n }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = t),
        i.length > 0
          ? ((this._heartbeatsCache.heartbeats = i),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        s
      );
    }
  }
  function qe() {
    return new Date().toISOString().substring(0, 10);
  }
  class Ge {
    constructor(e) {
      (this.app = e),
        (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
    }
    async runIndexedDBEnvironmentCheck() {
      return (
        !!(function () {
          try {
            return "object" == typeof indexedDB;
          } catch (e) {
            return !1;
          }
        })() &&
        new Promise((e, t) => {
          try {
            let n = !0;
            const i = "validate-browser-context-for-indexeddb-analytics-module",
              r = self.indexedDB.open(i);
            (r.onsuccess = () => {
              r.result.close(), n || self.indexedDB.deleteDatabase(i), e(!0);
            }),
              (r.onupgradeneeded = () => {
                n = !1;
              }),
              (r.onerror = () => {
                var e;
                t(
                  (null === (e = r.error) || void 0 === e
                    ? void 0
                    : e.message) || ""
                );
              });
          } catch (e) {
            t(e);
          }
        })
          .then(() => !0)
          .catch(() => !1)
      );
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await (async function (e) {
          try {
            const t = (await ze()).transaction(Be),
              n = await t.objectStore(Be).get(We(e));
            return await t.done, n;
          } catch (e) {
            if (e instanceof u) Z.warn(e.message);
            else {
              const t = De.create("idb-get", {
                originalErrorMessage: null == e ? void 0 : e.message,
              });
              Z.warn(t.message);
            }
          }
        })(this.app);
        return (null == e ? void 0 : e.heartbeats) ? e : { heartbeats: [] };
      }
      return { heartbeats: [] };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return $e(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return $e(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats],
        });
      }
    }
  }
  function Je(e) {
    return r(JSON.stringify({ version: 2, heartbeats: e })).length;
  }
  function Xe(e, t) {
    var n = {};
    for (var i in e)
      Object.prototype.hasOwnProperty.call(e, i) &&
        t.indexOf(i) < 0 &&
        (n[i] = e[i]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var r = 0;
      for (i = Object.getOwnPropertySymbols(e); r < i.length; r++)
        t.indexOf(i[r]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, i[r]) &&
          (n[i[r]] = e[i[r]]);
    }
    return n;
  }
  Oe(new I("platform-logger", (e) => new X(e), "PRIVATE")),
    Oe(new I("heartbeat", (e) => new Ke(e), "PRIVATE")),
    je(Y, Q, ""),
    je(Y, Q, "esm2017"),
    je("fire-js", ""),
    je("firebase", "10.12.0", "app"),
    Object.create,
    Object.create,
    "function" == typeof SuppressedError && SuppressedError;
  const Ye = function () {
      return {
        "dependent-sdk-initialized-before-auth":
          "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
      };
    },
    Qe = new d("auth", "Firebase", {
      "dependent-sdk-initialized-before-auth":
        "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
    }),
    Ze = new N("@firebase/auth");
  function et(e, ...t) {
    Ze.logLevel <= C.ERROR && Ze.error(`Auth (${Ue}): ${e}`, ...t);
  }
  function tt(e, ...t) {
    throw st(e, ...t);
  }
  function nt(e, ...t) {
    return st(e, ...t);
  }
  function it(e, t, n) {
    const i = Object.assign(Object.assign({}, Ye()), { [t]: n });
    return new d("auth", "Firebase", i).create(t, { appName: e.name });
  }
  function rt(e) {
    return it(
      e,
      "operation-not-supported-in-this-environment",
      "Operations that alter the current user are not supported in conjunction with FirebaseServerApp"
    );
  }
  function st(e, ...t) {
    if ("string" != typeof e) {
      const n = t[0],
        i = [...t.slice(1)];
      return i[0] && (i[0].appName = e.name), e._errorFactory.create(n, ...i);
    }
    return Qe.create(e, ...t);
  }
  function ot(e, t, ...n) {
    if (!e) throw st(t, ...n);
  }
  function at(e) {
    const t = "INTERNAL ASSERTION FAILED: " + e;
    throw (et(t), new Error(t));
  }
  function ht(e, t) {
    e || at(t);
  }
  function ct() {
    var e;
    return (
      ("undefined" != typeof self &&
        (null === (e = self.location) || void 0 === e ? void 0 : e.href)) ||
      ""
    );
  }
  function lt() {
    var e;
    return (
      ("undefined" != typeof self &&
        (null === (e = self.location) || void 0 === e ? void 0 : e.protocol)) ||
      null
    );
  }
  function ut() {
    return (
      !(
        "undefined" != typeof navigator &&
        navigator &&
        "onLine" in navigator &&
        "boolean" == typeof navigator.onLine &&
        ("http:" === lt() ||
          "https:" === lt() ||
          (function () {
            const e =
              "object" == typeof chrome
                ? chrome.runtime
                : "object" == typeof browser
                ? browser.runtime
                : void 0;
            return "object" == typeof e && void 0 !== e.id;
          })() ||
          "connection" in navigator)
      ) || navigator.onLine
    );
  }
  class dt {
    constructor(e, t) {
      (this.shortDelay = e),
        (this.longDelay = t),
        ht(t > e, "Short delay should be less than long delay!"),
        (this.isMobile =
          ("undefined" != typeof window &&
            !!(window.cordova || window.phonegap || window.PhoneGap) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(l())) ||
          ("object" == typeof navigator &&
            "ReactNative" === navigator.product));
    }
    get() {
      return ut()
        ? this.isMobile
          ? this.longDelay
          : this.shortDelay
        : Math.min(5e3, this.shortDelay);
    }
  }
  function pt(e, t) {
    ht(e.emulator, "Emulator should always be set here");
    const { url: n } = e.emulator;
    return t ? `${n}${t.startsWith("/") ? t.slice(1) : t}` : n;
  }
  class ft {
    static initialize(e, t, n) {
      (this.fetchImpl = e),
        t && (this.headersImpl = t),
        n && (this.responseImpl = n);
    }
    static fetch() {
      return this.fetchImpl
        ? this.fetchImpl
        : "undefined" != typeof self && "fetch" in self
        ? self.fetch
        : "undefined" != typeof globalThis && globalThis.fetch
        ? globalThis.fetch
        : "undefined" != typeof fetch
        ? fetch
        : void at(
            "Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
    static headers() {
      return this.headersImpl
        ? this.headersImpl
        : "undefined" != typeof self && "Headers" in self
        ? self.Headers
        : "undefined" != typeof globalThis && globalThis.Headers
        ? globalThis.Headers
        : "undefined" != typeof Headers
        ? Headers
        : void at(
            "Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
    static response() {
      return this.responseImpl
        ? this.responseImpl
        : "undefined" != typeof self && "Response" in self
        ? self.Response
        : "undefined" != typeof globalThis && globalThis.Response
        ? globalThis.Response
        : "undefined" != typeof Response
        ? Response
        : void at(
            "Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill"
          );
    }
  }
  const gt = {
      CREDENTIAL_MISMATCH: "custom-token-mismatch",
      MISSING_CUSTOM_TOKEN: "internal-error",
      INVALID_IDENTIFIER: "invalid-email",
      MISSING_CONTINUE_URI: "internal-error",
      INVALID_PASSWORD: "wrong-password",
      MISSING_PASSWORD: "missing-password",
      INVALID_LOGIN_CREDENTIALS: "invalid-credential",
      EMAIL_EXISTS: "email-already-in-use",
      PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
      INVALID_IDP_RESPONSE: "invalid-credential",
      INVALID_PENDING_TOKEN: "invalid-credential",
      FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
      MISSING_REQ_TYPE: "internal-error",
      EMAIL_NOT_FOUND: "user-not-found",
      RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
      EXPIRED_OOB_CODE: "expired-action-code",
      INVALID_OOB_CODE: "invalid-action-code",
      MISSING_OOB_CODE: "internal-error",
      CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
      INVALID_ID_TOKEN: "invalid-user-token",
      TOKEN_EXPIRED: "user-token-expired",
      USER_NOT_FOUND: "user-token-expired",
      TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
      PASSWORD_DOES_NOT_MEET_REQUIREMENTS:
        "password-does-not-meet-requirements",
      INVALID_CODE: "invalid-verification-code",
      INVALID_SESSION_INFO: "invalid-verification-id",
      INVALID_TEMPORARY_PROOF: "invalid-credential",
      MISSING_SESSION_INFO: "missing-verification-id",
      SESSION_EXPIRED: "code-expired",
      MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
      UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
      INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
      ADMIN_ONLY_OPERATION: "admin-restricted-operation",
      INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
      MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
      MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
      MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
      SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
      SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
      BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
      RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
      MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
      INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
      INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
      MISSING_CLIENT_TYPE: "missing-client-type",
      MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
      INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
      INVALID_REQ_TYPE: "invalid-req-type",
    },
    mt = new dt(3e4, 6e4);
  function vt(e, t) {
    return e.tenantId && !t.tenantId
      ? Object.assign(Object.assign({}, t), { tenantId: e.tenantId })
      : t;
  }
  async function yt(e, t, n, i, r = {}) {
    return wt(e, r, async () => {
      let r = {},
        s = {};
      i && ("GET" === t ? (s = i) : (r = { body: JSON.stringify(i) }));
      const o = m(Object.assign({ key: e.config.apiKey }, s)).slice(1),
        a = await e._getAdditionalHeaders();
      return (
        (a["Content-Type"] = "application/json"),
        e.languageCode && (a["X-Firebase-Locale"] = e.languageCode),
        ft.fetch()(
          bt(e, e.config.apiHost, n, o),
          Object.assign(
            { method: t, headers: a, referrerPolicy: "no-referrer" },
            r
          )
        )
      );
    });
  }
  async function wt(e, t, n) {
    e._canInitEmulator = !1;
    const i = Object.assign(Object.assign({}, gt), t);
    try {
      const t = new Et(e),
        r = await Promise.race([n(), t.promise]);
      t.clearNetworkTimeout();
      const s = await r.json();
      if ("needConfirmation" in s)
        throw Tt(e, "account-exists-with-different-credential", s);
      if (r.ok && !("errorMessage" in s)) return s;
      {
        const t = r.ok ? s.errorMessage : s.error.message,
          [n, o] = t.split(" : ");
        if ("FEDERATED_USER_ID_ALREADY_LINKED" === n)
          throw Tt(e, "credential-already-in-use", s);
        if ("EMAIL_EXISTS" === n) throw Tt(e, "email-already-in-use", s);
        if ("USER_DISABLED" === n) throw Tt(e, "user-disabled", s);
        const a = i[n] || n.toLowerCase().replace(/[_\s]+/g, "-");
        if (o) throw it(e, a, o);
        tt(e, a);
      }
    } catch (t) {
      if (t instanceof u) throw t;
      tt(e, "network-request-failed", { message: String(t) });
    }
  }
  async function _t(e, t, n, i, r = {}) {
    const s = await yt(e, t, n, i, r);
    return (
      "mfaPendingCredential" in s &&
        tt(e, "multi-factor-auth-required", { _serverResponse: s }),
      s
    );
  }
  function bt(e, t, n, i) {
    const r = `${t}${n}?${i}`;
    return e.config.emulator ? pt(e.config, r) : `${e.config.apiScheme}://${r}`;
  }
  function It(e) {
    switch (e) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  class Et {
    constructor(e) {
      (this.auth = e),
        (this.timer = null),
        (this.promise = new Promise((e, t) => {
          this.timer = setTimeout(
            () => t(nt(this.auth, "network-request-failed")),
            mt.get()
          );
        }));
    }
    clearNetworkTimeout() {
      clearTimeout(this.timer);
    }
  }
  function Tt(e, t, n) {
    const i = { appName: e.name };
    n.email && (i.email = n.email),
      n.phoneNumber && (i.phoneNumber = n.phoneNumber);
    const r = nt(e, t, i);
    return (r.customData._tokenResponse = n), r;
  }
  function St(e) {
    return void 0 !== e && void 0 !== e.enterprise;
  }
  class kt {
    constructor(e) {
      if (
        ((this.siteKey = ""),
        (this.recaptchaEnforcementState = []),
        void 0 === e.recaptchaKey)
      )
        throw new Error("recaptchaKey undefined");
      (this.siteKey = e.recaptchaKey.split("/")[3]),
        (this.recaptchaEnforcementState = e.recaptchaEnforcementState);
    }
    getProviderEnforcementState(e) {
      if (
        !this.recaptchaEnforcementState ||
        0 === this.recaptchaEnforcementState.length
      )
        return null;
      for (const t of this.recaptchaEnforcementState)
        if (t.provider && t.provider === e) return It(t.enforcementState);
      return null;
    }
    isProviderEnabled(e) {
      return (
        "ENFORCE" === this.getProviderEnforcementState(e) ||
        "AUDIT" === this.getProviderEnforcementState(e)
      );
    }
  }
  async function Ct(e, t) {
    return yt(e, "POST", "/v1/accounts:lookup", t);
  }
  function At(e) {
    if (e)
      try {
        const t = new Date(Number(e));
        if (!isNaN(t.getTime())) return t.toUTCString();
      } catch (e) {}
  }
  function Rt(e) {
    return 1e3 * Number(e);
  }
  function Pt(e) {
    const [t, n, i] = e.split(".");
    if (void 0 === t || void 0 === n || void 0 === i)
      return et("JWT malformed, contained fewer than 3 sections"), null;
    try {
      const e = s(n);
      return e
        ? JSON.parse(e)
        : (et("Failed to decode base64 JWT payload"), null);
    } catch (e) {
      return (
        et(
          "Caught error parsing JWT payload as JSON",
          null == e ? void 0 : e.toString()
        ),
        null
      );
    }
  }
  function Ot(e) {
    const t = Pt(e);
    return (
      ot(t, "internal-error"),
      ot(void 0 !== t.exp, "internal-error"),
      ot(void 0 !== t.iat, "internal-error"),
      Number(t.exp) - Number(t.iat)
    );
  }
  async function Nt(e, t, n = !1) {
    if (n) return t;
    try {
      return await t;
    } catch (t) {
      throw (
        (t instanceof u &&
          (function ({ code: e }) {
            return (
              "auth/user-disabled" === e || "auth/user-token-expired" === e
            );
          })(t) &&
          e.auth.currentUser === e &&
          (await e.auth.signOut()),
        t)
      );
    }
  }
  class Lt {
    constructor(e) {
      (this.user = e),
        (this.isRunning = !1),
        (this.timerId = null),
        (this.errorBackoff = 3e4);
    }
    _start() {
      this.isRunning || ((this.isRunning = !0), this.schedule());
    }
    _stop() {
      this.isRunning &&
        ((this.isRunning = !1),
        null !== this.timerId && clearTimeout(this.timerId));
    }
    getInterval(e) {
      var t;
      if (e) {
        const e = this.errorBackoff;
        return (this.errorBackoff = Math.min(2 * this.errorBackoff, 96e4)), e;
      }
      {
        this.errorBackoff = 3e4;
        const e =
          (null !== (t = this.user.stsTokenManager.expirationTime) &&
          void 0 !== t
            ? t
            : 0) -
          Date.now() -
          3e5;
        return Math.max(0, e);
      }
    }
    schedule(e = !1) {
      if (!this.isRunning) return;
      const t = this.getInterval(e);
      this.timerId = setTimeout(async () => {
        await this.iteration();
      }, t);
    }
    async iteration() {
      try {
        await this.user.getIdToken(!0);
      } catch (e) {
        return void (
          "auth/network-request-failed" === (null == e ? void 0 : e.code) &&
          this.schedule(!0)
        );
      }
      this.schedule();
    }
  }
  class Dt {
    constructor(e, t) {
      (this.createdAt = e), (this.lastLoginAt = t), this._initializeTime();
    }
    _initializeTime() {
      (this.lastSignInTime = At(this.lastLoginAt)),
        (this.creationTime = At(this.createdAt));
    }
    _copy(e) {
      (this.createdAt = e.createdAt),
        (this.lastLoginAt = e.lastLoginAt),
        this._initializeTime();
    }
    toJSON() {
      return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt };
    }
  }
  async function Mt(e) {
    var t;
    const n = e.auth,
      i = await e.getIdToken(),
      r = await Nt(e, Ct(n, { idToken: i }));
    ot(null == r ? void 0 : r.users.length, n, "internal-error");
    const s = r.users[0];
    e._notifyReloadListener(s);
    const o = (
        null === (t = s.providerUserInfo) || void 0 === t ? void 0 : t.length
      )
        ? Ut(s.providerUserInfo)
        : [],
      a =
        ((h = e.providerData),
        (c = o),
        [
          ...h.filter((e) => !c.some((t) => t.providerId === e.providerId)),
          ...c,
        ]);
    var h, c;
    const l = e.isAnonymous,
      u = !((e.email && s.passwordHash) || (null == a ? void 0 : a.length)),
      d = !!l && u,
      p = {
        uid: s.localId,
        displayName: s.displayName || null,
        photoURL: s.photoUrl || null,
        email: s.email || null,
        emailVerified: s.emailVerified || !1,
        phoneNumber: s.phoneNumber || null,
        tenantId: s.tenantId || null,
        providerData: a,
        metadata: new Dt(s.createdAt, s.lastLoginAt),
        isAnonymous: d,
      };
    Object.assign(e, p);
  }
  function Ut(e) {
    return e.map((e) => {
      var { providerId: t } = e,
        n = Xe(e, ["providerId"]);
      return {
        providerId: t,
        uid: n.rawId || "",
        displayName: n.displayName || null,
        email: n.email || null,
        phoneNumber: n.phoneNumber || null,
        photoURL: n.photoUrl || null,
      };
    });
  }
  class xt {
    constructor() {
      (this.refreshToken = null),
        (this.accessToken = null),
        (this.expirationTime = null);
    }
    get isExpired() {
      return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
    }
    updateFromServerResponse(e) {
      ot(e.idToken, "internal-error"),
        ot(void 0 !== e.idToken, "internal-error"),
        ot(void 0 !== e.refreshToken, "internal-error");
      const t =
        "expiresIn" in e && void 0 !== e.expiresIn
          ? Number(e.expiresIn)
          : Ot(e.idToken);
      this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
    }
    updateFromIdToken(e) {
      ot(0 !== e.length, "internal-error");
      const t = Ot(e);
      this.updateTokensAndExpiration(e, null, t);
    }
    async getToken(e, t = !1) {
      return t || !this.accessToken || this.isExpired
        ? (ot(this.refreshToken, e, "user-token-expired"),
          this.refreshToken
            ? (await this.refresh(e, this.refreshToken), this.accessToken)
            : null)
        : this.accessToken;
    }
    clearRefreshToken() {
      this.refreshToken = null;
    }
    async refresh(e, t) {
      const {
        accessToken: n,
        refreshToken: i,
        expiresIn: r,
      } = await (async function (e, t) {
        const n = await wt(e, {}, async () => {
          const n = m({ grant_type: "refresh_token", refresh_token: t }).slice(
              1
            ),
            { tokenApiHost: i, apiKey: r } = e.config,
            s = bt(e, i, "/v1/token", `key=${r}`),
            o = await e._getAdditionalHeaders();
          return (
            (o["Content-Type"] = "application/x-www-form-urlencoded"),
            ft.fetch()(s, { method: "POST", headers: o, body: n })
          );
        });
        return {
          accessToken: n.access_token,
          expiresIn: n.expires_in,
          refreshToken: n.refresh_token,
        };
      })(e, t);
      this.updateTokensAndExpiration(n, i, Number(r));
    }
    updateTokensAndExpiration(e, t, n) {
      (this.refreshToken = t || null),
        (this.accessToken = e || null),
        (this.expirationTime = Date.now() + 1e3 * n);
    }
    static fromJSON(e, t) {
      const { refreshToken: n, accessToken: i, expirationTime: r } = t,
        s = new xt();
      return (
        n &&
          (ot("string" == typeof n, "internal-error", { appName: e }),
          (s.refreshToken = n)),
        i &&
          (ot("string" == typeof i, "internal-error", { appName: e }),
          (s.accessToken = i)),
        r &&
          (ot("number" == typeof r, "internal-error", { appName: e }),
          (s.expirationTime = r)),
        s
      );
    }
    toJSON() {
      return {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken,
        expirationTime: this.expirationTime,
      };
    }
    _assign(e) {
      (this.accessToken = e.accessToken),
        (this.refreshToken = e.refreshToken),
        (this.expirationTime = e.expirationTime);
    }
    _clone() {
      return Object.assign(new xt(), this.toJSON());
    }
    _performRefresh() {
      return at("not implemented");
    }
  }
  function jt(e, t) {
    ot("string" == typeof e || void 0 === e, "internal-error", { appName: t });
  }
  class Ft {
    constructor(e) {
      var { uid: t, auth: n, stsTokenManager: i } = e,
        r = Xe(e, ["uid", "auth", "stsTokenManager"]);
      (this.providerId = "firebase"),
        (this.proactiveRefresh = new Lt(this)),
        (this.reloadUserInfo = null),
        (this.reloadListener = null),
        (this.uid = t),
        (this.auth = n),
        (this.stsTokenManager = i),
        (this.accessToken = i.accessToken),
        (this.displayName = r.displayName || null),
        (this.email = r.email || null),
        (this.emailVerified = r.emailVerified || !1),
        (this.phoneNumber = r.phoneNumber || null),
        (this.photoURL = r.photoURL || null),
        (this.isAnonymous = r.isAnonymous || !1),
        (this.tenantId = r.tenantId || null),
        (this.providerData = r.providerData ? [...r.providerData] : []),
        (this.metadata = new Dt(
          r.createdAt || void 0,
          r.lastLoginAt || void 0
        ));
    }
    async getIdToken(e) {
      const t = await Nt(this, this.stsTokenManager.getToken(this.auth, e));
      return (
        ot(t, this.auth, "internal-error"),
        this.accessToken !== t &&
          ((this.accessToken = t),
          await this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        t
      );
    }
    getIdTokenResult(e) {
      return (async function (e, t = !1) {
        const n = b(e),
          i = await n.getIdToken(t),
          r = Pt(i);
        ot(r && r.exp && r.auth_time && r.iat, n.auth, "internal-error");
        const s = "object" == typeof r.firebase ? r.firebase : void 0,
          o = null == s ? void 0 : s.sign_in_provider;
        return {
          claims: r,
          token: i,
          authTime: At(Rt(r.auth_time)),
          issuedAtTime: At(Rt(r.iat)),
          expirationTime: At(Rt(r.exp)),
          signInProvider: o || null,
          signInSecondFactor:
            (null == s ? void 0 : s.sign_in_second_factor) || null,
        };
      })(this, e);
    }
    reload() {
      return (async function (e) {
        const t = b(e);
        await Mt(t),
          await t.auth._persistUserIfCurrent(t),
          t.auth._notifyListenersIfCurrent(t);
      })(this);
    }
    _assign(e) {
      this !== e &&
        (ot(this.uid === e.uid, this.auth, "internal-error"),
        (this.displayName = e.displayName),
        (this.photoURL = e.photoURL),
        (this.email = e.email),
        (this.emailVerified = e.emailVerified),
        (this.phoneNumber = e.phoneNumber),
        (this.isAnonymous = e.isAnonymous),
        (this.tenantId = e.tenantId),
        (this.providerData = e.providerData.map((e) => Object.assign({}, e))),
        this.metadata._copy(e.metadata),
        this.stsTokenManager._assign(e.stsTokenManager));
    }
    _clone(e) {
      const t = new Ft(
        Object.assign(Object.assign({}, this), {
          auth: e,
          stsTokenManager: this.stsTokenManager._clone(),
        })
      );
      return t.metadata._copy(this.metadata), t;
    }
    _onReload(e) {
      ot(!this.reloadListener, this.auth, "internal-error"),
        (this.reloadListener = e),
        this.reloadUserInfo &&
          (this._notifyReloadListener(this.reloadUserInfo),
          (this.reloadUserInfo = null));
    }
    _notifyReloadListener(e) {
      this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e);
    }
    _startProactiveRefresh() {
      this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
      this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(e, t = !1) {
      let n = !1;
      e.idToken &&
        e.idToken !== this.stsTokenManager.accessToken &&
        (this.stsTokenManager.updateFromServerResponse(e), (n = !0)),
        t && (await Mt(this)),
        await this.auth._persistUserIfCurrent(this),
        n && this.auth._notifyListenersIfCurrent(this);
    }
    async delete() {
      if (Le(this.auth.app)) return Promise.reject(rt(this.auth));
      const e = await this.getIdToken();
      return (
        await Nt(
          this,
          (async function (e, t) {
            return yt(e, "POST", "/v1/accounts:delete", t);
          })(this.auth, { idToken: e })
        ),
        this.stsTokenManager.clearRefreshToken(),
        this.auth.signOut()
      );
    }
    toJSON() {
      return Object.assign(
        Object.assign(
          {
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map((e) => Object.assign({}, e)),
            stsTokenManager: this.stsTokenManager.toJSON(),
            _redirectEventId: this._redirectEventId,
          },
          this.metadata.toJSON()
        ),
        { apiKey: this.auth.config.apiKey, appName: this.auth.name }
      );
    }
    get refreshToken() {
      return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(e, t) {
      var n, i, r, s, o, a, h, c;
      const l = null !== (n = t.displayName) && void 0 !== n ? n : void 0,
        u = null !== (i = t.email) && void 0 !== i ? i : void 0,
        d = null !== (r = t.phoneNumber) && void 0 !== r ? r : void 0,
        p = null !== (s = t.photoURL) && void 0 !== s ? s : void 0,
        f = null !== (o = t.tenantId) && void 0 !== o ? o : void 0,
        g = null !== (a = t._redirectEventId) && void 0 !== a ? a : void 0,
        m = null !== (h = t.createdAt) && void 0 !== h ? h : void 0,
        v = null !== (c = t.lastLoginAt) && void 0 !== c ? c : void 0,
        {
          uid: y,
          emailVerified: w,
          isAnonymous: _,
          providerData: b,
          stsTokenManager: I,
        } = t;
      ot(y && I, e, "internal-error");
      const E = xt.fromJSON(this.name, I);
      ot("string" == typeof y, e, "internal-error"),
        jt(l, e.name),
        jt(u, e.name),
        ot("boolean" == typeof w, e, "internal-error"),
        ot("boolean" == typeof _, e, "internal-error"),
        jt(d, e.name),
        jt(p, e.name),
        jt(f, e.name),
        jt(g, e.name),
        jt(m, e.name),
        jt(v, e.name);
      const T = new Ft({
        uid: y,
        auth: e,
        email: u,
        emailVerified: w,
        displayName: l,
        isAnonymous: _,
        photoURL: p,
        phoneNumber: d,
        tenantId: f,
        stsTokenManager: E,
        createdAt: m,
        lastLoginAt: v,
      });
      return (
        b &&
          Array.isArray(b) &&
          (T.providerData = b.map((e) => Object.assign({}, e))),
        g && (T._redirectEventId = g),
        T
      );
    }
    static async _fromIdTokenResponse(e, t, n = !1) {
      const i = new xt();
      i.updateFromServerResponse(t);
      const r = new Ft({
        uid: t.localId,
        auth: e,
        stsTokenManager: i,
        isAnonymous: n,
      });
      return await Mt(r), r;
    }
    static async _fromGetAccountInfoResponse(e, t, n) {
      const i = t.users[0];
      ot(void 0 !== i.localId, "internal-error");
      const r = void 0 !== i.providerUserInfo ? Ut(i.providerUserInfo) : [],
        s = !((i.email && i.passwordHash) || (null == r ? void 0 : r.length)),
        o = new xt();
      o.updateFromIdToken(n);
      const a = new Ft({
          uid: i.localId,
          auth: e,
          stsTokenManager: o,
          isAnonymous: s,
        }),
        h = {
          uid: i.localId,
          displayName: i.displayName || null,
          photoURL: i.photoUrl || null,
          email: i.email || null,
          emailVerified: i.emailVerified || !1,
          phoneNumber: i.phoneNumber || null,
          tenantId: i.tenantId || null,
          providerData: r,
          metadata: new Dt(i.createdAt, i.lastLoginAt),
          isAnonymous: !(
            (i.email && i.passwordHash) ||
            (null == r ? void 0 : r.length)
          ),
        };
      return Object.assign(a, h), a;
    }
  }
  const Vt = new Map();
  function Bt(e) {
    ht(e instanceof Function, "Expected a class definition");
    let t = Vt.get(e);
    return t
      ? (ht(t instanceof e, "Instance stored in cache mismatched with class"),
        t)
      : ((t = new e()), Vt.set(e, t), t);
  }
  class Ht {
    constructor() {
      (this.type = "NONE"), (this.storage = {});
    }
    async _isAvailable() {
      return !0;
    }
    async _set(e, t) {
      this.storage[e] = t;
    }
    async _get(e) {
      const t = this.storage[e];
      return void 0 === t ? null : t;
    }
    async _remove(e) {
      delete this.storage[e];
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
  }
  Ht.type = "NONE";
  const zt = Ht;
  function $t(e, t, n) {
    return `firebase:${e}:${t}:${n}`;
  }
  class Wt {
    constructor(e, t, n) {
      (this.persistence = e), (this.auth = t), (this.userKey = n);
      const { config: i, name: r } = this.auth;
      (this.fullUserKey = $t(this.userKey, i.apiKey, r)),
        (this.fullPersistenceKey = $t("persistence", i.apiKey, r)),
        (this.boundEventHandler = t._onStorageEvent.bind(t)),
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(e) {
      return this.persistence._set(this.fullUserKey, e.toJSON());
    }
    async getCurrentUser() {
      const e = await this.persistence._get(this.fullUserKey);
      return e ? Ft._fromJSON(this.auth, e) : null;
    }
    removeCurrentUser() {
      return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
      return this.persistence._set(
        this.fullPersistenceKey,
        this.persistence.type
      );
    }
    async setPersistence(e) {
      if (this.persistence === e) return;
      const t = await this.getCurrentUser();
      return (
        await this.removeCurrentUser(),
        (this.persistence = e),
        t ? this.setCurrentUser(t) : void 0
      );
    }
    delete() {
      this.persistence._removeListener(
        this.fullUserKey,
        this.boundEventHandler
      );
    }
    static async create(e, t, n = "authUser") {
      if (!t.length) return new Wt(Bt(zt), e, n);
      const i = (
        await Promise.all(
          t.map(async (e) => {
            if (await e._isAvailable()) return e;
          })
        )
      ).filter((e) => e);
      let r = i[0] || Bt(zt);
      const s = $t(n, e.config.apiKey, e.name);
      let o = null;
      for (const n of t)
        try {
          const t = await n._get(s);
          if (t) {
            const i = Ft._fromJSON(e, t);
            n !== r && (o = i), (r = n);
            break;
          }
        } catch (e) {}
      const a = i.filter((e) => e._shouldAllowMigration);
      return r._shouldAllowMigration && a.length
        ? ((r = a[0]),
          o && (await r._set(s, o.toJSON())),
          await Promise.all(
            t.map(async (e) => {
              if (e !== r)
                try {
                  await e._remove(s);
                } catch (e) {}
            })
          ),
          new Wt(r, e, n))
        : new Wt(r, e, n);
    }
  }
  function Kt(e) {
    const t = e.toLowerCase();
    if (t.includes("opera/") || t.includes("opr/") || t.includes("opios/"))
      return "Opera";
    if (Xt(t)) return "IEMobile";
    if (t.includes("msie") || t.includes("trident/")) return "IE";
    if (t.includes("edge/")) return "Edge";
    if (qt(t)) return "Firefox";
    if (t.includes("silk/")) return "Silk";
    if (Qt(t)) return "Blackberry";
    if (Zt(t)) return "Webos";
    if (Gt(t)) return "Safari";
    if ((t.includes("chrome/") || Jt(t)) && !t.includes("edge/"))
      return "Chrome";
    if (Yt(t)) return "Android";
    {
      const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
        n = e.match(t);
      if (2 === (null == n ? void 0 : n.length)) return n[1];
    }
    return "Other";
  }
  function qt(e = l()) {
    return /firefox\//i.test(e);
  }
  function Gt(e = l()) {
    const t = e.toLowerCase();
    return (
      t.includes("safari/") &&
      !t.includes("chrome/") &&
      !t.includes("crios/") &&
      !t.includes("android")
    );
  }
  function Jt(e = l()) {
    return /crios\//i.test(e);
  }
  function Xt(e = l()) {
    return /iemobile/i.test(e);
  }
  function Yt(e = l()) {
    return /android/i.test(e);
  }
  function Qt(e = l()) {
    return /blackberry/i.test(e);
  }
  function Zt(e = l()) {
    return /webos/i.test(e);
  }
  function en(e = l()) {
    return (
      /iphone|ipad|ipod/i.test(e) || (/macintosh/i.test(e) && /mobile/i.test(e))
    );
  }
  function tn(e = l()) {
    return (
      en(e) || Yt(e) || Zt(e) || Qt(e) || /windows phone/i.test(e) || Xt(e)
    );
  }
  function nn(e, t = []) {
    let n;
    switch (e) {
      case "Browser":
        n = Kt(l());
        break;
      case "Worker":
        n = `${Kt(l())}-${e}`;
        break;
      default:
        n = e;
    }
    const i = t.length ? t.join(",") : "FirebaseCore-web";
    return `${n}/JsCore/${Ue}/${i}`;
  }
  class rn {
    constructor(e) {
      (this.auth = e), (this.queue = []);
    }
    pushCallback(e, t) {
      const n = (t) =>
        new Promise((n, i) => {
          try {
            n(e(t));
          } catch (e) {
            i(e);
          }
        });
      (n.onAbort = t), this.queue.push(n);
      const i = this.queue.length - 1;
      return () => {
        this.queue[i] = () => Promise.resolve();
      };
    }
    async runMiddleware(e) {
      if (this.auth.currentUser === e) return;
      const t = [];
      try {
        for (const n of this.queue) await n(e), n.onAbort && t.push(n.onAbort);
      } catch (e) {
        t.reverse();
        for (const e of t)
          try {
            e();
          } catch (e) {}
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: null == e ? void 0 : e.message,
        });
      }
    }
  }
  class sn {
    constructor(e) {
      var t, n, i, r;
      const s = e.customStrengthOptions;
      (this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          null !== (t = s.minPasswordLength) && void 0 !== t ? t : 6),
        s.maxPasswordLength &&
          (this.customStrengthOptions.maxPasswordLength = s.maxPasswordLength),
        void 0 !== s.containsLowercaseCharacter &&
          (this.customStrengthOptions.containsLowercaseLetter =
            s.containsLowercaseCharacter),
        void 0 !== s.containsUppercaseCharacter &&
          (this.customStrengthOptions.containsUppercaseLetter =
            s.containsUppercaseCharacter),
        void 0 !== s.containsNumericCharacter &&
          (this.customStrengthOptions.containsNumericCharacter =
            s.containsNumericCharacter),
        void 0 !== s.containsNonAlphanumericCharacter &&
          (this.customStrengthOptions.containsNonAlphanumericCharacter =
            s.containsNonAlphanumericCharacter),
        (this.enforcementState = e.enforcementState),
        "ENFORCEMENT_STATE_UNSPECIFIED" === this.enforcementState &&
          (this.enforcementState = "OFF"),
        (this.allowedNonAlphanumericCharacters =
          null !==
            (i =
              null === (n = e.allowedNonAlphanumericCharacters) || void 0 === n
                ? void 0
                : n.join("")) && void 0 !== i
            ? i
            : ""),
        (this.forceUpgradeOnSignin =
          null !== (r = e.forceUpgradeOnSignin) && void 0 !== r && r),
        (this.schemaVersion = e.schemaVersion);
    }
    validatePassword(e) {
      var t, n, i, r, s, o;
      const a = { isValid: !0, passwordPolicy: this };
      return (
        this.validatePasswordLengthOptions(e, a),
        this.validatePasswordCharacterOptions(e, a),
        a.isValid &&
          (a.isValid =
            null === (t = a.meetsMinPasswordLength) || void 0 === t || t),
        a.isValid &&
          (a.isValid =
            null === (n = a.meetsMaxPasswordLength) || void 0 === n || n),
        a.isValid &&
          (a.isValid =
            null === (i = a.containsLowercaseLetter) || void 0 === i || i),
        a.isValid &&
          (a.isValid =
            null === (r = a.containsUppercaseLetter) || void 0 === r || r),
        a.isValid &&
          (a.isValid =
            null === (s = a.containsNumericCharacter) || void 0 === s || s),
        a.isValid &&
          (a.isValid =
            null === (o = a.containsNonAlphanumericCharacter) ||
            void 0 === o ||
            o),
        a
      );
    }
    validatePasswordLengthOptions(e, t) {
      const n = this.customStrengthOptions.minPasswordLength,
        i = this.customStrengthOptions.maxPasswordLength;
      n && (t.meetsMinPasswordLength = e.length >= n),
        i && (t.meetsMaxPasswordLength = e.length <= i);
    }
    validatePasswordCharacterOptions(e, t) {
      let n;
      this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
      for (let i = 0; i < e.length; i++)
        (n = e.charAt(i)),
          this.updatePasswordCharacterOptionsStatuses(
            t,
            n >= "a" && n <= "z",
            n >= "A" && n <= "Z",
            n >= "0" && n <= "9",
            this.allowedNonAlphanumericCharacters.includes(n)
          );
    }
    updatePasswordCharacterOptionsStatuses(e, t, n, i, r) {
      this.customStrengthOptions.containsLowercaseLetter &&
        (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)),
        this.customStrengthOptions.containsUppercaseLetter &&
          (e.containsUppercaseLetter || (e.containsUppercaseLetter = n)),
        this.customStrengthOptions.containsNumericCharacter &&
          (e.containsNumericCharacter || (e.containsNumericCharacter = i)),
        this.customStrengthOptions.containsNonAlphanumericCharacter &&
          (e.containsNonAlphanumericCharacter ||
            (e.containsNonAlphanumericCharacter = r));
    }
  }
  class on {
    constructor(e, t, n, i) {
      (this.app = e),
        (this.heartbeatServiceProvider = t),
        (this.appCheckServiceProvider = n),
        (this.config = i),
        (this.currentUser = null),
        (this.emulatorConfig = null),
        (this.operations = Promise.resolve()),
        (this.authStateSubscription = new hn(this)),
        (this.idTokenSubscription = new hn(this)),
        (this.beforeStateQueue = new rn(this)),
        (this.redirectUser = null),
        (this.isProactiveRefreshEnabled = !1),
        (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
        (this._canInitEmulator = !0),
        (this._isInitialized = !1),
        (this._deleted = !1),
        (this._initializationPromise = null),
        (this._popupRedirectResolver = null),
        (this._errorFactory = Qe),
        (this._agentRecaptchaConfig = null),
        (this._tenantRecaptchaConfigs = {}),
        (this._projectPasswordPolicy = null),
        (this._tenantPasswordPolicies = {}),
        (this.lastNotifiedUid = void 0),
        (this.languageCode = null),
        (this.tenantId = null),
        (this.settings = { appVerificationDisabledForTesting: !1 }),
        (this.frameworks = []),
        (this.name = e.name),
        (this.clientVersion = i.sdkClientVersion);
    }
    _initializeWithPersistence(e, t) {
      return (
        t && (this._popupRedirectResolver = Bt(t)),
        (this._initializationPromise = this.queue(async () => {
          var n, i;
          if (
            !this._deleted &&
            ((this.persistenceManager = await Wt.create(this, e)),
            !this._deleted)
          ) {
            if (
              null === (n = this._popupRedirectResolver) || void 0 === n
                ? void 0
                : n._shouldInitProactively
            )
              try {
                await this._popupRedirectResolver._initialize(this);
              } catch (e) {}
            await this.initializeCurrentUser(t),
              (this.lastNotifiedUid =
                (null === (i = this.currentUser) || void 0 === i
                  ? void 0
                  : i.uid) || null),
              this._deleted || (this._isInitialized = !0);
          }
        })),
        this._initializationPromise
      );
    }
    async _onStorageEvent() {
      if (this._deleted) return;
      const e = await this.assertedPersistence.getCurrentUser();
      return this.currentUser || e
        ? this.currentUser && e && this.currentUser.uid === e.uid
          ? (this._currentUser._assign(e),
            void (await this.currentUser.getIdToken()))
          : void (await this._updateCurrentUser(e, !0))
        : void 0;
    }
    async initializeCurrentUserFromIdToken(e) {
      try {
        const t = await Ct(this, { idToken: e }),
          n = await Ft._fromGetAccountInfoResponse(this, t, e);
        await this.directlySetCurrentUser(n);
      } catch (e) {
        console.warn(
          "FirebaseServerApp could not login user with provided authIdToken: ",
          e
        ),
          await this.directlySetCurrentUser(null);
      }
    }
    async initializeCurrentUser(e) {
      var t;
      if (Le(this.app)) {
        const e = this.app.settings.authIdToken;
        return e
          ? new Promise((t) => {
              setTimeout(() =>
                this.initializeCurrentUserFromIdToken(e).then(t, t)
              );
            })
          : this.directlySetCurrentUser(null);
      }
      const n = await this.assertedPersistence.getCurrentUser();
      let i = n,
        r = !1;
      if (e && this.config.authDomain) {
        await this.getOrInitRedirectPersistenceManager();
        const n =
            null === (t = this.redirectUser) || void 0 === t
              ? void 0
              : t._redirectEventId,
          s = null == i ? void 0 : i._redirectEventId,
          o = await this.tryRedirectSignIn(e);
        (n && n !== s) ||
          !(null == o ? void 0 : o.user) ||
          ((i = o.user), (r = !0));
      }
      if (!i) return this.directlySetCurrentUser(null);
      if (!i._redirectEventId) {
        if (r)
          try {
            await this.beforeStateQueue.runMiddleware(i);
          } catch (e) {
            (i = n),
              this._popupRedirectResolver._overrideRedirectResult(this, () =>
                Promise.reject(e)
              );
          }
        return i
          ? this.reloadAndSetCurrentUserOrClear(i)
          : this.directlySetCurrentUser(null);
      }
      return (
        ot(this._popupRedirectResolver, this, "argument-error"),
        await this.getOrInitRedirectPersistenceManager(),
        this.redirectUser &&
        this.redirectUser._redirectEventId === i._redirectEventId
          ? this.directlySetCurrentUser(i)
          : this.reloadAndSetCurrentUserOrClear(i)
      );
    }
    async tryRedirectSignIn(e) {
      let t = null;
      try {
        t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
      } catch (e) {
        await this._setRedirectUser(null);
      }
      return t;
    }
    async reloadAndSetCurrentUserOrClear(e) {
      try {
        await Mt(e);
      } catch (e) {
        if ("auth/network-request-failed" !== (null == e ? void 0 : e.code))
          return this.directlySetCurrentUser(null);
      }
      return this.directlySetCurrentUser(e);
    }
    useDeviceLanguage() {
      this.languageCode = (function () {
        if ("undefined" == typeof navigator) return null;
        const e = navigator;
        return (e.languages && e.languages[0]) || e.language || null;
      })();
    }
    async _delete() {
      this._deleted = !0;
    }
    async updateCurrentUser(e) {
      if (Le(this.app)) return Promise.reject(rt(this));
      const t = e ? b(e) : null;
      return (
        t &&
          ot(
            t.auth.config.apiKey === this.config.apiKey,
            this,
            "invalid-user-token"
          ),
        this._updateCurrentUser(t && t._clone(this))
      );
    }
    async _updateCurrentUser(e, t = !1) {
      if (!this._deleted)
        return (
          e && ot(this.tenantId === e.tenantId, this, "tenant-id-mismatch"),
          t || (await this.beforeStateQueue.runMiddleware(e)),
          this.queue(async () => {
            await this.directlySetCurrentUser(e), this.notifyAuthListeners();
          })
        );
    }
    async signOut() {
      return Le(this.app)
        ? Promise.reject(rt(this))
        : (await this.beforeStateQueue.runMiddleware(null),
          (this.redirectPersistenceManager || this._popupRedirectResolver) &&
            (await this._setRedirectUser(null)),
          this._updateCurrentUser(null, !0));
    }
    setPersistence(e) {
      return Le(this.app)
        ? Promise.reject(rt(this))
        : this.queue(async () => {
            await this.assertedPersistence.setPersistence(Bt(e));
          });
    }
    _getRecaptchaConfig() {
      return null == this.tenantId
        ? this._agentRecaptchaConfig
        : this._tenantRecaptchaConfigs[this.tenantId];
    }
    async validatePassword(e) {
      this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
      const t = this._getPasswordPolicyInternal();
      return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
        ? Promise.reject(
            this._errorFactory.create(
              "unsupported-password-policy-schema-version",
              {}
            )
          )
        : t.validatePassword(e);
    }
    _getPasswordPolicyInternal() {
      return null === this.tenantId
        ? this._projectPasswordPolicy
        : this._tenantPasswordPolicies[this.tenantId];
    }
    async _updatePasswordPolicy() {
      const e = await (async function (e, t = {}) {
          return yt(e, "GET", "/v2/passwordPolicy", vt(e, t));
        })(this),
        t = new sn(e);
      null === this.tenantId
        ? (this._projectPasswordPolicy = t)
        : (this._tenantPasswordPolicies[this.tenantId] = t);
    }
    _getPersistence() {
      return this.assertedPersistence.persistence.type;
    }
    _updateErrorMap(e) {
      this._errorFactory = new d("auth", "Firebase", e());
    }
    onAuthStateChanged(e, t, n) {
      return this.registerStateListener(this.authStateSubscription, e, t, n);
    }
    beforeAuthStateChanged(e, t) {
      return this.beforeStateQueue.pushCallback(e, t);
    }
    onIdTokenChanged(e, t, n) {
      return this.registerStateListener(this.idTokenSubscription, e, t, n);
    }
    authStateReady() {
      return new Promise((e, t) => {
        if (this.currentUser) e();
        else {
          const n = this.onAuthStateChanged(() => {
            n(), e();
          }, t);
        }
      });
    }
    async revokeAccessToken(e) {
      if (this.currentUser) {
        const t = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token: e,
          idToken: await this.currentUser.getIdToken(),
        };
        null != this.tenantId && (t.tenantId = this.tenantId),
          await (async function (e, t) {
            return yt(e, "POST", "/v2/accounts:revokeToken", vt(e, t));
          })(this, t);
      }
    }
    toJSON() {
      var e;
      return {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        appName: this.name,
        currentUser:
          null === (e = this._currentUser) || void 0 === e
            ? void 0
            : e.toJSON(),
      };
    }
    async _setRedirectUser(e, t) {
      const n = await this.getOrInitRedirectPersistenceManager(t);
      return null === e ? n.removeCurrentUser() : n.setCurrentUser(e);
    }
    async getOrInitRedirectPersistenceManager(e) {
      if (!this.redirectPersistenceManager) {
        const t = (e && Bt(e)) || this._popupRedirectResolver;
        ot(t, this, "argument-error"),
          (this.redirectPersistenceManager = await Wt.create(
            this,
            [Bt(t._redirectPersistence)],
            "redirectUser"
          )),
          (this.redirectUser =
            await this.redirectPersistenceManager.getCurrentUser());
      }
      return this.redirectPersistenceManager;
    }
    async _redirectUserForId(e) {
      var t, n;
      return (
        this._isInitialized && (await this.queue(async () => {})),
        (null === (t = this._currentUser) || void 0 === t
          ? void 0
          : t._redirectEventId) === e
          ? this._currentUser
          : (null === (n = this.redirectUser) || void 0 === n
              ? void 0
              : n._redirectEventId) === e
          ? this.redirectUser
          : null
      );
    }
    async _persistUserIfCurrent(e) {
      if (e === this.currentUser)
        return this.queue(async () => this.directlySetCurrentUser(e));
    }
    _notifyListenersIfCurrent(e) {
      e === this.currentUser && this.notifyAuthListeners();
    }
    _key() {
      return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
      (this.isProactiveRefreshEnabled = !0),
        this.currentUser && this._currentUser._startProactiveRefresh();
    }
    _stopProactiveRefresh() {
      (this.isProactiveRefreshEnabled = !1),
        this.currentUser && this._currentUser._stopProactiveRefresh();
    }
    get _currentUser() {
      return this.currentUser;
    }
    notifyAuthListeners() {
      var e, t;
      if (!this._isInitialized) return;
      this.idTokenSubscription.next(this.currentUser);
      const n =
        null !==
          (t =
            null === (e = this.currentUser) || void 0 === e ? void 0 : e.uid) &&
        void 0 !== t
          ? t
          : null;
      this.lastNotifiedUid !== n &&
        ((this.lastNotifiedUid = n),
        this.authStateSubscription.next(this.currentUser));
    }
    registerStateListener(e, t, n, i) {
      if (this._deleted) return () => {};
      const r = "function" == typeof t ? t : t.next.bind(t);
      let s = !1;
      const o = this._isInitialized
        ? Promise.resolve()
        : this._initializationPromise;
      if (
        (ot(o, this, "internal-error"),
        o.then(() => {
          s || r(this.currentUser);
        }),
        "function" == typeof t)
      ) {
        const r = e.addObserver(t, n, i);
        return () => {
          (s = !0), r();
        };
      }
      {
        const n = e.addObserver(t);
        return () => {
          (s = !0), n();
        };
      }
    }
    async directlySetCurrentUser(e) {
      this.currentUser &&
        this.currentUser !== e &&
        this._currentUser._stopProactiveRefresh(),
        e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
        (this.currentUser = e),
        e
          ? await this.assertedPersistence.setCurrentUser(e)
          : await this.assertedPersistence.removeCurrentUser();
    }
    queue(e) {
      return (this.operations = this.operations.then(e, e)), this.operations;
    }
    get assertedPersistence() {
      return (
        ot(this.persistenceManager, this, "internal-error"),
        this.persistenceManager
      );
    }
    _logFramework(e) {
      e &&
        !this.frameworks.includes(e) &&
        (this.frameworks.push(e),
        this.frameworks.sort(),
        (this.clientVersion = nn(
          this.config.clientPlatform,
          this._getFrameworks()
        )));
    }
    _getFrameworks() {
      return this.frameworks;
    }
    async _getAdditionalHeaders() {
      var e;
      const t = { "X-Client-Version": this.clientVersion };
      this.app.options.appId &&
        (t["X-Firebase-gmpid"] = this.app.options.appId);
      const n = await (null ===
        (e = this.heartbeatServiceProvider.getImmediate({ optional: !0 })) ||
      void 0 === e
        ? void 0
        : e.getHeartbeatsHeader());
      n && (t["X-Firebase-Client"] = n);
      const i = await this._getAppCheckToken();
      return i && (t["X-Firebase-AppCheck"] = i), t;
    }
    async _getAppCheckToken() {
      var e;
      const t = await (null ===
        (e = this.appCheckServiceProvider.getImmediate({ optional: !0 })) ||
      void 0 === e
        ? void 0
        : e.getToken());
      return (
        (null == t ? void 0 : t.error) &&
          (function (e, ...t) {
            Ze.logLevel <= C.WARN && Ze.warn(`Auth (${Ue}): ${e}`, ...t);
          })(`Error while retrieving App Check token: ${t.error}`),
        null == t ? void 0 : t.token
      );
    }
  }
  function an(e) {
    return b(e);
  }
  class hn {
    constructor(e) {
      (this.auth = e),
        (this.observer = null),
        (this.addObserver = (function (e, t) {
          const n = new w(e, void 0);
          return n.subscribe.bind(n);
        })((e) => (this.observer = e)));
    }
    get next() {
      return (
        ot(this.observer, this.auth, "internal-error"),
        this.observer.next.bind(this.observer)
      );
    }
  }
  let cn = {
    async loadJS() {
      throw new Error("Unable to load external scripts");
    },
    recaptchaV2Script: "",
    recaptchaEnterpriseScript: "",
    gapiScript: "",
  };
  function ln(e) {
    return cn.loadJS(e);
  }
  function un(e) {
    return `__${e}${Math.floor(1e6 * Math.random())}`;
  }
  class dn {
    constructor(e) {
      (this.type = "recaptcha-enterprise"), (this.auth = an(e));
    }
    async verify(e = "verify", t = !1) {
      function n(t, n, i) {
        const r = window.grecaptcha;
        St(r)
          ? r.enterprise.ready(() => {
              r.enterprise
                .execute(t, { action: e })
                .then((e) => {
                  n(e);
                })
                .catch(() => {
                  n("NO_RECAPTCHA");
                });
            })
          : i(Error("No reCAPTCHA enterprise script loaded."));
      }
      return new Promise((e, i) => {
        (async function (e) {
          if (!t) {
            if (null == e.tenantId && null != e._agentRecaptchaConfig)
              return e._agentRecaptchaConfig.siteKey;
            if (
              null != e.tenantId &&
              void 0 !== e._tenantRecaptchaConfigs[e.tenantId]
            )
              return e._tenantRecaptchaConfigs[e.tenantId].siteKey;
          }
          return new Promise(async (t, n) => {
            (async function (e, t) {
              return yt(e, "GET", "/v2/recaptchaConfig", vt(e, t));
            })(e, {
              clientType: "CLIENT_TYPE_WEB",
              version: "RECAPTCHA_ENTERPRISE",
            })
              .then((i) => {
                if (void 0 !== i.recaptchaKey) {
                  const n = new kt(i);
                  return (
                    null == e.tenantId
                      ? (e._agentRecaptchaConfig = n)
                      : (e._tenantRecaptchaConfigs[e.tenantId] = n),
                    t(n.siteKey)
                  );
                }
                n(new Error("recaptcha Enterprise site key undefined"));
              })
              .catch((e) => {
                n(e);
              });
          });
        })(this.auth)
          .then((r) => {
            if (!t && St(window.grecaptcha)) n(r, e, i);
            else {
              if ("undefined" == typeof window)
                return void i(
                  new Error("RecaptchaVerifier is only supported in browser")
                );
              let t = cn.recaptchaEnterpriseScript;
              0 !== t.length && (t += r),
                ln(t)
                  .then(() => {
                    n(r, e, i);
                  })
                  .catch((e) => {
                    i(e);
                  });
            }
          })
          .catch((e) => {
            i(e);
          });
      });
    }
  }
  async function pn(e, t, n, i = !1) {
    const r = new dn(e);
    let s;
    try {
      s = await r.verify(n);
    } catch (e) {
      s = await r.verify(n, !0);
    }
    const o = Object.assign({}, t);
    return (
      i
        ? Object.assign(o, { captchaResp: s })
        : Object.assign(o, { captchaResponse: s }),
      Object.assign(o, { clientType: "CLIENT_TYPE_WEB" }),
      Object.assign(o, { recaptchaVersion: "RECAPTCHA_ENTERPRISE" }),
      o
    );
  }
  async function fn(e, t, n, i) {
    var r;
    if (
      null === (r = e._getRecaptchaConfig()) || void 0 === r
        ? void 0
        : r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")
    ) {
      const r = await pn(e, t, n, "getOobCode" === n);
      return i(e, r);
    }
    return i(e, t).catch(async (r) => {
      if ("auth/missing-recaptcha-token" === r.code) {
        console.log(
          `${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`
        );
        const r = await pn(e, t, n, "getOobCode" === n);
        return i(e, r);
      }
      return Promise.reject(r);
    });
  }
  function gn(e) {
    const t = e.indexOf(":");
    return t < 0 ? "" : e.substr(0, t + 1);
  }
  function mn(e) {
    if (!e) return null;
    const t = Number(e);
    return isNaN(t) ? null : t;
  }
  class vn {
    constructor(e, t) {
      (this.providerId = e), (this.signInMethod = t);
    }
    toJSON() {
      return at("not implemented");
    }
    _getIdTokenResponse(e) {
      return at("not implemented");
    }
    _linkToIdToken(e, t) {
      return at("not implemented");
    }
    _getReauthenticationResolver(e) {
      return at("not implemented");
    }
  }
  async function yn(e, t) {
    return yt(e, "POST", "/v1/accounts:signUp", t);
  }
  async function wn(e, t) {
    return _t(e, "POST", "/v1/accounts:signInWithPassword", vt(e, t));
  }
  class _n extends vn {
    constructor(e, t, n, i = null) {
      super("password", n),
        (this._email = e),
        (this._password = t),
        (this._tenantId = i);
    }
    static _fromEmailAndPassword(e, t) {
      return new _n(e, t, "password");
    }
    static _fromEmailAndCode(e, t, n = null) {
      return new _n(e, t, "emailLink", n);
    }
    toJSON() {
      return {
        email: this._email,
        password: this._password,
        signInMethod: this.signInMethod,
        tenantId: this._tenantId,
      };
    }
    static fromJSON(e) {
      const t = "string" == typeof e ? JSON.parse(e) : e;
      if ((null == t ? void 0 : t.email) && (null == t ? void 0 : t.password)) {
        if ("password" === t.signInMethod)
          return this._fromEmailAndPassword(t.email, t.password);
        if ("emailLink" === t.signInMethod)
          return this._fromEmailAndCode(t.email, t.password, t.tenantId);
      }
      return null;
    }
    async _getIdTokenResponse(e) {
      switch (this.signInMethod) {
        case "password":
          return fn(
            e,
            {
              returnSecureToken: !0,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB",
            },
            "signInWithPassword",
            wn
          );
        case "emailLink":
          return (async function (e, t) {
            return _t(e, "POST", "/v1/accounts:signInWithEmailLink", vt(e, t));
          })(e, { email: this._email, oobCode: this._password });
        default:
          tt(e, "internal-error");
      }
    }
    async _linkToIdToken(e, t) {
      switch (this.signInMethod) {
        case "password":
          return fn(
            e,
            {
              idToken: t,
              returnSecureToken: !0,
              email: this._email,
              password: this._password,
              clientType: "CLIENT_TYPE_WEB",
            },
            "signUpPassword",
            yn
          );
        case "emailLink":
          return (async function (e, t) {
            return _t(e, "POST", "/v1/accounts:signInWithEmailLink", vt(e, t));
          })(e, { idToken: t, email: this._email, oobCode: this._password });
        default:
          tt(e, "internal-error");
      }
    }
    _getReauthenticationResolver(e) {
      return this._getIdTokenResponse(e);
    }
  }
  async function bn(e, t) {
    return _t(e, "POST", "/v1/accounts:signInWithIdp", vt(e, t));
  }
  class In extends vn {
    constructor() {
      super(...arguments), (this.pendingToken = null);
    }
    static _fromParams(e) {
      const t = new In(e.providerId, e.signInMethod);
      return (
        e.idToken || e.accessToken
          ? (e.idToken && (t.idToken = e.idToken),
            e.accessToken && (t.accessToken = e.accessToken),
            e.nonce && !e.pendingToken && (t.nonce = e.nonce),
            e.pendingToken && (t.pendingToken = e.pendingToken))
          : e.oauthToken && e.oauthTokenSecret
          ? ((t.accessToken = e.oauthToken), (t.secret = e.oauthTokenSecret))
          : tt("argument-error"),
        t
      );
    }
    toJSON() {
      return {
        idToken: this.idToken,
        accessToken: this.accessToken,
        secret: this.secret,
        nonce: this.nonce,
        pendingToken: this.pendingToken,
        providerId: this.providerId,
        signInMethod: this.signInMethod,
      };
    }
    static fromJSON(e) {
      const t = "string" == typeof e ? JSON.parse(e) : e,
        { providerId: n, signInMethod: i } = t,
        r = Xe(t, ["providerId", "signInMethod"]);
      if (!n || !i) return null;
      const s = new In(n, i);
      return (
        (s.idToken = r.idToken || void 0),
        (s.accessToken = r.accessToken || void 0),
        (s.secret = r.secret),
        (s.nonce = r.nonce),
        (s.pendingToken = r.pendingToken || null),
        s
      );
    }
    _getIdTokenResponse(e) {
      return bn(e, this.buildRequest());
    }
    _linkToIdToken(e, t) {
      const n = this.buildRequest();
      return (n.idToken = t), bn(e, n);
    }
    _getReauthenticationResolver(e) {
      const t = this.buildRequest();
      return (t.autoCreate = !1), bn(e, t);
    }
    buildRequest() {
      const e = { requestUri: "http://localhost", returnSecureToken: !0 };
      if (this.pendingToken) e.pendingToken = this.pendingToken;
      else {
        const t = {};
        this.idToken && (t.id_token = this.idToken),
          this.accessToken && (t.access_token = this.accessToken),
          this.secret && (t.oauth_token_secret = this.secret),
          (t.providerId = this.providerId),
          this.nonce && !this.pendingToken && (t.nonce = this.nonce),
          (e.postBody = m(t));
      }
      return e;
    }
  }
  const En = { USER_NOT_FOUND: "user-not-found" };
  class Tn extends vn {
    constructor(e) {
      super("phone", "phone"), (this.params = e);
    }
    static _fromVerification(e, t) {
      return new Tn({ verificationId: e, verificationCode: t });
    }
    static _fromTokenResponse(e, t) {
      return new Tn({ phoneNumber: e, temporaryProof: t });
    }
    _getIdTokenResponse(e) {
      return (async function (e, t) {
        return _t(e, "POST", "/v1/accounts:signInWithPhoneNumber", vt(e, t));
      })(e, this._makeVerificationRequest());
    }
    _linkToIdToken(e, t) {
      return (async function (e, t) {
        const n = await _t(
          e,
          "POST",
          "/v1/accounts:signInWithPhoneNumber",
          vt(e, t)
        );
        if (n.temporaryProof)
          throw Tt(e, "account-exists-with-different-credential", n);
        return n;
      })(e, Object.assign({ idToken: t }, this._makeVerificationRequest()));
    }
    _getReauthenticationResolver(e) {
      return (async function (e, t) {
        return _t(
          e,
          "POST",
          "/v1/accounts:signInWithPhoneNumber",
          vt(e, Object.assign(Object.assign({}, t), { operation: "REAUTH" })),
          En
        );
      })(e, this._makeVerificationRequest());
    }
    _makeVerificationRequest() {
      const {
        temporaryProof: e,
        phoneNumber: t,
        verificationId: n,
        verificationCode: i,
      } = this.params;
      return e && t
        ? { temporaryProof: e, phoneNumber: t }
        : { sessionInfo: n, code: i };
    }
    toJSON() {
      const e = { providerId: this.providerId };
      return (
        this.params.phoneNumber && (e.phoneNumber = this.params.phoneNumber),
        this.params.temporaryProof &&
          (e.temporaryProof = this.params.temporaryProof),
        this.params.verificationCode &&
          (e.verificationCode = this.params.verificationCode),
        this.params.verificationId &&
          (e.verificationId = this.params.verificationId),
        e
      );
    }
    static fromJSON(e) {
      "string" == typeof e && (e = JSON.parse(e));
      const {
        verificationId: t,
        verificationCode: n,
        phoneNumber: i,
        temporaryProof: r,
      } = e;
      return n || t || i || r
        ? new Tn({
            verificationId: t,
            verificationCode: n,
            phoneNumber: i,
            temporaryProof: r,
          })
        : null;
    }
  }
  class Sn {
    constructor(e) {
      var t, n, i, r, s, o;
      const a = v(y(e)),
        h = null !== (t = a.apiKey) && void 0 !== t ? t : null,
        c = null !== (n = a.oobCode) && void 0 !== n ? n : null,
        l = (function (e) {
          switch (e) {
            case "recoverEmail":
              return "RECOVER_EMAIL";
            case "resetPassword":
              return "PASSWORD_RESET";
            case "signIn":
              return "EMAIL_SIGNIN";
            case "verifyEmail":
              return "VERIFY_EMAIL";
            case "verifyAndChangeEmail":
              return "VERIFY_AND_CHANGE_EMAIL";
            case "revertSecondFactorAddition":
              return "REVERT_SECOND_FACTOR_ADDITION";
            default:
              return null;
          }
        })(null !== (i = a.mode) && void 0 !== i ? i : null);
      ot(h && c && l, "argument-error"),
        (this.apiKey = h),
        (this.operation = l),
        (this.code = c),
        (this.continueUrl =
          null !== (r = a.continueUrl) && void 0 !== r ? r : null),
        (this.languageCode =
          null !== (s = a.languageCode) && void 0 !== s ? s : null),
        (this.tenantId = null !== (o = a.tenantId) && void 0 !== o ? o : null);
    }
    static parseLink(e) {
      const t = (function (e) {
        const t = v(y(e)).link,
          n = t ? v(y(t)).deep_link_id : null,
          i = v(y(e)).deep_link_id;
        return (i ? v(y(i)).link : null) || i || n || t || e;
      })(e);
      try {
        return new Sn(t);
      } catch (e) {
        return null;
      }
    }
  }
  class kn {
    constructor() {
      this.providerId = kn.PROVIDER_ID;
    }
    static credential(e, t) {
      return _n._fromEmailAndPassword(e, t);
    }
    static credentialWithLink(e, t) {
      const n = Sn.parseLink(t);
      return (
        ot(n, "argument-error"), _n._fromEmailAndCode(e, n.code, n.tenantId)
      );
    }
  }
  (kn.PROVIDER_ID = "password"),
    (kn.EMAIL_PASSWORD_SIGN_IN_METHOD = "password"),
    (kn.EMAIL_LINK_SIGN_IN_METHOD = "emailLink");
  class Cn {
    constructor(e) {
      (this.providerId = e),
        (this.defaultLanguageCode = null),
        (this.customParameters = {});
    }
    setDefaultLanguage(e) {
      this.defaultLanguageCode = e;
    }
    setCustomParameters(e) {
      return (this.customParameters = e), this;
    }
    getCustomParameters() {
      return this.customParameters;
    }
  }
  class An extends Cn {
    constructor() {
      super(...arguments), (this.scopes = []);
    }
    addScope(e) {
      return this.scopes.includes(e) || this.scopes.push(e), this;
    }
    getScopes() {
      return [...this.scopes];
    }
  }
  class Rn extends An {
    constructor() {
      super("facebook.com");
    }
    static credential(e) {
      return In._fromParams({
        providerId: Rn.PROVIDER_ID,
        signInMethod: Rn.FACEBOOK_SIGN_IN_METHOD,
        accessToken: e,
      });
    }
    static credentialFromResult(e) {
      return Rn.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Rn.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e || !("oauthAccessToken" in e)) return null;
      if (!e.oauthAccessToken) return null;
      try {
        return Rn.credential(e.oauthAccessToken);
      } catch (e) {
        return null;
      }
    }
  }
  (Rn.FACEBOOK_SIGN_IN_METHOD = "facebook.com"),
    (Rn.PROVIDER_ID = "facebook.com");
  class Pn extends An {
    constructor() {
      super("google.com"), this.addScope("profile");
    }
    static credential(e, t) {
      return In._fromParams({
        providerId: Pn.PROVIDER_ID,
        signInMethod: Pn.GOOGLE_SIGN_IN_METHOD,
        idToken: e,
        accessToken: t,
      });
    }
    static credentialFromResult(e) {
      return Pn.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Pn.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { oauthIdToken: t, oauthAccessToken: n } = e;
      if (!t && !n) return null;
      try {
        return Pn.credential(t, n);
      } catch (e) {
        return null;
      }
    }
  }
  (Pn.GOOGLE_SIGN_IN_METHOD = "google.com"), (Pn.PROVIDER_ID = "google.com");
  class On extends An {
    constructor() {
      super("github.com");
    }
    static credential(e) {
      return In._fromParams({
        providerId: On.PROVIDER_ID,
        signInMethod: On.GITHUB_SIGN_IN_METHOD,
        accessToken: e,
      });
    }
    static credentialFromResult(e) {
      return On.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return On.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e || !("oauthAccessToken" in e)) return null;
      if (!e.oauthAccessToken) return null;
      try {
        return On.credential(e.oauthAccessToken);
      } catch (e) {
        return null;
      }
    }
  }
  (On.GITHUB_SIGN_IN_METHOD = "github.com"), (On.PROVIDER_ID = "github.com");
  class Nn extends An {
    constructor() {
      super("twitter.com");
    }
    static credential(e, t) {
      return In._fromParams({
        providerId: Nn.PROVIDER_ID,
        signInMethod: Nn.TWITTER_SIGN_IN_METHOD,
        oauthToken: e,
        oauthTokenSecret: t,
      });
    }
    static credentialFromResult(e) {
      return Nn.credentialFromTaggedObject(e);
    }
    static credentialFromError(e) {
      return Nn.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { oauthAccessToken: t, oauthTokenSecret: n } = e;
      if (!t || !n) return null;
      try {
        return Nn.credential(t, n);
      } catch (e) {
        return null;
      }
    }
  }
  (Nn.TWITTER_SIGN_IN_METHOD = "twitter.com"), (Nn.PROVIDER_ID = "twitter.com");
  class Ln {
    constructor(e) {
      (this.user = e.user),
        (this.providerId = e.providerId),
        (this._tokenResponse = e._tokenResponse),
        (this.operationType = e.operationType);
    }
    static async _fromIdTokenResponse(e, t, n, i = !1) {
      const r = await Ft._fromIdTokenResponse(e, n, i),
        s = Dn(n);
      return new Ln({
        user: r,
        providerId: s,
        _tokenResponse: n,
        operationType: t,
      });
    }
    static async _forOperation(e, t, n) {
      await e._updateTokensIfNecessary(n, !0);
      const i = Dn(n);
      return new Ln({
        user: e,
        providerId: i,
        _tokenResponse: n,
        operationType: t,
      });
    }
  }
  function Dn(e) {
    return e.providerId ? e.providerId : "phoneNumber" in e ? "phone" : null;
  }
  class Mn extends u {
    constructor(e, t, n, i) {
      var r;
      super(t.code, t.message),
        (this.operationType = n),
        (this.user = i),
        Object.setPrototypeOf(this, Mn.prototype),
        (this.customData = {
          appName: e.name,
          tenantId: null !== (r = e.tenantId) && void 0 !== r ? r : void 0,
          _serverResponse: t.customData._serverResponse,
          operationType: n,
        });
    }
    static _fromErrorAndOperation(e, t, n, i) {
      return new Mn(e, t, n, i);
    }
  }
  function Un(e, t, n, i) {
    return (
      "reauthenticate" === t
        ? n._getReauthenticationResolver(e)
        : n._getIdTokenResponse(e)
    ).catch((n) => {
      if ("auth/multi-factor-auth-required" === n.code)
        throw Mn._fromErrorAndOperation(e, n, t, i);
      throw n;
    });
  }
  new WeakMap();
  const xn = "__sak";
  class jn {
    constructor(e, t) {
      (this.storageRetriever = e), (this.type = t);
    }
    _isAvailable() {
      try {
        return this.storage
          ? (this.storage.setItem(xn, "1"),
            this.storage.removeItem(xn),
            Promise.resolve(!0))
          : Promise.resolve(!1);
      } catch (e) {
        return Promise.resolve(!1);
      }
    }
    _set(e, t) {
      return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
    }
    _get(e) {
      const t = this.storage.getItem(e);
      return Promise.resolve(t ? JSON.parse(t) : null);
    }
    _remove(e) {
      return this.storage.removeItem(e), Promise.resolve();
    }
    get storage() {
      return this.storageRetriever();
    }
  }
  class Fn extends jn {
    constructor() {
      super(() => window.localStorage, "LOCAL"),
        (this.boundEventHandler = (e, t) => this.onStorageEvent(e, t)),
        (this.listeners = {}),
        (this.localCache = {}),
        (this.pollTimer = null),
        (this.safariLocalStorageNotSynced =
          (function () {
            const e = l();
            return Gt(e) || en(e);
          })() &&
          (function () {
            try {
              return !(!window || window === window.top);
            } catch (e) {
              return !1;
            }
          })()),
        (this.fallbackToPolling = tn()),
        (this._shouldAllowMigration = !0);
    }
    forAllChangedKeys(e) {
      for (const t of Object.keys(this.listeners)) {
        const n = this.storage.getItem(t),
          i = this.localCache[t];
        n !== i && e(t, i, n);
      }
    }
    onStorageEvent(e, t = !1) {
      if (!e.key)
        return void this.forAllChangedKeys((e, t, n) => {
          this.notifyListeners(e, n);
        });
      const n = e.key;
      if (
        (t ? this.detachListener() : this.stopPolling(),
        this.safariLocalStorageNotSynced)
      ) {
        const i = this.storage.getItem(n);
        if (e.newValue !== i)
          null !== e.newValue
            ? this.storage.setItem(n, e.newValue)
            : this.storage.removeItem(n);
        else if (this.localCache[n] === e.newValue && !t) return;
      }
      const i = () => {
          const e = this.storage.getItem(n);
          (t || this.localCache[n] !== e) && this.notifyListeners(n, e);
        },
        r = this.storage.getItem(n);
      !(function () {
        const e = l();
        return e.indexOf("MSIE ") >= 0 || e.indexOf("Trident/") >= 0;
      })() ||
      10 !== document.documentMode ||
      r === e.newValue ||
      e.newValue === e.oldValue
        ? i()
        : setTimeout(i, 10);
    }
    notifyListeners(e, t) {
      this.localCache[e] = t;
      const n = this.listeners[e];
      if (n) for (const e of Array.from(n)) e(t ? JSON.parse(t) : t);
    }
    startPolling() {
      this.stopPolling(),
        (this.pollTimer = setInterval(() => {
          this.forAllChangedKeys((e, t, n) => {
            this.onStorageEvent(
              new StorageEvent("storage", { key: e, oldValue: t, newValue: n }),
              !0
            );
          });
        }, 1e3));
    }
    stopPolling() {
      this.pollTimer &&
        (clearInterval(this.pollTimer), (this.pollTimer = null));
    }
    attachListener() {
      window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
      window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(e, t) {
      0 === Object.keys(this.listeners).length &&
        (this.fallbackToPolling ? this.startPolling() : this.attachListener()),
        this.listeners[e] ||
          ((this.listeners[e] = new Set()),
          (this.localCache[e] = this.storage.getItem(e))),
        this.listeners[e].add(t);
    }
    _removeListener(e, t) {
      this.listeners[e] &&
        (this.listeners[e].delete(t),
        0 === this.listeners[e].size && delete this.listeners[e]),
        0 === Object.keys(this.listeners).length &&
          (this.detachListener(), this.stopPolling());
    }
    async _set(e, t) {
      await super._set(e, t), (this.localCache[e] = JSON.stringify(t));
    }
    async _get(e) {
      const t = await super._get(e);
      return (this.localCache[e] = JSON.stringify(t)), t;
    }
    async _remove(e) {
      await super._remove(e), delete this.localCache[e];
    }
  }
  Fn.type = "LOCAL";
  const Vn = Fn;
  class Bn extends jn {
    constructor() {
      super(() => window.sessionStorage, "SESSION");
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
  }
  Bn.type = "SESSION";
  const Hn = Bn;
  class zn {
    constructor(e) {
      (this.eventTarget = e),
        (this.handlersMap = {}),
        (this.boundEventHandler = this.handleEvent.bind(this));
    }
    static _getInstance(e) {
      const t = this.receivers.find((t) => t.isListeningto(e));
      if (t) return t;
      const n = new zn(e);
      return this.receivers.push(n), n;
    }
    isListeningto(e) {
      return this.eventTarget === e;
    }
    async handleEvent(e) {
      const t = e,
        { eventId: n, eventType: i, data: r } = t.data,
        s = this.handlersMap[i];
      if (!(null == s ? void 0 : s.size)) return;
      t.ports[0].postMessage({ status: "ack", eventId: n, eventType: i });
      const o = Array.from(s).map(async (e) => e(t.origin, r)),
        a = await (function (e) {
          return Promise.all(
            e.map(async (e) => {
              try {
                return { fulfilled: !0, value: await e };
              } catch (e) {
                return { fulfilled: !1, reason: e };
              }
            })
          );
        })(o);
      t.ports[0].postMessage({
        status: "done",
        eventId: n,
        eventType: i,
        response: a,
      });
    }
    _subscribe(e, t) {
      0 === Object.keys(this.handlersMap).length &&
        this.eventTarget.addEventListener("message", this.boundEventHandler),
        this.handlersMap[e] || (this.handlersMap[e] = new Set()),
        this.handlersMap[e].add(t);
    }
    _unsubscribe(e, t) {
      this.handlersMap[e] && t && this.handlersMap[e].delete(t),
        (t && 0 !== this.handlersMap[e].size) || delete this.handlersMap[e],
        0 === Object.keys(this.handlersMap).length &&
          this.eventTarget.removeEventListener(
            "message",
            this.boundEventHandler
          );
    }
  }
  function $n(e = "", t = 10) {
    let n = "";
    for (let e = 0; e < t; e++) n += Math.floor(10 * Math.random());
    return e + n;
  }
  zn.receivers = [];
  class Wn {
    constructor(e) {
      (this.target = e), (this.handlers = new Set());
    }
    removeMessageHandler(e) {
      e.messageChannel &&
        (e.messageChannel.port1.removeEventListener("message", e.onMessage),
        e.messageChannel.port1.close()),
        this.handlers.delete(e);
    }
    async _send(e, t, n = 50) {
      const i =
        "undefined" != typeof MessageChannel ? new MessageChannel() : null;
      if (!i) throw new Error("connection_unavailable");
      let r, s;
      return new Promise((o, a) => {
        const h = $n("", 20);
        i.port1.start();
        const c = setTimeout(() => {
          a(new Error("unsupported_event"));
        }, n);
        (s = {
          messageChannel: i,
          onMessage(e) {
            const t = e;
            if (t.data.eventId === h)
              switch (t.data.status) {
                case "ack":
                  clearTimeout(c),
                    (r = setTimeout(() => {
                      a(new Error("timeout"));
                    }, 3e3));
                  break;
                case "done":
                  clearTimeout(r), o(t.data.response);
                  break;
                default:
                  clearTimeout(c),
                    clearTimeout(r),
                    a(new Error("invalid_response"));
              }
          },
        }),
          this.handlers.add(s),
          i.port1.addEventListener("message", s.onMessage),
          this.target.postMessage({ eventType: e, eventId: h, data: t }, [
            i.port2,
          ]);
      }).finally(() => {
        s && this.removeMessageHandler(s);
      });
    }
  }
  function Kn() {
    return window;
  }
  function qn() {
    return (
      void 0 !== Kn().WorkerGlobalScope &&
      "function" == typeof Kn().importScripts
    );
  }
  const Gn = "firebaseLocalStorageDb",
    Jn = "firebaseLocalStorage",
    Xn = "fbase_key";
  class Yn {
    constructor(e) {
      this.request = e;
    }
    toPromise() {
      return new Promise((e, t) => {
        this.request.addEventListener("success", () => {
          e(this.request.result);
        }),
          this.request.addEventListener("error", () => {
            t(this.request.error);
          });
      });
    }
  }
  function Qn(e, t) {
    return e.transaction([Jn], t ? "readwrite" : "readonly").objectStore(Jn);
  }
  function Zn() {
    const e = indexedDB.open(Gn, 1);
    return new Promise((t, n) => {
      e.addEventListener("error", () => {
        n(e.error);
      }),
        e.addEventListener("upgradeneeded", () => {
          const t = e.result;
          try {
            t.createObjectStore(Jn, { keyPath: Xn });
          } catch (e) {
            n(e);
          }
        }),
        e.addEventListener("success", async () => {
          const n = e.result;
          n.objectStoreNames.contains(Jn)
            ? t(n)
            : (n.close(),
              await (function () {
                const e = indexedDB.deleteDatabase(Gn);
                return new Yn(e).toPromise();
              })(),
              t(await Zn()));
        });
    });
  }
  async function ei(e, t, n) {
    const i = Qn(e, !0).put({ [Xn]: t, value: n });
    return new Yn(i).toPromise();
  }
  function ti(e, t) {
    const n = Qn(e, !0).delete(t);
    return new Yn(n).toPromise();
  }
  class ni {
    constructor() {
      (this.type = "LOCAL"),
        (this._shouldAllowMigration = !0),
        (this.listeners = {}),
        (this.localCache = {}),
        (this.pollTimer = null),
        (this.pendingWrites = 0),
        (this.receiver = null),
        (this.sender = null),
        (this.serviceWorkerReceiverAvailable = !1),
        (this.activeServiceWorker = null),
        (this._workerInitializationPromise =
          this.initializeServiceWorkerMessaging().then(
            () => {},
            () => {}
          ));
    }
    async _openDb() {
      return this.db || (this.db = await Zn()), this.db;
    }
    async _withRetries(e) {
      let t = 0;
      for (;;)
        try {
          const t = await this._openDb();
          return await e(t);
        } catch (e) {
          if (t++ > 3) throw e;
          this.db && (this.db.close(), (this.db = void 0));
        }
    }
    async initializeServiceWorkerMessaging() {
      return qn() ? this.initializeReceiver() : this.initializeSender();
    }
    async initializeReceiver() {
      (this.receiver = zn._getInstance(qn() ? self : null)),
        this.receiver._subscribe("keyChanged", async (e, t) => ({
          keyProcessed: (await this._poll()).includes(t.key),
        })),
        this.receiver._subscribe("ping", async (e, t) => ["keyChanged"]);
    }
    async initializeSender() {
      var e, t;
      if (
        ((this.activeServiceWorker = await (async function () {
          if (
            !(null === navigator || void 0 === navigator
              ? void 0
              : navigator.serviceWorker)
          )
            return null;
          try {
            return (await navigator.serviceWorker.ready).active;
          } catch (e) {
            return null;
          }
        })()),
        !this.activeServiceWorker)
      )
        return;
      this.sender = new Wn(this.activeServiceWorker);
      const n = await this.sender._send("ping", {}, 800);
      n &&
        (null === (e = n[0]) || void 0 === e ? void 0 : e.fulfilled) &&
        (null === (t = n[0]) || void 0 === t
          ? void 0
          : t.value.includes("keyChanged")) &&
        (this.serviceWorkerReceiverAvailable = !0);
    }
    async notifyServiceWorker(e) {
      var t;
      if (
        this.sender &&
        this.activeServiceWorker &&
        ((null ===
          (t =
            null === navigator || void 0 === navigator
              ? void 0
              : navigator.serviceWorker) || void 0 === t
          ? void 0
          : t.controller) || null) === this.activeServiceWorker
      )
        try {
          await this.sender._send(
            "keyChanged",
            { key: e },
            this.serviceWorkerReceiverAvailable ? 800 : 50
          );
        } catch (t) {}
    }
    async _isAvailable() {
      try {
        if (!indexedDB) return !1;
        const e = await Zn();
        return await ei(e, xn, "1"), await ti(e, xn), !0;
      } catch (e) {}
      return !1;
    }
    async _withPendingWrite(e) {
      this.pendingWrites++;
      try {
        await e();
      } finally {
        this.pendingWrites--;
      }
    }
    async _set(e, t) {
      return this._withPendingWrite(
        async () => (
          await this._withRetries((n) => ei(n, e, t)),
          (this.localCache[e] = t),
          this.notifyServiceWorker(e)
        )
      );
    }
    async _get(e) {
      const t = await this._withRetries((t) =>
        (async function (e, t) {
          const n = Qn(e, !1).get(t),
            i = await new Yn(n).toPromise();
          return void 0 === i ? null : i.value;
        })(t, e)
      );
      return (this.localCache[e] = t), t;
    }
    async _remove(e) {
      return this._withPendingWrite(
        async () => (
          await this._withRetries((t) => ti(t, e)),
          delete this.localCache[e],
          this.notifyServiceWorker(e)
        )
      );
    }
    async _poll() {
      const e = await this._withRetries((e) => {
        const t = Qn(e, !1).getAll();
        return new Yn(t).toPromise();
      });
      if (!e) return [];
      if (0 !== this.pendingWrites) return [];
      const t = [],
        n = new Set();
      if (0 !== e.length)
        for (const { fbase_key: i, value: r } of e)
          n.add(i),
            JSON.stringify(this.localCache[i]) !== JSON.stringify(r) &&
              (this.notifyListeners(i, r), t.push(i));
      for (const e of Object.keys(this.localCache))
        this.localCache[e] &&
          !n.has(e) &&
          (this.notifyListeners(e, null), t.push(e));
      return t;
    }
    notifyListeners(e, t) {
      this.localCache[e] = t;
      const n = this.listeners[e];
      if (n) for (const e of Array.from(n)) e(t);
    }
    startPolling() {
      this.stopPolling(),
        (this.pollTimer = setInterval(async () => this._poll(), 800));
    }
    stopPolling() {
      this.pollTimer &&
        (clearInterval(this.pollTimer), (this.pollTimer = null));
    }
    _addListener(e, t) {
      0 === Object.keys(this.listeners).length && this.startPolling(),
        this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)),
        this.listeners[e].add(t);
    }
    _removeListener(e, t) {
      this.listeners[e] &&
        (this.listeners[e].delete(t),
        0 === this.listeners[e].size && delete this.listeners[e]),
        0 === Object.keys(this.listeners).length && this.stopPolling();
    }
  }
  ni.type = "LOCAL";
  const ii = ni;
  un("rcb"), new dt(3e4, 6e4);
  class ri {
    constructor(e) {
      (this.providerId = ri.PROVIDER_ID), (this.auth = an(e));
    }
    verifyPhoneNumber(e, t) {
      return (async function (e, t, n) {
        var i;
        const r = await n.verify();
        try {
          let s;
          if (
            (ot("string" == typeof r, e, "argument-error"),
            ot("recaptcha" === n.type, e, "argument-error"),
            (s = "string" == typeof t ? { phoneNumber: t } : t),
            "session" in s)
          ) {
            const t = s.session;
            if ("phoneNumber" in s) {
              ot("enroll" === t.type, e, "internal-error");
              const n = await (function (e, t) {
                return yt(
                  e,
                  "POST",
                  "/v2/accounts/mfaEnrollment:start",
                  vt(e, t)
                );
              })(e, {
                idToken: t.credential,
                phoneEnrollmentInfo: {
                  phoneNumber: s.phoneNumber,
                  recaptchaToken: r,
                },
              });
              return n.phoneSessionInfo.sessionInfo;
            }
            {
              ot("signin" === t.type, e, "internal-error");
              const n =
                (null === (i = s.multiFactorHint) || void 0 === i
                  ? void 0
                  : i.uid) || s.multiFactorUid;
              ot(n, e, "missing-multi-factor-info");
              const o = await (function (e, t) {
                return yt(e, "POST", "/v2/accounts/mfaSignIn:start", vt(e, t));
              })(e, {
                mfaPendingCredential: t.credential,
                mfaEnrollmentId: n,
                phoneSignInInfo: { recaptchaToken: r },
              });
              return o.phoneResponseInfo.sessionInfo;
            }
          }
          {
            const { sessionInfo: t } = await (async function (e, t) {
              return yt(
                e,
                "POST",
                "/v1/accounts:sendVerificationCode",
                vt(e, t)
              );
            })(e, { phoneNumber: s.phoneNumber, recaptchaToken: r });
            return t;
          }
        } finally {
          n._reset();
        }
      })(this.auth, e, b(t));
    }
    static credential(e, t) {
      return Tn._fromVerification(e, t);
    }
    static credentialFromResult(e) {
      const t = e;
      return ri.credentialFromTaggedObject(t);
    }
    static credentialFromError(e) {
      return ri.credentialFromTaggedObject(e.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: e }) {
      if (!e) return null;
      const { phoneNumber: t, temporaryProof: n } = e;
      return t && n ? Tn._fromTokenResponse(t, n) : null;
    }
  }
  (ri.PROVIDER_ID = "phone"), (ri.PHONE_SIGN_IN_METHOD = "phone");
  class si extends vn {
    constructor(e) {
      super("custom", "custom"), (this.params = e);
    }
    _getIdTokenResponse(e) {
      return bn(e, this._buildIdpRequest());
    }
    _linkToIdToken(e, t) {
      return bn(e, this._buildIdpRequest(t));
    }
    _getReauthenticationResolver(e) {
      return bn(e, this._buildIdpRequest());
    }
    _buildIdpRequest(e) {
      const t = {
        requestUri: this.params.requestUri,
        sessionId: this.params.sessionId,
        postBody: this.params.postBody,
        tenantId: this.params.tenantId,
        pendingToken: this.params.pendingToken,
        returnSecureToken: !0,
        returnIdpCredential: !0,
      };
      return e && (t.idToken = e), t;
    }
  }
  function oi(e) {
    return (async function (e, t, n = !1) {
      if (Le(e.app)) return Promise.reject(rt(e));
      const i = "signIn",
        r = await Un(e, i, t),
        s = await Ln._fromIdTokenResponse(e, i, r);
      return n || (await e._updateCurrentUser(s.user)), s;
    })(e.auth, new si(e), e.bypassAuthState);
  }
  function ai(e) {
    const { auth: t, user: n } = e;
    return (
      ot(n, t, "internal-error"),
      (async function (e, t, n = !1) {
        const { auth: i } = e;
        if (Le(i.app)) return Promise.reject(rt(i));
        const r = "reauthenticate";
        try {
          const s = await Nt(e, Un(i, r, t, e), n);
          ot(s.idToken, i, "internal-error");
          const o = Pt(s.idToken);
          ot(o, i, "internal-error");
          const { sub: a } = o;
          return ot(e.uid === a, i, "user-mismatch"), Ln._forOperation(e, r, s);
        } catch (e) {
          throw (
            ("auth/user-not-found" === (null == e ? void 0 : e.code) &&
              tt(i, "user-mismatch"),
            e)
          );
        }
      })(n, new si(e), e.bypassAuthState)
    );
  }
  async function hi(e) {
    const { auth: t, user: n } = e;
    return (
      ot(n, t, "internal-error"),
      (async function (e, t, n = !1) {
        const i = await Nt(
          e,
          t._linkToIdToken(e.auth, await e.getIdToken()),
          n
        );
        return Ln._forOperation(e, "link", i);
      })(n, new si(e), e.bypassAuthState)
    );
  }
  class ci {
    constructor(e, t, n, i, r = !1) {
      (this.auth = e),
        (this.resolver = n),
        (this.user = i),
        (this.bypassAuthState = r),
        (this.pendingPromise = null),
        (this.eventManager = null),
        (this.filter = Array.isArray(t) ? t : [t]);
    }
    execute() {
      return new Promise(async (e, t) => {
        this.pendingPromise = { resolve: e, reject: t };
        try {
          (this.eventManager = await this.resolver._initialize(this.auth)),
            await this.onExecution(),
            this.eventManager.registerConsumer(this);
        } catch (e) {
          this.reject(e);
        }
      });
    }
    async onAuthEvent(e) {
      const {
        urlResponse: t,
        sessionId: n,
        postBody: i,
        tenantId: r,
        error: s,
        type: o,
      } = e;
      if (s) return void this.reject(s);
      const a = {
        auth: this.auth,
        requestUri: t,
        sessionId: n,
        tenantId: r || void 0,
        postBody: i || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState,
      };
      try {
        this.resolve(await this.getIdpTask(o)(a));
      } catch (e) {
        this.reject(e);
      }
    }
    onError(e) {
      this.reject(e);
    }
    getIdpTask(e) {
      switch (e) {
        case "signInViaPopup":
        case "signInViaRedirect":
          return oi;
        case "linkViaPopup":
        case "linkViaRedirect":
          return hi;
        case "reauthViaPopup":
        case "reauthViaRedirect":
          return ai;
        default:
          tt(this.auth, "internal-error");
      }
    }
    resolve(e) {
      ht(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.resolve(e),
        this.unregisterAndCleanUp();
    }
    reject(e) {
      ht(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.reject(e),
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
      this.eventManager && this.eventManager.unregisterConsumer(this),
        (this.pendingPromise = null),
        this.cleanUp();
    }
  }
  const li = new dt(2e3, 1e4);
  class ui extends ci {
    constructor(e, t, n, i, r) {
      super(e, t, i, r),
        (this.provider = n),
        (this.authWindow = null),
        (this.pollId = null),
        ui.currentPopupAction && ui.currentPopupAction.cancel(),
        (ui.currentPopupAction = this);
    }
    async executeNotNull() {
      const e = await this.execute();
      return ot(e, this.auth, "internal-error"), e;
    }
    async onExecution() {
      ht(1 === this.filter.length, "Popup operations only handle one event");
      const e = $n();
      (this.authWindow = await this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        e
      )),
        (this.authWindow.associatedEvent = e),
        this.resolver._originValidation(this.auth).catch((e) => {
          this.reject(e);
        }),
        this.resolver._isIframeWebStorageSupported(this.auth, (e) => {
          e || this.reject(nt(this.auth, "web-storage-unsupported"));
        }),
        this.pollUserCancellation();
    }
    get eventId() {
      var e;
      return (
        (null === (e = this.authWindow) || void 0 === e
          ? void 0
          : e.associatedEvent) || null
      );
    }
    cancel() {
      this.reject(nt(this.auth, "cancelled-popup-request"));
    }
    cleanUp() {
      this.authWindow && this.authWindow.close(),
        this.pollId && window.clearTimeout(this.pollId),
        (this.authWindow = null),
        (this.pollId = null),
        (ui.currentPopupAction = null);
    }
    pollUserCancellation() {
      const e = () => {
        var t, n;
        (
          null ===
            (n =
              null === (t = this.authWindow) || void 0 === t
                ? void 0
                : t.window) || void 0 === n
            ? void 0
            : n.closed
        )
          ? (this.pollId = window.setTimeout(() => {
              (this.pollId = null),
                this.reject(nt(this.auth, "popup-closed-by-user"));
            }, 8e3))
          : (this.pollId = window.setTimeout(e, li.get()));
      };
      e();
    }
  }
  ui.currentPopupAction = null;
  const di = "pendingRedirect",
    pi = new Map();
  class fi extends ci {
    constructor(e, t, n = !1) {
      super(
        e,
        [
          "signInViaRedirect",
          "linkViaRedirect",
          "reauthViaRedirect",
          "unknown",
        ],
        t,
        void 0,
        n
      ),
        (this.eventId = null);
    }
    async execute() {
      let e = pi.get(this.auth._key());
      if (!e) {
        try {
          const t = await (async function (e, t) {
              const n = (function (e) {
                  return $t(di, e.config.apiKey, e.name);
                })(t),
                i = (function (e) {
                  return Bt(e._redirectPersistence);
                })(e);
              if (!(await i._isAvailable())) return !1;
              const r = "true" === (await i._get(n));
              return await i._remove(n), r;
            })(this.resolver, this.auth),
            n = t ? await super.execute() : null;
          e = () => Promise.resolve(n);
        } catch (t) {
          e = () => Promise.reject(t);
        }
        pi.set(this.auth._key(), e);
      }
      return (
        this.bypassAuthState ||
          pi.set(this.auth._key(), () => Promise.resolve(null)),
        e()
      );
    }
    async onAuthEvent(e) {
      if ("signInViaRedirect" === e.type) return super.onAuthEvent(e);
      if ("unknown" !== e.type) {
        if (e.eventId) {
          const t = await this.auth._redirectUserForId(e.eventId);
          if (t) return (this.user = t), super.onAuthEvent(e);
          this.resolve(null);
        }
      } else this.resolve(null);
    }
    async onExecution() {}
    cleanUp() {}
  }
  function gi(e, t) {
    pi.set(e._key(), t);
  }
  async function mi(e, t, n = !1) {
    if (Le(e.app)) return Promise.reject(rt(e));
    const i = an(e),
      r = (function (e, t) {
        return t
          ? Bt(t)
          : (ot(e._popupRedirectResolver, e, "argument-error"),
            e._popupRedirectResolver);
      })(i, t),
      s = new fi(i, r, n),
      o = await s.execute();
    return (
      o &&
        !n &&
        (delete o.user._redirectEventId,
        await i._persistUserIfCurrent(o.user),
        await i._setRedirectUser(null, t)),
      o
    );
  }
  class vi {
    constructor(e) {
      (this.auth = e),
        (this.cachedEventUids = new Set()),
        (this.consumers = new Set()),
        (this.queuedRedirectEvent = null),
        (this.hasHandledPotentialRedirect = !1),
        (this.lastProcessedEventTime = Date.now());
    }
    registerConsumer(e) {
      this.consumers.add(e),
        this.queuedRedirectEvent &&
          this.isEventForConsumer(this.queuedRedirectEvent, e) &&
          (this.sendToConsumer(this.queuedRedirectEvent, e),
          this.saveEventToCache(this.queuedRedirectEvent),
          (this.queuedRedirectEvent = null));
    }
    unregisterConsumer(e) {
      this.consumers.delete(e);
    }
    onEvent(e) {
      if (this.hasEventBeenHandled(e)) return !1;
      let t = !1;
      return (
        this.consumers.forEach((n) => {
          this.isEventForConsumer(e, n) &&
            ((t = !0), this.sendToConsumer(e, n), this.saveEventToCache(e));
        }),
        this.hasHandledPotentialRedirect ||
          !(function (e) {
            switch (e.type) {
              case "signInViaRedirect":
              case "linkViaRedirect":
              case "reauthViaRedirect":
                return !0;
              case "unknown":
                return wi(e);
              default:
                return !1;
            }
          })(e) ||
          ((this.hasHandledPotentialRedirect = !0),
          t || ((this.queuedRedirectEvent = e), (t = !0))),
        t
      );
    }
    sendToConsumer(e, t) {
      var n;
      if (e.error && !wi(e)) {
        const i =
          (null === (n = e.error.code) || void 0 === n
            ? void 0
            : n.split("auth/")[1]) || "internal-error";
        t.onError(nt(this.auth, i));
      } else t.onAuthEvent(e);
    }
    isEventForConsumer(e, t) {
      const n = null === t.eventId || (!!e.eventId && e.eventId === t.eventId);
      return t.filter.includes(e.type) && n;
    }
    hasEventBeenHandled(e) {
      return (
        Date.now() - this.lastProcessedEventTime >= 6e5 &&
          this.cachedEventUids.clear(),
        this.cachedEventUids.has(yi(e))
      );
    }
    saveEventToCache(e) {
      this.cachedEventUids.add(yi(e)),
        (this.lastProcessedEventTime = Date.now());
    }
  }
  function yi(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId]
      .filter((e) => e)
      .join("-");
  }
  function wi({ type: e, error: t }) {
    return (
      "unknown" === e && "auth/no-auth-event" === (null == t ? void 0 : t.code)
    );
  }
  const _i = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    bi = /^https?/;
  function Ii(e) {
    const t = ct(),
      { protocol: n, hostname: i } = new URL(t);
    if (e.startsWith("chrome-extension://")) {
      const r = new URL(e);
      return "" === r.hostname && "" === i
        ? "chrome-extension:" === n &&
            e.replace("chrome-extension://", "") ===
              t.replace("chrome-extension://", "")
        : "chrome-extension:" === n && r.hostname === i;
    }
    if (!bi.test(n)) return !1;
    if (_i.test(e)) return i === e;
    const r = e.replace(/\./g, "\\.");
    return new RegExp("^(.+\\." + r + "|" + r + ")$", "i").test(i);
  }
  const Ei = new dt(3e4, 6e4);
  function Ti() {
    const e = Kn().___jsl;
    if (null == e ? void 0 : e.H)
      for (const t of Object.keys(e.H))
        if (
          ((e.H[t].r = e.H[t].r || []),
          (e.H[t].L = e.H[t].L || []),
          (e.H[t].r = [...e.H[t].L]),
          e.CP)
        )
          for (let t = 0; t < e.CP.length; t++) e.CP[t] = null;
  }
  function Si(e) {
    return new Promise((t, n) => {
      var i, r, s;
      function o() {
        Ti(),
          gapi.load("gapi.iframes", {
            callback: () => {
              t(gapi.iframes.getContext());
            },
            ontimeout: () => {
              Ti(), n(nt(e, "network-request-failed"));
            },
            timeout: Ei.get(),
          });
      }
      if (
        null ===
          (r = null === (i = Kn().gapi) || void 0 === i ? void 0 : i.iframes) ||
        void 0 === r
          ? void 0
          : r.Iframe
      )
        t(gapi.iframes.getContext());
      else {
        if (!(null === (s = Kn().gapi) || void 0 === s ? void 0 : s.load)) {
          const t = un("iframefcb");
          return (
            (Kn()[t] = () => {
              gapi.load ? o() : n(nt(e, "network-request-failed"));
            }),
            ln(`${cn.gapiScript}?onload=${t}`).catch((e) => n(e))
          );
        }
        o();
      }
    }).catch((e) => {
      throw ((ki = null), e);
    });
  }
  let ki = null;
  const Ci = new dt(5e3, 15e3),
    Ai = "__/auth/iframe",
    Ri = "emulator/auth/iframe",
    Pi = {
      style: {
        position: "absolute",
        top: "-100px",
        width: "1px",
        height: "1px",
      },
      "aria-hidden": "true",
      tabindex: "-1",
    },
    Oi = new Map([
      ["identitytoolkit.googleapis.com", "p"],
      ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
      ["test-identitytoolkit.sandbox.googleapis.com", "t"],
    ]);
  function Ni(e) {
    const t = e.config;
    ot(t.authDomain, e, "auth-domain-config-required");
    const n = t.emulator ? pt(t, Ri) : `https://${e.config.authDomain}/${Ai}`,
      i = { apiKey: t.apiKey, appName: e.name, v: Ue },
      r = Oi.get(e.config.apiHost);
    r && (i.eid = r);
    const s = e._getFrameworks();
    return s.length && (i.fw = s.join(",")), `${n}?${m(i).slice(1)}`;
  }
  const Li = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no",
  };
  class Di {
    constructor(e) {
      (this.window = e), (this.associatedEvent = null);
    }
    close() {
      if (this.window)
        try {
          this.window.close();
        } catch (e) {}
    }
  }
  const Mi = encodeURIComponent("fac");
  async function Ui(e, t, n, i, r, s) {
    ot(e.config.authDomain, e, "auth-domain-config-required"),
      ot(e.config.apiKey, e, "invalid-api-key");
    const o = {
      apiKey: e.config.apiKey,
      appName: e.name,
      authType: n,
      redirectUrl: i,
      v: Ue,
      eventId: r,
    };
    if (t instanceof Cn) {
      t.setDefaultLanguage(e.languageCode),
        (o.providerId = t.providerId || ""),
        (function (e) {
          for (const t in e)
            if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
          return !0;
        })(t.getCustomParameters()) ||
          (o.customParameters = JSON.stringify(t.getCustomParameters()));
      for (const [e, t] of Object.entries(s || {})) o[e] = t;
    }
    if (t instanceof An) {
      const e = t.getScopes().filter((e) => "" !== e);
      e.length > 0 && (o.scopes = e.join(","));
    }
    e.tenantId && (o.tid = e.tenantId);
    const a = o;
    for (const e of Object.keys(a)) void 0 === a[e] && delete a[e];
    const h = await e._getAppCheckToken(),
      c = h ? `#${Mi}=${encodeURIComponent(h)}` : "";
    return `${(function ({ config: e }) {
      return e.emulator
        ? pt(e, "emulator/auth/handler")
        : `https://${e.authDomain}/__/auth/handler`;
    })(e)}?${m(a).slice(1)}${c}`;
  }
  const xi = "webStorageSupport",
    ji = class {
      constructor() {
        (this.eventManagers = {}),
          (this.iframes = {}),
          (this.originValidationPromises = {}),
          (this._redirectPersistence = Hn),
          (this._completeRedirectFn = mi),
          (this._overrideRedirectResult = gi);
      }
      async _openPopup(e, t, n, i) {
        var r;
        return (
          ht(
            null === (r = this.eventManagers[e._key()]) || void 0 === r
              ? void 0
              : r.manager,
            "_initialize() not called before _openPopup()"
          ),
          (function (e, t, n, i = 500, r = 600) {
            const s = Math.max(
                (window.screen.availHeight - r) / 2,
                0
              ).toString(),
              o = Math.max((window.screen.availWidth - i) / 2, 0).toString();
            let a = "";
            const h = Object.assign(Object.assign({}, Li), {
                width: i.toString(),
                height: r.toString(),
                top: s,
                left: o,
              }),
              c = l().toLowerCase();
            n && (a = Jt(c) ? "_blank" : n),
              qt(c) && ((t = t || "http://localhost"), (h.scrollbars = "yes"));
            const u = Object.entries(h).reduce(
              (e, [t, n]) => `${e}${t}=${n},`,
              ""
            );
            if (
              (function (e = l()) {
                var t;
                return (
                  en(e) &&
                  !!(null === (t = window.navigator) || void 0 === t
                    ? void 0
                    : t.standalone)
                );
              })(c) &&
              "_self" !== a
            )
              return (
                (function (e, t) {
                  const n = document.createElement("a");
                  (n.href = e), (n.target = t);
                  const i = document.createEvent("MouseEvent");
                  i.initMouseEvent(
                    "click",
                    !0,
                    !0,
                    window,
                    1,
                    0,
                    0,
                    0,
                    0,
                    !1,
                    !1,
                    !1,
                    !1,
                    1,
                    null
                  ),
                    n.dispatchEvent(i);
                })(t || "", a),
                new Di(null)
              );
            const d = window.open(t || "", a, u);
            ot(d, e, "popup-blocked");
            try {
              d.focus();
            } catch (e) {}
            return new Di(d);
          })(e, await Ui(e, t, n, ct(), i), $n())
        );
      }
      async _openRedirect(e, t, n, i) {
        return (
          await this._originValidation(e),
          (r = await Ui(e, t, n, ct(), i)),
          (Kn().location.href = r),
          new Promise(() => {})
        );
        var r;
      }
      _initialize(e) {
        const t = e._key();
        if (this.eventManagers[t]) {
          const { manager: e, promise: n } = this.eventManagers[t];
          return e
            ? Promise.resolve(e)
            : (ht(n, "If manager is not set, promise should be"), n);
        }
        const n = this.initAndGetManager(e);
        return (
          (this.eventManagers[t] = { promise: n }),
          n.catch(() => {
            delete this.eventManagers[t];
          }),
          n
        );
      }
      async initAndGetManager(e) {
        const t = await (async function (e) {
            const t = await (function (e) {
                return (ki = ki || Si(e)), ki;
              })(e),
              n = Kn().gapi;
            return (
              ot(n, e, "internal-error"),
              t.open(
                {
                  where: document.body,
                  url: Ni(e),
                  messageHandlersFilter: n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
                  attributes: Pi,
                  dontclear: !0,
                },
                (t) =>
                  new Promise(async (n, i) => {
                    await t.restyle({ setHideOnLeave: !1 });
                    const r = nt(e, "network-request-failed"),
                      s = Kn().setTimeout(() => {
                        i(r);
                      }, Ci.get());
                    function o() {
                      Kn().clearTimeout(s), n(t);
                    }
                    t.ping(o).then(o, () => {
                      i(r);
                    });
                  })
              )
            );
          })(e),
          n = new vi(e);
        return (
          t.register(
            "authEvent",
            (t) => (
              ot(null == t ? void 0 : t.authEvent, e, "invalid-auth-event"),
              { status: n.onEvent(t.authEvent) ? "ACK" : "ERROR" }
            ),
            gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
          ),
          (this.eventManagers[e._key()] = { manager: n }),
          (this.iframes[e._key()] = t),
          n
        );
      }
      _isIframeWebStorageSupported(e, t) {
        this.iframes[e._key()].send(
          xi,
          { type: xi },
          (n) => {
            var i;
            const r =
              null === (i = null == n ? void 0 : n[0]) || void 0 === i
                ? void 0
                : i[xi];
            void 0 !== r && t(!!r), tt(e, "internal-error");
          },
          gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
        );
      }
      _originValidation(e) {
        const t = e._key();
        return (
          this.originValidationPromises[t] ||
            (this.originValidationPromises[t] = (async function (e) {
              if (e.config.emulator) return;
              const { authorizedDomains: t } = await (async function (
                e,
                t = {}
              ) {
                return yt(e, "GET", "/v1/projects", t);
              })(e);
              for (const e of t)
                try {
                  if (Ii(e)) return;
                } catch (e) {}
              tt(e, "unauthorized-domain");
            })(e)),
          this.originValidationPromises[t]
        );
      }
      get _shouldInitProactively() {
        return tn() || Gt() || en();
      }
    };
  var Fi = "@firebase/auth",
    Vi = "1.7.3";
  class Bi {
    constructor(e) {
      (this.auth = e), (this.internalListeners = new Map());
    }
    getUid() {
      var e;
      return (
        this.assertAuthConfigured(),
        (null === (e = this.auth.currentUser) || void 0 === e
          ? void 0
          : e.uid) || null
      );
    }
    async getToken(e) {
      return (
        this.assertAuthConfigured(),
        await this.auth._initializationPromise,
        this.auth.currentUser
          ? { accessToken: await this.auth.currentUser.getIdToken(e) }
          : null
      );
    }
    addAuthTokenListener(e) {
      if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return;
      const t = this.auth.onIdTokenChanged((t) => {
        e((null == t ? void 0 : t.stsTokenManager.accessToken) || null);
      });
      this.internalListeners.set(e, t), this.updateProactiveRefresh();
    }
    removeAuthTokenListener(e) {
      this.assertAuthConfigured();
      const t = this.internalListeners.get(e);
      t &&
        (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
    }
    assertAuthConfigured() {
      ot(
        this.auth._initializationPromise,
        "dependent-sdk-initialized-before-auth"
      );
    }
    updateProactiveRefresh() {
      this.internalListeners.size > 0
        ? this.auth._startProactiveRefresh()
        : this.auth._stopProactiveRefresh();
    }
  }
  const Hi = h("authIdTokenMaxAge") || 300;
  let zi = null;
  var $i;
  (cn = {
    loadJS: (e) =>
      new Promise((t, n) => {
        const i = document.createElement("script");
        var r, s;
        i.setAttribute("src", e),
          (i.onload = t),
          (i.onerror = (e) => {
            const t = nt("internal-error");
            (t.customData = e), n(t);
          }),
          (i.type = "text/javascript"),
          (i.charset = "UTF-8"),
          (null !==
            (s =
              null === (r = document.getElementsByTagName("head")) ||
              void 0 === r
                ? void 0
                : r[0]) && void 0 !== s
            ? s
            : document
          ).appendChild(i);
      }),
    gapiScript: "https://apis.google.com/js/api.js",
    recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
    recaptchaEnterpriseScript:
      "https://www.google.com/recaptcha/enterprise.js?render=",
  }),
    ($i = "Browser"),
    Oe(
      new I(
        "auth",
        (e, { options: t }) => {
          const n = e.getProvider("app").getImmediate(),
            i = e.getProvider("heartbeat"),
            r = e.getProvider("app-check-internal"),
            { apiKey: s, authDomain: o } = n.options;
          ot(s && !s.includes(":"), "invalid-api-key", { appName: n.name });
          const a = {
              apiKey: s,
              authDomain: o,
              clientPlatform: $i,
              apiHost: "identitytoolkit.googleapis.com",
              tokenApiHost: "securetoken.googleapis.com",
              apiScheme: "https",
              sdkClientVersion: nn($i),
            },
            h = new on(n, i, r, a);
          return (
            (function (e, t) {
              const n = (null == t ? void 0 : t.persistence) || [],
                i = (Array.isArray(n) ? n : [n]).map(Bt);
              (null == t ? void 0 : t.errorMap) &&
                e._updateErrorMap(t.errorMap),
                e._initializeWithPersistence(
                  i,
                  null == t ? void 0 : t.popupRedirectResolver
                );
            })(h, t),
            h
          );
        },
        "PUBLIC"
      )
        .setInstantiationMode("EXPLICIT")
        .setInstanceCreatedCallback((e, t, n) => {
          e.getProvider("auth-internal").initialize();
        })
    ),
    Oe(
      new I(
        "auth-internal",
        (e) => ((e) => new Bi(e))(an(e.getProvider("auth").getImmediate())),
        "PRIVATE"
      ).setInstantiationMode("EXPLICIT")
    ),
    je(
      Fi,
      Vi,
      (function (e) {
        switch (e) {
          case "Node":
            return "node";
          case "ReactNative":
            return "rn";
          case "Worker":
            return "webworker";
          case "Cordova":
            return "cordova";
          case "WebExtension":
            return "web-extension";
          default:
            return;
        }
      })($i)
    ),
    je(Fi, Vi, "esm2017");
  var Wi,
    Ki =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {},
    qi = {};
  (function () {
    var e;
    function t() {
      (this.blockSize = -1),
        (this.blockSize = 64),
        (this.g = Array(4)),
        (this.B = Array(this.blockSize)),
        (this.o = this.h = 0),
        this.s();
    }
    function n(e, t, n) {
      n || (n = 0);
      var i = Array(16);
      if ("string" == typeof t)
        for (var r = 0; 16 > r; ++r)
          i[r] =
            t.charCodeAt(n++) |
            (t.charCodeAt(n++) << 8) |
            (t.charCodeAt(n++) << 16) |
            (t.charCodeAt(n++) << 24);
      else
        for (r = 0; 16 > r; ++r)
          i[r] = t[n++] | (t[n++] << 8) | (t[n++] << 16) | (t[n++] << 24);
      (t = e.g[0]), (n = e.g[1]), (r = e.g[2]);
      var s = e.g[3],
        o = (t + (s ^ (n & (r ^ s))) + i[0] + 3614090360) & 4294967295;
      (o =
        ((n =
          (r =
            (s =
              (t =
                (n =
                  (r =
                    (s =
                      (t =
                        (n =
                          (r =
                            (s =
                              (t =
                                (n =
                                  (r =
                                    (s =
                                      (t =
                                        (n =
                                          (r =
                                            (s =
                                              (t =
                                                (n =
                                                  (r =
                                                    (s =
                                                      (t =
                                                        (n =
                                                          (r =
                                                            (s =
                                                              (t =
                                                                (n =
                                                                  (r =
                                                                    (s =
                                                                      (t =
                                                                        (n =
                                                                          (r =
                                                                            (s =
                                                                              (t =
                                                                                (n =
                                                                                  (r =
                                                                                    (s =
                                                                                      (t =
                                                                                        (n =
                                                                                          (r =
                                                                                            (s =
                                                                                              (t =
                                                                                                (n =
                                                                                                  (r =
                                                                                                    (s =
                                                                                                      (t =
                                                                                                        (n =
                                                                                                          (r =
                                                                                                            (s =
                                                                                                              (t =
                                                                                                                (n =
                                                                                                                  (r =
                                                                                                                    (s =
                                                                                                                      (t =
                                                                                                                        (n =
                                                                                                                          (r =
                                                                                                                            (s =
                                                                                                                              (t =
                                                                                                                                n +
                                                                                                                                (((o <<
                                                                                                                                  7) &
                                                                                                                                  4294967295) |
                                                                                                                                  (o >>>
                                                                                                                                    25))) +
                                                                                                                              ((((o =
                                                                                                                                (s +
                                                                                                                                  (r ^
                                                                                                                                    (t &
                                                                                                                                      (n ^
                                                                                                                                        r))) +
                                                                                                                                  i[1] +
                                                                                                                                  3905402710) &
                                                                                                                                4294967295) <<
                                                                                                                                12) &
                                                                                                                                4294967295) |
                                                                                                                                (o >>>
                                                                                                                                  20))) +
                                                                                                                            ((((o =
                                                                                                                              (r +
                                                                                                                                (n ^
                                                                                                                                  (s &
                                                                                                                                    (t ^
                                                                                                                                      n))) +
                                                                                                                                i[2] +
                                                                                                                                606105819) &
                                                                                                                              4294967295) <<
                                                                                                                              17) &
                                                                                                                              4294967295) |
                                                                                                                              (o >>>
                                                                                                                                15))) +
                                                                                                                          ((((o =
                                                                                                                            (n +
                                                                                                                              (t ^
                                                                                                                                (r &
                                                                                                                                  (s ^
                                                                                                                                    t))) +
                                                                                                                              i[3] +
                                                                                                                              3250441966) &
                                                                                                                            4294967295) <<
                                                                                                                            22) &
                                                                                                                            4294967295) |
                                                                                                                            (o >>>
                                                                                                                              10))) +
                                                                                                                        ((((o =
                                                                                                                          (t +
                                                                                                                            (s ^
                                                                                                                              (n &
                                                                                                                                (r ^
                                                                                                                                  s))) +
                                                                                                                            i[4] +
                                                                                                                            4118548399) &
                                                                                                                          4294967295) <<
                                                                                                                          7) &
                                                                                                                          4294967295) |
                                                                                                                          (o >>>
                                                                                                                            25))) +
                                                                                                                      ((((o =
                                                                                                                        (s +
                                                                                                                          (r ^
                                                                                                                            (t &
                                                                                                                              (n ^
                                                                                                                                r))) +
                                                                                                                          i[5] +
                                                                                                                          1200080426) &
                                                                                                                        4294967295) <<
                                                                                                                        12) &
                                                                                                                        4294967295) |
                                                                                                                        (o >>>
                                                                                                                          20))) +
                                                                                                                    ((((o =
                                                                                                                      (r +
                                                                                                                        (n ^
                                                                                                                          (s &
                                                                                                                            (t ^
                                                                                                                              n))) +
                                                                                                                        i[6] +
                                                                                                                        2821735955) &
                                                                                                                      4294967295) <<
                                                                                                                      17) &
                                                                                                                      4294967295) |
                                                                                                                      (o >>>
                                                                                                                        15))) +
                                                                                                                  ((((o =
                                                                                                                    (n +
                                                                                                                      (t ^
                                                                                                                        (r &
                                                                                                                          (s ^
                                                                                                                            t))) +
                                                                                                                      i[7] +
                                                                                                                      4249261313) &
                                                                                                                    4294967295) <<
                                                                                                                    22) &
                                                                                                                    4294967295) |
                                                                                                                    (o >>>
                                                                                                                      10))) +
                                                                                                                ((((o =
                                                                                                                  (t +
                                                                                                                    (s ^
                                                                                                                      (n &
                                                                                                                        (r ^
                                                                                                                          s))) +
                                                                                                                    i[8] +
                                                                                                                    1770035416) &
                                                                                                                  4294967295) <<
                                                                                                                  7) &
                                                                                                                  4294967295) |
                                                                                                                  (o >>>
                                                                                                                    25))) +
                                                                                                              ((((o =
                                                                                                                (s +
                                                                                                                  (r ^
                                                                                                                    (t &
                                                                                                                      (n ^
                                                                                                                        r))) +
                                                                                                                  i[9] +
                                                                                                                  2336552879) &
                                                                                                                4294967295) <<
                                                                                                                12) &
                                                                                                                4294967295) |
                                                                                                                (o >>>
                                                                                                                  20))) +
                                                                                                            ((((o =
                                                                                                              (r +
                                                                                                                (n ^
                                                                                                                  (s &
                                                                                                                    (t ^
                                                                                                                      n))) +
                                                                                                                i[10] +
                                                                                                                4294925233) &
                                                                                                              4294967295) <<
                                                                                                              17) &
                                                                                                              4294967295) |
                                                                                                              (o >>>
                                                                                                                15))) +
                                                                                                          ((((o =
                                                                                                            (n +
                                                                                                              (t ^
                                                                                                                (r &
                                                                                                                  (s ^
                                                                                                                    t))) +
                                                                                                              i[11] +
                                                                                                              2304563134) &
                                                                                                            4294967295) <<
                                                                                                            22) &
                                                                                                            4294967295) |
                                                                                                            (o >>>
                                                                                                              10))) +
                                                                                                        ((((o =
                                                                                                          (t +
                                                                                                            (s ^
                                                                                                              (n &
                                                                                                                (r ^
                                                                                                                  s))) +
                                                                                                            i[12] +
                                                                                                            1804603682) &
                                                                                                          4294967295) <<
                                                                                                          7) &
                                                                                                          4294967295) |
                                                                                                          (o >>>
                                                                                                            25))) +
                                                                                                      ((((o =
                                                                                                        (s +
                                                                                                          (r ^
                                                                                                            (t &
                                                                                                              (n ^
                                                                                                                r))) +
                                                                                                          i[13] +
                                                                                                          4254626195) &
                                                                                                        4294967295) <<
                                                                                                        12) &
                                                                                                        4294967295) |
                                                                                                        (o >>>
                                                                                                          20))) +
                                                                                                    ((((o =
                                                                                                      (r +
                                                                                                        (n ^
                                                                                                          (s &
                                                                                                            (t ^
                                                                                                              n))) +
                                                                                                        i[14] +
                                                                                                        2792965006) &
                                                                                                      4294967295) <<
                                                                                                      17) &
                                                                                                      4294967295) |
                                                                                                      (o >>>
                                                                                                        15))) +
                                                                                                  ((((o =
                                                                                                    (n +
                                                                                                      (t ^
                                                                                                        (r &
                                                                                                          (s ^
                                                                                                            t))) +
                                                                                                      i[15] +
                                                                                                      1236535329) &
                                                                                                    4294967295) <<
                                                                                                    22) &
                                                                                                    4294967295) |
                                                                                                    (o >>>
                                                                                                      10))) +
                                                                                                ((((o =
                                                                                                  (t +
                                                                                                    (r ^
                                                                                                      (s &
                                                                                                        (n ^
                                                                                                          r))) +
                                                                                                    i[1] +
                                                                                                    4129170786) &
                                                                                                  4294967295) <<
                                                                                                  5) &
                                                                                                  4294967295) |
                                                                                                  (o >>>
                                                                                                    27))) +
                                                                                              ((((o =
                                                                                                (s +
                                                                                                  (n ^
                                                                                                    (r &
                                                                                                      (t ^
                                                                                                        n))) +
                                                                                                  i[6] +
                                                                                                  3225465664) &
                                                                                                4294967295) <<
                                                                                                9) &
                                                                                                4294967295) |
                                                                                                (o >>>
                                                                                                  23))) +
                                                                                            ((((o =
                                                                                              (r +
                                                                                                (t ^
                                                                                                  (n &
                                                                                                    (s ^
                                                                                                      t))) +
                                                                                                i[11] +
                                                                                                643717713) &
                                                                                              4294967295) <<
                                                                                              14) &
                                                                                              4294967295) |
                                                                                              (o >>>
                                                                                                18))) +
                                                                                          ((((o =
                                                                                            (n +
                                                                                              (s ^
                                                                                                (t &
                                                                                                  (r ^
                                                                                                    s))) +
                                                                                              i[0] +
                                                                                              3921069994) &
                                                                                            4294967295) <<
                                                                                            20) &
                                                                                            4294967295) |
                                                                                            (o >>>
                                                                                              12))) +
                                                                                        ((((o =
                                                                                          (t +
                                                                                            (r ^
                                                                                              (s &
                                                                                                (n ^
                                                                                                  r))) +
                                                                                            i[5] +
                                                                                            3593408605) &
                                                                                          4294967295) <<
                                                                                          5) &
                                                                                          4294967295) |
                                                                                          (o >>>
                                                                                            27))) +
                                                                                      ((((o =
                                                                                        (s +
                                                                                          (n ^
                                                                                            (r &
                                                                                              (t ^
                                                                                                n))) +
                                                                                          i[10] +
                                                                                          38016083) &
                                                                                        4294967295) <<
                                                                                        9) &
                                                                                        4294967295) |
                                                                                        (o >>>
                                                                                          23))) +
                                                                                    ((((o =
                                                                                      (r +
                                                                                        (t ^
                                                                                          (n &
                                                                                            (s ^
                                                                                              t))) +
                                                                                        i[15] +
                                                                                        3634488961) &
                                                                                      4294967295) <<
                                                                                      14) &
                                                                                      4294967295) |
                                                                                      (o >>>
                                                                                        18))) +
                                                                                  ((((o =
                                                                                    (n +
                                                                                      (s ^
                                                                                        (t &
                                                                                          (r ^
                                                                                            s))) +
                                                                                      i[4] +
                                                                                      3889429448) &
                                                                                    4294967295) <<
                                                                                    20) &
                                                                                    4294967295) |
                                                                                    (o >>>
                                                                                      12))) +
                                                                                ((((o =
                                                                                  (t +
                                                                                    (r ^
                                                                                      (s &
                                                                                        (n ^
                                                                                          r))) +
                                                                                    i[9] +
                                                                                    568446438) &
                                                                                  4294967295) <<
                                                                                  5) &
                                                                                  4294967295) |
                                                                                  (o >>>
                                                                                    27))) +
                                                                              ((((o =
                                                                                (s +
                                                                                  (n ^
                                                                                    (r &
                                                                                      (t ^
                                                                                        n))) +
                                                                                  i[14] +
                                                                                  3275163606) &
                                                                                4294967295) <<
                                                                                9) &
                                                                                4294967295) |
                                                                                (o >>>
                                                                                  23))) +
                                                                            ((((o =
                                                                              (r +
                                                                                (t ^
                                                                                  (n &
                                                                                    (s ^
                                                                                      t))) +
                                                                                i[3] +
                                                                                4107603335) &
                                                                              4294967295) <<
                                                                              14) &
                                                                              4294967295) |
                                                                              (o >>>
                                                                                18))) +
                                                                          ((((o =
                                                                            (n +
                                                                              (s ^
                                                                                (t &
                                                                                  (r ^
                                                                                    s))) +
                                                                              i[8] +
                                                                              1163531501) &
                                                                            4294967295) <<
                                                                            20) &
                                                                            4294967295) |
                                                                            (o >>>
                                                                              12))) +
                                                                        ((((o =
                                                                          (t +
                                                                            (r ^
                                                                              (s &
                                                                                (n ^
                                                                                  r))) +
                                                                            i[13] +
                                                                            2850285829) &
                                                                          4294967295) <<
                                                                          5) &
                                                                          4294967295) |
                                                                          (o >>>
                                                                            27))) +
                                                                      ((((o =
                                                                        (s +
                                                                          (n ^
                                                                            (r &
                                                                              (t ^
                                                                                n))) +
                                                                          i[2] +
                                                                          4243563512) &
                                                                        4294967295) <<
                                                                        9) &
                                                                        4294967295) |
                                                                        (o >>>
                                                                          23))) +
                                                                    ((((o =
                                                                      (r +
                                                                        (t ^
                                                                          (n &
                                                                            (s ^
                                                                              t))) +
                                                                        i[7] +
                                                                        1735328473) &
                                                                      4294967295) <<
                                                                      14) &
                                                                      4294967295) |
                                                                      (o >>>
                                                                        18))) +
                                                                  ((((o =
                                                                    (n +
                                                                      (s ^
                                                                        (t &
                                                                          (r ^
                                                                            s))) +
                                                                      i[12] +
                                                                      2368359562) &
                                                                    4294967295) <<
                                                                    20) &
                                                                    4294967295) |
                                                                    (o >>>
                                                                      12))) +
                                                                ((((o =
                                                                  (t +
                                                                    (n ^
                                                                      r ^
                                                                      s) +
                                                                    i[5] +
                                                                    4294588738) &
                                                                  4294967295) <<
                                                                  4) &
                                                                  4294967295) |
                                                                  (o >>> 28))) +
                                                              ((((o =
                                                                (s +
                                                                  (t ^ n ^ r) +
                                                                  i[8] +
                                                                  2272392833) &
                                                                4294967295) <<
                                                                11) &
                                                                4294967295) |
                                                                (o >>> 21))) +
                                                            ((((o =
                                                              (r +
                                                                (s ^ t ^ n) +
                                                                i[11] +
                                                                1839030562) &
                                                              4294967295) <<
                                                              16) &
                                                              4294967295) |
                                                              (o >>> 16))) +
                                                          ((((o =
                                                            (n +
                                                              (r ^ s ^ t) +
                                                              i[14] +
                                                              4259657740) &
                                                            4294967295) <<
                                                            23) &
                                                            4294967295) |
                                                            (o >>> 9))) +
                                                        ((((o =
                                                          (t +
                                                            (n ^ r ^ s) +
                                                            i[1] +
                                                            2763975236) &
                                                          4294967295) <<
                                                          4) &
                                                          4294967295) |
                                                          (o >>> 28))) +
                                                      ((((o =
                                                        (s +
                                                          (t ^ n ^ r) +
                                                          i[4] +
                                                          1272893353) &
                                                        4294967295) <<
                                                        11) &
                                                        4294967295) |
                                                        (o >>> 21))) +
                                                    ((((o =
                                                      (r +
                                                        (s ^ t ^ n) +
                                                        i[7] +
                                                        4139469664) &
                                                      4294967295) <<
                                                      16) &
                                                      4294967295) |
                                                      (o >>> 16))) +
                                                  ((((o =
                                                    (n +
                                                      (r ^ s ^ t) +
                                                      i[10] +
                                                      3200236656) &
                                                    4294967295) <<
                                                    23) &
                                                    4294967295) |
                                                    (o >>> 9))) +
                                                ((((o =
                                                  (t +
                                                    (n ^ r ^ s) +
                                                    i[13] +
                                                    681279174) &
                                                  4294967295) <<
                                                  4) &
                                                  4294967295) |
                                                  (o >>> 28))) +
                                              ((((o =
                                                (s +
                                                  (t ^ n ^ r) +
                                                  i[0] +
                                                  3936430074) &
                                                4294967295) <<
                                                11) &
                                                4294967295) |
                                                (o >>> 21))) +
                                            ((((o =
                                              (r +
                                                (s ^ t ^ n) +
                                                i[3] +
                                                3572445317) &
                                              4294967295) <<
                                              16) &
                                              4294967295) |
                                              (o >>> 16))) +
                                          ((((o =
                                            (n +
                                              (r ^ s ^ t) +
                                              i[6] +
                                              76029189) &
                                            4294967295) <<
                                            23) &
                                            4294967295) |
                                            (o >>> 9))) +
                                        ((((o =
                                          (t +
                                            (n ^ r ^ s) +
                                            i[9] +
                                            3654602809) &
                                          4294967295) <<
                                          4) &
                                          4294967295) |
                                          (o >>> 28))) +
                                      ((((o =
                                        (s + (t ^ n ^ r) + i[12] + 3873151461) &
                                        4294967295) <<
                                        11) &
                                        4294967295) |
                                        (o >>> 21))) +
                                    ((((o =
                                      (r + (s ^ t ^ n) + i[15] + 530742520) &
                                      4294967295) <<
                                      16) &
                                      4294967295) |
                                      (o >>> 16))) +
                                  ((((o =
                                    (n + (r ^ s ^ t) + i[2] + 3299628645) &
                                    4294967295) <<
                                    23) &
                                    4294967295) |
                                    (o >>> 9))) +
                                ((((o =
                                  (t + (r ^ (n | ~s)) + i[0] + 4096336452) &
                                  4294967295) <<
                                  6) &
                                  4294967295) |
                                  (o >>> 26))) +
                              ((((o =
                                (s + (n ^ (t | ~r)) + i[7] + 1126891415) &
                                4294967295) <<
                                10) &
                                4294967295) |
                                (o >>> 22))) +
                            ((((o =
                              (r + (t ^ (s | ~n)) + i[14] + 2878612391) &
                              4294967295) <<
                              15) &
                              4294967295) |
                              (o >>> 17))) +
                          ((((o =
                            (n + (s ^ (r | ~t)) + i[5] + 4237533241) &
                            4294967295) <<
                            21) &
                            4294967295) |
                            (o >>> 11))) +
                        ((((o =
                          (t + (r ^ (n | ~s)) + i[12] + 1700485571) &
                          4294967295) <<
                          6) &
                          4294967295) |
                          (o >>> 26))) +
                      ((((o =
                        (s + (n ^ (t | ~r)) + i[3] + 2399980690) &
                        4294967295) <<
                        10) &
                        4294967295) |
                        (o >>> 22))) +
                    ((((o =
                      (r + (t ^ (s | ~n)) + i[10] + 4293915773) & 4294967295) <<
                      15) &
                      4294967295) |
                      (o >>> 17))) +
                  ((((o =
                    (n + (s ^ (r | ~t)) + i[1] + 2240044497) & 4294967295) <<
                    21) &
                    4294967295) |
                    (o >>> 11))) +
                ((((o =
                  (t + (r ^ (n | ~s)) + i[8] + 1873313359) & 4294967295) <<
                  6) &
                  4294967295) |
                  (o >>> 26))) +
              ((((o = (s + (n ^ (t | ~r)) + i[15] + 4264355552) & 4294967295) <<
                10) &
                4294967295) |
                (o >>> 22))) +
            ((((o = (r + (t ^ (s | ~n)) + i[6] + 2734768916) & 4294967295) <<
              15) &
              4294967295) |
              (o >>> 17))) +
          ((((o = (n + (s ^ (r | ~t)) + i[13] + 1309151649) & 4294967295) <<
            21) &
            4294967295) |
            (o >>> 11))) +
          ((s =
            (t =
              n +
              ((((o = (t + (r ^ (n | ~s)) + i[4] + 4149444226) & 4294967295) <<
                6) &
                4294967295) |
                (o >>> 26))) +
            ((((o = (s + (n ^ (t | ~r)) + i[11] + 3174756917) & 4294967295) <<
              10) &
              4294967295) |
              (o >>> 22))) ^
            ((r =
              s +
              ((((o = (r + (t ^ (s | ~n)) + i[2] + 718787259) & 4294967295) <<
                15) &
                4294967295) |
                (o >>> 17))) |
              ~t)) +
          i[9] +
          3951481745) &
        4294967295),
        (e.g[0] = (e.g[0] + t) & 4294967295),
        (e.g[1] =
          (e.g[1] + (r + (((o << 21) & 4294967295) | (o >>> 11)))) &
          4294967295),
        (e.g[2] = (e.g[2] + r) & 4294967295),
        (e.g[3] = (e.g[3] + s) & 4294967295);
    }
    function i(e, t) {
      this.h = t;
      for (var n = [], i = !0, r = e.length - 1; 0 <= r; r--) {
        var s = 0 | e[r];
        (i && s == t) || ((n[r] = s), (i = !1));
      }
      this.g = n;
    }
    !(function (e, t) {
      function n() {}
      (n.prototype = t.prototype),
        (e.D = t.prototype),
        (e.prototype = new n()),
        (e.prototype.constructor = e),
        (e.C = function (e, n, i) {
          for (
            var r = Array(arguments.length - 2), s = 2;
            s < arguments.length;
            s++
          )
            r[s - 2] = arguments[s];
          return t.prototype[n].apply(e, r);
        });
    })(t, function () {
      this.blockSize = -1;
    }),
      (t.prototype.s = function () {
        (this.g[0] = 1732584193),
          (this.g[1] = 4023233417),
          (this.g[2] = 2562383102),
          (this.g[3] = 271733878),
          (this.o = this.h = 0);
      }),
      (t.prototype.u = function (e, t) {
        void 0 === t && (t = e.length);
        for (
          var i = t - this.blockSize, r = this.B, s = this.h, o = 0;
          o < t;

        ) {
          if (0 == s) for (; o <= i; ) n(this, e, o), (o += this.blockSize);
          if ("string" == typeof e) {
            for (; o < t; )
              if (((r[s++] = e.charCodeAt(o++)), s == this.blockSize)) {
                n(this, r), (s = 0);
                break;
              }
          } else
            for (; o < t; )
              if (((r[s++] = e[o++]), s == this.blockSize)) {
                n(this, r), (s = 0);
                break;
              }
        }
        (this.h = s), (this.o += t);
      }),
      (t.prototype.v = function () {
        var e = Array(
          (56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h
        );
        e[0] = 128;
        for (var t = 1; t < e.length - 8; ++t) e[t] = 0;
        var n = 8 * this.o;
        for (t = e.length - 8; t < e.length; ++t) (e[t] = 255 & n), (n /= 256);
        for (this.u(e), e = Array(16), t = n = 0; 4 > t; ++t)
          for (var i = 0; 32 > i; i += 8) e[n++] = (this.g[t] >>> i) & 255;
        return e;
      });
    var r = {};
    function s(e) {
      return -128 <= e && 128 > e
        ? (function (e, t) {
            var n = r;
            return Object.prototype.hasOwnProperty.call(n, e)
              ? n[e]
              : (n[e] = (function (e) {
                  return new i([0 | e], 0 > e ? -1 : 0);
                })(e));
          })(e)
        : new i([0 | e], 0 > e ? -1 : 0);
    }
    function o(e) {
      if (isNaN(e) || !isFinite(e)) return a;
      if (0 > e) return d(o(-e));
      for (var t = [], n = 1, r = 0; e >= n; r++)
        (t[r] = (e / n) | 0), (n *= 4294967296);
      return new i(t, 0);
    }
    var a = s(0),
      h = s(1),
      c = s(16777216);
    function l(e) {
      if (0 != e.h) return !1;
      for (var t = 0; t < e.g.length; t++) if (0 != e.g[t]) return !1;
      return !0;
    }
    function u(e) {
      return -1 == e.h;
    }
    function d(e) {
      for (var t = e.g.length, n = [], r = 0; r < t; r++) n[r] = ~e.g[r];
      return new i(n, ~e.h).add(h);
    }
    function p(e, t) {
      return e.add(d(t));
    }
    function f(e, t) {
      for (; (65535 & e[t]) != e[t]; )
        (e[t + 1] += e[t] >>> 16), (e[t] &= 65535), t++;
    }
    function g(e, t) {
      (this.g = e), (this.h = t);
    }
    function m(e, t) {
      if (l(t)) throw Error("division by zero");
      if (l(e)) return new g(a, a);
      if (u(e)) return (t = m(d(e), t)), new g(d(t.g), d(t.h));
      if (u(t)) return (t = m(e, d(t))), new g(d(t.g), t.h);
      if (30 < e.g.length) {
        if (u(e) || u(t))
          throw Error("slowDivide_ only works with positive integers.");
        for (var n = h, i = t; 0 >= i.l(e); ) (n = v(n)), (i = v(i));
        var r = y(n, 1),
          s = y(i, 1);
        for (i = y(i, 2), n = y(n, 2); !l(i); ) {
          var c = s.add(i);
          0 >= c.l(e) && ((r = r.add(n)), (s = c)),
            (i = y(i, 1)),
            (n = y(n, 1));
        }
        return (t = p(e, r.j(t))), new g(r, t);
      }
      for (r = a; 0 <= e.l(t); ) {
        for (
          n = Math.max(1, Math.floor(e.m() / t.m())),
            i =
              48 >= (i = Math.ceil(Math.log(n) / Math.LN2))
                ? 1
                : Math.pow(2, i - 48),
            c = (s = o(n)).j(t);
          u(c) || 0 < c.l(e);

        )
          c = (s = o((n -= i))).j(t);
        l(s) && (s = h), (r = r.add(s)), (e = p(e, c));
      }
      return new g(r, e);
    }
    function v(e) {
      for (var t = e.g.length + 1, n = [], r = 0; r < t; r++)
        n[r] = (e.i(r) << 1) | (e.i(r - 1) >>> 31);
      return new i(n, e.h);
    }
    function y(e, t) {
      var n = t >> 5;
      t %= 32;
      for (var r = e.g.length - n, s = [], o = 0; o < r; o++)
        s[o] =
          0 < t
            ? (e.i(o + n) >>> t) | (e.i(o + n + 1) << (32 - t))
            : e.i(o + n);
      return new i(s, e.h);
    }
    ((e = i.prototype).m = function () {
      if (u(this)) return -d(this).m();
      for (var e = 0, t = 1, n = 0; n < this.g.length; n++) {
        var i = this.i(n);
        (e += (0 <= i ? i : 4294967296 + i) * t), (t *= 4294967296);
      }
      return e;
    }),
      (e.toString = function (e) {
        if (2 > (e = e || 10) || 36 < e)
          throw Error("radix out of range: " + e);
        if (l(this)) return "0";
        if (u(this)) return "-" + d(this).toString(e);
        for (var t = o(Math.pow(e, 6)), n = this, i = ""; ; ) {
          var r = m(n, t).g,
            s = (
              (0 < (n = p(n, r.j(t))).g.length ? n.g[0] : n.h) >>> 0
            ).toString(e);
          if (l((n = r))) return s + i;
          for (; 6 > s.length; ) s = "0" + s;
          i = s + i;
        }
      }),
      (e.i = function (e) {
        return 0 > e ? 0 : e < this.g.length ? this.g[e] : this.h;
      }),
      (e.l = function (e) {
        return u((e = p(this, e))) ? -1 : l(e) ? 0 : 1;
      }),
      (e.abs = function () {
        return u(this) ? d(this) : this;
      }),
      (e.add = function (e) {
        for (
          var t = Math.max(this.g.length, e.g.length), n = [], r = 0, s = 0;
          s <= t;
          s++
        ) {
          var o = r + (65535 & this.i(s)) + (65535 & e.i(s)),
            a = (o >>> 16) + (this.i(s) >>> 16) + (e.i(s) >>> 16);
          (r = a >>> 16), (o &= 65535), (a &= 65535), (n[s] = (a << 16) | o);
        }
        return new i(n, -2147483648 & n[n.length - 1] ? -1 : 0);
      }),
      (e.j = function (e) {
        if (l(this) || l(e)) return a;
        if (u(this)) return u(e) ? d(this).j(d(e)) : d(d(this).j(e));
        if (u(e)) return d(this.j(d(e)));
        if (0 > this.l(c) && 0 > e.l(c)) return o(this.m() * e.m());
        for (var t = this.g.length + e.g.length, n = [], r = 0; r < 2 * t; r++)
          n[r] = 0;
        for (r = 0; r < this.g.length; r++)
          for (var s = 0; s < e.g.length; s++) {
            var h = this.i(r) >>> 16,
              p = 65535 & this.i(r),
              g = e.i(s) >>> 16,
              m = 65535 & e.i(s);
            (n[2 * r + 2 * s] += p * m),
              f(n, 2 * r + 2 * s),
              (n[2 * r + 2 * s + 1] += h * m),
              f(n, 2 * r + 2 * s + 1),
              (n[2 * r + 2 * s + 1] += p * g),
              f(n, 2 * r + 2 * s + 1),
              (n[2 * r + 2 * s + 2] += h * g),
              f(n, 2 * r + 2 * s + 2);
          }
        for (r = 0; r < t; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r];
        for (r = t; r < 2 * t; r++) n[r] = 0;
        return new i(n, 0);
      }),
      (e.A = function (e) {
        return m(this, e).h;
      }),
      (e.and = function (e) {
        for (
          var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
          r < t;
          r++
        )
          n[r] = this.i(r) & e.i(r);
        return new i(n, this.h & e.h);
      }),
      (e.or = function (e) {
        for (
          var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
          r < t;
          r++
        )
          n[r] = this.i(r) | e.i(r);
        return new i(n, this.h | e.h);
      }),
      (e.xor = function (e) {
        for (
          var t = Math.max(this.g.length, e.g.length), n = [], r = 0;
          r < t;
          r++
        )
          n[r] = this.i(r) ^ e.i(r);
        return new i(n, this.h ^ e.h);
      }),
      (t.prototype.digest = t.prototype.v),
      (t.prototype.reset = t.prototype.s),
      (t.prototype.update = t.prototype.u),
      (qi.Md5 = t),
      (i.prototype.add = i.prototype.add),
      (i.prototype.multiply = i.prototype.j),
      (i.prototype.modulo = i.prototype.A),
      (i.prototype.compare = i.prototype.l),
      (i.prototype.toNumber = i.prototype.m),
      (i.prototype.toString = i.prototype.toString),
      (i.prototype.getBits = i.prototype.i),
      (i.fromNumber = o),
      (i.fromString = function e(t, n) {
        if (0 == t.length) throw Error("number format error: empty string");
        if (2 > (n = n || 10) || 36 < n)
          throw Error("radix out of range: " + n);
        if ("-" == t.charAt(0)) return d(e(t.substring(1), n));
        if (0 <= t.indexOf("-"))
          throw Error('number format error: interior "-" character');
        for (var i = o(Math.pow(n, 8)), r = a, s = 0; s < t.length; s += 8) {
          var h = Math.min(8, t.length - s),
            c = parseInt(t.substring(s, s + h), n);
          8 > h
            ? ((h = o(Math.pow(n, h))), (r = r.j(h).add(o(c))))
            : (r = (r = r.j(i)).add(o(c)));
        }
        return r;
      }),
      (Wi = qi.Integer = i);
  }).apply(
    void 0 !== Ki
      ? Ki
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : {}
  );
  var Gi =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {},
    Ji = {};
  (function () {
    var e,
      t =
        "function" == typeof Object.defineProperties
          ? Object.defineProperty
          : function (e, t, n) {
              return (
                e == Array.prototype ||
                  e == Object.prototype ||
                  (e[t] = n.value),
                e
              );
            },
      n = (function (e) {
        e = [
          "object" == typeof globalThis && globalThis,
          e,
          "object" == typeof window && window,
          "object" == typeof self && self,
          "object" == typeof Gi && Gi,
        ];
        for (var t = 0; t < e.length; ++t) {
          var n = e[t];
          if (n && n.Math == Math) return n;
        }
        throw Error("Cannot find global object");
      })(this);
    !(function (e, i) {
      if (i)
        e: {
          var r = n;
          e = e.split(".");
          for (var s = 0; s < e.length - 1; s++) {
            var o = e[s];
            if (!(o in r)) break e;
            r = r[o];
          }
          (i = i((s = r[(e = e[e.length - 1])]))) != s &&
            null != i &&
            t(r, e, { configurable: !0, writable: !0, value: i });
        }
    })("Array.prototype.values", function (e) {
      return (
        e ||
        function () {
          return (function (e, t) {
            e instanceof String && (e += "");
            var n = 0,
              i = !1,
              r = {
                next: function () {
                  if (!i && n < e.length) {
                    var r = n++;
                    return { value: t(0, e[r]), done: !1 };
                  }
                  return (i = !0), { done: !0, value: void 0 };
                },
              };
            return (
              (r[Symbol.iterator] = function () {
                return r;
              }),
              r
            );
          })(this, function (e, t) {
            return t;
          });
        }
      );
    });
    var i = i || {},
      r = this || self;
    function s(e) {
      var t = typeof e;
      return (
        "array" ==
          (t =
            "object" != t
              ? t
              : e
              ? Array.isArray(e)
                ? "array"
                : t
              : "null") ||
        ("object" == t && "number" == typeof e.length)
      );
    }
    function o(e) {
      var t = typeof e;
      return ("object" == t && null != e) || "function" == t;
    }
    function a(e, t, n) {
      return e.call.apply(e.bind, arguments);
    }
    function h(e, t, n) {
      if (!e) throw Error();
      if (2 < arguments.length) {
        var i = Array.prototype.slice.call(arguments, 2);
        return function () {
          var n = Array.prototype.slice.call(arguments);
          return Array.prototype.unshift.apply(n, i), e.apply(t, n);
        };
      }
      return function () {
        return e.apply(t, arguments);
      };
    }
    function c(e, t, n) {
      return (c =
        Function.prototype.bind &&
        -1 != Function.prototype.bind.toString().indexOf("native code")
          ? a
          : h).apply(null, arguments);
    }
    function l(e, t) {
      var n = Array.prototype.slice.call(arguments, 1);
      return function () {
        var t = n.slice();
        return t.push.apply(t, arguments), e.apply(this, t);
      };
    }
    function u(e, t) {
      function n() {}
      (n.prototype = t.prototype),
        (e.aa = t.prototype),
        (e.prototype = new n()),
        (e.prototype.constructor = e),
        (e.Qb = function (e, n, i) {
          for (
            var r = Array(arguments.length - 2), s = 2;
            s < arguments.length;
            s++
          )
            r[s - 2] = arguments[s];
          return t.prototype[n].apply(e, r);
        });
    }
    function d(e) {
      const t = e.length;
      if (0 < t) {
        const n = Array(t);
        for (let i = 0; i < t; i++) n[i] = e[i];
        return n;
      }
      return [];
    }
    function p(e, t) {
      for (let t = 1; t < arguments.length; t++) {
        const n = arguments[t];
        if (s(n)) {
          const t = e.length || 0,
            i = n.length || 0;
          e.length = t + i;
          for (let r = 0; r < i; r++) e[t + r] = n[r];
        } else e.push(n);
      }
    }
    function f(e) {
      return /^[\s\xa0]*$/.test(e);
    }
    function g() {
      var e = r.navigator;
      return e && (e = e.userAgent) ? e : "";
    }
    function m(e) {
      return m[" "](e), e;
    }
    m[" "] = function () {};
    var v = !(
      -1 == g().indexOf("Gecko") ||
      (-1 != g().toLowerCase().indexOf("webkit") &&
        -1 == g().indexOf("Edge")) ||
      -1 != g().indexOf("Trident") ||
      -1 != g().indexOf("MSIE") ||
      -1 != g().indexOf("Edge")
    );
    function y(e, t, n) {
      for (const i in e) t.call(n, e[i], i, e);
    }
    function w(e) {
      const t = {};
      for (const n in e) t[n] = e[n];
      return t;
    }
    const _ =
      "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
        " "
      );
    function b(e, t) {
      let n, i;
      for (let t = 1; t < arguments.length; t++) {
        for (n in ((i = arguments[t]), i)) e[n] = i[n];
        for (let t = 0; t < _.length; t++)
          (n = _[t]),
            Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
      }
    }
    function I(e) {
      var t = 1;
      e = e.split(":");
      const n = [];
      for (; 0 < t && e.length; ) n.push(e.shift()), t--;
      return e.length && n.push(e.join(":")), n;
    }
    function E(e) {
      r.setTimeout(() => {
        throw e;
      }, 0);
    }
    function T() {
      var e = R;
      let t = null;
      return (
        e.g &&
          ((t = e.g), (e.g = e.g.next), e.g || (e.h = null), (t.next = null)),
        t
      );
    }
    var S = new (class {
      constructor(e, t) {
        (this.i = e), (this.j = t), (this.h = 0), (this.g = null);
      }
      get() {
        let e;
        return (
          0 < this.h
            ? (this.h--, (e = this.g), (this.g = e.next), (e.next = null))
            : (e = this.i()),
          e
        );
      }
    })(
      () => new k(),
      (e) => e.reset()
    );
    class k {
      constructor() {
        this.next = this.g = this.h = null;
      }
      set(e, t) {
        (this.h = e), (this.g = t), (this.next = null);
      }
      reset() {
        this.next = this.g = this.h = null;
      }
    }
    let C,
      A = !1,
      R = new (class {
        constructor() {
          this.h = this.g = null;
        }
        add(e, t) {
          const n = S.get();
          n.set(e, t), this.h ? (this.h.next = n) : (this.g = n), (this.h = n);
        }
      })(),
      P = () => {
        const e = r.Promise.resolve(void 0);
        C = () => {
          e.then(O);
        };
      };
    var O = () => {
      for (var e; (e = T()); ) {
        try {
          e.h.call(e.g);
        } catch (e) {
          E(e);
        }
        var t = S;
        t.j(e), 100 > t.h && (t.h++, (e.next = t.g), (t.g = e));
      }
      A = !1;
    };
    function N() {
      (this.s = this.s), (this.C = this.C);
    }
    function L(e, t) {
      (this.type = e), (this.g = this.target = t), (this.defaultPrevented = !1);
    }
    (N.prototype.s = !1),
      (N.prototype.ma = function () {
        this.s || ((this.s = !0), this.N());
      }),
      (N.prototype.N = function () {
        if (this.C) for (; this.C.length; ) this.C.shift()();
      }),
      (L.prototype.h = function () {
        this.defaultPrevented = !0;
      });
    var D = (function () {
      if (!r.addEventListener || !Object.defineProperty) return !1;
      var e = !1,
        t = Object.defineProperty({}, "passive", {
          get: function () {
            e = !0;
          },
        });
      try {
        const e = () => {};
        r.addEventListener("test", e, t), r.removeEventListener("test", e, t);
      } catch (e) {}
      return e;
    })();
    function M(e, t) {
      if (
        (L.call(this, e ? e.type : ""),
        (this.relatedTarget = this.g = this.target = null),
        (this.button =
          this.screenY =
          this.screenX =
          this.clientY =
          this.clientX =
            0),
        (this.key = ""),
        (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1),
        (this.state = null),
        (this.pointerId = 0),
        (this.pointerType = ""),
        (this.i = null),
        e)
      ) {
        var n = (this.type = e.type),
          i =
            e.changedTouches && e.changedTouches.length
              ? e.changedTouches[0]
              : null;
        if (
          ((this.target = e.target || e.srcElement),
          (this.g = t),
          (t = e.relatedTarget))
        ) {
          if (v) {
            e: {
              try {
                m(t.nodeName);
                var r = !0;
                break e;
              } catch (e) {}
              r = !1;
            }
            r || (t = null);
          }
        } else
          "mouseover" == n
            ? (t = e.fromElement)
            : "mouseout" == n && (t = e.toElement);
        (this.relatedTarget = t),
          i
            ? ((this.clientX = void 0 !== i.clientX ? i.clientX : i.pageX),
              (this.clientY = void 0 !== i.clientY ? i.clientY : i.pageY),
              (this.screenX = i.screenX || 0),
              (this.screenY = i.screenY || 0))
            : ((this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX),
              (this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY),
              (this.screenX = e.screenX || 0),
              (this.screenY = e.screenY || 0)),
          (this.button = e.button),
          (this.key = e.key || ""),
          (this.ctrlKey = e.ctrlKey),
          (this.altKey = e.altKey),
          (this.shiftKey = e.shiftKey),
          (this.metaKey = e.metaKey),
          (this.pointerId = e.pointerId || 0),
          (this.pointerType =
            "string" == typeof e.pointerType
              ? e.pointerType
              : U[e.pointerType] || ""),
          (this.state = e.state),
          (this.i = e),
          e.defaultPrevented && M.aa.h.call(this);
      }
    }
    u(M, L);
    var U = { 2: "touch", 3: "pen", 4: "mouse" };
    M.prototype.h = function () {
      M.aa.h.call(this);
      var e = this.i;
      e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
    };
    var x = "closure_listenable_" + ((1e6 * Math.random()) | 0),
      j = 0;
    function F(e, t, n, i, r) {
      (this.listener = e),
        (this.proxy = null),
        (this.src = t),
        (this.type = n),
        (this.capture = !!i),
        (this.ha = r),
        (this.key = ++j),
        (this.da = this.fa = !1);
    }
    function V(e) {
      (e.da = !0),
        (e.listener = null),
        (e.proxy = null),
        (e.src = null),
        (e.ha = null);
    }
    function B(e) {
      (this.src = e), (this.g = {}), (this.h = 0);
    }
    function H(e, t) {
      var n = t.type;
      if (n in e.g) {
        var i,
          r = e.g[n],
          s = Array.prototype.indexOf.call(r, t, void 0);
        (i = 0 <= s) && Array.prototype.splice.call(r, s, 1),
          i && (V(t), 0 == e.g[n].length && (delete e.g[n], e.h--));
      }
    }
    function z(e, t, n, i) {
      for (var r = 0; r < e.length; ++r) {
        var s = e[r];
        if (!s.da && s.listener == t && s.capture == !!n && s.ha == i) return r;
      }
      return -1;
    }
    B.prototype.add = function (e, t, n, i, r) {
      var s = e.toString();
      (e = this.g[s]) || ((e = this.g[s] = []), this.h++);
      var o = z(e, t, i, r);
      return (
        -1 < o
          ? ((t = e[o]), n || (t.fa = !1))
          : (((t = new F(t, this.src, s, !!i, r)).fa = n), e.push(t)),
        t
      );
    };
    var $ = "closure_lm_" + ((1e6 * Math.random()) | 0),
      W = {};
    function K(e, t, n, i, r) {
      if (i && i.once) return G(e, t, n, i, r);
      if (Array.isArray(t)) {
        for (var s = 0; s < t.length; s++) K(e, t[s], n, i, r);
        return null;
      }
      return (
        (n = te(n)),
        e && e[x]
          ? e.K(t, n, o(i) ? !!i.capture : !!i, r)
          : q(e, t, n, !1, i, r)
      );
    }
    function q(e, t, n, i, r, s) {
      if (!t) throw Error("Invalid event type");
      var a = o(r) ? !!r.capture : !!r,
        h = Z(e);
      if ((h || (e[$] = h = new B(e)), (n = h.add(t, n, i, a, s)).proxy))
        return n;
      if (
        ((i = (function () {
          const e = Q;
          return function t(n) {
            return e.call(t.src, t.listener, n);
          };
        })()),
        (n.proxy = i),
        (i.src = e),
        (i.listener = n),
        e.addEventListener)
      )
        D || (r = a),
          void 0 === r && (r = !1),
          e.addEventListener(t.toString(), i, r);
      else if (e.attachEvent) e.attachEvent(Y(t.toString()), i);
      else {
        if (!e.addListener || !e.removeListener)
          throw Error("addEventListener and attachEvent are unavailable.");
        e.addListener(i);
      }
      return n;
    }
    function G(e, t, n, i, r) {
      if (Array.isArray(t)) {
        for (var s = 0; s < t.length; s++) G(e, t[s], n, i, r);
        return null;
      }
      return (
        (n = te(n)),
        e && e[x]
          ? e.L(t, n, o(i) ? !!i.capture : !!i, r)
          : q(e, t, n, !0, i, r)
      );
    }
    function J(e, t, n, i, r) {
      if (Array.isArray(t))
        for (var s = 0; s < t.length; s++) J(e, t[s], n, i, r);
      else
        (i = o(i) ? !!i.capture : !!i),
          (n = te(n)),
          e && e[x]
            ? ((e = e.i),
              (t = String(t).toString()) in e.g &&
                -1 < (n = z((s = e.g[t]), n, i, r)) &&
                (V(s[n]),
                Array.prototype.splice.call(s, n, 1),
                0 == s.length && (delete e.g[t], e.h--)))
            : e &&
              (e = Z(e)) &&
              ((t = e.g[t.toString()]),
              (e = -1),
              t && (e = z(t, n, i, r)),
              (n = -1 < e ? t[e] : null) && X(n));
    }
    function X(e) {
      if ("number" != typeof e && e && !e.da) {
        var t = e.src;
        if (t && t[x]) H(t.i, e);
        else {
          var n = e.type,
            i = e.proxy;
          t.removeEventListener
            ? t.removeEventListener(n, i, e.capture)
            : t.detachEvent
            ? t.detachEvent(Y(n), i)
            : t.addListener && t.removeListener && t.removeListener(i),
            (n = Z(t))
              ? (H(n, e), 0 == n.h && ((n.src = null), (t[$] = null)))
              : V(e);
        }
      }
    }
    function Y(e) {
      return e in W ? W[e] : (W[e] = "on" + e);
    }
    function Q(e, t) {
      if (e.da) e = !0;
      else {
        t = new M(t, this);
        var n = e.listener,
          i = e.ha || e.src;
        e.fa && X(e), (e = n.call(i, t));
      }
      return e;
    }
    function Z(e) {
      return (e = e[$]) instanceof B ? e : null;
    }
    var ee = "__closure_events_fn_" + ((1e9 * Math.random()) >>> 0);
    function te(e) {
      return "function" == typeof e
        ? e
        : (e[ee] ||
            (e[ee] = function (t) {
              return e.handleEvent(t);
            }),
          e[ee]);
    }
    function ne() {
      N.call(this), (this.i = new B(this)), (this.M = this), (this.F = null);
    }
    function ie(e, t) {
      var n,
        i = e.F;
      if (i) for (n = []; i; i = i.F) n.push(i);
      if (((e = e.M), (i = t.type || t), "string" == typeof t)) t = new L(t, e);
      else if (t instanceof L) t.target = t.target || e;
      else {
        var r = t;
        b((t = new L(i, e)), r);
      }
      if (((r = !0), n))
        for (var s = n.length - 1; 0 <= s; s--) {
          var o = (t.g = n[s]);
          r = re(o, i, !0, t) && r;
        }
      if (
        ((r = re((o = t.g = e), i, !0, t) && r), (r = re(o, i, !1, t) && r), n)
      )
        for (s = 0; s < n.length; s++) r = re((o = t.g = n[s]), i, !1, t) && r;
    }
    function re(e, t, n, i) {
      if (!(t = e.i.g[String(t)])) return !0;
      t = t.concat();
      for (var r = !0, s = 0; s < t.length; ++s) {
        var o = t[s];
        if (o && !o.da && o.capture == n) {
          var a = o.listener,
            h = o.ha || o.src;
          o.fa && H(e.i, o), (r = !1 !== a.call(h, i) && r);
        }
      }
      return r && !i.defaultPrevented;
    }
    function se(e, t, n) {
      if ("function" == typeof e) n && (e = c(e, n));
      else {
        if (!e || "function" != typeof e.handleEvent)
          throw Error("Invalid listener argument");
        e = c(e.handleEvent, e);
      }
      return 2147483647 < Number(t) ? -1 : r.setTimeout(e, t || 0);
    }
    function oe(e) {
      e.g = se(() => {
        (e.g = null), e.i && ((e.i = !1), oe(e));
      }, e.l);
      const t = e.h;
      (e.h = null), e.m.apply(null, t);
    }
    u(ne, N),
      (ne.prototype[x] = !0),
      (ne.prototype.removeEventListener = function (e, t, n, i) {
        J(this, e, t, n, i);
      }),
      (ne.prototype.N = function () {
        if ((ne.aa.N.call(this), this.i)) {
          var e,
            t = this.i;
          for (e in t.g) {
            for (var n = t.g[e], i = 0; i < n.length; i++) V(n[i]);
            delete t.g[e], t.h--;
          }
        }
        this.F = null;
      }),
      (ne.prototype.K = function (e, t, n, i) {
        return this.i.add(String(e), t, !1, n, i);
      }),
      (ne.prototype.L = function (e, t, n, i) {
        return this.i.add(String(e), t, !0, n, i);
      });
    class ae extends N {
      constructor(e, t) {
        super(),
          (this.m = e),
          (this.l = t),
          (this.h = null),
          (this.i = !1),
          (this.g = null);
      }
      j(e) {
        (this.h = arguments), this.g ? (this.i = !0) : oe(this);
      }
      N() {
        super.N(),
          this.g &&
            (r.clearTimeout(this.g),
            (this.g = null),
            (this.i = !1),
            (this.h = null));
      }
    }
    function he(e) {
      N.call(this), (this.h = e), (this.g = {});
    }
    u(he, N);
    var ce = [];
    function le(e) {
      y(
        e.g,
        function (e, t) {
          this.g.hasOwnProperty(t) && X(e);
        },
        e
      ),
        (e.g = {});
    }
    (he.prototype.N = function () {
      he.aa.N.call(this), le(this);
    }),
      (he.prototype.handleEvent = function () {
        throw Error("EventHandler.handleEvent not implemented");
      });
    var ue = r.JSON.stringify,
      de = r.JSON.parse,
      pe = class {
        stringify(e) {
          return r.JSON.stringify(e, void 0);
        }
        parse(e) {
          return r.JSON.parse(e, void 0);
        }
      };
    function fe() {}
    function ge(e) {
      return e.h || (e.h = e.i());
    }
    function me() {}
    fe.prototype.h = null;
    var ve = { OPEN: "a", kb: "b", Ja: "c", wb: "d" };
    function ye() {
      L.call(this, "d");
    }
    function we() {
      L.call(this, "c");
    }
    u(ye, L), u(we, L);
    var _e = {},
      be = null;
    function Ie() {
      return (be = be || new ne());
    }
    function Ee(e) {
      L.call(this, _e.La, e);
    }
    function Te(e) {
      const t = Ie();
      ie(t, new Ee(t));
    }
    function Se(e, t) {
      L.call(this, _e.STAT_EVENT, e), (this.stat = t);
    }
    function ke(e) {
      const t = Ie();
      ie(t, new Se(t, e));
    }
    function Ce(e, t) {
      L.call(this, _e.Ma, e), (this.size = t);
    }
    function Ae(e, t) {
      if ("function" != typeof e)
        throw Error("Fn must not be null and must be a function");
      return r.setTimeout(function () {
        e();
      }, t);
    }
    function Re() {
      this.g = !0;
    }
    function Pe(e, t, n, i) {
      e.info(function () {
        return (
          "XMLHTTP TEXT (" +
          t +
          "): " +
          (function (e, t) {
            if (!e.g) return t;
            if (!t) return null;
            try {
              var n = JSON.parse(t);
              if (n)
                for (e = 0; e < n.length; e++)
                  if (Array.isArray(n[e])) {
                    var i = n[e];
                    if (!(2 > i.length)) {
                      var r = i[1];
                      if (Array.isArray(r) && !(1 > r.length)) {
                        var s = r[0];
                        if ("noop" != s && "stop" != s && "close" != s)
                          for (var o = 1; o < r.length; o++) r[o] = "";
                      }
                    }
                  }
              return ue(n);
            } catch (e) {
              return t;
            }
          })(e, n) +
          (i ? " " + i : "")
        );
      });
    }
    (_e.La = "serverreachability"),
      u(Ee, L),
      (_e.STAT_EVENT = "statevent"),
      u(Se, L),
      (_e.Ma = "timingevent"),
      u(Ce, L),
      (Re.prototype.xa = function () {
        this.g = !1;
      }),
      (Re.prototype.info = function () {});
    var Oe,
      Ne = {
        NO_ERROR: 0,
        gb: 1,
        tb: 2,
        sb: 3,
        nb: 4,
        rb: 5,
        ub: 6,
        Ia: 7,
        TIMEOUT: 8,
        xb: 9,
      },
      Le = {
        lb: "complete",
        Hb: "success",
        Ja: "error",
        Ia: "abort",
        zb: "ready",
        Ab: "readystatechange",
        TIMEOUT: "timeout",
        vb: "incrementaldata",
        yb: "progress",
        ob: "downloadprogress",
        Pb: "uploadprogress",
      };
    function De() {}
    function Me(e, t, n, i) {
      (this.j = e),
        (this.i = t),
        (this.l = n),
        (this.R = i || 1),
        (this.U = new he(this)),
        (this.I = 45e3),
        (this.H = null),
        (this.o = !1),
        (this.m = this.A = this.v = this.L = this.F = this.S = this.B = null),
        (this.D = []),
        (this.g = null),
        (this.C = 0),
        (this.s = this.u = null),
        (this.X = -1),
        (this.J = !1),
        (this.O = 0),
        (this.M = null),
        (this.W = this.K = this.T = this.P = !1),
        (this.h = new Ue());
    }
    function Ue() {
      (this.i = null), (this.g = ""), (this.h = !1);
    }
    u(De, fe),
      (De.prototype.g = function () {
        return new XMLHttpRequest();
      }),
      (De.prototype.i = function () {
        return {};
      }),
      (Oe = new De());
    var xe = {},
      je = {};
    function Fe(e, t, n) {
      (e.L = 1), (e.v = ut(ot(t))), (e.m = n), (e.P = !0), Ve(e, null);
    }
    function Ve(e, t) {
      (e.F = Date.now()), ze(e), (e.A = ot(e.v));
      var n = e.A,
        i = e.R;
      Array.isArray(i) || (i = [String(i)]),
        St(n.i, "t", i),
        (e.C = 0),
        (n = e.j.J),
        (e.h = new Ue()),
        (e.g = pn(e.j, n ? t : null, !e.m)),
        0 < e.O && (e.M = new ae(c(e.Y, e, e.g), e.O)),
        (t = e.U),
        (n = e.g),
        (i = e.ca);
      var r = "readystatechange";
      Array.isArray(r) || (r && (ce[0] = r.toString()), (r = ce));
      for (var s = 0; s < r.length; s++) {
        var o = K(n, r[s], i || t.handleEvent, !1, t.h || t);
        if (!o) break;
        t.g[o.key] = o;
      }
      (t = e.H ? w(e.H) : {}),
        e.m
          ? (e.u || (e.u = "POST"),
            (t["Content-Type"] = "application/x-www-form-urlencoded"),
            e.g.ea(e.A, e.u, e.m, t))
          : ((e.u = "GET"), e.g.ea(e.A, e.u, null, t)),
        Te(),
        (function (e, t, n, i, r, s) {
          e.info(function () {
            if (e.g)
              if (s)
                for (var o = "", a = s.split("&"), h = 0; h < a.length; h++) {
                  var c = a[h].split("=");
                  if (1 < c.length) {
                    var l = c[0];
                    c = c[1];
                    var u = l.split("_");
                    o =
                      2 <= u.length && "type" == u[1]
                        ? o + (l + "=") + c + "&"
                        : o + (l + "=redacted&");
                  }
                }
              else o = null;
            else o = s;
            return (
              "XMLHTTP REQ (" +
              i +
              ") [attempt " +
              r +
              "]: " +
              t +
              "\n" +
              n +
              "\n" +
              o
            );
          });
        })(e.i, e.u, e.A, e.l, e.R, e.m);
    }
    function Be(e) {
      return !!e.g && "GET" == e.u && 2 != e.L && e.j.Ca;
    }
    function He(e, t) {
      var n = e.C,
        i = t.indexOf("\n", n);
      return -1 == i
        ? je
        : ((n = Number(t.substring(n, i))),
          isNaN(n)
            ? xe
            : (i += 1) + n > t.length
            ? je
            : ((t = t.slice(i, i + n)), (e.C = i + n), t));
    }
    function ze(e) {
      (e.S = Date.now() + e.I), $e(e, e.I);
    }
    function $e(e, t) {
      if (null != e.B) throw Error("WatchDog timer not null");
      e.B = Ae(c(e.ba, e), t);
    }
    function We(e) {
      e.B && (r.clearTimeout(e.B), (e.B = null));
    }
    function Ke(e) {
      0 == e.j.G || e.J || hn(e.j, e);
    }
    function qe(e) {
      We(e);
      var t = e.M;
      t && "function" == typeof t.ma && t.ma(),
        (e.M = null),
        le(e.U),
        e.g && ((t = e.g), (e.g = null), t.abort(), t.ma());
    }
    function Ge(e, t) {
      try {
        var n = e.j;
        if (0 != n.G && (n.g == e || Ze(n.h, e)))
          if (!e.K && Ze(n.h, e) && 3 == n.G) {
            try {
              var i = n.Da.g.parse(t);
            } catch (e) {
              i = null;
            }
            if (Array.isArray(i) && 3 == i.length) {
              var r = i;
              if (0 == r[0]) {
                e: if (!n.u) {
                  if (n.g) {
                    if (!(n.g.F + 3e3 < e.F)) break e;
                    an(n), Xt(n);
                  }
                  rn(n), ke(18);
                }
              } else
                (n.za = r[1]),
                  0 < n.za - n.T &&
                    37500 > r[2] &&
                    n.F &&
                    0 == n.v &&
                    !n.C &&
                    (n.C = Ae(c(n.Za, n), 6e3));
              if (1 >= Qe(n.h) && n.ca) {
                try {
                  n.ca();
                } catch (e) {}
                n.ca = void 0;
              }
            } else ln(n, 11);
          } else if (((e.K || n.g == e) && an(n), !f(t)))
            for (r = n.Da.g.parse(t), t = 0; t < r.length; t++) {
              let c = r[t];
              if (((n.T = c[0]), (c = c[1]), 2 == n.G))
                if ("c" == c[0]) {
                  (n.K = c[1]), (n.ia = c[2]);
                  const t = c[3];
                  null != t && ((n.la = t), n.j.info("VER=" + n.la));
                  const r = c[4];
                  null != r && ((n.Aa = r), n.j.info("SVER=" + n.Aa));
                  const l = c[5];
                  null != l &&
                    "number" == typeof l &&
                    0 < l &&
                    ((i = 1.5 * l),
                    (n.L = i),
                    n.j.info("backChannelRequestTimeoutMs_=" + i)),
                    (i = n);
                  const u = e.g;
                  if (u) {
                    const e = u.g
                      ? u.g.getResponseHeader("X-Client-Wire-Protocol")
                      : null;
                    if (e) {
                      var s = i.h;
                      s.g ||
                        (-1 == e.indexOf("spdy") &&
                          -1 == e.indexOf("quic") &&
                          -1 == e.indexOf("h2")) ||
                        ((s.j = s.l),
                        (s.g = new Set()),
                        s.h && (et(s, s.h), (s.h = null)));
                    }
                    if (i.D) {
                      const e = u.g
                        ? u.g.getResponseHeader("X-HTTP-Session-Id")
                        : null;
                      e && ((i.ya = e), lt(i.I, i.D, e));
                    }
                  }
                  (n.G = 3),
                    n.l && n.l.ua(),
                    n.ba &&
                      ((n.R = Date.now() - e.F),
                      n.j.info("Handshake RTT: " + n.R + "ms"));
                  var o = e;
                  if ((((i = n).qa = dn(i, i.J ? i.ia : null, i.W)), o.K)) {
                    tt(i.h, o);
                    var a = o,
                      h = i.L;
                    h && (a.I = h), a.B && (We(a), ze(a)), (i.g = o);
                  } else nn(i);
                  0 < n.i.length && Qt(n);
                } else ("stop" != c[0] && "close" != c[0]) || ln(n, 7);
              else
                3 == n.G &&
                  ("stop" == c[0] || "close" == c[0]
                    ? "stop" == c[0]
                      ? ln(n, 7)
                      : Jt(n)
                    : "noop" != c[0] && n.l && n.l.ta(c),
                  (n.v = 0));
            }
        Te();
      } catch (e) {}
    }
    (Me.prototype.ca = function (e) {
      e = e.target;
      const t = this.M;
      t && 3 == Wt(e) ? t.j() : this.Y(e);
    }),
      (Me.prototype.Y = function (e) {
        try {
          if (e == this.g)
            e: {
              const d = Wt(this.g);
              var t = this.g.Ba();
              if (
                (this.g.Z(),
                !(3 > d) &&
                  (3 != d ||
                    (this.g && (this.h.h || this.g.oa() || Kt(this.g)))))
              ) {
                this.J || 4 != d || 7 == t || Te(), We(this);
                var n = this.g.Z();
                this.X = n;
                t: if (Be(this)) {
                  var i = Kt(this.g);
                  e = "";
                  var s = i.length,
                    o = 4 == Wt(this.g);
                  if (!this.h.i) {
                    if ("undefined" == typeof TextDecoder) {
                      qe(this), Ke(this);
                      var a = "";
                      break t;
                    }
                    this.h.i = new r.TextDecoder();
                  }
                  for (t = 0; t < s; t++)
                    (this.h.h = !0),
                      (e += this.h.i.decode(i[t], {
                        stream: !(o && t == s - 1),
                      }));
                  (i.length = 0), (this.h.g += e), (this.C = 0), (a = this.h.g);
                } else a = this.g.oa();
                if (
                  ((this.o = 200 == n),
                  (function (e, t, n, i, r, s, o) {
                    e.info(function () {
                      return (
                        "XMLHTTP RESP (" +
                        i +
                        ") [ attempt " +
                        r +
                        "]: " +
                        t +
                        "\n" +
                        n +
                        "\n" +
                        s +
                        " " +
                        o
                      );
                    });
                  })(this.i, this.u, this.A, this.l, this.R, d, n),
                  this.o)
                ) {
                  if (this.T && !this.K) {
                    t: {
                      if (this.g) {
                        var h,
                          c = this.g;
                        if (
                          (h = c.g
                            ? c.g.getResponseHeader("X-HTTP-Initial-Response")
                            : null) &&
                          !f(h)
                        ) {
                          var l = h;
                          break t;
                        }
                      }
                      l = null;
                    }
                    if (!(n = l)) {
                      (this.o = !1), (this.s = 3), ke(12), qe(this), Ke(this);
                      break e;
                    }
                    Pe(
                      this.i,
                      this.l,
                      n,
                      "Initial handshake response via X-HTTP-Initial-Response"
                    ),
                      (this.K = !0),
                      Ge(this, n);
                  }
                  if (this.P) {
                    let e;
                    for (n = !0; !this.J && this.C < a.length; ) {
                      if (((e = He(this, a)), e == je)) {
                        4 == d && ((this.s = 4), ke(14), (n = !1)),
                          Pe(this.i, this.l, null, "[Incomplete Response]");
                        break;
                      }
                      if (e == xe) {
                        (this.s = 4),
                          ke(15),
                          Pe(this.i, this.l, a, "[Invalid Chunk]"),
                          (n = !1);
                        break;
                      }
                      Pe(this.i, this.l, e, null), Ge(this, e);
                    }
                    if (
                      (Be(this) &&
                        0 != this.C &&
                        ((this.h.g = this.h.g.slice(this.C)), (this.C = 0)),
                      4 != d ||
                        0 != a.length ||
                        this.h.h ||
                        ((this.s = 1), ke(16), (n = !1)),
                      (this.o = this.o && n),
                      n)
                    ) {
                      if (0 < a.length && !this.W) {
                        this.W = !0;
                        var u = this.j;
                        u.g == this &&
                          u.ba &&
                          !u.M &&
                          (u.j.info(
                            "Great, no buffering proxy detected. Bytes received: " +
                              a.length
                          ),
                          sn(u),
                          (u.M = !0),
                          ke(11));
                      }
                    } else
                      Pe(this.i, this.l, a, "[Invalid Chunked Response]"),
                        qe(this),
                        Ke(this);
                  } else Pe(this.i, this.l, a, null), Ge(this, a);
                  4 == d && qe(this),
                    this.o &&
                      !this.J &&
                      (4 == d ? hn(this.j, this) : ((this.o = !1), ze(this)));
                } else
                  (function (e) {
                    const t = {};
                    e = (
                      (e.g && 2 <= Wt(e) && e.g.getAllResponseHeaders()) ||
                      ""
                    ).split("\r\n");
                    for (let i = 0; i < e.length; i++) {
                      if (f(e[i])) continue;
                      var n = I(e[i]);
                      const r = n[0];
                      if ("string" != typeof (n = n[1])) continue;
                      n = n.trim();
                      const s = t[r] || [];
                      (t[r] = s), s.push(n);
                    }
                    !(function (e, t) {
                      for (const n in e) t.call(void 0, e[n], n, e);
                    })(t, function (e) {
                      return e.join(", ");
                    });
                  })(this.g),
                    400 == n && 0 < a.indexOf("Unknown SID")
                      ? ((this.s = 3), ke(12))
                      : ((this.s = 0), ke(13)),
                    qe(this),
                    Ke(this);
              }
            }
        } catch (e) {}
      }),
      (Me.prototype.cancel = function () {
        (this.J = !0), qe(this);
      }),
      (Me.prototype.ba = function () {
        this.B = null;
        const e = Date.now();
        0 <= e - this.S
          ? ((function (e, t) {
              e.info(function () {
                return "TIMEOUT: " + t;
              });
            })(this.i, this.A),
            2 != this.L && (Te(), ke(17)),
            qe(this),
            (this.s = 2),
            Ke(this))
          : $e(this, this.S - e);
      });
    var Je = class {
      constructor(e, t) {
        (this.g = e), (this.map = t);
      }
    };
    function Xe(e) {
      (this.l = e || 10),
        (e = r.PerformanceNavigationTiming
          ? 0 < (e = r.performance.getEntriesByType("navigation")).length &&
            ("hq" == e[0].nextHopProtocol || "h2" == e[0].nextHopProtocol)
          : !!(
              r.chrome &&
              r.chrome.loadTimes &&
              r.chrome.loadTimes() &&
              r.chrome.loadTimes().wasFetchedViaSpdy
            )),
        (this.j = e ? this.l : 1),
        (this.g = null),
        1 < this.j && (this.g = new Set()),
        (this.h = null),
        (this.i = []);
    }
    function Ye(e) {
      return !!e.h || (!!e.g && e.g.size >= e.j);
    }
    function Qe(e) {
      return e.h ? 1 : e.g ? e.g.size : 0;
    }
    function Ze(e, t) {
      return e.h ? e.h == t : !!e.g && e.g.has(t);
    }
    function et(e, t) {
      e.g ? e.g.add(t) : (e.h = t);
    }
    function tt(e, t) {
      e.h && e.h == t ? (e.h = null) : e.g && e.g.has(t) && e.g.delete(t);
    }
    function nt(e) {
      if (null != e.h) return e.i.concat(e.h.D);
      if (null != e.g && 0 !== e.g.size) {
        let t = e.i;
        for (const n of e.g.values()) t = t.concat(n.D);
        return t;
      }
      return d(e.i);
    }
    function it(e, t) {
      if (e.forEach && "function" == typeof e.forEach) e.forEach(t, void 0);
      else if (s(e) || "string" == typeof e)
        Array.prototype.forEach.call(e, t, void 0);
      else
        for (
          var n = (function (e) {
              if (e.na && "function" == typeof e.na) return e.na();
              if (!e.V || "function" != typeof e.V) {
                if ("undefined" != typeof Map && e instanceof Map)
                  return Array.from(e.keys());
                if (!("undefined" != typeof Set && e instanceof Set)) {
                  if (s(e) || "string" == typeof e) {
                    var t = [];
                    e = e.length;
                    for (var n = 0; n < e; n++) t.push(n);
                    return t;
                  }
                  (t = []), (n = 0);
                  for (const i in e) t[n++] = i;
                  return t;
                }
              }
            })(e),
            i = (function (e) {
              if (e.V && "function" == typeof e.V) return e.V();
              if (
                ("undefined" != typeof Map && e instanceof Map) ||
                ("undefined" != typeof Set && e instanceof Set)
              )
                return Array.from(e.values());
              if ("string" == typeof e) return e.split("");
              if (s(e)) {
                for (var t = [], n = e.length, i = 0; i < n; i++) t.push(e[i]);
                return t;
              }
              for (i in ((t = []), (n = 0), e)) t[n++] = e[i];
              return t;
            })(e),
            r = i.length,
            o = 0;
          o < r;
          o++
        )
          t.call(void 0, i[o], n && n[o], e);
    }
    Xe.prototype.cancel = function () {
      if (((this.i = nt(this)), this.h)) this.h.cancel(), (this.h = null);
      else if (this.g && 0 !== this.g.size) {
        for (const e of this.g.values()) e.cancel();
        this.g.clear();
      }
    };
    var rt = RegExp(
      "^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$"
    );
    function st(e) {
      if (
        ((this.g = this.o = this.j = ""),
        (this.s = null),
        (this.m = this.l = ""),
        (this.h = !1),
        e instanceof st)
      ) {
        (this.h = e.h),
          at(this, e.j),
          (this.o = e.o),
          (this.g = e.g),
          ht(this, e.s),
          (this.l = e.l);
        var t = e.i,
          n = new bt();
        (n.i = t.i),
          t.g && ((n.g = new Map(t.g)), (n.h = t.h)),
          ct(this, n),
          (this.m = e.m);
      } else
        e && (t = String(e).match(rt))
          ? ((this.h = !1),
            at(this, t[1] || "", !0),
            (this.o = dt(t[2] || "")),
            (this.g = dt(t[3] || "", !0)),
            ht(this, t[4]),
            (this.l = dt(t[5] || "", !0)),
            ct(this, t[6] || "", !0),
            (this.m = dt(t[7] || "")))
          : ((this.h = !1), (this.i = new bt(null, this.h)));
    }
    function ot(e) {
      return new st(e);
    }
    function at(e, t, n) {
      (e.j = n ? dt(t, !0) : t), e.j && (e.j = e.j.replace(/:$/, ""));
    }
    function ht(e, t) {
      if (t) {
        if (((t = Number(t)), isNaN(t) || 0 > t))
          throw Error("Bad port number " + t);
        e.s = t;
      } else e.s = null;
    }
    function ct(e, t, n) {
      t instanceof bt
        ? ((e.i = t),
          (function (e, t) {
            t &&
              !e.j &&
              (It(e),
              (e.i = null),
              e.g.forEach(function (e, t) {
                var n = t.toLowerCase();
                t != n && (Et(this, t), St(this, n, e));
              }, e)),
              (e.j = t);
          })(e.i, e.h))
        : (n || (t = pt(t, wt)), (e.i = new bt(t, e.h)));
    }
    function lt(e, t, n) {
      e.i.set(t, n);
    }
    function ut(e) {
      return (
        lt(
          e,
          "zx",
          Math.floor(2147483648 * Math.random()).toString(36) +
            Math.abs(
              Math.floor(2147483648 * Math.random()) ^ Date.now()
            ).toString(36)
        ),
        e
      );
    }
    function dt(e, t) {
      return e
        ? t
          ? decodeURI(e.replace(/%25/g, "%2525"))
          : decodeURIComponent(e)
        : "";
    }
    function pt(e, t, n) {
      return "string" == typeof e
        ? ((e = encodeURI(e).replace(t, ft)),
          n && (e = e.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
          e)
        : null;
    }
    function ft(e) {
      return (
        "%" +
        (((e = e.charCodeAt(0)) >> 4) & 15).toString(16) +
        (15 & e).toString(16)
      );
    }
    st.prototype.toString = function () {
      var e = [],
        t = this.j;
      t && e.push(pt(t, mt, !0), ":");
      var n = this.g;
      return (
        (n || "file" == t) &&
          (e.push("//"),
          (t = this.o) && e.push(pt(t, mt, !0), "@"),
          e.push(
            encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")
          ),
          null != (n = this.s) && e.push(":", String(n))),
        (n = this.l) &&
          (this.g && "/" != n.charAt(0) && e.push("/"),
          e.push(pt(n, "/" == n.charAt(0) ? yt : vt, !0))),
        (n = this.i.toString()) && e.push("?", n),
        (n = this.m) && e.push("#", pt(n, _t)),
        e.join("")
      );
    };
    var gt,
      mt = /[#\/\?@]/g,
      vt = /[#\?:]/g,
      yt = /[#\?]/g,
      wt = /[#\?@]/g,
      _t = /#/g;
    function bt(e, t) {
      (this.h = this.g = null), (this.i = e || null), (this.j = !!t);
    }
    function It(e) {
      e.g ||
        ((e.g = new Map()),
        (e.h = 0),
        e.i &&
          (function (e, t) {
            if (e) {
              e = e.split("&");
              for (var n = 0; n < e.length; n++) {
                var i = e[n].indexOf("="),
                  r = null;
                if (0 <= i) {
                  var s = e[n].substring(0, i);
                  r = e[n].substring(i + 1);
                } else s = e[n];
                t(s, r ? decodeURIComponent(r.replace(/\+/g, " ")) : "");
              }
            }
          })(e.i, function (t, n) {
            e.add(decodeURIComponent(t.replace(/\+/g, " ")), n);
          }));
    }
    function Et(e, t) {
      It(e),
        (t = kt(e, t)),
        e.g.has(t) && ((e.i = null), (e.h -= e.g.get(t).length), e.g.delete(t));
    }
    function Tt(e, t) {
      return It(e), (t = kt(e, t)), e.g.has(t);
    }
    function St(e, t, n) {
      Et(e, t),
        0 < n.length &&
          ((e.i = null), e.g.set(kt(e, t), d(n)), (e.h += n.length));
    }
    function kt(e, t) {
      return (t = String(t)), e.j && (t = t.toLowerCase()), t;
    }
    function Ct(e, t, n, i, r) {
      try {
        r &&
          ((r.onload = null),
          (r.onerror = null),
          (r.onabort = null),
          (r.ontimeout = null)),
          i(n);
      } catch (e) {}
    }
    function At() {
      this.g = new pe();
    }
    function Rt(e, t, n) {
      const i = n || "";
      try {
        it(e, function (e, n) {
          let r = e;
          o(e) && (r = ue(e)), t.push(i + n + "=" + encodeURIComponent(r));
        });
      } catch (e) {
        throw (t.push(i + "type=" + encodeURIComponent("_badmap")), e);
      }
    }
    function Pt(e) {
      (this.l = e.Ub || null), (this.j = e.eb || !1);
    }
    function Ot(e, t) {
      ne.call(this),
        (this.D = e),
        (this.o = t),
        (this.m = void 0),
        (this.status = this.readyState = 0),
        (this.responseType =
          this.responseText =
          this.response =
          this.statusText =
            ""),
        (this.onreadystatechange = null),
        (this.u = new Headers()),
        (this.h = null),
        (this.B = "GET"),
        (this.A = ""),
        (this.g = !1),
        (this.v = this.j = this.l = null);
    }
    function Nt(e) {
      e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e));
    }
    function Lt(e) {
      (e.readyState = 4), (e.l = null), (e.j = null), (e.v = null), Dt(e);
    }
    function Dt(e) {
      e.onreadystatechange && e.onreadystatechange.call(e);
    }
    function Mt(e) {
      let t = "";
      return (
        y(e, function (e, n) {
          (t += n), (t += ":"), (t += e), (t += "\r\n");
        }),
        t
      );
    }
    function Ut(e, t, n) {
      e: {
        for (i in n) {
          var i = !1;
          break e;
        }
        i = !0;
      }
      i ||
        ((n = Mt(n)),
        "string" == typeof e
          ? null != n && encodeURIComponent(String(n))
          : lt(e, t, n));
    }
    function xt(e) {
      ne.call(this),
        (this.headers = new Map()),
        (this.o = e || null),
        (this.h = !1),
        (this.v = this.g = null),
        (this.D = ""),
        (this.m = 0),
        (this.l = ""),
        (this.j = this.B = this.u = this.A = !1),
        (this.I = null),
        (this.H = ""),
        (this.J = !1);
    }
    ((e = bt.prototype).add = function (e, t) {
      It(this), (this.i = null), (e = kt(this, e));
      var n = this.g.get(e);
      return n || this.g.set(e, (n = [])), n.push(t), (this.h += 1), this;
    }),
      (e.forEach = function (e, t) {
        It(this),
          this.g.forEach(function (n, i) {
            n.forEach(function (n) {
              e.call(t, n, i, this);
            }, this);
          }, this);
      }),
      (e.na = function () {
        It(this);
        const e = Array.from(this.g.values()),
          t = Array.from(this.g.keys()),
          n = [];
        for (let i = 0; i < t.length; i++) {
          const r = e[i];
          for (let e = 0; e < r.length; e++) n.push(t[i]);
        }
        return n;
      }),
      (e.V = function (e) {
        It(this);
        let t = [];
        if ("string" == typeof e)
          Tt(this, e) && (t = t.concat(this.g.get(kt(this, e))));
        else {
          e = Array.from(this.g.values());
          for (let n = 0; n < e.length; n++) t = t.concat(e[n]);
        }
        return t;
      }),
      (e.set = function (e, t) {
        return (
          It(this),
          (this.i = null),
          Tt(this, (e = kt(this, e))) && (this.h -= this.g.get(e).length),
          this.g.set(e, [t]),
          (this.h += 1),
          this
        );
      }),
      (e.get = function (e, t) {
        return e && 0 < (e = this.V(e)).length ? String(e[0]) : t;
      }),
      (e.toString = function () {
        if (this.i) return this.i;
        if (!this.g) return "";
        const e = [],
          t = Array.from(this.g.keys());
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          const s = encodeURIComponent(String(i)),
            o = this.V(i);
          for (i = 0; i < o.length; i++) {
            var r = s;
            "" !== o[i] && (r += "=" + encodeURIComponent(String(o[i]))),
              e.push(r);
          }
        }
        return (this.i = e.join("&"));
      }),
      u(Pt, fe),
      (Pt.prototype.g = function () {
        return new Ot(this.l, this.j);
      }),
      (Pt.prototype.i =
        ((gt = {}),
        function () {
          return gt;
        })),
      u(Ot, ne),
      ((e = Ot.prototype).open = function (e, t) {
        if (0 != this.readyState)
          throw (this.abort(), Error("Error reopening a connection"));
        (this.B = e), (this.A = t), (this.readyState = 1), Dt(this);
      }),
      (e.send = function (e) {
        if (1 != this.readyState)
          throw (this.abort(), Error("need to call open() first. "));
        this.g = !0;
        const t = {
          headers: this.u,
          method: this.B,
          credentials: this.m,
          cache: void 0,
        };
        e && (t.body = e),
          (this.D || r)
            .fetch(new Request(this.A, t))
            .then(this.Sa.bind(this), this.ga.bind(this));
      }),
      (e.abort = function () {
        (this.response = this.responseText = ""),
          (this.u = new Headers()),
          (this.status = 0),
          this.j && this.j.cancel("Request was aborted.").catch(() => {}),
          1 <= this.readyState &&
            this.g &&
            4 != this.readyState &&
            ((this.g = !1), Lt(this)),
          (this.readyState = 0);
      }),
      (e.Sa = function (e) {
        if (
          this.g &&
          ((this.l = e),
          this.h ||
            ((this.status = this.l.status),
            (this.statusText = this.l.statusText),
            (this.h = e.headers),
            (this.readyState = 2),
            Dt(this)),
          this.g && ((this.readyState = 3), Dt(this), this.g))
        )
          if ("arraybuffer" === this.responseType)
            e.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
          else if (void 0 !== r.ReadableStream && "body" in e) {
            if (((this.j = e.body.getReader()), this.o)) {
              if (this.responseType)
                throw Error(
                  'responseType must be empty for "streamBinaryChunks" mode responses.'
                );
              this.response = [];
            } else
              (this.response = this.responseText = ""),
                (this.v = new TextDecoder());
            Nt(this);
          } else e.text().then(this.Ra.bind(this), this.ga.bind(this));
      }),
      (e.Pa = function (e) {
        if (this.g) {
          if (this.o && e.value) this.response.push(e.value);
          else if (!this.o) {
            var t = e.value ? e.value : new Uint8Array(0);
            (t = this.v.decode(t, { stream: !e.done })) &&
              (this.response = this.responseText += t);
          }
          e.done ? Lt(this) : Dt(this), 3 == this.readyState && Nt(this);
        }
      }),
      (e.Ra = function (e) {
        this.g && ((this.response = this.responseText = e), Lt(this));
      }),
      (e.Qa = function (e) {
        this.g && ((this.response = e), Lt(this));
      }),
      (e.ga = function () {
        this.g && Lt(this);
      }),
      (e.setRequestHeader = function (e, t) {
        this.u.append(e, t);
      }),
      (e.getResponseHeader = function (e) {
        return (this.h && this.h.get(e.toLowerCase())) || "";
      }),
      (e.getAllResponseHeaders = function () {
        if (!this.h) return "";
        const e = [],
          t = this.h.entries();
        for (var n = t.next(); !n.done; )
          (n = n.value), e.push(n[0] + ": " + n[1]), (n = t.next());
        return e.join("\r\n");
      }),
      Object.defineProperty(Ot.prototype, "withCredentials", {
        get: function () {
          return "include" === this.m;
        },
        set: function (e) {
          this.m = e ? "include" : "same-origin";
        },
      }),
      u(xt, ne);
    var jt = /^https?$/i,
      Ft = ["POST", "PUT"];
    function Vt(e, t) {
      (e.h = !1),
        e.g && ((e.j = !0), e.g.abort(), (e.j = !1)),
        (e.l = t),
        (e.m = 5),
        Bt(e),
        zt(e);
    }
    function Bt(e) {
      e.A || ((e.A = !0), ie(e, "complete"), ie(e, "error"));
    }
    function Ht(e) {
      if (e.h && void 0 !== i && (!e.v[1] || 4 != Wt(e) || 2 != e.Z()))
        if (e.u && 4 == Wt(e)) se(e.Ea, 0, e);
        else if ((ie(e, "readystatechange"), 4 == Wt(e))) {
          e.h = !1;
          try {
            const i = e.Z();
            e: switch (i) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var t = !0;
                break e;
              default:
                t = !1;
            }
            var n;
            if (!(n = t)) {
              var s;
              if ((s = 0 === i)) {
                var o = String(e.D).match(rt)[1] || null;
                !o &&
                  r.self &&
                  r.self.location &&
                  (o = r.self.location.protocol.slice(0, -1)),
                  (s = !jt.test(o ? o.toLowerCase() : ""));
              }
              n = s;
            }
            if (n) ie(e, "complete"), ie(e, "success");
            else {
              e.m = 6;
              try {
                var a = 2 < Wt(e) ? e.g.statusText : "";
              } catch (e) {
                a = "";
              }
              (e.l = a + " [" + e.Z() + "]"), Bt(e);
            }
          } finally {
            zt(e);
          }
        }
    }
    function zt(e, t) {
      if (e.g) {
        $t(e);
        const n = e.g,
          i = e.v[0] ? () => {} : null;
        (e.g = null), (e.v = null), t || ie(e, "ready");
        try {
          n.onreadystatechange = i;
        } catch (e) {}
      }
    }
    function $t(e) {
      e.I && (r.clearTimeout(e.I), (e.I = null));
    }
    function Wt(e) {
      return e.g ? e.g.readyState : 0;
    }
    function Kt(e) {
      try {
        if (!e.g) return null;
        if ("response" in e.g) return e.g.response;
        switch (e.H) {
          case "":
          case "text":
            return e.g.responseText;
          case "arraybuffer":
            if ("mozResponseArrayBuffer" in e.g)
              return e.g.mozResponseArrayBuffer;
        }
        return null;
      } catch (e) {
        return null;
      }
    }
    function qt(e, t, n) {
      return (n && n.internalChannelParams && n.internalChannelParams[e]) || t;
    }
    function Gt(e) {
      (this.Aa = 0),
        (this.i = []),
        (this.j = new Re()),
        (this.ia =
          this.qa =
          this.I =
          this.W =
          this.g =
          this.ya =
          this.D =
          this.H =
          this.m =
          this.S =
          this.o =
            null),
        (this.Ya = this.U = 0),
        (this.Va = qt("failFast", !1, e)),
        (this.F = this.C = this.u = this.s = this.l = null),
        (this.X = !0),
        (this.za = this.T = -1),
        (this.Y = this.v = this.B = 0),
        (this.Ta = qt("baseRetryDelayMs", 5e3, e)),
        (this.cb = qt("retryDelaySeedMs", 1e4, e)),
        (this.Wa = qt("forwardChannelMaxRetries", 2, e)),
        (this.wa = qt("forwardChannelRequestTimeoutMs", 2e4, e)),
        (this.pa = (e && e.xmlHttpFactory) || void 0),
        (this.Xa = (e && e.Tb) || void 0),
        (this.Ca = (e && e.useFetchStreams) || !1),
        (this.L = void 0),
        (this.J = (e && e.supportsCrossDomainXhr) || !1),
        (this.K = ""),
        (this.h = new Xe(e && e.concurrentRequestLimit)),
        (this.Da = new At()),
        (this.P = (e && e.fastHandshake) || !1),
        (this.O = (e && e.encodeInitMessageHeaders) || !1),
        this.P && this.O && (this.O = !1),
        (this.Ua = (e && e.Rb) || !1),
        e && e.xa && this.j.xa(),
        e && e.forceLongPolling && (this.X = !1),
        (this.ba = (!this.P && this.X && e && e.detectBufferingProxy) || !1),
        (this.ja = void 0),
        e &&
          e.longPollingTimeout &&
          0 < e.longPollingTimeout &&
          (this.ja = e.longPollingTimeout),
        (this.ca = void 0),
        (this.R = 0),
        (this.M = !1),
        (this.ka = this.A = null);
    }
    function Jt(e) {
      if ((Yt(e), 3 == e.G)) {
        var t = e.U++,
          n = ot(e.I);
        if (
          (lt(n, "SID", e.K),
          lt(n, "RID", t),
          lt(n, "TYPE", "terminate"),
          en(e, n),
          ((t = new Me(e, e.j, t)).L = 2),
          (t.v = ut(ot(n))),
          (n = !1),
          r.navigator && r.navigator.sendBeacon)
        )
          try {
            n = r.navigator.sendBeacon(t.v.toString(), "");
          } catch (e) {}
        !n && r.Image && ((new Image().src = t.v), (n = !0)),
          n || ((t.g = pn(t.j, null)), t.g.ea(t.v)),
          (t.F = Date.now()),
          ze(t);
      }
      un(e);
    }
    function Xt(e) {
      e.g && (sn(e), e.g.cancel(), (e.g = null));
    }
    function Yt(e) {
      Xt(e),
        e.u && (r.clearTimeout(e.u), (e.u = null)),
        an(e),
        e.h.cancel(),
        e.s && ("number" == typeof e.s && r.clearTimeout(e.s), (e.s = null));
    }
    function Qt(e) {
      if (!Ye(e.h) && !e.s) {
        e.s = !0;
        var t = e.Ga;
        C || P(), A || (C(), (A = !0)), R.add(t, e), (e.B = 0);
      }
    }
    function Zt(e, t) {
      var n;
      n = t ? t.l : e.U++;
      const i = ot(e.I);
      lt(i, "SID", e.K),
        lt(i, "RID", n),
        lt(i, "AID", e.T),
        en(e, i),
        e.m && e.o && Ut(i, e.m, e.o),
        (n = new Me(e, e.j, n, e.B + 1)),
        null === e.m && (n.H = e.o),
        t && (e.i = t.D.concat(e.i)),
        (t = tn(e, n, 1e3)),
        (n.I = Math.round(0.5 * e.wa) + Math.round(0.5 * e.wa * Math.random())),
        et(e.h, n),
        Fe(n, i, t);
    }
    function en(e, t) {
      e.H &&
        y(e.H, function (e, n) {
          lt(t, n, e);
        }),
        e.l &&
          it({}, function (e, n) {
            lt(t, n, e);
          });
    }
    function tn(e, t, n) {
      n = Math.min(e.i.length, n);
      var i = e.l ? c(e.l.Na, e.l, e) : null;
      e: {
        var r = e.i;
        let t = -1;
        for (;;) {
          const e = ["count=" + n];
          -1 == t
            ? 0 < n
              ? ((t = r[0].g), e.push("ofs=" + t))
              : (t = 0)
            : e.push("ofs=" + t);
          let s = !0;
          for (let o = 0; o < n; o++) {
            let n = r[o].g;
            const a = r[o].map;
            if (((n -= t), 0 > n)) (t = Math.max(0, r[o].g - 100)), (s = !1);
            else
              try {
                Rt(a, e, "req" + n + "_");
              } catch (e) {
                i && i(a);
              }
          }
          if (s) {
            i = e.join("&");
            break e;
          }
        }
      }
      return (e = e.i.splice(0, n)), (t.D = e), i;
    }
    function nn(e) {
      if (!e.g && !e.u) {
        e.Y = 1;
        var t = e.Fa;
        C || P(), A || (C(), (A = !0)), R.add(t, e), (e.v = 0);
      }
    }
    function rn(e) {
      return !(
        e.g ||
        e.u ||
        3 <= e.v ||
        (e.Y++, (e.u = Ae(c(e.Fa, e), cn(e, e.v))), e.v++, 0)
      );
    }
    function sn(e) {
      null != e.A && (r.clearTimeout(e.A), (e.A = null));
    }
    function on(e) {
      (e.g = new Me(e, e.j, "rpc", e.Y)),
        null === e.m && (e.g.H = e.o),
        (e.g.O = 0);
      var t = ot(e.qa);
      lt(t, "RID", "rpc"),
        lt(t, "SID", e.K),
        lt(t, "AID", e.T),
        lt(t, "CI", e.F ? "0" : "1"),
        !e.F && e.ja && lt(t, "TO", e.ja),
        lt(t, "TYPE", "xmlhttp"),
        en(e, t),
        e.m && e.o && Ut(t, e.m, e.o),
        e.L && (e.g.I = e.L);
      var n = e.g;
      (e = e.ia),
        (n.L = 1),
        (n.v = ut(ot(t))),
        (n.m = null),
        (n.P = !0),
        Ve(n, e);
    }
    function an(e) {
      null != e.C && (r.clearTimeout(e.C), (e.C = null));
    }
    function hn(e, t) {
      var n = null;
      if (e.g == t) {
        an(e), sn(e), (e.g = null);
        var i = 2;
      } else {
        if (!Ze(e.h, t)) return;
        (n = t.D), tt(e.h, t), (i = 1);
      }
      if (0 != e.G)
        if (t.o)
          if (1 == i) {
            (n = t.m ? t.m.length : 0), (t = Date.now() - t.F);
            var r = e.B;
            ie((i = Ie()), new Ce(i, n)), Qt(e);
          } else nn(e);
        else if (
          3 == (r = t.s) ||
          (0 == r && 0 < t.X) ||
          !(
            (1 == i &&
              (function (e, t) {
                return !(
                  Qe(e.h) >= e.h.j - (e.s ? 1 : 0) ||
                  (e.s
                    ? ((e.i = t.D.concat(e.i)), 0)
                    : 1 == e.G ||
                      2 == e.G ||
                      e.B >= (e.Va ? 0 : e.Wa) ||
                      ((e.s = Ae(c(e.Ga, e, t), cn(e, e.B))), e.B++, 0))
                );
              })(e, t)) ||
            (2 == i && rn(e))
          )
        )
          switch (
            (n && 0 < n.length && ((t = e.h), (t.i = t.i.concat(n))), r)
          ) {
            case 1:
              ln(e, 5);
              break;
            case 4:
              ln(e, 10);
              break;
            case 3:
              ln(e, 6);
              break;
            default:
              ln(e, 2);
          }
    }
    function cn(e, t) {
      let n = e.Ta + Math.floor(Math.random() * e.cb);
      return e.isActive() || (n *= 2), n * t;
    }
    function ln(e, t) {
      if ((e.j.info("Error code " + t), 2 == t)) {
        var n = c(e.fb, e),
          i = e.Xa;
        const t = !i;
        (i = new st(i || "//www.google.com/images/cleardot.gif")),
          (r.location && "http" == r.location.protocol) || at(i, "https"),
          ut(i),
          t
            ? (function (e, t) {
                const n = new Re();
                if (r.Image) {
                  const i = new Image();
                  (i.onload = l(Ct, n, "TestLoadImage: loaded", !0, t, i)),
                    (i.onerror = l(Ct, n, "TestLoadImage: error", !1, t, i)),
                    (i.onabort = l(Ct, n, "TestLoadImage: abort", !1, t, i)),
                    (i.ontimeout = l(
                      Ct,
                      n,
                      "TestLoadImage: timeout",
                      !1,
                      t,
                      i
                    )),
                    r.setTimeout(function () {
                      i.ontimeout && i.ontimeout();
                    }, 1e4),
                    (i.src = e);
                } else t(!1);
              })(i.toString(), n)
            : (function (e, t) {
                new Re();
                const n = new AbortController(),
                  i = setTimeout(() => {
                    n.abort(), Ct(0, 0, !1, t);
                  }, 1e4);
                fetch(e, { signal: n.signal })
                  .then((e) => {
                    clearTimeout(i), e.ok ? Ct(0, 0, !0, t) : Ct(0, 0, !1, t);
                  })
                  .catch(() => {
                    clearTimeout(i), Ct(0, 0, !1, t);
                  });
              })(i.toString(), n);
      } else ke(2);
      (e.G = 0), e.l && e.l.sa(t), un(e), Yt(e);
    }
    function un(e) {
      if (((e.G = 0), (e.ka = []), e.l)) {
        const t = nt(e.h);
        (0 == t.length && 0 == e.i.length) ||
          (p(e.ka, t),
          p(e.ka, e.i),
          (e.h.i.length = 0),
          d(e.i),
          (e.i.length = 0)),
          e.l.ra();
      }
    }
    function dn(e, t, n) {
      var i = n instanceof st ? ot(n) : new st(n);
      if ("" != i.g) t && (i.g = t + "." + i.g), ht(i, i.s);
      else {
        var s = r.location;
        (i = s.protocol),
          (t = t ? t + "." + s.hostname : s.hostname),
          (s = +s.port);
        var o = new st(null);
        i && at(o, i), t && (o.g = t), s && ht(o, s), n && (o.l = n), (i = o);
      }
      return (
        (n = e.D),
        (t = e.ya),
        n && t && lt(i, n, t),
        lt(i, "VER", e.la),
        en(e, i),
        i
      );
    }
    function pn(e, t, n) {
      if (t && !e.J)
        throw Error("Can't create secondary domain capable XhrIo object.");
      return (
        (t = e.Ca && !e.pa ? new xt(new Pt({ eb: n })) : new xt(e.pa)).Ha(e.J),
        t
      );
    }
    function fn() {}
    function gn() {}
    function mn(e, t) {
      ne.call(this),
        (this.g = new Gt(t)),
        (this.l = e),
        (this.h = (t && t.messageUrlParams) || null),
        (e = (t && t.messageHeaders) || null),
        t &&
          t.clientProtocolHeaderRequired &&
          (e
            ? (e["X-Client-Protocol"] = "webchannel")
            : (e = { "X-Client-Protocol": "webchannel" })),
        (this.g.o = e),
        (e = (t && t.initMessageHeaders) || null),
        t &&
          t.messageContentType &&
          (e
            ? (e["X-WebChannel-Content-Type"] = t.messageContentType)
            : (e = { "X-WebChannel-Content-Type": t.messageContentType })),
        t &&
          t.va &&
          (e
            ? (e["X-WebChannel-Client-Profile"] = t.va)
            : (e = { "X-WebChannel-Client-Profile": t.va })),
        (this.g.S = e),
        (e = t && t.Sb) && !f(e) && (this.g.m = e),
        (this.v = (t && t.supportsCrossDomainXhr) || !1),
        (this.u = (t && t.sendRawJson) || !1),
        (t = t && t.httpSessionIdParam) &&
          !f(t) &&
          ((this.g.D = t),
          null !== (e = this.h) && t in e && t in (e = this.h) && delete e[t]),
        (this.j = new wn(this));
    }
    function vn(e) {
      ye.call(this),
        e.__headers__ &&
          ((this.headers = e.__headers__),
          (this.statusCode = e.__status__),
          delete e.__headers__,
          delete e.__status__);
      var t = e.__sm__;
      if (t) {
        e: {
          for (const n in t) {
            e = n;
            break e;
          }
          e = void 0;
        }
        (this.i = e) &&
          ((e = this.i), (t = null !== t && e in t ? t[e] : void 0)),
          (this.data = t);
      } else this.data = e;
    }
    function yn() {
      we.call(this), (this.status = 1);
    }
    function wn(e) {
      this.g = e;
    }
    ((e = xt.prototype).Ha = function (e) {
      this.J = e;
    }),
      (e.ea = function (e, t, n, i) {
        if (this.g)
          throw Error(
            "[goog.net.XhrIo] Object is active with another request=" +
              this.D +
              "; newUri=" +
              e
          );
        (t = t ? t.toUpperCase() : "GET"),
          (this.D = e),
          (this.l = ""),
          (this.m = 0),
          (this.A = !1),
          (this.h = !0),
          (this.g = this.o ? this.o.g() : Oe.g()),
          (this.v = this.o ? ge(this.o) : ge(Oe)),
          (this.g.onreadystatechange = c(this.Ea, this));
        try {
          (this.B = !0), this.g.open(t, String(e), !0), (this.B = !1);
        } catch (e) {
          return void Vt(this, e);
        }
        if (((e = n || ""), (n = new Map(this.headers)), i))
          if (Object.getPrototypeOf(i) === Object.prototype)
            for (var s in i) n.set(s, i[s]);
          else {
            if ("function" != typeof i.keys || "function" != typeof i.get)
              throw Error("Unknown input type for opt_headers: " + String(i));
            for (const e of i.keys()) n.set(e, i.get(e));
          }
        (i = Array.from(n.keys()).find(
          (e) => "content-type" == e.toLowerCase()
        )),
          (s = r.FormData && e instanceof r.FormData),
          !(0 <= Array.prototype.indexOf.call(Ft, t, void 0)) ||
            i ||
            s ||
            n.set(
              "Content-Type",
              "application/x-www-form-urlencoded;charset=utf-8"
            );
        for (const [e, t] of n) this.g.setRequestHeader(e, t);
        this.H && (this.g.responseType = this.H),
          "withCredentials" in this.g &&
            this.g.withCredentials !== this.J &&
            (this.g.withCredentials = this.J);
        try {
          $t(this), (this.u = !0), this.g.send(e), (this.u = !1);
        } catch (e) {
          Vt(this, e);
        }
      }),
      (e.abort = function (e) {
        this.g &&
          this.h &&
          ((this.h = !1),
          (this.j = !0),
          this.g.abort(),
          (this.j = !1),
          (this.m = e || 7),
          ie(this, "complete"),
          ie(this, "abort"),
          zt(this));
      }),
      (e.N = function () {
        this.g &&
          (this.h &&
            ((this.h = !1), (this.j = !0), this.g.abort(), (this.j = !1)),
          zt(this, !0)),
          xt.aa.N.call(this);
      }),
      (e.Ea = function () {
        this.s || (this.B || this.u || this.j ? Ht(this) : this.bb());
      }),
      (e.bb = function () {
        Ht(this);
      }),
      (e.isActive = function () {
        return !!this.g;
      }),
      (e.Z = function () {
        try {
          return 2 < Wt(this) ? this.g.status : -1;
        } catch (e) {
          return -1;
        }
      }),
      (e.oa = function () {
        try {
          return this.g ? this.g.responseText : "";
        } catch (e) {
          return "";
        }
      }),
      (e.Oa = function (e) {
        if (this.g) {
          var t = this.g.responseText;
          return e && 0 == t.indexOf(e) && (t = t.substring(e.length)), de(t);
        }
      }),
      (e.Ba = function () {
        return this.m;
      }),
      (e.Ka = function () {
        return "string" == typeof this.l ? this.l : String(this.l);
      }),
      ((e = Gt.prototype).la = 8),
      (e.G = 1),
      (e.connect = function (e, t, n, i) {
        ke(0),
          (this.W = e),
          (this.H = t || {}),
          n && void 0 !== i && ((this.H.OSID = n), (this.H.OAID = i)),
          (this.F = this.X),
          (this.I = dn(this, null, this.W)),
          Qt(this);
      }),
      (e.Ga = function (e) {
        if (this.s)
          if (((this.s = null), 1 == this.G)) {
            if (!e) {
              (this.U = Math.floor(1e5 * Math.random())), (e = this.U++);
              const r = new Me(this, this.j, e);
              let s = this.o;
              if (
                (this.S && (s ? ((s = w(s)), b(s, this.S)) : (s = this.S)),
                null !== this.m || this.O || ((r.H = s), (s = null)),
                this.P)
              )
                e: {
                  for (var t = 0, n = 0; n < this.i.length; n++) {
                    var i = this.i[n];
                    if (
                      void 0 ===
                      (i =
                        "__data__" in i.map &&
                        "string" == typeof (i = i.map.__data__)
                          ? i.length
                          : void 0)
                    )
                      break;
                    if (4096 < (t += i)) {
                      t = n;
                      break e;
                    }
                    if (4096 === t || n === this.i.length - 1) {
                      t = n + 1;
                      break e;
                    }
                  }
                  t = 1e3;
                }
              else t = 1e3;
              (t = tn(this, r, t)),
                lt((n = ot(this.I)), "RID", e),
                lt(n, "CVER", 22),
                this.D && lt(n, "X-HTTP-Session-Id", this.D),
                en(this, n),
                s &&
                  (this.O
                    ? (t =
                        "headers=" +
                        encodeURIComponent(String(Mt(s))) +
                        "&" +
                        t)
                    : this.m && Ut(n, this.m, s)),
                et(this.h, r),
                this.Ua && lt(n, "TYPE", "init"),
                this.P
                  ? (lt(n, "$req", t),
                    lt(n, "SID", "null"),
                    (r.T = !0),
                    Fe(r, n, null))
                  : Fe(r, n, t),
                (this.G = 2);
            }
          } else
            3 == this.G &&
              (e ? Zt(this, e) : 0 == this.i.length || Ye(this.h) || Zt(this));
      }),
      (e.Fa = function () {
        if (
          ((this.u = null),
          on(this),
          this.ba && !(this.M || null == this.g || 0 >= this.R))
        ) {
          var e = 2 * this.R;
          this.j.info("BP detection timer enabled: " + e),
            (this.A = Ae(c(this.ab, this), e));
        }
      }),
      (e.ab = function () {
        this.A &&
          ((this.A = null),
          this.j.info("BP detection timeout reached."),
          this.j.info("Buffering proxy detected and switch to long-polling!"),
          (this.F = !1),
          (this.M = !0),
          ke(10),
          Xt(this),
          on(this));
      }),
      (e.Za = function () {
        null != this.C && ((this.C = null), Xt(this), rn(this), ke(19));
      }),
      (e.fb = function (e) {
        e
          ? (this.j.info("Successfully pinged google.com"), ke(2))
          : (this.j.info("Failed to ping google.com"), ke(1));
      }),
      (e.isActive = function () {
        return !!this.l && this.l.isActive(this);
      }),
      ((e = fn.prototype).ua = function () {}),
      (e.ta = function () {}),
      (e.sa = function () {}),
      (e.ra = function () {}),
      (e.isActive = function () {
        return !0;
      }),
      (e.Na = function () {}),
      (gn.prototype.g = function (e, t) {
        return new mn(e, t);
      }),
      u(mn, ne),
      (mn.prototype.m = function () {
        (this.g.l = this.j),
          this.v && (this.g.J = !0),
          this.g.connect(this.l, this.h || void 0);
      }),
      (mn.prototype.close = function () {
        Jt(this.g);
      }),
      (mn.prototype.o = function (e) {
        var t = this.g;
        if ("string" == typeof e) {
          var n = {};
          (n.__data__ = e), (e = n);
        } else this.u && (((n = {}).__data__ = ue(e)), (e = n));
        t.i.push(new Je(t.Ya++, e)), 3 == t.G && Qt(t);
      }),
      (mn.prototype.N = function () {
        (this.g.l = null),
          delete this.j,
          Jt(this.g),
          delete this.g,
          mn.aa.N.call(this);
      }),
      u(vn, ye),
      u(yn, we),
      u(wn, fn),
      (wn.prototype.ua = function () {
        ie(this.g, "a");
      }),
      (wn.prototype.ta = function (e) {
        ie(this.g, new vn(e));
      }),
      (wn.prototype.sa = function (e) {
        ie(this.g, new yn());
      }),
      (wn.prototype.ra = function () {
        ie(this.g, "b");
      }),
      (gn.prototype.createWebChannel = gn.prototype.g),
      (mn.prototype.send = mn.prototype.o),
      (mn.prototype.open = mn.prototype.m),
      (mn.prototype.close = mn.prototype.close),
      (Ji.createWebChannelTransport = function () {
        return new gn();
      }),
      (Ji.getStatEventTarget = function () {
        return Ie();
      }),
      (Ji.Event = _e),
      (Ji.Stat = {
        mb: 0,
        pb: 1,
        qb: 2,
        Jb: 3,
        Ob: 4,
        Lb: 5,
        Mb: 6,
        Kb: 7,
        Ib: 8,
        Nb: 9,
        PROXY: 10,
        NOPROXY: 11,
        Gb: 12,
        Cb: 13,
        Db: 14,
        Bb: 15,
        Eb: 16,
        Fb: 17,
        ib: 18,
        hb: 19,
        jb: 20,
      }),
      (Ne.NO_ERROR = 0),
      (Ne.TIMEOUT = 8),
      (Ne.HTTP_ERROR = 6),
      (Ji.ErrorCode = Ne),
      (Le.COMPLETE = "complete"),
      (Ji.EventType = Le),
      (me.EventType = ve),
      (ve.OPEN = "a"),
      (ve.CLOSE = "b"),
      (ve.ERROR = "c"),
      (ve.MESSAGE = "d"),
      (ne.prototype.listen = ne.prototype.K),
      (Ji.WebChannel = me),
      (Ji.FetchXmlHttpFactory = Pt),
      (xt.prototype.listenOnce = xt.prototype.L),
      (xt.prototype.getLastError = xt.prototype.Ka),
      (xt.prototype.getLastErrorCode = xt.prototype.Ba),
      (xt.prototype.getStatus = xt.prototype.Z),
      (xt.prototype.getResponseJson = xt.prototype.Oa),
      (xt.prototype.getResponseText = xt.prototype.oa),
      (xt.prototype.send = xt.prototype.ea),
      (xt.prototype.setWithCredentials = xt.prototype.Ha),
      (Ji.XhrIo = xt);
  }).apply(
    void 0 !== Gi
      ? Gi
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : {}
  );
  const Xi = "@firebase/firestore";
  class Yi {
    constructor(e) {
      this.uid = e;
    }
    isAuthenticated() {
      return null != this.uid;
    }
    toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(e) {
      return e.uid === this.uid;
    }
  }
  (Yi.UNAUTHENTICATED = new Yi(null)),
    (Yi.GOOGLE_CREDENTIALS = new Yi("google-credentials-uid")),
    (Yi.FIRST_PARTY = new Yi("first-party-uid")),
    (Yi.MOCK_USER = new Yi("mock-user"));
  let Qi = "10.12.0";
  const Zi = new N("@firebase/firestore");
  function er(e, ...t) {
    if (Zi.logLevel <= C.DEBUG) {
      const n = t.map(nr);
      Zi.debug(`Firestore (${Qi}): ${e}`, ...n);
    }
  }
  function tr(e, ...t) {
    if (Zi.logLevel <= C.ERROR) {
      const n = t.map(nr);
      Zi.error(`Firestore (${Qi}): ${e}`, ...n);
    }
  }
  function nr(e) {
    if ("string" == typeof e) return e;
    try {
      return (function (e) {
        return JSON.stringify(e);
      })(e);
    } catch (t) {
      return e;
    }
  }
  function ir(e = "Unexpected state") {
    const t = `FIRESTORE (${Qi}) INTERNAL ASSERTION FAILED: ` + e;
    throw (tr(t), new Error(t));
  }
  function rr(e, t) {
    e || ir();
  }
  const sr = "cancelled",
    or = "invalid-argument",
    ar = "failed-precondition",
    hr = "unavailable";
  class cr extends u {
    constructor(e, t) {
      super(e, t),
        (this.code = e),
        (this.message = t),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`);
    }
  }
  class lr {
    constructor() {
      this.promise = new Promise((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  class ur {
    constructor(e, t) {
      (this.user = t),
        (this.type = "OAuth"),
        (this.headers = new Map()),
        this.headers.set("Authorization", `Bearer ${e}`);
    }
  }
  class dr {
    getToken() {
      return Promise.resolve(null);
    }
    invalidateToken() {}
    start(e, t) {
      e.enqueueRetryable(() => t(Yi.UNAUTHENTICATED));
    }
    shutdown() {}
  }
  class pr {
    constructor(e) {
      (this.t = e),
        (this.currentUser = Yi.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null);
    }
    start(e, t) {
      let n = this.i;
      const i = (e) =>
        this.i !== n ? ((n = this.i), t(e)) : Promise.resolve();
      let r = new lr();
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          r.resolve(),
          (r = new lr()),
          e.enqueueRetryable(() => i(this.currentUser));
      };
      const s = () => {
          const t = r;
          e.enqueueRetryable(async () => {
            await t.promise, await i(this.currentUser);
          });
        },
        o = (e) => {
          er("FirebaseAuthCredentialsProvider", "Auth detected"),
            (this.auth = e),
            this.auth.addAuthTokenListener(this.o),
            s();
        };
      this.t.onInit((e) => o(e)),
        setTimeout(() => {
          if (!this.auth) {
            const e = this.t.getImmediate({ optional: !0 });
            e
              ? o(e)
              : (er("FirebaseAuthCredentialsProvider", "Auth not yet detected"),
                r.resolve(),
                (r = new lr()));
          }
        }, 0),
        s();
    }
    getToken() {
      const e = this.i,
        t = this.forceRefresh;
      return (
        (this.forceRefresh = !1),
        this.auth
          ? this.auth
              .getToken(t)
              .then((t) =>
                this.i !== e
                  ? (er(
                      "FirebaseAuthCredentialsProvider",
                      "getToken aborted due to token change."
                    ),
                    this.getToken())
                  : t
                  ? (rr("string" == typeof t.accessToken),
                    new ur(t.accessToken, this.currentUser))
                  : null
              )
          : Promise.resolve(null)
      );
    }
    invalidateToken() {
      this.forceRefresh = !0;
    }
    shutdown() {
      this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    u() {
      const e = this.auth && this.auth.getUid();
      return rr(null === e || "string" == typeof e), new Yi(e);
    }
  }
  class fr {
    constructor(e, t, n) {
      (this.l = e),
        (this.h = t),
        (this.P = n),
        (this.type = "FirstParty"),
        (this.user = Yi.FIRST_PARTY),
        (this.I = new Map());
    }
    T() {
      return this.P ? this.P() : null;
    }
    get headers() {
      this.I.set("X-Goog-AuthUser", this.l);
      const e = this.T();
      return (
        e && this.I.set("Authorization", e),
        this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h),
        this.I
      );
    }
  }
  class gr {
    constructor(e, t, n) {
      (this.l = e), (this.h = t), (this.P = n);
    }
    getToken() {
      return Promise.resolve(new fr(this.l, this.h, this.P));
    }
    start(e, t) {
      e.enqueueRetryable(() => t(Yi.FIRST_PARTY));
    }
    shutdown() {}
    invalidateToken() {}
  }
  class mr {
    constructor(e) {
      (this.value = e),
        (this.type = "AppCheck"),
        (this.headers = new Map()),
        e &&
          e.length > 0 &&
          this.headers.set("x-firebase-appcheck", this.value);
    }
  }
  class vr {
    constructor(e) {
      (this.A = e),
        (this.forceRefresh = !1),
        (this.appCheck = null),
        (this.R = null);
    }
    start(e, t) {
      const n = (e) => {
        null != e.error &&
          er(
            "FirebaseAppCheckTokenProvider",
            `Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`
          );
        const n = e.token !== this.R;
        return (
          (this.R = e.token),
          er(
            "FirebaseAppCheckTokenProvider",
            `Received ${n ? "new" : "existing"} token.`
          ),
          n ? t(e.token) : Promise.resolve()
        );
      };
      this.o = (t) => {
        e.enqueueRetryable(() => n(t));
      };
      const i = (e) => {
        er("FirebaseAppCheckTokenProvider", "AppCheck detected"),
          (this.appCheck = e),
          this.appCheck.addTokenListener(this.o);
      };
      this.A.onInit((e) => i(e)),
        setTimeout(() => {
          if (!this.appCheck) {
            const e = this.A.getImmediate({ optional: !0 });
            e
              ? i(e)
              : er(
                  "FirebaseAppCheckTokenProvider",
                  "AppCheck not yet detected"
                );
          }
        }, 0);
    }
    getToken() {
      const e = this.forceRefresh;
      return (
        (this.forceRefresh = !1),
        this.appCheck
          ? this.appCheck
              .getToken(e)
              .then((e) =>
                e
                  ? (rr("string" == typeof e.token),
                    (this.R = e.token),
                    new mr(e.token))
                  : null
              )
          : Promise.resolve(null)
      );
    }
    invalidateToken() {
      this.forceRefresh = !0;
    }
    shutdown() {
      this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
  }
  function yr(e) {
    const t = "undefined" != typeof self && (self.crypto || self.msCrypto),
      n = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
    else for (let t = 0; t < e; t++) n[t] = Math.floor(256 * Math.random());
    return n;
  }
  class wr {
    static newId() {
      const e = 62 * Math.floor(256 / 62);
      let t = "";
      for (; t.length < 20; ) {
        const n = yr(40);
        for (let i = 0; i < n.length; ++i)
          t.length < 20 &&
            n[i] < e &&
            (t +=
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
                n[i] % 62
              ));
      }
      return t;
    }
  }
  function _r(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
  }
  class br {
    constructor(e, t, n) {
      void 0 === t ? (t = 0) : t > e.length && ir(),
        void 0 === n ? (n = e.length - t) : n > e.length - t && ir(),
        (this.segments = e),
        (this.offset = t),
        (this.len = n);
    }
    get length() {
      return this.len;
    }
    isEqual(e) {
      return 0 === br.comparator(this, e);
    }
    child(e) {
      const t = this.segments.slice(this.offset, this.limit());
      return (
        e instanceof br
          ? e.forEach((e) => {
              t.push(e);
            })
          : t.push(e),
        this.construct(t)
      );
    }
    limit() {
      return this.offset + this.length;
    }
    popFirst(e) {
      return (
        (e = void 0 === e ? 1 : e),
        this.construct(this.segments, this.offset + e, this.length - e)
      );
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
      return this.segments[this.offset];
    }
    lastSegment() {
      return this.get(this.length - 1);
    }
    get(e) {
      return this.segments[this.offset + e];
    }
    isEmpty() {
      return 0 === this.length;
    }
    isPrefixOf(e) {
      if (e.length < this.length) return !1;
      for (let t = 0; t < this.length; t++)
        if (this.get(t) !== e.get(t)) return !1;
      return !0;
    }
    isImmediateParentOf(e) {
      if (this.length + 1 !== e.length) return !1;
      for (let t = 0; t < this.length; t++)
        if (this.get(t) !== e.get(t)) return !1;
      return !0;
    }
    forEach(e) {
      for (let t = this.offset, n = this.limit(); t < n; t++)
        e(this.segments[t]);
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
    static comparator(e, t) {
      const n = Math.min(e.length, t.length);
      for (let i = 0; i < n; i++) {
        const n = e.get(i),
          r = t.get(i);
        if (n < r) return -1;
        if (n > r) return 1;
      }
      return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
    }
  }
  class Ir extends br {
    construct(e, t, n) {
      return new Ir(e, t, n);
    }
    canonicalString() {
      return this.toArray().join("/");
    }
    toString() {
      return this.canonicalString();
    }
    toUriEncodedString() {
      return this.toArray().map(encodeURIComponent).join("/");
    }
    static fromString(...e) {
      const t = [];
      for (const n of e) {
        if (n.indexOf("//") >= 0)
          throw new cr(
            or,
            `Invalid segment (${n}). Paths must not contain // in them.`
          );
        t.push(...n.split("/").filter((e) => e.length > 0));
      }
      return new Ir(t);
    }
    static emptyPath() {
      return new Ir([]);
    }
  }
  class Er {
    constructor(e) {
      this.path = e;
    }
    static fromPath(e) {
      return new Er(Ir.fromString(e));
    }
    static fromName(e) {
      return new Er(Ir.fromString(e).popFirst(5));
    }
    static empty() {
      return new Er(Ir.emptyPath());
    }
    get collectionGroup() {
      return this.path.popLast().lastSegment();
    }
    hasCollectionId(e) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
    }
    getCollectionGroup() {
      return this.path.get(this.path.length - 2);
    }
    getCollectionPath() {
      return this.path.popLast();
    }
    isEqual(e) {
      return null !== e && 0 === Ir.comparator(this.path, e.path);
    }
    toString() {
      return this.path.toString();
    }
    static comparator(e, t) {
      return Ir.comparator(e.path, t.path);
    }
    static isDocumentKey(e) {
      return e.length % 2 == 0;
    }
    static fromSegments(e) {
      return new Er(new Ir(e.slice()));
    }
  }
  function Tr(e) {
    return "IndexedDbTransactionError" === e.name;
  }
  class Sr {
    constructor(e, t) {
      (this.comparator = e), (this.root = t || Cr.EMPTY);
    }
    insert(e, t) {
      return new Sr(
        this.comparator,
        this.root
          .insert(e, t, this.comparator)
          .copy(null, null, Cr.BLACK, null, null)
      );
    }
    remove(e) {
      return new Sr(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, Cr.BLACK, null, null)
      );
    }
    get(e) {
      let t = this.root;
      for (; !t.isEmpty(); ) {
        const n = this.comparator(e, t.key);
        if (0 === n) return t.value;
        n < 0 ? (t = t.left) : n > 0 && (t = t.right);
      }
      return null;
    }
    indexOf(e) {
      let t = 0,
        n = this.root;
      for (; !n.isEmpty(); ) {
        const i = this.comparator(e, n.key);
        if (0 === i) return t + n.left.size;
        i < 0 ? (n = n.left) : ((t += n.left.size + 1), (n = n.right));
      }
      return -1;
    }
    isEmpty() {
      return this.root.isEmpty();
    }
    get size() {
      return this.root.size;
    }
    minKey() {
      return this.root.minKey();
    }
    maxKey() {
      return this.root.maxKey();
    }
    inorderTraversal(e) {
      return this.root.inorderTraversal(e);
    }
    forEach(e) {
      this.inorderTraversal((t, n) => (e(t, n), !1));
    }
    toString() {
      const e = [];
      return (
        this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), !1)),
        `{${e.join(", ")}}`
      );
    }
    reverseTraversal(e) {
      return this.root.reverseTraversal(e);
    }
    getIterator() {
      return new kr(this.root, null, this.comparator, !1);
    }
    getIteratorFrom(e) {
      return new kr(this.root, e, this.comparator, !1);
    }
    getReverseIterator() {
      return new kr(this.root, null, this.comparator, !0);
    }
    getReverseIteratorFrom(e) {
      return new kr(this.root, e, this.comparator, !0);
    }
  }
  class kr {
    constructor(e, t, n, i) {
      (this.isReverse = i), (this.nodeStack = []);
      let r = 1;
      for (; !e.isEmpty(); )
        if (((r = t ? n(e.key, t) : 1), t && i && (r *= -1), r < 0))
          e = this.isReverse ? e.left : e.right;
        else {
          if (0 === r) {
            this.nodeStack.push(e);
            break;
          }
          this.nodeStack.push(e), (e = this.isReverse ? e.right : e.left);
        }
    }
    getNext() {
      let e = this.nodeStack.pop();
      const t = { key: e.key, value: e.value };
      if (this.isReverse)
        for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.right);
      else
        for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.left);
      return t;
    }
    hasNext() {
      return this.nodeStack.length > 0;
    }
    peek() {
      if (0 === this.nodeStack.length) return null;
      const e = this.nodeStack[this.nodeStack.length - 1];
      return { key: e.key, value: e.value };
    }
  }
  class Cr {
    constructor(e, t, n, i, r) {
      (this.key = e),
        (this.value = t),
        (this.color = null != n ? n : Cr.RED),
        (this.left = null != i ? i : Cr.EMPTY),
        (this.right = null != r ? r : Cr.EMPTY),
        (this.size = this.left.size + 1 + this.right.size);
    }
    copy(e, t, n, i, r) {
      return new Cr(
        null != e ? e : this.key,
        null != t ? t : this.value,
        null != n ? n : this.color,
        null != i ? i : this.left,
        null != r ? r : this.right
      );
    }
    isEmpty() {
      return !1;
    }
    inorderTraversal(e) {
      return (
        this.left.inorderTraversal(e) ||
        e(this.key, this.value) ||
        this.right.inorderTraversal(e)
      );
    }
    reverseTraversal(e) {
      return (
        this.right.reverseTraversal(e) ||
        e(this.key, this.value) ||
        this.left.reverseTraversal(e)
      );
    }
    min() {
      return this.left.isEmpty() ? this : this.left.min();
    }
    minKey() {
      return this.min().key;
    }
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    insert(e, t, n) {
      let i = this;
      const r = n(e, i.key);
      return (
        (i =
          r < 0
            ? i.copy(null, null, null, i.left.insert(e, t, n), null)
            : 0 === r
            ? i.copy(null, t, null, null, null)
            : i.copy(null, null, null, null, i.right.insert(e, t, n))),
        i.fixUp()
      );
    }
    removeMin() {
      if (this.left.isEmpty()) return Cr.EMPTY;
      let e = this;
      return (
        e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()),
        (e = e.copy(null, null, null, e.left.removeMin(), null)),
        e.fixUp()
      );
    }
    remove(e, t) {
      let n,
        i = this;
      if (t(e, i.key) < 0)
        i.left.isEmpty() ||
          i.left.isRed() ||
          i.left.left.isRed() ||
          (i = i.moveRedLeft()),
          (i = i.copy(null, null, null, i.left.remove(e, t), null));
      else {
        if (
          (i.left.isRed() && (i = i.rotateRight()),
          i.right.isEmpty() ||
            i.right.isRed() ||
            i.right.left.isRed() ||
            (i = i.moveRedRight()),
          0 === t(e, i.key))
        ) {
          if (i.right.isEmpty()) return Cr.EMPTY;
          (n = i.right.min()),
            (i = i.copy(n.key, n.value, null, null, i.right.removeMin()));
        }
        i = i.copy(null, null, null, null, i.right.remove(e, t));
      }
      return i.fixUp();
    }
    isRed() {
      return this.color;
    }
    fixUp() {
      let e = this;
      return (
        e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()),
        e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()),
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()),
        e
      );
    }
    moveRedLeft() {
      let e = this.colorFlip();
      return (
        e.right.left.isRed() &&
          ((e = e.copy(null, null, null, null, e.right.rotateRight())),
          (e = e.rotateLeft()),
          (e = e.colorFlip())),
        e
      );
    }
    moveRedRight() {
      let e = this.colorFlip();
      return (
        e.left.left.isRed() && ((e = e.rotateRight()), (e = e.colorFlip())), e
      );
    }
    rotateLeft() {
      const e = this.copy(null, null, Cr.RED, null, this.right.left);
      return this.right.copy(null, null, this.color, e, null);
    }
    rotateRight() {
      const e = this.copy(null, null, Cr.RED, this.left.right, null);
      return this.left.copy(null, null, this.color, null, e);
    }
    colorFlip() {
      const e = this.left.copy(null, null, !this.left.color, null, null),
        t = this.right.copy(null, null, !this.right.color, null, null);
      return this.copy(null, null, !this.color, e, t);
    }
    checkMaxDepth() {
      const e = this.check();
      return Math.pow(2, e) <= this.size + 1;
    }
    check() {
      if (this.isRed() && this.left.isRed()) throw ir();
      if (this.right.isRed()) throw ir();
      const e = this.left.check();
      if (e !== this.right.check()) throw ir();
      return e + (this.isRed() ? 0 : 1);
    }
  }
  (Cr.EMPTY = null),
    (Cr.RED = !0),
    (Cr.BLACK = !1),
    (Cr.EMPTY = new (class {
      constructor() {
        this.size = 0;
      }
      get key() {
        throw ir();
      }
      get value() {
        throw ir();
      }
      get color() {
        throw ir();
      }
      get left() {
        throw ir();
      }
      get right() {
        throw ir();
      }
      copy(e, t, n, i, r) {
        return this;
      }
      insert(e, t, n) {
        return new Cr(e, t);
      }
      remove(e, t) {
        return this;
      }
      isEmpty() {
        return !0;
      }
      inorderTraversal(e) {
        return !1;
      }
      reverseTraversal(e) {
        return !1;
      }
      minKey() {
        return null;
      }
      maxKey() {
        return null;
      }
      isRed() {
        return !1;
      }
      checkMaxDepth() {
        return !0;
      }
      check() {
        return 0;
      }
    })());
  class Ar {
    constructor(e) {
      (this.comparator = e), (this.data = new Sr(this.comparator));
    }
    has(e) {
      return null !== this.data.get(e);
    }
    first() {
      return this.data.minKey();
    }
    last() {
      return this.data.maxKey();
    }
    get size() {
      return this.data.size;
    }
    indexOf(e) {
      return this.data.indexOf(e);
    }
    forEach(e) {
      this.data.inorderTraversal((t, n) => (e(t), !1));
    }
    forEachInRange(e, t) {
      const n = this.data.getIteratorFrom(e[0]);
      for (; n.hasNext(); ) {
        const i = n.getNext();
        if (this.comparator(i.key, e[1]) >= 0) return;
        t(i.key);
      }
    }
    forEachWhile(e, t) {
      let n;
      for (
        n =
          void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator();
        n.hasNext();

      )
        if (!e(n.getNext().key)) return;
    }
    firstAfterOrEqual(e) {
      const t = this.data.getIteratorFrom(e);
      return t.hasNext() ? t.getNext().key : null;
    }
    getIterator() {
      return new Rr(this.data.getIterator());
    }
    getIteratorFrom(e) {
      return new Rr(this.data.getIteratorFrom(e));
    }
    add(e) {
      return this.copy(this.data.remove(e).insert(e, !0));
    }
    delete(e) {
      return this.has(e) ? this.copy(this.data.remove(e)) : this;
    }
    isEmpty() {
      return this.data.isEmpty();
    }
    unionWith(e) {
      let t = this;
      return (
        t.size < e.size && ((t = e), (e = this)),
        e.forEach((e) => {
          t = t.add(e);
        }),
        t
      );
    }
    isEqual(e) {
      if (!(e instanceof Ar)) return !1;
      if (this.size !== e.size) return !1;
      const t = this.data.getIterator(),
        n = e.data.getIterator();
      for (; t.hasNext(); ) {
        const e = t.getNext().key,
          i = n.getNext().key;
        if (0 !== this.comparator(e, i)) return !1;
      }
      return !0;
    }
    toArray() {
      const e = [];
      return (
        this.forEach((t) => {
          e.push(t);
        }),
        e
      );
    }
    toString() {
      const e = [];
      return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
    }
    copy(e) {
      const t = new Ar(this.comparator);
      return (t.data = e), t;
    }
  }
  class Rr {
    constructor(e) {
      this.iter = e;
    }
    getNext() {
      return this.iter.getNext().key;
    }
    hasNext() {
      return this.iter.hasNext();
    }
  }
  class Pr extends Error {
    constructor() {
      super(...arguments), (this.name = "Base64DecodeError");
    }
  }
  class Or {
    constructor(e) {
      this.binaryString = e;
    }
    static fromBase64String(e) {
      const t = (function (e) {
        try {
          return atob(e);
        } catch (e) {
          throw "undefined" != typeof DOMException && e instanceof DOMException
            ? new Pr("Invalid base64 string: " + e)
            : e;
        }
      })(e);
      return new Or(t);
    }
    static fromUint8Array(e) {
      const t = (function (e) {
        let t = "";
        for (let n = 0; n < e.length; ++n) t += String.fromCharCode(e[n]);
        return t;
      })(e);
      return new Or(t);
    }
    [Symbol.iterator]() {
      let e = 0;
      return {
        next: () =>
          e < this.binaryString.length
            ? { value: this.binaryString.charCodeAt(e++), done: !1 }
            : { value: void 0, done: !0 },
      };
    }
    toBase64() {
      return (e = this.binaryString), btoa(e);
      var e;
    }
    toUint8Array() {
      return (function (e) {
        const t = new Uint8Array(e.length);
        for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
        return t;
      })(this.binaryString);
    }
    approximateByteSize() {
      return 2 * this.binaryString.length;
    }
    compareTo(e) {
      return _r(this.binaryString, e.binaryString);
    }
    isEqual(e) {
      return this.binaryString === e.binaryString;
    }
  }
  Or.EMPTY_BYTE_STRING = new Or("");
  const Nr = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
  function Lr(e) {
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
  }
  class Dr {
    constructor(e, t, n, i, r, s, o, a, h) {
      (this.databaseId = e),
        (this.appId = t),
        (this.persistenceKey = n),
        (this.host = i),
        (this.ssl = r),
        (this.forceLongPolling = s),
        (this.autoDetectLongPolling = o),
        (this.longPollingOptions = a),
        (this.useFetchStreams = h);
    }
  }
  class Mr {
    constructor(e, t) {
      (this.projectId = e), (this.database = t || "(default)");
    }
    static empty() {
      return new Mr("", "");
    }
    get isDefaultDatabase() {
      return "(default)" === this.database;
    }
    isEqual(e) {
      return (
        e instanceof Mr &&
        e.projectId === this.projectId &&
        e.database === this.database
      );
    }
  }
  var Ur, xr, jr, Fr;
  new Sr(Er.comparator),
    new Sr(Er.comparator),
    new Sr(Er.comparator),
    new Ar(Er.comparator),
    new Ar(_r),
    ((xr = Ur || (Ur = {}))[(xr.OK = 0)] = "OK"),
    (xr[(xr.CANCELLED = 1)] = "CANCELLED"),
    (xr[(xr.UNKNOWN = 2)] = "UNKNOWN"),
    (xr[(xr.INVALID_ARGUMENT = 3)] = "INVALID_ARGUMENT"),
    (xr[(xr.DEADLINE_EXCEEDED = 4)] = "DEADLINE_EXCEEDED"),
    (xr[(xr.NOT_FOUND = 5)] = "NOT_FOUND"),
    (xr[(xr.ALREADY_EXISTS = 6)] = "ALREADY_EXISTS"),
    (xr[(xr.PERMISSION_DENIED = 7)] = "PERMISSION_DENIED"),
    (xr[(xr.UNAUTHENTICATED = 16)] = "UNAUTHENTICATED"),
    (xr[(xr.RESOURCE_EXHAUSTED = 8)] = "RESOURCE_EXHAUSTED"),
    (xr[(xr.FAILED_PRECONDITION = 9)] = "FAILED_PRECONDITION"),
    (xr[(xr.ABORTED = 10)] = "ABORTED"),
    (xr[(xr.OUT_OF_RANGE = 11)] = "OUT_OF_RANGE"),
    (xr[(xr.UNIMPLEMENTED = 12)] = "UNIMPLEMENTED"),
    (xr[(xr.INTERNAL = 13)] = "INTERNAL"),
    (xr[(xr.UNAVAILABLE = 14)] = "UNAVAILABLE"),
    (xr[(xr.DATA_LOSS = 15)] = "DATA_LOSS"),
    new Wi([4294967295, 4294967295], 0),
    Error;
  class Vr {
    constructor() {}
    Pt(e, t) {
      this.It(e, t), t.Tt();
    }
    It(e, t) {
      if ("nullValue" in e) this.Et(t, 5);
      else if ("booleanValue" in e)
        this.Et(t, 10), t.dt(e.booleanValue ? 1 : 0);
      else if ("integerValue" in e) this.Et(t, 15), t.dt(Lr(e.integerValue));
      else if ("doubleValue" in e) {
        const n = Lr(e.doubleValue);
        isNaN(n)
          ? this.Et(t, 13)
          : (this.Et(t, 15),
            (function (e) {
              return 0 === e && 1 / e == -1 / 0;
            })(n)
              ? t.dt(0)
              : t.dt(n));
      } else if ("timestampValue" in e) {
        let n = e.timestampValue;
        this.Et(t, 20),
          "string" == typeof n &&
            (n = (function (e) {
              if ((rr(!!e), "string" == typeof e)) {
                let t = 0;
                const n = Nr.exec(e);
                if ((rr(!!n), n[1])) {
                  let e = n[1];
                  (e = (e + "000000000").substr(0, 9)), (t = Number(e));
                }
                const i = new Date(e);
                return { seconds: Math.floor(i.getTime() / 1e3), nanos: t };
              }
              return { seconds: Lr(e.seconds), nanos: Lr(e.nanos) };
            })(n)),
          t.At(`${n.seconds || ""}`),
          t.dt(n.nanos || 0);
      } else if ("stringValue" in e) this.Rt(e.stringValue, t), this.Vt(t);
      else if ("bytesValue" in e)
        this.Et(t, 30),
          t.ft(
            (function (e) {
              return "string" == typeof e
                ? Or.fromBase64String(e)
                : Or.fromUint8Array(e);
            })(e.bytesValue)
          ),
          this.Vt(t);
      else if ("referenceValue" in e) this.gt(e.referenceValue, t);
      else if ("geoPointValue" in e) {
        const n = e.geoPointValue;
        this.Et(t, 45), t.dt(n.latitude || 0), t.dt(n.longitude || 0);
      } else
        "mapValue" in e
          ? (function (e) {
              return (
                "__max__" ===
                (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue
              );
            })(e)
            ? this.Et(t, Number.MAX_SAFE_INTEGER)
            : (this.yt(e.mapValue, t), this.Vt(t))
          : "arrayValue" in e
          ? (this.wt(e.arrayValue, t), this.Vt(t))
          : ir();
    }
    Rt(e, t) {
      this.Et(t, 25), this.St(e, t);
    }
    St(e, t) {
      t.At(e);
    }
    yt(e, t) {
      const n = e.fields || {};
      this.Et(t, 55);
      for (const e of Object.keys(n)) this.Rt(e, t), this.It(n[e], t);
    }
    wt(e, t) {
      const n = e.values || [];
      this.Et(t, 50);
      for (const e of n) this.It(e, t);
    }
    gt(e, t) {
      this.Et(t, 37),
        Er.fromName(e).path.forEach((e) => {
          this.Et(t, 60), this.St(e, t);
        });
    }
    Et(e, t) {
      e.dt(t);
    }
    Vt(e) {
      e.dt(2);
    }
  }
  (Vr.bt = new Vr()), new Uint8Array(0);
  class Br {
    constructor(e, t, n) {
      (this.cacheSizeCollectionThreshold = e),
        (this.percentileToCollect = t),
        (this.maximumSequenceNumbersToCollect = n);
    }
    static withCacheSize(e) {
      return new Br(
        e,
        Br.DEFAULT_COLLECTION_PERCENTILE,
        Br.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
      );
    }
  }
  function Hr() {
    return "undefined" != typeof document ? document : null;
  }
  (Br.DEFAULT_COLLECTION_PERCENTILE = 10),
    (Br.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
    (Br.DEFAULT = new Br(
      41943040,
      Br.DEFAULT_COLLECTION_PERCENTILE,
      Br.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
    )),
    (Br.DISABLED = new Br(-1, 0, 0));
  class zr {
    constructor(e, t, n = 1e3, i = 1.5, r = 6e4) {
      (this.oi = e),
        (this.timerId = t),
        (this.No = n),
        (this.Lo = i),
        (this.Bo = r),
        (this.ko = 0),
        (this.qo = null),
        (this.Qo = Date.now()),
        this.reset();
    }
    reset() {
      this.ko = 0;
    }
    Ko() {
      this.ko = this.Bo;
    }
    $o(e) {
      this.cancel();
      const t = Math.floor(this.ko + this.Uo()),
        n = Math.max(0, Date.now() - this.Qo),
        i = Math.max(0, t - n);
      i > 0 &&
        er(
          "ExponentialBackoff",
          `Backing off for ${i} ms (base delay: ${this.ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`
        ),
        (this.qo = this.oi.enqueueAfterDelay(
          this.timerId,
          i,
          () => ((this.Qo = Date.now()), e())
        )),
        (this.ko *= this.Lo),
        this.ko < this.No && (this.ko = this.No),
        this.ko > this.Bo && (this.ko = this.Bo);
    }
    Wo() {
      null !== this.qo && (this.qo.skipDelay(), (this.qo = null));
    }
    cancel() {
      null !== this.qo && (this.qo.cancel(), (this.qo = null));
    }
    Uo() {
      return (Math.random() - 0.5) * this.ko;
    }
  }
  class $r {
    constructor(e, t, n, i, r) {
      (this.asyncQueue = e),
        (this.timerId = t),
        (this.targetTimeMs = n),
        (this.op = i),
        (this.removalCallback = r),
        (this.deferred = new lr()),
        (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
        this.deferred.promise.catch((e) => {});
    }
    get promise() {
      return this.deferred.promise;
    }
    static createAndSchedule(e, t, n, i, r) {
      const s = Date.now() + n,
        o = new $r(e, t, s, i, r);
      return o.start(n), o;
    }
    start(e) {
      this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
    }
    skipDelay() {
      return this.handleDelayElapsed();
    }
    cancel(e) {
      null !== this.timerHandle &&
        (this.clearTimeout(),
        this.deferred.reject(
          new cr(sr, "Operation cancelled" + (e ? ": " + e : ""))
        ));
    }
    handleDelayElapsed() {
      this.asyncQueue.enqueueAndForget(() =>
        null !== this.timerHandle
          ? (this.clearTimeout(),
            this.op().then((e) => this.deferred.resolve(e)))
          : Promise.resolve()
      );
    }
    clearTimeout() {
      null !== this.timerHandle &&
        (this.removalCallback(this),
        clearTimeout(this.timerHandle),
        (this.timerHandle = null));
    }
  }
  ((Fr = jr || (jr = {})).J_ = "default"), (Fr.Cache = "cache");
  class Wr {
    constructor(e, t, n, i) {
      (this.authCredentials = e),
        (this.appCheckCredentials = t),
        (this.asyncQueue = n),
        (this.databaseInfo = i),
        (this.user = Yi.UNAUTHENTICATED),
        (this.clientId = wr.newId()),
        (this.authCredentialListener = () => Promise.resolve()),
        (this.appCheckCredentialListener = () => Promise.resolve()),
        this.authCredentials.start(n, async (e) => {
          er("FirestoreClient", "Received user=", e.uid),
            await this.authCredentialListener(e),
            (this.user = e);
        }),
        this.appCheckCredentials.start(
          n,
          (e) => (
            er("FirestoreClient", "Received new app check token=", e),
            this.appCheckCredentialListener(e, this.user)
          )
        );
    }
    get configuration() {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100,
      };
    }
    setCredentialChangeListener(e) {
      this.authCredentialListener = e;
    }
    setAppCheckTokenChangeListener(e) {
      this.appCheckCredentialListener = e;
    }
    verifyNotTerminated() {
      if (this.asyncQueue.isShuttingDown)
        throw new cr(ar, "The client has already been terminated.");
    }
    terminate() {
      this.asyncQueue.enterRestrictedMode();
      const e = new lr();
      return (
        this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
          try {
            this._onlineComponents &&
              (await this._onlineComponents.terminate()),
              this._offlineComponents &&
                (await this._offlineComponents.terminate()),
              this.authCredentials.shutdown(),
              this.appCheckCredentials.shutdown(),
              e.resolve();
          } catch (t) {
            const n = (function (e, t) {
              if ((tr("AsyncQueue", `${t}: ${e}`), Tr(e)))
                return new cr(hr, `${t}: ${e}`);
              throw e;
            })(t, "Failed to shutdown persistence");
            e.reject(n);
          }
        }),
        e.promise
      );
    }
  }
  function Kr(e) {
    const t = {};
    return (
      void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t
    );
  }
  const qr = new Map();
  class Gr {
    constructor(e) {
      var t, n;
      if (void 0 === e.host) {
        if (void 0 !== e.ssl)
          throw new cr(
            or,
            "Can't provide ssl option if host option is not set"
          );
        (this.host = "firestore.googleapis.com"), (this.ssl = !0);
      } else
        (this.host = e.host),
          (this.ssl = null === (t = e.ssl) || void 0 === t || t);
      if (
        ((this.credentials = e.credentials),
        (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties),
        (this.localCache = e.localCache),
        void 0 === e.cacheSizeBytes)
      )
        this.cacheSizeBytes = 41943040;
      else {
        if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576)
          throw new cr(or, "cacheSizeBytes must be at least 1048576");
        this.cacheSizeBytes = e.cacheSizeBytes;
      }
      (function (e, t, n, i) {
        if (!0 === t && !0 === i)
          throw new cr(
            or,
            "experimentalForceLongPolling and experimentalAutoDetectLongPolling cannot be used together."
          );
      })(
        0,
        e.experimentalForceLongPolling,
        0,
        e.experimentalAutoDetectLongPolling
      ),
        (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling),
        this.experimentalForceLongPolling
          ? (this.experimentalAutoDetectLongPolling = !1)
          : void 0 === e.experimentalAutoDetectLongPolling
          ? (this.experimentalAutoDetectLongPolling = !0)
          : (this.experimentalAutoDetectLongPolling =
              !!e.experimentalAutoDetectLongPolling),
        (this.experimentalLongPollingOptions = Kr(
          null !== (n = e.experimentalLongPollingOptions) && void 0 !== n
            ? n
            : {}
        )),
        (function (e) {
          if (void 0 !== e.timeoutSeconds) {
            if (isNaN(e.timeoutSeconds))
              throw new cr(
                or,
                `invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`
              );
            if (e.timeoutSeconds < 5)
              throw new cr(
                or,
                `invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`
              );
            if (e.timeoutSeconds > 30)
              throw new cr(
                or,
                `invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`
              );
          }
        })(this.experimentalLongPollingOptions),
        (this.useFetchStreams = !!e.useFetchStreams);
    }
    isEqual(e) {
      return (
        this.host === e.host &&
        this.ssl === e.ssl &&
        this.credentials === e.credentials &&
        this.cacheSizeBytes === e.cacheSizeBytes &&
        this.experimentalForceLongPolling === e.experimentalForceLongPolling &&
        this.experimentalAutoDetectLongPolling ===
          e.experimentalAutoDetectLongPolling &&
        (function (e, t) {
          return e.timeoutSeconds === t.timeoutSeconds;
        })(
          this.experimentalLongPollingOptions,
          e.experimentalLongPollingOptions
        ) &&
        this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
        this.useFetchStreams === e.useFetchStreams
      );
    }
  }
  class Jr {
    constructor(e, t, n, i) {
      (this._authCredentials = e),
        (this._appCheckCredentials = t),
        (this._databaseId = n),
        (this._app = i),
        (this.type = "firestore-lite"),
        (this._persistenceKey = "(lite)"),
        (this._settings = new Gr({})),
        (this._settingsFrozen = !1);
    }
    get app() {
      if (!this._app)
        throw new cr(
          ar,
          "Firestore was not initialized using the Firebase SDK. 'app' is not available"
        );
      return this._app;
    }
    get _initialized() {
      return this._settingsFrozen;
    }
    get _terminated() {
      return void 0 !== this._terminateTask;
    }
    _setSettings(e) {
      if (this._settingsFrozen)
        throw new cr(
          ar,
          "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object."
        );
      (this._settings = new Gr(e)),
        void 0 !== e.credentials &&
          (this._authCredentials = (function (e) {
            if (!e) return new dr();
            switch (e.type) {
              case "firstParty":
                return new gr(
                  e.sessionIndex || "0",
                  e.iamToken || null,
                  e.authTokenFactory || null
                );
              case "provider":
                return e.client;
              default:
                throw new cr(
                  or,
                  "makeAuthCredentialsProvider failed due to invalid credential type"
                );
            }
          })(e.credentials));
    }
    _getSettings() {
      return this._settings;
    }
    _freezeSettings() {
      return (this._settingsFrozen = !0), this._settings;
    }
    _delete() {
      return (
        this._terminateTask || (this._terminateTask = this._terminate()),
        this._terminateTask
      );
    }
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings,
      };
    }
    _terminate() {
      return (
        (function (e) {
          const t = qr.get(e);
          t &&
            (er("ComponentProvider", "Removing Datastore"),
            qr.delete(e),
            t.terminate());
        })(this),
        Promise.resolve()
      );
    }
  }
  class Xr {
    constructor() {
      (this.iu = Promise.resolve()),
        (this.su = []),
        (this.ou = !1),
        (this._u = []),
        (this.au = null),
        (this.uu = !1),
        (this.cu = !1),
        (this.lu = []),
        (this.Yo = new zr(this, "async_queue_retry")),
        (this.hu = () => {
          const e = Hr();
          e &&
            er(
              "AsyncQueue",
              "Visibility state changed to " + e.visibilityState
            ),
            this.Yo.Wo();
        });
      const e = Hr();
      e &&
        "function" == typeof e.addEventListener &&
        e.addEventListener("visibilitychange", this.hu);
    }
    get isShuttingDown() {
      return this.ou;
    }
    enqueueAndForget(e) {
      this.enqueue(e);
    }
    enqueueAndForgetEvenWhileRestricted(e) {
      this.Pu(), this.Iu(e);
    }
    enterRestrictedMode(e) {
      if (!this.ou) {
        (this.ou = !0), (this.cu = e || !1);
        const t = Hr();
        t &&
          "function" == typeof t.removeEventListener &&
          t.removeEventListener("visibilitychange", this.hu);
      }
    }
    enqueue(e) {
      if ((this.Pu(), this.ou)) return new Promise(() => {});
      const t = new lr();
      return this.Iu(() =>
        this.ou && this.cu
          ? Promise.resolve()
          : (e().then(t.resolve, t.reject), t.promise)
      ).then(() => t.promise);
    }
    enqueueRetryable(e) {
      this.enqueueAndForget(() => (this.su.push(e), this.Tu()));
    }
    async Tu() {
      if (0 !== this.su.length) {
        try {
          await this.su[0](), this.su.shift(), this.Yo.reset();
        } catch (e) {
          if (!Tr(e)) throw e;
          er("AsyncQueue", "Operation failed with retryable error: " + e);
        }
        this.su.length > 0 && this.Yo.$o(() => this.Tu());
      }
    }
    Iu(e) {
      const t = this.iu.then(
        () => (
          (this.uu = !0),
          e()
            .catch((e) => {
              (this.au = e), (this.uu = !1);
              const t = (function (e) {
                let t = e.message || "";
                return (
                  e.stack &&
                    (t = e.stack.includes(e.message)
                      ? e.stack
                      : e.message + "\n" + e.stack),
                  t
                );
              })(e);
              throw (tr("INTERNAL UNHANDLED ERROR: ", t), e);
            })
            .then((e) => ((this.uu = !1), e))
        )
      );
      return (this.iu = t), t;
    }
    enqueueAfterDelay(e, t, n) {
      this.Pu(), this.lu.indexOf(e) > -1 && (t = 0);
      const i = $r.createAndSchedule(this, e, t, n, (e) => this.Eu(e));
      return this._u.push(i), i;
    }
    Pu() {
      this.au && ir();
    }
    verifyOperationInProgress() {}
    async du() {
      let e;
      do {
        (e = this.iu), await e;
      } while (e !== this.iu);
    }
    Au(e) {
      for (const t of this._u) if (t.timerId === e) return !0;
      return !1;
    }
    Ru(e) {
      return this.du().then(() => {
        this._u.sort((e, t) => e.targetTimeMs - t.targetTimeMs);
        for (const t of this._u)
          if ((t.skipDelay(), "all" !== e && t.timerId === e)) break;
        return this.du();
      });
    }
    Vu(e) {
      this.lu.push(e);
    }
    Eu(e) {
      const t = this._u.indexOf(e);
      this._u.splice(t, 1);
    }
  }
  class Yr extends Jr {
    constructor(e, t, n, i) {
      super(e, t, n, i),
        (this.type = "firestore"),
        (this._queue = new Xr()),
        (this._persistenceKey = (null == i ? void 0 : i.name) || "[DEFAULT]");
    }
    _terminate() {
      return (
        this._firestoreClient ||
          (function (e) {
            var t, n, i;
            const r = e._freezeSettings(),
              s = (function (e, t, n, i) {
                return new Dr(
                  e,
                  t,
                  n,
                  i.host,
                  i.ssl,
                  i.experimentalForceLongPolling,
                  i.experimentalAutoDetectLongPolling,
                  Kr(i.experimentalLongPollingOptions),
                  i.useFetchStreams
                );
              })(
                e._databaseId,
                (null === (t = e._app) || void 0 === t
                  ? void 0
                  : t.options.appId) || "",
                e._persistenceKey,
                r
              );
            (e._firestoreClient = new Wr(
              e._authCredentials,
              e._appCheckCredentials,
              e._queue,
              s
            )),
              (null === (n = r.localCache) || void 0 === n
                ? void 0
                : n._offlineComponentProvider) &&
                (null === (i = r.localCache) || void 0 === i
                  ? void 0
                  : i._onlineComponentProvider) &&
                (e._firestoreClient._uninitializedComponentsProvider = {
                  _offlineKind: r.localCache.kind,
                  _offline: r.localCache._offlineComponentProvider,
                  _online: r.localCache._onlineComponentProvider,
                });
          })(this),
        this._firestoreClient.terminate()
      );
    }
  }
  new RegExp("[~\\*/\\[\\]]"),
    new WeakMap(),
    (function (e, t = !0) {
      !(function (e) {
        Qi = e;
      })(Ue),
        Oe(
          new I(
            "firestore",
            (e, { instanceIdentifier: n, options: i }) => {
              const r = e.getProvider("app").getImmediate(),
                s = new Yr(
                  new pr(e.getProvider("auth-internal")),
                  new vr(e.getProvider("app-check-internal")),
                  (function (e, t) {
                    if (
                      !Object.prototype.hasOwnProperty.apply(e.options, [
                        "projectId",
                      ])
                    )
                      throw new cr(
                        or,
                        '"projectId" not provided in firebase.initializeApp.'
                      );
                    return new Mr(e.options.projectId, t);
                  })(r, n),
                  r
                );
              return (
                (i = Object.assign({ useFetchStreams: t }, i)),
                s._setSettings(i),
                s
              );
            },
            "PUBLIC"
          ).setMultipleInstances(!0)
        ),
        je(Xi, "4.6.2", e),
        je(Xi, "4.6.2", "esm2017");
    })();
  !(function (e, t, n, i) {
    b(e).onAuthStateChanged(
      (e) => {
        (e /= null) ? console.log("logged in") : console.log("no user");
      },
      void 0,
      void 0
    );
  })(
    (function (
      e = (function (e = Se) {
        const t = Ce.get(e);
        if (!t && e === Se && a()) return xe();
        if (!t) throw De.create("no-app", { appName: e });
        return t;
      })()
    ) {
      const t = Ne(e, "auth");
      if (t.isInitialized()) return t.getImmediate();
      const n = (function (e, t) {
          const n = Ne(e, "auth");
          if (n.isInitialized()) {
            const e = n.getImmediate();
            if (f(n.getOptions(), null != t ? t : {})) return e;
            tt(e, "already-initialized");
          }
          return n.initialize({ options: t });
        })(e, { popupRedirectResolver: ji, persistence: [ii, Vn, Hn] }),
        i = h("authTokenSyncURL");
      if (i && "boolean" == typeof isSecureContext && isSecureContext) {
        const e = new URL(i, location.origin);
        if (location.origin === e.origin) {
          const t =
            ((r = e.toString()),
            async (e) => {
              const t = e && (await e.getIdTokenResult()),
                n =
                  t &&
                  (new Date().getTime() - Date.parse(t.issuedAtTime)) / 1e3;
              if (n && n > Hi) return;
              const i = null == t ? void 0 : t.token;
              zi !== i &&
                ((zi = i),
                await fetch(r, {
                  method: i ? "POST" : "DELETE",
                  headers: i ? { Authorization: `Bearer ${i}` } : {},
                }));
            });
          !(function (e, t, n) {
            b(e).beforeAuthStateChanged(t, n);
          })(n, t, () => t(n.currentUser)),
            (function (e, n, i, r) {
              b(e).onIdTokenChanged((e) => t(e), void 0, void 0);
            })(n);
        }
      }
      var r;
      const s =
        ((c = "auth"),
        null ===
          (u = null === (l = o()) || void 0 === l ? void 0 : l.emulatorHosts) ||
        void 0 === u
          ? void 0
          : u[c]);
      var c, l, u;
      return (
        s &&
          (function (e, t, n) {
            const i = an(e);
            ot(i._canInitEmulator, i, "emulator-config-failed"),
              ot(/^https?:\/\//.test(t), i, "invalid-emulator-scheme");
            const r = !!(null == n ? void 0 : n.disableWarnings),
              s = gn(t),
              { host: o, port: a } = (function (e) {
                const t = gn(e),
                  n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
                if (!n) return { host: "", port: null };
                const i = n[2].split("@").pop() || "",
                  r = /^(\[[^\]]+\])(:|$)/.exec(i);
                if (r) {
                  const e = r[1];
                  return { host: e, port: mn(i.substr(e.length + 1)) };
                }
                {
                  const [e, t] = i.split(":");
                  return { host: e, port: mn(t) };
                }
              })(t),
              h = null === a ? "" : `:${a}`;
            (i.config.emulator = { url: `${s}//${o}${h}/` }),
              (i.settings.appVerificationDisabledForTesting = !0),
              (i.emulatorConfig = Object.freeze({
                host: o,
                port: a,
                protocol: s.replace(":", ""),
                options: Object.freeze({ disableWarnings: r }),
              })),
              r ||
                (function () {
                  function e() {
                    const e = document.createElement("p"),
                      t = e.style;
                    (e.innerText =
                      "Running in emulator mode. Do not use with production credentials."),
                      (t.position = "fixed"),
                      (t.width = "100%"),
                      (t.backgroundColor = "#ffffff"),
                      (t.border = ".1em solid #000000"),
                      (t.color = "#b50000"),
                      (t.bottom = "0px"),
                      (t.left = "0px"),
                      (t.margin = "0px"),
                      (t.zIndex = "10000"),
                      (t.textAlign = "center"),
                      e.classList.add("firebase-emulator-warning"),
                      document.body.appendChild(e);
                  }
                  "undefined" != typeof console &&
                    "function" == typeof console.info &&
                    console.info(
                      "WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."
                    ),
                    "undefined" != typeof window &&
                      "undefined" != typeof document &&
                      ("loading" === document.readyState
                        ? window.addEventListener("DOMContentLoaded", e)
                        : e());
                })();
          })(n, `http://${s}`),
        n
      );
    })(
      xe({
        apiKey: "AIzaSyAr8KSrBj9PXEEr8o57Jt9WKlUyP_2yBUo",
        authDomain: "test-main-2af39.firebaseapp.com",
        projectId: "test-main-2af39",
        storageBucket: "test-main-2af39.appspot.com",
        messagingSenderId: "437571830257",
        appId: "1:437571830257:web:b9ccf489ab19c558ba8450",
      })
    )
  );
})();
