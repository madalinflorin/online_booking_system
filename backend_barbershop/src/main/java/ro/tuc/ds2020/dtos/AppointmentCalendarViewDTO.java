package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

public class AppointmentCalendarViewDTO extends RepresentationModel<AppointmentCalendarViewDTO> {

    private Long id;

    private Long barber_id;

    private Long user_id;

    private Date startAppointment;

    private Date endAppointment;

    @NotBlank
    @Size(max = 50)
    private String nameBarber;

    @NotBlank
    @Size(max = 50)
    private String nameUser;

    public AppointmentCalendarViewDTO() {
    }

    public AppointmentCalendarViewDTO(Long id, Long barber_id, Long user_id, Date startAppointment, Date endAppointment, String nameBarber, String nameUser) {
        this.id = id;
        this.barber_id = barber_id;
        this.user_id = user_id;
        this.startAppointment = startAppointment;
        this.endAppointment = endAppointment;
        this.nameBarber = nameBarber;
        this.nameUser = nameUser;

    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBarber_id() {
        return barber_id;
    }

    public void setBarber_id(Long barber_id) {
        this.barber_id = barber_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
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

    public String getNameBarber() {
        return nameBarber;
    }

    public void setNameBarber(String nameBarber) {
        this.nameBarber = nameBarber;
    }

    public String getNameUser() {
        return nameUser;
    }

    public void setNameUser(String nameUser) {
        this.nameUser = nameUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        AppointmentCalendarViewDTO appointmentDTO = (AppointmentCalendarViewDTO) o;
        return  Objects.equals(id, appointmentDTO.id) &&
                Objects.equals(barber_id, appointmentDTO.barber_id) &&
                Objects.equals(user_id, appointmentDTO.user_id) &&
                Objects.equals(startAppointment, appointmentDTO.startAppointment) &&
                Objects.equals(endAppointment, appointmentDTO.endAppointment) &&
                Objects.equals(nameBarber, appointmentDTO.nameBarber) &&
                Objects.equals(nameUser, appointmentDTO.nameUser);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, barber_id, user_id, startAppointment, endAppointment, nameBarber, nameUser);
    }

    @Override
    public String toString() {
        return "AppointmentDTO{" +
                "id=" + id +
                ", barber_id='" + barber_id + '\'' +
                ", user_id='" + user_id + '\'' +
                ", startAppointment='" + startAppointment + '\'' +
                ", endAppointment='" + endAppointment + '\'' +
                ", nameBarber='" + nameBarber + '\'' +
                ", nameUser='" + nameUser + '\'' +
                '}';
    }
}