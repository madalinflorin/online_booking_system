package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class BarberViewDTO extends RepresentationModel<BarberViewDTO> {

    private Long id;

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    private String photo;

    private Set<ServiceDTO> services = new HashSet<>();

    private Set<PackageDTO> packages = new HashSet<>();


    public BarberViewDTO() {
    }


    public BarberViewDTO(Long id, String name, String photo, Set<ServiceDTO> services, Set<PackageDTO> packages) {

        this.id = id;
        this.name = name;
        this.photo = photo;
        this.services = services;
        this.packages = packages;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        BarberViewDTO userDTO = (BarberViewDTO) o;
        return  Objects.equals(id, userDTO.id) &&
                Objects.equals(name, userDTO.name) &&
                Objects.equals(photo, userDTO.photo) &&
                Objects.equals(services, userDTO.services) &&
                Objects.equals(packages, userDTO.packages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, name,  photo, services, packages);
    }

    @Override
    public String toString() {
        return "BarberDTO{" +
                "id=" + id + '\'' +
                ", name=" + name + '\'' +
                ", photo=" + photo + '\'' +
                ", services=" + services.toString() + '\'' +
                ", packages=" + packages.toString() +
                '}';
    }
}