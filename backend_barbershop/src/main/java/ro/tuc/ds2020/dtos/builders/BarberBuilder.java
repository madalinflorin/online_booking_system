package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.BarberDTO;
import ro.tuc.ds2020.entities.User;
import java.util.stream.Collectors;

public class BarberBuilder {

    private BarberBuilder() {}

    public static BarberDTO toDTO(User user) {
        return new BarberDTO(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender(),
                user.getPhoto(),
                user.getCountry(),
                user.getState(),
                user.getCity(),
                user.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet()),
                user.getPackages().stream().map(PackageBuilder::toDTO).collect(Collectors.toSet()),
                user.getPrograms().stream().map(ProgramBuilder::toDTO).collect(Collectors.toSet()),
                user.getRoles().stream().map(RoleBuilder::toDTO).collect(Collectors.toSet())

        );
    }

    public static BarberDTO toDTOWithPassword(User user) {
        return new BarberDTO(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getBirthDate(),
                user.getGender(),
                user.getPhoto(),
                user.getCountry(),
                user.getState(),
                user.getCity(),
                user.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet()),
                user.getPackages().stream().map(PackageBuilder::toDTO).collect(Collectors.toSet()),
                user.getPrograms().stream().map(ProgramBuilder::toDTO).collect(Collectors.toSet()),
                user.getRoles().stream().map(RoleBuilder::toDTO).collect(Collectors.toSet())

        );
    }

}
