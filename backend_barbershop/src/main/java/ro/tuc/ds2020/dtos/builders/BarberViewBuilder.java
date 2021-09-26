package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.BarberViewDTO;
import ro.tuc.ds2020.entities.User;
import java.util.stream.Collectors;

public class BarberViewBuilder {

    private BarberViewBuilder() {}

    public static BarberViewDTO toDTO(User user) {
        return new BarberViewDTO(
                user.getId(),
                user.getName(),
                user.getPhoto(),
                user.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet()),
                user.getPackages().stream().map(PackageBuilder::toDTO).collect(Collectors.toSet())

        );
    }

}
