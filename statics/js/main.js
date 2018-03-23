/**
 * Main Javascript
 */

var w,h;
var ua = navigator.userAgent;
var isWeixin = ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

// card
var isFirstLoad = true;
function initScreen() {
	w = $(window).width();
	h = $(window).height();
    $("html").css("font-size",w/640*100+"px");
	$('body').show();
	$(".container").height(h);
} 

$(function(){
	initScreen();
	
	// 禁止上下滑动
	$('body').on('touchmove', function (event) {
		event.preventDefault();
	});
	$('.swipe-body').on('touchstart', function (event) {
		event.preventDefault();
	});
	
	// 背景音乐
	bg_audio = document.getElementById('audio');
	$('.btn-music').click(function(){
		if ($(this).hasClass('play')) {
			$(this).removeClass('play');
			bg_audio.pause();
		} else {
			$(this).addClass('play');
			bg_audio.play();
		}
	});
	
	// 首屏动画
	$('.purport').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		setTimeout(function(){
			$('.arrow').addClass('zTip').removeClass('hide');
		}, 300);
	});
	
	// 立即办卡
	var canvidControl = canvid({
		selector : '.register-btn',
		videos: {
			clip: { src: statics_url+'images/register_sprite.png', frames: 30, cols: 6, loops: 1, fps: 20, onEnd: function(){
				canvidControl.play('clip');
			}}
		},
		width: 62,
		height: 194,
		loaded: function() {
			canvidControl.play('clip');
		}
	});
	
	// 视频
	var v1 = document.getElementById('v1');
	if (isAndroid) {
		v1 = document.getElementById('v2');
	}
	$('.play-btn').click(function(){
		if (isAndroid) {
			$('.page-body').hide();
			$('#v2').removeClass('hide');
		}
		$('.play-btn').hide();
		v1.play();
		bg_audio.pause();
		$('.btn-music').removeClass('play');
	});
	
	// 视频播放完成
	v1.addEventListener('ended', function(){
		console.log('video ended');
		if (isAndroid) {
			$('.play-btn').show();
			$('.page-body').show();
			$('#v2').addClass('hide');
		}
	}, false);
	
	v1.addEventListener('pause', function(){
		if (isAndroid) {
			$('.play-btn').show();
			$('.page-body').show();
			$('#v2').addClass('hide');
		}
	}, false);
	
	// 卡片滑动
	$('.scene-body').touchSlider({
		mouseTouch: true,
		namespace: 'touch',
		delay: 4500,
		prev: '.touch-prev',
		next: '.touch-next',
		pagination: '.touch-nav-item',
		currentClass: 'touch-nav-item-current',
		viewport: '.touch-container',
		autoplay: true
	});
	$('.scene-body').data("touch").stop();
	$('.swipe-container').on('webkitTransitionEnd transitionEnd', function(){
		var i = $('.touch-nav-item-current').index();
		var cardSelector;
		if (i == 0) {
			$('.scene-body').data("touch").start();
			cardSelector = $('.card.beauty');
		} else if (i == 1) {
			$('.scene-body').data("touch").start();
			cardSelector = $('.card.dragon');
		} else if (i == 2) {
			$('.scene-body').data("touch").stop();
			setTimeout(function(){
				$('.scene-body').data("touch").start();
			}, 3000);
			cardSelector = $('.card.operator');
		}
		cardSelector.children('.a1').addClass('zFadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			cardSelector.children('.a2').addClass('fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				cardSelector.children('.a3').addClass('fadeInRight');
			})
		});
		console.log(i+'show');
	});
	
	// 滑动翻页
	var num = 1;
	var isMove = true;
	var moveUp = false;
	var moveDown = true;
	var firstY;
	var moveY = 0;
	
	$('.page-body').on('touchstart', function(e){
		moveY = 0;
		firstY = window.event.touches[0].pageY;
		if (num == 1 & !isAndroid) {
			v1.play();
			// v1.pause();
		}
	});
	$('.page-body').on('touchmove', function(e){
		moveY = window.event.touches[0].pageY-firstY;
	});
	$('.page-body').on('touchend', function(e) {
		//if (!isMove) return false;
		//isMove = false;
		
		if (num == 1) {
			$('.page-body').animate({
				"margin-top": -(num*h)+'px'
			}, 500);
			num++;
			if (!isAndroid) {
				bg_audio.pause();
				$('.btn-music').removeClass('play');
			} else {
				$('.play-btn').removeClass('hide');
			}
			setTimeout(function(){
				$('.btn-music').removeClass('hide');
				$('.video-tips').removeClass('hide');
			}, 500);
		} else {
			if (moveY <= -50 || moveY >= 50) {
				console.log(moveY);
				if (moveY < 0) { // 上滑
					if (num == 6) return false;
					$('.page-body').animate({
						"margin-top": -(num*h)+'px'
					}, 500);
					num++;
					switch (num) {
						// 1->2
						case 2:
							if (!isAndroid) {
								v1.play();
								bg_audio.pause();
								$('.btn-music').removeClass('play');
							}
							setTimeout(function(){
								$('.btn-music').removeClass('hide');
								$('.video-tips').removeClass('hide');
							}, 500);
						break;
						
						// 2->3
						case 3:
							bg_audio.play();
							$('.btn-music').addClass('play');
							$('.video-tips').addClass('hide');
							page3_animate();
						break;
						
						// 3->4
						case 4:
							page4_animate();
						break;
						
						// 4->5
						case 5:
							page5_animate();
						break;
						
						// 5->6
						case 6:
							$('.arrow').addClass('hide');
						break;
					}
				} else { // 下滑
					if (num == 1) return false;
					num--;
					$('.page-body').animate({
						"margin-top": -((num-1)*h)+'px'
					}, 500);
					switch (num) {
						// 2->1
						case 1:
							bg_audio.play();
							$('.btn-music').addClass('play');
							$('.btn-music').addClass('hide');
							$('.video-tips').addClass('hide');
							setTimeout(function(){
								v1.pause();
							}, 500);
						break;
						
						// 3->2
						case 2:
							//$('.scene-body').data("touch").stop();
							$('.register-btn').fadeOut(300);
							setTimeout(function(){
								$('.btn-music').removeClass('hide');
								$('.video-tips').removeClass('hide');
								if (!isAndroid) {
									v1.play();
									bg_audio.pause();
									$('.btn-music').removeClass('play');
								}
							}, 500);
						break;
						
						// 4->3
						case 3:
							page3_animate();
						break;
						
						// 5-4
						case 4:
							page4_animate();
						break;
						
						// 6->5
						case 5:
							page5_animate();
							$('.arrow').removeClass('hide');
						break;
					}
				}
				console.log(num);
			}
		}
	});
	
	preload();
	sequenceFrameAnimate('loading-sprite', 9, 200, true, 'png');
});

