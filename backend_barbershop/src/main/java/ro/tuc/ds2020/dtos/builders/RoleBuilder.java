package ro.tuc.ds2020.dtos.builders;


import ro.tuc.ds2020.dtos.RoleDTO;
import ro.tuc.ds2020.entities.Role;

public class RoleBuilder {

    private RoleBuilder() {}

    public static RoleDTO toDTO(Role role) {
        return new RoleDTO(
                role.getId(),
                role.getName()
        );
    }

}
