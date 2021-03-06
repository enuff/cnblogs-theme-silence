(function ($) {
    $.extend({
        silence: function (options) {
            var silence = new Silence();
            silence.init(options);
        }
    });

    class Silence {
        constructor() {
            this.defaluts = {
                catalog: {
                    enable: false,
                    move: true,
                    index: true,
                    level1: 'h2',
                    level2: 'h3',
                    level3: 'h4',
                },
                signature: {
                    enable: false,
                    author: currentBlogApp,
                    home: 'https://www.cnblogs.com',
                    license: '署名 4.0 国际',
                    link: 'https://creativecommons.org/licenses/by/4.0'
                },
                reward: {
                    enable: false,
                    title: '我是猴子派来收钱的',
                    wechat: null,
                    alipay: null,
                },
                github: {
                    enable: false,
                    color: '#fff',
                    fill: '#151513',
                    link: null,
                }
            };
        }

        get version() {
            return 'v1.1.0';
        }

        get cnblogs() {
            return {
                header: '#header',
                navigator: '#navigator',
                navList: '#navList',
                sideBar: '#sideBar',
                forFlow: '.forFlow',
                postTitle: '#cb_post_title_url',
                postDetail: '#post_detail',
                postBody: '#cnblogs_post_body',
                postDigg: '#div_digg',
                postCommentBody: '.blog_comment_body',
                feedbackContent: '.feedbackCon',
                mySignature: '#MySignature',
                footer: '#footer',
            };
        }

        get isPostPage() {
            return $(this.cnblogs.postDetail).length > 0;
        }

        /**
         * 初始化
         * @param {Object} options 配置选项
         */
        init(options) {
            if (options) {
                $.extend(true, this.defaluts, options);
            }
            this.buildNavCustomElements();
            this.buildCopyright();
            this.buildGithubCorners();
            if (this.isPostPage) {
                this.goIntoReadingMode();
                this.buildPostCatalog();
                this.buildPostSignature();
                this.buildPostFavoriteBtn();
                this.buildPostRewardBtn();
                this.buildPostCommentAvatar();
                this.buildPostCodeCopyBtn();
                this.buildFollowBtn();
            } else {
                this.goIntoNormalMode();
            }
        }

        /**
         * 消息弹窗
         * @param {String} content 消息内容
         */
        showMessage(content) {
            let $layer = $('.esa-layer');
            if (!$layer.length) {
                $('body').prepend(`<div class="esa-layer"><span class="esa-layer-content"></span></div>`);
            }
            $('.esa-layer-content').html(content);
            $('.esa-layer').fadeIn(200);
            setTimeout(function () {
                $('.esa-layer').fadeOut(200, function () {
                    $('.esa-layer-content').empty();
                });
            }, 2000);
        }

        /**
         * 进入阅读模式
         */
        goIntoReadingMode() {
            let _that = this;
            var oldScrollY = 0;
            let $win = $(window);
            if ($win.width() > 767) {
                $win.scroll(function () {
                    var newScrollY = this.scrollY;
                    if (newScrollY > oldScrollY) {
                        $(_that.cnblogs.header).slideUp();
                    } else {
                        $(_that.cnblogs.header).slideDown();
                    }
                    oldScrollY = this.scrollY;
                });
            }
        }

        /**
         * 进入正常模式
         */
        goIntoNormalMode() {
            let _that = this;
            let $win = $(window);
            if ($win.width() > 767) {
                $(_that.cnblogs.forFlow).css({
                    marginLeft: '22em'
                });
                $(_that.cnblogs.sideBar).fadeIn(700);
            }
        }

        /**
         * 构建导航栏自定义DOM元素
         */
        buildNavCustomElements() {
            let _that = this;
            // build a tags button in navbar.
            var $navList = $(this.cnblogs.navList);
            $navList.find('li').eq(1).after(`<li><a id="blog_nav_tags" class="menu" href="https://www.cnblogs.com/${currentBlogApp}/tag">标签</a></li>`);
            $.each($navList.find('li'), function (index, nav) {
                $(nav).append('<i></i>');
            });
            // build a mobile browser menu button.
            $('body').prepend(`<div class="esa-mobile-menu"></div>`);
            $('.esa-mobile-menu').on('click', function () {
                $(_that.cnblogs.navigator).fadeToggle(200);
            });
        }

        /**
         * 构建主题版权信息
         */
        buildCopyright() {
            // please don't delete this function.
            var content = `<div> Powered By <a href="https://www.cnblogs.com" target="_blank">Cnblogs</a> |
            Theme <a href="https://github.com/esofar/cnblogs-theme-silence" target="_blank">Silence ${this.version}</a></div>`;
            $(this.cnblogs.footer).append(content);
        }

        /**
         * 构建博客签名
         */
        buildPostSignature() {
            let config = this.defaluts.signature;
            if (config.enable) {
                let postUrl = $(this.cnblogs.postTitle).attr('href');
                let content =
                    `<div class="esa-post-signature"> 
                    <p>作者：<a href="${config.home}">${config.author}</a></p> 
                    <p>出处：<a href="${postUrl}">${postUrl}</a></p> 
                    <p>本站使用「<a href="${config.link}"  target="_blank">${config.license}</a>」创作共享协议，转载请在文章明显位置注明作者及出处。</p> 
                </div>`;
                $(this.cnblogs.mySignature).html(content).show();
            }
        }

        /**
         * 构建评论者头像
         */
        buildPostCommentAvatar() {
            let _that = this;
            var builder = function () {
                $(_that.cnblogs.postCommentBody).before(`<div class='esa-comment-avatar'><a target='_blank'><img /></a></div>`);
                let feedbackCon = $(_that.cnblogs.feedbackContent);
                for (var i = 0; i < feedbackCon.length; i++) {
                    let avatar = 'https://pic.cnblogs.com/face/sample_face.gif';
                    let span = $(feedbackCon[i]).find("span:last")[0];
                    if (span) {
                        avatar = $(span).html().replace('http://', '//');
                    }
                    $(feedbackCon[i]).find(".esa-comment-avatar img").attr("src", avatar);
                    let href = $(feedbackCon[i]).parent().find(".comment_date").next().attr("href");
                    $(feedbackCon[i]).find(".esa-comment-avatar a").attr("href", href);
                }
            }
            if ($(_that.cnblogs.postCommentBody).length) {
                builder();
            } else {
                let count = 1;
                // poll whether the feedbacks is loaded.
                let intervalId = setInterval(function () {
                    if ($(_that.cnblogs.postCommentBody).length) {
                        clearInterval(intervalId);
                        builder();
                    }
                    if (count == 10) {
                        // no feedback.
                        clearInterval(intervalId);
                    }
                    count++;
                }, 500);
            }
        }

        /**
         * 构建赞赏按钮
         */
        buildPostRewardBtn() {
            let config = this.defaluts.reward;
            let _that = this;
            if (config.enable) {
                if (!config.wechat && !config.alipay) {
                    throw new Error(`silence error: both 'wechat' and 'alipay' are null in reward module.`);
                }

                let content = `<div class="esa-reward">
                <div class="esa-reward-close">+</div>
                <h2>"${config.title}"</h2>
                <div class="esa-reward-container">`;
                if (config.wechat) {
                    content += `<div class="wechat"><img src="${config.wechat}" alt="微信支付"></div>`
                }
                if (config.alipay) {
                    content += `<div class="alipay"><img src="${config.alipay}" alt="支付宝支付"></div>`;
                }
                content += `</div></div>`;
                $('body').append(content);

                $('.esa-reward-close').on('click', function () {
                    $(".esa-reward").fadeOut();
                });

                let builder = function () {
                    $(_that.cnblogs.postDigg).prepend(`<div class="reward"><span class="rewardnum" id="reward_count"></span></div>`);
                    $(_that.cnblogs.postDigg).find('.reward').on('click', function () {
                        $(".esa-reward").fadeIn();
                    });
                };

                if ($(_that.cnblogs.postDigg).length) {
                    builder();
                } else {
                    let intervalId = setInterval(function () {
                        if ($(_that.cnblogs.postDigg).length) {
                            clearInterval(intervalId);
                            builder();
                        }
                    }, 200);
                }
            } else {
                $(_that.cnblogs.postDigg).width(300);
            }
        }

        /**
         * 构建收藏按钮
         */
        buildPostFavoriteBtn() {
            let _that = this;
            let builder = function () {
                $(_that.cnblogs.postDigg).prepend(`<div class="favorite" onclick="AddToWz(cb_entryId);return false;"><span class="favoritenum" id="favorite_count"></span></div>`);
            };
            if ($(_that.cnblogs.postDigg).length) {
                builder();
            } else {
                let intervalId = setInterval(function () {
                    if ($(_that.cnblogs.postDigg).length) {
                        clearInterval(intervalId);
                        builder();
                    }
                }, 200);
            }
        }

        /**
         * 构建博客目录
         */
        buildPostCatalog() {
            let config = this.defaluts.catalog;
            if (config.enable) {
                let levels = [config.level1, config.level2, config.level3];
                let $headers = $(this.cnblogs.postBody).find(levels.join(','));
                if (!$headers.length) {
                    return false;
                }

                let $catalog = $(
                    `<div class="esa-catalog">
                        <div class="esa-catalog-tab"><h2>目录</h2></div>
                        <div class="esa-catalog-contents">
                            <div class="esa-catalog-title"><h2>目录</h2></div>
                            <a class="esa-catalog-close">X</a>
                        </div>
                    </div>`);

                let h1c = 0;
                let h2c = 0;
                let h3c = 0;

                let catalogContents = '<ul>';
                $.each($headers, function (index, header) {
                    let tagName = $(header)[0].tagName.toLowerCase();
                    let titleIndex = '';
                    let titleContent = $(header).text();
                    if (!config.index) {
                        switch (tagName) {
                            case config.level1:
                                titleContent = `<span class="level1">${titleContent}</span>`;
                                break;
                            case config.level2:
                                titleContent = `<span class="level2">${titleContent}</span>`;
                                break;
                            case config.level3:
                                titleContent = `<span class="level3">${titleContent}</span>`;
                                break;
                        }
                    } else {
                        if (tagName === config.level1) {
                            h1c++;
                            h2c = 0;
                            h3c = 0;
                            titleIndex = `<span class="level1">${h1c}. </span>`;
                        } else if (tagName === config.level2) {
                            h2c++;
                            h3c = 0;
                            titleIndex = `<span class="level2">${h1c}.${h2c}. </span>`;
                        } else if (tagName === config.level3) {
                            h3c++;
                            titleIndex = `<span class="level3">${h1c}.${h2c}.${h3c}. </span>`;
                        }
                    }
                    catalogContents +=
                        `<li class="li_${tagName}" title="${titleContent}">
                        <i id="esa_index_${index}"></i><a class="esa-anchor-link">${(titleIndex + titleContent)}</a>
                    </li>`;
                    $(header).attr('id', `esa_index_${index}`);
                });
                catalogContents += `</ul>`;

                $catalog.find('.esa-catalog-contents').append(catalogContents);
                $catalog.appendTo('body');

                let $tab = $('.esa-catalog-tab');
                let $tabContent = $('.esa-catalog-contents');

                $tabContent.fadeIn();

                let fixedOffsetTop = 70;
                $('.esa-anchor-link').on('click', function () {
                    let href = $(this).prev('i').attr('id');
                    let position = $('#' + href).offset().top - fixedOffsetTop;
                    $('html, body').animate({
                        scrollTop: position
                    }, 300);
                });

                $tab.on('click', function () {
                    $(this).hide();
                    $tabContent.show();
                });
                $('.esa-catalog-close').on('click', function () {
                    $tabContent.hide();
                    $tab.show();
                });

                if (config.move) {
                    let move = {
                        start: false,
                        pois: [0, 0],
                    };
                    $('.esa-catalog-title, .esa-catalog').on('mousedown', function (e) {
                        e.preventDefault();
                        move.start = true;
                        let position = $('.esa-catalog').position();
                        let poisX = e.clientX - parseFloat(position.left);
                        let poisY = e.clientY - parseFloat(position.top);
                        move.pois = [poisX, poisY];
                    });
                    $(document).on('mousemove', function (e) {
                        if (move.start) {
                            let offsetX = e.clientX - move.pois[0];
                            let offsetY = e.clientY - move.pois[1];
                            let fixed = $('.esa-catalog').css('position') === 'fixed';

                            e.preventDefault();

                            move.stX = fixed ? 0 : $(window).scrollLeft();
                            move.stY = fixed ? 0 : $(window).scrollTop();

                            let setRig = $(window).width() - $('.esa-catalog').outerWidth() + move.stX;
                            let setBot = $(window).height() - $('.esa-catalog').outerHeight() + move.stY;

                            offsetX < move.stX && (offsetX = move.stX);
                            offsetX > setRig && (offsetX = setRig);
                            offsetY < move.stY && (offsetY = move.stY);
                            offsetY > setBot && (offsetY = setBot);

                            $('.esa-catalog').css({
                                left: offsetX,
                                top: offsetY,
                                right: 'auto',
                            });
                        }
                    }).on('mouseup', function (_e) {
                        if (move.start) {
                            move.start = false;
                        }
                    });
                }
            }
        }

        /**
         * 构建 Github 角标 
         */
        buildGithubCorners() {
            let config = this.defaluts.github;
            if (config.enable) {
                $('body').append(
                    `<a href="${config.link}" class="github-corner" title="Follow me on GitHub">
                        <svg width="60" height="60" viewBox="0 0 250 250" style="fill:${config.fill}; color:${config.color}; z-index: 999999; position: fixed; top: 0; border: 0; left: 0; transform: scale(-1, 1);" aria-hidden="true">
                            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
                            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
                        </svg>
                    </a>`);
            }
        }

        /**
         * 构建代码复制按钮
         */
        buildPostCodeCopyBtn() {
            let _that = this;

            let $pres = $(this.cnblogs.postBody).find('pre');
            if (!$pres.length) {
                return false;
            }
            $.each($pres, function (index, pre) {
                $(pre).find('code').attr('id', `copy_target_${index}`);
                $(pre).prepend(`<div class="esa-clipboard-button" data-clipboard-target="#copy_target_${index}">Copy</div>`);
            });

            $.getScript(`https://unpkg.com/clipboard@2.0.0/dist/clipboard.min.js`, function () {
                var clipboard = new ClipboardJS('.esa-clipboard-button');
                clipboard.on('success', function (e) {
                    _that.showMessage('复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    _that.showMessage('复制失败');
                });
            });
        }

        /**
         * 构建关注按钮
         */
        buildFollowBtn() {
            let _that = this;
            $('body').append(`<button class="esa-follow-button">关注</button>`);
            let $btn = $('.esa-follow-button');

            $btn.on('click', function () {
                if (!isLogined) {
                    login();
                }
                if (c_has_follwed) {
                    return _that.showMessage('您已经关注过我了');
                }
                follow(cb_blogUserGuid);
            });

            $(window).scroll(function () {
                if (this.scrollY > 200) {
                    $btn.fadeIn();
                } else {
                    $btn.fadeOut();
                }
            });
        }
    }
})(jQuery);