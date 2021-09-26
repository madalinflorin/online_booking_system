package ro.tuc.ds2020.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.RepresentationModel;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class BarberDTO extends RepresentationModel<BarberDTO> {

    private Long id;

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String name;

    @DateTimeFormat(pattern = "yyyy-MM-dd")

    private Date birthDate;

    private char gender;

    @NotBlank
    private String photo;

    @NotBlank
    @Size(max = 56)

    private String country;

    @NotBlank
    @Size(max = 56)

    private String state;

    @NotBlank
    @Size(max = 85)

    private String city;

    private Set<ServiceDTO> services = new HashSet<>();

    private Set<PackageDTO> packages = new HashSet<>();

    private Set<ProgramDTO> programs = new HashSet<>();

    private Set<RoleDTO> role = new HashSet<>();


    public BarberDTO() {
    }

    public BarberDTO(Long id, String username, String name, String email, String password, Date birthDate, char gender, String photo, String country, String state, String city, Set<ServiceDTO> services, Set<PackageDTO> packages, Set<ProgramDTO> programs, Set<RoleDTO> role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.gender = gender;
        this.photo = photo;
        this.country = country;
        this.state = state;
        this.city = city;
        this.services = services;
        this.packages = packages;
        this.programs = programs;
        this.role = role;
    }

    public BarberDTO(Long id, String username, String name, String email, Date birthDate, char gender, String photo, String country, String state, String city, Set<ServiceDTO> services, Set<PackageDTO> packages, Set<ProgramDTO> programs, Set<RoleDTO> role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.photo = photo;
        this.country = country;
        this.state = state;
        this.city = city;
        this.services = services;
        this.packages = packages;
        this.programs = programs;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public char getGender() {
        return gender;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Set<ServiceDTO> getServices() {
        return services;
    }

    public void setServices(Set<ServiceDTO> services) {
        this.services = services;
    }

    public Set<PackageDTO> getPackages() {
        return packages;
    }

    public void setPackages(Set<PackageDTO> packages) {
        this.packages = packages;
    }

    public Set<ProgramDTO> getPrograms() {
        return programs;
    }

    public void setPrograms(Set<ProgramDTO> programs) {
        this.programs = programs;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        BarberDTO userDTO = (BarberDTO) o;
        return  Objects.equals(id, userDTO.id) &&
                Objects.equals(username, userDTO.username) &&
                Objects.equals(name, userDTO.name) &&
                Objects.equals(email, userDTO.email) &&
                Objects.equals(password, userDTO.password) &&
                Objects.equals(birthDate, userDTO.birthDate) &&
                gender == userDTO.gender &&
                Objects.equals(photo, userDTO.photo) &&
                Objects.equals(country, userDTO.country) &&
                Objects.equals(state, userDTO.state) &&
                Objects.equals(city, userDTO.city) &&
                Objects.equals(services, userDTO.services) &&
                Objects.equals(packages, userDTO.packages) &&
                Objects.equals(programs, userDTO.programs) &&
                Objects.equals(role, userDTO.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, username, name, email, password, birthDate, gender, photo, country, state, city, services, packages, programs, role);
    }

    @Override
    public String toString() {
        return "BarberDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", birthDate='" + birthDate + '\'' +
                ", gender=" + gender + '\'' +
                ", photo=" + photo + '\'' +
                ", country=" + country + '\'' +
                ", state=" + state + '\'' +
                ", city=" + city + '\'' +
                ", services=" + services.toString() + '\'' +
                ", packages=" + packages.toString() + '\'' +
                ", programs=" + programs.toString() + '\'' +
                '}';
    }

    public Set<RoleDTO> getRole() {
        return role;
    }

    public void setRole(Set<RoleDTO> role) {
        this.role = role;
    }
}