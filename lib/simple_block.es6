;(function(window){
  "use strict";

  let blocks = {}
  let attachedBlocks = new WeakMap()

  function inheritanceChain(klass){
    let proto = Object.getPrototypeOf(klass)
    let result = [proto]
    if (proto != null) {
      let parents = inheritanceChain(proto)
      Array.prototype.push.apply(result, parents)
    }
    return result
  }

  function copyPrototype(proto, to) {
    Object.getOwnPropertyNames(proto).forEach((method) => {
      if (method != 'constructor') {
        to.prototype[method] = proto[method]
      }
    })
  }
  class SimpleBlock {
    _events = []

    static add(selector, klass){
      if (typeof klass == 'function' && (!klass.prototype.init)) {
        // allow simple function as handler
        klass = {
          init: klass
        }
      }
      if (typeof klass == 'object') {
        // allow key => value object as handler
        let _klass = class extends this {}
        copyPrototype(klass, _klass)
        klass = _klass
      }
      let simpleBlockInherited = inheritanceChain(klass)
        .filter(proto => proto == this)
        .length > 0
      if (typeof klass == 'function' && !simpleBlockInherited) {
        // allow class not inherited from SimpleBlock as handler
        let _klass = class extends this {}
        copyPrototype(klass.prototype, _klass)
        klass = _klass
      }

      blocks[selector] = klass

      if (!this._eventBinded) {
        $(() => ::this.vitalize())
        this._eventBinded = true
      }
    }

    static vitalize(scope = document) {
      for (let selector in blocks) {
        let klass = blocks[selector]
        $(scope).find(selector).each((_, $el) => {
          if (!attachedBlocks.has($el)) {
            attachedBlocks.set($el, new klass($el))
          }
        })
      }
    }

    on() {
      this._events = this._events || []
      this._events.push(arguments)
    }

    replaceWith(html) {
      let el = $(html)
      this.$el.replaceWith(el)
      this.$el = el
      SimpleBlock.vitalize(this.$el)
      this.bindEvents()
    }

    html(html) {
      this.$el.html(html)
      SimpleBlock.vitalize(this.$el)
    }

    find(selector) {
      return this.$el.find(selector)
    }

    init(){}

    bindEvents() {
      this._events.forEach((e) => {
        // small helper: add $el property to each event with jQuery $(this)
        let listener = e[e.length - 1]
        let _this = this
        e[e.length - 1] = function(event){
          event.$el = $(this)
          return this::listener(event)
        }
        this.$el.on.apply(this.$el, e)
      })
    }

    constructor($el){
      this.$el = $($el)
      this.init()
      this.bindEvents()
    }
  }

  window.SimpleBlock = SimpleBlock;

  window.simple_block = (selector, klass) => SimpleBlock.add(selector, klass)
})(window)