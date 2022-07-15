import React, { Component } from 'react';

import { List, Avatar, Space } from 'antd';
const  { Item  } = List;
import { MessageOutlined, HeartOutlined, RiseOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

class FeedListItem extends Component {
    
    render() {
        const { title, website, iconUrl, description, content, coverUrl, estimatedEngagement, subscribers, score } = this.props.item;
        return (
            <Item
                key={title}
                actions={[
                    <IconText icon={HeartOutlined} text={subscribers} key="list-vertical-like-o" />,
                    <IconText icon={RiseOutlined} text={score} key="list-vertical-star-o" />,
                    // <IconText icon={MessageOutlined} text={estimatedEngagement}key="list-vertical-message" />,
                ]}
                extra={coverUrl ? (
                    <img
                      width={272}
                      alt="logo"
                      src={coverUrl}
                    />) : null
                }
            >
                <Item.Meta
                    avatar={<Avatar src={iconUrl} />}
                    title={<a href={website}>{title}</a>}
                    description={description}
                />
                {content}
            </Item>
        )
    }
}

export default FeedListItem;