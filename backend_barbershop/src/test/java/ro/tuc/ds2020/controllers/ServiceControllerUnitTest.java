package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.ServiceDTO;
import ro.tuc.ds2020.services.ServiceService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ServiceControllerUnitTest extends Ds2020TestConfig {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ServiceService serviceService;

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertSuccess() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("Serviciu", "Service", 20, 20);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertServiceWithWrongSizeForNameRo() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("As", "Service", 20, 20);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertServiceWithWrongSizeForNameEn() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("Serviciu", "As", 20, 20);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertServiceWithWrongValueForPrice() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("Serviciu", "Service", 0, 20);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertServiceWithWrongValueForDurationMin() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("Serviciu", "Service", 10, 9);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertServiceWithWrongValueForDurationMax() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO("Serviciu", "Service", 10, 61);

        mockMvc.perform(post("/service/insert")
                .content(objectMapper.writeValueAsString(serviceDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getServices() throws Exception {

        mockMvc.perform(get("/service/all")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void updateService() throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        ServiceDTO serviceDTO = new ServiceDTO(1L,"Serviciu", "Service", 2, 10);

        mockMvc.perform(post("/service/update")
                    .content(objectMapper.writeValueAsString(serviceDTO))
                    .contentType("application/json"))
                    .andExpect(status().isOk());

    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void deleteService() throws Exception {


        mockMvc.perform(delete("/service/delete/{id}", 1)
                .contentType("application/json"))
                .andExpect(status().isOk());

    }

}
