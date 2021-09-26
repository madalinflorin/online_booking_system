import React, { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import moment from 'moment';
import Select from 'react-select';
import * as API_GRAPHIC from "../commons/api/graphic-api";
import { swalComponent } from './Swal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";


function Graphic(props) {

    const t = props.value;
    const [data, setData] = useState({});
    const values = [{ label: t('graphic.currentMonth'), value: 1 }, { label: t('graphic.currentYear'), value: 2 }, { label: t('graphic.country'), value: 3 }, { label: t('graphic.state'), value: 4 }, { label: t('graphic.city'), value: 5 }, { label: t('graphic.gender'), value: 6 }, { label: t('graphic.month'), value: 7 }, { label: t('graphic.year'), value: 8 }];
    const [selectedValue, setSelectedValue] = useState(1);
    const months = [t('graphic.january'), t('graphic.february'), t('graphic.march'), t('graphic.april'), t('graphic.may'), t('graphic.june'), t('graphic.july'), t('graphic.august'), t('graphic.september'), t('graphic.october'), t('graphic.november'), t('graphic.december')];
    const [startDate, setStartDate] = useState(new Date());
    const history = useHistory();
    const [options, setOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [defaultLabel, setDefaultLabel] = useState({ label: t('graphic.currentMonth'), value: 1 });
    

    useEffect(() => {

        setIsLoading(true);

        const min = 0;
        const max = 255;
        let listDate = [];
        let listValues = [];
        let colorBackgrounds = [];
        let colorBorders = [];
        let colorBackground;
        let colorBorder;

        if (selectedValue === 1) {

            setDefaultLabel({ label: t('graphic.currentMonth'), value: 1 });
            const date = new Date();
            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth() === 11 ? 1 : date.getMonth() + 1;
            const numberDaysOfCurrentMonth = daysInMonth(currentMonth, currentYear);

            API_GRAPHIC.getGraphicForCurrentMonth(currentMonth, currentYear, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    for (let currentDay = 1; currentDay <= numberDaysOfCurrentMonth; currentDay++) {
                        let count = 0;
                        const varDate = moment(new Date(currentYear, currentMonth - 1, currentDay)).format('DD-MM-YYYY');
                        result.map(element => {
                            if (element.date === varDate) {
                                count = element.counter;
                            }
                            return element;
                        })

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = [...listDate, varDate];
                        listValues = [...listValues, count];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                    }

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendCurrentMonth'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.currentMonth')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 2) {

            const date = new Date();
            const currentYear = date.getFullYear();
            setDefaultLabel({ label: t('graphic.currentYear'), value: 2 });

            API_GRAPHIC.getGraphicForCurrentYear(currentYear, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    result.months_counter.map(m => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = months;
                        listValues = [...listValues, m];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return m;

                    });


                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendCurrentYear'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.currentYear')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 3) {

            setDefaultLabel({ label: t('graphic.country'), value: 3 });
            API_GRAPHIC.getGraphicForCountries((result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(element => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = [...listDate, element.date];
                        listValues = [...listValues, element.counter];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return element;
                    });

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendCountry'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.country')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 4) {

            setDefaultLabel({ label: t('graphic.state'), value: 4 });
            API_GRAPHIC.getGraphicForStates((result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(element => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = [...listDate, element.date];
                        listValues = [...listValues, element.counter];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return element;
                    });

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendState'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.state')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 5) {

            setDefaultLabel({ label: t('graphic.city'), value: 5 });
            API_GRAPHIC.getGraphicForCities((result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(element => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = [...listDate, element.date];
                        listValues = [...listValues, element.counter];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return element;
                    });

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendCity'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.city')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 6) {

            setDefaultLabel({ label: t('graphic.gender'), value: 6 });
            API_GRAPHIC.getGraphicForGender((result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {
                    result.map(element => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = element.date === "M" ? [...listDate, t('graphic.genderM')] : [...listDate, t('graphic.genderF')];
                        listValues = [...listValues, element.counter];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return element;
                    });

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendGender'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.gender')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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

        else if (selectedValue === 7) {
            const currentYear = startDate.getFullYear();
            const currentMonth = startDate.getMonth() === 11 ? 1 : startDate.getMonth() + 1;
            const numberDaysOfCurrentMonth = daysInMonth(currentMonth, currentYear);

            setDefaultLabel({ label: t('graphic.month'), value: 7 });
            API_GRAPHIC.getGraphicForCurrentMonth(currentMonth, currentYear, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    for (let currentDay = 1; currentDay <= numberDaysOfCurrentMonth; currentDay++) {
                        let count = 0;
                        const varDate = moment(new Date(currentYear, currentMonth - 1, currentDay)).format('DD-MM-YYYY');
                        result.map(element => {
                            if (element.date === varDate) {
                                count = element.counter;
                            }
                            return element;
                        })

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = [...listDate, varDate];
                        listValues = [...listValues, count];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                    }

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendMonth'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.month')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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
        else if (selectedValue === 8) {

            setDefaultLabel({ label: t('graphic.year'), value: 8 });
            const currentYear = startDate.getFullYear();

            API_GRAPHIC.getGraphicForCurrentYear(currentYear, (result, status, error) => {
                if (result !== null && (status === 200 || status === 201)) {

                    result.months_counter.map(m => {

                        while (true) {
                            const r = Math.floor(min + Math.random() * (max - min));
                            const g = Math.floor(min + Math.random() * (max - min));
                            const b = Math.floor(min + Math.random() * (max - min));
                            colorBackground = 'rgba(' + r + ',' + g + ',' + b + ',' + 0.2 + ')';
                            colorBorder = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')';
                            if (Math.abs(r - g) > 5 && Math.abs(g - b) > 5 && Math.abs(b - r)) break;
                        }

                        listDate = months;
                        listValues = [...listValues, m];
                        colorBackgrounds = [...colorBackgrounds, colorBackground];
                        colorBorders = [...colorBorders, colorBorder];

                        return m;

                    });

                    setData({
                        labels: listDate,
                        datasets: [
                            {
                                label: t('graphic.legendYear'),
                                data: listValues,
                                backgroundColor: colorBackgrounds,
                                borderColor: colorBorders,
                                borderWidth: 1
                            }
                        ]
                    });

                    setOptions({
                        title: {
                            display: true,
                            text: t('graphic.year')
                        },
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    },
                                },
                            ],
                        },
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

    }, [selectedValue, startDate, props.language]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChangeValue = (e) => {
        setSelectedValue(e.value);
        if (e.value !== 7 || e.value !== 8) {
            setStartDate(new Date());
        }
    }

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    }

    return (

        <div className="containerbig">
            <br />
            <div className="containerCalendar">
                <br />
                <div className="containerContact">
                    <label> {t("graphic.select")} </label>
                    {!isLoading &&
                        <Select

                            name="form-dept-select"
                            options={values}
                            defaultValue={defaultLabel}
                            onChange={handleChangeValue}
                        />
                    }

                    {selectedValue === 7 &&

                        <div>
                            <label> {t("graphic.monthAndYear")} </label>

                            {" "}

                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                showFullMonthYearPicker
                            />
                        </div>
                    }
                    {selectedValue === 8 &&
                        <div>

                            <label> {t("graphic.onlyYear")} </label>

                            {" "}
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showYearPicker
                                dateFormat="yyyy"
                            />
                        </div>
                    }
                </div>
                <br />
                <div style={{ backgroundColor: 'white', color: 'black' }}>
                    <Bar data={data} options={options} />
                </div>
                <br />

            </div>
            <hr />

            <br />
        </div>


    );
}

export default Graphic;
