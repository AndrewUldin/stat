'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var bh = new (require('bh').BH);

module.exports = class innerText extends React.Component {
    constructor(props, container) {
        super(props);
        this.props = props;
        this.container = container;
        this.render();
    }

    render() {
        var self = this;
        ReactDOM.render(
            <div className="container">
                <div className="container__page container__page_mode_text">
                    <div className="container__wrap">
                        <div className="container__body" dangerouslySetInnerHTML={{__html: bh.toHtml(this.props.text)}} />
                    </div>
                </div>
            </div>,
            this.container
        );
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this.container);
    }
}