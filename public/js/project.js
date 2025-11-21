(function () {
    "use strict";

    var container       = document.getElementById('project-container');
    var titleEl         = document.getElementById('project-title');
    var metaEl          = document.getElementById('project-meta');
    var bodyEl          = document.getElementById('project-body');
    var errorEl         = document.getElementById('project-error');
    var loader          = document.querySelector('.loading');
    var coverEl         = document.getElementById('project-cover');
    var fieldsEl        = document.getElementById('project-fields');
    var ownerWrapper    = document.getElementById('project-owner');
    var ownerAvatarEl   = document.getElementById('project-owner-avatar');
    var ownerNameEl     = document.getElementById('project-owner-name');
    var ownerRoleEl     = document.getElementById('project-owner-role');
    var ownerLocationEl = document.getElementById('project-owner-location');

    function getQueryParam(name) {
        var match = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
        return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
    }

    function hideLoader() {
        if (loader) {
            loader.style.display = 'none';
        }
    }

    function showContainer() {
        if (container) {
            container.className = container.className.replace(/\bis-hidden\b/, '').trim();
        }
        if (errorEl) {
            errorEl.className = errorEl.className.indexOf('is-hidden') === -1 ? errorEl.className : (errorEl.className + ' is-hidden');
        }
    }

    function showError(message) {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.className = errorEl.className.replace(/\bis-hidden\b/, '').trim();
        }
        if (container && container.className.indexOf('is-hidden') === -1) {
            container.className += ' is-hidden';
        }
    }

    function getJSON(path, success, fail) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', path, true);
        xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if ((this.status >= 200 && this.status < 300) || this.status === 304) {
                    var response = JSON.parse(this.responseText);
                    success(response);
                } else {
                    fail(this.status + ' - ' + this.statusText);
                }
            }
        };
        xhttp.send();
    }

    function renderProject(project) {
        var metaParts = [],
            statsText = [],
            owner;

        document.title = project && project.name ? project.name + ' | Behance Project Detail' : document.title;

        titleEl.textContent = project && project.name ? project.name : 'Project';
        metaEl.innerHTML = '';
        bodyEl.innerHTML = '';

        if (fieldsEl) {
            fieldsEl.textContent = project && project.fields && project.fields.length ? project.fields.join(' · ') : '';
        }

        setHeroCover(project);

        if (project && project.fields && project.fields.length) {
            metaParts.push(project.fields.join(', '));
        }

        if (project && project.stats) {
            if (project.stats.appreciations) {
                statsText.push('❤ ' + project.stats.appreciations);
            }
            if (project.stats.views) {
                statsText.push('👁 ' + project.stats.views);
            }
        }

        if (statsText.length) {
            metaParts.push(statsText.join(' · '));
        }

        if (project && project.url) {
            metaParts.push('<a href="' + project.url + '" target="_blank" rel="noopener noreferrer">在 Behance 查看</a>');
        }

        if (metaParts.length) {
            metaEl.innerHTML = metaParts.join(' | ');
        }

        owner = project && project.owners && project.owners.length ? project.owners[0] : null;
        updateOwner(owner);

        if (project && project.modules && project.modules.length) {
            renderModules(project.modules);
        } else {
            bodyEl.innerHTML = '<p class="project-page__empty">该作品暂无详细内容。</p>';
        }

        showContainer();
    }

    function renderModules(modules) {
        var i = 0, len = modules.length, module, wrapper, element, type, imageSrc, mediaWrapper, ratio;

        for (; i < len; i += 1) {
            module = modules[i];
            type   = module.type || 'generic';
            wrapper = document.createElement('div');
            wrapper.className = 'project-page__module project-page__module--' + type;

            if (type === 'image' || type === 'media') {
                imageSrc = getBestImageSource(module);

                if (imageSrc) {
                    element = document.createElement('img');
                    element.src = imageSrc;
                    element.alt = module.caption || module.type;
                    wrapper.appendChild(element);
                }

                if (module.caption) {
                    wrapper.appendChild(createCaption(module.caption));
                }
            } else if (type === 'text') {
                var textBlock = document.createElement('div');
                var formatted = sanitizeText(module.text || '');

                if (formatted) {
                    textBlock.className = 'project-text';
                    textBlock.innerHTML = formatted;
                    wrapper.appendChild(textBlock);
                }
            } else if (type === 'embed' || type === 'video') {
                mediaWrapper = document.createElement('div');
                mediaWrapper.className = 'project-media';
                ratio = getModuleRatio(module);

                if (ratio) {
                    mediaWrapper.style.setProperty('--module-aspect', ratio);
                }

                if (module.embed) {
                    mediaWrapper.innerHTML = sanitizeEmbed(module.embed);
                } else if (module.src) {
                    element = document.createElement('iframe');
                    element.src = stripVideoParams(module.src);
                    element.setAttribute('frameborder', '0');
                    element.setAttribute('allowfullscreen', 'true');
                    element.setAttribute('allow', 'autoplay; fullscreen');
                    mediaWrapper.appendChild(element);
                }

                wrapper.appendChild(mediaWrapper);
            }

            bodyEl.appendChild(wrapper);
        }
    }

    function getBestImageSource(module) {
        if (!module) {
            return '';
        }

        var sizes = module.sizes || {};
        var priority = [
            'original',
            'max_3840', 'max_3840_webp',
            'max_1920', 'max_1920_webp',
            'max_1400', 'max_1400_webp',
            '1400', '1400_webp', '1400_opt_1',
            'max_1240', 'max_1240_webp',
            'max_1200', 'max_1200_webp',
            'max_808', 'max_808_webp',
            'max_800', 'max_800_webp',
            'max_632', 'max_632_webp',
            'max_600', 'max_600_webp',
            'max_316', 'max_316_webp',
            'disp', 'disp_webp'
        ];
        var i, src;

        for (i = 0; i < priority.length; i += 1) {
            src = sizes[priority[i]];
            if (src) {
                return src;
            }
        }

        if (module.image_src) {
            return module.image_src;
        }

        return module.src || '';
    }

    function stripVideoParams(url) {
        if (!url) {
            return '';
        }

        try {
            var parsed = new URL(url, window.location.origin);
            parsed.searchParams.delete('bgcolor');
            return parsed.toString();
        } catch (e) {
            return url.replace(/([?&])bgcolor=[^&#]+/, '$1').replace(/[?&]$/, '');
        }
    }

    function sanitizeEmbed(embedHtml) {
        if (!embedHtml) {
            return '';
        }

        try {
            var div = document.createElement('div');
            div.innerHTML = embedHtml;
            var iframes = div.querySelectorAll('iframe');

            Array.prototype.forEach.call(iframes, function (iframe) {
                var src = iframe.getAttribute('src');
                iframe.setAttribute('src', stripVideoParams(src));
                iframe.removeAttribute('style');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.setAttribute('allow', 'autoplay; fullscreen');
            });

            return div.innerHTML;
        } catch (e) {
            return embedHtml;
        }
    }

    function getModuleRatio(module) {
        if (!module || !module.width || !module.height) {
            return '';
        }

        var ratio = (module.height / module.width) * 100;

        if (!ratio || ratio <= 0) {
            return '';
        }

        return ratio.toFixed(4) + '%';
    }

    function sanitizeText(html) {
        if (!html) {
            return '';
        }

        var temp = document.createElement('div');
        temp.innerHTML = html;

        var blockTags = ['p', 'div', 'section', 'article', 'figure', 'li', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        var textFragments = [];

        function isBlock(tagName) {
            return blockTags.indexOf(tagName) !== -1;
        }

        function traverse(node) {
            if (node.nodeType === 3) {
                textFragments.push(node.textContent);
                return;
            }

            if (node.nodeType !== 1) {
                return;
            }

            var tag = node.tagName.toLowerCase();

            if (tag === 'br') {
                textFragments.push('\n');
            }

            if (isBlock(tag)) {
                textFragments.push('\n');
            }

            var child = node.firstChild;
            while (child) {
                traverse(child);
                child = child.nextSibling;
            }

            if (isBlock(tag)) {
                textFragments.push('\n');
            }
        }

        traverse(temp);

        var raw = textFragments.join('')
            .replace(/\r/g, '')
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (!raw) {
            return '';
        }

        var lines = raw.split(/\n+/).map(function (line) {
            return escapeHtml(line.replace(/\s+/g, ' ').trim());
        }).filter(function (line) {
            return !!line;
        });

        if (!lines.length) {
            lines = [escapeHtml(raw)];
        }

        return '<p>' + lines.join('<br>') + '</p>';
    }

    function escapeHtml(str) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return str.replace(/[&<>"']/g, function (match) {
            return map[match];
        });
    }

    function setHeroCover(project) {
        var coverUrl;

        if (!coverEl) {
            return;
        }

        if (project && project.covers) {
            coverUrl = project.covers['original'] || project.covers['808'] || project.covers['404'];
        }

        coverEl.style.backgroundImage = coverUrl ? 'url(' + coverUrl + ')' : 'none';
    }

    function updateOwner(owner) {
        if (!ownerWrapper) {
            return;
        }

        if (!owner) {
            ownerWrapper.className += ownerWrapper.className.indexOf('is-hidden') === -1 ? ' is-hidden' : '';
            return;
        }

        ownerWrapper.className = ownerWrapper.className.replace(/\bis-hidden\b/, '').trim();

        if (ownerAvatarEl) {
            var avatar = owner.images && (owner.images['138'] || owner.images['115'] || owner.images['100'] || owner.images['50']);
            if (avatar) {
                ownerAvatarEl.src = avatar;
                ownerAvatarEl.style.display = 'block';
            } else {
                ownerAvatarEl.style.display = 'none';
            }
            ownerAvatarEl.alt = owner.display_name || 'Owner avatar';
        }

        if (ownerNameEl) {
            ownerNameEl.textContent = owner.display_name || owner.username || '';
        }

        if (ownerRoleEl) {
            ownerRoleEl.textContent = owner.occupation || '';
        }

        if (ownerLocationEl) {
            ownerLocationEl.textContent = owner.location || '';
        }
    }

    function createCaption(text) {
        var caption = document.createElement('p');
        caption.className = 'project-page__caption';
        caption.textContent = text;
        return caption;
    }

    function init() {
        var projectId = getQueryParam('id');

        if (!projectId) {
            hideLoader();
            showError('未找到对应的作品 ID。');
            return;
        }

        getJSON('/api/behance/projects/' + encodeURIComponent(projectId), function (response) {
            hideLoader();
            if (response && response.http_code === 200 && response.project) {
                renderProject(response.project);
            } else {
                showError('无法获取该作品，稍后再试。');
            }
        }, function () {
            hideLoader();
            showError('无法获取该作品，稍后再试。');
        });
    }

    init();
}());
