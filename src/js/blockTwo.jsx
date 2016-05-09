'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery-browserify');
var bh = new (require('bh').BH);

module.exports = class blockOne extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.container = container;
        this.currentYear = 2013;
        this.overlay = -1; // hide overlay
        this.render();
    }

    render() {
        var self = this;
        ReactDOM.render(
            <div className="container">
                <div className="container__header">{this.props.header}</div>
                <div className="container__page container__page_mode_graphics">
                    <div className="container__wrap">
                        <div className="container__body">
                            <h2>{this.props.headerSmall}</h2>
                            <Bars
                                data={this.props.bars}
                                texts={this.props.texts}
                                overlay={this.overlay}
                                handleOut={this.handleOut.bind(self)}
                                handleOver={this.handleOver.bind(self)}
                                handleClick={this.handleClick.bind(self)}
                                currentYear={this.currentYear}
                            />
                        </div>
                    </div>
                </div>
                <div className="container__page container__page_mode_text">
                    <div className="container__wrap">
                        <div className="container__body" dangerouslySetInnerHTML={{__html: bh.toHtml(this.props.text)}} />
                    </div>
                </div>
            </div>,
            this.container
        );
    }

    handleOver(e) {
        this.overlay = $(e.currentTarget).data('region');
        this.render();
    }

    handleOut(e) {
        this.overlay = -1;
        this.render();
    }

    handleClick(e) {
        e.preventDefault();
        this.currentYear = parseInt($(e.currentTarget).data('year'));
        this.render();
    }

}

class Bars extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.cols = this.props.data[this.props.currentYear];
        this.overlayData = 0;
        this.render();
    }

    componentWillReceiveProps(newProps) {
        this.cols = this.props.data[newProps.currentYear];
        this.overlayData = newProps.overlay >= 0 && this.cols[newProps.overlay].square ? this.cols[newProps.overlay].square : 0;
    }

    render() {
        var self = this;
        return (
            <div className="bars">
                <div className="bars__legend">
                    <div className="bars__legend-col">
                        <div className="bars__legend-item bars__legend-item_0_0">{this.props.texts.legend[0][0]}</div>
                        <div className="bars__legend-item bars__legend-item_0_1">{this.props.texts.legend[0][1]}</div>
                    </div>
                    <div className="bars__legend-col">
                        <div className="bars__legend-item bars__legend-item_1_0">{this.props.texts.legend[1][0]}</div>
                        <div className="bars__legend-item bars__legend-item_1_1">{this.props.texts.legend[1][1]}</div>
                    </div>
                    <div className="bars__legend-col">
                        <div className="bars__legend-item bars__legend-item_2_0">{this.props.texts.legend[2][0]}</div>
                    </div>
                </div>
                <div className="bars__seletors">
                    <a className={'bars__seletor' + (this.props.currentYear == 2013?' bars__seletor_state_active':'')} href='#' onClick={this.props.handleClick} data-year='2013'>2013</a>
                    <a className={'bars__seletor' + (this.props.currentYear == 2014?' bars__seletor_state_active':'')} href='#' onClick={this.props.handleClick} data-year='2014'>2014</a>
                </div>
                <div className="bars__scene">
                    <div className="bars__labels">
                        <div className="bars__label">70 000</div>
                        <div className="bars__label">60 000</div>
                        <div className="bars__label">50 000</div>
                        <div className="bars__label">40 000</div>
                        <div className="bars__label">30 000</div>
                        <div className="bars__label">20 000</div>
                        <div className="bars__label">10 000</div>
                        <div className="bars__label">0</div>
                    </div>
                    <div className="bars__grids">
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                        <div className="bars__grid" />
                    </div>
                    <Medians
                        data={this.cols}
                    />
                    <Cols
                        data={this.cols}
                    />
                    <Overlay
                        region={this.props.overlay}
                        text={this.props.texts.overlay}
                        data={this.overlayData}
                    />
                    <PseudoCols
                        handleOut={self.props.handleOut}
                        handleOver={self.props.handleOver}
                        data={this.cols}
                    />
                </div>
            </div>
        );
    }
}

