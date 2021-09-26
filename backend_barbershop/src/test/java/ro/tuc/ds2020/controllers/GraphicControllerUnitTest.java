package ro.tuc.ds2020.controllers;


import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.services.GraphicService;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class GraphicControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GraphicService graphicService;


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForMonthAndYear() throws Exception {

        mockMvc.perform(get("/graphic/year={year}", 2021)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForYear() throws Exception {

        mockMvc.perform(get("/graphic/month={month}&year={year}",1,2021)
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForCountries() throws Exception {

        mockMvc.perform(get("/graphic/countries")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForStates() throws Exception {

        mockMvc.perform(get("/graphic/states")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForCities() throws Exception {

        mockMvc.perform(get("/graphic/cities")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void getGraphicForGender() throws Exception {

        mockMvc.perform(get("/graphic/gender")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

}
