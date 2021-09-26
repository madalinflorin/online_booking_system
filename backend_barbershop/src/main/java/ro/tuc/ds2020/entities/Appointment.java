package ro.tuc.ds2020.entities;


import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(	name = "appointment",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"start_appointment", "user_id", "barber_id"})
        })


public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_appointment")
    private Date startAppointment;

    @Column(name = "end_appointment")
    private Date endAppointment;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "barber_id")
    private User barber;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinTable(name = "appointment_services",
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))

    private Set<Services> services = new HashSet<>();

    private float price;

    public Appointment() {
    }

    public Appointment(Date startAppointment, Date endAppointment, User user, User barber, float price) {
        this.startAppointment = startAppointment;
        this.endAppointment = endAppointment;
        this.user = user;
        this.barber = barber;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getStartAppointment() {
        return startAppointment;
    }

    public void setStartAppointment(Date startAppointment) {
        this.startAppointment = startAppointment;
    }

    public Date getEndAppointment() {
        return endAppointment;
    }

    public void setEndAppointment(Date endAppointment) {
        this.endAppointment = endAppointment;
    }

    public User getBarber() {
        return barber;
    }

    public void setBarber(User barber) {
        this.barber = barber;
    }

    public Set<Services> getServices() {
        return services;
    }

    public void setServices(Set<Services> services) {
        this.services = services;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }


}
