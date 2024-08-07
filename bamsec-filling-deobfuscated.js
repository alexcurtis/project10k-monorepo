(window.webpackJsonp = window.webpackJsonp || []).push([["js/filing"], {"/rir": function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return s;
    });
    var r = n("oWgl"), i = n.n(r), a = n("Q2Ao"), o = n("eQQh");
    function s() {
      let t = Object(a.f)(), e = new URL(document.location).searchParams.get("hl_text_search");
      if (!e || !t) return;
      let n = t.document.getElementsByTagName("html").item(0);
      if (!n) return;
      let r = Object(a.d)(e, true);
      i()(n, {find: r, replace: (t, e) => {
        const r = n.ownerDocument.createElement("span");
        return r.className = "bamsec-temp-highlight", r.innerHTML = Object(a.c)(t.text), 0 === e.index && (r.id = "bamsec-regex-search"), r;
      }}), Object(o.a)("bamsec-regex-search");
    }
  }, "1H9E": function (t, e, n) {
    "use strict";
    (function (t) {
      var e = n("oWgl"), r = n.n(e), i = n("U2zk"), a = n("iipj"), o = n("4duG"), s = n("RbWA"), l = n("/rir"), c = n("pRvv"), d = n("WaX7"), u = n("4Jhu"), h = n("YGSd"), f = n("geeX");
      !function (t) {
        var e = function () {
          var e = document.getElementById("embedded_doc");
          if (Object(i.b)(e.src)) {
            var n, p = "";
            try {
              n = e.contentWindow.errorStatusCode;
            } catch (t) {
              n = 500, p = t.message;
            }
            if (n) t.ajax({method: "PUT", url: "/embedded-doc-cloudfront-error", data: {url: window.location.href, iframeUrl: e.src, errorStatusCode: n, errorMessage: p}, headers: {"X-CSRFToken": BAMSEC.CSRFToken}}); else {
              if (!Object(i.a)(e)) return t.ajax({method: "PUT", url: "/embedded-doc-error", data: {url: window.location.href, iframeUrl: e.src, parentDocDomain: document.domain, iframeName: e.name}, headers: {"X-CSRFToken": BAMSEC.CSRFToken}}), void t("#embedded-doc-error-msg").show();
              BAMSEC.iframeIsLoaded = true, Object(a.a)("Filing", "iframe:loaded"), Object(c.a)(), BAMSEC.isDiff || (r.a.resetCache(), Object(d.b)(), Object(u.a)(), Object(o.a)(), Object(d.a)(), Object(s.a)(), Object(l.a)(), Object(f.a)()), Object(h.a)();
            }
          }
        };
        t(document).ready(function () {
          BAMSEC.iframeOnLoad = e, BAMSEC.iframeIsLoaded && e();
        });
      }(t);
    }.call(this, n("3a3M")));
  }, "4Jhu": function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return f;
    });
    var r = n("3a3M"), i = n.n(r), a = n("GOv7"), o = n("iipj"), s = n("RiZx");
    function l(t) {
      const e = t.target.closest("button"), n = e.parentNode, r = n.getElementsByClassName("table-share-input-btn").item(0), i = n.getElementsByClassName("table-share-input").item(0);
      if (null !== r && null !== i) if (e.classList.contains("activated")) r.style.display = "none", e.innerHTML = '<span class="icon-link-1"></span>Link', e.classList.remove("activated"); else {
        r.style.display = "inline-block", i.select(), e.innerHTML = '<span class="icon-link-1"></span>Link:', e.classList.add("activated");
        const t = parseInt(n.dataset.tableId, 10);
        s.track("Table Link - Viewed", {filing_id: BAMSEC.filingId, position: t});
      }
    }
    function c(t) {
      const e = t.target.closest("button");
      BAMSEC.showMarketingModal("table-link");
      const n = parseInt(e.parentNode.dataset.tableId, 10);
      s.track("Table Link - Viewed", {filing_id: BAMSEC.filingId, position: n});
    }
    function d(t) {
      const e = t.target.closest("button");
      Object(a.a)(BAMSEC.entitySlug, BAMSEC.filingId, BAMSEC.sequence, parseInt(e.dataset.tableId, 10), "filing");
    }
    function u(t) {
      const e = t.target.closest("button"), n = parseInt(e.dataset.tableId, 10);
      BAMSEC.showTableModal(BAMSEC.entityId, BAMSEC.entitySlug, BAMSEC.filingId, n, BAMSEC.positions, BAMSEC.matchSeriesIds, BAMSEC.sequence, BAMSEC.tablesCategory), s.track("Similar Tables - Modal Opened", {filing_id: BAMSEC.filingId, sequence: BAMSEC.sequence, position: n});
    }
    function h() {
      BAMSEC.showMarketingModal("similar-tables");
    }
    function f() {
      null != BAMSEC.positions && BAMSEC.positions.length > 0 && (!function (t) {
        const e = document.getElementById("embedded_doc").contentWindow.document, n = e.getElementsByClassName("bamsec-table-btns-wrapper");
        for (let e = 0; e < n.length; e += 1) {
          const r = n[e].getElementsByClassName("bamsec-table-btn");
          let i, a, o, s;
          if (4 === r.length ? (i = r[0], a = r[1], o = r[2], s = r[3]) : (i = r[0], o = r[1], s = r[2]), i.addEventListener("click", d), BAMSEC.userIsActive) {
            null != a && a.addEventListener("click", u), s.addEventListener("click", l);
            const r = parseInt(n[e].dataset.tableId, 10);
            o.getElementsByTagName("input")[0].defaultValue = "".concat(t).concat(r);
          } else null != a && a.addEventListener("click", h), s.addEventListener("click", c);
        }
        e.defaultView.Element.prototype.matches = Element.prototype.matches, e.defaultView.Element.prototype.closest = Element.prototype.closest, e.addEventListener("mouseover", t => {
          const n = t.target.closest(".trigger-focus");
          if (null !== n) {
            const t = n.parentNode, r = "bamsec-table-".concat(t.dataset.tableId), i = e.getElementsByClassName(r).item(0);
            null !== i && i.classList.add("table-focus");
          }
        }), e.addEventListener("mouseout", t => {
          const n = t.target.closest(".trigger-focus");
          if (null !== n) {
            const t = n.parentNode, r = "bamsec-table-".concat(t.dataset.tableId), i = e.getElementsByClassName(r).item(0);
            null !== i && i.classList.remove("table-focus");
          }
        });
      }("".concat(BAMSEC.filingUrl, "&table=")), null != BAMSEC.jumpTablePosition && (!function (t) {
        const e = document.getElementById("embedded_doc").contentWindow.document, n = e.getElementsByTagName("table").item(t);
        if (null === n) return;
        const r = i()(n);
        let a = e.getElementById("bamsec-table-btns-wrapper-".concat(t));
        null === a && (a = n), a.scrollIntoView(), n.classList.add("jump-table-focus"), r.fadeTo(200, 0.33).fadeTo(750, 1, () => {
          n.classList.remove("jump-table-focus"), n.classList.add("jump-table-fade");
        }), s.track("Table Link - Followed", {filing_id: BAMSEC.filingId, position: t});
      }(BAMSEC.jumpTablePosition), "ontouchstart" in window ? i()("#jump-table-alert:visible").hide() : i()("#jump-table-alert:visible").fadeOut(300)), Object(o.a)("Filing", "tables:unblock"), Object(o.a)("Filing", "tables:only", "iframe:loaded"));
    }
  }, "4duG": function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return u;
    });
    var r = n("3a3M"), i = n.n(r), a = n("kOgP"), o = n.n(a), s = n("eQQh"), l = n("RiZx"), c = n("YXJw"), d = n("RbWA");
    function u() {
      if (BAMSEC.sharedHighlights && 0 !== BAMSEC.sharedHighlights.length) {
        const t = BAMSEC.transcriptId ? BAMSEC.sharedHighlights[0].id : BAMSEC.sharedHighlights[0].highlightId, e = BAMSEC.personalHighlights && -1 !== BAMSEC.personalHighlights.map(t => t.highlightId).indexOf(t);
        if (BAMSEC.transcriptId) {
          Object(c.c)(o()(BAMSEC.sharedHighlights[0]), true) ? Object(s.a)("shared-highlight-1") : i()("#missing-shared-highlight").modal("show"), "ontouchstart" in window ? i()("#shared-highlight-alert:visible").hide() : i()("#shared-highlight-alert:visible").fadeOut(300), l.track("Highlight - Link Followed", {transcript_id: BAMSEC.transcriptId, highlight_id: t, highlight_type: e ? "personal" : "shared"});
        } else {
          if ("true" === new URL(document.location).searchParams.get("hl_is_xpath")) return void Object(d.a)(BAMSEC.sharedHighlights.map(t => t.hl_xpath).join("::"), BAMSEC.sharedHighlights.map(t => t.hl_color).join("::"), BAMSEC.sharedHighlights.map(t => t.hl_text).join("::"));
          Object(c.b)(o()(BAMSEC.sharedHighlights), true), Object(s.a)("shared-highlight-1"), "ontouchstart" in window ? i()("#shared-highlight-alert:visible").hide() : i()("#shared-highlight-alert:visible").fadeOut(300), l.track("Highlight - Link Followed", {filing_id: BAMSEC.filing_id, highlight_id: t, highlight_type: e ? "personal" : "shared"});
        }
      }
    }
  }, "5vo1": function (t, e, n) {
    (function (t) {
      !function (t) {
        var e = t.fn.tooltip.Constructor.prototype.getPosition;
        t.fn.tooltip.Constructor.prototype.getPosition = function (n) {
          if (!n && this.options.positionElement) {
            var r = {scroll: (n = this.$element).scrollTop()}, i = n[0].getBoundingClientRect(), a = this.options.positionElement.getBoundingClientRect(), o = n.offset();
            return o = {top: o.top + a.top - i.top, left: o.left + a.left - i.left}, t.extend({}, a, r, null, o);
          }
          return e.apply(this, [n]);
        };
      }(t);
    }.call(this, n("3a3M")));
  }, B5QN: function (t, e, n) {
    "use strict";
    var r = n("StTq");
    t.exports = function (t) {
      var e = r.shuffled();
      return {version: 15 & e.indexOf(t.substr(0, 1)), worker: 15 & e.indexOf(t.substr(1, 1))};
    };
  }, GOv7: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return i;
    }), n.d(e, "b", function () {
      return a;
    });
    var r = n("RiZx");
    function i(t, e, n, i, o) {
      BAMSEC.userIsActive ? window.location.href = "https://tables.bamsec.com/tables/".concat(e, "/").concat(n, "/table-").concat(i, ".xlsx?response-content-disposition=attachment%3B%20filename%3D%22").concat(t, "-").concat(e.slice(-4), "-").concat(i, ".xlsx%22") : BAMSEC.showMarketingModal("table-downloads"), r.track("Table - Downloaded", {filing_id: e, table_id: i, button_location: o});
    }
  }, JHUR: function (t, e, n) {
    "use strict";
    var r = n("StTq");
    t.exports = function (t) {
      if (!t || "string" !== typeof t || t.length < 6) return false;
      var e = r.characters();
      return 0 === t.split("").map(function (t) {
        if (-1 === e.indexOf(t)) return t;
      }).join("").split("").join("").length;
    };
  }, JX1n: function (t, e, n) {
    "use strict";
    var r, i, a = n("StTq"), o = n("Qatf"), s = n("B5QN"), l = n("JHUR"), c = n("Y4VV") || 0;
    function d() {
      var t = "", e = Math.floor(0.001 * (Date.now() - 1426452414093));
      return e === i ? r++ : (r = 0, i = e), t += o(a.lookup, 5), t += o(a.lookup, c), r > 0 && (t += o(a.lookup, r)), t += o(a.lookup, e);
    }
    t.exports = d, t.exports.generate = d, t.exports.seed = function (e) {
      return a.seed(e), t.exports;
    }, t.exports.worker = function (e) {
      return c = e, t.exports;
    }, t.exports.characters = function (t) {
      return undefined !== t && a.characters(t), a.shuffled();
    }, t.exports.decode = s, t.exports.isValid = l;
  }, "OWR+": function (t, e, n) {
    "use strict";
    var r = 1;
    t.exports = {nextValue: function () {
      return (r = (9301 * r + 49297) % 233280) / 233280;
    }, seed: function (t) {
      r = t;
    }};
  }, PCFl: function (t, e, n) {
    "use strict";
    t.exports = n("JX1n");
  }, Q2Ao: function (t, e, n) {
    "use strict";
    function r(t, e) {
      let n = String(t).trim().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\s+/g, "\\s+");
      return e || (/^\b/.test(n) && (n = "(\\b|^)" + n), /\b$/.test(n) && (n += "(\\b|$)")), new RegExp(n, "gm");
    }
    function a(t) {
      let e = t;
      do {
        if (e.nodeType === Node.ELEMENT_NODE) return e;
        e = e.parentNode;
      } while (null !== e);
      throw new Error("Unexpected Node without Element parents");
    }
    function o(t) {
      const e = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "–": "&ndash;"};
      return String(t).replace(/[&<>"'/\u2013]/g, t => e[t]);
    }
    function s(t) {
      const e = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#x2F;": "/", "&ndash;": "–"}, n = new RegExp("&(amp|lt|gt|quot|#39|#x2F|ndash);", "gm");
      return String(t).replace(n, t => e[t]);
    }
    function l() {
      const t = document.getElementById("embedded_doc");
      return null !== t && t instanceof HTMLIFrameElement && null != t.contentWindow ? t.contentWindow : null;
    }
    function c() {
      const t = l();
      return null === t ? null : t.document.getElementsByTagName("html").item(0);
    }
    n.d(e, "d", function () {
      return r;
    }), n.d(e, "b", function () {
      return i;
    }), n.d(e, "a", function () {
      return a;
    }), n.d(e, "c", function () {
      return o;
    }), n.d(e, "g", function () {
      return s;
    }), n.d(e, "f", function () {
      return l;
    }), n.d(e, "e", function () {
      return c;
    });
  }, Qatf: function (t, e, n) {
    "use strict";
    var r = n("ytxT");
    t.exports = function (t, e) {
      for (var n, i = 0, a = ""; !n;) a += t(e >> 4 * i & 15 | r()), n = e < Math.pow(16, i + 1), i++;
      return a;
    };
  }, RbWA: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return p;
    });
    var r = n("3a3M"), i = n.n(r), a = n("kOgP"), o = n.n(a), s = n("PCFl"), l = n.n(s), c = n("eQQh"), d = n("RiZx"), u = n("YXJw"), h = n("Q2Ao"), f = n("k5fx");
    function p(t, e, n) {
      let r = new URL(document.location).searchParams, a = t || r.get("hl_xpath"), s = n || r.get("hl_text"), p = e || r.get("hl_color"), g = Object(h.f)();
      if (!a || !g) return;
      let m = p ? p.split("::") : [], b = s ? s.split("::") : [], v = g.document, x = [];
      a.split("::").map((t, e) => {
        let n = v.evaluate(t, v, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE), r = null;
        for (; r = n.iterateNext();) x.push({node: r, color: m[e] ? m[e] : null, stringContent: b[e] ? b[e] : null});
      });
      let E = x.map(t => {
        let {node: e, color: n, stringContent: r} = t, i = v.createRange();
        i.setStart(e, 0), i.setEndAfter(e);
        let {startOffset: a, endOffset: o} = Object(f.a)(i, null !== r && undefined !== r ? r : e.innerText, v.getElementsByTagName("html"));
        return {startIndex: a, endIndex: o, highlightId: l.a.generate().toLowerCase(), color: n};
      });
      if (E.length && BAMSEC.filingId) {
        Object(u.b)(o()(E), true);
        let t = Math.floor(window.innerHeight / 2);
        Object(c.b)("shared-highlight-1", 0, t), "ontouchstart" in window ? i()("#shared-highlight-alert:visible").hide() : i()("#shared-highlight-alert:visible").fadeOut(300), d.track("Highlight - SFA Link Followed", {filing_id: BAMSEC.filingId, highlight_type: "canalyst_sfa"});
      }
    }
  }, RiZx: function (t, e, n) {
    "use strict";
    function r(t, e) {
      "undefined" !== typeof analytics && null !== analytics && analytics.track(t, e);
    }
    n.r(e), n.d(e, "track", function () {
      return r;
    });
  }, StTq: function (t, e, n) {
    "use strict";
    var r, i, a, o = n("OWR+"), s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
    function l() {
      a = false;
    }
    function c(t) {
      if (t) {
        if (t !== r) {
          if (t.length !== s.length) throw new Error("Custom alphabet for shortid must be " + s.length + " unique characters. You submitted " + t.length + " characters: " + t);
          var e = t.split("").filter(function (t, e, n) {
            return e !== n.lastIndexOf(t);
          });
          if (e.length) throw new Error("Custom alphabet for shortid must be " + s.length + " unique characters. These characters were not unique: " + e.join(", "));
          r = t, l();
        }
      } else r !== s && (r = s, l());
    }
    function d() {
      return a || (a = function () {
        r || c(s);
        for (var t, e = r.split(""), n = [], i = o.nextValue(); e.length > 0;) i = o.nextValue(), t = Math.floor(i * e.length), n.push(e.splice(t, 1)[0]);
        return n.join("");
      }());
    }
    t.exports = {characters: function (t) {
      return c(t), r;
    }, seed: function (t) {
      o.seed(t), i !== t && (l(), i = t);
    }, lookup: function (t) {
      return d()[t];
    }, shuffled: d};
  }, U2zk: function (t, e, n) {
    "use strict";
    n.d(e, "b", function () {
      return i;
    }), n.d(e, "a", function () {
      return a;
    });
    var r = n("xJD9");
    const i = t => {
      const e = document.createElement("a");
      return e.href = t, e.host || (e.href = e.href), /.+\.html?$/i.test(e.pathname);
    }, a = t => {
      try {
        return "string" === typeof t.contentWindow.location.href;
      } catch (t) {
        return r.withScope(e => {
          e.setFingerprint(["Inaccessible iframe"]), r.captureException(t);
        }), false;
      }
    };
  }, WaX7: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return S;
    }), n.d(e, "b", function () {
      return O;
    });
    var r = n("/98b"), i = n.n(r), a = n("3a3M"), o = n.n(a), s = n("kOgP"), l = n.n(s), c = n("PCFl"), d = n.n(c), u = (n("sGiQ"), n("5vo1"), n("Ez0K"), n("fr22"), n("C4uu")), h = n("QlFh"), f = n("RiZx"), p = n("l4ti"), g = n("YXJw"), m = n("Q2Ao"), b = n("k5fx");
    const v = /\S/;
    function x() {
      const t = Object(m.f)();
      if (null === t) return null;
      const e = t.getSelection();
      if (null === e || e.isCollapsed) return null;
      let n, r;
      t.Element.prototype.matches = Element.prototype.matches, t.Element.prototype.closest = Element.prototype.closest;
      for (let t = 0; t < e.rangeCount; t += 1) if (n = e.getRangeAt(t), r = n.toString(), i = r, v.test(i) && i.length >= 2 && !E(n)) return n;
      var i;
      return null;
    }
    function E(t) {
      const e = t.startContainer.parentElement, n = t.endContainer.parentElement;
      return null != e && null !== e.closest(".popover") || null != n && null !== n.closest(".popover");
    }
    var I = '<div id="button-container" class="populated-popover" data-highlight-id="{highlightId}" data-match-index="{matchIndex}" data-highlighted-text="{highlightedText}" data-saved="true"><a id="unhighlight-btn" href="#"><span class="icon-cancel"></span> Clear</a><a id="show-url" href="#"><span class="icon-link-1"></span> Link</a></div>', C = '<div id="button-container" class="populated-popover" data-highlight-id="{highlightId}" data-start-offset="{startOffset}" data-end-offset="{endOffset}" data-saved="true"><a id="unhighlight-btn" href="#"><span class="icon-cancel"></span> Clear</a><a id="show-url" href="#"><span class="icon-link-1"></span> Link</a></div>', y = '<div id="link-container"><a id="hide-url" href="#"><span class="icon-left-open"></span></a><input id="popover-input" type="text" readonly="readonly" value="{shareUrl}"><a id="open-url" href="{shareUrl}" target="_blank"><span class="icon-export"></span></a></div>';
    function S() {
      var t = document.getElementById("embedded_doc").contentWindow.document, e = t.getElementsByTagName("html");
      if (0 !== e.length) {
        var n = o()(t), r = o()(t.getElementsByTagName("body")).first();
        0 !== r.length && (n.on("mousedown", function (t) {
          if (0 !== o()(t.target).parents("#button-container, #link-container").length) return true;
          a();
        }), n.on("mouseup", function (e) {
          if (0 !== o()(e.target).parents("#button-container, #link-container").length) return true;
          window.setTimeout(function () {
            !function () {
              var e = x();
              if (e) {
                var n = r.data("bs.popover");
                n ? (n.options.positionElement = e, n.$tip.find(".popover-content").css("width", "")) : r.popover({animation: true, trigger: "manual", placement: "auto top", container: r, viewport: t.getElementsByTagName("html")[0], html: true, positionElement: e, content: '<div id="button-container"><a id="highlight-btn" href="#"><span class="icon-pencil"></span> Save</a><a id="show-url" href="#"><span class="icon-link-1"></span> Link</a></div><div id="link-container"><a id="hide-url" href="#"><span class="icon-left-open"></span></a><input id="popover-input" type="text" readonly="readonly" value=""><a id="open-url" href="" target="_blank"><span class="icon-export"></span></a></div>'}), r.popover("show"), r.on("shown.bs.popover", function () {
                  r.data("bs.popover").$tip.removeClass("fade"), r.off("shown.bs.popover");
                });
              }
            }();
          }, 20);
        }), n.on("click", "#highlight-btn", function () {
          if (!BAMSEC.userIsActive) {
            BAMSEC.showMarketingModal("personal-highlight");
            const t = BAMSEC.filingId ? {filing_id: BAMSEC.filingId} : {transcript_id: BAMSEC.transcriptId};
            return f.track("Highlight - Saved", t), false;
          }
          if (BAMSEC.userIsGSMasked) return p.showModal(), false;
          var t = o()(this).parent();
          if (t.hasClass("disabled")) return false;
          if (t.addClass("disabled"), !(BAMSEC.transcriptId ? c(t) : s(t))) return alert("Sorry, we cannot highlight this selection. You likely selected more than a couple of pages of text, your selection contains BamSEC table buttons, or your selection includes a popup from an existing highlight."), a(), false;
          const e = document.getElementById("embedded_doc").contentWindow.document;
          if (null != e.body.createTextRange) {
            const t = e.body.createTextRange();
            t.collapse(), t.select();
          } else e.getSelection().removeAllRanges();
          a(), t.removeClass("disabled");
          var n, r = t.data("highlightId").toString(), i = Object(m.g)(t.data("highlightedText").toString());
          if (BAMSEC.transcriptId) n = {id: r, text: i, matchIndex: t.data("matchIndex"), isSaved: true}, Object(g.c)(l()(n), false), M(r, n), Object(u.a)("/transcripts/".concat(BAMSEC.transcriptId, "/highlights/").concat(r), {method: "PUT", body: n}).catch(h.a), f.track("Highlight - Saved", {transcript_id: BAMSEC.transcriptId, highlight_id: r}); else {
            var d = t.data("startOffset"), b = t.data("endOffset"), v = t.data("xpaths");
            n = {highlightId: r, startIndex: d, endIndex: b}, Object(g.b)(l()([n]), false), M(r), Object(u.a)("/filing/highlights/add", {method: "POST", body: {filing_id: BAMSEC.filingId, sequence: BAMSEC.sequence, start_index: d, end_index: b, text_contents: i, highlight_id: r, xpaths: v, saved: true}}).catch(h.a), f.track("Highlight - Saved", {filing_id: BAMSEC.filingId, highlight_id: r});
          }
          return false;
        }), n.on("click", "#show-url", function () {
          if (!BAMSEC.userIsActive) {
            BAMSEC.showMarketingModal("share-highlight");
            const t = BAMSEC.filingId ? {filing_id: BAMSEC.filingId} : {transcript_id: BAMSEC.transcriptId};
            return f.track("Highlight - Link Viewed", i()({highlight_type: "shared"}, t)), false;
          }
          var t = o()(this).parent();
          if (t.hasClass("disabled")) return false;
          if (t.addClass("disabled"), !(BAMSEC.transcriptId ? c(t) : s(t))) return alert("Sorry, we cannot generate a link to this selection. You likely selected more than a couple of pages of text, your selection contains BamSEC table buttons, or your selection includes a popup from an existing highlight."), a(), false;
          var e = 38.5, n = t.parents(".popover"), r = n.find(".popover-content");
          n.animate({left: "-=" + e.toString()}, 200, "linear"), r.animate({width: 207}, 200, "linear"), n.find("#button-container").animate({left: -130}, 200, "linear"), n.find("#link-container").animate({right: 0}, 200, "linear", function () {
            t.removeClass("disabled");
          }), n.find("#popover-input").select();
          var d, p = t.data("highlightId").toString(), b = t.data("highlightedText");
          if (b && (b = Object(m.g)(b.toString())), BAMSEC.transcriptId) d = {id: p, text: b, matchIndex: t.data("matchIndex"), isSaved: false}, Object(g.c)(l()(d), true), "ontouchstart" in window ? o()("#shared-highlight-alert:visible").hide() : o()("#shared-highlight-alert:visible").fadeOut(300), "undefined" === typeof b || t.data("saved") || (Object(u.a)("/transcripts/".concat(BAMSEC.transcriptId, "/highlights/").concat(p), {method: "PUT", body: d}).catch(h.a), t.data("saved", true)), f.track("Highlight - Link Viewed", {transcript_id: BAMSEC.transcriptId, highlight_type: null == b ? "personal" : "shared", highlight_id: p}); else {
            var v = t.data("startOffset"), x = t.data("endOffset"), E = t.data("xpaths");
            d = {startIndex: v, endIndex: x, highlightId: p}, Object(g.b)(l()([d]), true), "undefined" === typeof b || t.data("saved") || (Object(u.a)("/filing/highlights/add", {method: "POST", body: {filing_id: BAMSEC.filingId, sequence: BAMSEC.sequence, start_index: v, end_index: x, text_contents: b, highlight_id: p, xpaths: E, saved: false}}).catch(h.a), t.data("saved", true)), f.track("Highlight - Link Viewed", {filing_id: BAMSEC.filingId, highlight_type: null == b ? "personal" : "shared", highlight_id: p});
          }
          return false;
        }), n.on("click", "#hide-url", function () {
          if (!BAMSEC.userIsActive) return BAMSEC.showMarketingModal("personal-highlight"), false;
          var t = 38.5, e = o()(this).parents(".popover"), n = e.find(".popover-content");
          return e.animate({left: "+=" + t.toString()}, 200, "linear"), n.animate({width: 130}, 200, "linear"), e.find("#button-container").animate({left: 0}, 200, "linear"), e.find("#link-container").animate({right: -207}, 200, "linear"), false;
        }), n.on("click", "#unhighlight-btn", function () {
          var t = o()(this).parent().data("highlightId"), e = r.find(".hl-" + t);
          return e.off("mouseenter mouseleave"), e.first().popover("destroy"), e.removeClass(), BAMSEC.transcriptId ? Object(u.a)("/transcripts/".concat(BAMSEC.transcriptId, "/highlights/").concat(t), {method: "DELETE"}).catch(h.a) : Object(u.a)("/filing/highlights/remove", {method: "POST", body: {filing_id: BAMSEC.filingId, sequence: BAMSEC.sequence, highlight_id: t}}).catch(h.a), false;
        }));
      }
      function a() {
        var t = r.data("bs.popover");
        if (t) {
          var e = t.$tip.find("#highlight-btn");
          if (0 !== e.length) {
            var n = e.parent().data("highlightId");
            r.find(".hl-" + n).removeClass("bamsec-temp-highlight .hl-" + n), r.popover("hide");
          }
        }
      }
      function s(t) {
        if (t.hasClass("populated-popover")) return true;
        var n = x();
        if (!n) return a(), false;
        if (null !== Object(m.a)(n.startContainer).closest(".bamsec-table-btns-wrapper") || null !== Object(m.a)(n.endContainer).closest(".bamsec-table-btns-wrapper")) return false;
        var r = n.toString();
        if (r.length > 2e4) return false;
        if (/Download\s*(\sSimilar Tables\s*)?Link/.test(r)) return false;
        var i, o = Object(b.a)(n, r, e);
        try {
          let t = Object(b.c)(n);
          i = t.length < 1e3 ? t : null;
        } catch (t) {}
        if (null === o.startOffset) return false;
        var s = d.a.generate().toLowerCase(), l = BAMSEC.filingUrl + "&hl=" + o.startOffset.toString() + ":" + o.endOffset.toString() + "&hl_id=" + s, c = t.next(), d = c.find("#popover-input"), u = c.find("#open-url");
        return t.attr("data-highlight-id", s), t.attr("data-highlighted-text", Object(m.c)(r)), t.attr("data-start-offset", o.startOffset), t.attr("data-end-offset", o.endOffset), t.attr("data-xpaths", i), d.attr("value", l), u.attr("href", l), t.addClass("populated-popover"), true;
      }
      function c(t) {
        if (t.hasClass("populated-popover")) return true;
        var n = x();
        if (!n) return a(), false;
        var r = n.toString();
        if (r.length > 2e4) return false;
        var i = Object(b.b)(n, r, e);
        if (null === i.matchIndex) return false;
        var o = d.a.generate().toLowerCase(), s = BAMSEC.transcriptUrl + "?hl_id=" + o, l = t.next(), c = l.find("#popover-input"), d = l.find("#open-url");
        return t.attr("data-highlight-id", o), t.attr("data-highlighted-text", Object(m.c)(r)), t.attr("data-match-index", i.matchIndex), c.attr("value", s), d.attr("href", s), t.addClass("populated-popover"), true;
      }
    }
    function M(t, e) {
      var n = document.getElementById("embedded_doc").contentWindow.document, r = o()(n), i = r.find(".hl-" + t), a = i.first(), s = a.parent();
      a.popover({animation: true, trigger: "manual", placement: "auto top", container: s, viewport: n.getElementsByTagName("html")[0], html: true, content: function () {
        var n, r, i;
        return BAMSEC.transcriptId ? (i = {baseUrl: BAMSEC.transcriptUrl, highlightId: t.toString(), matchIndex: e.matchIndex.toString(), highlightedText: Object(m.c)(e.text.toString())}, r = I.supplant(i), n = "{baseUrl}?hl_id={highlightId}".supplant(i), e.legacyParam && (n += e.legacyParam)) : (i = {baseUrl: BAMSEC.filingUrl, highlightId: t.toString(), startOffset: a.data("startIndex").toString(), endOffset: a.data("endIndex").toString()}, r = C.supplant(i), n = "{baseUrl}&amp;hl={startOffset}:{endOffset}&amp;hl_id={highlightId}".supplant(i)), r + y.supplant({shareUrl: n});
      }}), i.on("mouseenter", function () {
        var t = o()(this), e = "." + t.attr("class").split(" ").filter(function (t) {
          return "bamsec-" === t.substr(0, 7) || "hl-" === t.substr(0, 3);
        }).join("."), n = r.find(e), i = n.first(), a = i.parent();
        a.find(".popover").hasClass("in") || i.popover("show"), a.off("mouseenter", ".popover").on("mouseenter", ".popover", function () {
          o()(this).addClass("hovered");
        }), a.off("mouseleave", ".popover").on("mouseleave", ".popover", function () {
          o()(this).removeClass("hovered"), n.trigger("mouseleave");
        }), t.addClass("hovered"), t.hasClass("hovered-css") || n.addClass("hovered-css");
      }), i.on("mouseleave", function () {
        var t = o()(this), e = t.attr("class").split(" ").filter(function (t) {
          return "hl-" === t.substr(0, 3);
        }).pop(), n = r.find("." + e), i = n.first(), a = i.parent();
        setTimeout(function () {
          0 === a.find(".popover.hovered").length && 0 === n.filter(".hovered").length && (n.removeClass("hovered-css"), a.find(".popover-content").css("width", ""), i.popover("hide"), r.find(".bamsec-temp-highlight." + e).removeClass("bamsec-temp-highlight"));
        }, 300), t.removeClass("hovered");
      });
    }
    function O() {
      if (BAMSEC.personalHighlights && 0 !== BAMSEC.personalHighlights.length) if (BAMSEC.transcriptId) for (var t = 0; t < BAMSEC.personalHighlights.length; t++) Object(g.c)(l()(BAMSEC.personalHighlights[t]), false), M(BAMSEC.personalHighlights[t].id, BAMSEC.personalHighlights[t]); else Object(g.b)(l()(BAMSEC.personalHighlights), false), BAMSEC.personalHighlights.forEach(function (t) {
        M(t.highlightId);
      });
    }
  }, Y4VV: function (t, e, n) {
    "use strict";
    t.exports = 0;
  }, YGSd: function (t, e, n) {
    "use strict";
    function r() {
      var t = document.getElementById("embedded_doc");
      t.contentWindow.addEventListener("click", function (e) {
        var n = i("a", e.target);
        if (n && !a(n) && "" !== n.href) {
          e.preventDefault();
          var r = o(n.href.replace("-rendered", "")), s = o(t.src.replace("-rendered", ""));
          if (r.protocol === s.protocol && r.host === s.host && r.pathname === s.pathname && r.hash) t.contentWindow.location.hash = "bamsec-clear-hash", t.contentWindow.location.hash = r.hash; else if (r.protocol !== s.protocol || r.host !== s.host) window.location.href = n.href; else {
            var c = n.pathname.split("/").pop().replace("-rendered", "");
            window.location.assign("".concat(location.protocol, "//").concat(location.host, "/redirect-to-exhibit/").concat(BAMSEC.filingId, "/").concat(c, "/").concat(l("cik")));
          }
        }
      });
    }
    n.d(e, "a", function () {
      return r;
    });
    var i = function (t, e) {
      for (var n = e; n;) {
        if ((n.nodeName || n.tagName).toLowerCase() === t.toLowerCase()) return n;
        n = n.parentNode;
      }
      return null;
    }, a = function (t) {
      for (var e = t; e;) {
        if ("" !== e.className && (" " + e.className + " ").indexOf(" bamsec-table-btns-wrapper ") > -1 || "" !== e.className && (" " + e.className + " ").indexOf(" popover ") > -1) return true;
        e = e.parentNode;
      }
      return false;
    }, o = function (t) {
      var e = document.createElement("a");
      return e.href = t, e.host || (e.href = e.href), e;
    }, l = function (t) {
      var e = RegExp("[?&]" + t + "=([^&]*)").exec(window.location.search);
      return e ? decodeURIComponent(e[1].replace(/\+/g, " ")) : "";
    };
  }, YXJw: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return l;
    }), n.d(e, "b", function () {
      return c;
    }), n.d(e, "c", function () {
      return d;
    });
    var r = n("/98b"), i = n.n(r), a = n("oWgl"), o = n.n(a), s = n("Q2Ao");
    function l(t) {
      const e = Object(s.e)();
      if (null === e) return;
      e.ownerDocument.defaultView.Element.prototype.matches = Element.prototype.matches, e.ownerDocument.defaultView.Element.prototype.closest = Element.prototype.closest;
      const n = t.asMutable().map(t => i()(i()({}, t), {}, {regex: Object(s.d)(t.highlightText, false)})), r = [];
      o()(e, {findArray: n, replace: function (t, n) {
        if (3 === t.node.nodeType && 0 === t.text.trim().length) return t.text;
        const i = e.ownerDocument.createElement("span");
        return i.className = "bamsec-fulltext-highlight bamsec-fulltext-highlight-".concat(n.overallIndex), -1 === r.indexOf(n.overallIndex) && (i.id = "bamsec-fulltext-highlight-".concat(n.overallIndex), r.push(n.overallIndex)), i.innerHTML = Object(s.c)(t.text), i;
      }, filterElements: s.b});
      const a = [];
      n.forEach(t => {
        t.highlightTerms.forEach(e => {
          a.push({regex: Object(s.d)(e, false), overallIndex: t.overallIndex});
        });
      }), o()(e, {findArray: a, replace: (t, n) => {
        if (3 === t.node.nodeType && 0 === t.text.trim().length) return t.text;
        if (null === Object(s.a)(t.node).closest(".bamsec-fulltext-highlight-".concat(n.overallIndex))) return t.text;
        const r = e.ownerDocument.createElement("span");
        return r.innerHTML = Object(s.c)(t.text), r.setAttribute("class", "bamsec-fulltext-term"), r;
      }, filterElements: s.b});
      const l = document.getElementById("fulltext-result-alert");
      null !== l && ("ontouchstart" in window ? l.classList.add("hidden") : (l.classList.add("faded-out"), setTimeout(() => {
        l.classList.add("hidden"), l.classList.remove("faded-out");
      }, 300)));
    }
    function c(t, e) {
      const n = t.map(t => {
        const e = i()({}, t);
        return t.startIndex > t.endIndex ? (e.startIndex = parseInt(t.endIndex, 10), e.endIndex = parseInt(t.startIndex, 10)) : (e.startIndex = parseInt(t.startIndex, 10), e.endIndex = parseInt(t.endIndex, 10)), e;
      }).filter(t => t.endIndex - t.startIndex <= 2e4 && t.endIndex - t.startIndex > 0).asMutable().sort((t, e) => t.startIndex !== e.startIndex ? t.startIndex - e.startIndex : t.endIndex - e.endIndex);
      if (0 === n.length) return;
      const r = Object(s.e)();
      if (null === r) return;
      let a = false;
      const l = e ? "bamsec-temp-highlight" : "bamsec-perm-highlight";
      o()(r, {findRanges: n, replace: (n, i) => {
        if (3 === n.node.nodeType && 0 === n.text.trim().length) return n.text;
        const o = r.ownerDocument.createElement("span");
        return i.color ? o.style.backgroundColor = "#".concat(i.color) : o.className = "".concat(l, " hl-").concat(i.highlightId), o.setAttribute("data-highlight-id", i.highlightId), o.setAttribute("data-start-index", i.startIndex.toString()), o.setAttribute("data-end-index", i.endIndex.toString()), false === a && true === e && i.highlightId === t[0].highlightId && (o.id = "shared-highlight-1", a = true), o.innerHTML = Object(s.c)(n.text), o;
      }, filterElements: s.b});
    }
    function d(t, e) {
      const n = Object(s.e)();
      if (null === n) return false;
      const r = Object(s.d)(Object(s.g)(t.text), true), i = e ? "bamsec-temp-highlight" : "bamsec-perm-highlight";
      let a = false;
      return o()(n, {find: r, filterElements: s.b, replace: (r, o) => {
        if (o.index !== t.matchIndex) return r.text;
        if (a = true, 3 === r.node.nodeType && 0 === r.text.trim().length) return r.text;
        const l = n.ownerDocument.createElement("span");
        return l.className = "".concat(i, " hl-").concat(t.id), l.setAttribute("data-highlight-id", t.id), l.setAttribute("data-match-index", t.matchIndex.toString()), e && (l.id = "shared-highlight-1"), l.innerHTML = Object(s.c)(r.text), l;
      }}), a;
    }
  }, aE87: function (t, e, n) {
    (function (n) {
      var r, i, a, o;
      o = "undefined" !== typeof n ? n : this.window || this.global, i = [], r = function (t) {
        "use strict";
        var e, n, r, i, a = {}, o = "querySelector" in document && "addEventListener" in document, s = {selector: "[data-scroll]", selectorHeader: "[data-scroll-header]", speed: 500, easing: "easeInOutCubic", offset: 0, updateURL: true, callback: function () {}}, l = function () {
          var t = {}, e = false, n = 0, r = arguments.length;
          "[object Boolean]" === Object.prototype.toString.call(arguments[0]) && (e = arguments[0], n++);
          for (var i = function (n) {
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e && "[object Object]" === Object.prototype.toString.call(n[r]) ? t[r] = l(true, t[r], n[r]) : t[r] = n[r]);
          }; n < r; n++) {
            var a = arguments[n];
            i(a);
          }
          return t;
        }, c = function (t) {
          return null === t ? 0 : (e = t, Math.max(e.scrollHeight, e.offsetHeight, e.clientHeight) + t.offsetTop);
          var e;
        };
        a.animateScroll = function (e, n, a) {
          t = BAMSEC.smoothScrollWindow;
          var o = function (t) {
            return t && "object" === typeof JSON && "function" === typeof JSON.parse ? JSON.parse(t) : {};
          }(e ? e.getAttribute("data-options") : null), d = l(d || s, a || {}, o), u = "#" === (n = "#" + function (t) {
            for (var e, n = String(t), r = n.length, i = -1, a = "", o = n.charCodeAt(0); ++i < r;) {
              if (0 === (e = n.charCodeAt(i))) throw new InvalidCharacterError("Invalid character: the input contains U+0000.");
              a += e >= 1 && e <= 31 || 127 == e || 0 === i && e >= 48 && e <= 57 || 1 === i && e >= 48 && e <= 57 && 45 === o ? "\\" + e.toString(16) + " " : e >= 128 || 45 === e || 95 === e || e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 ? n.charAt(i) : "\\" + n.charAt(i);
            }
            return a;
          }(n.substr(1))) ? t.document.documentElement : t.document.querySelector(n), h = t.pageYOffset;
          r || (r = t.document.querySelector(d.selectorHeader)), i || (i = c(r));
          var f, p, g, m = function (e, n, r) {
            var i = e.getBoundingClientRect(), a = t.document.body, o = t.document.documentElement, s = window.pageYOffset || o.scrollTop || a.scrollTop, l = o.clientTop || a.clientTop || 0, c = Math.round(i.top + s - l);
            return (c = c - n - r) >= 0 ? c : 0;
          }(u, i, parseInt(d.offset, 10)), b = m - h, v = Math.max(t.document.body.scrollHeight, t.document.documentElement.scrollHeight, t.document.body.offsetHeight, t.document.documentElement.offsetHeight, t.document.body.clientHeight, t.document.documentElement.clientHeight), x = 0;
          !function (e, n) {
            t.history.pushState && (n || "true" === n) && "file:" !== t.location.protocol && t.history.pushState(null, null, [t.location.protocol, "//", t.location.host, t.location.pathname, t.location.search, e].join(""));
          }(n, d.updateURL);
          var E = function () {
            p = (p = (x += 16) / parseInt(d.speed, 10)) > 1 ? 1 : p, g = h + b * function (t, e) {
              var n;
              return "easeInQuad" === t && (n = e * e), "easeOutQuad" === t && (n = e * (2 - e)), "easeInOutQuad" === t && (n = e < 0.5 ? 2 * e * e : (4 - 2 * e) * e - 1), "easeInCubic" === t && (n = e * e * e), "easeOutCubic" === t && (n = --e * e * e + 1), "easeInOutCubic" === t && (n = e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1), "easeInQuart" === t && (n = e * e * e * e), "easeOutQuart" === t && (n = 1 - --e * e * e * e), "easeInOutQuart" === t && (n = e < 0.5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e), "easeInQuint" === t && (n = e * e * e * e * e), "easeOutQuint" === t && (n = 1 + --e * e * e * e * e), "easeInOutQuint" === t && (n = e < 0.5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e), n || e;
            }(d.easing, p), t.scrollTo(0, Math.floor(g)), function (r, i, a) {
              var o = t.pageYOffset;
              (r == i || o == i || t.innerHeight + o >= v) && (t.clearInterval(a), u.focus(), d.callback(e, n));
            }(g, m, f);
          };
          0 === t.pageYOffset && t.scrollTo(0, 0), f = t.setInterval(E, 16);
        };
        var d = function (t) {
          var n = function (t, e) {
            var n, r, i = e.charAt(0), a = "classList" in document.documentElement;
            for ("[" === i && (n = (e = e.substr(1, e.length - 2)).split("=")).length > 1 && (r = true, n[1] = n[1].replace(/"/g, "").replace(/'/g, "")); t && t !== document; t = t.parentNode) {
              if ("." === i) if (a) {
                if (t.classList.contains(e.substr(1))) return t;
              } else if (new RegExp("(^|\\s)" + e.substr(1) + "(\\s|$)").test(t.className)) return t;
              if ("#" === i && t.id === e.substr(1)) return t;
              if ("[" === i && t.hasAttribute(n[0])) {
                if (!r) return t;
                if (t.getAttribute(n[0]) === n[1]) return t;
              }
              if (t.tagName.toLowerCase() === e) return t;
            }
            return null;
          }(t.target, e.selector);
          n && "a" === n.tagName.toLowerCase() && (t.preventDefault(), a.animateScroll(n, n.hash, e));
        }, u = function (t) {
          n || (n = setTimeout(function () {
            n = null, i = c(r);
          }, 66));
        };
        return a.destroy = function () {
          t = BAMSEC.smoothScrollWindow, e && (t.document.removeEventListener("click", d, false), t.removeEventListener("resize", u, false), e = null, n = null, r = null, i = null);
        }, a.init = function (n) {
          t = BAMSEC.smoothScrollWindow, o && (a.destroy(), e = l(s, n || {}), r = t.document.querySelector(e.selectorHeader), i = c(r), t.document.addEventListener("click", d, false), r && t.addEventListener("resize", u, false));
        }, a;
      }(o), undefined === (a = "function" === typeof r ? r.apply(e, i) : r) || (t.exports = a);
    }.call(this, n("uKge")));
  }, eQQh: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return a;
    }), n.d(e, "b", function () {
      return o;
    });
    var r = n("aE87"), i = n.n(r);
    function a(t) {
      o(t, 300, 100);
    }
    function o(t, e, n) {
      var r = document.getElementById("embedded_doc").contentWindow.document.getElementById(t);
      if (null !== r) if ("ontouchstart" in window) r.scrollIntoView(); else {
        var a = {speed: e, easing: "easeInOutCubic", updateURL: false, offset: n};
        i.a.animateScroll(null, "#" + t, a);
      }
    }
  }, fijN: function (t, e, n) {
    "use strict";
    n.r(e);
    n("1H9E");
    var r = n("RiZx"), i = n("GOv7");
    const a = document.getElementById("download-all-tables");
    a && a.addEventListener("click", t => {
      t.preventDefault(), BAMSEC.userIsActive ? window.location.assign(Object(i.b)(BAMSEC.filingId, BAMSEC.sequence, "all", BAMSEC.entitySlug)) : BAMSEC.showMarketingModal("table-downloads"), r.track("Filing - Downloaded All Tables", {filing_id: BAMSEC.filingId, sequence: BAMSEC.sequence});
    });
    n("geeX");
  }, fr22: function (t, e) {
    String.prototype.supplant || (String.prototype.supplant = function (t) {
      return this.replace(/\{([^{}]*)\}/g, function (e, n) {
        var r = t[n];
        return "string" === typeof r || "number" === typeof r ? r : e;
      });
    });
  }, geeX: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return b;
    });
    var r = n("3a3M"), i = n.n(r), a = n("kOgP"), o = n.n(a), s = n("eQQh"), l = n("YXJw"), c = i()("#fulltext-results"), d = i()("#fulltext-highlights"), u = i()("#fulltext-filing-container"), h = c.length > 0 ? c.get(0).dataset.query : undefined, f = i.a.Deferred(), p = i.a.Deferred(), g = i.a.Deferred();
    const m = t => {
      var e, n;
      f.reject(), f = i.a.Deferred();
      var r, a, o = t.data();
      "undefined" !== typeof o.filingId ? (e = function (t, e, n, r) {
        return d.html(""), i.a.ajax({method: "GET", url: "/document-search/snippets", data: {q: n, cik: r, entityId: r, filingId: t, sequence: e, search_error: c.data("search-error")}, cache: false, success: function (t) {
          d.html(t), d.find(".highlights a").first().trigger("click");
        }});
      }(o.filingId, o.sequence, h, o.entityId), n = function (t, e, n) {
        u.html("");
        var r = "/filing-iframe/" + [t, e, n].join("/");
        return i.a.ajax({method: "GET", url: r, data: {show_fulltext_result_alert: true}, cache: false, success: function (t) {
          u.html(t);
        }});
      }(o.filingId, o.sequence, o.entityId)) : (r = o.transcriptId, a = o.entityId, d.html(""), e = i.a.ajax({method: "GET", url: "/document-search/snippets", data: {q: h, entityId: a, transcriptId: r, search_error: c.data("search-error")}, cache: false, success: function (t) {
        d.html(t), d.find(".highlights a").first().trigger("click");
      }}), n = function (t) {
        u.html("");
        var e = "/transcripts/outer-iframe-wrapper/" + t.toString();
        return i.a.ajax({method: "GET", url: e, data: {show_fulltext_result_alert: true}, cache: false, success: function (t) {
          u.html(t);
        }});
      }(o.transcriptId)), g = i.a.Deferred(), i.a.when(e, n, g).done(f.resolve), i.a.when(f).done(v), t.addClass("visited");
      var s = c.find("a.list-group-item");
      return s.removeClass("selected"), s.children(".bridge").remove(), t.addClass("selected").append('<div class="bridge"></div>'), false;
    };
    function b() {
      g.resolve();
    }
    function v() {
      var t = d.find(".highlights a.list-group-item").map(function (t, e) {
        var n = i()(e).data();
        return {overallIndex: parseInt(n.overallIndex, 10), highlightText: n.highlightText.toString(), highlightTerms: n.highlightTerms.toString().split("|")};
      }).get();
      Object(l.a)(o()(t));
    }
    if (c.on("click", "a.list-group-item:not(.highlighted):not(.transcript-access-disabled)", function () {
      return m(i()(this));
    }), d.on("click", ".highlights a", function () {
      p.reject(), p = i.a.Deferred();
      var t = i()(this);
      i.a.when(f).done(p.resolve), i.a.when(p).done(function () {
        var e = t.data("overallIndex");
        !function () {
          for (var t = document.getElementById("embedded_doc").contentWindow.document.querySelectorAll(".bamsec-fulltext-highlight"), e = 0; e < t.length; e++) t[e].classList.remove("selected");
        }(), function (t) {
          Object(s.a)("bamsec-fulltext-highlight-" + t.toString());
          for (var e = ".bamsec-fulltext-highlight-" + t.toString(), n = document.getElementById("embedded_doc").contentWindow.document.querySelectorAll(e), r = 0; r < n.length; r++) n[r].className += " selected";
        }(e);
      }), t.addClass("visited");
      var e = d.find(".highlights a");
      return e.removeClass("selected"), e.children(".bridge").remove(), t.addClass("selected").append('<div class="bridge"></div>'), false;
    }), BAMSEC.singleDocumentSearch) {
      const t = c.find("a.list-group-item:not(.highlighted):not(.transcript-access-disabled)");
      t.length > 0 && m(i()(t[0]));
    }
  }, iipj: function (t, e, n) {
    "use strict";
    function r(t, e) {
      let n = arguments.length > 2 && undefined !== arguments[2] ? arguments[2] : "responseEnd";
      if (!window.performance || !performance.mark) return;
      if ("filing" !== BAMSEC.pageType) return;
      if (0 === performance.getEntriesByName(e).length && performance.mark(e), 0 === performance.getEntriesByName(n).length) return;
      const r = i(e, n);
      try {
        ga("send", "timing", t, e, r, BAMSEC.pageType);
      } catch (t) {}
    }
    function i(t, e) {
      const n = "".concat(e, ":").concat(t);
      performance.clearMeasures(n), performance.measure(n, e, t);
      const r = performance.getEntriesByName(n)[0];
      return Math.round(r.duration);
    }
    window.BAMSEC.trackTiming = r, e.a = r;
  }, k5fx: function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return c;
    }), n.d(e, "b", function () {
      return d;
    }), n.d(e, "c", function () {
      return u;
    });
    var r = n("/98b"), i = n.n(r), a = n("xJD9"), o = n("oWgl"), s = n.n(o), l = n("Q2Ao");
    function c(t, e, n) {
      const r = 1 === t.startContainer.nodeType && "body" === t.startContainer.nodeName.toLowerCase(), i = 1 === t.endContainer.nodeType && "body" === t.endContainer.nodeName.toLowerCase();
      if (r && i) {
        const r = d(t, e, n);
        return {startOffset: r.startOffset, endOffset: r.endOffset};
      }
      const a = f(t.startContainer, n), o = f(t.endContainer, n);
      let s = a + t.startOffset, l = o + t.endOffset;
      if (r) s = l - e.length; else if (i) l = s + e.length; else if (s + e.length !== l) {
        const r = d(t, e, n);
        return {startOffset: r.startOffset, endOffset: r.endOffset};
      }
      return {startOffset: s, endOffset: l};
    }
    function d(t, e, n) {
      const r = t.getBoundingClientRect(), o = function (t, e) {
        const n = [];
        let r;
        s()(e[0], {find: Object(l.d)(t, true), filterElements: l.b, replace: (t, i) => {
          0 === t.index && (r && n.push(r), r = {matchPortions: [], matchIndex: n.length}), null == r && (r = {matchPortions: [], matchIndex: n.length});
          const a = e[0].ownerDocument.createElement("span");
          return a.innerHTML = Object(l.c)(t.text), r.matchPortions.push({node: a, startIndex: i.startIndex, endIndex: i.endIndex}), a;
        }}), r && n.push(r);
        return n.map(t => {
          return i()(i()({}, t), {}, {boundingClientRect: (e = t.matchPortions, e.map(t => t.node.getBoundingClientRect()).map(t => ({top: t.top, right: t.right, bottom: t.bottom, left: t.left})).reduce((t, e) => ({top: Math.min(t.top, e.top), right: Math.max(t.right, e.right), bottom: Math.max(t.bottom, e.bottom), left: Math.min(t.left, e.left)})))}, function (t) {
            return t.map(t => ({startIndex: t.startIndex, endIndex: t.endIndex})).reduce((t, e) => ({startIndex: Math.min(t.startIndex, e.startIndex), endIndex: Math.max(t.endIndex, e.endIndex)}));
          }(t.matchPortions));
          var e;
        });
      }(e, n);
      if (0 === o.length) {
        const n = t.cloneContents().childNodes, r = document.createElement("div");
        for (let t = 0; t < n.length; t += 1) r.appendChild(n[t]);
        return a.withScope(n => {
          n.setExtras({selectedRange: t, stringContents: e, filingId: BAMSEC.filingId, sequence: BAMSEC.sequence, selectedHTML: r.innerHTML}), a.captureMessage("Could not find selected string contents in document", "error");
        }), {startOffset: null, endOffset: null, matchIndex: null};
      }
      const c = (d = r, o.reduce((t, e) => {
        const n = Math.abs(d.top - t.boundingClientRect.top), r = Math.abs(d.top - e.boundingClientRect.top), i = Math.abs(d.left - t.boundingClientRect.left), a = Math.abs(d.left - e.boundingClientRect.left);
        return r < n || r === n && a < i ? e : t;
      }));
      var d;
      return {startOffset: c.startIndex, endOffset: c.endIndex, matchIndex: c.matchIndex};
    }
    function u(t) {
      let e = [], n = h(t.startContainer);
      if (null !== n && e.push(n), t.startContainer !== t.endContainer) {
        let n = h(t.endContainer);
        null !== n && e.push(n);
      }
      return e.join("::");
    }
    function h(t) {
      if (t === document.documentElement) return "/";
      let e = "", n = t, r = 0;
      for (; n && n !== document.documentElement;) {
        if (r++ > 1e3) return null;
        let t = 0, i = 1, a = n.previousSibling;
        for (; a;) {
          if (t++ > 1e4) return null;
          a.nodeType === Node.ELEMENT_NODE && a.nodeName === n.nodeName && i++, a = a.previousSibling;
        }
        let o = n.nodeName.toLowerCase();
        if (!o.includes("#")) {
          e = "/" + o + ("[" + i + "]") + e;
        }
        n = n.parentNode;
      }
      return e.toLowerCase();
    }
    function f(t, e) {
      return s()(e[0], {getTextLengthBeforeNode: t, filterElements: l.b}).textLengthBeforeNode;
    }
  }, kOgP: function (t, e, n) {
    !function () {
      "use strict";
      function e(t, e, n) {
        Object.defineProperty(t, e, {enumerable: false, configurable: false, writable: false, value: n});
      }
      var i = ["setPrototypeOf"], a = (i.concat(["push", "pop", "sort", "splice", "shift", "unshift", "reverse"]), ["keys"].concat(["map", "filter", "slice", "concat", "reduce", "reduceRight"]));
      i.concat(["setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "setYear"]);
      function o(t) {
        var e = new Error(t);
        return e.__proto__ = o, e;
      }
      function l(t, n) {
        var r = t[n];
        e(t, n, function () {
          return O(r.apply(t, arguments));
        });
      }
      function c(t, e) {
        if (t in this && this[t] === e) return this;
        var n = m.call(this);
        return n[t] = O(e), h(n);
      }
      o.prototype = Error.prototype;
      var d = O([]);
      function u(t, e) {
        var n = t[0];
        if (1 === t.length) return c.call(this, n, e);
        var r, i = t.slice(1), a = this[n];
        if (r = "object" === typeof a && null !== a && "function" === typeof a.setIn ? a.setIn(i, e) : u.call(d, i, e), n in this && a === r) return this;
        var o = m.call(this);
        return o[n] = r, h(o);
      }
      function h(t) {
        for (var n in a) {
          if (a.hasOwnProperty(n)) l(t, a[n]);
        }
        e(t, "flatMap", p), e(t, "asObject", b), e(t, "asMutable", m), e(t, "set", c), e(t, "setIn", u);
        for (var r = 0, i = t.length; r < i; r++) t[r] = O(t[r]);
        return e(t, "__immutable_invariants_hold", true), t;
      }
      function f() {
        return new Date(this.getTime());
      }
      function p(t) {
        if (0 === arguments.length) return this;
        var e, n = [], r = this.length;
        for (e = 0; e < r; e++) {
          var i = t(this[e], e, this);
          i instanceof Array ? n.push.apply(n, i) : n.push(i);
        }
        return h(n);
      }
      function g(t) {
        if ("undefined" === typeof t && 0 === arguments.length) return this;
        if ("function" !== typeof t) {
          var e = t instanceof Array ? t : Array.prototype.slice.call(arguments);
          t = function (t, n) {
            return -1 !== e.indexOf(n);
          };
        }
        var n = this.instantiateEmptyObject();
        for (var r in this) this.hasOwnProperty(r) && false === t(this[r], r) && (n[r] = this[r]);
        return w(n, {instantiateEmptyObject: this.instantiateEmptyObject});
      }
      function m(t) {
        var e, n, r = [];
        if (t && t.deep) for (e = 0, n = this.length; e < n; e++) r.push(v(this[e])); else for (e = 0, n = this.length; e < n; e++) r.push(this[e]);
        return r;
      }
      function b(t) {
        "function" !== typeof t && (t = function (t) {
          return t;
        });
        var e, n = {}, r = this.length;
        for (e = 0; e < r; e++) {
          var i = t(this[e], e, this), a = "setPrototypeOf", o = i[1];
          n[a] = o;
        }
        return w(n);
      }
      function v(t) {
        return !t || "object" !== typeof t || !Object.getOwnPropertyDescriptor(t, "__immutable_invariants_hold") || t instanceof Date ? t : t.asMutable({deep: true});
      }
      function x(t, e) {
        for (var n in t) Object.getOwnPropertyDescriptor(t, n) && (e[n] = t[n]);
        return e;
      }
      function E(t, e) {
        if (0 === arguments.length) return this;
        if (null === t || "object" !== typeof t) throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(t));
        var n, i, a = t instanceof Array, o = e && e.deep, s = e && e.merger;
        function l(t, i, a) {
          var l, c = O(i[a]), d = s && (e(t[a], "__immutable_invariants_hold", true), t[a]), u = t[a];
          (undefined !== n || undefined !== d || !t.hasOwnProperty(a) || c !== u && c === c) && (l = d || (o && (null !== u && "object" === typeof u && !(u instanceof Array) && !(u instanceof Date)) && (null !== c && "object" === typeof c && !(c instanceof Array) && !(c instanceof Date)) ? u.merge(c, e) : c), (u !== l && l === l || !t.hasOwnProperty(a)) && (undefined === n && (n = x(t, t.instantiateEmptyObject())), n[a] = l));
        }
        if (a) for (var c = 0; c < t.length; c++) {
          var d = t[c];
          for (i in d) d.hasOwnProperty(i) && l(this, d, i);
        } else for (i in t) Object.getOwnPropertyDescriptor(t, i) && l(this, t, i);
        return undefined === n ? this : w(n, {instantiateEmptyObject: this.instantiateEmptyObject});
      }
      var I = O({});
      function C(t, e) {
        var n = t[0];
        if (1 === t.length) return y.call(this, n, e);
        var r, i = t.slice(1), a = this[n];
        if (r = this.hasOwnProperty(n) && "object" === typeof a && null !== a && "function" === typeof a.setIn ? a.setIn(i, e) : C.call(I, i, e), this.hasOwnProperty(n) && a === r) return this;
        var o = x(this, this.instantiateEmptyObject());
        return o[n] = r, w(o, this);
      }
      function y(t, e) {
        if (this.hasOwnProperty(t) && this[t] === e) return this;
        var n = x(this, this.instantiateEmptyObject());
        return n[t] = O(e), w(n, this);
      }
      function S(t) {
        var e, n = this.instantiateEmptyObject();
        if (t && t.deep) for (e in this) this.hasOwnProperty(e) && (n[e] = v(this[e])); else for (e in this) this.hasOwnProperty(e) && (n[e] = this[e]);
        return n;
      }
      function M() {
        return {};
      }
      function w(t, n) {
        var r = n && n.instantiateEmptyObject ? n.instantiateEmptyObject : M;
        return e(t, "merge", E), e(t, "without", g), e(t, "asMutable", S), e(t, "instantiateEmptyObject", r), e(t, "set", y), e(t, "setIn", C), (e(t, "__immutable_invariants_hold", true), t);
      }
      function O(t, r) {
        if ("object" !== typeof t || (null === t || Boolean(Object.getOwnPropertyDescriptor(t, "__immutable_invariants_hold")))) return t;
        if (t instanceof Array) return h(t.slice());
        if (t instanceof Date) return e(i = new Date(t.getTime()), "asMutable", f), (e(i, "__immutable_invariants_hold", true), i);
        var i, a = r && r.prototype, o = a && a !== Object.prototype ? function () {
          return Object.create(a);
        } : M, l = o();
        for (var c in t) Object.getOwnPropertyDescriptor(t, c) && (l[c] = O(t[c]));
        return w(l, {instantiateEmptyObject: o});
      }
      O.isImmutable = n, O.ImmutableError = o, Object.freeze(O), t.exports = O;
    }();
  }, l4ti: function (t, e, n) {
    "use strict";
    n.r(e), n.d(e, "showModal", function () {
      return a;
    });
    var r = n("3a3M"), i = n.n(r);
    function a() {
      i()("#gs-block-modal").modal("show");
    }
  }, oWgl: function (t, e, n) {
    var r, i, a;
    a = function () {
      var t = null, e = [], n = document, r = {}.hasOwnProperty;
      function o(t, e, n, r, i) {
        if (e && !e.nodeType && arguments.length <= 2) return false;
        var o, l = "function" == typeof n;
        l && (o = n, n = function (t, e) {
          return o(t.text, e.startIndex);
        });
        var c = s(e, {find: t, wrap: l ? null : n, replace: l ? n : "$" + (r || "&"), prepMatch: function (t, e) {
          if (!t[0]) throw "findAndReplaceDOMText cannot handle zero-length matches";
          if (r > 0) {
            var n = t[r];
            t.index += t[0].indexOf(n), t[0] = n;
          }
          return t.endIndex = t.index + t[0].length, t.startIndex = t.index, t.index = e, t;
        }, filterElements: i});
        return a.revert = function () {
          return c.revert();
        }, true;
      }
      function s(t, e) {
        return new l(t, e);
      }
      function l(t, e) {
        var n = e.preset && a.PRESETS[e.preset];
        if (e.portionMode = e.portionMode || "retain", n) for (var i in n) r.call(n, i) && !r.call(e, i) && (e[i] = n[i]);
        if (this.node = t, this.options = e, this.prepMatch = e.prepMatch || this.prepMatch, this.reverts = [], this.options.find) this.matches = this.search(); else if (this.options.findArray) this.matches = this.searchArray(); else if (this.options.findRanges) this.matches = this.options.findRanges; else if (this.options.getTextLengthBeforeNode) return void (this.textLengthBeforeNode = this.getTextLengthBeforeNode(this.options.getTextLengthBeforeNode));
        this.matches.length && this.processMatches();
      }
      return a.NON_PROSE_ELEMENTS = {br: 1, hr: 1, script: 1, style: 1, img: 1, video: 1, audio: 1, canvas: 1, svg: 1, map: 1, object: 1, input: 1, textarea: 1, select: 1, option: 1, optgroup: 1, button: 1}, a.NON_CONTIGUOUS_PROSE_ELEMENTS = {address: 1, article: 1, aside: 1, blockquote: 1, dd: 1, div: 1, dl: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, header: 1, hgroup: 1, hr: 1, main: 1, nav: 1, noscript: 1, ol: 1, output: 1, p: 1, pre: 1, section: 1, ul: 1, br: 1, li: 1, summary: 1, dt: 1, details: 1, rp: 1, rt: 1, rtc: 1, script: 1, style: 1, img: 1, video: 1, audio: 1, canvas: 1, svg: 1, map: 1, object: 1, input: 1, textarea: 1, select: 1, option: 1, optgroup: 1, button: 1, table: 1, tbody: 1, thead: 1, th: 1, tr: 1, td: 1, caption: 1, col: 1, tfoot: 1, colgroup: 1}, a.NON_INLINE_PROSE = function (t) {
        return r.call(a.NON_CONTIGUOUS_PROSE_ELEMENTS, t.nodeName.toLowerCase());
      }, a.PRESETS = {prose: {forceContext: a.NON_INLINE_PROSE, filterElements: function (t) {
        return !r.call(a.NON_PROSE_ELEMENTS, t.nodeName.toLowerCase());
      }}}, a.resetCache = function () {
        t = null;
      }, a.Finder = l, l.prototype = {TAGS_WITH_EXTRA_SPACE: ["address", "article", "aside", "audio", "blockquote", "body", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video", "td", "br"], getTextLengthBeforeNode: function (n) {
        var r = this.getAggregateText(n)[0].length - e.length;
        return t = null, e = null, r;
      }, search: function () {
        var t, e = 0, n = 0, r = this.options.find, a = this.getAggregateText(), o = [], s = this;
        return r = "string" === typeof r ? RegExp(String(r).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"), "g") : r, function i(a) {
          for (var l = 0, c = a.length; l < c; ++l) {
            var d = a[l];
            if ("string" === typeof d) {
              if (r.global) for (; t = r.exec(d);) o.push(s.prepMatch(t, e++, n)); else (t = d.match(r)) && o.push(s.prepMatch(t, 0, n));
              n += d.length;
            } else String(d).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
          }
        }(a), o;
      }, searchArray: function () {
        var t, e, n = this.getAggregateText(), r = [], a = this, o = this.options.findArray, s = 0, l = 0, c = [];
        function d(t, e) {
          for (var n = 0; n < c.length; n++) if (t <= c[n][1] && e >= c[n][0]) return true;
          return false;
        }
        return o.forEach(function (o) {
          s = 0, l = 0, t = "string" === typeof o.regex ? RegExp(String(o.regex).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"), "g") : o.regex, numMatchesBefore = r.length, function n(i) {
            for (var o = 0, h = i.length; o < h; ++o) {
              var f = i[o];
              if ("string" === typeof f) {
                if (t.global) for (; e = t.exec(f);) {
                  var p = e.index, g = e.index + e[0].length;
                  if (!d(p, g) && (0 === c.length || p > c[c.length - 1][1])) {
                    r.push(a.prepMatch(e, s++, l)), c.push([p, g]);
                    break;
                  }
                } else (e = f.match(t)) && r.push(a.prepMatch(e, 0, l));
                l += f.length;
              } else n(f);
            }
          }(n), r.length > numMatchesBefore && (r[r.length - 1].overallIndex = o.overallIndex, r[r.length - 1].highlightTerms = o.highlightTerms);
        }), r.sort(function (t, e) {
          return t.startIndex - e.startIndex;
        }), r;
      }, prepMatch: function (t, n, r) {
        if (!t[0]) throw new Error("findAndReplaceDOMText cannot handle zero-length matches");
        t.endIndex = r + t.index + t[0].length, t.startIndex = r + t.index, t.origIndex = t.index, t.index = n;
        for (var i = null, a = null, o = 0; o < e.length && (e[o] >= t.startIndex && null === i && (i = o), e[o] >= t.endIndex && null === a && (a = o), null === i || null === a); o++) ;
        return null === i && (i = 0), null === a && (a = 0), t.startIndex -= i, t.endIndex -= a, t;
      }, getAggregateText: function (n) {
        if (null !== t && "undefined" === typeof n) return t;
        e = [];
        var r = this.options.filterElements, i = this.options.forceContext, a = this;
        this.firstNode = null;
        var o = false, s = n;
        "undefined" !== typeof n && 3 === n.nodeType && (n = n.parentNode);
        var l = u(this.node, -1);
        if ("undefined" !== typeof s && 3 === s.nodeType) {
          var c = "", d = s.parentNode.firstChild;
          for (o = false; d !== s && null !== d;) c += u(d, l.length + c.length), d = d.nextSibling;
          l[0] += c;
        }
        return t = l, l;
        function u(t, s) {
          if (t === n) return o = true, [""];
          if (3 === t.nodeType) return [t.data];
          if (r && !r(t)) return [];
          null === a.firstNode && (a.firstNode = t);
          var l = [""], c = 0;
          if ((t = t.firstChild) && !o) do {
            if (3 !== t.nodeType) {
              var d = u(t, s + l[c].length);
              i && 1 === t.nodeType && (true === i || String(t).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")) ? (l[++c] = d, l[++c] = "") : ("string" === typeof d[0] && (l[c] += d.shift(), a.TAGS_WITH_EXTRA_SPACE.indexOf(t.nodeName.toLowerCase()) > -1 && (l[c] += " ", e.push(s + l[c].length))), d.length && (l[++c] = d, l[++c] = ""));
            } else l[c] += t.data;
          } while ((t = t.nextSibling) && !o);
          return l;
        }
      }, processMatches: function () {
        var t, e, n, r = this.matches, i = this.node, a = this.options.filterElements, o = [], l = r.shift(), c = 0, d = 0, u = [i];
        t: for (;;) {
          if (3 === s.nodeType && (!e && s.length + c >= l.endIndex ? e = {node: s, index: d++, text: s.data.substring(l.startIndex - c, l.endIndex - c), indexInMatch: c - l.startIndex, indexInNode: l.startIndex - c, endIndexInNode: l.endIndex - c, isEnd: true} : t && o.push({node: s, index: d++, text: s.data, indexInMatch: c - l.startIndex, indexInNode: 0}), !t && s.length + c > l.startIndex && (t = {node: s, index: d++, indexInMatch: 0, indexInNode: l.startIndex - c, endIndexInNode: l.endIndex - c, text: s.data.substring(l.startIndex - c, l.endIndex - c)}), c += s.data.length), n = 1 === s.nodeType && a && !(o.apply(null, arguments) || s.apply(null, arguments)), t && e) {
            if (s = this.replaceMatch(l, t, o, e), c -= e.node.data.length - e.endIndexInNode, t = null, e = null, o = [], d = 0, !(l = r.shift())) break;
          } else if (!n && (s.firstChild || s.nextSibling)) {
            s.firstChild ? (u.push(s), s = s.firstChild) : s = s.nextSibling;
            continue;
          }
          for (;;) {
            if (s.nextSibling) {
              s = s.nextSibling;
              break;
            }
            if ((s = u.pop()) === i) break t;
          }
        }
      }, revert: function () {
        for (var t = this.reverts.length; t--;) this.reverts[t]();
        this.reverts = [];
      }, prepareReplacementString: function (t, e, n, r) {
        var i = this.options.portionMode;
        return "first" === i && e.indexInMatch > 0 ? "" : (t = t.replace(/\$(\d+|&|`|')/g, function (t, e) {
          var r;
          switch (e) {
            case "&":
              r = n[0];
              break;
            case "`":
              r = n.input.substring(0, n.startIndex);
              break;
            case "'":
              r = n.input.substring(n.endIndex);
              break;
            default:
              r = n[+e];
          }
          return r;
        }), "first" === i ? t : e.isEnd ? t.substring(e.indexInMatch) : t.substring(e.indexInMatch, e.indexInMatch + e.text.length));
      }, getPortionReplacementNode: function (t, e, r) {
        var i = this.options.replace || "$&", a = this.options.wrap;
        if (a && a.nodeType) {
          var o = n.createElement("div");
          o.innerHTML = a.outerHTML || (new XMLSerializer).serializeToString(a), a = o.firstChild;
        }
        if ("function" == typeof i) return (i = String(t).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")) && i.nodeType ? i : n.createTextNode(String(i));
        var s = "string" == typeof a ? n.createElement(a) : a;
        return (i = n.createTextNode(this.prepareReplacementString(i, t, e, r))).data && s ? (s.appendChild(i), s) : i;
      }, replaceMatch: function (t, e, r, i) {
        var a, o, s = e.node, l = i.node;
        if (s === l) {
          var c = s;
          e.indexInNode > 0 && (a = n.createTextNode(c.data.substring(0, e.indexInNode)), c.parentNode.insertBefore(a, c));
          var d = this.getPortionReplacementNode(i, t);
          return c.parentNode.insertBefore(d, c), i.endIndexInNode < c.length && (o = n.createTextNode(c.data.substring(i.endIndexInNode)), c.parentNode.insertBefore(o, c)), c.parentNode.removeChild(c), this.reverts.push(function () {
            a === d.previousSibling && a.parentNode.removeChild(a), o === d.nextSibling && o.parentNode.removeChild(o), d.parentNode.replaceChild(c, d);
          }), d;
        }
        a = n.createTextNode(s.data.substring(0, e.indexInNode)), o = n.createTextNode(l.data.substring(i.endIndexInNode));
        for (var u = this.getPortionReplacementNode(e, t), h = [], f = 0, p = r.length; f < p; ++f) {
          var g = r[f], m = this.getPortionReplacementNode(g, t);
          g.node.parentNode.replaceChild(m, g.node), this.reverts.push(function (t, e) {
            return function () {
              e.parentNode.replaceChild(t.node, e);
            };
          }(g, m)), h.push(m);
        }
        var b = this.getPortionReplacementNode(i, t);
        return s.parentNode.insertBefore(a, s), s.parentNode.insertBefore(u, s), s.parentNode.removeChild(s), l.parentNode.insertBefore(b, l), l.parentNode.insertBefore(o, l), l.parentNode.removeChild(l), this.reverts.push(function () {
          a.parentNode.removeChild(a), u.parentNode.replaceChild(s, u), o.parentNode.removeChild(o), b.parentNode.replaceChild(l, b);
        }), b;
      }}, a;
    }, t.exports ? t.exports = a() : undefined === (i = "function" === typeof (r = a) ? r.call(e, n, e, t) : r) || (t.exports = i);
  }, pRvv: function (t, e, n) {
    "use strict";
    (function (t) {
      n.d(e, "a", function () {
        return s;
      });
      var r = t("#filing_sidebar, #transcript_sidebar"), i = r.find(".icon-print"), a = false;
      function s() {
        o = function () {
          var t = document.getElementById("embedded_doc").contentWindow;
          return t.focus(), t.print(), false;
        }, r.off("click", "#print-filing, #print-transcript"), r.on("click", "#print-filing, #print-transcript", o), a && (i.removeClass("icon-spinner animate-spin").addClass("icon-print"), a = false, (a = true, i.removeClass("icon-print").addClass("icon-spinner animate-spin"), false));
      }
      r.on("click", "#print-filing, #print-transcript", o);
    }.call(this, n("3a3M")));
  }, xJD9: function (t, e) {
    t.exports = Sentry;
  }, ytxT: function (t, e, n) {
    "use strict";
    var r = window.crypto || window.msCrypto;
    t.exports = function () {
      if (!r || !r.getRandomValues) return 48 & Math.floor(256 * Math.random());
      var t = new Uint8Array(1);
      return r.getRandomValues(t), 48 & t[0];
    };
  }}, [["fijN", "js/webpack-runtime", "js/legacy", "js/vendor", "js/shared"]]]);
  