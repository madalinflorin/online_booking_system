package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;
import ro.tuc.ds2020.entities.ERole;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Objects;

public class RoleDTO extends RepresentationModel<RoleDTO> {

    private Integer id;

    @Enumerated(EnumType.STRING)
    private ERole name;



    public RoleDTO() {
    }

    public RoleDTO(Integer id, ERole name) {
        this.id = id;
        this.name = name;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        RoleDTO roleDTO = (RoleDTO) o;
        return  Objects.equals(id, roleDTO.id) && Objects.equals(name, roleDTO.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, name);
    }

    @Override
    public String toString() {
        return "ProgramDTO{" +
                "id=" + id +
                ", name='" + name +
                '}';
    }
}