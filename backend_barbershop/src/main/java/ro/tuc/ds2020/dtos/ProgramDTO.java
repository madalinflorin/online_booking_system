package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;
import java.util.Objects;

public class ProgramDTO extends RepresentationModel<ProgramDTO> {

    private Long id;

    @Min(value = 0, message = "Day can't be less than 0")
    @Max(value = 6, message = "Day can't be greater than 6")
    private Integer day;

    private Date startProgram;

    private Date endProgram;

    private Long user_id;

    public ProgramDTO() {
    }

    public ProgramDTO(Long id, Integer day, Date startProgram, Date endProgram, Long user_id) {
        this.id = id;
        this.day = day;
        this.startProgram = startProgram;
        this.endProgram = endProgram;
        this.user_id = user_id;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Date getStartProgram() {
        return startProgram;
    }

    public void setStartProgram(Date startProgram) {
        this.startProgram = startProgram;
    }

    public Date getEndProgram() {
        return endProgram;
    }

    public void setEndProgram(Date endProgram) {
        this.endProgram = endProgram;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        ProgramDTO programDTO = (ProgramDTO) o;
        return  Objects.equals(id, programDTO.id) &&
                Objects.equals(day, programDTO.day) &&
                Objects.equals(user_id, programDTO.user_id) &&
                Objects.equals(startProgram, programDTO.startProgram) &&
                Objects.equals(endProgram, programDTO.endProgram);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, day, startProgram, endProgram, user_id);
    }

    @Override
    public String toString() {
        return "ProgramDTO{" +
                "id=" + id +
                ", day='" + day + '\'' +
                ", startProgram='" + startProgram + '\'' +
                ", endProgram='" + endProgram + '\'' +
                ", user_id='" + user_id +
                '}';
    }
}