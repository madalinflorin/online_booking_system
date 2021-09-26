package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

public class AppointmentDTO extends RepresentationModel<AppointmentDTO> {

    private Long id;

    private Long barber_id;

    private Long user_id;

    private Date startAppointment;

    private Date endAppointment;

    private List<Integer> services_id = new ArrayList<>();

    private Set<ServiceDTO> services;

    private Long package_id;

    private String language;

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String message;

    private float price;

    final double THRESHOLD = .00001;

    public AppointmentDTO() {
    }

    public AppointmentDTO(Long id, Long barber_id, Long user_id, Date startAppointment, Date endAppointment, List<Integer> services_id, Long package_id, String username, String password, float price) {
        this.id = id;
        this.barber_id = barber_id;
        this.user_id = user_id;
        this.startAppointment = startAppointment;
        this.endAppointment = endAppointment;
        this.services_id = services_id;
        this.package_id = package_id;
        this.username = username;
        this.password = password;
        this.price = price;

    }

    public AppointmentDTO(Long id, Long barber_id, Long user_id, Date startAppointment, Date endAppointment, Set<ServiceDTO> services, float price) {
        this.id = id;
        this.barber_id = barber_id;
        this.user_id = user_id;
        this.startAppointment = startAppointment;
        this.endAppointment = endAppointment;
        this.services = services;
        this.price = price;

    }

    public AppointmentDTO(Long id, Long barber_id, Long user_id, Date startAppointment, Date endAppointment, List<Integer> services_id, Long package_id, String username, String password, float price, String language) {
        this.id = id;
        this.barber_id = barber_id;
        this.user_id = user_id;
        this.startAppointment = startAppointment;
        this.endAppointment = endAppointment;
        this.services_id = services_id;
        this.package_id = package_id;
        this.username = username;
        this.password = password;
        this.price = price;
        this.language = language;

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

    public List<Integer> getServices_Id() {
        return services_id;
    }

    public void setServices(List<Integer> services_id) {
        this.services_id = services_id;
    }

    public Long getPackage_id() {
        return package_id;
    }

    public void setPackage_id(Long package_id) {
        this.package_id = package_id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage(){
        return message;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        AppointmentDTO appointmentDTO = (AppointmentDTO) o;
        return  Objects.equals(id, appointmentDTO.id) &&
                Objects.equals(barber_id, appointmentDTO.barber_id) &&
                Objects.equals(user_id, appointmentDTO.user_id) &&
                Objects.equals(package_id, appointmentDTO.package_id) &&
                Objects.equals(startAppointment, appointmentDTO.startAppointment) &&
                Objects.equals(endAppointment, appointmentDTO.endAppointment) &&
                Objects.equals(services_id, appointmentDTO.services_id) &&
                Objects.equals(services, appointmentDTO.services) &&
                Objects.equals(username, appointmentDTO.username) &&
                Objects.equals(password, appointmentDTO.password) &&
                Objects.equals(language, appointmentDTO.language) &&
                Objects.equals(message, appointmentDTO.message) &&
                Math.abs(price - appointmentDTO.price) < THRESHOLD ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, barber_id, user_id, startAppointment, endAppointment, services_id, services, package_id, username, password, price, language, message);
    }

    @Override
    public String toString() {
        return "AppointmentDTO{" +
                "id=" + id +
                ", barber_id='" + barber_id + '\'' +
                ", user_id='" + user_id + '\'' +
                ", startAppointment='" + startAppointment + '\'' +
                ", endAppointment='" + endAppointment + '\'' +
                ", services_id='" + services_id.toString() + '\'' +
                ", services='" + services.toString() + '\'' +
                ", package_id='" + package_id + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", language='" + language + '\'' +
                ", price='" + price + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}