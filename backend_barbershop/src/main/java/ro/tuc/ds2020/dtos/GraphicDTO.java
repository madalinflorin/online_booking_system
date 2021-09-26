package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class GraphicDTO extends RepresentationModel<ProgramDTO> {

    private Integer counter = 0;

    private String date = new String();

    private List<Integer> months_counter = new ArrayList<>();

    public GraphicDTO() {
    }

    public GraphicDTO(Integer counter, String date) {
        this.counter = counter;
        this.date = date;
    }

    public GraphicDTO(List<Integer> months_counter){
        this.months_counter = months_counter;
    }

    public Integer getCounter() {
        return counter;
    }

    public void setCounter(Integer counter) {
        this.counter = counter;
    }

    public String getDate() {
        return date;
    }

    public List<Integer> getMonths_counter() {
        return months_counter;
    }

    public void setMonths_counter(List<Integer> months_counter) {
        this.months_counter = months_counter;
    }

    public void setDate(String date) {
        this.date = date;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        GraphicDTO graphicDTO = (GraphicDTO) o;
        return  counter.equals(graphicDTO.counter) && date.equals(graphicDTO.date) && months_counter.equals(graphicDTO.months_counter);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), counter, date, months_counter);
    }
}