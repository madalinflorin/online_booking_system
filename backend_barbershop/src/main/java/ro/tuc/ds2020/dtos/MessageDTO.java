package ro.tuc.ds2020.dtos;


import org.springframework.hateoas.RepresentationModel;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Objects;

public class MessageDTO extends RepresentationModel<MessageDTO> {

    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Size(min = 1, max = 1000)
    private String message;

    private String photo;

    private Date timeMessage;


    public MessageDTO() {
    }

    public MessageDTO(String name, String message, String photo, Date timeMessage) {
        this.name = name;
        this.message = message;
        this.photo = photo;
        this.timeMessage = timeMessage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Date getTimeMessage() {
        return timeMessage;
    }

    public void setTimeMessage(Date timeMessage) {
        this.timeMessage = timeMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        MessageDTO messageDTO = (MessageDTO) o;
        return  Objects.equals(name,messageDTO.name) &&
                Objects.equals(message,messageDTO.message) &&
                Objects.equals(photo, messageDTO.photo) &&
                Objects.equals(timeMessage, messageDTO.timeMessage);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), name, message, photo, timeMessage);
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "name=" + name +
                ", message='" + message + '\'' +
                ", photo='" + photo + '\'' +
                ", timeMessage='" + timeMessage + '\'' +
                '}';
    }
}