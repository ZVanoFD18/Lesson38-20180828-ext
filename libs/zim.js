
'use strict';
let ZIM = {
	VERSION: 1,
	DESCRIPTION: 'Библиотека ZIM для бла-бла-бла'
};
/**
 * В прототип запихиваем системные функци, которые обычно лежат в ядре фреймворка или библиотеки.
 **/
ZIM.__proto__ = {
		createDelegate: function(f, scope) {
			return function() {
				return f.apply(scope, arguments);
			}
		},
		isArray: function(value) {
			return typeof(value) === 'object';
		},
		isString: function(value) {
			return typeof(value) === 'string';
		},
		isDefined: function(value) {
			return value !== undefined && !isNaN(value);
		}
	}
	/**
	 * Контейнер для группировки функционала "Слайдер".
	 **/
ZIM.Slider = {
	/**
	 * Отображать в цикле  от первого(first) к последнему(last), затем от последнего к первому и т.д.
	 **/
	SLIDE_MODE_CYCLE: 'SLIDE_MODE_CYCLE',
	/**
	 * Отображатьот от первого(first) к последнему(last) и останавливаться.
	 **/
	SLIDE_MODE_LINEAR: 'SLIDE_MODE_LINEAR',
	/**
	 * Направление слайдинга - инкремент индексов.
	 **/
	SLIDE_DIRECTION_INC: 'SLIDE_DIRECTION_INC',
	/**
	 * Направление слайдинга - декремент индексов.
	 **/
	SLIDE_DIRECTION_DEC: 'SLIDE_DIRECTION_DEC',
};
/**
 * Специализированный слайдер, работающий с изображениями.
 **/
ZIM.Slider.Img = function(options) {
	options = options || {};
	/**
	 * Набор приватных данных объекта.
	 **/
	let priv = {
		/**
		 * @type {Array} - ма
		 **/
		urls: [],
		autoStart: false,
		interval: 5000,
		hInterval: undefined,
		sliderElements: [],
		indexCurrent: undefined,
		slideMode: ZIM.Slider.SLIDE_MODE_CYCLE,
		direction: ZIM.Slider.SLIDE_DIRECTION_INC,
		getTargetElements: getTargetElements,
		getNextUrl: getNextUrl,
		handlerSliderInterval: handlerSliderInterval
	};
	priv.urls = options.urls || priv.urls;
	priv.slideMode = options.slideMode || priv.slideMode;
	priv.direction = options.direction || priv.direction;
	priv.interval = options.interval || priv.interval;
	priv.autoStart = options.autoStart || priv.autoStart;
	priv.getTargetElements = options.getTargetElements || priv.getTargetElements;
	priv.getNextUrl = options.getNextUrl || priv.getNextUrl;
	priv.handlerSliderInterval = options.handlerSliderInterval || priv.handlerSliderInterval;
	this.addUrl = addUrl;
	this.start = start;

    let els = priv.getTargetElements();
    [].forEach.call(els, function(elContainer, index) {
        let targetElement = elContainer.getElementsByClassName('zim-slider-right');
        if (targetElement.length !== 1) {
            throw new Error('Более одного целевого єлемента в контейнере');
        }
        targetElement[0].addEventListener('click', ZIM.createDelegate(function (elGoRight) {
			// alert('Click');
            this.goNext(elContainer);
        }, this));
    });

	this.goNext = function(targetContainerEl) {
		let nextUrl = priv.getNextUrl();
		let targetElement = targetContainerEl.getElementsByClassName('zim-slider-target');
		if (targetElement.length !== 1) {
			throw new Error('Более одного целевого єлемента в контейнере');
		}
		targetElement = targetElement[0];
		targetElement.src = nextUrl.url;
	};

	this.goPrev = function(targetEl) {}
	if (options.url) {
		this.addUrl(options.url)
	}
	if (priv.autoStart) {
		this.start();
	}

	function start() {
		if (priv.hInterval) {
			throw new Error('Уже запущен.');
		}
		if (priv.urls.length < 1) {
			throw new Error('Не задан url.');
		}
		priv.sliderElements = priv.getTargetElements();
		options.hInterval = setInterval(priv.handlerSliderInterval, priv.interval);
	}

	function addUrl() {
		if (ZIM.isString(url)) {
			priv.urls.push(url);
		} else if (ZIM.isArray(url)) {
			priv.urls = priv.urls.concat(url)
		} else {
			throw new Error('Тип данных "url" не поддерживается.');
		}
	}

	function getNextUrl() {
		let result = {
			url: undefined,
			index: undefined,
			isStop: false
		}
		switch (priv.slideMode) {
			case ZIM.Slider.SLIDE_MODE_CYCLE:
				if (priv.direction === ZIM.Slider.SLIDE_DIRECTION_INC) {
					result.index = priv.indexCurrent + 1;
				} else {
					result.index = priv.indexCurrent - 1;
				}
				if (result.index > priv.urls.length - 1) {
					result.index = priv.urls.length - 2;
					priv.direction = ZIM.SLIDE_DIRECTION_DEC;
				} else if (result.index < 0) {
					result.index = 1;
					priv.direction = ZIM.Slider.SLIDE_DIRECTION_INC;
				}
				break;
			case ZIM.SLIDE_MODE_LINEAR:
				if (priv.direction === ZIM.Slider.SLIDE_DIRECTION_INC) {
					result.index = priv.indexCurrent + 1;
				} else {
					result.index = priv.indexCurrent - 1;
				}
				if (result.index > priv.urls.length - 1) {
					result.index = priv.urls.length - 1;
					result.isStop = true;
				} else if (result.index < 0) {
					result.index = 0;
					result.isStop = true;
				}
				break;
			case window.ZIM.SLIDE_MODE_LINE_L2F:
				break;
			default:
		}
		result.url = priv.urls[result.index];
		return result;
	};

	function handlerSliderInterval() {
		//@TODO: Выполнение кода для слайдинга
		let els = options.getTargetElements();
		[].forEach.call(els, function(el, index) {
			// indexCurrent = indexCurrent++;
			if (!ZIM.isDefined(priv.indexCurrent)) {
				priv.indexCurrent = 0;
			}
			let targetElement = el.getElementsByClassName('zim-slider-target');
			if (targetElement.length !== 1) {
				throw new Error('Более одного целевого єлемента в контейнере');
			}
			targetElement = targetElement[0];
			// targetElement.src =  options.url[index];
			this.goNext(targetElement);
		}, this);
	};

	function getTargetElements() {
		let sliderElements = document.getElementsByClassName('zim-slider');
		return sliderElements;
	}
};
