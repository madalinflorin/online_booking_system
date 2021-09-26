package ro.tuc.ds2020.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "password_reset_token")
public class PasswordResetToken implements Serializable {

    private static final int EXPIRATION_MS = 1000 * 60 * 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "token")
    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "expiry_date")
    private Date expiryDate;

    public PasswordResetToken(){

    }

    public PasswordResetToken(User user, String token, Date expiryDate){
        this.id = user.getId();
        this.user = user;
        this.token = token;
        this.expiryDate = new Date(expiryDate.getTime() + EXPIRATION_MS);
    }

    public String getToken() {
        return token;
    }

    public Date getExpiryDate() {
        return expiryDate;
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