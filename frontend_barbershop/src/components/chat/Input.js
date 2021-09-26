import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Tooltip } from "reactstrap";


const Input = ({ onSendMessage, t }) => {
    const [text, setText] = useState("");
    const [messageError, setMessageError] = useState(false);
    const CHARACTER_LIMIT = 1000;
    const minRows = 1;
    const maxRows = 5;
    const [height, setHeight] = useState(30);
    const [rows, setRows] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [marginButton, setMarginButton] = useState(35);

    let onChange = (event) => {

        setIsLoading(true)
        setText(event.target.value);
        const previousRows = event.target.rows;
        event.target.rows = minRows;
        const currentRows = ~~(event.target.scrollHeight / height);

        setMarginButton(event.target.scrollHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
        }

        if (currentRows < maxRows) {
            setRows(currentRows);
            setHeight(event.target.scrollHeight + height);
        }
        else {
            setRows(maxRows);
        }
        setIsLoading(false);

    }

    let onSubmit = () => {


        if (text.length === 1 && text.charCodeAt(0) === 10) {
            setText("");
        }
        else if (text.length >= 1) {
            setText("")
            onSendMessage(text);
            setMessageError(false);
            setMarginButton(35);
        }
        else {
            setMessageError(true);
        }
    }

    return (
        <div>
            {!isLoading &&
                <div>
                    <div className="message-input">


                        <TextField
                            multiline={true}
                            rows={rows}
                            className="inputField"
                            id="inputField"
                            label={t('chat.label')}
                            placeholder={t('chat.placeholder')}
                            onChange={e => onChange(e)}
                            margin="normal"
                            value={text}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    onSubmit(text);
                                }
                            }}
                            inputProps={{
                                maxLength: CHARACTER_LIMIT
                            }}
                            autoFocus
                            style={{ height: "30px", width: "80%" }}
                            helperText={`${text.length}/${CHARACTER_LIMIT}`}
                        />

                        <Tooltip
                            placement="bottom"
                            isOpen={messageError}
                            target="inputField"
                        >
                            {t('chat.errorMessage')}
                        </Tooltip>

                    </div>


                    <Button style={{
                        borderRadius: 35,
                        backgroundColor: "rgb(155, 124, 103)",
                        marginTop: marginButton + "px",
                        marginLeft: "45%",
                        fontSize: "17px",
                        position: "relative"
                    }}
                        variant="contained" onClick={onSubmit}>
                        {t('contact.submit')}
                    </Button>
                </div>
            }

        </div >
    );
}


export default Input;