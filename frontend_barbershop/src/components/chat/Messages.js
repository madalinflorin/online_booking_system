import React, {useEffect, useRef } from 'react';
import moment from 'moment-timezone';

const Messages = ({ messages, currentUser, modifyHeight }) => {

  const elementRef = useRef(null);

  useEffect(() => {
      if(messages.length!==0)
      modifyHeight(elementRef.current.clientHeight);
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

    let renderMessage = (msg) => {
        const { name, message, photo, color, timeMessage } = msg;
        const messageFromMe = currentUser.username === msg.name;
        const className = messageFromMe ? "Messages-message currentUser" : "Messages-message";
        return (
            <li key={moment(new Date(timeMessage)).format('DD/MM/YYYY HH:mm:ss.SSSZ')} className={className}>
                <span
                    className="avatar"
                    style={{ backgroundColor: color }}
                >
                    <img
                        src={`data:image/jpeg;base64,${photo}`}
                        alt="profile-img"
                        className="profile-img-card-chat"

                    />
                </span>
                <div className="Message-content">
                    <div className="username">
                        {name}
                    </div>
                    <div className="text">{message}</div>
                    <div className="username">
                        {moment(new Date(timeMessage)).format('DD/MM/YYYY HH:mm')}
                    </div>
                </div>
            </li>
        );
    };

    return (
        <ul ref={elementRef} className="messages-list">
            {messages.map(msg => renderMessage(msg))}
        </ul>
    )
}


export default Messages