class Medians extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.render();
    }

    componentDidMount() {
        setTimeout(this.animateHeight, 1000);
    }

    componentWillReceiveProps(newProps) {
        this.animateHeight();
    }

    animateHeight() {
        $('.mediana').each(function(index, el) {
            setTimeout(function() {
                $(el).css('height', $(el).attr('data-height') + '%');
            }, index * 50);
        });
    }

    render() {
        var self = this;
        var regions = self.props.data;
        var absMax = 0;
        var max = {
            heads: 0,
            budgets: 0
        };
        var sum = {
            heads: 0,
            budgets: 0
        };
        Object.keys(regions).forEach(function(regionKey) {
            var region = regions[regionKey];
            Object.keys(region).forEach(function(key) {
                var value = region[key];
                if (typeof value == 'number') {
                    if (!max[key] || value > max[key]) max[key] = value;
                    if (!absMax || value > absMax) absMax = value;
                    sum[key] = sum[key] + value;
                }
            });
        });
        var medians = {
            heads: parseFloat((sum.heads / regions.length) / (absMax / 100)).toFixed(2),
            budgets: parseFloat((sum.budgets / regions.length) / (absMax / 100)).toFixed(2)
        };

        return (
            <div className="medians">
                <div className="mediana mediana_mod_0" data-height={medians.heads} />
                <div className="mediana mediana_mod_1" data-height={medians.budgets} />
            </div>
        );
    }
}
class Cols extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.render();
    }

    componentDidMount() {
        setTimeout(this.animateHeight, 500);
    }

    componentWillReceiveProps(newProps) {
        this.animateHeight();
    }

    animateHeight() {
        $('.col__bar').each(function(index, el) {
            setTimeout(function() {
                $(el).css('height', $(el).attr('data-height') + '%');
                if ($(el).hasClass('col__bar_mode_middle')) {
                    $(el).attr('data-value', $(el).attr('data-val'));
                    setTimeout(function() {
                        $(el).addClass('col__bar_pseudo_yes');
                    }, 50);
                }
            }, index * 50);
        });
    }

    render() {
        var self = this;
        var regions = self.props.data;
        var max = 0;
        var relations = [];
        self.maxRelation = 0;
        Object.keys(regions).forEach(function(regionKey) {
            var region = regions[regionKey];
            Object.keys(region).forEach(function(key) {
                var value = region[key];
                if (typeof value == 'number') {
                    if (!max || value > max) max = value;
                }
            });
            relations[regionKey] = region['heads'] / region['budgets'];
            if (relations[regionKey] > self.maxRelation) self.maxRelation = relations[regionKey];
        });
        self.maxRelation = self.maxRelation * 1.1;
        self.max = max;
        self.cols = regions.map(function(col, index) {
            col.left = parseFloat(col.heads / (self.max / 100)).toFixed(2);
            col.right = parseFloat(col.budgets / (self.max / 100)).toFixed(2);
            col.middle = parseFloat(relations[index] / (self.maxRelation / 100)).toFixed(2);
            return (
                <div className="col" key={index} data-region={index}>
                    <div className="col__bar col__bar_mode_left" data-height={col.left}></div>
                    <div className="col__bar col__bar_mode_right" data-height={col.right}></div>
                    <div className="col__bar col__bar_mode_middle" data-height={col.middle} data-val={relations[index].toFixed(2)}></div>
                    <div className="col__title">{col.title}</div>
                </div>
            );
        });
        return (
            <div className="bars__cols">
                {this.cols}
            </div>
        );
    }
}
class PseudoCols extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.render();
    }

    render() {
        var self = this;
        this.cols = this.props.data.map(function(col, index) {
            return (
                <div className="pseudo-col" key={index} data-region={index} onMouseOver={self.props.handleOver} onMouseOut={self.props.handleOut} />
            );
        });
        return (
            <div className="bars__cols bars__cols_mode_pseudo">
                {this.cols}
            </div>
        );
    }
}
class Overlay extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.render();
    }

    componentWillReceiveProps(newProps) {
        this.animatePosition(newProps.region);
    }

    animatePosition(region) {
        if (region !== -1) {
            var left = $('.col[data-region='+region+']').offset().left - $('.bars__scene').offset().left;
            if (region > 10) {
                left = left - 150;
            }
            $('.overlay').css({left: left + 20});
        }
    }

    render() {
        var self = this;
        return (
            <div className={"overlay " + (this.props.data !== 0?" overlay_state_active":"")  + (this.props.region > 10?" overlay_movearrow_yes":"")}>
                <div className="overlay__wrap">
                    <div>{this.props.data} м<sup>2</sup></div>
                    <span>{this.props.text}</span>
                </div>
            </div>
        );
    }
}
