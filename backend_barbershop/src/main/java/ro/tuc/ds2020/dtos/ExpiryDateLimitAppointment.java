package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.Objects;

public class ExpiryDateLimitAppointment extends RepresentationModel<ExpiryDateLimitAppointment> {

    public Date expireDate;

    public ExpiryDateLimitAppointment(){}

    public ExpiryDateLimitAppointment(Date expireDate){
        this.expireDate = expireDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        ExpiryDateLimitAppointment expiryDateLimitAppointment = (ExpiryDateLimitAppointment) o;
        return Objects.equals(expireDate, expiryDateLimitAppointment.expireDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), expireDate);
    }

    @Override
    public String toString() {
        return "ExpireDateLimitAppointment{" +
                "expireDate=" + expireDate + +'\'' +
                '}';
    }

}
