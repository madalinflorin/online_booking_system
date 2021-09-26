package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.services.ChatService;
import ro.tuc.ds2020.socket.websocket.bean.MessageBean;

import java.util.List;

@RestController
@RequestMapping(value = "/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping(value="/access")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BARBER') or hasRole('USER')")
    public boolean verifyAccess() {
        return true;
    }

    @GetMapping(value="/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BARBER') or hasRole('USER')")
    public ResponseEntity<List<MessageDTO>> getAllMessages() {
        return chatService.getAllMessages();
    }

    @MessageMapping("/user-all")
    @SendTo("/topic/user")
    public MessageBean send(@Payload MessageBean message) {
        chatService.insertMessage(message);
        return message;

    }

    @DeleteMapping(value="/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessages() {
        return chatService.deleteMessages();
    }
}