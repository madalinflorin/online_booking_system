import React, {Suspense } from 'react';
import '../commons/styles/news.css';
import Card from './Card'
import XMLData from '../xml/news.xml';
import axios from 'axios';
import { parseString } from 'xml2js';
import logo from '../logo.svg';

const Loader = () => (
    <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Loading...</div>
    </div>
);


class News extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            itemsRO: [],
            itemsEN: []
        };
    }

    componentDidMount() {
        let self = this;
        var xml;
        axios
            .get(XMLData, {
                "Content-Type": "application/xml; charset=utf-8"
            })
            .then(function (response) {
                xml = response.data;
                parseString(xml, function (err, result) {
                    console.log(result.newsRoot.en)
                    self.setState({

                        itemsRO: result.newsRoot.ro[0].news,
                        itemsEN: result.newsRoot.en[0].news

                    });
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    render() {

        const resultRO = this.state.itemsRO
        const resultEN = this.state.itemsEN

        const x = localStorage.getItem("i18nextLng")

        return (

            <Suspense fallback={<Loader />}>
                <div>
                    {x === 'ro' && resultRO.length > 0 ? <Card items={this.state.itemsRO} /> : <div></div>}
                    {x === 'en' && resultEN.length > 0 ? <Card items={this.state.itemsEN} /> : <div></div>}

                </div>
            </Suspense>

        )
    }
}

export default News;