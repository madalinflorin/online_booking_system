import React from 'react';
import '../commons/styles/aboutus.css';

function AboutUs(props) {

    const t = props.value;

    return (

        <section className="despre">

            <br/>

            <h2>{t('about_us.firstH2')}</h2>
            <hr />
            <p>{t('about_us.firstP')}</p>
            <p>{t('about_us.firstP1')}</p>
            <p>{t('about_us.firstP2')}</p>
            <br />
            <h2>{t('about_us.secondH2')}</h2>
            <br />

            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                <ol className="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
                </ol>
                
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/23bw-400x284.jpg" alt="First slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/ART_0028-400x284.jpg" alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/ART_0035-400x284.jpg" alt="Third slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/DSC00837-400x284.jpg" alt="Fourth slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/DSC06931-400x284.jpg" alt="Fifth slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://www.barber-shop.ro/wp-content/uploads/2021/01/DSC07144-400x284.jpg" alt="Sixth slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>


            <hr />
            <br />

        </section>

    )

}

export default AboutUs;