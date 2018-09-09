
'use strict';
window.ZIM = {
    VERSION : 1,
    SLIDE_MODE_CYCLE : 'SLIDE_MODE_CYCLE',
    SLIDE_MODE_LINE : 'SLIDE_MODE_LINE',
    Slider : function(options) {
        let data = {
            urls : [],
            hInterval : undefined,
            sliderElements : [],
            indexCurrent : 0
        };
        options = options || {};
        options.url = options.url || undefined;
        options.slideMode = options.slideMode || ZIM.SLIDE_MODE_CYCLE;
        options.interval = options.interval || 5000;
        options.autoStart = options.autoStart || false;
        options.getTargetElements =  options.getTargetElements || function(){
            let sliderElements = document.getElementsByClassName('zim-slider');
            return sliderElements;
        }
        options.fInterval = options.fInterval || ZIM.createDelegate(function(){
            //@TODO: Выполнение кода для слайдинга
            let els = options.getTargetElements();
            [].forEach.call(els, function(el, index){
                // indexCurrent = indexCurrent++;
                if(!ZIM.isDefined( data.indexCurrent)){
                    data.indexCurrent = 0;
                }
                let targetElement = el.getElementsByClassName('zim-slider-target');
                if (targetElement.length !== 1){
                    throw new Error('Более одного целевого єлемента в контейнере');
                }
                targetElement = targetElement[0];
                targetElement.src =  options.url[index];
                //this.goNext(targetElement);
            }, this);
        }, this);
        this.addUrl = function(url){
            if(ZIM.isString(url)){
                data.urls.push(url);
            } else if(ZIM.isArray(url)){
                data.urls = data.urls.concat(url)
            } else {
                throw new Error('Тип данных "url" не поддерживается.');
            }
        }
        this.start = function(){
            if (data.hInterval){
                throw new Error('Уже запущен.');
            }
            if (data.urls.length < 1){
                throw new Error('Не задан url.');
            }
            data.sliderElements = options.getTargetElements();
            options.hInterval = setInterval(options.fInterval, options.interval);
        }
        this.goNext = function(targetEl){

        }
        this.goPrev = function(targetEl){

        }
        if (options.url){
            this.addUrl(options.url)
        }
        if(options.autoStart){
            this.start();
        }
    },
    createDelegate : function (f, scope){
        return function(){
            return f.apply(scope, arguments);
        }
    },
    isArray : function(value){
        return typeof(value) === 'object';
    },
    isString : function(value){
        return typeof(value) === 'string';
    },
    isDefined : function(value){
        return value !== undefined && !isNaN(value);
    }
}
