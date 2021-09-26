package ro.tuc.ds2020.entities;


import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Date;

@Entity
@Table(	name = "program",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"day", "user_id"})
})


public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 0, message = "Day can't be less than 0")
    @Max(value = 6, message = "Day can't be greater than 6")
    private int day;

    private Date startProgram;

    private Date endProgram;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Program() {
    }

    public Program(Integer day, Date startProgram, Date endProgram, User user) {
        this.day = day;
        this.startProgram = startProgram;
        this.endProgram = endProgram;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public int getDay() {
        return day;
    }

    public void setDay(int day) {
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


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