function page3_animate() {
	$('.scene-body').data("touch").start();
	var i = $('.touch-nav-item-current').index();
	var cardSelector;
	
	if (i == 0) {
		cardSelector = $('.card.beauty');
	} else if (i == 1) {
		cardSelector = $('.card.dragon');
	} else if (i == 2) {
		cardSelector = $('.card.operator');
	}
	$('.card .a1').removeClass('zFadeIn');
	$('.card .a2').removeClass('fadeInLeft');
	$('.card .a3').removeClass('fadeInRight');

	setTimeout(function(){
		v1.pause();
		$('.register-btn').fadeIn(300);
		if (isFirstLoad) {
			cardSelector.children('.a1').addClass('zFadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				cardSelector.children('.a2').addClass('fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					cardSelector.children('.a3').addClass('fadeInRight');
				})
			});
			isFirstLoad = false;
		} else {
			$('.touch-next').click();
		}
	}, 500);
}

function page4_animate() {
	$('.page4 .content .title').removeClass('fadeInUp');
	$('.page4 .content .desc').removeClass('fadeInDown');
	setTimeout(function(){
		$('.page4 .content .title').addClass('fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page4 .content .desc').addClass('fadeInDown');
			//$('.touch-nav-item').eq(0).click();
		});
	}, 500);
}

function page5_animate() {
	$('.page5 .content .one').removeClass('zFadeIn');
	$('.page5 .content .two').removeClass('zFadeIn');
	$('.page5 .content .three').removeClass('zFadeIn');
	setTimeout(function(){
		$('.page5 .content .one').addClass('zFadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$('.page5 .content .two').addClass('zFadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$('.page5 .content .three').addClass('zFadeIn')
			});
		});
	}, 500);
}

/**
 * 序列帧动画
 */
function sequenceFrameAnimate(name, count, time, isRepeat, type, repeatNum) {
	if (!repeatNum) repeatNum = 1;
	var i = 1;
	var cron = setInterval(function(){
		$('.'+name+' img').attr("src", statics_url+'images/'+name+'/'+i+'.'+type);
		if (i == count) {
			// 循环播放
			if (isRepeat) {
				i = repeatNum;
			} else {
				clearInterval(cron);
			}
			return;
		};
		i++;
	}, time);
}

