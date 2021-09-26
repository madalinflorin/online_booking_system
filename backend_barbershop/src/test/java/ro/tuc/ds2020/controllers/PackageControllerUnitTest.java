package ro.tuc.ds2020.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.PackageDTO;
import ro.tuc.ds2020.services.PackageService;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PackageControllerUnitTest extends Ds2020TestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PackageService packageService;


    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertPackage() throws Exception {

        List<Integer> services_id = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        PackageDTO packageDTO = new PackageDTO(7L, "Pachet", "Package", new Date(), new Date(), 10, new Date(), new Date(), services_id);

        mockMvc.perform(post("/package/insert")
                .content(objectMapper.writeValueAsString(packageDTO))
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertPackageWithWrongSizeForNameRo() throws Exception {

        List<Integer> services_id = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        PackageDTO packageDTO = new PackageDTO(7L, "Pa", "Package", new Date(), new Date(), 10, new Date(), new Date(), services_id);

        mockMvc.perform(post("/package/insert")
                .content(objectMapper.writeValueAsString(packageDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertPackageWithWrongSizeForNameEn() throws Exception {

        List<Integer> services_id = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        PackageDTO packageDTO = new PackageDTO(7L, "Pachet", "Pa", new Date(), new Date(), 10, new Date(), new Date(), services_id);

        mockMvc.perform(post("/package/insert")
                .content(objectMapper.writeValueAsString(packageDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void insertPackageWithWrongValueForDiscount() throws Exception {

        List<Integer> services_id = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        PackageDTO packageDTO = new PackageDTO(7L, "Pachet", "Package", new Date(), new Date(), -1, new Date(), new Date(), services_id);

        mockMvc.perform(post("/package/insert")
                .content(objectMapper.writeValueAsString(packageDTO))
                .contentType("application/json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "USER")
    public void getPackages() throws Exception {

        mockMvc.perform(get("/package/all")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void updatePackage() throws Exception {

        List<Integer> services_id = new ArrayList<>();

        ObjectMapper objectMapper = new ObjectMapper();
        PackageDTO packageDTO = new PackageDTO(7L, "Pachet", "Package", new Date(), new Date(), 10, new Date(), new Date(), services_id);

        mockMvc.perform(post("/package/update")
                    .content(objectMapper.writeValueAsString(packageDTO))
                    .contentType("application/json"))
                    .andExpect(status().isOk());

    }

    @Test
    @WithMockUser(username = "madalin", password = "madalin", roles = "ADMIN")
    public void deletePackage() throws Exception {


        mockMvc.perform(delete("/package/delete/{id}", 1)
                .contentType("application/json"))
                .andExpect(status().isOk());

    }
}
