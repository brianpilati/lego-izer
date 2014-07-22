function Legoizer(element, brickObject) {
    init: {
        this.__createVariables(element, brickObject);
    }
}

Legoizer.prototype = {
    __createVariables: function(element, brickObject) {
        this.__element = $('#' + element);
        this.__getElementSize();
        this.__ctx = this.__createCanvas();
        this.__bricks = [];
        this.__buildBricks(brickObject);
        this.__currentBrick = 0;
        this.__animate();
    },

    __buildBricks: function(brickObject) {
        var lastBrickHeight = 0;
        var lastBrickWidth = 0;
        var buildWall = true;
        var maxHeight = 50;
        var insurance = 0;
        var offset = true;
        while(buildWall && insurance < maxHeight) {
            var brick = new Brick(
                this.__ctx, 
                brickObject, 
                {
                    width: lastBrickWidth, 
                    height: parseInt(this.__height - lastBrickHeight)
                }
            );
            var brickWidth = brick.getBrickWidth();
            lastBrickWidth += parseInt(brickWidth);
            if(lastBrickWidth >= this.__width) {
                if (offset) {
                    console.log(brick.getStudWidth());
                    lastBrickWidth = 0 - brick.getStudWidth();
                } else {
                    lastBrickWidth = 0;
                }
                offset = !offset;
                lastBrickHeight += parseInt(brick.getBrickHeight());
            }
            if (lastBrickHeight > this.__height) {
                buildWall = false;
            }
            this.__bricks.push(brick);
        }
    },
    
    __animate: function() {
        var self = this;
        this.__interval = setInterval(function() {self.__renderBricks()}, 33);
    },

    __renderBricks: function() {
        this.__eraseCanvas();
        var brick = this.__bricks[this.__currentBrick];
        brick.draw();
        if (! brick.update()) {
            this.__currentBrick++;
        }

        if (this.__currentBrick >= this.__bricks.length) {
            clearInterval(this.__interval);
            this.__element.fadeOut( 2000, function() {
                console.log('all clear');
            });
        }

        for (index=0; index<this.__currentBrick; index++) {
            var brick = this.__bricks[index];
            brick.draw();
        }
    },

    __eraseCanvas: function() {
        this.__ctx.clearRect(0, 0, this.__width, this.__height);
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

function Brick(ctx, brickObject, position) {
    init: {
        this.__createVariables(ctx, brickObject, position);
    }
}

Brick.prototype = {
    __createVariables: function(ctx, brickObject, position) {
        this.__plates = brickObject.plates;
        this.__color = brickObject.color;
        this.__multiplier = 5;
        this.__ctx = ctx;
        this.__height = 0;
        this.__maxHeight = position.height;
        this.__width = position.width;
        this.__determineColor();
        this.__determineStuds();
    },

    draw: function() {
        this.__buildStuds();
        this.__buildBrick();
    },

    update: function() {
        if (this.__height <= this.__maxHeight) {
            this.__height += this.getBrickHeight();
            return true;
        }
        return false;
    },

    __buildStuds: function() {
        this.__ctx.fillStyle = this.__color;
        for(stud = 0; stud < this.__studs; stud++) {
            this.__ctx.fillRect(
                parseInt(this.__width + this.__getStudDistance() + (this.__getStudDistance() * 2 + this.__getStudWidth()) * stud),
                parseInt(this.__height - this.getBrickHeight() - this.__getStudHeight()),
                this.__getStudWidth(),
                this.__getStudHeight()
            );
        }
    },

    __buildBrick: function() {
        this.__ctx.fillStyle = this.__color;
        this.__ctx.fillRect(
            this.__width,
            parseInt(this.__height - this.getBrickHeight()),
            this.getBrickWidth(),
            this.getBrickHeight()
        );
    },

    __determineStuds: function() {
        var studs = [
            1,
            2,
            3,
            4,
            6,
            8,
            10,
            12,
            16 
        ];
        var studIndex = Math.floor((Math.random() * studs.length));
        this.__studs = studs[studIndex];
    },

    __determineColor: function() {
        var colors = [
            'yellow',
            'red',
            'blue',
            'green',
            'black',
            'grey',
            'lightgrey',
            'darkgrey'
        ];
        var colorIndex = Math.floor((Math.random() * colors.length));
        this.__color = colors[colorIndex];
    },

    __getStudHeight: function() {
        return 1.8 * this.__multiplier;
    },

    __getStudWidth: function() {
        return 4.8 * this.__multiplier;
    },

    __getStudDistance: function() {
        return 1.6 * this.__multiplier;
    },

    getBrickHeight: function() {
        return 3.2 * this.__plates * this.__multiplier;
    },

    getBrickWidth: function() {
        return 8 * this.__studs * this.__multiplier;
    },

    getStudWidth: function() {
        return 8 * this.__multiplier;
    }
}

new Legoizer('legoCanvas', {plates: 3});
