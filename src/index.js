'use strict';

if (!String.prototype.includes) {
    String.prototype.includes = function () {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

let pid = 0;

export const container = {
    scripts: [],
    run() {
        this.scripts.forEach((callback) => {
            callback(window.HC)
        });
        this.scripts = []
    },

    register(callback) {
        if (window.HC) {
            this.Vue.nextTick(() => {
                callback(window.HC)
            })
        } else {
            this.scripts.push(callback)
        }
    }
};

export const hypercomments = {
    props: {
        xid: {
            default: ''
        },
        widget_id: {
            required: true
        },
        append: {
            default: ''
        },
        settings: {},
        language: ''

    },
    template: '<div :id="widget_dom_id"></div>',
    data() {
        pid += 1;
        return {
            widget_dom_id: 'hypercomments_widget_' + pid,
            mypid: pid
        };
    },
    created() {
        var vm = this;
        if ("HC_LOAD_INIT" in window)return;
        window.HC_LOAD_INIT = true;

        var lang = 'ar';
        if (vm.language.length) {
            lang = vm.language;
        } else {
            lang = (navigator.language || navigator.systemLanguage || navigator.userLanguage || "en").substr(0, 2).toLowerCase();
        }

        var hcc = document.createElement("script");
        hcc.type = "text/javascript";
        hcc.async = true;
        hcc.src = ("https:" == document.location.protocol ? "https" : "http")
            + "://w.hypercomments.com/widget/hc/" + vm.widget_id + "/" + lang + "/widget.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hcc, s.nextSibling);

        hcc.onload = function () {
            vm.$nextTick(() => {
                container.run()
            })
        }

    },
    ready(){
        let vm = this;
        container.register(() => {
            window._hcwp = window._hcwp || [];
            _hcwp.push(Object.assign({
                widget: "Stream",
                append: vm.append.length ? vm.append : '#' + this.widget_dom_id,
                widget_id: vm.widget_id,
                eager_load: true,
                callback(app, init) {
                    vm.$emit('ready', app, init);
                }
            }, this.settings));

            vm.$watch('xid', function (newVal) {
                vm.$el.innerHTML = '';
                var _hcp = Object.assign({
                    widget_id: vm.widget_id,
                    xid: newVal,
                    append: '#' + vm.widget_dom_id,
                    eager_load: true
                }, vm.settings);
                window.HC.widget("Stream", _hcp);
            });
        })
    }
};

export function install(Vue) {
    Vue.component('hypercomments', hypercomments);
}

export default {
    hypercomments, install
};
