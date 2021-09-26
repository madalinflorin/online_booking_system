package ro.tuc.ds2020.socket.websocket.bean;

import java.util.Calendar;
import java.util.TimeZone;

public class MessageBean {
    private String name;
    private String message;
    private String photo;
    private String color;
    private Calendar timeMessage = Calendar.getInstance(TimeZone.getTimeZone("Europe/Bucharest"));

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

    public String getPhoto(){
        return photo;
    }

    public void setPhoto(String photo){
        this.photo = photo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Calendar getTimeMessage() {
        return timeMessage;
    }

    public void setTimeMessage(Calendar timeMessage) {
        this.timeMessage = timeMessage;
    }
}