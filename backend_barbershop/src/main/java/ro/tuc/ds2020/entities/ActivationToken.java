package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "activation_token")
public class ActivationToken implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "token")
    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    public ActivationToken(){

    }

    public ActivationToken(User user, String token){
        this.id = user.getId();
        this.user = user;
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }
}