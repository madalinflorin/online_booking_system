package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Objects;

public class ProgramViewDTO extends RepresentationModel<ProgramViewDTO> {

    @Min(value = 0, message = "Day can't be less than 0")
    @Max(value = 6, message = "Day can't be greater than 6")
    private Integer day;

    private String program;

    public ProgramViewDTO() {
    }

    public ProgramViewDTO(Integer day, String program) {
        this.day = day;
        this.program = program;
    }



    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        ProgramViewDTO programDTO = (ProgramViewDTO) o;
        return  Objects.equals(day, programDTO.day) &&
                Objects.equals(program, programDTO.program);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), day, program);
    }

    @Override
    public String toString() {
        return "ProgramDTO{" +
                "day=" + day +
                ", program='" + program +
                '}';
    }
}