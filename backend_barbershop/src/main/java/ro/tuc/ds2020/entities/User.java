package ro.tuc.ds2020.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(	name = "users", 
		uniqueConstraints = {
			@UniqueConstraint(columnNames = "username"),
			@UniqueConstraint(columnNames = "email")
		})


public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	@Size(max = 20)
	private String username;

	@NotBlank
	@Size(max = 50)
	@Email
	private String email;

	@NotBlank
	@Size(max = 120)
	private String password;

	@NotBlank
	@Size(max = 50)
	private String name;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthDate;

	private char gender;

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
	@Size(max = 999)
	private String photo;

	private boolean activate;


	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(	name = "user_roles",
				joinColumns = @JoinColumn(name = "user_id"),
				inverseJoinColumns = @JoinColumn(name = "role_id"))



	private Set<Role> roles = new HashSet<>();

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "barber_services",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "service_id"))

	private Set<Services> services = new HashSet<>();

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "barber_packages",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "package_id"))

	private Set<PackagePromotional> packages = new HashSet<>();

	@OneToMany(mappedBy="user", fetch=FetchType.EAGER, cascade= {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval=true)
	private Set<Program> programs = new HashSet<>();

	@OneToMany(mappedBy="user", cascade= {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval=true)
	private Set<Messages> messages = new HashSet<>();


	private Integer nrAppointments = 0;

	private Date timeForFirstAppointmentOfTheDay;

	private Date expiryDate;


	public User() {
	}

	public User(String username, String email, String password, String name, Date birthDate, char gender, String country, String state, String city, String photo) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.name = name;
		this.birthDate = birthDate;
		this.gender = gender;
		this.country = country;
		this.state = state;
		this.city = city;
		this.photo = photo;
		this.activate = false;
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


	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public boolean isActivate() {
		return activate;
	}

	public void setActivate(boolean activate) {
		this.activate = activate;
	}

	public Set<Services> getServices() {
		return services;
	}

	public void setServices(Set<Services> services) {
		this.services = services;
	}

	public Set<PackagePromotional> getPackages() {
		return packages;
	}

	public void setPackages(Set<PackagePromotional> packages) {
		this.packages = packages;
	}

	public Set<Program> getPrograms() {
		return programs;
	}

	public void setPrograms(Set<Program> programs) {
		this.programs = programs;
	}


	public Set<Messages> getMessages() {
		return messages;
	}

	public void setMessages(Set<Messages> messages) {
		this.messages = messages;
	}

	public Integer getNrAppointments() {
		return nrAppointments;
	}

	public void setNrAppointments(Integer nrAppointments) {
		this.nrAppointments = nrAppointments;
	}

	public Date getTimeForFirstAppointmentOfTheDay() {
		return timeForFirstAppointmentOfTheDay;
	}

	public void setTimeForFirstAppointmentOfTheDay(Date timeForFirstAppointmentOfTheDay) {
		this.timeForFirstAppointmentOfTheDay = timeForFirstAppointmentOfTheDay;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}
}
