package ro.tuc.ds2020.entities;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "services")
public class Services implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "name_ro")
    private String nameRo;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "price")
    private float price;

    @Column(name = "duration")
    @Min(value = 10, message = "Duration can't be less than 10 or bigger than 60")
    @Max(value = 60, message = "Duration can't be greater than 10 or bigger than 60")
    private Integer duration;

    @ManyToMany(mappedBy = "services", cascade = {CascadeType.MERGE, CascadeType.PERSIST,CascadeType.REFRESH})
    private Set<PackagePromotional> packages = new HashSet<>();

    @ManyToMany(mappedBy = "services", cascade = {CascadeType.MERGE, CascadeType.PERSIST,CascadeType.REFRESH})
    private Set<Appointment> appointments = new HashSet<>();

    @ManyToMany(mappedBy = "services", fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST,CascadeType.REFRESH})
    private Set<User> barbers = new HashSet<>();


    public Services(){

    }

    public Services(String nameRo, String nameEn, float price, Integer duration){
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.price = price;
        this.duration = duration;
    }

    public Services(Long id, String nameRo, String nameEn, float price, Integer duration){
        this.id = id;
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.price = price;
        this.duration = duration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameRo() {
        return nameRo;
    }

    public void setNameRo(String nameRo) {
        this.nameRo = nameRo;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Set<PackagePromotional> getPackages() {
        return packages;
    }

    public void setPackages(Set<PackagePromotional> packages) {
        this.packages = packages;
    }

    public Set<User> getBarbers() {
        return barbers;
    }

    public void setBarbers(Set<User> barbers) {
        this.barbers = barbers;
    }

    @PreRemove
    private void removeServicesFromPackageAndFromBarberAndFromAppointments() {
        for (PackagePromotional u : packages) {
            u.getServices().remove(this);
        }

        for (User u : barbers) {
            u.getServices().remove(this);
        }

        for (Appointment u : appointments) {
            u.getServices().remove(this);
        }

    }

}