var React = require('react');
var ReactDOM = require('react-dom');
var fs = require('fs');
var $ = require('jquery-browserify');
var Isvg = require('react-inlinesvg');

var App = React.createClass({
    displayName: 'App',
    render: function() {
        return (
            <div className="container">
                <TableBlock data={this.props.data.table} />
                <Map />
            </div>
        );
    }
});

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
    render: function() {
        return (
            <div className="map">
                <div className="map__svg">
                    <Isvg src="images/map.svg" uniquifyIDs={false}>
                        //Here's some optional content for browsers that don't support XHR or inline
                        //SVGs. You can use other React components here too. Here, I'll show you.
                        <img src="images/map.png" />
                    </Isvg>
                </div>
            </div>
        );
    }
});

module.exports = {
    App: App,
    TableNode: TableNode,
    Map: Map
};