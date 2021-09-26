package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.ServiceDTO;

import static org.springframework.test.util.AssertionErrors.assertEquals;

import java.util.List;
import java.util.Objects;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-service.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-service.sql")
public class ServicesIntegrationTest extends Ds2020TestConfig {

    @Autowired
    ServiceService serviceService;

    @Test
    public void testGetCorrect() {
        List<ServiceDTO> serviceDTOList = serviceService.getServices();
        assertEquals("Test Insert Service", 2, serviceDTOList.size());
    }

    @Test
    public void testInsertCorrectWithGetById() {
        ServiceDTO p = new ServiceDTO("Serviciu", "Service",10, 22);
        ResponseEntity<ServiceDTO> insertedService = (ResponseEntity<ServiceDTO>) serviceService.insert(p);

        ResponseEntity<?> fetchedService = serviceService.findServiceById(Objects.requireNonNull(insertedService.getBody()).getId());

        assertEquals("Test Inserted Service", insertedService, fetchedService);
    }

    @Test
    public void testInsertCorrectWithGetAll() {
        ServiceDTO p = new ServiceDTO("Serviciu", "Service",10, 22);
        serviceService.insert(p);

        List<ServiceDTO> servicesDTOList = serviceService.getServices();
        assertEquals("Test Inserted Services", 3, servicesDTOList.size());
    }

    @Test
    public void testDeleteCorrectWithGetAll() {
        serviceService.deleteById(20L);

        List<ServiceDTO> servicesDTOList = serviceService.getServices();
        assertEquals("Test Inserted Services", 1, servicesDTOList.size());
    }

    @Test
    public void testUpdateCorrectWithGetById() {

        ServiceDTO p = new ServiceDTO(20L,"Serviciu1", "Service1",40, 40);
        ResponseEntity<ServiceDTO> beforeUpdate = (ResponseEntity<ServiceDTO>) serviceService.findServiceById(p.getId());

        assertEquals("Test id", Objects.requireNonNull(beforeUpdate.getBody()).getId(), p.getId());
        assertEquals("Test nameRo", beforeUpdate.getBody().getNameRo(), "Serviciu");
        assertEquals("Test nameEn", beforeUpdate.getBody().getNameEn(), "Service");
        assertEquals("Test price", (double) beforeUpdate.getBody().getPrice(), 10.0);
        assertEquals("Test duration", beforeUpdate.getBody().getDuration(), 20);

        ResponseEntity<ServiceDTO> afterUpdate = (ResponseEntity<ServiceDTO>) serviceService.update(p);

        assertEquals("Test Updated Service", p, afterUpdate.getBody());
    }


}

