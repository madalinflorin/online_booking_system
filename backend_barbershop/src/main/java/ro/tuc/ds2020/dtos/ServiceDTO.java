package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Objects;

public class ServiceDTO extends RepresentationModel<ServiceDTO> {

    private Long id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String nameRo;

    @NotBlank
    @Size(min = 3, max = 50)
    private String nameEn;

    @Min(value = 1, message = "Price must be greater or equal to 1")
    private float price;

    @Min(value = 10, message = "Duration must be greater or equal to 10")
    @Max(value = 60, message = "Duration must be lower or equal than 60")
    private Integer duration;

    final double THRESHOLD = .00001;


    public ServiceDTO() {
    }

    public ServiceDTO(Long id, String nameRo, String nameEn, float price, Integer duration) {
        this.id = id;
        this.nameRo = nameRo;
        this.nameEn = nameEn;
        this.price = price;
        this.duration = duration;
    }

    public ServiceDTO(String nameRo, String nameEn, float price, Integer duration) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        ServiceDTO serviceDTO = (ServiceDTO) o;
        return  Objects.equals(id, serviceDTO.id) &&
                Objects.equals(nameRo,serviceDTO.nameRo) &&
                Objects.equals(nameEn, serviceDTO.nameEn) &&
                Objects.equals(duration, serviceDTO.duration) &&
                Math.abs(price - serviceDTO.price) < THRESHOLD ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, nameRo, nameEn, price, duration);
    }

    @Override
    public String toString() {
        return "ServiceDTO{" +
                "id=" + id +
                ", nameRo='" + nameRo + '\'' +
                ", nameEn='" + nameEn + '\'' +
                ", price='" + price + '\'' +
                ", duration='" + duration +
                '}';
    }
}