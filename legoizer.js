function Legoizer(element) {
    init: {
        this.__createVariables(element);
    }
}

Legoizer.prototype = {
    __createVariables: function(element) {
        this.__element = $('#' + element);
        this.__getElementSize();
        this.ctx = this.__createCanvas();
        this.__render();
    },

    __render: function() {
        this.ctx.fillStyle="blue";
        this.ctx.fillRect(0,0,480,360);
    },

    __getElementSize: function() {
        this.__height = this.__element.height();
        this.__width = this.__element.width();
    },

    __createCanvas: function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.__width;
        canvas.height = this.__height;
        this.__element.html(canvas);
        return canvas.getContext("2d");
    }
}

new Legoizer('canvas');
