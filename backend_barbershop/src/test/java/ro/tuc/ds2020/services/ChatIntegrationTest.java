package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.MessageDTO;

import java.util.List;
import java.util.Objects;

import static org.springframework.test.util.AssertionErrors.assertEquals;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-chat.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-chat.sql")
public class ChatIntegrationTest extends Ds2020TestConfig {

    @Autowired
    ChatService chatService;

    @Test
    public void testGetCorrect() {
        ResponseEntity<List<MessageDTO>> messageDTOS = chatService.getAllMessages();
        assertEquals("Test Insert Service", 1, Objects.requireNonNull(messageDTOS.getBody()).size());
    }

    @Test
    public void deleteMessages() {
        chatService.deleteMessages();
        ResponseEntity<List<MessageDTO>> messageDTOS = chatService.getAllMessages();
        assertEquals("Test Insert Service", 0, Objects.requireNonNull(messageDTOS.getBody()).size());
    }
}
