import React, { useState, useEffect } from 'react';
import * as API_PROGRAM from "../commons/api/program-api";
import { swalComponent } from './Swal';


function Home(props) {

    const t = props.value;
    const [schedule, setSchedule] = useState([]);


    useEffect(() => {

        API_PROGRAM.getProgram((result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log(result);

                let values = [t('admin.sunday') + ": " + t('admin.free'), t('admin.monday') + ": " + t('admin.free'),t('admin.tuesday') + ": " + t('admin.free'), t('admin.wednesday') + ": " + t('admin.free'), t('admin.thursday') + ": " + t('admin.free'), t('admin.friday') + ": " + t('admin.free'),t('admin.saturday') + ": " + t('admin.free')];
                

                result.map(elem => {
                    if(elem.day===1) 
                    {
                        values[elem.day] = t('admin.monday') + ": " + elem.program;
                    }
                    else if(elem.day===2) 
                    {
                        values[elem.day] = t('admin.tuesday') + ": " + elem.program;
                    }
                    else if(elem.day===3){
                        values[elem.day] = t('admin.wednesday') + ": " + elem.program;
                    }
                    else if(elem.day===4){
                        values[elem.day] = t('admin.thursday') + ": " + elem.program;
                    }
                    else if(elem.day===5){
                        values[elem.day] = t('admin.friday') + ": " + elem.program;
                    }
                    else if(elem.day===6){
                        values[elem.day] = t('admin.saturday') + ": " + elem.program;
                    }
                    else if(elem.day === 0){
                        values[elem.day] = t('admin.sunday') + ": " + elem.program;
                    }
                    return elem;
                }
                );

                setSchedule(
                <ul className="dropdown-menu">
                               
                <li key={values[1]}>{values[1]}</li>
                <li key={values[2]}>{values[2]}</li>
                <li key={values[3]}>{values[3]}</li>
                <li key={values[4]}>{values[4]}</li>
                <li key={values[5]}>{values[5]}</li>
                <li key={values[6]}>{values[6]}</li>
                <li key={values[0]}>{values[0]}</li>
                
                </ul>);
                

            } else {
                console.log(status);
                console.log(error);
                swalComponent(t('server.problem'), t('server.problem'), "error");
            }
        });

        return () => {
            // Restore default value
            document.body.style.zoom = "100%"
        };

    }, [props.language]); // eslint-disable-line react-hooks/exhaustive-deps

    return (

        <section className="contentHomePage">

            <br/>

            <h2>{t('home.firstH2')}</h2>

            <hr />

            <table >
                <tbody>
                    <tr>
                        <td >

                            <img src="https://www.barbersociety.ro/wp-content/uploads/2018/01/barber_chair.png" alt="image1" width="550" height="550" />

                        </td>

                        <td>

                            <p>{t('home.firstP')}</p>

                            <img src="https://www.barbersociety.ro/wp-content/uploads/2018/01/pamatuf.png" alt="image1" width="650" height="300" />

                        </td>

                    </tr>

                </tbody>
            </table>


            <h2>{t('home.secondH2')}</h2>

            <hr />

            <p>{t('home.secondP')}</p>
            <p>{t('home.secondP1')}</p>
            <p>{t('home.secondP2')}</p>
            <p>{t('home.secondP3')}</p>
            <p>{t('home.secondP4')}</p>
            <p>{t('home.secondP5')}</p>
            <p>{t('home.secondP6')}</p>

            <hr />

            <table>

                <tbody>

                    <tr>
                        <td>
                            <iframe width="700"
                                height="500"
                                src="https://www.youtube.com/embed/pGUFIk906B0"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube">

                            </iframe>

                        </td>

                        <td>

                            <ul>
                                <li style={{paddingLeft: "200px"}}><img className="icon" src="https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/66-512.png" alt="icon1" height="30" width="30" />{t('home.firstLI')}</li>
                                <li style={{paddingLeft: "200px"}}><br /></li>
                                <li style={{paddingLeft: "200px"}}><img className="icon" src="data:image/png;base64,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" alt="icon1" height="30" width="30" /> 0763 270 009</li>
                                <li><br /></li>
                                <div className="dropdown"><li style={{paddingLeft: "200px"}}><img className="icon" src="https://www.pngkit.com/png/detail/265-2652350_file-feedbin-icon-calendar-svg-wikimedia-commons-blue.png" alt="icon1" height="30" width="30" />
                                    <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">{t('home.schedule')}
                                    <span className="caret"></span></button>
                                    {schedule}
                                </li>
                                </div>
                                <li style={{paddingLeft: "200px"}}><br /></li>
                                <li style={{paddingLeft: "200px"}}><img className="icon" src="data:image/jpeg;base64,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" alt="icon1" height="30" width="30" /> office@barbershop.ro</li>
                            </ul>

                        </td>

                    </tr>

                </tbody>
            </table>

            <hr />
            <br />

        </section>

    )

}

export default Home;