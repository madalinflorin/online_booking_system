package ro.tuc.ds2020.dtos.builders;


import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.entities.Messages;

public class ChatBuilder {

    private ChatBuilder() {}

    public static MessageDTO toDTO(Messages message) {
        return new MessageDTO(
                message.getUser().getUsername(),
                message.getMessage(),
                message.getUser().getPhoto(),
                message.getTimeMessage()
        );
    }
}
