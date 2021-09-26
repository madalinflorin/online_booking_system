import React from 'react';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'



function Footer() {

    const { t } = useTranslation();
    const x = {
        center: {
            lat: 46.766,
            lng: 23.6
        },
        zoom: 11
    };

    const AnyReactComponent = () => <div><FontAwesomeIcon icon={faMapMarkerAlt} /></div>;


    return (


        <div className="footer-dark">

            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-3 item">
                            <h3>{t('footer.firstH3')}</h3>
                            <ul>
                                <li><a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Hairstyle">{t('footer.firstA')}</a></li>
                                <li><a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Shaving">{t('footer.secondA')}</a></li>
                                <li><a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Head_shaving#:~:text=Head%20shaving%20is%20the%20practice,aesthetics%2C%20culture%2C%20and%20punishment.">{t('footer.thirdA')}</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 col-md-3 item">
                            <h3>{t('footer.secondH3')}</h3>
                            <ul>
                                <li><a href="/news">{t('footer.fourthA')}</a></li>
                                <li><a href="/barbers">{t('footer.fifthA')}</a></li>
                                <li><a href="/contact">{t('footer.sixthA')}</a></li>
                            </ul>
                        </div>
                        <div className="col-md-6 item text">
                            <h3>{t('footer.thirdH3')}</h3>
                            <p>{t('footer.firstP')}</p>
                        </div>

                        <div className="googlemaps" style={{ height: '25vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: 'AIzaSyDHC53bmRv5p5D6pqOBbe0Xo0QIkrOm0mQ' }}
                                defaultCenter={x.center}
                                defaultZoom={x.zoom}
                            >
                                <AnyReactComponent
                                    lat={46.766}
                                    lng={23.6}
                                />
                            </GoogleMapReact>
                        </div>

                        <div className="col item social"><a id="kag1" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/barbershopcluj"><i className="icon ion-social-facebook"></i></a><a id="kag2" target="_blank" rel="noopener noreferrer" href="https://twitter.com/barbershopcj"><i className="icon ion-social-twitter"></i></a><a id="kag2" target="_blank" rel="noopener noreferrer" href="https://story.snapchat.com/p/7689c7c7-6430-454c-91ef-ee10d9130d71/577360951982080"><i className="icon ion-social-snapchat"></i></a><a id="kag2" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/thebarbershopro/"><i className="icon ion-social-instagram"></i></a></div>
                    </div>

                    <p className="copyright">BarberSHOP © 2021</p>
                </div>
            </footer>
        </div >

    )

}

export default Footer;