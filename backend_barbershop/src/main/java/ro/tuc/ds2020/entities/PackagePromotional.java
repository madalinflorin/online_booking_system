package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "packages")
public class PackagePromotional implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "name_ro")
    private String nameRo;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "start_validity_period")
    private Date startValidityPeriod;

    @Column(name = "end_validity_period")
    private Date endValidityPeriod;

    @Column(name = "discount")
    private float discount;

    @Column(name = "start_discount_period")
    private Date startDiscountPeriod;

    @Column(name = "end_discount_period")
    private Date endDiscountPeriod;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinTable(name = "package_products",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))

    private Set<Services> services = new HashSet<>();

    @ManyToMany(mappedBy = "packages", fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST,CascadeType.REFRESH})
    private Set<User> barbers = new HashSet<>();


    public PackagePromotional(){

    }

    public PackagePromotional(Long id, String nameRo, String nameEn, Date startValidityPeriod, Date endValidityPeriod, float discount, Date startDiscountPeriod, Date endDiscountPeriod, Set<Services> services){
        this.id = id;
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.startValidityPeriod = startValidityPeriod;
        this.endValidityPeriod = endValidityPeriod;
        this.discount = discount;
        this.startDiscountPeriod = startDiscountPeriod;
        this.endDiscountPeriod = endDiscountPeriod;
        this.services = services;
    }

    public PackagePromotional(String nameRo, String nameEn, Date startValidityPeriod, Date endValidityPeriod, float discount, Date startDiscountPeriod, Date endDiscountPeriod){
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.startValidityPeriod = startValidityPeriod;
        this.endValidityPeriod = endValidityPeriod;
        this.discount = discount;
        this.startDiscountPeriod = startDiscountPeriod;
        this.endDiscountPeriod = endDiscountPeriod;
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

    public Date getStartValidityPeriod() {
        return startValidityPeriod;
    }

    public void setStartValidityPeriod(Date startValidityPeriod) {
        this.startValidityPeriod = startValidityPeriod;
    }

    public Date getEndValidityPeriod() {
        return endValidityPeriod;
    }

    public void setEndValidityPeriod(Date endValidityPeriod) {
        this.endValidityPeriod = endValidityPeriod;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public Date getStartDiscountPeriod() {
        return startDiscountPeriod;
    }

    public void setStartDiscountPeriod(Date startDiscountPeriod) {
        this.startDiscountPeriod = startDiscountPeriod;
    }

    public Date getEndDiscountPeriod() {
        return endDiscountPeriod;
    }

    public void setEndDiscountPeriod(Date endDiscountPeriod) {
        this.endDiscountPeriod = endDiscountPeriod;
    }

    public Set<Services> getServices() {
        return services;
    }

    public void setServices(Set<Services> services) {
        this.services = services;
    }

    public Set<User> getBarbers() {
        return barbers;
    }

    public void setBarbers(Set<User> barbers) {
        this.barbers = barbers;
    }

    @PreRemove
    private void removePackagesFromBarber() {
        for (User u : barbers) {
            u.getPackages().remove(this);
        }
    }
}