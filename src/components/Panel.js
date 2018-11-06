import React, { Component } from 'react';
import { Collapse } from 'antd';

export default class Panel extends Component {
    constructor(props) {
        super(props);
        this.callback = this.callback.bind(this);
        console.log(props);
    }

    callback = function(key) {
        console.log(key);
      }
    

    render() {
        let { callback } = this;
        let { filter, rides, passengers } = this.props;

        console.log(this.props);
        return (
            <div>
                <Collapse onChange={callback}>
                    {filter === 'passenger' && 
                        passengers.map((item) => 
                            <Collapse.Panel header={'From: ' + item.from + ' To: ' + item.to} key={item.link}>
                            <p>From: {item.from} To: {item.to}</p>
                            </Collapse.Panel>
                    )}
                </Collapse>
            </div>
        );
    }
}