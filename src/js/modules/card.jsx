'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Isvg = require('react-inlinesvg');

module.exports = class Card extends React.Component {
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
                            <div className="card__photo"><img src={'images/heads/' + displayRegion + '.jpg'} /></div>
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