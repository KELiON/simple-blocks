# SimpleBlocks

## About
It is simple microframework, inspired by [evil blocks](https://github.com/ai/evil-blocks), but built for better using with es6/es7 (use it now with [babel](https://babeljs.io/)).

## How to use 

To register new simle_block just call `simple_block` function with selector and handler. Second argument of `simple_block` can be function, object with `init` key or class with `init` method.

### Function handler
You can use simple function as a handler for a block. This block makes xhr-request after DOM is ready and inserts result inside:

    simple_block('.js-deferred-load', function() {
      let url = this.$el.data('url')
      $.get(url).then(::this.html)
    })

### Object handler
You can use object handler, as in evil.blocks. You should have `init` key in your object for initialize it:

    simple_block('.js-snippet', {
      init: function() {
        this.$img = this.find('.js-snippet-image')
        this.on('click', '.js-color-select', ::this.changeColor)
      }
      changeColor: function(e) {
        this.find('.js-color-select').removeClass('-active')
        this.$img.attr('src', e.$el.data('url'))
        e.$el.addClass('-active')
      }
    })


### Class handler
You also can use es6 classes as handlers. You also need `init` method:

    simple_block('.js-snippet', class {
      init() {
        this.$img = this.find('.js-snippet-image')
        this.on('click', '.js-color-select', ::this.changeColor)
      }
      changeColor(e) {
        this.find('.js-color-select').removeClass('-active')
        this.$img.attr('src', e.$el.data('url'))
        e.$el.addClass('-active')
      }
    })

### Event listeners
In simple blocks you can use the same syntax, as jquery uses. Add event listeners in your `init` method. It is better to use [es7 function bind](http://babeljs.io/blog/2015/05/14/function-bind/) syntax:

    init() {
      this.on('click', ::this.onClick)
    }
    onClick(event) {
      this.$el.toggleClass('checked')
    }

Note, that block DOM element is stored inside `this.$el`. You also can get `$(this)` element inside event listener from `event.$el`:

    init() {  
      this.$img = this.$el.find('.js-big-image')
      this.on('click', '.js-thumb', ::this.changeImage)
    }
    changeImage(e) {
      this.$img.attr('src', e.$el.data('url'))
    }

## Initializing 
To find and initialize all blocks on page it calls `SimpleBlock.vitalize()` on `$(document).ready` event. 

To initialize all simple_blocks inside your new DOM-element, call `SimpleBlock.vitalize(el)`. If you need to change html of your block or replace your block with new content, you can call `.html(html)` and `.replaceWith(html)` on your block, not DOM-element in order to initialize all blocks and event listeners inside.


## Browser support
//todo
