package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.services.ChatService;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ChatControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChatService chatService;


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getAllMessages() throws Exception {

        mockMvc.perform(get("/chat/all")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void deleteMessage() throws Exception {

        mockMvc.perform(delete("/chat/delete")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

}
