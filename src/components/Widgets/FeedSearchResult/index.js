import React, { Component } from 'react';
import { connect } from 'react-redux';

class FeedSearchResult extends Component {
  render() {
    const {feeds} = this.props;

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>{feeds?.content?.map((feed, index) => <tr key={index}><td>{feed?.title}</td></tr>)}</tbody>
      </table>
    );
  }
}

function mapStateToProps({feeds}) {
    if ( feeds && feeds?.content?.length) {
        return { feeds }
    }
    return { feeds: []}
}

export default connect(mapStateToProps)(FeedSearchResult);