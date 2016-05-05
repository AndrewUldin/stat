var React = require('react');
var ReactDOM = require('react-dom');
var fs = require('fs');
var $ = require('jquery-browserify');
var Isvg = require('react-inlinesvg');

class App extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.props.currentRegion = 0;
        this.container = container;
        this.render();
    }

    render() {
        var self = this;
        ReactDOM.render(
            <div className="container">
                <div className="container__page">
                    <Card
                        data={this.props.card}
                        currentRegion={this.props.currentRegion}
                    />
                    <TableBlock data={this.props.table} />
                    <Map 
                        data={this.props.map}
                        reloadData={this.cardReloadDataFunc.bind(self)}
                    />
                </div>
            </div>,
            this.container
        );
    }

    cardReloadDataFunc(newVal) {
        this.props.currentRegion = newVal;
        this.render();
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.container);
    }
}

var TableBlock = React.createClass({
    displayName: 'TableBlock',
    render: function() {
        return (
            <div className="table">
                <h2>{this.props.data.title}</h2>
                <div className="table__legends">
                    <div className="table__legend table__legend_type_income">{this.props.data.legend.income}</div>
                    <div className="table__legend table__legend_type_outcome">{this.props.data.legend.outcome}</div>
                </div>
                <div className="table__body">

                    <TableNode data={this.props.data.rows} />

                </div>
            </div>
        );
    }
});

