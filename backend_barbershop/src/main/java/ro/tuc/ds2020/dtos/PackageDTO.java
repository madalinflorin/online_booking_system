package ro.tuc.ds2020.dtos;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.*;

public class PackageDTO extends RepresentationModel<PackageDTO> {

    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String nameRo;

    @NotBlank
    @Size(min = 3, max = 50)
    private String nameEn;


    private Date startValidityPeriod;

    private Date endValidityPeriod;

    @Min(value = 0, message = "Discount must be greater or equal to 0")
    private float discount;

    private Date startDiscountPeriod;

    private Date endDiscountPeriod;

    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    List<Integer> services_id = new ArrayList<>();

    private Set<ServiceDTO> services = new HashSet<>();

    final double THRESHOLD = .00001;


    public PackageDTO() {
    }

    public PackageDTO(Long id, String nameRo, String nameEn, Date startValidityPeriod, Date endValidityPeriod, float discount, Date startDiscountPeriod, Date endDiscountPeriod, Set<ServiceDTO> services) {
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

    public PackageDTO(Long id, String nameRo, String nameEn, Date startValidityPeriod, Date endValidityPeriod, float discount, Date startDiscountPeriod, Date endDiscountPeriod, List<Integer> services_id) {
        this.id = id;
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.startValidityPeriod = startValidityPeriod;
        this.endValidityPeriod = endValidityPeriod;
        this.discount = discount;
        this.startDiscountPeriod = startDiscountPeriod;
        this.endDiscountPeriod = endDiscountPeriod;
        this.services_id = services_id;
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

    public void setDiscount(float disccount) {
        this.discount = disccount;
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


    public Set<ServiceDTO> getServices() {
        return services;
    }

    public void setServices(Set<ServiceDTO> services) {
        this.services = services;
    }

    public List<Integer> getServices_id(){
        return services_id;
    }

    public void setServices_id(List<Integer> services_id){
        this.services_id = services_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        PackageDTO packageDTO = (PackageDTO) o;
        return  Objects.equals(id, packageDTO.id) &&
                Objects.equals(nameRo,packageDTO.nameRo) &&
                Objects.equals(nameEn,packageDTO.nameEn) &&
                Objects.equals(startValidityPeriod, packageDTO.startValidityPeriod) &&
                Objects.equals(endValidityPeriod, packageDTO.endValidityPeriod) &&
                Objects.equals(startDiscountPeriod, packageDTO.startDiscountPeriod) &&
                Objects.equals(services, packageDTO.services) &&
                Objects.equals(services_id, packageDTO.services_id) &&
                Math.abs(discount - packageDTO.discount) < THRESHOLD ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, nameRo, nameEn, startValidityPeriod, endValidityPeriod, discount, startDiscountPeriod, endDiscountPeriod, services, services_id);
    }

    @Override
    public String toString() {
        return "PackageDTO{" +
                "id=" + id +
                ", nameRo='" + nameRo + '\'' +
                ", nameEn='" + nameEn + '\'' +
                ", startValidityPeriod='" + startValidityPeriod + '\'' +
                ", endValidityPeriod='" + endValidityPeriod + '\'' +
                ", discount='" + discount + '\'' +
                ", startDiscountPeriod ='" + startDiscountPeriod + '\'' +
                ", endDiscountPeriod='" + endDiscountPeriod + '\'' +
                ", services='" + services.toString() + '\'' +
                ", services_id='" + services_id.toString() + '\'' +
                '}';
    }

}