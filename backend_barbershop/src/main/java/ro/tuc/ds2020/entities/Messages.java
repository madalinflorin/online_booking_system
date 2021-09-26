package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Messages implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "message")
    private String message;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "time_message")
    private Date timeMessage;


    public Messages(){

    }

    public Messages(String message, User user, Date timeMessage){
        this.message = message;
        this.user = user;
        this.timeMessage = timeMessage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimeMessage() {
        return timeMessage;
    }

    public void setTimeMessage(Date timeMessage) {
        this.timeMessage = timeMessage;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}