function preload() {
	var manifest = [
		statics_url+'images/loading.jpg',
		statics_url+'images/loading_content.png',
		statics_url+'images/loading-sprite/1.png',
		statics_url+'images/loading-sprite/2.png',
		statics_url+'images/loading-sprite/3.png',
		statics_url+'images/loading-sprite/4.png',
		statics_url+'images/loading-sprite/5.png',
		statics_url+'images/loading-sprite/6.png',
		statics_url+'images/loading-sprite/7.png',
		statics_url+'images/loading-sprite/8.png',
		statics_url+'images/loading-sprite/9.png',
		statics_url+'images/arrow.png',
		statics_url+'images/beauty.png',
		statics_url+'images/beauty_card_1.png',
		statics_url+'images/beauty_card_2.png',
		statics_url+'images/beauty_card_3.png',
		statics_url+'images/card_bottom.png',
		statics_url+'images/cloud_1.png',
		statics_url+'images/cloud_2.png',
		statics_url+'images/cloud_3.png',
		statics_url+'images/dragon.png',
		statics_url+'images/dragon_card_1.png',
		statics_url+'images/dragon_card_2.png',
		statics_url+'images/dragon_card_3.png',
		statics_url+'images/nail.png',
		statics_url+'images/next_btn.png',
		statics_url+'images/operator.png',
		statics_url+'images/operator_card_1.png',
		statics_url+'images/operator_card_2.png',
		statics_url+'images/operator_card_3.png',
		statics_url+'images/page1.jpg',
		statics_url+'images/page2.jpg',
		statics_url+'images/page2_tips_text.png',
		statics_url+'images/page3.jpg',
		statics_url+'images/page4.jpg',
		statics_url+'images/page4_desc.png',
		statics_url+'images/page4_title.png',
		statics_url+'images/page5.jpg',
		statics_url+'images/page6.jpg',
		statics_url+'images/page6_bottom.png',
		statics_url+'images/page6_desc.png',
		statics_url+'images/page6_title.png',
		statics_url+'images/people.png',
		statics_url+'images/pic_scrolls_1.png',
		statics_url+'images/pic_scrolls_2.png',
		statics_url+'images/pic_scrolls_3.png',
		statics_url+'images/pic_scrolls_bottom.png',
		statics_url+'images/play_btn.png',
		statics_url+'images/prev_btn.png',
		statics_url+'images/purport.png',
		statics_url+'images/register_btn.png',
		statics_url+'images/register_sprite.png',
		statics_url+'images/share_logo.jpg',
		statics_url+'images/stone.png',
		statics_url+'images/stop_btn.png',
		statics_url+'images/table.png',
		statics_url+'images/table_bottom.jpg',
		statics_url+'images/video_content.png',
		statics_url+'images/video_pic.jpg',
		statics_url+'images/video_play.png',
		statics_url+'images/video_title.png'
	];
	
	var preload = new createjs.LoadQueue(false);
	startPreload();
	
	// 预加载方法
	function startPreload() {
		// 注意加载音/视频文件需要调用如下代码行
		preload.setMaxConnections(10);
		preload.maintainScriptOrder=true;
		//preload.installPlugin(createjs.Sound); 
		//preload.installPlugin(createjs.Video);               
		preload.on("fileload", handleFileLoad);
		preload.on("progress", handleFileProgress);
		preload.on("complete", loadComplete);
		preload.on("error", loadError);
		preload.loadManifest(manifest);
	}
	
	// 处理单个文件加载
	function handleFileLoad(event) {
		// Loading动画加载完成
		if (event.item.src == statics_url+'images/loading-sprite/9.png') {
			$('.loading').show();
			console.log('Loading ...');
		}
	}
	
	// 处理加载错误
	function loadError(evt) {
		//console.log("加载出错！",evt.text);
	}
	
	// 已加载完毕进度 
	function handleFileProgress(event) {
		var pro = preload.progress*100|0;
		$('.progress span').text(pro);
	}
	
	// 全部资源加载完毕
	function loadComplete(event) {
		console.log('Loading complete');
		$('.loading').hide();
		$('.homepage').show();
	}
}

function box_show(box) {
	$('.opacity-bg').show();
	$('.'+box).show();
	if ($('.'+box).hasClass('enabled-close')) {
		$('.'+box).one('click', function(){
			box_hide();
		});
	}
}
function box_hide() {
	$('.opacity-bg').hide();
	$('.box').hide();
}