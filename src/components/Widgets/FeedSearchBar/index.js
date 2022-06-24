import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import {search, feedSearch} from '../../../features/feedsearch';
import { performSearch } from '../../../features/feedly';
import { Input, Space } from 'antd';
const { Search } = Input;

class FeedSearchBar extends Component {
  render() {
    const {performSearch, value} = this.props;

    return (
      <Search
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      // value={value}
      onSearch={(value) => performSearch(value)}
    />
        // <input
        //   className="form-control"
        //   placeholder = "Procurar Trabalho"
        //   onChange={(e) => search(e.target.value)}
        //   value={value} />
    );
  }
} 

function mapStateToProps({feeds}) {
    return {value: feeds.query};
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators({performSearch}, dispatch);
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FeedSearchBar);
