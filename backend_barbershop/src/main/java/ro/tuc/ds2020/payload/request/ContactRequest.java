package ro.tuc.ds2020.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class ContactRequest {

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 50)
    private String telephone;

    @NotBlank
    @Size(max = 999)
    private String message;

    @NotBlank
    @Size(max = 3)

    private String language;

    public ContactRequest(String name, String email, String telephone, String message, String language){
        this.name = name;
        this.email = email;
        this.telephone = telephone;
        this.message = message;
        this.language = language;

    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }


    public String getTelephone() {
        return telephone;
    }

    public String getMessage() {
        return message;
    }

    public String getLanguage() {
        return language;
    }

}
