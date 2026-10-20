"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/jszip/dist/jszip.min.js
  var require_jszip_min = __commonJS({
    "node_modules/jszip/dist/jszip.min.js"(exports, module) {
      !(function(e) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
          ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
        }
      })(function() {
        return (function s(a, o, h) {
          function u(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = "function" == typeof __require && __require;
                if (!e2 && t) return t(r, true);
                if (l) return l(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r].exports;
          }
          for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++) u(h[e]);
          return u;
        })({ 1: [function(e, t, r) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r.encode = function(e2) {
            for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r.decode = function(e2) {
            var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r2, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r2) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
          "use strict";
          var n = e("./utils");
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2) {
            return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r) {
          "use strict";
          r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
        }, {}], 6: [function(e, t, r) {
          "use strict";
          var n = null;
          n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
          "use strict";
          function A(e2, t2) {
            var r2, n2 = "";
            for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r2, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
              var r3 = e3;
              return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
            })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
              return 63 & (e3 || 0);
            })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r2, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r2.fileRecord, meta: { percent: 0 } });
            } else this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
              return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
            })(e2), meta: { percent: 100 } });
            else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
            })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2)) return false;
            for (var r2 = 0; r2 < t2.length; r2++) try {
              t2[r2].error(e2);
            } catch (e3) {
            }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r2 = (function(e4, t4) {
                  var r3 = e4 || t4, n3 = u[r3];
                  if (!n3) throw new Error(r3 + " is not a valid compression method !");
                  return n3;
                })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
          "use strict";
          function n() {
            if (!(this instanceof n)) return new n();
            if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.2", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r2 = n2.decompressed.getContentWorker().pipe(new a());
              r2.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
              if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
                var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r2) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
          "use strict";
          t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
            if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc) return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
          } };
        }, {}], 15: [function(e, t, r) {
          "use strict";
          function s(e2, t2, r2) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
            s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
            r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return "/" !== e2.slice(-1) && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return "[object RegExp]" === Object.prototype.toString.call(e2);
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r2, n2;
            for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
          }, filter: function(r2) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r2(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r2) {
            if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r2) {
            if (!r2) return this;
            if (h(r2)) return this.filter(function(e3, t3) {
              return t3.dir && r2.test(e3);
            });
            var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r2) {
            r2 = this.root + r2;
            var e2 = this.files[r2];
            if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
            else for (var t2 = this.filter(function(e3, t3) {
              return t3.name.slice(0, r2.length) === r2;
            }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r2 = {};
            try {
              if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
              u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
              var n2 = r2.comment || this.comment || "";
              t2 = o.generateWorker(this, r2, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r2.type || "string", r2.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
          "use strict";
          var n = e("../utils");
          function i(e2) {
            this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
          }
          i.prototype = { checkOffset: function(e2) {
            this.checkIndex(this.index + e2);
          }, checkIndex: function(e2) {
            if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
          }, setIndex: function(e2) {
            this.checkIndex(e2), this.index = e2;
          }, skip: function(e2) {
            this.setIndex(this.index + e2);
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r2 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
            return this.index += e2, r2;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
          "use strict";
          r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished) return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max) return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
            this.emit("data", e2);
          }, end: function() {
            if (this.isFinished) return false;
            this.flush();
            try {
              this.emit("end"), this.cleanUp(), this.isFinished = true;
            } catch (e2) {
              this.emit("error", e2);
            }
            return true;
          }, error: function(e2) {
            return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, pause: function() {
            return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
          }, resume: function() {
            if (!this.isPaused || this.isFinished) return false;
            var e2 = this.isPaused = false;
            return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
          }, flush: function() {
          }, processChunk: function(e2) {
            this.push(e2);
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream) try {
            o = e("../nodejs/NodejsStreamOutputAdapter");
          } catch (e2) {
          }
          function l(e2, o2) {
            return new a.Promise(function(t2, r2) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r2(e3);
              }).on("end", function() {
                try {
                  var e3 = (function(e4, t3, r3) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  })(s2, (function(e4, t3) {
                    var r3, n3 = 0, i3 = null, s3 = 0;
                    for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  })(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r2(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r2) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r2 = this;
            return "data" === e2 ? this._worker.on(e2, function(e3) {
              t2.call(r2, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r2);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
          "use strict";
          if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
              } catch (e3) {
                r.blob = false;
              }
            }
          }
          try {
            r.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
              return t2;
            })(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
              else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
              else {
                for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
                1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
              }
              return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
            })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r2 = t2;
                (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
              } else t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = (function(e3, t3) {
              var r3;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
              return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
            })(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r2) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r2 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r2);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r2) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r2) return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
            return t2;
          }, applyCanBeUsed: { uint8array: (function() {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e2) {
              return false;
            }
          })(), nodebuffer: (function() {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (e2) {
              return false;
            }
          })() } };
          function s(e2) {
            var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
            if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2) return t2;
            a.checkSupport(e2);
            var r2 = a.getTypeOf(t2);
            return c[r2][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
            }
            return r2.join("/");
          }, a.getTypeOf = function(e2) {
            if ("string" == typeof e2) return "string";
            var t2 = Object.prototype.toString.call(e2);
            return "[object Array]" === t2 ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && "[object Uint8Array]" === t2 ? "uint8array" : o.arraybuffer && "[object ArrayBuffer]" === t2 ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r2, n2 = "";
            for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r2) {
            setImmediate(function() {
              e2.apply(r2 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r2() {
            }
            r2.prototype = t2.prototype, e2.prototype = new r2();
          }, a.extend = function() {
            var e2, t2, r2 = {};
            for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
            return r2;
          }, a.prepareContent = function(r2, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) ? void 0 !== Blob.prototype.arrayBuffer ? n3.arrayBuffer() : "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r3(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : u.Promise.reject(new Error(r2 + " is a Blob, but we have no way of reading it.")) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r2 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r2), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r2);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r2 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r2;
            if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return 1 == (1 & this.bitFlag);
          }, useUTF8: function() {
            return 2048 == (2048 & this.bitFlag);
          }, readLocalPart: function(e2) {
            var t2, r2;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if (null === (t2 = (function(e3) {
              for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
              return null;
            })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (null !== t2) this.fileNameStr = t2;
              else {
                var r2 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r2);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (null !== n2) this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
          "use strict";
          function n(e2, t2, r2) {
            this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r2 = "string";
            try {
              if (!e2) throw new Error("No output type specified.");
              var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
              "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r2, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
            var r2 = this._decompressWorker();
            return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
              var e3 = t2.document.createElement("script");
              e3.onreadystatechange = function() {
                u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
              }, t2.document.documentElement.appendChild(e3);
            } : function() {
              setTimeout(u, 0);
            };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r2 = h.length; r2; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
                r2 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              1 !== h.push(e3) || n || r();
            };
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}], 37: [function(e, t, r) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if ("function" != typeof e2) throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r2) {
            this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r2, n2) {
            i(function() {
              var e2;
              try {
                e2 = r2(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
              t2.apply(e2, arguments);
            };
          }
          function d(t2, e2) {
            var r2 = false;
            function n2(e3) {
              r2 || (r2 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r2 || (r2 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            "error" === s2.status && n2(s2.value);
          }
          function p(e2, t2) {
            var r2 = {};
            try {
              r2.value = e2(t2), r2.status = "success";
            } catch (e3) {
              r2.status = "error", r2.value = e3;
            }
            return r2;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if ("function" != typeof t2) return this;
            var r2 = this.constructor;
            return this.then(function(e2) {
              return r2.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r2.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
            var r2 = new this.constructor(u);
            this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
            return r2;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r2 = p(c, t2);
            if ("error" === r2.status) return l.reject(e2, r2.value);
            var n2 = r2.value;
            if (n2) d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this) return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2) return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; ) h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r2.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var r2 = e2.length, n2 = false;
            if (!r2) return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
              n2 || (n2 = true, l.resolve(s2, e3));
            }, function(e3) {
              n2 || (n2 = true, l.reject(s2, e3));
            });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p)) return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r2 !== l) throw new Error(i[r2]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r2 = new p(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
            return r2.result;
          }
          p.prototype.push = function(e2, t2) {
            var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
              0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
            return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a)) return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r2 = c.inflateInit2(this.strm, t2.windowBits);
            if (r2 !== m.Z_OK) throw new Error(n[r2]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r2 = new a(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
            return r2.result;
          }
          a.prototype.push = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
              h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
            } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
            return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
          r.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r2 = t2.shift();
              if (r2) {
                if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
                for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
              }
            }
            return e2;
          }, r.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r2, n2, i2) {
            if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
            else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            var t2, r2, n2, i2, s2, a;
            for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r.setTyped = function(e2) {
            e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
          }, r.setTyped(n);
        }, {}], 42: [function(e, t, r) {
          "use strict";
          var h = e("./common"), i = true, s = true;
          try {
            String.fromCharCode.apply(null, [0]);
          } catch (e2) {
            i = false;
          }
          try {
            String.fromCharCode.apply(null, new Uint8Array(1));
          } catch (e2) {
            s = false;
          }
          for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
            return r2;
          }
          u[254] = u[254] = 1, r.string2buf = function(e2) {
            var t2, r2, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          }, r.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
            return t2;
          }, r.buf2string = function(e2, t2) {
            var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
            else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
            else {
              for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
              1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
            }
            return l(o, n2);
          }, r.utf8border = function(e2, t2) {
            var r2;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
            return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2, r2, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
              for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r) {
          "use strict";
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2, r2, n) {
            var i = o, s = n + r2;
            e2 ^= -1;
            for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          function F(e2) {
            var t2 = e2.state, r2 = t2.pending;
            r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
                s2 += 2, r2++;
                do {
                } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                i2 += f2;
              }
              if (0 === e2.strm.avail_in) break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
            } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
          }
          function Z(e2, t2) {
            for (var r2, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
                e2.strstart++;
              } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function W(e2, t2) {
            for (var r2, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
              } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function M(e2, t2, r2, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && (function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            })(e2.state), t2;
          }
          function Y(e2, t2, r2, n2, i2, s2) {
            if (!e2) return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
            8 === n2 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r2 = 65535;
            for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), 0 === e2.lookahead && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r2;
              if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
          }, r.deflate = function(e2, t2) {
            var r2, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
            if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
            else {
              var a2 = v + (n2.w_bits - 8 << 4) << 8;
              a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
            }
            if (69 === n2.status) if (n2.gzhead.extra) {
              for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
            } else n2.status = 73;
            if (73 === n2.status) if (n2.gzhead.name) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
            } else n2.status = 91;
            if (91 === n2.status) if (n2.gzhead.comment) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
            } else n2.status = 103;
            if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
              if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
            } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
            if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
            if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
              var o2 = 2 === n2.strategy ? (function(e3, t3) {
                for (var r3; ; ) {
                  if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                    if (t3 === l) return A;
                    break;
                  }
                  if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
                for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l) return A;
                    if (0 === e3.lookahead) break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
              if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
          }, r.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r.deflateSetDictionary = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state) return _;
            if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
            for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
              for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
              r2.strstart = n2, r2.lookahead = x - 1, j(r2);
            }
            return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
          }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2) {
            var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
            e: do {
              p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
              t: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                  r: for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                      if (0 == (64 & y)) {
                        v = _[(65535 & v) + (d & (1 << y) - 1)];
                        continue r;
                      }
                      e2.msg = "invalid distance code", r2.mode = 30;
                      break e;
                    }
                    if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (d >>>= y, p -= y, (y = s - a) < k) {
                      if (l < (y = k - y) && r2.sane) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (S = c, (x = 0) === f) {
                        if (x += u - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      } else if (f < y) {
                        if (x += u + f - y, (y -= f) < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          if (x = 0, f < w) {
                            for (w -= y = f; C[s++] = c[x++], --y; ) ;
                            x = s - k, S = C;
                          }
                        }
                      } else if (x += f - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                      for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                      w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                    } else {
                      for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                      w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                    }
                    break;
                  }
                }
                break;
              }
            } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
          };
        }, {}], 49: [function(e, t, r) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r2, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r2, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
              for (; t2 < 256; ) e2.lens[t2++] = 9;
              for (; t2 < 280; ) e2.lens[t2++] = 7;
              for (; t2 < 288; ) e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
              T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r2, n2) {
            var i2, s2 = e2.state;
            return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
            return u(e2, 15);
          }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
            12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
            e: for (; ; ) switch (r2.mode) {
              case P:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2) break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2) break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; ) r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode) break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2) break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h2) {
                  e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h2) break e;
                if (d = c2 - h2, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else m = i2, p = a2 - r2.offset, d = r2.length;
                for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h2) break e;
                i2[a2++] = r2.length, h2--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
          }, r.inflateEnd = function(e2) {
            if (!e2 || !e2.state) return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r.inflateGetHeader = function(e2, t2) {
            var r2;
            return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
          }, r.inflateSetDictionary = function(e2, t2) {
            var r2, n2 = t2.length;
            return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
          }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
          "use strict";
          var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r2, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++) O[b] = 0;
            for (v = 0; v < n; v++) O[t2[r2 + v]]++;
            for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
            if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && 0 === O[y]; y++) ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
            if (0 < z && (0 === e2 || 1 !== w)) return -1;
            for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
            if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
              for (h = 1 << b - 1; E & h; ) h >>= 1;
              if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                if (b === w) break;
                b = t2[r2 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
                if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r2, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r2) {
            e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
          }
          function L(e2, t2, r2) {
            P(e2, r2[2 * t2], r2[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
            return r2 >>> 1;
          }
          function Z(e2, t2, r2) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r2, n2) {
            var i2 = 2 * t2, s2 = 2 * r2;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
          }
          function G(e2, t2, r2) {
            for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
            e2.heap[r2] = n2;
          }
          function K(e2, t2, r2) {
            var n2, i2, s2, a2, o2 = 0;
            if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
            for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
            for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
            e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
              var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (0 !== m2) {
                do {
                  for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            })(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
              if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
              else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
              s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
            }
          }
          n(T);
          var q = false;
          function J(e2, t2, r2, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
            })(e2, t2, r2, true);
          }
          r._tr_init = function(e2) {
            q || ((function() {
              var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
              for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
              for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
              for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            })(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
              var t3, r3 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
              if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
              for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
              return o;
            })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
            })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r._tr_tally = function(e2, t2, r2) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), (function(e3) {
              16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            })(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r) {
          (function(e2) {
            !(function(r2, n) {
              "use strict";
              if (!r2.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
                e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : (function() {
                  if (r2.postMessage && !r2.importScripts) {
                    var e4 = true, t3 = r2.onmessage;
                    return r2.onmessage = function() {
                      e4 = false;
                    }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                  }
                })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                  r2.postMessage(a + e4, "*");
                }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  "function" != typeof e4 && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u) setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !(function(e5) {
                        var t4 = e5.callback, r3 = e5.args;
                        switch (r3.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r3[0]);
                            break;
                          case 2:
                            t4(r3[0], r3[1]);
                            break;
                          case 3:
                            t4(r3[0], r3[1], r3[2]);
                            break;
                          default:
                            t4.apply(n, r3);
                        }
                      })(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
              }
            })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // src/renderer/app.ts
  var import_jszip = __toESM(require_jszip_min());

  // src/engine/presets.ts
  var DISPLAY_PRESETS = [
    {
      id: "st7789_240x240",
      name: "ST7789 (240x240)",
      category: "ST7789",
      width: 240,
      height: 240,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "square",
      description: 'Standard 1.3" / 1.54" IPS LCD for ESP32 / Arduino'
    },
    {
      id: "st7789_240x320",
      name: "ST7789 (240x320)",
      category: "ST7789",
      width: 240,
      height: 320,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: 'Common 2.0" / 2.4" / 2.8" SPI IPS Display'
    },
    {
      id: "st7789_135x240",
      name: "ST7789 TTGO T-Display (135x240)",
      category: "ST7789",
      width: 135,
      height: 240,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: 'LilyGO TTGO T-Display ESP32 1.14" LCD'
    },
    {
      id: "st7789_172x320",
      name: "ST7789 (172x320)",
      category: "ST7789",
      width: 172,
      height: 320,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: '1.47" elongated display for smartbands / ESP32'
    },
    {
      id: "st7789_170x320",
      name: "ST7789 (170x320)",
      category: "ST7789",
      width: 170,
      height: 320,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: '1.9" IPS LCD module'
    },
    {
      id: "gc9a01_240x240",
      name: "GC9A01 Circular (240x240)",
      category: "Round Displays",
      width: 240,
      height: 240,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "circle",
      description: 'Round 1.28" smartwatch display'
    },
    {
      id: "ili9341_320x240",
      name: "ILI9341 (320x240)",
      category: "ILI9341",
      width: 320,
      height: 240,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: 'Classic 2.8" / 3.2" TFT LCD with touch'
    },
    {
      id: "st7735_128x160",
      name: "ST7735 (128x160)",
      category: "ST7735",
      width: 128,
      height: 160,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: '1.8" SPI TFT LCD'
    },
    {
      id: "st7735_128x128",
      name: "ST7735 (128x128)",
      category: "ST7735",
      width: 128,
      height: 128,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "square",
      description: '1.44" square SPI TFT LCD'
    },
    {
      id: "ssd1306_128x64",
      name: "SSD1306 OLED (128x64)",
      category: "Monochrome OLED",
      width: 128,
      height: 64,
      colorFormat: "mono1_horizontal",
      endian: "little",
      swapBytes: false,
      shape: "rectangle",
      description: '0.96" I2C/SPI monochrome OLED'
    },
    {
      id: "ssd1306_128x32",
      name: "SSD1306 OLED (128x32)",
      category: "Monochrome OLED",
      width: 128,
      height: 32,
      colorFormat: "mono1_horizontal",
      endian: "little",
      swapBytes: false,
      shape: "rectangle",
      description: '0.91" I2C monochrome narrow OLED'
    },
    {
      id: "waveshare_200x200",
      name: "Waveshare e-Paper (200x200)",
      category: "e-Paper",
      width: 200,
      height: 200,
      colorFormat: "mono1_horizontal",
      endian: "big",
      swapBytes: false,
      shape: "square",
      description: '1.54" Black/White e-Ink display'
    },
    {
      id: "waveshare_250x122",
      name: "Waveshare e-Paper (250x122)",
      category: "e-Paper",
      width: 250,
      height: 122,
      colorFormat: "mono1_horizontal",
      endian: "big",
      swapBytes: false,
      shape: "rectangle",
      description: '2.13" Black/White e-Ink display'
    },
    {
      id: "custom",
      name: "Custom Resolution...",
      category: "Custom",
      width: 240,
      height: 240,
      colorFormat: "rgb565",
      endian: "big",
      swapBytes: true,
      shape: "rectangle",
      description: "User specified width and height"
    }
  ];
  var COLOR_FORMATS = [
    {
      id: "rgb565",
      name: "RGB565 (16-bit Color)",
      bytesPerPixel: 2,
      dataType: "uint16_t",
      category: "Color",
      description: "5 bits Red, 6 bits Green, 5 bits Blue. Standard for ST7789, ILI9341, TFT_eSPI."
    },
    {
      id: "bgr565",
      name: "BGR565 (16-bit Color)",
      bytesPerPixel: 2,
      dataType: "uint16_t",
      category: "Color",
      description: "5 bits Blue, 6 bits Green, 5 bits Red. Required by inverted color controllers."
    },
    {
      id: "rgb888",
      name: "RGB888 (24-bit True Color)",
      bytesPerPixel: 3,
      dataType: "uint8_t",
      category: "Color",
      description: "8 bits per channel (Red, Green, Blue). High quality for ESP32-S3 RGB LCDs."
    },
    {
      id: "rgb666",
      name: "RGB666 (18-bit Color)",
      bytesPerPixel: 3,
      dataType: "uint8_t",
      category: "Color",
      description: "6 bits per channel (stored in 3 bytes)."
    },
    {
      id: "gray8",
      name: "Grayscale (8-bit, 256 levels)",
      bytesPerPixel: 1,
      dataType: "uint8_t",
      category: "Grayscale",
      description: "8 bits per pixel (0 = black, 255 = white)."
    },
    {
      id: "gray4",
      name: "Grayscale 4-bit (16 levels)",
      bytesPerPixel: 0.5,
      dataType: "uint8_t",
      category: "Grayscale",
      description: "2 pixels packed per byte. Common in 16-shade e-paper screens."
    },
    {
      id: "mono1_horizontal",
      name: "Monochrome 1-bit (Horizontal - Adafruit GFX)",
      bytesPerPixel: 0.125,
      dataType: "uint8_t",
      category: "Monochrome",
      description: "8 pixels per byte, horizontal scan (MSB = leftmost pixel). Used by Adafruit_GFX drawBitmap."
    },
    {
      id: "mono1_vertical",
      name: "Monochrome 1-bit (Vertical Page - SSD1306 native)",
      bytesPerPixel: 0.125,
      dataType: "uint8_t",
      category: "Monochrome",
      description: "8 vertical pixels per byte (Page mode). Native memory layout for SSD1306 / SH1106."
    }
  ];
  var DITHERING_ALGORITHMS = [
    { id: "none", name: "None (Threshold / Truncate)", description: "Fast, sharp edges, no noise patterns" },
    { id: "floyd", name: "Floyd-Steinberg (Error Diffusion)", description: "Smooth, natural gradients, best for photos" },
    { id: "atkinson", name: "Atkinson (Classic Mac / e-Paper)", description: "High contrast, clean highlights, retro aesthetic" },
    { id: "bayer4", name: "Ordered Bayer 4x4", description: "Stable grid pattern, eliminates temporal video flicker" },
    { id: "bayer8", name: "Ordered Bayer 8x8", description: "Detailed stable pattern, great for animations" }
  ];
  var EXPORT_FORMATS = [
    { id: "c_header", name: "C/C++ Header (.h)", ext: ".h", mime: "text/x-c" },
    { id: "binary", name: "Raw Binary (.bin)", ext: ".bin", mime: "application/octet-stream" },
    { id: "bmpr", name: "BitMapper Binary with Header (.bmpr / .bin)", ext: ".bmpr", mime: "application/octet-stream" },
    { id: "hex_dump", name: "Hex Dump (.hex)", ext: ".hex", mime: "text/plain" },
    { id: "python", name: "MicroPython (.py)", ext: ".py", mime: "text/x-python" },
    { id: "png_preview", name: "Rendered PNG Preview (.png)", ext: ".png", mime: "image/png" },
    { id: "zip_sequence", name: "ZIP Archive (Frames Sequence)", ext: ".zip", mime: "application/zip" }
  ];

  // src/engine/dither.ts
  var BAYER_4X4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  var BAYER_8X8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];
  function clamp(val, min = 0, max = 255) {
    return Math.max(min, Math.min(max, val));
  }
  function applyDithering(pixels, width, height, ditherType, mode, threshold = 128) {
    const output = new Uint8ClampedArray(pixels.length);
    const isMono = mode === "mono1_horizontal" || mode === "mono1_vertical";
    const isGray4 = mode === "gray4";
    const isGray8 = mode === "gray8";
    if (ditherType === "floyd" || ditherType === "atkinson") {
      const rBuffer = new Float32Array(width * height);
      const gBuffer = new Float32Array(width * height);
      const bBuffer = new Float32Array(width * height);
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        rBuffer[i] = pixels[idx];
        gBuffer[i] = pixels[idx + 1];
        bBuffer[i] = pixels[idx + 2];
        output[idx + 3] = pixels[idx + 3];
      }
      const isAtkinson = ditherType === "atkinson";
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = y * width + x;
          const curR = clamp(rBuffer[i]);
          const curG = clamp(gBuffer[i]);
          const curB = clamp(bBuffer[i]);
          let newR, newG, newB;
          if (isMono) {
            const lum = 0.299 * curR + 0.587 * curG + 0.114 * curB;
            const val = lum >= threshold ? 255 : 0;
            newR = newG = newB = val;
          } else if (isGray4) {
            const lum = 0.299 * curR + 0.587 * curG + 0.114 * curB;
            const step = Math.round(lum / 17);
            const val = clamp(step * 17);
            newR = newG = newB = val;
          } else if (isGray8) {
            const lum = Math.round(0.299 * curR + 0.587 * curG + 0.114 * curB);
            newR = newG = newB = clamp(lum);
          } else if (mode === "rgb666") {
            newR = Math.round(Math.round(curR / 4.0476) * 4.0476);
            newG = Math.round(Math.round(curG / 4.0476) * 4.0476);
            newB = Math.round(Math.round(curB / 4.0476) * 4.0476);
          } else {
            const r5 = Math.round(curR * 31 / 255);
            const g6 = Math.round(curG * 63 / 255);
            const b5 = Math.round(curB * 31 / 255);
            newR = Math.round(r5 * 255 / 31);
            newG = Math.round(g6 * 255 / 63);
            newB = Math.round(b5 * 255 / 31);
          }
          const errR = curR - newR;
          const errG = curG - newG;
          const errB = curB - newB;
          const outIdx = i * 4;
          output[outIdx] = newR;
          output[outIdx + 1] = newG;
          output[outIdx + 2] = newB;
          if (isAtkinson) {
            const addErr = (nx, ny) => {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const ni = ny * width + nx;
                rBuffer[ni] += errR * 1 / 8;
                gBuffer[ni] += errG * 1 / 8;
                bBuffer[ni] += errB * 1 / 8;
              }
            };
            addErr(x + 1, y);
            addErr(x + 2, y);
            addErr(x - 1, y + 1);
            addErr(x, y + 1);
            addErr(x + 1, y + 1);
            addErr(x, y + 2);
          } else {
            const addErr = (nx, ny, weight) => {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const ni = ny * width + nx;
                rBuffer[ni] += errR * weight / 16;
                gBuffer[ni] += errG * weight / 16;
                bBuffer[ni] += errB * weight / 16;
              }
            };
            addErr(x + 1, y, 7);
            addErr(x - 1, y + 1, 3);
            addErr(x, y + 1, 5);
            addErr(x + 1, y + 1, 1);
          }
        }
      }
      return output;
    }
    const hasBayer = ditherType === "bayer4" || ditherType === "bayer8";
    const bayerMatrix = ditherType === "bayer4" ? BAYER_4X4 : BAYER_8X8;
    const bayerSize = ditherType === "bayer4" ? 4 : 8;
    const bayerDiv = ditherType === "bayer4" ? 16 : 64;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        output[idx + 3] = pixels[idx + 3];
        let ditherOffset = 0;
        if (hasBayer) {
          const matrixVal = bayerMatrix[y % bayerSize][x % bayerSize];
          ditherOffset = matrixVal / bayerDiv - 0.5;
        }
        if (isMono) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          let finalLum = lum;
          if (hasBayer) {
            finalLum += ditherOffset * 64;
          }
          const val = finalLum >= threshold ? 255 : 0;
          output[idx] = output[idx + 1] = output[idx + 2] = val;
        } else if (isGray4) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const adj = lum / 17 + (hasBayer ? ditherOffset : 0);
          const step = clamp(Math.round(adj), 0, 15);
          const val = step * 17;
          output[idx] = output[idx + 1] = output[idx + 2] = val;
        } else if (isGray8) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          output[idx] = output[idx + 1] = output[idx + 2] = clamp(Math.round(lum));
        } else if (mode === "rgb666") {
          const rAdj = r / 255 * 63 + (hasBayer ? ditherOffset : 0);
          const gAdj = g / 255 * 63 + (hasBayer ? ditherOffset : 0);
          const bAdj = b / 255 * 63 + (hasBayer ? ditherOffset : 0);
          output[idx] = Math.round(clamp(Math.round(rAdj), 0, 63) * 255 / 63);
          output[idx + 1] = Math.round(clamp(Math.round(gAdj), 0, 63) * 255 / 63);
          output[idx + 2] = Math.round(clamp(Math.round(bAdj), 0, 63) * 255 / 63);
        } else {
          const rAdj = r / 255 * 31 + (hasBayer ? ditherOffset : 0);
          const gAdj = g / 255 * 63 + (hasBayer ? ditherOffset : 0);
          const bAdj = b / 255 * 31 + (hasBayer ? ditherOffset : 0);
          const r5 = clamp(Math.round(rAdj), 0, 31);
          const g6 = clamp(Math.round(gAdj), 0, 63);
          const b5 = clamp(Math.round(bAdj), 0, 31);
          output[idx] = Math.round(r5 * 255 / 31);
          output[idx + 1] = Math.round(g6 * 255 / 63);
          output[idx + 2] = Math.round(b5 * 255 / 31);
        }
      }
    }
    return output;
  }

  // src/engine/color-quantizer.ts
  function encodeBitmap(rgbaPixels, width, height, options = {}) {
    const {
      colorFormat = "rgb565",
      endian = "big",
      swapBytes = false,
      invert = false
    } = options;
    let bytes;
    const values = [];
    let dataType = "uint16_t";
    if (colorFormat === "rgb565" || colorFormat === "bgr565") {
      dataType = "uint16_t";
      const totalPixels = width * height;
      bytes = new Uint8Array(totalPixels * 2);
      const isBGR = colorFormat === "bgr565";
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        let r = rgbaPixels[idx];
        let g = rgbaPixels[idx + 1];
        let b = rgbaPixels[idx + 2];
        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }
        const r5 = r >> 3 & 31;
        const g6 = g >> 2 & 63;
        const b5 = b >> 3 & 31;
        let val16 = isBGR ? b5 << 11 | g6 << 5 | r5 : r5 << 11 | g6 << 5 | b5;
        let highByte = val16 >> 8 & 255;
        let lowByte = val16 & 255;
        if (swapBytes) {
          val16 = lowByte << 8 | highByte;
          const temp = highByte;
          highByte = lowByte;
          lowByte = temp;
        }
        values.push(val16);
        if (endian === "big") {
          bytes[i * 2] = highByte;
          bytes[i * 2 + 1] = lowByte;
        } else {
          bytes[i * 2] = lowByte;
          bytes[i * 2 + 1] = highByte;
        }
      }
    } else if (colorFormat === "rgb888") {
      dataType = "uint8_t";
      const totalPixels = width * height;
      bytes = new Uint8Array(totalPixels * 3);
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        let r = rgbaPixels[idx];
        let g = rgbaPixels[idx + 1];
        let b = rgbaPixels[idx + 2];
        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }
        bytes[i * 3] = r;
        bytes[i * 3 + 1] = g;
        bytes[i * 3 + 2] = b;
        values.push(r, g, b);
      }
    } else if (colorFormat === "rgb666") {
      dataType = "uint8_t";
      const totalPixels = width * height;
      bytes = new Uint8Array(totalPixels * 3);
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        let r = rgbaPixels[idx];
        let g = rgbaPixels[idx + 1];
        let b = rgbaPixels[idx + 2];
        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }
        const r6 = r >> 2 & 63;
        const g6 = g >> 2 & 63;
        const b6 = b >> 2 & 63;
        bytes[i * 3] = r6;
        bytes[i * 3 + 1] = g6;
        bytes[i * 3 + 2] = b6;
        values.push(r6, g6, b6);
      }
    } else if (colorFormat === "gray8") {
      dataType = "uint8_t";
      const totalPixels = width * height;
      bytes = new Uint8Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        const r = rgbaPixels[idx];
        const g = rgbaPixels[idx + 1];
        const b = rgbaPixels[idx + 2];
        let lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        if (invert) lum = 255 - lum;
        bytes[i] = lum;
        values.push(lum);
      }
    } else if (colorFormat === "gray4") {
      dataType = "uint8_t";
      const totalPixels = width * height;
      const totalBytes = Math.ceil(totalPixels / 2);
      bytes = new Uint8Array(totalBytes);
      let byteIdx = 0;
      for (let i = 0; i < totalPixels; i += 2) {
        const idx1 = i * 4;
        let lum1 = Math.round(
          0.299 * rgbaPixels[idx1] + 0.587 * rgbaPixels[idx1 + 1] + 0.114 * rgbaPixels[idx1 + 2]
        );
        if (invert) lum1 = 255 - lum1;
        const val1 = Math.min(15, Math.floor(lum1 / 16));
        let val2 = 0;
        if (i + 1 < totalPixels) {
          const idx2 = (i + 1) * 4;
          let lum2 = Math.round(
            0.299 * rgbaPixels[idx2] + 0.587 * rgbaPixels[idx2 + 1] + 0.114 * rgbaPixels[idx2 + 2]
          );
          if (invert) lum2 = 255 - lum2;
          val2 = Math.min(15, Math.floor(lum2 / 16));
        }
        const packed = val1 << 4 | val2;
        bytes[byteIdx++] = packed;
        values.push(packed);
      }
    } else if (colorFormat === "mono1_horizontal") {
      dataType = "uint8_t";
      const rowBytes = Math.ceil(width / 8);
      const totalBytes = rowBytes * height;
      bytes = new Uint8Array(totalBytes);
      let byteIndex = 0;
      for (let y = 0; y < height; y++) {
        for (let xByte = 0; xByte < rowBytes; xByte++) {
          let currentByte = 0;
          for (let b = 0; b < 8; b++) {
            const x = xByte * 8 + b;
            if (x < width) {
              const idx = (y * width + x) * 4;
              const r = rgbaPixels[idx];
              let isWhite = r > 127;
              if (invert) isWhite = !isWhite;
              if (isWhite) {
                currentByte |= 1 << 7 - b;
              }
            }
          }
          bytes[byteIndex++] = currentByte;
          values.push(currentByte);
        }
      }
    } else {
      dataType = "uint8_t";
      const pages = Math.ceil(height / 8);
      const totalBytes = width * pages;
      bytes = new Uint8Array(totalBytes);
      let byteIndex = 0;
      for (let p = 0; p < pages; p++) {
        for (let x = 0; x < width; x++) {
          let currentByte = 0;
          for (let b = 0; b < 8; b++) {
            const y = p * 8 + b;
            if (y < height) {
              const idx = (y * width + x) * 4;
              const r = rgbaPixels[idx];
              let isWhite = r > 127;
              if (invert) isWhite = !isWhite;
              if (isWhite) {
                currentByte |= 1 << b;
              }
            }
          }
          bytes[byteIndex++] = currentByte;
          values.push(currentByte);
        }
      }
    }
    return {
      bytes,
      values,
      dataType,
      sizeBytes: bytes.length
    };
  }

  // src/engine/exporters.ts
  function toHex(val, dataType = "uint16_t") {
    if (dataType === "uint16_t") {
      return "0x" + (val & 65535).toString(16).toUpperCase().padStart(4, "0");
    }
    return "0x" + (val & 255).toString(16).toUpperCase().padStart(2, "0");
  }
  function generateCHeaderSingle(name, width, height, values, dataType, options = {}) {
    const {
      colorFormat = "rgb565",
      endian = "big",
      swapBytes = false,
      useProgmem = true,
      itemsPerLine = dataType === "uint16_t" ? 12 : 16
    } = options;
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    const upperName = safeName.toUpperCase();
    const progmemStr = useProgmem ? "PROGMEM " : "";
    const chunks = [];
    chunks.push(`// =============================================================================
`);
    chunks.push(`// Generated by BitMapper Studio for Microcontrollers
`);
    chunks.push(`// Dimensions: ${width} x ${height} px
`);
    chunks.push(`// Color Format: ${colorFormat.toUpperCase()} (${dataType})
`);
    chunks.push(`// Endianness: ${endian.toUpperCase()} | Byte Swap: ${swapBytes}
`);
    chunks.push(`// Data Length: ${values.length} elements (${values.length * (dataType === "uint16_t" ? 2 : 1)} bytes)
`);
    chunks.push(`// Date: ${(/* @__PURE__ */ new Date()).toISOString()}
`);
    chunks.push(`// =============================================================================

`);
    chunks.push(`#pragma once
`);
    chunks.push(`#include <Arduino.h>

`);
    chunks.push(`#define ${upperName}_WIDTH ${width}
`);
    chunks.push(`#define ${upperName}_HEIGHT ${height}
`);
    chunks.push(`#define ${upperName}_SIZE ${values.length}

`);
    chunks.push(`const ${dataType} ${safeName}_data[${values.length}] ${progmemStr}= {
`);
    let currentLine = "  ";
    const total = values.length;
    for (let i = 0; i < total; i++) {
      currentLine += toHex(values[i], dataType);
      if (i < total - 1) {
        currentLine += ", ";
      }
      if ((i + 1) % itemsPerLine === 0 || i === total - 1) {
        chunks.push(currentLine + "\n");
        currentLine = "  ";
      }
    }
    chunks.push(`};
`);
    return chunks.join("");
  }
  function generateCHeaderSequence(name, width, height, frames, dataType, fps = 15, options = {}) {
    if (frames.length === 0) return "// Error: Secuencia de fotogramas vac\xEDa\n";
    const {
      colorFormat = "rgb565",
      endian = "big",
      swapBytes = false,
      useProgmem = true,
      itemsPerLine = dataType === "uint16_t" ? 12 : 16
    } = options;
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    const upperName = safeName.toUpperCase();
    const progmemStr = useProgmem ? "PROGMEM " : "";
    const frameDelay = Math.round(1e3 / Math.max(1, fps));
    const bytesPerFrame = frames[0].values.length * (dataType === "uint16_t" ? 2 : 1);
    const totalBytes = bytesPerFrame * frames.length;
    const chunks = [];
    chunks.push(`// =============================================================================
`);
    chunks.push(`// Generated by BitMapper Studio - Animated Video Sequence
`);
    chunks.push(`// Dimensions: ${width} x ${height} px
`);
    chunks.push(`// Frame Count: ${frames.length} frames @ ${fps} FPS (Delay: ${frameDelay} ms)
`);
    chunks.push(`// Color Format: ${colorFormat.toUpperCase()} (${dataType})
`);
    chunks.push(`// Endianness: ${endian.toUpperCase()} | Byte Swap: ${swapBytes}
`);
    chunks.push(`// Total Size: ${(totalBytes / 1024).toFixed(1)} KB in Flash Memory
`);
    chunks.push(`// =============================================================================

`);
    chunks.push(`#pragma once
`);
    chunks.push(`#include <Arduino.h>

`);
    chunks.push(`#define ${upperName}_WIDTH ${width}
`);
    chunks.push(`#define ${upperName}_HEIGHT ${height}
`);
    chunks.push(`#define ${upperName}_FRAME_COUNT ${frames.length}
`);
    chunks.push(`#define ${upperName}_FRAME_RATE ${fps}
`);
    chunks.push(`#define ${upperName}_FRAME_DELAY_MS ${frameDelay}

`);
    for (let idx = 0; idx < frames.length; idx++) {
      const frame = frames[idx];
      const vals = frame.values;
      const len = vals.length;
      chunks.push(`const ${dataType} ${safeName}_frame_${idx}[${len}] ${progmemStr}= {
`);
      let line = "  ";
      for (let i = 0; i < len; i++) {
        line += toHex(vals[i], dataType);
        if (i < len - 1) {
          line += ", ";
        }
        if ((i + 1) % itemsPerLine === 0 || i === len - 1) {
          chunks.push(line + "\n");
          line = "  ";
        }
      }
      chunks.push(`};

`);
    }
    chunks.push(`// Array de punteros a todos los fotogramas
`);
    chunks.push(`const ${dataType}* const ${safeName}_frames[${frames.length}] ${progmemStr}= {
`);
    for (let idx = 0; idx < frames.length; idx++) {
      const isLast = idx === frames.length - 1;
      chunks.push(`  ${safeName}_frame_${idx}${isLast ? "" : ","}
`);
    }
    chunks.push(`};
`);
    return chunks.join("");
  }
  function generateMicroPython(name, width, height, bytes) {
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    let hexBytes = "";
    for (let i = 0; i < bytes.length; i++) {
      hexBytes += "\\x" + bytes[i].toString(16).padStart(2, "0");
    }
    return `# MicroPython bitmap data generated by BitMapper Studio
WIDTH = ${width}
HEIGHT = ${height}
${safeName.toUpperCase()}_DATA = bytearray(b"${hexBytes}")
`;
  }
  function generateHexDump(bytes, itemsPerLine = 16) {
    const lines = [];
    for (let i = 0; i < bytes.length; i += itemsPerLine) {
      const slice = bytes.slice(i, i + itemsPerLine);
      const hex = Array.from(slice).map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
      lines.push(hex);
    }
    return lines.join("\n");
  }
  function generateESP32Sketches(name, width, height, isVideo = false, fps = 15) {
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    const upper = safeName.toUpperCase();
    const tftEspiSketch = `/*
 * ESP32 + TFT_eSPI (ST7789 / ILI9341) Bitmap Demo
 * Generated by BitMapper Studio
 */
#include <TFT_eSPI.h>
#include "${safeName}.h"

TFT_eSPI tft = TFT_eSPI();

void setup() {
  Serial.begin(115200);
  tft.init();
  tft.setRotation(0);
  tft.fillScreen(TFT_BLACK);

  // If colors appear byte-swapped, toggle this between true and false:
  tft.setSwapBytes(true);

  ${isVideo ? `
  // Display the first frame
  tft.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_frames[0]);
  ` : `
  // Draw bitmap at (x=0, y=0)
  tft.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_data);
  `}
}

void loop() {
  ${isVideo ? `
  // Play video animation in an endless loop
  for (int i = 0; i < ${upper}_FRAME_COUNT; i++) {
    tft.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_frames[i]);
    delay(${upper}_FRAME_DELAY_MS);
  }
  ` : `
  delay(1000);
  `}
}
`;
    const adafruitSketch = `/*
 * ESP32 + Adafruit_ST7789 Bitmap Demo
 * Generated by BitMapper Studio
 */
#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>
#include "${safeName}.h"

#define TFT_CS    5
#define TFT_DC    2
#define TFT_RST   4
#define TFT_MOSI  23
#define TFT_SCLK  18

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  Serial.begin(115200);
  tft.init(${width}, ${height});
  tft.setRotation(0);
  tft.fillScreen(ST77XX_BLACK);

  ${isVideo ? `
  tft.drawRGBBitmap(0, 0, ${safeName}_frames[0], ${upper}_WIDTH, ${upper}_HEIGHT);
  ` : `
  tft.drawRGBBitmap(0, 0, ${safeName}_data, ${upper}_WIDTH, ${upper}_HEIGHT);
  `}
}

void loop() {
  ${isVideo ? `
  for (int i = 0; i < ${upper}_FRAME_COUNT; i++) {
    tft.drawRGBBitmap(0, 0, ${safeName}_frames[i], ${upper}_WIDTH, ${upper}_HEIGHT);
    delay(${upper}_FRAME_DELAY_MS);
  }
  ` : `
  delay(1000);
  `}
}
`;
    const lovyanSketch = `/*
 * ESP32 + LovyanGFX (ST7789 / GC9A01) Ultra-Fast DMA Bitmap Demo
 * Generated by BitMapper Studio
 */
#define LGFX_USE_V1
#include <LovyanGFX.hpp>
#include "${safeName}.h"

LGFX lcd;

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.fillScreen(TFT_BLACK);
  lcd.setSwapBytes(true);

  ${isVideo ? `
  lcd.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_frames[0]);
  ` : `
  lcd.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_data);
  `}
}

void loop() {
  ${isVideo ? `
  for (int i = 0; i < ${upper}_FRAME_COUNT; i++) {
    lcd.pushImage(0, 0, ${upper}_WIDTH, ${upper}_HEIGHT, ${safeName}_frames[i]);
    delay(${upper}_FRAME_DELAY_MS);
  }
  ` : `
  delay(1000);
  `}
}
`;
    const binaryFsSketch = `/*
 * ESP32 + LittleFS / SD Card Stream to ST7789
 * Reads .bin raw bitmaps directly from flash memory
 * Generated by BitMapper Studio
 */
#include <TFT_eSPI.h>
#include <LittleFS.h>

TFT_eSPI tft = TFT_eSPI();

void drawBinFromFS(const char *filename, int x, int y, int w, int h) {
  File file = LittleFS.open(filename, "r");
  if (!file) {
    Serial.println("Failed to open file");
    return;
  }

  uint16_t lineBuffer[w];
  tft.setSwapBytes(true);

  for (int row = 0; row < h; row++) {
    file.read((uint8_t*)lineBuffer, w * 2);
    tft.pushImage(x, y + row, w, 1, lineBuffer);
  }
  file.close();
}

void setup() {
  Serial.begin(115200);
  tft.init();
  LittleFS.begin();
  tft.fillScreen(TFT_BLACK);

  drawBinFromFS("/${safeName}.bin", 0, 0, ${width}, ${height});
}

void loop() {
  delay(1000);
}
`;
    return {
      tft_espi: tftEspiSketch,
      adafruit_gfx: adafruitSketch,
      lovyangfx: lovyanSketch,
      fs_binary: binaryFsSketch
    };
  }
  var BMPR_VERSION = 1;
  function createBmprHeader(width, height, totalFrames = 1, fps = 15, colorFormat = "rgb565", swapBytes = true) {
    const header = new Uint8Array(16);
    const view = new DataView(header.buffer);
    header[0] = 66;
    header[1] = 77;
    header[2] = 80;
    header[3] = 82;
    view.setUint16(4, BMPR_VERSION, true);
    view.setUint16(6, width, true);
    view.setUint16(8, height, true);
    view.setUint16(10, totalFrames, true);
    view.setUint8(12, fps);
    let formatCode = 0;
    if (colorFormat === "bgr565") formatCode = 1;
    else if (colorFormat === "rgb888") formatCode = 2;
    else if (colorFormat === "gray8") formatCode = 3;
    else if (colorFormat === "mono1_horizontal") formatCode = 4;
    else if (colorFormat === "mono1_vertical") formatCode = 5;
    view.setUint8(13, formatCode);
    let flags = 0;
    if (swapBytes) flags |= 1;
    view.setUint16(14, flags, true);
    return header;
  }
  function generateBmprBinary(width, height, rawBytes, totalFrames = 1, fps = 15, colorFormat = "rgb565", swapBytes = true) {
    const header = createBmprHeader(width, height, totalFrames, fps, colorFormat, swapBytes);
    const combined = new Uint8Array(header.length + rawBytes.length);
    combined.set(header, 0);
    combined.set(rawBytes, header.length);
    return combined;
  }

  // src/renderer/ble-uploader.ts
  var BLE_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  var BLE_CONTROL_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
  var BLE_DATA_CHAR_UUID = "beb5483f-36e1-4688-b7f5-ea07361b26a8";
  var BLEUploader = class {
    activeDevice = null;
    server = null;
    controlChar = null;
    dataChar = null;
    isBusy = false;
    connectedDevName = "BitMapper-ESP32";
    get isConnected() {
      return !!(this.activeDevice && this.server && this.server.connected && this.controlChar);
    }
    get deviceName() {
      return this.connectedDevName;
    }
    /**
     * Conectar al dispositivo Bluetooth.
     * IMPORTANTE: Debe ser llamado de forma sincrónica con la interacción del usuario (click).
     */
    async requestDeviceAndConnect(onProgress) {
      if (this.isBusy) {
        throw new Error("Ya hay una transferencia BLE en progreso.");
      }
      const bluetooth = navigator.bluetooth;
      if (!bluetooth) {
        throw new Error(
          "La API Web Bluetooth no est\xE1 soportada en este entorno. Verifica que los permisos Bluetooth est\xE9n activos."
        );
      }
      if (this.activeDevice && this.server && this.server.connected && this.controlChar && this.dataChar) {
        return { device: this.activeDevice, devName: this.connectedDevName };
      }
      this.isBusy = true;
      if (onProgress) {
        onProgress({
          state: "scanning",
          statusText: "Buscando m\xF3dulo ESP32-C3 ('BitMapper-ESP32')...",
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0
        });
      }
      let device = null;
      try {
        device = await bluetooth.requestDevice({
          filters: [{ namePrefix: "BitMapper" }],
          optionalServices: [BLE_SERVICE_UUID]
        });
      } catch (scanErr) {
        console.warn("Filtro por nombre no encontrado, abriendo lista de todos los dispositivos...", scanErr);
        device = await bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [BLE_SERVICE_UUID]
        });
      }
      this.activeDevice = device;
      this.connectedDevName = device.name || "BitMapper-ESP32";
      if (onProgress) {
        onProgress({
          state: "connecting",
          statusText: `Conectando al servidor GATT de ${this.connectedDevName}...`,
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0,
          deviceName: this.connectedDevName
        });
      }
      this.server = await device.gatt.connect();
      if (onProgress) {
        onProgress({
          state: "connected",
          statusText: `Conectado a ${this.connectedDevName}. Obteniendo caracter\xEDsticas de transferencia...`,
          bytesSent: 0,
          totalBytes: 0,
          percentage: 0,
          deviceName: this.connectedDevName
        });
      }
      const service = await this.server.getPrimaryService(BLE_SERVICE_UUID);
      this.controlChar = await service.getCharacteristic(BLE_CONTROL_CHAR_UUID);
      this.dataChar = await service.getCharacteristic(BLE_DATA_CHAR_UUID);
      return { device: this.activeDevice, devName: this.connectedDevName };
    }
    /**
     * Transmitir los datos al dispositivo ya conectado.
     */
    async transferData(options) {
      const { fileName, bytes, onProgress, signal } = options;
      if (!this.activeDevice || !this.server || !this.controlChar || !this.dataChar) {
        throw new Error("No hay conexi\xF3n activa con el ESP32. Llama a requestDeviceAndConnect() primero.");
      }
      const devName = this.connectedDevName;
      try {
        let readyResolver = null;
        const readyPromise = new Promise((resolve) => {
          readyResolver = resolve;
        });
        let doneResolver = null;
        const donePromise = new Promise((resolve) => {
          doneResolver = resolve;
        });
        const onNotification = (event) => {
          const char = event.target;
          const val = new TextDecoder().decode(char.value);
          console.log("[ESP32 BLE Notificaci\xF3n]:", val);
          if (val === "READY" && readyResolver) {
            readyResolver();
          } else if ((val === "SUCCESS" || val === "CANCELLED" || val === "ERROR_SD") && doneResolver) {
            doneResolver(val);
          }
        };
        try {
          await this.controlChar.startNotifications();
          this.controlChar.addEventListener("characteristicvaluechanged", onNotification);
        } catch (notifErr) {
          console.warn("Notificaciones no habilitadas en el cliente, continuando:", notifErr);
        }
        let cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        if (!cleanName.toLowerCase().endsWith(".bin") && !cleanName.toLowerCase().endsWith(".bmpr")) {
          cleanName += ".bin";
        }
        const startCmd = `START:${cleanName}:${bytes.byteLength}`;
        const encoder = new TextEncoder();
        await this.controlChar.writeValue(encoder.encode(startCmd));
        await Promise.race([
          readyPromise,
          new Promise((r) => setTimeout(r, 250))
        ]);
        const CHUNK_SIZE = 240;
        const totalBytes = bytes.byteLength;
        let offset = 0;
        const startTime = performance.now();
        onProgress({
          state: "uploading",
          statusText: `Enviando "${cleanName}" (${(totalBytes / 1024).toFixed(1)} KB)...`,
          bytesSent: 0,
          totalBytes,
          percentage: 0,
          deviceName: devName,
          speedKbps: 0
        });
        while (offset < totalBytes) {
          if (signal?.aborted) {
            try {
              await this.controlChar.writeValue(encoder.encode("CANCEL"));
            } catch {
            }
            throw new Error("Transferencia cancelada por el usuario");
          }
          const chunk = bytes.subarray(offset, Math.min(offset + CHUNK_SIZE, totalBytes));
          if (this.dataChar.writeValueWithoutResponse) {
            await this.dataChar.writeValueWithoutResponse(chunk);
          } else {
            await this.dataChar.writeValue(chunk);
          }
          offset += chunk.byteLength;
          const elapsedSec = (performance.now() - startTime) / 1e3;
          const speedKbps = elapsedSec > 0 ? offset / 1024 / elapsedSec : 0;
          const percentage = Math.min(100, Math.round(offset / totalBytes * 100));
          onProgress({
            state: "uploading",
            statusText: `Transmitiendo a MicroSD...`,
            bytesSent: offset,
            totalBytes,
            percentage,
            deviceName: devName,
            speedKbps
          });
          await new Promise((r) => setTimeout(r, 4));
        }
        onProgress({
          state: "uploading",
          statusText: `Finalizando y mostrando en pantalla...`,
          bytesSent: totalBytes,
          totalBytes,
          percentage: 100,
          deviceName: devName
        });
        await this.controlChar.writeValue(encoder.encode("DONE"));
        const finalResult = await Promise.race([
          donePromise,
          new Promise((r) => setTimeout(() => r("SUCCESS"), 1800))
        ]);
        if (finalResult === "ERROR_SD") {
          throw new Error("El ESP32 no pudo escribir el archivo en la tarjeta MicroSD. Verifica que la SD est\xE9 conectada.");
        }
        onProgress({
          state: "completed",
          statusText: `\xA1Archivo "${cleanName}" transferido con \xE9xito! Mostrado en la pantalla ST7735S.`,
          bytesSent: totalBytes,
          totalBytes,
          percentage: 100,
          deviceName: devName
        });
        try {
          this.controlChar.removeEventListener("characteristicvaluechanged", onNotification);
        } catch {
        }
      } catch (err) {
        const errMsg = err?.message || String(err);
        onProgress({
          state: "error",
          statusText: `Error BLE: ${errMsg}`,
          bytesSent: 0,
          totalBytes: bytes.byteLength,
          percentage: 0,
          error: errMsg
        });
        throw err;
      } finally {
        this.isBusy = false;
      }
    }
    /**
     * Obtener lista de archivos .BIN en la tarjeta MicroSD del ESP32
     */
    async listSDFiles() {
      if (!this.activeDevice || !this.server || !this.controlChar) {
        throw new Error("No hay conexi\xF3n activa con el ESP32. Conecta el dispositivo primero.");
      }
      const files = [];
      const encoder = new TextEncoder();
      return new Promise(async (resolve, reject) => {
        let timeoutTimer;
        const cleanup = () => {
          clearTimeout(timeoutTimer);
          try {
            this.controlChar.removeEventListener("characteristicvaluechanged", onListNotif);
          } catch {
          }
        };
        const onListNotif = (event) => {
          const char = event.target;
          const val = new TextDecoder().decode(char.value);
          console.log("[BLE SD List Notif]:", val);
          if (val.startsWith("FILE_ITEM:")) {
            const parts = val.substring(10).split(":");
            const name = parts[0] || "unknown.bin";
            const size = parseInt(parts[1], 10) || 0;
            const isVideo = size > 40960 && (size % 40960 === 0 || size % 115200 === 0 || size % 153600 === 0);
            const totalFrames = isVideo ? size % 40960 === 0 ? size / 40960 : Math.round(size / 115200) : 1;
            let displaySize = "";
            if (size >= 1024 * 1024) {
              displaySize = `${(size / (1024 * 1024)).toFixed(2)} MB`;
            } else {
              displaySize = `${(size / 1024).toFixed(1)} KB`;
            }
            files.push({
              name,
              size,
              isVideo,
              totalFrames,
              displaySize
            });
          } else if (val === "FILE_LIST_END") {
            cleanup();
            resolve(files);
          }
        };
        try {
          await this.controlChar.startNotifications();
          this.controlChar.addEventListener("characteristicvaluechanged", onListNotif);
          await this.controlChar.writeValue(encoder.encode("LIST"));
          timeoutTimer = setTimeout(() => {
            cleanup();
            resolve(files);
          }, 7e3);
        } catch (err) {
          cleanup();
          reject(err);
        }
      });
    }
    /**
     * Eliminar un archivo .BIN de la MicroSD vía Bluetooth
     */
    async deleteSDFile(fileName) {
      if (!this.activeDevice || !this.server || !this.controlChar) {
        throw new Error("No hay conexi\xF3n activa con el ESP32.");
      }
      const encoder = new TextEncoder();
      return new Promise(async (resolve, reject) => {
        let timeoutTimer;
        const cleanup = () => {
          clearTimeout(timeoutTimer);
          try {
            this.controlChar.removeEventListener("characteristicvaluechanged", onDelNotif);
          } catch {
          }
        };
        const onDelNotif = (event) => {
          const char = event.target;
          const val = new TextDecoder().decode(char.value);
          console.log("[BLE Delete Notif]:", val);
          if (val.startsWith("DELETE_OK:")) {
            cleanup();
            resolve(true);
          } else if (val.startsWith("DELETE_FAIL:")) {
            cleanup();
            resolve(false);
          }
        };
        try {
          await this.controlChar.startNotifications();
          this.controlChar.addEventListener("characteristicvaluechanged", onDelNotif);
          const cleanName = fileName.startsWith("/") ? fileName.substring(1) : fileName;
          await this.controlChar.writeValue(encoder.encode(`DELETE:${cleanName}`));
          timeoutTimer = setTimeout(() => {
            cleanup();
            resolve(false);
          }, 6e3);
        } catch (err) {
          cleanup();
          reject(err);
        }
      });
    }
    /**
     * Mostrar un archivo específico en la pantalla del ESP32
     */
    async showSDFile(fileName) {
      if (!this.activeDevice || !this.server || !this.controlChar) {
        throw new Error("No hay conexi\xF3n activa con el ESP32.");
      }
      const encoder = new TextEncoder();
      const cleanName = fileName.startsWith("/") ? fileName.substring(1) : fileName;
      await this.controlChar.writeValue(encoder.encode(`SHOW:${cleanName}`));
      return true;
    }
    /**
     * Enviar comando de control genérico esperando respuesta por notificación
     */
    async sendGenericCommand(cmd, expectPrefix, timeoutMs = 3e3) {
      if (!this.activeDevice || !this.server || !this.controlChar) {
        throw new Error("No hay conexi\xF3n activa con el ESP32.");
      }
      const encoder = new TextEncoder();
      if (!expectPrefix) {
        await this.controlChar.writeValue(encoder.encode(cmd));
        return "OK";
      }
      return new Promise(async (resolve, reject) => {
        let timeoutTimer;
        const cleanup = () => {
          clearTimeout(timeoutTimer);
          try {
            this.controlChar.removeEventListener("characteristicvaluechanged", onCmdNotif);
          } catch {
          }
        };
        const onCmdNotif = (event) => {
          const char = event.target;
          const val = new TextDecoder().decode(char.value);
          if (val.startsWith(expectPrefix)) {
            cleanup();
            resolve(val);
          }
        };
        try {
          await this.controlChar.startNotifications();
          this.controlChar.addEventListener("characteristicvaluechanged", onCmdNotif);
          await this.controlChar.writeValue(encoder.encode(cmd));
          timeoutTimer = setTimeout(() => {
            cleanup();
            resolve("TIMEOUT");
          }, timeoutMs);
        } catch (err) {
          cleanup();
          reject(err);
        }
      });
    }
    /**
     * Configurar modo Diapositivas (Slideshow) en el ESP32
     */
    async sendSlideshowConfig(enabled, delaySec = 5) {
      const cmd = enabled ? `SLIDESHOW:ON:${delaySec}` : "SLIDESHOW:OFF";
      const resp = await this.sendGenericCommand(cmd, "SLIDESHOW_OK", 3e3);
      return resp.startsWith("SLIDESHOW_OK");
    }
    /**
     * Configurar modo de Transición entre imágenes en el ESP32
     */
    async sendTransitionConfig(mode) {
      const cmd = `TRANSITION:${mode}`;
      const resp = await this.sendGenericCommand(cmd, "TRANSITION_OK", 3e3);
      return resp.startsWith("TRANSITION_OK");
    }
    /**
     * Configurar brillo de pantalla por PWM en el ESP32
     */
    async sendBrightnessConfig(duty) {
      const clamped = Math.max(0, Math.min(255, Math.round(duty)));
      const cmd = `BRIGHT:${clamped}`;
      const resp = await this.sendGenericCommand(cmd, "BRIGHT_OK", 2500);
      return resp.startsWith("BRIGHT_OK");
    }
    /**
     * Configurar velocidad FPS por defecto en el ESP32
     */
    async sendFpsConfig(fps) {
      const cmd = `FPS:${fps}`;
      const resp = await this.sendGenericCommand(cmd, "FPS_OK", 2500);
      return resp.startsWith("FPS_OK");
    }
    /**
     * Método de conveniencia completo (Conectar + Transmitir).
     */
    async upload(options) {
      await this.requestDeviceAndConnect(options.onProgress);
      await this.transferData(options);
    }
    disconnect() {
      if (this.activeDevice && this.activeDevice.gatt && this.activeDevice.gatt.connected) {
        setTimeout(() => {
          try {
            this.activeDevice.gatt.disconnect();
          } catch (err) {
            console.warn("Error al desconectar GATT:", err);
          }
          this.activeDevice = null;
          this.server = null;
          this.controlChar = null;
          this.dataChar = null;
          this.isBusy = false;
        }, 500);
      } else {
        this.activeDevice = null;
        this.server = null;
        this.controlChar = null;
        this.dataChar = null;
        this.isBusy = false;
      }
    }
  };
  var bleUploader = new BLEUploader();

  // src/renderer/app.ts
  var state = {
    sourceType: "image",
    sourceElement: null,
    sourceFileName: "sample_cyberpunk.png",
    sourceBaseName: "sample_cyberpunk",
    sourceWidth: 240,
    sourceHeight: 240,
    presetId: "st7789_240x240",
    targetWidth: 240,
    targetHeight: 240,
    scalingMode: "cover",
    bgColor: "#000000",
    colorFormat: "rgb565",
    endian: "big",
    swapBytes: false,
    invertColors: false,
    ditherAlgorithm: "floyd",
    rotation: 0,
    flipH: false,
    flipV: false,
    brightness: 0,
    contrast: 0,
    gamma: 1,
    threshold: 128,
    videoPlaying: false,
    videoDuration: 0,
    videoInPoint: 0,
    videoOutPoint: 0,
    videoTargetFps: 15,
    videoExportMode: "sequence",
    videoLoop: true,
    exportFormat: "c_header",
    variableName: "bitmap_data",
    useProgmem: true,
    itemsPerRow: 16,
    zoom: 2,
    pixelGrid: false,
    showBezel: true,
    activeTab: "tab-simulator",
    activeSketchTab: "tft_espi",
    currentEncoded: null
  };
  var el = {
    btnOpenFile: document.getElementById("btnOpenFile"),
    btnPasteClipboard: document.getElementById("btnPasteClipboard"),
    sampleSelect: document.getElementById("sampleSelect"),
    btnHeaderExport: document.getElementById("btnHeaderExport"),
    btnExportMain: document.getElementById("btnExportMain"),
    hiddenFileInput: document.getElementById("hiddenFileInput"),
    hiddenVideo: document.getElementById("hiddenVideo"),
    sourceTypeBadge: document.getElementById("sourceTypeBadge"),
    sourceDetails: document.getElementById("sourceDetails"),
    presetSelect: document.getElementById("presetSelect"),
    inputWidth: document.getElementById("inputWidth"),
    inputHeight: document.getElementById("inputHeight"),
    btnSwapOrientation: document.getElementById("btnSwapOrientation"),
    scalingMode: document.getElementById("scalingMode"),
    bgColorPicker: document.getElementById("bgColorPicker"),
    colorFormatSelect: document.getElementById("colorFormatSelect"),
    endianSelect: document.getElementById("endianSelect"),
    ditherSelect: document.getElementById("ditherSelect"),
    swapBytesCheckbox: document.getElementById("swapBytesCheckbox"),
    invertColorsCheckbox: document.getElementById("invertColorsCheckbox"),
    rotationSelect: document.getElementById("rotationSelect"),
    btnFlipH: document.getElementById("btnFlipH"),
    btnFlipV: document.getElementById("btnFlipV"),
    sliderBrightness: document.getElementById("sliderBrightness"),
    brightnessVal: document.getElementById("brightnessVal"),
    sliderContrast: document.getElementById("sliderContrast"),
    contrastVal: document.getElementById("contrastVal"),
    sliderGamma: document.getElementById("sliderGamma"),
    gammaVal: document.getElementById("gammaVal"),
    thresholdGroup: document.getElementById("thresholdGroup"),
    sliderThreshold: document.getElementById("sliderThreshold"),
    thresholdVal: document.getElementById("thresholdVal"),
    videoSection: document.getElementById("videoSection"),
    videoDurationBadge: document.getElementById("videoDurationBadge"),
    videoTargetFps: document.getElementById("videoTargetFps"),
    videoExportMode: document.getElementById("videoExportMode"),
    videoTotalFrames: document.getElementById("videoTotalFrames"),
    videoEstFlash: document.getElementById("videoEstFlash"),
    exportFormatSelect: document.getElementById("exportFormatSelect"),
    variableNameInput: document.getElementById("variableNameInput"),
    progmemCheckbox: document.getElementById("progmemCheckbox"),
    itemsPerRowSelect: document.getElementById("itemsPerRowSelect"),
    targetCanvas: document.getElementById("targetCanvas"),
    originalCanvas: document.getElementById("originalCanvas"),
    compareTargetCanvas: document.getElementById("compareTargetCanvas"),
    zoomSelect: document.getElementById("zoomSelect"),
    btnToggleGrid: document.getElementById("btnToggleGrid"),
    btnToggleBezel: document.getElementById("btnToggleBezel"),
    hardwareBezel: document.getElementById("hardwareBezel"),
    bezelLabel: document.getElementById("bezelLabel"),
    bezelScreenGlass: document.getElementById("bezelScreenGlass"),
    videoTimelineBar: document.getElementById("videoTimelineBar"),
    videoScrubber: document.getElementById("videoScrubber"),
    btnVideoPlayPause: document.getElementById("btnVideoPlayPause"),
    playIcon: document.getElementById("playIcon"),
    pauseIcon: document.getElementById("pauseIcon"),
    btnPrevFrame: document.getElementById("btnPrevFrame"),
    btnNextFrame: document.getElementById("btnNextFrame"),
    currentTimeLabel: document.getElementById("currentTimeLabel"),
    totalTimeLabel: document.getElementById("totalTimeLabel"),
    currentFrameNum: document.getElementById("currentFrameNum"),
    btnSetInPoint: document.getElementById("btnSetInPoint"),
    btnSetOutPoint: document.getElementById("btnSetOutPoint"),
    btnResetRange: document.getElementById("btnResetRange"),
    rangeDisplay: document.getElementById("rangeDisplay"),
    videoLoopCheckbox: document.getElementById("videoLoopCheckbox"),
    codeOutput: document.getElementById("codeOutput"),
    btnCopyCode: document.getElementById("btnCopyCode"),
    codePreviewTitle: document.getElementById("codePreviewTitle"),
    sketchOutput: document.getElementById("sketchOutput"),
    btnCopySketch: document.getElementById("btnCopySketch"),
    statusReady: document.getElementById("statusReady"),
    statusDim: document.getElementById("statusDim"),
    statusFormat: document.getElementById("statusFormat"),
    statusMemory: document.getElementById("statusMemory"),
    statusPixelCoord: document.getElementById("statusPixelCoord"),
    pixelInspector: document.getElementById("pixelInspector"),
    inspectorSwatch: document.getElementById("inspectorSwatch"),
    inspectorText: document.getElementById("inspectorText"),
    dragOverlay: document.getElementById("dragOverlay"),
    toast: document.getElementById("toast"),
    toastMessage: document.getElementById("toastMessage"),
    btnHeaderBle: document.getElementById("btnHeaderBle"),
    btnBleSendSidebar: document.getElementById("btnBleSendSidebar"),
    bleModalOverlay: document.getElementById("bleModalOverlay"),
    btnBleCloseModal: document.getElementById("btnBleCloseModal"),
    btnBleDismiss: document.getElementById("btnBleDismiss"),
    btnBlePickLocalBin: document.getElementById("btnBlePickLocalBin"),
    btnBleStartUpload: document.getElementById("btnBleStartUpload"),
    btnBleCancelUpload: document.getElementById("btnBleCancelUpload"),
    bleTargetFilename: document.getElementById("bleTargetFilename"),
    bleTargetFilemeta: document.getElementById("bleTargetFilemeta"),
    bleStatusBadge: document.getElementById("bleStatusBadge"),
    bleDeviceNameLabel: document.getElementById("bleDeviceNameLabel"),
    bleProgressStatusText: document.getElementById("bleProgressStatusText"),
    bleProgressPercent: document.getElementById("bleProgressPercent"),
    bleProgressBar: document.getElementById("bleProgressBar"),
    bleBytesTransferred: document.getElementById("bleBytesTransferred"),
    bleTransferSpeed: document.getElementById("bleTransferSpeed"),
    bleTabBtnUpload: document.getElementById("bleTabBtnUpload"),
    bleTabBtnBatch: document.getElementById("bleTabBtnBatch"),
    bleTabBtnManager: document.getElementById("bleTabBtnManager"),
    blePaneUpload: document.getElementById("blePaneUpload"),
    blePaneBatch: document.getElementById("blePaneBatch"),
    blePaneManager: document.getElementById("blePaneManager"),
    btnBleAddBatchFiles: document.getElementById("btnBleAddBatchFiles"),
    btnBleClearBatch: document.getElementById("btnBleClearBatch"),
    bleBatchResLabel: document.getElementById("bleBatchResLabel"),
    bleBatchFormatLabel: document.getElementById("bleBatchFormatLabel"),
    bleBatchProgressBox: document.getElementById("bleBatchProgressBox"),
    bleBatchOverallStatus: document.getElementById("bleBatchOverallStatus"),
    bleBatchOverallPercent: document.getElementById("bleBatchOverallPercent"),
    bleBatchOverallBar: document.getElementById("bleBatchOverallBar"),
    bleBatchFileStatus: document.getElementById("bleBatchFileStatus"),
    bleBatchSpeed: document.getElementById("bleBatchSpeed"),
    bleBatchFilesContainer: document.getElementById("bleBatchFilesContainer"),
    btnBleStartBatchUpload: document.getElementById("btnBleStartBatchUpload"),
    hiddenBatchFileInput: document.getElementById("hiddenBatchFileInput"),
    bleManagerStatusText: document.getElementById("bleManagerStatusText"),
    bleManagerBadge: document.getElementById("bleManagerBadge"),
    btnBleRefreshFiles: document.getElementById("btnBleRefreshFiles"),
    bleFilesContainer: document.getElementById("bleFilesContainer"),
    btnBleConnectFromManager: document.getElementById("btnBleConnectFromManager"),
    bleTabBtnSettings: document.getElementById("bleTabBtnSettings"),
    blePaneSettings: document.getElementById("blePaneSettings"),
    bleSettingSlideshow: document.getElementById("bleSettingSlideshow"),
    bleSettingSlideInterval: document.getElementById("bleSettingSlideInterval"),
    bleSlideIntervalLabel: document.getElementById("bleSlideIntervalLabel"),
    bleSettingTransition: document.getElementById("bleSettingTransition"),
    bleSettingBrightness: document.getElementById("bleSettingBrightness"),
    bleSettingBrightnessLabel: document.getElementById("bleSettingBrightnessLabel"),
    btnBleApplySettings: document.getElementById("btnBleApplySettings"),
    btnBleRemotePrev: document.getElementById("btnBleRemotePrev"),
    btnBleRemoteNext: document.getElementById("btnBleRemoteNext"),
    bleOptBmprHeader: document.getElementById("bleOptBmprHeader")
  };
  var workCanvas = document.createElement("canvas");
  var workCtx = workCanvas.getContext("2d", { willReadFrequently: true });
  var targetCtx = el.targetCanvas.getContext("2d");
  var originalCtx = el.originalCanvas.getContext("2d");
  var compareCtx = el.compareTargetCanvas.getContext("2d");
  function initUI() {
    DISPLAY_PRESETS.forEach((preset) => {
      const opt = document.createElement("option");
      opt.value = preset.id;
      opt.textContent = `${preset.name} (${preset.width}x${preset.height})`;
      el.presetSelect.appendChild(opt);
    });
    el.presetSelect.value = state.presetId;
    COLOR_FORMATS.forEach((fmt) => {
      const opt = document.createElement("option");
      opt.value = fmt.id;
      opt.textContent = fmt.name;
      el.colorFormatSelect.appendChild(opt);
    });
    el.colorFormatSelect.value = state.colorFormat;
    DITHERING_ALGORITHMS.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      el.ditherSelect.appendChild(opt);
    });
    el.ditherSelect.value = state.ditherAlgorithm;
    updateExportFormatsForSource();
    setupEvents();
    loadSample("cyberpunk");
  }
  function updateExportFormatsForSource() {
    const isVideoSeq = state.sourceType === "video" && state.videoExportMode === "sequence";
    el.exportFormatSelect.innerHTML = "";
    if (isVideoSeq) {
      const videoFormats = [
        { id: "binary", name: "\u{1F3AC} Video Binario MicroSD (*_anim_XXfps.bin) [Recomendado ESP32]" },
        { id: "zip_sequence", name: "\u{1F4E6} Paquete ZIP (*_anim_XXfps.bin + Sketch ESP32)" },
        { id: "c_header", name: "\u{1F4C4} Cabecera C/C++ (*_anim_XXfps.h - Memoria Flash)" }
      ];
      videoFormats.forEach((vf) => {
        const opt = document.createElement("option");
        opt.value = vf.id;
        opt.textContent = vf.name;
        el.exportFormatSelect.appendChild(opt);
      });
      if (state.exportFormat !== "c_header" && state.exportFormat !== "zip_sequence") {
        state.exportFormat = "binary";
      }
      el.exportFormatSelect.value = state.exportFormat;
      el.btnExportMain.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Exportar Video (*_anim_XXfps.bin)';
      el.btnHeaderExport.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar Video';
    } else {
      EXPORT_FORMATS.forEach((ef) => {
        const opt = document.createElement("option");
        opt.value = ef.id;
        opt.textContent = ef.name;
        el.exportFormatSelect.appendChild(opt);
      });
      if (state.exportFormat === "zip_sequence") {
        state.exportFormat = "c_header";
      }
      el.exportFormatSelect.value = state.exportFormat;
      el.btnExportMain.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Generar & Exportar Bitmap';
      el.btnHeaderExport.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Exportar';
    }
    updateCodePreview();
  }
  function setupEvents() {
    el.presetSelect.addEventListener("change", () => {
      const p = DISPLAY_PRESETS.find((x) => x.id === el.presetSelect.value);
      if (p) {
        state.presetId = p.id;
        if (p.id !== "custom") {
          state.targetWidth = p.width;
          state.targetHeight = p.height;
          el.inputWidth.value = String(p.width);
          el.inputHeight.value = String(p.height);
          if (p.colorFormat) {
            state.colorFormat = p.colorFormat;
            el.colorFormatSelect.value = p.colorFormat;
          }
          if (p.endian) {
            state.endian = p.endian;
            el.endianSelect.value = p.endian;
          }
          if (typeof p.swapBytes === "boolean") {
            state.swapBytes = p.swapBytes;
            el.swapBytesCheckbox.checked = p.swapBytes;
          }
          updateBezelStyle(p.shape || "rectangle", p.name);
        }
        updatePipeline();
      }
    });
    el.inputWidth.addEventListener("change", () => {
      state.targetWidth = Math.max(8, parseInt(el.inputWidth.value) || 240);
      el.presetSelect.value = "custom";
      updatePipeline();
    });
    el.inputHeight.addEventListener("change", () => {
      state.targetHeight = Math.max(8, parseInt(el.inputHeight.value) || 240);
      el.presetSelect.value = "custom";
      updatePipeline();
    });
    el.btnSwapOrientation.addEventListener("click", () => {
      const tmp = state.targetWidth;
      state.targetWidth = state.targetHeight;
      state.targetHeight = tmp;
      el.inputWidth.value = String(state.targetWidth);
      el.inputHeight.value = String(state.targetHeight);
      updatePipeline();
    });
    el.scalingMode.addEventListener("change", () => {
      state.scalingMode = el.scalingMode.value;
      updatePipeline();
    });
    el.bgColorPicker.addEventListener("input", () => {
      state.bgColor = el.bgColorPicker.value;
      updatePipeline();
    });
    el.colorFormatSelect.addEventListener("change", () => {
      state.colorFormat = el.colorFormatSelect.value;
      const isMono = state.colorFormat.startsWith("mono1");
      el.thresholdGroup.style.display = isMono ? "block" : "none";
      updatePipeline();
    });
    el.endianSelect.addEventListener("change", () => {
      state.endian = el.endianSelect.value;
      updatePipeline();
    });
    el.swapBytesCheckbox.addEventListener("change", () => {
      state.swapBytes = el.swapBytesCheckbox.checked;
      updatePipeline();
    });
    el.invertColorsCheckbox.addEventListener("change", () => {
      state.invertColors = el.invertColorsCheckbox.checked;
      updatePipeline();
    });
    el.ditherSelect.addEventListener("change", () => {
      state.ditherAlgorithm = el.ditherSelect.value;
      updatePipeline();
    });
    el.rotationSelect.addEventListener("change", () => {
      state.rotation = parseInt(el.rotationSelect.value) || 0;
      updatePipeline();
    });
    el.btnFlipH.addEventListener("click", () => {
      state.flipH = !state.flipH;
      el.btnFlipH.classList.toggle("btn-primary", state.flipH);
      updatePipeline();
    });
    el.btnFlipV.addEventListener("click", () => {
      state.flipV = !state.flipV;
      el.btnFlipV.classList.toggle("btn-primary", state.flipV);
      updatePipeline();
    });
    el.sliderBrightness.addEventListener("input", () => {
      state.brightness = parseInt(el.sliderBrightness.value);
      el.brightnessVal.textContent = String(state.brightness);
      updatePipeline();
    });
    el.sliderContrast.addEventListener("input", () => {
      state.contrast = parseInt(el.sliderContrast.value);
      el.contrastVal.textContent = String(state.contrast);
      updatePipeline();
    });
    el.sliderGamma.addEventListener("input", () => {
      state.gamma = parseFloat(el.sliderGamma.value);
      el.gammaVal.textContent = state.gamma.toFixed(1);
      updatePipeline();
    });
    el.sliderThreshold.addEventListener("input", () => {
      state.threshold = parseInt(el.sliderThreshold.value);
      el.thresholdVal.textContent = String(state.threshold);
      updatePipeline();
    });
    el.videoTargetFps.addEventListener("change", () => {
      state.videoTargetFps = parseInt(el.videoTargetFps.value) || 15;
      updateVideoStats();
    });
    el.videoExportMode.addEventListener("change", () => {
      state.videoExportMode = el.videoExportMode.value;
      updateExportFormatsForSource();
    });
    el.exportFormatSelect.addEventListener("change", () => {
      state.exportFormat = el.exportFormatSelect.value;
      updateCodePreview();
    });
    el.variableNameInput.addEventListener("input", () => {
      state.variableName = el.variableNameInput.value.trim() || "bitmap_data";
      updateCodePreview();
      updateSketches();
    });
    el.progmemCheckbox.addEventListener("change", () => {
      state.useProgmem = el.progmemCheckbox.checked;
      updateCodePreview();
    });
    el.itemsPerRowSelect.addEventListener("change", () => {
      state.itemsPerRow = parseInt(el.itemsPerRowSelect.value) || 16;
      updateCodePreview();
    });
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
        state.activeTab = tabId;
      });
    });
    document.querySelectorAll(".sketch-subtab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".sketch-subtab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.activeSketchTab = btn.getAttribute("data-sketch");
        updateSketches();
      });
    });
    el.zoomSelect.addEventListener("change", () => {
      state.zoom = parseFloat(el.zoomSelect.value) || 2;
      applyZoom();
    });
    el.btnToggleGrid.addEventListener("click", () => {
      state.pixelGrid = !state.pixelGrid;
      el.btnToggleGrid.classList.toggle("btn-primary", state.pixelGrid);
      updatePixelGrid();
    });
    el.btnToggleBezel.addEventListener("click", () => {
      state.showBezel = !state.showBezel;
      el.hardwareBezel.style.border = state.showBezel ? "" : "none";
      el.hardwareBezel.style.padding = state.showBezel ? "" : "0";
      el.hardwareBezel.style.background = state.showBezel ? "" : "transparent";
      el.bezelLabel.style.display = state.showBezel ? "block" : "none";
      el.btnToggleBezel.classList.toggle("btn-primary", state.showBezel);
    });
    el.btnOpenFile.addEventListener("click", handleOpenFile);
    el.hiddenFileInput.addEventListener("change", handleFileInputChange);
    el.btnPasteClipboard.addEventListener("click", handlePasteFromClipboard);
    window.addEventListener("paste", handleWindowPaste);
    el.sampleSelect.addEventListener("change", () => {
      if (el.sampleSelect.value) {
        loadSample(el.sampleSelect.value);
        el.sampleSelect.value = "";
      }
    });
    el.videoScrubber.addEventListener("input", () => {
      if (state.sourceType === "video" && el.hiddenVideo.duration) {
        const time = parseFloat(el.videoScrubber.value) / 100 * el.hiddenVideo.duration;
        el.hiddenVideo.currentTime = time;
      }
    });
    el.btnVideoPlayPause.addEventListener("click", toggleVideoPlay);
    el.btnPrevFrame.addEventListener("click", () => stepVideoFrame(-1));
    el.btnNextFrame.addEventListener("click", () => stepVideoFrame(1));
    el.btnSetInPoint.addEventListener("click", () => {
      if (state.sourceType === "video") {
        state.videoInPoint = el.hiddenVideo.currentTime;
        updateRangeDisplay();
        updateVideoStats();
        showToast(`Punto de inicio fijado: ${state.videoInPoint.toFixed(2)}s`);
      }
    });
    el.btnSetOutPoint.addEventListener("click", () => {
      if (state.sourceType === "video") {
        state.videoOutPoint = el.hiddenVideo.currentTime;
        updateRangeDisplay();
        updateVideoStats();
        showToast(`Punto de fin fijado: ${state.videoOutPoint.toFixed(2)}s`);
      }
    });
    el.btnResetRange.addEventListener("click", () => {
      if (state.sourceType === "video") {
        state.videoInPoint = 0;
        state.videoOutPoint = el.hiddenVideo.duration || 0;
        updateRangeDisplay();
        updateVideoStats();
        showToast("Rango restablecido a video completo");
      }
    });
    el.videoLoopCheckbox.addEventListener("change", () => {
      state.videoLoop = el.videoLoopCheckbox.checked;
    });
    el.hiddenVideo.addEventListener("timeupdate", () => {
      if (state.sourceType === "video") {
        const t = el.hiddenVideo.currentTime;
        const d = el.hiddenVideo.duration || 1;
        el.videoScrubber.value = String(t / d * 100);
        el.currentTimeLabel.textContent = formatTime(t);
        const currentFrame = Math.round(t * state.videoTargetFps);
        el.currentFrameNum.textContent = `F: ${currentFrame}`;
        if (state.videoOutPoint > state.videoInPoint && t >= state.videoOutPoint) {
          if (state.videoLoop) {
            el.hiddenVideo.currentTime = state.videoInPoint;
          } else {
            el.hiddenVideo.pause();
            state.videoPlaying = false;
            updatePlayPauseIcon();
          }
        }
        renderCurrentFrame();
      }
    });
    el.hiddenVideo.addEventListener("seeked", () => {
      if (state.sourceType === "video" && !state.videoPlaying) {
        renderCurrentFrame();
      }
    });
    el.btnCopyCode.addEventListener("click", () => {
      copyToClipboard(el.codeOutput.textContent || "");
      showToast("\xA1C\xF3digo C/C++ copiado al portapapeles!");
    });
    el.btnCopySketch.addEventListener("click", () => {
      copyToClipboard(el.sketchOutput.textContent || "");
      showToast("\xA1Sketch Arduino copiado al portapapeles!");
    });
    el.btnHeaderExport.addEventListener("click", executeExport);
    el.btnExportMain.addEventListener("click", executeExport);
    el.btnHeaderBle.addEventListener("click", openBleModal);
    el.btnBleSendSidebar.addEventListener("click", openBleModal);
    el.btnBleCloseModal.addEventListener("click", closeBleModal);
    el.btnBleDismiss.addEventListener("click", closeBleModal);
    el.btnBlePickLocalBin.addEventListener("click", handleBlePickLocalBin);
    el.btnBleStartUpload.addEventListener("click", startBleUpload);
    el.btnBleCancelUpload.addEventListener("click", cancelBleUpload);
    el.bleTabBtnUpload.addEventListener("click", () => switchBleTab("upload"));
    el.bleTabBtnBatch.addEventListener("click", () => switchBleTab("batch"));
    el.bleTabBtnManager.addEventListener("click", () => switchBleTab("manager"));
    el.bleTabBtnSettings.addEventListener("click", () => switchBleTab("settings"));
    el.btnBleRefreshFiles.addEventListener("click", () => loadBleSDFiles());
    el.btnBleAddBatchFiles.addEventListener("click", handleAddBatchFiles);
    el.btnBleClearBatch.addEventListener("click", () => {
      if (!isBatchUploading) {
        batchQueue = [];
        renderBatchList();
      }
    });
    el.btnBleStartBatchUpload.addEventListener("click", startBleBatchUpload);
    el.hiddenBatchFileInput.addEventListener("change", handleBatchFileInputChange);
    const savedSlideEn = localStorage.getItem("bm_slide_en");
    if (savedSlideEn !== null && el.bleSettingSlideshow) {
      el.bleSettingSlideshow.checked = savedSlideEn === "1";
    }
    const savedSlideSec = localStorage.getItem("bm_slide_sec");
    if (savedSlideSec !== null && el.bleSettingSlideInterval) {
      el.bleSettingSlideInterval.value = savedSlideSec;
      if (el.bleSlideIntervalLabel) el.bleSlideIntervalLabel.textContent = `${savedSlideSec} segundos`;
    }
    const savedTrans = localStorage.getItem("bm_trans_mode");
    if (savedTrans !== null && el.bleSettingTransition) {
      el.bleSettingTransition.value = savedTrans;
    }
    const savedBright = localStorage.getItem("bm_brightness");
    if (savedBright !== null && el.bleSettingBrightness) {
      el.bleSettingBrightness.value = savedBright;
      if (el.bleSettingBrightnessLabel) el.bleSettingBrightnessLabel.textContent = `${savedBright}%`;
    }
    if (el.bleSettingSlideInterval) {
      el.bleSettingSlideInterval.addEventListener("change", () => {
        const val = el.bleSettingSlideInterval.value;
        if (el.bleSlideIntervalLabel) el.bleSlideIntervalLabel.textContent = `${val} segundos`;
        localStorage.setItem("bm_slide_sec", val);
      });
    }
    if (el.bleSettingSlideshow) {
      el.bleSettingSlideshow.addEventListener("change", () => {
        localStorage.setItem("bm_slide_en", el.bleSettingSlideshow.checked ? "1" : "0");
      });
    }
    if (el.bleSettingTransition) {
      el.bleSettingTransition.addEventListener("change", () => {
        localStorage.setItem("bm_trans_mode", el.bleSettingTransition.value);
      });
    }
    if (el.bleSettingBrightness) {
      el.bleSettingBrightness.addEventListener("input", () => {
        const pct = el.bleSettingBrightness.value;
        if (el.bleSettingBrightnessLabel) el.bleSettingBrightnessLabel.textContent = `${pct}%`;
        localStorage.setItem("bm_brightness", pct);
      });
    }
    if (el.btnBleApplySettings) {
      el.btnBleApplySettings.addEventListener("click", handleBleApplySettings);
    }
    if (el.btnBleRemotePrev) {
      el.btnBleRemotePrev.addEventListener("click", handleBleRemotePrev);
    }
    if (el.btnBleRemoteNext) {
      el.btnBleRemoteNext.addEventListener("click", handleBleRemoteNext);
    }
    const optBleFull = document.getElementById("bleOptVideoFull");
    const optBleFrame = document.getElementById("bleOptVideoFrame");
    if (optBleFull) optBleFull.addEventListener("change", updateBleModalFileInfo);
    if (optBleFrame) optBleFrame.addEventListener("change", updateBleModalFileInfo);
    el.bleModalOverlay.addEventListener("click", (e) => {
      if (e.target === el.bleModalOverlay) {
        closeBleModal();
      }
    });
    if (window.bitmapperAPI && window.bitmapperAPI.onBluetoothDevices) {
      window.bitmapperAPI.onBluetoothDevices((devices) => {
        const bm = devices.find((d) => d.deviceName && d.deviceName.toLowerCase().includes("bitmapper"));
        if (bm) {
          el.bleDeviceNameLabel.textContent = `${bm.deviceName || "BitMapper-ESP32"} (Detectado)`;
        }
      });
    }
    el.targetCanvas.addEventListener("mousemove", handlePixelHover);
    el.targetCanvas.addEventListener("mouseleave", () => {
      el.pixelInspector.style.display = "none";
      el.statusPixelCoord.textContent = "X: 0, Y: 0";
    });
    setupDragAndDrop();
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "o") {
        e.preventDefault();
        handleOpenFile();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        executeExport();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        openBleModal();
      } else if (e.code === "Space" && state.sourceType === "video") {
        e.preventDefault();
        toggleVideoPlay();
      } else if (e.code === "ArrowLeft" && state.sourceType === "video") {
        e.preventDefault();
        stepVideoFrame(-1);
      } else if (e.code === "ArrowRight" && state.sourceType === "video") {
        e.preventDefault();
        stepVideoFrame(1);
      }
    });
  }
  function updateBezelStyle(shape, name) {
    el.hardwareBezel.className = `hardware-bezel ${shape}`;
    el.bezelLabel.textContent = name;
  }
  function applyZoom() {
    el.targetCanvas.style.width = `${state.targetWidth * state.zoom}px`;
    el.targetCanvas.style.height = `${state.targetHeight * state.zoom}px`;
  }
  function updatePixelGrid() {
    if (state.pixelGrid && state.zoom >= 3) {
      el.targetCanvas.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.15)";
      el.bezelScreenGlass.classList.add("pixel-grid-active");
    } else {
      el.targetCanvas.style.boxShadow = "none";
      el.bezelScreenGlass.classList.remove("pixel-grid-active");
    }
  }
  function handlePixelHover(e) {
    const rect = el.targetCanvas.getBoundingClientRect();
    const scaleX = state.targetWidth / rect.width;
    const scaleY = state.targetHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    if (x < 0 || x >= state.targetWidth || y < 0 || y >= state.targetHeight) {
      el.pixelInspector.style.display = "none";
      return;
    }
    const p = targetCtx.getImageData(x, y, 1, 1).data;
    const r5 = p[0] >> 3 & 31;
    const g6 = p[1] >> 2 & 63;
    const b5 = p[2] >> 3 & 31;
    const rgb565 = r5 << 11 | g6 << 5 | b5;
    const hex565 = "0x" + rgb565.toString(16).toUpperCase().padStart(4, "0");
    el.statusPixelCoord.textContent = `X: ${x}, Y: ${y} | RGB: (${p[0]}, ${p[1]}, ${p[2]}) | RGB565: ${hex565}`;
    el.inspectorSwatch.style.backgroundColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
    el.inspectorText.textContent = `(${x}, ${y}) RGB: (${p[0]}, ${p[1]}, ${p[2]}) -> ${hex565}`;
    el.pixelInspector.style.display = "block";
    el.pixelInspector.style.left = `${e.clientX + 15}px`;
    el.pixelInspector.style.top = `${e.clientY + 15}px`;
  }
  async function handleOpenFile() {
    if (window.bitmapperAPI && window.bitmapperAPI.openFile) {
      const fileInfo = await window.bitmapperAPI.openFile();
      if (!fileInfo) return;
      const fileUrl = "file:///" + fileInfo.filePath.replace(/\\/g, "/");
      loadMediaFromUrl(fileUrl, fileInfo.fileName, fileInfo.baseName, fileInfo.isVideo);
    } else {
      el.hiddenFileInput.click();
    }
  }
  function handleFileInputChange(e) {
    const target = e.target;
    const file = target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
    const url = URL.createObjectURL(file);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    loadMediaFromUrl(url, file.name, baseName, isVideo);
    el.hiddenFileInput.value = "";
  }
  function loadMediaFromUrl(url, fileName, baseName, isVideo) {
    state.sourceFileName = fileName;
    state.sourceBaseName = baseName;
    state.variableName = baseName.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    el.variableNameInput.value = state.variableName;
    if (isVideo) {
      state.sourceType = "video";
      state.exportFormat = "binary";
      el.sourceTypeBadge.textContent = "VIDEO";
      el.sourceTypeBadge.style.background = "rgba(139, 92, 246, 0.2)";
      el.sourceTypeBadge.style.color = "var(--accent-violet)";
      el.videoSection.style.display = "block";
      el.videoTimelineBar.classList.add("visible");
      updateExportFormatsForSource();
      el.hiddenVideo.src = url;
      el.hiddenVideo.load();
      el.hiddenVideo.onloadedmetadata = () => {
        state.sourceWidth = el.hiddenVideo.videoWidth;
        state.sourceHeight = el.hiddenVideo.videoHeight;
        state.videoDuration = el.hiddenVideo.duration;
        state.videoInPoint = 0;
        state.videoOutPoint = el.hiddenVideo.duration;
        el.sourceDetails.innerHTML = `<strong>${fileName}</strong><br>Resoluci\xF3n: ${state.sourceWidth}\xD7${state.sourceHeight} px<br>Duraci\xF3n: ${state.videoDuration.toFixed(1)}s`;
        el.videoDurationBadge.textContent = `${state.videoDuration.toFixed(1)}s`;
        el.totalTimeLabel.textContent = formatTime(state.videoDuration);
        updateRangeDisplay();
        updateVideoStats();
        el.hiddenVideo.currentTime = 0;
        showToast(`Video cargado: ${fileName}`);
      };
    } else {
      state.sourceType = "image";
      el.sourceTypeBadge.textContent = "IMAGEN";
      el.sourceTypeBadge.style.background = "rgba(6, 182, 212, 0.15)";
      el.sourceTypeBadge.style.color = "var(--accent-cyan)";
      el.videoSection.style.display = "none";
      el.videoTimelineBar.classList.remove("visible");
      updateExportFormatsForSource();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        state.sourceElement = img;
        state.sourceWidth = img.naturalWidth;
        state.sourceHeight = img.naturalHeight;
        el.sourceDetails.innerHTML = `<strong>${fileName}</strong><br>Resoluci\xF3n: ${state.sourceWidth}\xD7${state.sourceHeight} px`;
        showToast(`Imagen cargada: ${fileName}`);
        updatePipeline();
      };
      img.src = url;
    }
  }
  async function handlePasteFromClipboard() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const url = URL.createObjectURL(blob);
            loadMediaFromUrl(url, "pasted_image.png", "pasted_image", false);
            return;
          }
        }
      }
      showToast("No se encontr\xF3 ninguna imagen en el portapapeles");
    } catch {
      showToast("Presiona Ctrl+V para pegar directamente");
    }
  }
  function handleWindowPaste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf("image") !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const url = URL.createObjectURL(blob);
            loadMediaFromUrl(url, "pasted_image.png", "pasted_image", false);
            return;
          }
        }
      }
    }
  }
  function setupDragAndDrop() {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.dragOverlay.classList.add("active");
    });
    window.addEventListener("dragleave", (e) => {
      if (e.relatedTarget === null) {
        el.dragOverlay.classList.remove("active");
      }
    });
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      el.dragOverlay.classList.remove("active");
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        if (e.dataTransfer.files.length === 1) {
          const file = e.dataTransfer.files[0];
          const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
          const url = URL.createObjectURL(file);
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          loadMediaFromUrl(url, file.name, baseName, isVideo);
        } else {
          const filesToAdd = [];
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const f = e.dataTransfer.files[i];
            const isBin = f.name.toLowerCase().endsWith(".bin");
            filesToAdd.push({ name: f.name, file: f, isBin });
          }
          addFilesToBatch(filesToAdd);
          openBleModal();
          switchBleTab("batch");
          showToast(`\xA1${filesToAdd.length} im\xE1genes a\xF1adidas a la cola por lote!`);
        }
      }
    });
  }
  function toggleVideoPlay() {
    if (state.sourceType !== "video") return;
    if (state.videoPlaying) {
      el.hiddenVideo.pause();
      state.videoPlaying = false;
    } else {
      if (el.hiddenVideo.currentTime >= state.videoOutPoint) {
        el.hiddenVideo.currentTime = state.videoInPoint;
      }
      el.hiddenVideo.play();
      state.videoPlaying = true;
    }
    updatePlayPauseIcon();
  }
  function updatePlayPauseIcon() {
    el.playIcon.style.display = state.videoPlaying ? "none" : "block";
    el.pauseIcon.style.display = state.videoPlaying ? "block" : "none";
  }
  function stepVideoFrame(dir) {
    if (state.sourceType !== "video") return;
    el.hiddenVideo.pause();
    state.videoPlaying = false;
    updatePlayPauseIcon();
    const step = 1 / state.videoTargetFps;
    let nextTime = el.hiddenVideo.currentTime + dir * step;
    nextTime = Math.max(0, Math.min(el.hiddenVideo.duration, nextTime));
    el.hiddenVideo.currentTime = nextTime;
  }
  function updateRangeDisplay() {
    el.rangeDisplay.textContent = `Rango: ${state.videoInPoint.toFixed(1)}s a ${state.videoOutPoint.toFixed(1)}s`;
  }
  function updateVideoStats() {
    if (state.sourceType !== "video") return;
    const duration = Math.max(0, state.videoOutPoint - state.videoInPoint);
    const totalFrames = Math.max(1, Math.round(duration * state.videoTargetFps));
    const bytesPerPixel = (COLOR_FORMATS.find((x) => x.id === state.colorFormat) || {}).bytesPerPixel || 2;
    const bytesPerFrame = state.targetWidth * state.targetHeight * bytesPerPixel;
    const totalBytes = bytesPerFrame * totalFrames;
    el.videoTotalFrames.textContent = String(totalFrames);
    el.videoEstFlash.textContent = `${(totalBytes / 1024).toFixed(1)} KB`;
  }
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor(sec % 1 * 100);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }
  function loadSample(type) {
    const sCanvas = document.createElement("canvas");
    sCanvas.width = 300;
    sCanvas.height = 300;
    const sCtx = sCanvas.getContext("2d");
    if (type === "cyberpunk") {
      const grad = sCtx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0, "#0a0a23");
      grad.addColorStop(0.6, "#4a0e4e");
      grad.addColorStop(1, "#ff007f");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 300, 300);
      sCtx.beginPath();
      sCtx.arc(150, 140, 60, 0, Math.PI * 2);
      sCtx.fillStyle = "#ffde59";
      sCtx.shadowColor = "#ff577f";
      sCtx.shadowBlur = 30;
      sCtx.fill();
      sCtx.shadowBlur = 0;
      sCtx.fillStyle = "#4a0e4e";
      for (let y = 140; y < 200; y += 8) {
        sCtx.fillRect(80, y, 140, (y - 130) * 0.08 + 2);
      }
      sCtx.fillStyle = "#050510";
      sCtx.fillRect(0, 190, 300, 110);
      sCtx.strokeStyle = "#00f0ff";
      sCtx.lineWidth = 1.5;
      for (let x = -50; x <= 350; x += 30) {
        sCtx.beginPath();
        sCtx.moveTo(x, 300);
        sCtx.lineTo(150, 190);
        sCtx.stroke();
      }
      for (let y = 195; y <= 300; y += (y - 180) * 0.4 + 4) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(300, y);
        sCtx.stroke();
      }
      sCtx.font = "bold 22px sans-serif";
      sCtx.fillStyle = "#00f0ff";
      sCtx.textAlign = "center";
      sCtx.shadowColor = "#00f0ff";
      sCtx.shadowBlur = 15;
      sCtx.fillText("ESP32 ST7789", 150, 50);
    } else if (type === "colorwheel") {
      sCtx.fillStyle = "#111";
      sCtx.fillRect(0, 0, 300, 300);
      const cx = 150, cy = 150, radius = 120;
      for (let angle = 0; angle < 360; angle += 1) {
        const rad = angle * Math.PI / 180;
        sCtx.beginPath();
        sCtx.moveTo(cx, cy);
        sCtx.arc(cx, cy, radius, rad, rad + Math.PI / 180 * 1.5);
        sCtx.closePath();
        sCtx.fillStyle = `hsl(${angle}, 100%, 50%)`;
        sCtx.fill();
      }
    } else if (type === "testcard") {
      const colors = ["#ffffff", "#ffff00", "#00ffff", "#00ff00", "#ff00ff", "#ff0000", "#0000ff"];
      const barW = 300 / 7;
      colors.forEach((c, idx) => {
        sCtx.fillStyle = c;
        sCtx.fillRect(idx * barW, 0, barW, 200);
      });
      sCtx.fillStyle = "#0000ff";
      sCtx.fillRect(0, 200, 300 / 6, 100);
      sCtx.fillStyle = "#ffffff";
      sCtx.fillRect(300 / 6, 200, 300 / 6, 100);
      sCtx.fillStyle = "#ff00ff";
      sCtx.fillRect(300 / 6 * 2, 200, 300 / 6, 100);
      sCtx.fillStyle = "#131313";
      sCtx.fillRect(300 / 6 * 3, 200, 300 / 2, 100);
    } else {
      sCtx.fillStyle = "#0d1117";
      sCtx.fillRect(0, 0, 300, 300);
      sCtx.fillStyle = "#1f242c";
      sCtx.fillRect(60, 60, 180, 180);
      sCtx.strokeStyle = "#f59e0b";
      sCtx.lineWidth = 4;
      sCtx.strokeRect(60, 60, 180, 180);
      sCtx.fillStyle = "#94a3b8";
      for (let i = 80; i <= 220; i += 20) {
        sCtx.fillRect(i - 4, 40, 8, 20);
        sCtx.fillRect(i - 4, 240, 8, 20);
        sCtx.fillRect(40, i - 4, 20, 8);
        sCtx.fillRect(240, i - 4, 20, 8);
      }
      sCtx.fillStyle = "#fff";
      sCtx.font = "bold 20px monospace";
      sCtx.textAlign = "center";
      sCtx.fillText("ESP32-S3", 150, 145);
      sCtx.font = "12px monospace";
      sCtx.fillStyle = "#10b981";
      sCtx.fillText("240MHz Dual-Core", 150, 175);
    }
    const img = new Image();
    img.onload = () => {
      state.sourceType = "image";
      state.sourceElement = img;
      state.sourceFileName = `sample_${type}.png`;
      state.sourceBaseName = `sample_${type}`;
      state.variableName = `sample_${type}`;
      el.variableNameInput.value = state.variableName;
      state.sourceWidth = 300;
      state.sourceHeight = 300;
      el.sourceTypeBadge.textContent = "EJEMPLO";
      el.sourceTypeBadge.style.background = "rgba(16, 185, 129, 0.15)";
      el.sourceTypeBadge.style.color = "var(--accent-emerald)";
      el.videoSection.style.display = "none";
      el.videoTimelineBar.classList.remove("visible");
      el.sourceDetails.innerHTML = `<strong>Ejemplo: ${type.toUpperCase()}</strong><br>Resoluci\xF3n: 300\xD7300 px`;
      updateExportFormatsForSource();
      updatePipeline();
    };
    img.src = sCanvas.toDataURL();
  }
  function updatePipeline() {
    if (state.sourceType === "video") {
      renderCurrentFrame();
    } else if (state.sourceElement) {
      processFrame(state.sourceElement);
    }
  }
  function renderCurrentFrame() {
    if (state.sourceType === "video" && el.hiddenVideo.readyState >= 2) {
      processFrame(el.hiddenVideo);
    }
  }
  function processFrame(source) {
    const tw = state.targetWidth;
    const th = state.targetHeight;
    workCanvas.width = tw;
    workCanvas.height = th;
    el.targetCanvas.width = tw;
    el.targetCanvas.height = th;
    el.compareTargetCanvas.width = tw;
    el.compareTargetCanvas.height = th;
    applyZoom();
    updatePixelGrid();
    renderOriginalCanvas(source);
    workCtx.save();
    workCtx.fillStyle = state.bgColor;
    workCtx.fillRect(0, 0, tw, th);
    workCtx.translate(tw / 2, th / 2);
    if (state.rotation !== 0) {
      workCtx.rotate(state.rotation * Math.PI / 180);
    }
    workCtx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
    const sw = source.videoWidth || source.naturalWidth || source.width;
    const sh = source.videoHeight || source.naturalHeight || source.height;
    let dw = tw, dh = th;
    let dx = -tw / 2, dy = -th / 2;
    if (state.scalingMode === "stretch") {
      dw = tw;
      dh = th;
    } else if (state.scalingMode === "center") {
      dw = sw;
      dh = sh;
      dx = -sw / 2;
      dy = -sh / 2;
    } else if (state.scalingMode === "contain") {
      const scale = Math.min(tw / sw, th / sh);
      dw = sw * scale;
      dh = sh * scale;
      dx = -dw / 2;
      dy = -dh / 2;
    } else if (state.scalingMode === "cover") {
      const scale = Math.max(tw / sw, th / sh);
      dw = sw * scale;
      dh = sh * scale;
      dx = -dw / 2;
      dy = -dh / 2;
    }
    workCtx.drawImage(source, dx, dy, dw, dh);
    workCtx.restore();
    const imgData = workCtx.getImageData(0, 0, tw, th);
    const d = imgData.data;
    const bAdj = state.brightness;
    const cFactor = 259 * (state.contrast + 255) / (255 * (259 - state.contrast));
    const gammaVal = state.gamma;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      if (bAdj !== 0) {
        r += bAdj;
        g += bAdj;
        b += bAdj;
      }
      if (state.contrast !== 0) {
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;
      }
      if (gammaVal !== 1) {
        r = 255 * Math.pow(Math.max(0, r) / 255, 1 / gammaVal);
        g = 255 * Math.pow(Math.max(0, g) / 255, 1 / gammaVal);
        b = 255 * Math.pow(Math.max(0, b) / 255, 1 / gammaVal);
      }
      d[i] = clamp(r);
      d[i + 1] = clamp(g);
      d[i + 2] = clamp(b);
    }
    const quantizedData = applyDithering(
      d,
      tw,
      th,
      state.ditherAlgorithm,
      state.colorFormat,
      state.threshold
    );
    const finalImgData = targetCtx.createImageData(tw, th);
    finalImgData.data.set(quantizedData);
    targetCtx.putImageData(finalImgData, 0, 0);
    compareCtx.putImageData(finalImgData, 0, 0);
    const encoded = encodeBitmap(quantizedData, tw, th, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      invert: state.invertColors
    });
    state.currentEncoded = encoded;
    el.statusDim.textContent = `Resoluci\xF3n: ${tw} \xD7 ${th} px`;
    const fmt = COLOR_FORMATS.find((x) => x.id === state.colorFormat);
    el.statusFormat.textContent = `${fmt ? fmt.name.split(" ")[0] : "RGB565"} | Dither: ${state.ditherAlgorithm.toUpperCase()}`;
    el.statusMemory.textContent = `Memoria: ${(encoded.sizeBytes / 1024).toFixed(1)} KB`;
    updateCodePreview();
    updateSketches();
  }
  function renderOriginalCanvas(source) {
    const sw = source.videoWidth || source.naturalWidth || source.width;
    const sh = source.videoHeight || source.naturalHeight || source.height;
    el.originalCanvas.width = sw;
    el.originalCanvas.height = sh;
    originalCtx.drawImage(source, 0, 0);
  }
  function updateCodePreview() {
    if (!state.currentEncoded) return;
    const ef = state.exportFormat;
    const name = state.variableName;
    const tw = state.targetWidth;
    const th = state.targetHeight;
    const { values, bytes, dataType } = state.currentEncoded;
    const isVideoSeq = state.sourceType === "video" && state.videoExportMode === "sequence";
    let code = "";
    if (isVideoSeq) {
      const fps = state.videoTargetFps || 15;
      const animFileName = `${name}_anim_${fps}fps.bin`;
      if (ef === "binary") {
        el.codePreviewTitle.textContent = `${animFileName} (Video Binario MicroSD)`;
        code = `// =============================================================================
// EXPORTACI\xD3N DIRECTA DE VIDEO CONTINUO PARA MICROSD (ESP32)
// =============================================================================
// Archivo de salida directo: ${animFileName}
// Resoluci\xF3n: ${tw}x${th} p\xEDxeles | Formato de color: ${state.colorFormat.toUpperCase()}
// FPS configurados: ~${fps} FPS (Detectados autom\xE1ticamente por el ESP32)

// Al pulsar "Exportar Video", se guardar\xE1 directamente este archivo \xFAnico .bin.
// C\xF3pialo directamente a la ra\xEDz de tu MicroSD (ejemplo: E:\\${animFileName})
// y tu ESP32 lo reproducir\xE1 autom\xE1ticamente a ${fps} FPS en bucle continuo.`;
      } else if (ef === "zip_sequence") {
        el.codePreviewTitle.textContent = `${name}_anim_${fps}fps.zip (Paquete con ${animFileName} + Sketch)`;
        code = `// =============================================================================
// PAQUETE ZIP PARA ESP32
// =============================================================================
// Contenido directo en la ra\xEDz del archivo ZIP:
// 1. ${animFileName}          -> Archivo de video a ${fps} FPS para la ra\xEDz de la MicroSD
// 2. esp32_video_animation.ino -> Sketch Arduino listo para compilar en PlatformIO/IDE
// 3. INSTRUCCIONES_MICROSD.txt -> Gu\xEDa paso a paso para el usuario`;
      } else if (ef === "c_header") {
        el.codePreviewTitle.textContent = `${name}_anim_${fps}fps.h (Cabecera C/C++ Flash)`;
        code = `// Secuencia de animaci\xF3n C/C++ para memoria Flash PROGMEM.
// (Atenci\xF3n: Para secuencias largas de video, se recomienda usar el formato .bin en MicroSD).`;
      }
    } else if (ef === "c_header") {
      el.codePreviewTitle.textContent = `${name}.h (C/C++ Header)`;
      code = generateCHeaderSingle(name, tw, th, values, dataType, {
        colorFormat: state.colorFormat,
        endian: state.endian,
        swapBytes: state.swapBytes,
        useProgmem: state.useProgmem,
        itemsPerLine: state.itemsPerRow
      });
    } else if (ef === "binary") {
      el.codePreviewTitle.textContent = `${name}.bin (Raw Binary)`;
      code = `// Vista previa en texto del archivo binario (.bin)
// Tama\xF1o total: ${bytes.length} bytes

` + generateHexDump(bytes.slice(0, 512), 16) + `

... (${bytes.length - 512} bytes restantes se exportar\xE1n en el archivo .bin)`;
    } else if (ef === "hex_dump") {
      el.codePreviewTitle.textContent = `${name}.hex (Hex Dump)`;
      code = generateHexDump(bytes, state.itemsPerRow);
    } else if (ef === "python") {
      el.codePreviewTitle.textContent = `${name}.py (MicroPython)`;
      code = generateMicroPython(name, tw, th, bytes);
    } else if (ef === "png_preview") {
      el.codePreviewTitle.textContent = `${name}_preview.png (Imagen Renderizada)`;
      code = `// Al pulsar "Exportar", se guardar\xE1 una imagen PNG exacta
// con la resoluci\xF3n de pantalla (${tw}x${th}) y la paleta de colores cuantizada.`;
    } else if (ef === "zip_sequence") {
      el.codePreviewTitle.textContent = `${name}_sequence.zip (Paquete de Fotogramas)`;
      code = `// Al exportar en formato ZIP, se empaquetar\xE1n los archivos necesarios junto al sketch maestro para ESP32.`;
    }
    el.codeOutput.textContent = code;
  }
  function updateSketches() {
    const isVideo = state.sourceType === "video";
    const sketches = generateESP32Sketches(
      state.variableName,
      state.targetWidth,
      state.targetHeight,
      isVideo,
      state.videoTargetFps
    );
    el.sketchOutput.textContent = sketches[state.activeSketchTab] || sketches.tft_espi;
  }
  async function executeExport() {
    if (!state.currentEncoded) {
      showToast("No hay datos de imagen para exportar");
      return;
    }
    const isVideo = state.sourceType === "video";
    const isSequence = isVideo && state.videoExportMode === "sequence";
    showToast("Procesando exportaci\xF3n...");
    if (isSequence) {
      await exportVideoSequence();
    } else {
      await exportSingleFrame();
    }
  }
  async function exportSingleFrame() {
    if (!state.currentEncoded) return;
    const name = state.variableName;
    const ef = state.exportFormat;
    const tw = state.targetWidth;
    const th = state.targetHeight;
    const { values, bytes, dataType } = state.currentEncoded;
    if (ef === "c_header") {
      const content = generateCHeaderSingle(name, tw, th, values, dataType, {
        colorFormat: state.colorFormat,
        endian: state.endian,
        swapBytes: state.swapBytes,
        useProgmem: state.useProgmem,
        itemsPerLine: state.itemsPerRow
      });
      await saveFileOrDownload(`${name}.h`, content, "text/x-c", false);
    } else if (ef === "binary") {
      await saveFileOrDownload(`${name}.bin`, bytes, "application/octet-stream", true);
    } else if (ef === "bmpr") {
      const bmprData = generateBmprBinary(tw, th, bytes, 1, 15, state.colorFormat, state.swapBytes);
      await saveFileOrDownload(`${name}.bmpr`, bmprData, "application/octet-stream", true);
    } else if (ef === "hex_dump") {
      const content = generateHexDump(bytes, state.itemsPerRow);
      await saveFileOrDownload(`${name}.hex`, content, "text/plain", false);
    } else if (ef === "python") {
      const content = generateMicroPython(name, tw, th, bytes);
      await saveFileOrDownload(`${name}.py`, content, "text/x-python", false);
    } else if (ef === "png_preview") {
      el.targetCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const buffer = await blob.arrayBuffer();
        await saveFileOrDownload(`${name}.png`, new Uint8Array(buffer), "image/png", true);
      });
    } else if (ef === "zip_sequence") {
      const zip = new import_jszip.default();
      const cHeader = generateCHeaderSingle(name, tw, th, values, dataType, {
        colorFormat: state.colorFormat,
        endian: state.endian,
        swapBytes: state.swapBytes,
        useProgmem: state.useProgmem,
        itemsPerLine: state.itemsPerRow
      });
      zip.file(`${name}.h`, cHeader);
      zip.file(`${name}.bin`, bytes);
      const sketches = generateESP32Sketches(name, tw, th, false);
      zip.file("esp32_tft_espi_demo.ino", sketches.tft_espi);
      const zipBlob = await zip.generateAsync({ type: "uint8array" });
      await saveFileOrDownload(`${name}.zip`, zipBlob, "application/zip", true);
    }
  }
  async function exportVideoSequence() {
    if (!state.currentEncoded) return;
    const name = state.variableName;
    const ef = state.exportFormat;
    const tw = state.targetWidth;
    const th = state.targetHeight;
    const fps = state.videoTargetFps;
    const inP = state.videoInPoint;
    const outP = state.videoOutPoint;
    const step = 1 / Math.max(1, fps);
    const expectedFrames = Math.max(1, Math.round((outP - inP) * fps) + 1);
    if (ef === "c_header" && expectedFrames > 30) {
      const bytesPerPixel = COLOR_FORMATS.find((x) => x.id === state.colorFormat)?.bytesPerPixel || 2;
      const estMb = (expectedFrames * tw * th * bytesPerPixel / (1024 * 1024)).toFixed(1);
      const proceed = confirm(
        `\u26A0\uFE0F AVISO DE MEMORIA FLASH ESP32:

La animaci\xF3n seleccionada tiene ~${expectedFrames} fotogramas (${estMb} MB en Flash).
Un ESP32 est\xE1ndar suele tener 4 MB de Flash total (con ~2.5 MB libres para c\xF3digo).

\xBFDeseas continuar con todos los fotogramas?
\u2022 Aceptar: Exportar toda la secuencia en el archivo .h
\u2022 Cancelar: Volver a la app para recortar el rango [In/Out], bajar los FPS o usar exportaci\xF3n ZIP / Binaria.`
      );
      if (!proceed) {
        showToast("Exportaci\xF3n cancelada para ajustar rango");
        return;
      }
    }
    el.statusReady.textContent = "Iniciando extracci\xF3n de fotogramas...";
    el.hiddenVideo.pause();
    state.videoPlaying = false;
    updatePlayPauseIcon();
    const frames = [];
    const origTime = el.hiddenVideo.currentTime;
    for (let t = inP; t <= outP + 1e-4; t += step) {
      await seekVideo(t);
      processFrame(el.hiddenVideo);
      if (state.currentEncoded) {
        frames.push({
          time: t,
          values: [...state.currentEncoded.values],
          bytes: new Uint8Array(state.currentEncoded.bytes)
        });
      }
      el.statusReady.textContent = `Extrayendo fotograma ${frames.length} / ${expectedFrames}...`;
      await new Promise((r) => setTimeout(r, 15));
    }
    el.hiddenVideo.currentTime = origTime;
    el.statusReady.textContent = "Listo";
    if (frames.length === 0) {
      showToast("Error: No se pudieron extraer fotogramas del video");
      return;
    }
    const singleSize = frames[0].bytes.byteLength;
    const combinedBytes = new Uint8Array(frames.length * singleSize);
    frames.forEach((f, idx) => {
      combinedBytes.set(f.bytes, idx * singleSize);
    });
    if (ef === "c_header") {
      showToast(`Generando cabecera C/C++ (${frames.length} fotogramas)...`);
      await new Promise((r) => setTimeout(r, 50));
      const headerCode = generateCHeaderSequence(name, tw, th, frames, state.currentEncoded.dataType, fps, {
        colorFormat: state.colorFormat,
        endian: state.endian,
        swapBytes: state.swapBytes,
        useProgmem: state.useProgmem,
        itemsPerLine: state.itemsPerRow
      });
      await saveFileOrDownload(`${name}_anim_${fps}fps.h`, headerCode, "text/x-c", false);
    } else if (ef === "zip_sequence") {
      showToast(`Empaquetando video anim.bin y sketch en ZIP...`);
      await new Promise((r) => setTimeout(r, 50));
      const zip = new import_jszip.default();
      const animFileName = `${name}_anim_${fps}fps.bin`;
      zip.file(animFileName, combinedBytes);
      const sketches = generateESP32Sketches(name, tw, th, true, fps);
      zip.file("esp32_video_animation.ino", sketches.tft_espi);
      const readmeContent = `=============================================================================
  BitMapper Studio - Video Animacion para ESP32 + MicroSD
=============================================================================
Archivo de video: ${animFileName}
Resolucion: ${tw}x${th} pixeles
Fotogramas: ${frames.length} cuadros
Velocidad configurada: ~${fps} FPS (detectada autom\xE1ticamente por el firmware)
Tamano total: ${combinedBytes.byteLength} bytes (${(combinedBytes.byteLength / (1024 * 1024)).toFixed(2)} MB)

INSTRUCCIONES PARA REPRODUCIR EN TU ESP32:
1. Copia el archivo "${animFileName}" directamente en la RAIZ de tu tarjeta MicroSD (ejemplo: E:\\${animFileName}).
   \xA1No lo metas dentro de carpetas!
2. Inserta la MicroSD en el lector SPI de tu ESP32.
3. El firmware detectara automaticamente los ${frames.length} fotogramas y la etiqueta "_${fps}fps"
   para reproducir el video a ~${fps} FPS continuos sin saltos.
=============================================================================
`;
      zip.file("INSTRUCCIONES_MICROSD.txt", readmeContent);
      const zipData = await zip.generateAsync({ type: "uint8array" });
      await saveFileOrDownload(`${name}_anim_${fps}fps.zip`, zipData, "application/zip", true);
    } else if (ef === "bmpr") {
      const animFileName = `${name}_anim_${fps}fps.bmpr`;
      showToast(`Exportando ${animFileName} con cabecera BMPR (${frames.length} cuadros a ${fps} FPS)...`);
      const bmprHeader = createBmprHeader(tw, th, frames.length, fps, state.colorFormat, state.swapBytes);
      const combined = new Uint8Array(bmprHeader.length + combinedBytes.byteLength);
      combined.set(bmprHeader, 0);
      combined.set(combinedBytes, bmprHeader.length);
      await saveFileOrDownload(animFileName, combined, "application/octet-stream", true);
    } else {
      const animFileName = `${name}_anim_${fps}fps.bin`;
      showToast(`Exportando ${animFileName} (${frames.length} fotogramas a ${fps} FPS)...`);
      await new Promise((r) => setTimeout(r, 40));
      await saveFileOrDownload(animFileName, combinedBytes, "application/octet-stream", true);
    }
  }
  function seekVideo(time) {
    return new Promise((resolve) => {
      if (Math.abs(el.hiddenVideo.currentTime - time) < 0.01) {
        resolve();
        return;
      }
      let settled = false;
      let fallbackTimer;
      const complete = () => {
        if (settled) return;
        settled = true;
        clearTimeout(fallbackTimer);
        el.hiddenVideo.removeEventListener("seeked", onSeeked);
        setTimeout(resolve, 20);
      };
      const onSeeked = () => {
        complete();
      };
      fallbackTimer = setTimeout(complete, 600);
      el.hiddenVideo.addEventListener("seeked", onSeeked, { once: true });
      el.hiddenVideo.currentTime = time;
    });
  }
  async function saveFileOrDownload(defaultName, data, mimeType, isBinary) {
    if (window.bitmapperAPI && window.bitmapperAPI.saveFile && window.bitmapperAPI.writeFile) {
      const ext = defaultName.split(".").pop() || "";
      const filePath = await window.bitmapperAPI.saveFile({
        defaultName,
        extension: ext,
        filterName: `${ext.toUpperCase()} File`
      });
      if (!filePath) return;
      const result = await window.bitmapperAPI.writeFile({
        filePath,
        content: data,
        isBinary
      });
      if (result.success) {
        showToast(`Archivo guardado: ${defaultName}`);
        if (window.bitmapperAPI.revealInFolder) {
          window.bitmapperAPI.revealInFolder(filePath);
        }
      } else {
        showToast(`Error al guardar: ${result.error}`);
      }
    } else {
      const blob = isBinary ? new Blob([data.buffer], { type: mimeType }) : new Blob([data], { type: `${mimeType};charset=utf-8` });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = defaultName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Descargado: ${defaultName}`);
    }
  }
  var toastTimer = null;
  function showToast(msg) {
    el.toastMessage.textContent = msg;
    el.toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove("show");
    }, 3e3);
  }
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }
  var bleCustomBin = null;
  var bleAbortController = null;
  function updateBleModalFileInfo() {
    const isVideo = state.sourceType === "video";
    const optFull = document.getElementById("bleOptVideoFull");
    const sendFullVideo = isVideo && !bleCustomBin && (optFull ? optFull.checked : true);
    if (!bleCustomBin) {
      if (isVideo && sendFullVideo) {
        const fps = state.videoTargetFps || 15;
        const inP = state.videoInPoint || 0;
        const outP = state.videoOutPoint > inP ? state.videoOutPoint : state.videoDuration || 1;
        const duration = Math.max(0.1, outP - inP);
        const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);
        const singleFrameBytes = state.targetWidth * state.targetHeight * 2;
        const totalEstimatedKb = (expectedFrames * singleFrameBytes / 1024).toFixed(1);
        const animFileName = `${state.variableName}_anim_${fps}fps.bin`;
        el.bleTargetFilename.textContent = animFileName;
        el.bleTargetFilemeta.textContent = `${state.targetWidth} \xD7 ${state.targetHeight} px | ${state.colorFormat.toUpperCase()} | ${expectedFrames} cuadros | ~${totalEstimatedKb} KB`;
        const stats = document.getElementById("bleVideoStatsText");
        if (stats) {
          stats.textContent = `Secuencia: ${expectedFrames} fotogramas (${duration.toFixed(1)}s a ${fps} fps). El ESP32 detectar\xE1 ${fps} FPS autom\xE1ticamente.`;
        }
        const warnBox = document.getElementById("bleVideoWarningBox");
        const warnDuration = document.getElementById("bleVideoWarnDuration");
        if (warnBox && warnDuration) {
          if (duration > 6) {
            warnBox.style.display = "block";
            warnDuration.textContent = duration.toFixed(1);
          } else {
            warnBox.style.display = "none";
          }
        }
      } else {
        if (!state.currentEncoded) {
          updatePipeline();
        }
        const name = `${state.variableName}.bin`;
        const sizeKb = state.currentEncoded ? (state.currentEncoded.sizeBytes / 1024).toFixed(1) : "0.0";
        el.bleTargetFilename.textContent = name;
        el.bleTargetFilemeta.textContent = `${state.targetWidth} \xD7 ${state.targetHeight} px | ${state.colorFormat.toUpperCase()} | 1 imagen | ~${sizeKb} KB`;
        const stats = document.getElementById("bleVideoStatsText");
        if (stats) {
          stats.textContent = "Se transmitir\xE1 \xFAnicamente el fotograma actual que se muestra en el reproductor.";
        }
        const warnBox = document.getElementById("bleVideoWarningBox");
        if (warnBox) warnBox.style.display = "none";
      }
    } else {
      el.bleTargetFilename.textContent = bleCustomBin.fileName;
      el.bleTargetFilemeta.textContent = `Archivo del disco | ${(bleCustomBin.bytes.byteLength / 1024).toFixed(1)} KB`;
    }
  }
  function openBleModal() {
    const isVideo = state.sourceType === "video";
    const videoContainer = document.getElementById("bleVideoModeContainer");
    if (videoContainer) {
      videoContainer.style.display = isVideo && !bleCustomBin ? "block" : "none";
    }
    updateBleModalFileInfo();
    resetBleProgressUI();
    switchBleTab("upload");
    el.bleModalOverlay.classList.add("active");
  }
  function closeBleModal() {
    if (bleAbortController) {
      bleAbortController.abort();
      bleAbortController = null;
    }
    el.bleModalOverlay.classList.remove("active");
  }
  function resetBleProgressUI() {
    el.bleStatusBadge.className = "ble-badge ble-badge-idle";
    el.bleStatusBadge.textContent = "DESCONECTADO";
    el.bleDeviceNameLabel.textContent = "BitMapper-ESP32 (Servicio GATT 4fafc201...)";
    el.bleProgressStatusText.textContent = "Listo para transmitir";
    el.bleProgressPercent.textContent = "0%";
    el.bleProgressBar.style.width = "0%";
    el.bleBytesTransferred.textContent = "0 KB / 0 KB";
    el.bleTransferSpeed.textContent = "0.0 KB/s";
    el.btnBleStartUpload.style.display = "inline-flex";
    el.btnBleCancelUpload.style.display = "none";
    el.btnBleDismiss.style.display = "inline-flex";
  }
  async function handleBlePickLocalBin() {
    if (window.bitmapperAPI && window.bitmapperAPI.openBinaryFile) {
      const res = await window.bitmapperAPI.openBinaryFile();
      if (!res) return;
      bleCustomBin = {
        fileName: res.fileName,
        bytes: res.data
      };
      el.bleTargetFilename.textContent = res.fileName;
      el.bleTargetFilemeta.textContent = `Archivo local .BIN | ${(res.data.byteLength / 1024).toFixed(1)} KB`;
      const videoContainer = document.getElementById("bleVideoModeContainer");
      if (videoContainer) videoContainer.style.display = "none";
      showToast(`Archivo cargado para BLE: ${res.fileName}`);
    } else {
      showToast("Funci\xF3n no disponible en modo navegador est\xE1ndar");
    }
  }
  async function startBleUpload() {
    const isVideo = state.sourceType === "video";
    const optFull = document.getElementById("bleOptVideoFull");
    const sendFullVideo = isVideo && !bleCustomBin && (optFull ? optFull.checked : true);
    if (sendFullVideo) {
      const fps = state.videoTargetFps || 15;
      const inP = state.videoInPoint || 0;
      const outP = state.videoOutPoint > inP ? state.videoOutPoint : state.videoDuration || 1;
      const duration = Math.max(0.1, outP - inP);
      const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);
      if (expectedFrames > 120) {
        const estMb = (expectedFrames * state.targetWidth * state.targetHeight * 2 / (1024 * 1024)).toFixed(1);
        const estMin = Math.round(expectedFrames * state.targetWidth * state.targetHeight * 2 / (18 * 1024 * 60));
        const ok = confirm(
          `\u26A0\uFE0F ATENCI\xD3N: SECUENCIA DE VIDEO MUY EXTENSA

El rango seleccionado dura ${duration.toFixed(1)} segundos (~${expectedFrames} cuadros = ${estMb} MB).
Transferir tantos datos por Bluetooth BLE tardar\xE1 aproximadamente ~${estMin} minutos.

Para microcontroladores se recomienda usar clips de 2 a 5 segundos con los marcadores [ In / Out ] en la l\xEDnea de tiempo.

\xBFDeseas continuar con la transmisi\xF3n completa de todos modos?`
        );
        if (!ok) return;
      }
    }
    bleAbortController = new AbortController();
    el.btnBleStartUpload.style.display = "none";
    el.btnBleCancelUpload.style.display = "inline-flex";
    el.btnBleDismiss.style.display = "none";
    try {
      await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
    } catch (connErr) {
      console.error("Error al conectar BLE:", connErr);
      const msg = connErr?.message || String(connErr);
      if (!msg.includes("cancel") && !msg.includes("User cancelled")) {
        showToast(`Error al conectar BLE: ${msg}`);
      }
      el.btnBleStartUpload.style.display = "inline-flex";
      el.btnBleCancelUpload.style.display = "none";
      el.btnBleDismiss.style.display = "inline-flex";
      bleAbortController = null;
      return;
    }
    try {
      let dataToSend;
      let fileName;
      if (bleCustomBin) {
        dataToSend = bleCustomBin.bytes;
        fileName = bleCustomBin.fileName;
      } else if (sendFullVideo) {
        el.bleProgressStatusText.textContent = "Extrayendo fotogramas del video...";
        const fps = state.videoTargetFps || 15;
        const inP = state.videoInPoint || 0;
        const outP = state.videoOutPoint > inP ? state.videoOutPoint : state.videoDuration || 1;
        const duration = Math.max(0.1, outP - inP);
        const step = 1 / Math.max(1, fps);
        const expectedFrames = Math.max(1, Math.round(duration * fps) + 1);
        el.hiddenVideo.pause();
        state.videoPlaying = false;
        updatePlayPauseIcon();
        const origTime = el.hiddenVideo.currentTime;
        const frameBuffers = [];
        let singleFrameSize = 0;
        for (let t = inP; t <= outP + 1e-4; t += step) {
          if (bleAbortController?.signal.aborted) {
            el.hiddenVideo.currentTime = origTime;
            return;
          }
          await seekVideo(t);
          processFrame(el.hiddenVideo);
          if (state.currentEncoded) {
            const frameBytes = new Uint8Array(state.currentEncoded.bytes);
            singleFrameSize = frameBytes.byteLength;
            frameBuffers.push(frameBytes);
          }
          const pct = Math.round(frameBuffers.length / expectedFrames * 100);
          el.bleProgressStatusText.textContent = `Extrayendo cuadro ${frameBuffers.length} / ${expectedFrames}...`;
          el.bleProgressBar.style.width = `${pct}%`;
          el.bleProgressPercent.textContent = `${pct}%`;
          await new Promise((r) => setTimeout(r, 8));
        }
        el.hiddenVideo.currentTime = origTime;
        if (frameBuffers.length === 0) {
          showToast("Error: No se pudieron extraer fotogramas del video");
          resetBleProgressUI();
          return;
        }
        const totalBytes = frameBuffers.length * singleFrameSize;
        const rawData = new Uint8Array(totalBytes);
        for (let i = 0; i < frameBuffers.length; i++) {
          rawData.set(frameBuffers[i], i * singleFrameSize);
        }
        const useBmpr = el.bleOptBmprHeader ? el.bleOptBmprHeader.checked : true;
        if (useBmpr) {
          dataToSend = generateBmprBinary(
            state.targetWidth,
            state.targetHeight,
            rawData,
            frameBuffers.length,
            fps,
            state.colorFormat,
            state.swapBytes
          );
          fileName = `${state.variableName}_anim_${fps}fps.bmpr`;
        } else {
          dataToSend = rawData;
          fileName = `${state.variableName}_anim_${fps}fps.bin`;
        }
        console.log(`[BLE Video]: Secuencia de ${frameBuffers.length} cuadros preparada a ${fps} FPS (${dataToSend.byteLength} bytes, archivo: ${fileName}, BMPR=${useBmpr}).`);
      } else {
        if (!state.currentEncoded) {
          updatePipeline();
        }
        if (!state.currentEncoded) {
          showToast("Error: No hay datos de bitmap para enviar");
          return;
        }
        const useBmpr = el.bleOptBmprHeader ? el.bleOptBmprHeader.checked : true;
        if (useBmpr) {
          dataToSend = generateBmprBinary(
            state.targetWidth,
            state.targetHeight,
            state.currentEncoded.bytes,
            1,
            15,
            state.colorFormat,
            state.swapBytes
          );
          fileName = `${state.variableName}.bmpr`;
        } else {
          dataToSend = state.currentEncoded.bytes;
          fileName = `${state.variableName}.bin`;
        }
      }
      await bleUploader.transferData({
        fileName,
        bytes: dataToSend,
        signal: bleAbortController.signal,
        onProgress: (p) => updateBleProgressUI(p)
      });
      showToast(`\u2714 \xA1Archivo ${fileName} enviado con \xE9xito al ESP32!`);
    } catch (err) {
      console.error("Error durante la carga BLE:", err);
      const msg = err?.message || String(err);
      if (!msg.includes("cancelada") && !msg.includes("User cancelled")) {
        showToast(`Error BLE: ${msg}`);
      }
    } finally {
      el.btnBleStartUpload.style.display = "inline-flex";
      el.btnBleCancelUpload.style.display = "none";
      el.btnBleDismiss.style.display = "inline-flex";
      bleAbortController = null;
    }
  }
  function cancelBleUpload() {
    if (bleAbortController) {
      bleAbortController.abort();
      bleAbortController = null;
      showToast("Transferencia BLE cancelada");
    }
  }
  function updateBleProgressUI(p) {
    el.bleProgressStatusText.textContent = p.statusText;
    el.bleProgressPercent.textContent = `${p.percentage}%`;
    el.bleProgressBar.style.width = `${p.percentage}%`;
    const sentKb = (p.bytesSent / 1024).toFixed(1);
    const totalKb = (p.totalBytes / 1024).toFixed(1);
    el.bleBytesTransferred.textContent = `${sentKb} KB / ${totalKb} KB`;
    if (p.speedKbps !== void 0) {
      el.bleTransferSpeed.textContent = `${p.speedKbps.toFixed(1)} KB/s`;
    }
    if (p.deviceName) {
      el.bleDeviceNameLabel.textContent = `${p.deviceName}`;
    }
    if (p.state === "scanning") {
      el.bleStatusBadge.className = "ble-badge ble-badge-scanning";
      el.bleStatusBadge.textContent = "BUSCANDO...";
    } else if (p.state === "connecting") {
      el.bleStatusBadge.className = "ble-badge ble-badge-scanning";
      el.bleStatusBadge.textContent = "CONECTANDO...";
    } else if (p.state === "connected") {
      el.bleStatusBadge.className = "ble-badge ble-badge-connected";
      el.bleStatusBadge.textContent = "CONECTADO";
    } else if (p.state === "uploading") {
      el.bleStatusBadge.className = "ble-badge ble-badge-uploading";
      el.bleStatusBadge.textContent = "TRANSMITIENDO";
    } else if (p.state === "completed") {
      el.bleStatusBadge.className = "ble-badge ble-badge-connected";
      el.bleStatusBadge.textContent = "COMPLETADO \u2714";
    } else if (p.state === "error") {
      el.bleStatusBadge.className = "ble-badge ble-badge-error";
      el.bleStatusBadge.textContent = "ERROR \u2716";
    }
  }
  var batchQueue = [];
  var isBatchUploading = false;
  function updateBatchLabels() {
    if (el.bleBatchResLabel) {
      el.bleBatchResLabel.textContent = `${state.targetWidth} \xD7 ${state.targetHeight} px`;
    }
    if (el.bleBatchFormatLabel) {
      const fmt = COLOR_FORMATS.find((x) => x.id === state.colorFormat);
      el.bleBatchFormatLabel.textContent = fmt ? fmt.name.split(" ")[0] : state.colorFormat.toUpperCase();
    }
  }
  function convertImageToBin(img) {
    const tw = state.targetWidth;
    const th = state.targetHeight;
    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, tw, th);
    const sw = img.naturalWidth || img.width;
    const sh = img.naturalHeight || img.height;
    let dw = tw, dh = th;
    let dx = 0, dy = 0;
    if (state.scalingMode === "stretch") {
      dw = tw;
      dh = th;
    } else if (state.scalingMode === "center") {
      dw = sw;
      dh = sh;
      dx = (tw - sw) / 2;
      dy = (th - sh) / 2;
    } else if (state.scalingMode === "contain") {
      const scale = Math.min(tw / sw, th / sh);
      dw = sw * scale;
      dh = sh * scale;
      dx = (tw - dw) / 2;
      dy = (th - dh) / 2;
    } else if (state.scalingMode === "cover") {
      const scale = Math.max(tw / sw, th / sh);
      dw = sw * scale;
      dh = sh * scale;
      dx = (tw - dw) / 2;
      dy = (th - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    const imgData = ctx.getImageData(0, 0, tw, th);
    const d = imgData.data;
    const bAdj = state.brightness;
    const cFactor = 259 * (state.contrast + 255) / (255 * (259 - state.contrast));
    const gammaVal = state.gamma;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      if (bAdj !== 0) {
        r += bAdj;
        g += bAdj;
        b += bAdj;
      }
      if (state.contrast !== 0) {
        r = cFactor * (r - 128) + 128;
        g = cFactor * (g - 128) + 128;
        b = cFactor * (b - 128) + 128;
      }
      if (gammaVal !== 1) {
        r = 255 * Math.pow(Math.max(0, r) / 255, 1 / gammaVal);
        g = 255 * Math.pow(Math.max(0, g) / 255, 1 / gammaVal);
        b = 255 * Math.pow(Math.max(0, b) / 255, 1 / gammaVal);
      }
      d[i] = clamp(r);
      d[i + 1] = clamp(g);
      d[i + 2] = clamp(b);
    }
    const quantizedData = applyDithering(
      d,
      tw,
      th,
      state.ditherAlgorithm,
      state.colorFormat,
      state.threshold
    );
    const encoded = encodeBitmap(quantizedData, tw, th, {
      colorFormat: state.colorFormat,
      endian: state.endian,
      swapBytes: state.swapBytes,
      invert: state.invertColors
    });
    return encoded.bytes;
  }
  function addFilesToBatch(files) {
    const estBytes = state.targetWidth * state.targetHeight * 2;
    const estKb = (estBytes / 1024).toFixed(1);
    files.forEach((f) => {
      let base = f.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_\-]/g, "_").toLowerCase();
      if (!base) base = "image";
      let targetName = `${base}.bin`;
      let count = 1;
      while (batchQueue.some((item) => item.targetName === targetName)) {
        count++;
        targetName = `${base}_${count}.bin`;
      }
      let displaySize = `${estKb} KB`;
      if (f.isBin && f.data) {
        displaySize = `${(f.data.byteLength / 1024).toFixed(1)} KB`;
      } else if (f.file) {
        displaySize = `${(f.file.size / 1024).toFixed(1)} KB orig \u2192 ~${estKb} KB`;
      }
      batchQueue.push({
        id: "batch_" + Math.random().toString(36).substring(2, 9),
        originalName: f.name,
        targetName,
        fileUrl: f.url,
        file: f.file,
        isBin: f.isBin,
        binData: f.data,
        displaySize,
        status: "pending"
      });
    });
    updateBatchLabels();
    renderBatchList();
  }
  function renderBatchList() {
    if (el.btnBleStartBatchUpload) {
      el.btnBleStartBatchUpload.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      Subir Lote al ESP32 (${batchQueue.length})
    `;
    }
    if (batchQueue.length === 0) {
      el.bleBatchFilesContainer.innerHTML = `
      <div class="ble-files-placeholder" id="bleBatchPlaceholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <div>No hay im\xE1genes a\xF1adidas al lote</div>
        <div style="font-size: 11px; color: var(--text-muted);">Haz clic en "A\xF1adir Im\xE1genes..." o arrastra y suelta fotos aqu\xED</div>
      </div>
    `;
      return;
    }
    el.bleBatchFilesContainer.innerHTML = "";
    batchQueue.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = `ble-batch-item ${item.status === "uploading" ? "active" : ""} ${item.status === "completed" ? "completed" : ""}`;
      row.id = `batch_row_${item.id}`;
      const left = document.createElement("div");
      left.className = "ble-batch-item-left";
      const thumb = document.createElement("div");
      thumb.className = "ble-batch-item-thumb";
      if (item.fileUrl) {
        const img = document.createElement("img");
        img.src = item.fileUrl;
        thumb.appendChild(img);
      } else if (item.file && !item.isBin) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(item.file);
        thumb.appendChild(img);
      } else {
        thumb.textContent = item.isBin ? "\u{1F4E6}" : "\u{1F5BC}\uFE0F";
      }
      const info = document.createElement("div");
      info.className = "ble-batch-item-info";
      const name = document.createElement("div");
      name.className = "ble-batch-item-name";
      name.title = item.targetName;
      name.textContent = `${index + 1}. ${item.targetName}`;
      const meta = document.createElement("div");
      meta.className = "ble-batch-item-meta";
      meta.textContent = `${item.originalName} \u2022 ${item.displaySize}`;
      info.appendChild(name);
      info.appendChild(meta);
      left.appendChild(thumb);
      left.appendChild(info);
      const right = document.createElement("div");
      right.className = "ble-batch-item-right";
      const badge = document.createElement("span");
      badge.className = `ble-batch-badge badge-${item.status}`;
      if (item.status === "pending") badge.textContent = "PENDIENTE";
      else if (item.status === "converting") badge.textContent = "PROCESANDO";
      else if (item.status === "uploading") badge.textContent = "SUBIENDO...";
      else if (item.status === "completed") badge.textContent = "ENVIADO \u2714";
      else if (item.status === "error") badge.textContent = "ERROR \u2716";
      right.appendChild(badge);
      if (!isBatchUploading) {
        const btnRemove = document.createElement("button");
        btnRemove.className = "btn-batch-remove";
        btnRemove.title = "Quitar del lote";
        btnRemove.innerHTML = "&times;";
        btnRemove.addEventListener("click", (e) => {
          e.stopPropagation();
          batchQueue = batchQueue.filter((x) => x.id !== item.id);
          renderBatchList();
        });
        right.appendChild(btnRemove);
      }
      row.appendChild(left);
      row.appendChild(right);
      el.bleBatchFilesContainer.appendChild(row);
    });
  }
  async function handleAddBatchFiles() {
    if (isBatchUploading) return;
    if (window.bitmapperAPI && window.bitmapperAPI.openMultipleFiles) {
      try {
        const files = await window.bitmapperAPI.openMultipleFiles();
        if (!files || files.length === 0) return;
        const formatted = files.map((f) => ({
          name: f.fileName,
          url: "file:///" + f.filePath.replace(/\\/g, "/"),
          isBin: f.isBin,
          data: f.data
        }));
        addFilesToBatch(formatted);
        showToast(`\xA1${formatted.length} archivos a\xF1adidos al lote!`);
        return;
      } catch (ipcErr) {
        console.warn("IPC openMultipleFiles no disponible, usando selector alternativo:", ipcErr);
      }
    }
    el.hiddenBatchFileInput.click();
  }
  function handleBatchFileInputChange(e) {
    const target = e.target;
    if (!target.files || target.files.length === 0) return;
    const formatted = [];
    for (let i = 0; i < target.files.length; i++) {
      const f = target.files[i];
      formatted.push({
        name: f.name,
        file: f,
        isBin: f.name.toLowerCase().endsWith(".bin")
      });
    }
    addFilesToBatch(formatted);
    showToast(`\xA1${formatted.length} archivos a\xF1adidos al lote!`);
    el.hiddenBatchFileInput.value = "";
  }
  async function startBleBatchUpload() {
    if (batchQueue.length === 0) {
      showToast("A\xF1ade al menos una imagen a la cola antes de iniciar");
      return;
    }
    if (isBatchUploading) return;
    try {
      await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
    } catch (connErr) {
      console.error("Error al conectar BLE:", connErr);
      const msg = connErr?.message || String(connErr);
      if (!msg.includes("cancel") && !msg.includes("User cancelled")) {
        showToast(`Error al conectar BLE: ${msg}`);
      }
      return;
    }
    isBatchUploading = true;
    bleAbortController = new AbortController();
    el.btnBleStartBatchUpload.style.display = "none";
    el.btnBleCancelUpload.style.display = "inline-flex";
    el.btnBleDismiss.style.display = "none";
    el.bleBatchProgressBox.style.display = "block";
    let successCount = 0;
    const total = batchQueue.length;
    try {
      for (let i = 0; i < batchQueue.length; i++) {
        if (bleAbortController?.signal.aborted) break;
        const item = batchQueue[i];
        const overallPct = Math.round(i / total * 100);
        el.bleBatchOverallStatus.textContent = `Transmitiendo imagen ${i + 1} de ${total}: ${item.targetName}`;
        el.bleBatchOverallPercent.textContent = `${overallPct}%`;
        el.bleBatchOverallBar.style.width = `${overallPct}%`;
        el.bleBatchFileStatus.textContent = `Preparando ${item.targetName}...`;
        item.status = "converting";
        renderBatchList();
        let bytesToSend;
        try {
          if (item.isBin && item.binData) {
            bytesToSend = item.binData;
          } else if (item.file && item.isBin) {
            const buf = await item.file.arrayBuffer();
            bytesToSend = new Uint8Array(buf);
          } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            const loadPromise = new Promise((resolve, reject) => {
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
            });
            img.src = item.fileUrl || (item.file ? URL.createObjectURL(item.file) : "");
            await loadPromise;
            bytesToSend = convertImageToBin(img);
          }
        } catch (convErr) {
          console.error("Error convirtiendo imagen:", convErr);
          item.status = "error";
          item.errorMessage = convErr?.message || "Error de conversi\xF3n";
          renderBatchList();
          continue;
        }
        item.status = "uploading";
        renderBatchList();
        try {
          await bleUploader.transferData({
            fileName: item.targetName,
            bytes: bytesToSend,
            signal: bleAbortController.signal,
            onProgress: (p) => {
              updateBleProgressUI(p);
              el.bleBatchFileStatus.textContent = `Enviando "${item.targetName}" (${(p.bytesSent / 1024).toFixed(1)} / ${(p.totalBytes / 1024).toFixed(1)} KB)`;
              if (p.speedKbps !== void 0) {
                el.bleBatchSpeed.textContent = `${p.speedKbps.toFixed(1)} KB/s`;
              }
            }
          });
          item.status = "completed";
          successCount++;
          renderBatchList();
          await new Promise((r) => setTimeout(r, 250));
        } catch (uploadErr) {
          if (bleAbortController?.signal.aborted) {
            item.status = "pending";
            renderBatchList();
            break;
          }
          console.error(`Error al subir ${item.targetName}:`, uploadErr);
          item.status = "error";
          item.errorMessage = uploadErr?.message || "Error BLE";
          renderBatchList();
        }
      }
      el.bleBatchOverallPercent.textContent = "100%";
      el.bleBatchOverallBar.style.width = "100%";
      el.bleBatchOverallStatus.textContent = `Lote completado: ${successCount} de ${total} subidos con \xE9xito`;
      showToast(`\u2714 \xA1Lote completado! ${successCount} de ${total} im\xE1genes transmitidas al ESP32.`);
    } catch (err) {
      console.error("Error en carga por lote:", err);
      showToast(`Error durante el lote: ${err?.message || err}`);
    } finally {
      isBatchUploading = false;
      bleAbortController = null;
      el.btnBleStartBatchUpload.style.display = "inline-flex";
      el.btnBleCancelUpload.style.display = "none";
      el.btnBleDismiss.style.display = "inline-flex";
      renderBatchList();
    }
  }
  function switchBleTab(tab) {
    el.bleTabBtnUpload.classList.toggle("active", tab === "upload");
    el.bleTabBtnBatch.classList.toggle("active", tab === "batch");
    el.bleTabBtnManager.classList.toggle("active", tab === "manager");
    el.bleTabBtnSettings.classList.toggle("active", tab === "settings");
    el.blePaneUpload.style.display = tab === "upload" ? "block" : "none";
    el.blePaneBatch.style.display = tab === "batch" ? "block" : "none";
    el.blePaneManager.style.display = tab === "manager" ? "block" : "none";
    el.blePaneSettings.style.display = tab === "settings" ? "block" : "none";
    if (tab === "upload") {
      el.btnBleStartUpload.style.display = "inline-flex";
      el.btnBleStartBatchUpload.style.display = "none";
    } else if (tab === "batch") {
      el.btnBleStartUpload.style.display = "none";
      el.btnBleStartBatchUpload.style.display = "inline-flex";
      updateBatchLabels();
      renderBatchList();
    } else if (tab === "manager") {
      el.btnBleStartUpload.style.display = "none";
      el.btnBleStartBatchUpload.style.display = "none";
      if (bleUploader.isConnected) {
        loadBleSDFiles();
      } else {
        renderBleFilesPlaceholder(false);
      }
    } else if (tab === "settings") {
      el.btnBleStartUpload.style.display = "none";
      el.btnBleStartBatchUpload.style.display = "none";
    }
  }
  async function handleBleApplySettings() {
    try {
      if (!bleUploader.isConnected) {
        showToast("Conectando al ESP32...");
        await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
      }
      const slideshowOn = el.bleSettingSlideshow.checked;
      const slideSec = parseInt(el.bleSettingSlideInterval.value, 10) || 5;
      const transitionMode = el.bleSettingTransition.value;
      const brightnessPct = parseInt(el.bleSettingBrightness.value, 10) || 60;
      const brightnessDuty = Math.round(brightnessPct / 100 * 255);
      el.btnBleApplySettings.disabled = true;
      el.btnBleApplySettings.textContent = "Enviando...";
      await bleUploader.sendSlideshowConfig(slideshowOn, slideSec);
      await new Promise((r) => setTimeout(r, 60));
      await bleUploader.sendTransitionConfig(transitionMode);
      await new Promise((r) => setTimeout(r, 60));
      await bleUploader.sendBrightnessConfig(brightnessDuty);
      showToast("\u2714 \xA1Ajustes aplicados y guardados en la memoria del ESP32!");
    } catch (err) {
      console.error("Error al aplicar ajustes en ESP32:", err);
      showToast(`Error al enviar ajustes: ${err?.message || err}`);
    } finally {
      el.btnBleApplySettings.disabled = false;
      el.btnBleApplySettings.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
      Enviar Ajustes a ESP32
    `;
    }
  }
  async function handleBleRemotePrev() {
    try {
      if (!bleUploader.isConnected) {
        await bleUploader.requestDeviceAndConnect();
      }
      await bleUploader.sendGenericCommand("PREV");
      showToast("Comando: Foto anterior");
    } catch (err) {
      showToast(`Error: ${err?.message || err}`);
    }
  }
  async function handleBleRemoteNext() {
    try {
      if (!bleUploader.isConnected) {
        await bleUploader.requestDeviceAndConnect();
      }
      await bleUploader.sendGenericCommand("NEXT");
      showToast("Comando: Siguiente foto");
    } catch (err) {
      showToast(`Error: ${err?.message || err}`);
    }
  }
  var currentSDFiles = [];
  var isLoadingSDFiles = false;
  function renderBleFilesPlaceholder(loading = false) {
    if (loading) {
      el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2" class="spin"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        <div>Consultando archivos en la MicroSD del ESP32...</div>
      </div>
    `;
      el.bleManagerStatusText.textContent = "Leyendo tarjeta MicroSD...";
      el.bleManagerBadge.className = "ble-badge ble-badge-scanning";
      el.bleManagerBadge.textContent = "LEYENDO...";
    } else {
      el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder" id="bleFilesPlaceholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <div>Conecta al ESP32 para explorar y eliminar archivos .BIN de tu tarjeta MicroSD</div>
        <button id="btnBleConnectFromManager" class="btn btn-accent" style="font-size: 11px; padding: 6px 14px; margin-top: 6px;">
          Conectar ESP32
        </button>
      </div>
    `;
      el.bleManagerStatusText.textContent = "Conecta al ESP32 para ver los archivos";
      el.bleManagerBadge.className = "ble-badge ble-badge-idle";
      el.bleManagerBadge.textContent = "DESCONECTADO";
      const connectBtn = document.getElementById("btnBleConnectFromManager");
      if (connectBtn) {
        connectBtn.addEventListener("click", () => loadBleSDFiles());
      }
    }
  }
  async function loadBleSDFiles() {
    if (isLoadingSDFiles) return;
    if (!bleUploader.isConnected) {
      try {
        await bleUploader.requestDeviceAndConnect((p) => updateBleProgressUI(p));
      } catch (connErr) {
        console.error("Error al conectar BLE:", connErr);
        const msg = connErr?.message || String(connErr);
        if (!msg.includes("cancel") && !msg.includes("User cancelled")) {
          showToast(`Error al conectar BLE: ${msg}`);
        }
        renderBleFilesPlaceholder(false);
        return;
      }
    }
    isLoadingSDFiles = true;
    renderBleFilesPlaceholder(true);
    try {
      const files = await bleUploader.listSDFiles();
      currentSDFiles = files;
      renderBleFilesList(files);
    } catch (err) {
      console.error("Error al obtener lista de archivos:", err);
      showToast(`Error al leer MicroSD: ${err?.message || err}`);
      el.bleManagerStatusText.textContent = "Error al leer MicroSD";
      el.bleManagerBadge.className = "ble-badge ble-badge-error";
      el.bleManagerBadge.textContent = "ERROR";
    } finally {
      isLoadingSDFiles = false;
    }
  }
  function renderBleFilesList(files) {
    el.bleManagerStatusText.textContent = `Dispositivo: ${bleUploader.deviceName}`;
    el.bleManagerBadge.className = "ble-badge ble-badge-connected";
    el.bleManagerBadge.textContent = `${files.length} ARCHIVO${files.length === 1 ? "" : "S"}`;
    if (files.length === 0) {
      el.bleFilesContainer.innerHTML = `
      <div class="ble-files-placeholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <div>No se encontraron archivos .BIN en la tarjeta MicroSD</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Usa la pesta\xF1a "Subir Archivo al ESP32" para cargar una imagen o video animado.</div>
      </div>
    `;
      return;
    }
    el.bleFilesContainer.innerHTML = "";
    files.forEach((f) => {
      const item = document.createElement("div");
      item.className = "ble-file-item";
      const left = document.createElement("div");
      left.className = "ble-file-item-left";
      const icon = document.createElement("div");
      icon.className = `ble-file-type-icon ${f.isVideo ? "video" : ""}`;
      icon.textContent = f.isVideo ? "\u{1F3AC}" : "\u{1F5BC}\uFE0F";
      const info = document.createElement("div");
      info.className = "ble-file-item-info";
      const name = document.createElement("div");
      name.className = "ble-file-item-name";
      name.title = f.name;
      name.textContent = f.name;
      const meta = document.createElement("div");
      meta.className = "ble-file-item-meta";
      meta.textContent = `${f.displaySize} ${f.isVideo ? `\u2022 Animaci\xF3n (~${f.totalFrames} f)` : "\u2022 Imagen fija"}`;
      info.appendChild(name);
      info.appendChild(meta);
      left.appendChild(icon);
      left.appendChild(info);
      const actions = document.createElement("div");
      actions.className = "ble-file-item-actions";
      const btnShow = document.createElement("button");
      btnShow.className = "btn-file-action";
      btnShow.title = "Mostrar este archivo ahora en la pantalla del ESP32";
      btnShow.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Mostrar`;
      btnShow.addEventListener("click", () => handleBleShowFile(f.name));
      const btnDel = document.createElement("button");
      btnDel.className = "btn-file-action btn-file-delete";
      btnDel.title = "Eliminar permanentemente este archivo de la MicroSD";
      btnDel.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Eliminar`;
      btnDel.addEventListener("click", () => handleBleDeleteFile(f.name));
      actions.appendChild(btnShow);
      actions.appendChild(btnDel);
      item.appendChild(left);
      item.appendChild(actions);
      el.bleFilesContainer.appendChild(item);
    });
  }
  async function handleBleShowFile(fileName) {
    try {
      await bleUploader.showSDFile(fileName);
      showToast(`Mostrando "${fileName}" en el ESP32`);
    } catch (err) {
      showToast(`Error al mostrar archivo: ${err?.message || err}`);
    }
  }
  async function handleBleDeleteFile(fileName) {
    const confirmed = confirm(
      `\xBFEst\xE1s seguro de que deseas eliminar permanentemente el archivo "${fileName}" de la tarjeta MicroSD del ESP32?

Esta acci\xF3n no se puede deshacer.`
    );
    if (!confirmed) return;
    try {
      showToast(`Eliminando "${fileName}"...`);
      const ok = await bleUploader.deleteSDFile(fileName);
      if (ok) {
        showToast(`\u2714 Archivo "${fileName}" eliminado con \xE9xito`);
        await loadBleSDFiles();
      } else {
        showToast(`\u274C No se pudo eliminar "${fileName}"`);
      }
    } catch (err) {
      showToast(`Error al eliminar: ${err?.message || err}`);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
  } else {
    initUI();
  }
})();
/*! Bundled license information:

jszip/dist/jszip.min.js:
  (*!
  
  JSZip v3.10.2 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>
  
  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.
  
  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/main/LICENSE
  *)
*/
