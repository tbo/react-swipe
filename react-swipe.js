(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(
      require('react'),
      require('react-dom'),
      require('swipe-js-iso')
    );
  } else {
    root.ReactSwipe = factory(
      root.React,
      root.Swipe
    );
  }
})(this, function (React, Dom, Swipe) {
  var styles = {
    container: {
      overflow: 'hidden',
      visibility: 'hidden',
      position: 'relative'
    },

    wrapper: {
      overflow: 'hidden',
      position: 'relative'
    },

    child: {
      float: 'left',
      width: '100%',
      position: 'relative'
    }
  };

  var ReactSwipe = React.createClass({
    // https://github.com/thebird/Swipe#config-options
    propTypes: {
      startSlide      : React.PropTypes.number,
      slideToIndex    : React.PropTypes.number,
      shouldUpdate    : React.PropTypes.func,
      speed           : React.PropTypes.number,
      auto            : React.PropTypes.number,
      continuous      : React.PropTypes.bool,
      disableScroll   : React.PropTypes.bool,
      stopPropagation : React.PropTypes.bool,
      callback        : React.PropTypes.func,
      transitionEnd   : React.PropTypes.func,
      enableMouse     : React.PropTypes.bool,
      enableScroll     : React.PropTypes.bool,
      direction       : React.PropTypes.string
    },

    componentDidMount: function () {
      if (this.isMounted()) {
        this.swipe = Swipe(Dom.findDOMNode(this), this.props);
      }
    },

    componentDidUpdate: function (prevProps) {
      if (this.doChildrenDiffer(prevProps.children, this.props.children)) {
        this.swipe.kill();
        this.swipe = Swipe(this.getDOMNode(), this.props);
      }

      var slide = document.querySelector('.slide > div');
      if (slide.offsetHeight ===  0) {
          this.swipe.kill();
          this.swipe = Swipe(this.getDOMNode(), this.props);
      }
      if (this.props.slideToIndex || this.props.slideToIndex === 0) {
        this.swipe.slide(this.props.slideToIndex);
      }
    },

    componentWillUnmount: function () {
      this.swipe.kill();
      delete this.swipe;
    },

    shouldComponentUpdate: function (nextProps) {
      return (
        (this.props.slideToIndex !== nextProps.slideToIndex) ||
        this.props.shouldUpdate && !this.props.shouldUpdate(nextProps)
      );
    },

    doChildrenDiffer: function (prevChildren, nextChildren) {
      if (prevChildren.length !== nextChildren.length) {
        return true;
      }
      for(var i = 0; i < prevChildren.length; i++) {
        if (prevChildren[i].key !== nextChildren[i].key) {
          return true;
        }
      }
      return false;
    },

    render: function() {
      return React.createElement('div', React.__spread({}, this.props, {style: styles.container}),
        React.createElement('div', {style: styles.wrapper},
          React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {style: styles.child});
          })
        )
      );
    }
  });

  return ReactSwipe;
});
