'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery-browserify');

var bh = new (require('bh').BH);

/* modules */
var Table = require('./modules/table.jsx');
var Map = require('./modules/map.jsx');
var Card = require('./modules/card.jsx');

module.exports = class blockOne extends React.Component {
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
                <div className="container__header">{this.props.header}</div>
                <div className="container__page container__page_mode_graphics">
                    <div className="container__wrap">
                        <div className="container__body">
                            <Card
                                data={this.props.card}
                                toggled={this.props.toggled}
                                currentRegion={this.props.currentRegion}
                            />
                            <Table data={this.props.table} />
                            <Map 
                                data={this.props.map}
                                reloadData={this.cardReloadDataFunc.bind(self)}
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