var TableNode = React.createClass({
    displayName: 'TableNode',
    componentDidMount: function() {
        var $this = $(ReactDOM.findDOMNode(this));
        var $table__lines = $this.find('.table__line');
        var onePr = 20 / 100;
        var timeOut = 500;
            $table__lines.each(function(index, line) {
                setTimeout(function() {
                    var value = $(line).data('value');
                    var newWidth = value / onePr;
                    $(line).find('.table__bar').css({width: newWidth+'%'});
                }, timeOut + (index * 50));
            });
    },
    render: function() {
        var rowsNodes = this.props.data.map(function(line, i) {
            return(
                <tbody key={line.id}>
                    <tr>
                        <td>{line.id}</td>
                        <td>{line.title}</td>
                        <td><div className="table__legend-text_type_income">{line.income}</div><div className="table__legend-text_type_outcome">{line.outcome}</div></td>
                        <td>
                            <div className="table__line table__line_type_income" data-value={line.income}><div className="table__bar"></div></div>
                            <div className="table__line table__line_type_outcome" data-value={line.outcome}><div className="table__bar"></div></div>
                            <div className="table__grid table__grid_num_1"></div>
                            <div className="table__grid table__grid_num_2"></div>
                            <div className="table__grid table__grid_num_3"></div>
                            <div className="table__grid table__grid_num_4"></div>
                        </td>
                    </tr>
                    <tr className="table__seperator">
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
            );
        });
        return(
            <table cellpadding="0" cellspacing="0" border='1'>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="table__grid-number table__grid-number_num_1">0%</div>
                            <div className="table__grid-number table__grid-number_num_2">5%</div>
                            <div className="table__grid-number table__grid-number_num_3">10%</div>
                            <div className="table__grid-number table__grid-number_num_4">15%</div>
                            <div className="table__grid-number table__grid-number_num_5">20%</div>
                            <div className="table__grid table__grid_num_1"></div>
                            <div className="table__grid table__grid_num_2"></div>
                            <div className="table__grid table__grid_num_3"></div>
                            <div className="table__grid table__grid_num_4"></div>
                        </td>
                    </tr>
                    <tr className="table__seperator">
                        <td colSpan="4"></td>
                    </tr>
                </tbody>
                {rowsNodes}
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className='table__grid-line_position_bottom'>
                            <div className="table__grid table__grid_num_1"></div>
                            <div className="table__grid table__grid_num_2"></div>
                            <div className="table__grid table__grid_num_3"></div>
                            <div className="table__grid table__grid_num_4"></div>
                            <div className="table__grid-number table__grid-number_num_1">0%</div>
                            <div className="table__grid-number table__grid-number_num_2">5%</div>
                            <div className="table__grid-number table__grid-number_num_3">10%</div>
                            <div className="table__grid-number table__grid-number_num_4">15%</div>
                            <div className="table__grid-number table__grid-number_num_5">20%</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
});

var Map = React.createClass({
    displayName: 'Map',
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        var $this = $(ReactDOM.findDOMNode(this));
        var $svg = $this.find('svg');
        $svg.off('mouseover', '.selectable-region');
        $svg.off('mouseout', '.selectable-region');
        $svg.off('click', '.selectable-region');
        $svg.off('mouseover', '.region-name');
        $svg.off('mouseout', '.region-name');
        $svg.off('click', '.region-name');
        $svg.off('mousemove');
    },
    handlerOver: function(e) {
        var $elem = $(e.currentTarget);
        var $svg = $(e.delegateTarget);
        var id = $elem.data('region');
        var $name = $svg.find('.region-name[data-region='+id+']');
        var $region = $svg.find('.selectable-region[data-region='+id+']');
        if ($name.length > 0) $name.attr('class', $name.attr('class').replace(' active-text', '') + ' active-text');
        if ($region.length > 0) $region.attr('class', $region.attr('class').replace(' active-region', '') + ' active-region');
        $('#pattern'+id).attr('class', 'original-color changed-color');
        $('.map__card_state_hidden').removeClass('map__card_state_hidden');
        this.redrawCard($region);
        this.props.reloadData($(e.currentTarget).data('region'));
    },
    handlerOut: function(e) {
        var $elem = $(e.currentTarget);
        var $svg = $(e.delegateTarget);
        var id = $elem.data('region');
        var $name = $svg.find('.region-name[data-region='+id+']');
        var $region = $svg.find('.selectable-region[data-region='+id+']');
        if ($name.length > 0) $name.attr('class', $name.attr('class').replace(' active-text', ''));
        if ($region.length > 0) $region.attr('class', $region.attr('class').replace(' active-region', ''));
        $('#pattern'+id).attr('class', 'original-color');
        $('.map__card').addClass('map__card_state_hidden');
        this.props.reloadData(undefined);
    },
    handlerClick: function(e) {
        this.props.reloadData($(e.currentTarget).data('region'));
    },
    attachHandlers: function() {
        var $this = $(ReactDOM.findDOMNode(this));
        var $svg = $this.find('svg');
        $svg.on('mouseover', '.selectable-region', this.handlerOver);
        $svg.on('mouseout', '.selectable-region', this.handlerOut);
        $svg.on('click', '.selectable-region', this.handlerClick);
        $svg.on('mouseover', '.region-name', this.handlerOver);
        $svg.on('mouseout', '.region-name', this.handlerOut);
        $svg.on('click', '.region-name', this.handlerClick);
        $svg.on('mousemove', this.repositionCard);
        $('.map__card').on('mouseover', this.repositionCard);
    },
    redrawCard: function(elem) {
        var value = elem.data('value');
        var textPlacer = $('.card-text-placer');
            textPlacer.text(value);
        var newLeft = (88 - textPlacer[0].getComputedTextLength()) / 2; // magic number!! width of card
            textPlacer.attr('transform', 'translate('+newLeft+' 16.72)');
    },
    repositionCard: function(e) {
        var map = $('.map').offset();
        var newX = e.clientX - map.left - 44; // magic numbers!! width of card / 2
        var newY = e.clientY - map.top + $(window).scrollTop() - 50; // magic numbers!! height of card
        $('.map__card').css('transform', 'translate3d('+newX+'px, '+newY+'px, 0)');
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
                <div className="map__card map__card_state_hidden">
                    <Isvg src="images/card.svg" uniquifyIDs={false}></Isvg>
                </div>
            </div>
        );
    }
});

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.currentData = {};
        this.render();
    }

    componentWillReceiveProps(newProps) {
        if (typeof newProps.currentRegion !== 'undefined')
            this.currentData = this.props.data.regions[newProps.currentRegion];
        else
            this.currentData = {};
    }

    render() {
        var currentData = this.currentData;
        var times = (function(currentData) {
            if (typeof currentData.periodEnd === 'undefined') {
                return 'Начало руководства главы:<br/>'+currentData.period;
            }
            return 'Период руководства главы:<br/>'+currentData.period+' — '+currentData.periodEnd;
        })(currentData);

        if (Object.keys(currentData) == 0) 
            return (
                <div className="card"/>
            );
        else
            return (
                <div className="card">
                    <h2>{this.currentData.title}</h2>
                    <div className="card__info">
                        <div className="card__photo"><img src={'images/heads/' + this.props.currentRegion + '.png'} /></div>
                        <div className="card__text">
                            <h4>{this.currentData.head}</h4>
                            <div className="card__position">{this.currentData.position}</div>
                            <div className="card__times" dangerouslySetInnerHTML={{__html: times}} />
                        </div>
                    </div>
                </div>
            );
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this._container);
    }
}

module.exports = {
    App: App,
    TableNode: TableNode,
    Map: Map,
    Card: Card
};