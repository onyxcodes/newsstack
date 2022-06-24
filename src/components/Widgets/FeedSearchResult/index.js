import React, { Component } from 'react';
import { connect } from 'react-redux';
import logger from '../../../utils/logger';
import FeedListItem from '../FeedListItem';
import { List } from 'antd';

class FeedSearchResult extends Component {
  render() {
    const { feeds } = this.props;
    logger.info({ feeds: feeds }, 'FeedSearchResult - Got feeds');
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 8,
        }}
        dataSource={feeds?.content}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={item => (<FeedListItem item={item} />)}
      />
    );
  }
}

function mapStateToProps({ feeds }) {
  if (feeds && feeds?.content?.length) {
    return { feeds }
  }
  return { feeds: [] }
}

export default connect(mapStateToProps)(FeedSearchResult);