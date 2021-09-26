package ro.tuc.ds2020.payload.request;

import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;
import java.util.Set;
 
public class SignupRequest {

    private Long id;

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
 
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
    
    private Set<String> role;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password_confirmation;

    @Size(min = 6, max = 40)
    private String newPassword;

    @NotBlank
    @Size(min = 3, max = 50)
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

    @NotBlank
    @Size(max = 50)
    private String subject;

    @NotBlank
    @Size(max = 999)
    private String message;

    private List<Integer> days_id;

    private List<Date> start_id;

    private List<Date> end_id;

    private List<Integer> services_id;

    private List<Integer> packages_id;

    public SignupRequest(){

    }

    public SignupRequest(String username, String email, String password, String password_confirmation, String name, Date birth_date, char gender, String country, String state, String city, String photo, Set<String> role, String subject, String message, List<Integer> days_id, List<Date> start_id, List<Date> end_id, List<Integer> service_id, List<Integer> packages_id){
        this.username = username;
        this.email = email;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.role = role;
        this.name = name;
        this.birthDate = birth_date;
        this.gender = gender;
        this.country = country;
        this.state = state;
        this.city = city;
        this.photo = photo;
        this.subject = subject;
        this.message = message;
        this.days_id = days_id;
        this.start_id = start_id;
        this.end_id = end_id;
        this.services_id = service_id;
        this.packages_id = packages_id;

    }

    public SignupRequest(Long id,String username, String email, String password, String password_confirmation, String newPassword, String name, Date birth_date, char gender, String country, String state, String city, String photo, Set<String> role, String subject, String message, List<Integer> days_id, List<Date> start_id, List<Date> end_id, List<Integer> service_id, List<Integer> packages_id){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.newPassword = newPassword;
        this.role = role;
        this.name = name;
        this.birthDate = birth_date;
        this.gender = gender;
        this.country = country;
        this.state = state;
        this.city = city;
        this.photo = photo;
        this.subject = subject;
        this.message = message;
        this.days_id = days_id;
        this.start_id = start_id;
        this.end_id = end_id;
        this.services_id = service_id;
        this.packages_id = packages_id;

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

    public String getPassword_confirmation() {
        return password_confirmation;
    }

    public void setPassword_confirmation(String password_confirmation) {
        this.password_confirmation = password_confirmation;
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

    public void setGender(char gender) {
        this.gender = gender;
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

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Set<String> getRole() {
        return this.role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<Integer> getDays_id() {
        return days_id;
    }

    public void setDays_id(List<Integer> days_id) {
        this.days_id = days_id;
    }

    public List<Date> getStart_id() {
        return start_id;
    }

    public void setStart_id(List<Date> start_id) {
        this.start_id = start_id;
    }

    public List<Date> getEnd_id() {
        return end_id;
    }

    public void setEnd_id(List<Date> end_id) {
        this.end_id = end_id;
    }

    public List<Integer> getServices_id() {
        return services_id;
    }

    public void setServices_id(List<Integer> services_id) {
        this.services_id = services_id;
    }

    public List<Integer> getPackages_id() {
        return packages_id;
    }

    public void setPackages_id(List<Integer> packages_id) {
        this.packages_id = packages_id;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
