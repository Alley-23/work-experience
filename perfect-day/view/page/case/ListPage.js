import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Image from '../../component/ResponsiveImage';
import Loading from '../../component/Loading';
import { getCaseList } from '../../action/case';

class CaseListPage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fetching: true
        };
    }
    componentDidMount () {
        if (!this.props.caseList.data) {
            this.props.getCaseList();
        } else {
            this.setState({
                fetching: false
            });
        }
    }
    componentWillReceiveProps(props) {
        if (props.caseList.data) {
            this.setState({
                fetching: false
            });
        }
    }
    render () {
        var cases = this.props.caseList.data;
        if (this.state.fetching) {
            return <Loading />;
        }

        return (
            <div className="page page-case-list">
                {
                    cases.map((item, i) => {
                        return <a href={ item.url } key={i} className="case-item">
                            <div className="case-image">
                                <Image src={ item.image } lazyload={ true } ratio={0.7} />
                            </div>
                            <h2 className="case-title">{ item.title }</h2>
                        </a>;
                    })
                }
            </div>
        );
    }
}

export default connect(
    (state) => state,
    (dispatch) => bindActionCreators({
        getCaseList
    }, dispatch)
)(CaseListPage);