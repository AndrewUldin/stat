var React = require('react');
var ReactDOM = require('react-dom');
var fs = require('fs');
var $ = require('jquery-browserify');
var Isvg = require('react-inlinesvg');
var ReactCSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
31
class App extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.props.currentRegion = false;
        this.props.toggled = false;
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
                        toggled={this.props.toggled}
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

    cardReloadDataFunc(eventType, toggleStatus, selectedRegion, regionAfterMouseOut) {
        this.props.toggled = toggleStatus;
        switch (eventType) {
            case "click":
                if (toggleStatus == true) {
                    this.props.currentRegion = selectedRegion;
                } else {
                    this.props.currentRegion = regionAfterMouseOut;
                }
                break;
            case "mouseover":
                this.props.currentRegion = selectedRegion;
                break;
            case "mouseout":
                this.props.currentRegion = regionAfterMouseOut;
                break;
        }
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

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.currentData = {};
        this.lastData = {};
        var regions = this.props.data.regions;
        var max = {};
        Object.keys(regions).forEach(function(regionKey) {
            var region = regions[regionKey];
            Object.keys(region).forEach(function(key) {
                var value = region[key];
                if (typeof value == 'number') {
                    if (!max[key] || value > max[key]) max[key] = value;
                }
            });
        });
        this.max = max;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentRegion != false) {
            this.currentData = this.props.data.regions[newProps.currentRegion];
            this.lastRegion = newProps.currentRegion;
            this.lastData = this.currentData;
            $('.table').addClass('table_invisible_yes');
            $('.card').addClass('card_filled_yes');
        } else {
            if (newProps.toggled == false) {
                this.currentData = {};
                $('.table').removeClass('table_invisible_yes');
                $('.card').removeClass('card_filled_yes');
            }
        }
    }
    render() {
        var wrapper = (function(currentData, lastData, displayRegion, toggled, max) {
            if (Object.keys(currentData) == 0) {
                var displayData = lastData;
            } else {
                var displayData = currentData
            }
            var times = (function(displayData) {
                if (typeof displayData.periodEnd === 'undefined') {
                    return 'Начало руководства главы:<br/>'+displayData.period;
                }
                return 'Период руководства главы:<br/>'+displayData.period+' — '+displayData.periodEnd;
            })(displayData);
            if (!displayRegion) displayRegion = 1;

            if(displayData) {
                displayData.max_population = (displayData.population / (max.population / 100)).toFixed(2);
                displayData.max_vrp = (displayData.vrp / (max.vrp / 100)).toFixed(2);
                displayData.max_index = (displayData.index / (max.index / 100)).toFixed(2);
                displayData.max_flats = (displayData.flats / (max.flats / 100)).toFixed(2);
                displayData.max_auto = (displayData.auto / (max.auto / 100)).toFixed(2);
            }

            return  <div className="card__wrap">
                        <h1>{displayData.title}</h1>
                        <div className="card__info">
                            <div className="card__photo"><img src={'images/heads/' + displayRegion + '.png'} /></div>
                            <div className="card__text">
                                <div className="card__text-wrap">
                                    <h2>{displayData.head}</h2>
                                    <div className="card__position">{displayData.position}</div>
                                    <div className="card__times" dangerouslySetInnerHTML={{__html: times}} />
                                </div>
                            </div>
                        </div>
                        <div className="statistic">
                            <table className="statistic__table" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td rowSpan="2" className="td__svg statistic__svg_num_1">
                                            <Isvg src="images/statistic__icon_num_1.svg" />
                                        </td>
                                        <td className="td__title">
                                            <div className="statistic__title">ВРП на душу населения</div>
                                        </td>
                                        <td className="td__value">
                                            <div className="statistic__value">{displayData.vrp}</div>
                                            <div className="statistic__rub"><Isvg src="images/statistic__rub.svg" /></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="td__line">
                                            <div className="statistic__line">
                                                <div className="statistic__bar" style={{width: displayData.max_vrp + '%'}} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='tr__space'><td colSpan="3"/></tr>
                                    <tr>
                                        <td rowSpan="2" className="td__svg statistic__svg_num_1">
                                            <Isvg src="images/statistic__icon_num_2.svg" />
                                        </td>
                                        <td className="td__title">
                                            <div className="statistic__title">индекс качества жизни</div>
                                        </td>
                                        <td className="td__value">
                                            <div className="statistic__value">{displayData.index}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="td__line">
                                            <div className="statistic__line">
                                                <div className="statistic__bar" style={{width: displayData.max_index + '%'}} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='tr__space'><td colSpan="3"/></tr>
                                    <tr>
                                        <td rowSpan="2" className="td__svg statistic__svg_num_1">
                                            <Isvg src="images/statistic__icon_num_3.svg" />
                                        </td>
                                        <td className="td__title">
                                            <div className="statistic__title">Средняя стоимость 1 кв.м. жилья</div>
                                        </td>
                                        <td className="td__value">
                                            <div className="statistic__value">{displayData.flats}</div>
                                            <div className="statistic__rub"><Isvg src="images/statistic__rub.svg" /></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="td__line">
                                            <div className="statistic__line">
                                                <div className="statistic__bar" style={{width: displayData.max_flats + '%'}} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='tr__space'><td colSpan="3"/></tr>
                                    <tr>
                                        <td rowSpan="2" className="td__svg statistic__svg_num_1">
                                            <Isvg src="images/statistic__icon_num_4.svg" />
                                        </td>
                                        <td className="td__title">
                                            <div className="statistic__title">Число автомобилей на 1000 человек</div>
                                        </td>
                                        <td className="td__value">
                                            <div className="statistic__value">{displayData.auto}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="2" className="td__line">
                                            <div className="statistic__line">
                                                <div className="statistic__bar" style={{width: displayData.max_auto + '%'}} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>;
        })(this.currentData, this.lastData, this.lastRegion, this.props.toggled, this.max);
            return (
                <div className="card">
                    {wrapper}
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