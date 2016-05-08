'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Isvg = require('react-inlinesvg');

module.exports = React.createClass({
    displayName: 'Map',
    toggled: false,
    prevClientY: 0,
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        var $this = $(ReactDOM.findDOMNode(this));
        var $svg = $this.find('svg');
        $svg.off('mouseover', '.hover-region');
        $svg.off('mouseout', '.hover-region');
        $svg.off('click', '.hover-region');
    },
    setRegionActive: function(e) {
        var id = $(e.currentTarget).data('region');
        var $svg = $(e.delegateTarget);
        var $name = $svg.find('.region-name[data-region='+id+']');
        var $region = $svg.find('.selectable-region[data-region='+id+']');
        if ($name.length > 0) $name.attr('class', $name.attr('class').replace(' active-text', '') + ' active-text');
        if ($region.length > 0) $region.attr('class', $region.attr('class').replace(' active-region', '') + ' active-region');
        $('#pattern'+id).attr('class', 'original-color changed-color');
        return $region;
    },
    setRegionNotActive: function(e, region) {
        var id = region || $(e.currentTarget).data('region');
        var $svg = $(e.delegateTarget);
        var $name = $svg.find('.region-name[data-region='+id+']');
        var $region = $svg.find('.selectable-region[data-region='+id+']');
        if ($name.length > 0) $name.attr('class', $name.attr('class').replace(' active-text', ''));
        if ($region.length > 0) $region.attr('class', $region.attr('class').replace(' active-region', ''));
        $('#pattern'+id).attr('class', 'original-color');
    },
    handlerOver: function(e) {
        var currentRegion = $(e.currentTarget).data('region');
        var $region = this.setRegionActive(e);
        $('.info-card').attr('class', 'info-card');
        this.redrawCard($region);
        this.repositionCard(e, currentRegion);
        this.props.reloadData('mouseover', !!this.toggled, currentRegion, this.toggled);
    },
    handlerOut: function(e) {
        var currentRegion = $(e.currentTarget).data('region');
        if (this.toggled != currentRegion) {
            this.setRegionNotActive(e);
        }
        $('.info-card').attr('class', 'info-card info-card_state_hidden');
        this.props.reloadData('mouseout', !!this.toggled, currentRegion, this.toggled);
    },
    handlerClick: function(e) {
        var currentRegion = $(e.currentTarget).data('region');
        this.setRegionActive(e);
        if (this.toggled != false) {
            if (this.toggled == currentRegion) {
                this.toggled = false;
            } else {
                this.setRegionNotActive(e, this.toggled);
                this.toggled = currentRegion;
            }
        } else {
            this.toggled = currentRegion;
        }
        this.repositionCard(e, currentRegion);
        this.props.reloadData('click', !!this.toggled, currentRegion, this.toggled);
    },
    attachHandlers: function() {
        var $this = $(ReactDOM.findDOMNode(this));
        var $svg = $this.find('svg');
        $svg.on('mouseover', '.hover-region', this.handlerOver);
        $svg.on('mouseout', '.hover-region', this.handlerOut);
        $svg.on('click', '.hover-region', this.handlerClick);

          $svg.find('.selectable-region').each(function(i, d) {
              var path = $(d).clone()
              .attr('class', 'hover-region')
              .attr("stroke", "white")
              .attr("stroke-width", 5)
              .attr("style", "opacity: 0; z-index: 1000; position: relative;");
              path.insertAfter($svg.find('.lines'));
          });
        // $('.hover-region').eq(0).trigger('click');
    },
    redrawCard: function(elem) {
        var value = elem.data('value');
        var textPlacer = $('.card-text-placer');
            textPlacer.text(value);
        var newLeft = (88 - textPlacer[0].getComputedTextLength()) / 2; // magic number!! width of card
            textPlacer.attr('transform', 'translate('+newLeft+' 16.72)');
    },
    repositionCard: function(e, region) {
        var bbox = e.currentTarget.getBBox();
        var c = .5;
        switch (region) {
            case 1:
                c = .33;
                break;
            case 2:
                c = .45;
                break;
            case 8:
                c = .65;
                break;
            case 11:
                c = .55;
                break;
            case 13:
                c = .45;
                break;
        }
        var newX = bbox.x + (bbox.width * .5) - 44 - 495.73; // magic numbers!! width of card / 2
        var newY = bbox.y + (bbox.height * c) - 50; // magic numbers!! height of card
        $('.info-card').attr('transform', 'translate('+newX+', '+newY+')');
    },
    render: function() {
        return (
            <div className="map">
                <h4>{this.props.data.title}</h4>
                <div className="map__legend">
                    <Isvg src="images/legend.svg" uniquifyIDs={false}></Isvg>
                    <div className="map__legend-label map__legend-label_num_1">{this.props.data.max}</div>
                    <div className="map__legend-label map__legend-label_num_2">{this.props.data.min}</div>
                </div>
                <div className="map__svg">
                    <Isvg src="images/map.svg" uniquifyIDs={false} onLoad={this.attachHandlers}>
                        <img src="images/map.png" />
                    </Isvg>
                </div>
            </div>
        );
    }
});
