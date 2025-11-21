(function (root) {
    "use strict";

    function loadSingle(el) {
        var url = el.getAttribute('data-include');
        if (!url) {
            return Promise.resolve();
        }
        return fetch(url)
            .then(function (res) { return res.text(); })
            .then(function (html) {
                el.innerHTML = html;
            })
            .catch(function () {});
    }

    function loadPartials() {
        var includes = document.querySelectorAll('[data-include]');
        var jobs = [];
        includes.forEach(function (el) {
            jobs.push(loadSingle(el));
        });
        return Promise.all(jobs);
    }

    root.loadPartials = loadPartials;
})(this);
