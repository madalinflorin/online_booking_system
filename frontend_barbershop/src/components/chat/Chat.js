import React, { useState, useEffect, useRef } from 'react';
import SockJsClient from 'react-stomp';
import AuthService from '../../services/AuthService';
import '../../App.css';
import Input from './Input';
import Messages from './Messages';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import * as API_CHAT from "../../commons/api/chat-api";
import { swalComponent } from '../Swal';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import {HOST} from '../../constants/host';

function Chat(props) {

    const t = props.value;
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState({ username: "", photo: "", color: "" });
    const [clientRef, setClientRef] = useState(undefined);
    const SOCKET_URL = HOST.backend_api + "/websocket-chat";
    const ps = useRef();
    const [height, setHeight] = useState(220);
    const [isAdmin, setIsAdmin] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {

            currentUser.roles.map(role => {
                if (role === "ROLE_ADMIN") {
                    setIsAdmin(true);
                }
                return role;
            })

            setUser({
                username: currentUser.username,
                photo: currentUser.photo,
                color: randomColor()
            });

            API_CHAT.getMessages((result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    setMessages(result);

                } else {
                    console.log(status);
                    console.log(error);
                    if (status === 401) {
                        history.push("/");
                    }
                    else {

                        swalComponent(t('server.problem'), t('server.problem'), "error");
                    }
                }
            });

        }

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    let onConnected = () => {
        console.log("Connected!!")
    }

    let onMessageReceived = (msg) => {
        console.log('New Message Received!!', msg);
        setMessages(messages.concat(msg));
    }

    let onSendMessage = (msgText) => {
        API_CHAT.verifyAccess((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {

                clientRef.sendMessage('/app/user-all', JSON.stringify({
                    name: user.username,
                    message: msgText,
                    photo: user.photo,
                    color: user.color
                }));

            } else {
                console.log(status);
                console.log(error);
                if (status === 401) {
                    swalComponent(t('contact.status'), t('login.error'), "error");
                }
                else {

                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
        });
    }


    function randomColor() {
        return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }

    const modifyHeight = h => {

        console.log(h);

        if (h < 600) {
            setHeight(h + 150);
        }
        else {
            setHeight(800);
        }

        if (h > 150) {

            const curr = ps.current;

            if (curr) {
                curr.scrollTop = h + 150;
            }
        }
    }

    const deleteAllMessages = () => {

        Swal.fire({
            title: t('delete.title'),
            text: t('chat.text'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8B7871',
            cancelButtonColor: '#d33',
            confirmButtonText: t('delete.messageButton')
        }).then((result) => {
            if (result.isConfirmed) {

                API_CHAT.deleteMessages((result, status, error) => {
                    if (result !== null && (status === 200 || status === 201)) {
        
                        setMessages([]);
                        setHeight(220);
                        swalComponent(t('contact.status'), t('chat.deleteSuccess'), "success");
        
                    } else {
                        console.log(status);
                        console.log(error);
                        if (status === 401) {
                            swalComponent(t('contact.status'), t('login.error'), "error");
                        }
                        else {
        
                            swalComponent(t('server.problem'), t('server.problem'), "error");
                        }
                    }
                });

            }
        })
        
    }


    return (
        <div className="containerbig">
            <br/>
            {user.username && <h2 className="contentHomePage">{t('chat.welcome')} {user.username}!</h2>
            }
            <br />

            <div className="scrollbar"
                style={{ height: height + "px" }}
            >
                <PerfectScrollbar
                    containerRef={el => (ps.current = el)}
                >

                    <div className="containerChat">
                        <>
                            <SockJsClient
                                url={SOCKET_URL}
                                topics={['/topic/user']}
                                onConnect={onConnected}
                                onDisconnect={console.log("Disconnected!")}
                                onMessage={msg => onMessageReceived(msg)}
                                debug={false}
                                ref={(client) => {
                                    setClientRef(client);
                                }}
                            />

                            <Messages
                                messages={messages}
                                currentUser={user}
                                modifyHeight={modifyHeight}
                            />
                            <Input onSendMessage={onSendMessage} t={t}/>
                        </>
                    </div>

                </PerfectScrollbar>
            </div>
            {isAdmin &&
                <Button style={{
                    borderRadius: 35,
                    backgroundColor: "rgb(186, 135, 106)",
                    marginTop: "20px",
                    marginLeft: "41%",
                    fontSize: "25px"
                }}
                    variant="contained" onClick={deleteAllMessages}>
                    {t('chat.clear')}
                </Button>
            }
            <hr />
            <br />
        </div >
    )

}

export default Chat;