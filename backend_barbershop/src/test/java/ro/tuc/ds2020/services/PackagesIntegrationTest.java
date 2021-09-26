package ro.tuc.ds2020.services;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.jdbc.Sql;
import ro.tuc.ds2020.Ds2020TestConfig;
import ro.tuc.ds2020.dtos.PackageDTO;

import static org.springframework.test.util.AssertionErrors.assertEquals;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:/test-sql/create-service.sql")
@Sql(executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD, scripts = "classpath:/test-sql/delete-service.sql")
public class PackagesIntegrationTest extends Ds2020TestConfig {

    @Autowired
    PackageService packageService;

    @Test
    public void testGetCorrect() {
        List<PackageDTO> packageDTOList = packageService.getPackages();
        assertEquals("Test Insert Service", 1, packageDTOList.size());
    }

    @Test
    public void testInsertCorrectWithGetById() {

        List<Integer> services = new ArrayList<>();
        PackageDTO packageDTO = new PackageDTO(1L,"Pachet 0","Packet 0", new Date(), new Date(), 20.5f, new Date(), new Date(), services);
        ResponseEntity<PackageDTO> insertedPackage = (ResponseEntity<PackageDTO>) packageService.insert(packageDTO);

        ResponseEntity<?> fetchedPackage = packageService.findPackageById(insertedPackage.getBody().getId());

        assertEquals("Test Inserted Package", insertedPackage, fetchedPackage);
    }

    @Test
    public void testInsertCorrectWithGetAll() {
        List<Integer> services = new ArrayList<>();
        PackageDTO packageDTO = new PackageDTO(1L,"Pachet 0","Packet 0", new Date(), new Date(), 20.5f, new Date(), new Date(), services);
        packageService.insert(packageDTO);

        List<PackageDTO> packageDTOList = packageService.getPackages();
        assertEquals("Test Inserted Package", 2, packageDTOList.size());
    }

    @Test
    public void testDeleteCorrectWithGetAll() {
        packageService.deleteById(7L);

        List<PackageDTO> packagesDTOList = packageService.getPackages();
        assertEquals("Test Deleted Package", 0, packagesDTOList.size());
    }

    @Test
    public void testUpdateCorrectWithGetById() {

        List<Integer> services = new ArrayList<>();
        PackageDTO packageDTO = new PackageDTO(7L,"Pachet 0","Packet 0", new Date(), new Date(), 20.5f, new Date(), new Date(), services);

        ResponseEntity<PackageDTO> beforeUpdate = (ResponseEntity<PackageDTO>) packageService.findPackageById(packageDTO.getId());

        assertEquals("Test id", beforeUpdate.getBody().getId(), packageDTO.getId());
        assertEquals("Test nameRo", beforeUpdate.getBody().getNameRo(), "Pachet 1");
        assertEquals("Test nameEn", beforeUpdate.getBody().getNameEn(), "Packet 1");
        assertEquals("Test discount", (double) beforeUpdate.getBody().getDiscount(), 10.0);
        assertEquals("Test start validity period", beforeUpdate.getBody().getStartValidityPeriod().toString(), "2021-06-09 09:17:23.0");
        assertEquals("Test end validity period", beforeUpdate.getBody().getEndValidityPeriod().toString(), "2021-07-09 09:17:23.0");
        assertEquals("Test start discount period", beforeUpdate.getBody().getStartDiscountPeriod().toString(), "2021-06-30 09:17:23.0");
        assertEquals("Test end discount period", beforeUpdate.getBody().getEndDiscountPeriod().toString(), "2021-07-02 09:17:23.0");
        assertEquals("Test nr. services", beforeUpdate.getBody().getServices().size(), 2);

        ResponseEntity<PackageDTO> afterUpdate = (ResponseEntity<PackageDTO>) packageService.update(packageDTO);

        assertEquals("Test Updated Package", packageDTO, afterUpdate.getBody());
        assertEquals("Test nr. services", afterUpdate.getBody().getServices().size(),0);
    }




}

