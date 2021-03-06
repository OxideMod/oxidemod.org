/*
 * XenForo discussion_list.min.js
 * Copyright 2010-2017 XenForo Ltd.
 * Released under the XenForo License Agreement: http://xenforo.com/license-agreement
 */
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (a, e, c) {
    a instanceof String && (a = String(a));
    for (var d = a.length, b = 0; b < d; b++) {
        var f = a[b];
        if (e.call(c, f, b, a)) return {
            i: b,
            v: f
        }
    }
    return {
        i: -1,
        v: void 0
    }
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, e, c) {
    a != Array.prototype && a != Object.prototype && (a[e] = c.value)
};
$jscomp.getGlobal = function (a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, e, c, d) {
    if (e) {
        c = $jscomp.global;
        a = a.split(".");
        for (d = 0; d < a.length - 1; d++) {
            var b = a[d];
            b in c || (c[b] = {});
            c = c[b]
        }
        a = a[a.length - 1];
        d = c[a];
        e = e(d);
        e != d && null != e && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: e
        })
    }
};
$jscomp.polyfill("Array.prototype.find", function (a) {
    return a ? a : function (a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
! function (a, e, c, d) {
    XenForo.DiscussionList = function (a) {
        this.__construct(a)
    };
    XenForo.DiscussionList.prototype = {
        __construct: function (b) {
            this.$form = b;
            a("a.EditControl", this.$form).live("click", a.context(this, "editControlClick"));
            this.loaderXhr = this.$editor = null
        },
        editControlClick: function (b) {
            if (this.loaderXhr) return !1;
            b = a(b.target);
            var c = b.closest(".discussionListItem");
            if (this.$editor) {
                if (this.$editor.is(":animated")) return !1;
                this.$editor.xfRemove("xfSlideUp")
            }
            c.addClass("AjaxProgress");
            c = b.data("href");
            if (!c || c.match(/^javascript:/)) c = b.attr("href");
            this.loaderXhr = XenForo.ajax(c, "", a.context(this, "editorLoaded"));
            return !1
        },
        editorLoaded: function (b, e) {
            this.loaderXhr = null;
            var d = a("#thread-" + b.threadId + ".discussionListItem");
            if (XenForo.hasResponseError(b)) return d.removeClass("AjaxProgress"), !1;
            new XenForo.ExtLoader(b, a.context(function () {
                this.$editor = a(b.templateHtml);
                this.$editor.data("discussionlistitemid", d.attr("id")).xfInsert("insertAfter", d, "xfSlideDown", XenForo.speed.fast, a.context(function () {
                    d.removeClass("AjaxProgress");
                    this.$editor.find(".titleField").focus();
                    a(c).trigger("TitlePrefixRecalc")
                }, this))
            }, this))
        }
    };
    XenForo.DiscussionListItemEditor = function (a) {
        this.__construct(a)
    };
    XenForo.DiscussionListItemEditor.prototype = {
        __construct: function (b) {
            this.$editor = b;
            this.$saveButton = a("input:submit", this.$editor).click(a.context(this, "save"));
            this.$cancelButton = a("input:reset", this.$editor).click(a.context(this, "cancel"))
        },
        save: function (b) {
            this.saverXhr || (b = this.$editor.closest("form").serializeArray(), b = XenForo.ajaxDataPush(b,
                "_returnDiscussionListItem", 1), this.$editor.addClass("InProgress"), this.saverXhr = XenForo.ajax(this.$saveButton.data("submiturl"), b, a.context(this, "saveSuccess")));
            return !1
        },
        cancel: function (a) {
            this.removeEditor();
            return !1
        },
        saveSuccess: function (b, c) {
            this.saverXhr = null;
            this.$editor.removeClass("InProgress");
            if (XenForo.hasResponseError(b)) return !1;
            this.removeEditor();
            var d = a("#thread-" + b.threadId);
            d.fadeOut(XenForo.speed.normal, function () {
                a(b.templateHtml).xfInsert("insertBefore", d, "xfFadeIn", XenForo.speed.normal);
                d.remove()
            })
        },
        removeEditor: function () {
            this.$editor.parent().xfSlideUp({
                duration: XenForo.speed.slow,
                easing: "easeOutBounce",
                complete: function () {
                    a(this).remove()
                }
            });
            this.$editor = null
        }
    };
    XenForo.DiscussionListOptions = function (a) {
        this.__construct(a)
    };
    XenForo.DiscussionListOptions.prototype = {
        __construct: function (b) {
            this.$handle = b.click(a.context(this, "toggleOptions"));
            this.$options = a("form.DiscussionListOptions").hide();
            this.$submit = a("input:submit", this.$options).click(a.context(this, "hideOptions"));
            this.$reset =
                a("input:reset", this.$options).click(a.context(this, "hideOptions"))
        },
        toggleOptions: function (a) {
            if (this.$options.is(":animated")) return !1;
            this.$options.is(":hidden") ? this.showOptions() : this.hideOptions();
            return !1
        },
        showOptions: function () {
            this.$options.xfFadeDown(XenForo.speed.normal, function () {
                a(this).find("input, select, textarea, button").get(0).focus()
            })
        },
        hideOptions: function () {
            this.$options.xfFadeUp(XenForo.speed.normal)
        }
    };
    XenForo.register("form.DiscussionList", "XenForo.DiscussionList");
    XenForo.register(".discussionListItemEdit",
        "XenForo.DiscussionListItemEditor");
    XenForo.register("#DiscussionListOptionsHandle a", "XenForo.DiscussionListOptions")
}(jQuery, this, document);
