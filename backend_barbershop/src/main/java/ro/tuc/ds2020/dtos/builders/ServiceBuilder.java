package ro.tuc.ds2020.dtos.builders;


import ro.tuc.ds2020.dtos.ServiceDTO;
import ro.tuc.ds2020.entities.Services;

public class ServiceBuilder {

    private ServiceBuilder() {}

    public static ServiceDTO toDTO(Services service) {
        return new ServiceDTO(
                service.getId(),
                service.getNameRo(),
                service.getNameEn(),
                service.getPrice(),
                service.getDuration()
        );
    }

    public static Services toEntity(ServiceDTO service) {
        return new Services(
                service.getNameRo(),
                service.getNameEn(),
                service.getPrice(),
                service.getDuration()
        );
    }

    public static Services toEntityWithId(ServiceDTO service) {
        return new Services(
                service.getId(),
                service.getNameRo(),
                service.getNameEn(),
                service.getPrice(),
                service.getDuration()
        );
    }


}
