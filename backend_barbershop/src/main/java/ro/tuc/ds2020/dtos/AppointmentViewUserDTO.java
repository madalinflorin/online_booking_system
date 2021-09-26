package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;
import java.util.*;

public class AppointmentViewUserDTO extends RepresentationModel<AppointmentViewUserDTO> {

    private Long id;

    private String nameBarber;

    private Date startAppointment;

    private Set<ServiceDTO> services;

    private float price;

    final double THRESHOLD = .00001;

    public AppointmentViewUserDTO() {
    }

    public AppointmentViewUserDTO(Long id, String nameBarber,Date startAppointment, Set<ServiceDTO> services, float price) {
        this.id = id;
        this.nameBarber = nameBarber;
        this.startAppointment = startAppointment;
        this.services = services;
        this.price = price;

    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameBarber() {
        return nameBarber;
    }

    public void setNameBarber(String nameBarber) {
        this.nameBarber = nameBarber;
    }

    public Date getStartAppointment() {
        return startAppointment;
    }

    public void setStartAppointment(Date startAppointment) {
        this.startAppointment = startAppointment;
    }

    public Set<ServiceDTO> getServices() {
        return services;
    }

    public void setServices(Set<ServiceDTO> services) {
        this.services = services;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        AppointmentViewUserDTO appointmentDTO = (AppointmentViewUserDTO) o;
        return  Objects.equals(id, appointmentDTO.id) &&
                Objects.equals(nameBarber, appointmentDTO.nameBarber) &&
                Objects.equals(startAppointment, appointmentDTO.startAppointment) &&
                Objects.equals(services, appointmentDTO.services) &&
                Math.abs(price - appointmentDTO.price) < THRESHOLD ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, nameBarber, startAppointment, services, price);
    }

    @Override
    public String toString() {
        return "AppointmentViewUserDTO{" +
                "id=" + id +
                ", nameBarber='" + nameBarber + '\'' +
                ", startAppointment='" + startAppointment + '\'' +
                ", services='" + services.toString() + '\'' +
                ", price='" + price + '\'' +
                '}';
    }
}