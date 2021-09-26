package ro.tuc.ds2020.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.dtos.builders.ChatBuilder;
import ro.tuc.ds2020.entities.Messages;
import ro.tuc.ds2020.entities.User;
import ro.tuc.ds2020.payload.response.MessageResponse;
import ro.tuc.ds2020.repositories.ChatRepository;
import ro.tuc.ds2020.repositories.UserRepository;
import ro.tuc.ds2020.socket.websocket.bean.MessageBean;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final AmazonS3 s3client;

    @Value("${app.awsServices.bucketName}")
    private String bucketName;

    @Autowired
    public ChatService(ChatRepository chatRepository, UserRepository userRepository, AmazonS3 s3client) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.s3client = s3client;
    }

    public void insertMessage(MessageBean messageBean){
        Optional<User> user = userRepository.findByUsername(messageBean.getName());

        if(!user.isPresent()){
            ResponseEntity.badRequest().body(new MessageResponse("Error: User with username: " + messageBean.getName() + " don't exist anymore!"));
            return;
        }
        Messages message = new Messages(messageBean.getMessage(), user.get(), messageBean.getTimeMessage().getTime());
        chatRepository.save(message);
        ResponseEntity.ok().body(new MessageResponse("Message send succesfully!"));
    }

    public ResponseEntity<List<MessageDTO>> getAllMessages(){
        HashMap<String, String> evidence = new HashMap<>();
        List<Messages> messages = chatRepository.findAll();
        return ResponseEntity.ok().body(messages.stream()
                .peek(e->{
                    if(evidence.get(e.getUser().getUsername())==null) {

                        e.getUser().setPhoto(getBase64StringFromImagePath(e.getUser().getPhoto()));
                        evidence.put(e.getUser().getUsername(), e.getUser().getPhoto());
                    }
                    else {
                        e.getUser().setPhoto(evidence.get(e.getUser().getUsername()));
                    }
                })
                .map(ChatBuilder::toDTO).collect(Collectors.toList()));

    }

    public ResponseEntity<?> deleteMessages(){
        chatRepository.deleteAll();
        return ResponseEntity.ok().body(new MessageResponse("All the messages were deleted!"));

    }


    private String getBase64StringFromImagePath(String path){

        S3Object object = s3client.getObject(bucketName, path);

        byte[] fileContent = new byte[0];
        try {
            fileContent = IOUtils.toByteArray(object.getObjectContent());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Base64
                .getEncoder()
                .encodeToString(fileContent);

    }

}
