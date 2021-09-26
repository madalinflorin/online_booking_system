import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import classNames from 'clsx';
import {
    Scheduler,
    MonthView,
    Appointments,
    Toolbar,
    DateNavigator,
    AppointmentTooltip,
    EditRecurrenceMenu,
    Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import * as API_APPOINTMENT from "../commons/api/appointment-api";
import * as API_USERS from "../commons/api/barbers-api";
import Swal from 'sweetalert2';
import { withStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import { swalComponent } from './Swal';
import moment from 'moment-timezone';
import AuthService from '../services/AuthService';
import OldPassword from './OldPassword';
import MyModal from './Modal';
import { useHistory } from "react-router-dom";

const getBorder = theme => (`1px solid ${theme.palette.type === 'light'
    ? lighten(fade(theme.palette.divider, 1), 0.88)
    : darken(fade(theme.palette.divider, 1), 0.68)
    }`);

const DayScaleCell = props => (
    <MonthView.DayScaleCell {...props} style={{ textAlign: 'center', fontWeight: 'bold' }} />
);

const styles = theme => ({
    cell: {
        color: '#78909C!important',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        padding: 0,
        height: 100,
        borderLeft: getBorder(theme),
        '&:first-child': {
            borderLeft: 'none',
        },
        '&:last-child': {
            paddingRight: 0,
        },
        'tr:last-child &': {
            borderBottom: 'none',
        },
        '&:hover': {
            backgroundColor: 'white',
        },
        '&:focus': {
            backgroundColor: fade(theme.palette.primary.main, 0.15),
            outline: 0,
        },
    },
    content: {

        display: 'flex',
        justifyContent: 'center',
        paddingTop: "35px",
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
    },
    text: {
        padding: '0.5em',
        textAlign: 'center',
    },
    smile: {
        color: '#A58B78',
    },
    smileBack: {
        color: '#E1F5FE',
    },
    opacity: {
        opacity: '0.5',
    },
    appointment: {
        borderRadius: '10px',
        '&:hover': {
            opacity: 0.6,
        },
    },
    apptContent: {
        '&>div>div': {
            whiteSpace: 'normal !important',
            lineHeight: 1.2,
        },
    },
    flexibleSpace: {
        flex: 'none',
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    tooltipContent: {
        padding: theme.spacing(3, 1),
        paddingTop: 0,
        backgroundColor: theme.palette.background.paper,
        boxSizing: 'border-box',
        width: '400px',
    },
    tooltipText: {
        ...theme.typography.body2,
        display: 'inline-block',
    },
    title: {
        ...theme.typography.h6,
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightBold,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    icon: {
        color: theme.palette.action.active,
        verticalAlign: 'middle',
    },
    circle: {
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
        verticalAlign: 'super',
    },
    textCenter: {
        textAlign: 'center',
    },
    dateAndTitle: {
        lineHeight: 1.1,
    },
    titleContainer: {
        paddingBottom: theme.spacing(2),
    },
    container: {
        paddingBottom: theme.spacing(1.5),
    },
});

const WeatherIcon = ({ classes, id }) => {
    switch (id) {
        case 0:
            return <img
                className={classes.smile}
                alt="logo-barbershop"
                width="65"
                height="65"
                src="https://www.barber-shop.ro/wp-content/uploads/2021/01/logo-png-dimensiuni.png"
            />;
        default:
            return null;
    }
};

// #FOLD_BLOCK
const CellBase = React.memo(({
    classes,
    startDate,
    formatDate,
    otherMonth,
    // #FOLD_BLOCK
}) => {
    const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 1);
    const isFirstMonthDay = startDate.getDate() === 1;
    const formatOptions = isFirstMonthDay
        ? { day: 'numeric', month: 'long' }
        : { day: 'numeric' };
    return (
        <TableCell
            tabIndex={0}
            className={classNames({
                [classes.cell]: true,
                [classes.smileBack]: iconId === 0,
                [classes.opacity]: otherMonth,
            })}
        >
            <div className={classes.content}>
                <WeatherIcon classes={classes} id={iconId} />
            </div>
            <div className={classes.text}>
                {formatDate(startDate, formatOptions)}
            </div>
        </TableCell>
    );
});

const TimeTableCell = withStyles(styles, { name: 'Cell' })(CellBase);

const Appointment = withStyles(styles, { name: 'Appointment' })(({ classes, ...restProps }) => (
    <Appointments.Appointment
        {...restProps}
        className={classes.appointment}
    />
));

const AppointmentContent = withStyles(styles, { name: 'AppointmentContent' })(({ classes, ...restProps }) => (
    <Appointments.AppointmentContent {...restProps} className={classes.apptContent} />
));

const FlexibleSpace = withStyles(styles, { name: 'ToolbarRoot' })(({ classes, ...restProps }) => (
    <Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}>
    </Toolbar.FlexibleSpace>
));

function Calendar(props) {

    const t = props.value;
    const [appointments, setAppointments] = useState([]);
    const [owners, setOwners] = useState([]);
    const [resources, setResources] = useState([]);
    const [barbers, setBarbers] = useState(undefined);
    const [selectedBarber, setSelectedBarber] = useState(undefined);
    const [isBarber, setIsBarber] = useState(false);
    const [appointment, setAppointment] = useState(undefined);
    const [show, setShow] = useState(false);
    const currentUser = AuthService.getCurrentUser();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setSelectedBarber(undefined);
    }, [props.language])

    const handleClose = () => {
        setShow(false);
    }

    const commitChanges = ({ deleted }) => {


        if (deleted !== undefined) {

            let startAppointment;

            appointments.map(appointment => {

                if (appointment.id === deleted) {

                    startAppointment = appointment.startDate;
                }
                return appointment;
            });


            if (startAppointment < Date.now()) {
                swalComponent(t('contact.status'), t('appointment.cantDelete'), "error");
            }

            else {

                Swal.fire({
                    input: 'text',
                    title: t('delete.title'),
                    text: t('delete.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#8B7871',
                    cancelButtonColor: '#d33',
                    confirmButtonText: t('delete.messageButton'),
                    inputValidator: (value) => {
                        if (!value) {
                            return t('delete.write');
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {

                        let appointment = {
                            id: deleted,
                            username: currentUser.username,
                            message: result.value,
                            language: localStorage.getItem('i18nextLng')
                        }

                        setAppointment(appointment);
                        setShow(true);

                    }
                })
            }

        }

    };

    const handleChangeBarber = (e) => {
        setSelectedBarber(e.value);

        if (e.value === currentUser.id) {
            setIsBarber(true);
        }
        else {
            setIsBarber(false);
        }

        setOwners([{
            text: e.label,
            id: e.value,
            color: '#A58B78'
        }]
        )
    }

    useEffect(() => {

        fetchData();

    }, [props.language]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {

        if (selectedBarber !== undefined) {

            setAppointments([]);

            API_APPOINTMENT.getCalendarForBarber(selectedBarber, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(element => {

                        setAppointments(prevArray => [...prevArray, {

                            id: element.id,
                            title: element.nameUser,
                            startDate: new Date(element.startAppointment),
                            endDate: new Date(element.endAppointment),
                            ownerId: element.barber_id

                        }]);

                        return element;
                    })

                    setResources([{
                        fieldName: 'ownerId',
                        title: 'Owners',
                        instances: owners,
                    }]);


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

    }, [selectedBarber]) // eslint-disable-line react-hooks/exhaustive-deps

    function fetchData() {

        setIsLoading(true);

        API_USERS.getBarbersPublic((result, status, error) => {
            setBarbers([]);
            if (result !== null && (status === 200 || status === 201)) {

                result.map(barber => {
                    setBarbers(oldArray => [...oldArray, { label: barber.name, value: barber.id }]);
                    return barber;
                });

                setIsLoading(false);


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

    const deleteAppointment = (data) => {

        API_APPOINTMENT.deleteAppointment(data, (result, status, error) => {

            if (result !== null && (status === 200 || status === 201)) {

                setAppointments(appointments.filter(appointment => appointment.id !== data.id));
                swalComponent(t('contact.status'), t('appointment.cancel'), "success");

            } else {
                console.log(status);
                console.log(error);

                if (status === 401) {
                    swalComponent(t('contact.status'), t('login.error'), "error");
                }
                else if (status === 402) {
                    swalComponent(t('contact.status'), t('appointment.dontExistAnymore'), "error");
                }
                else if (status === 403) {
                    swalComponent(t('contact.status'), t('appointment.errorUser'), "error");
                }
                else {

                    swalComponent(t('server.problem'), t('server.problem'), "error");
                }
            }
            if (status !== 401) {
                handleClose();
            }
        });

    }


    return (

        <div className="containerbig">
            <br />
            <div className="containerCalendar">
                <br />
                <div className="containerContact">
                    <label> {t("appointment.barber")} </label>
                    {!isLoading &&
                        <Select

                            name="form-dept-select"
                            options={barbers}
                            defaultValue={{ label: t('appointment.selectBarber'), value: 0 }}
                            onChange={handleChangeBarber}
                        />
                    }
                </div>

                <br />

                {selectedBarber &&
                    <Paper>
                        <Scheduler
                            data={appointments}
                        >

                            <ViewState
                                defaultCurrentDate={moment(Date.now()).format('YYYY-MM-DD')}
                            />

                            <EditingState
                                onCommitChanges={commitChanges}
                            />

                            <MonthView
                                timeTableCellComponent={TimeTableCell}
                                dayScaleCellComponent={DayScaleCell}
                            />

                            <Appointments
                                appointmentComponent={Appointment}
                                appointmentContentComponent={AppointmentContent}
                            />
                            <Resources
                                data={resources}
                            />

                            <Toolbar
                                flexibleSpaceComponent={FlexibleSpace}
                            />
                            <DateNavigator />

                            {isBarber &&
                                <EditRecurrenceMenu />
                            }
                            {isBarber ?
                                <AppointmentTooltip
                                    showCloseButton
                                    showDeleteButton
                                />
                                :
                                <AppointmentTooltip
                                    showCloseButton
                                />

                            }
                        </Scheduler>
                    </Paper>
                }
                <MyModal component={<OldPassword t={t} user={appointment} handleClose={handleClose} sendData={deleteAppointment} />} header={t('appointment.password')} show={show} handleClose={handleClose} />
            </div>
            <hr />

            <br />
        </div>

    );

}

export default Calendar;
