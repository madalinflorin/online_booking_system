package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.entities.User;

public class UserBuilder {

    private UserBuilder() {}

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender(),
                user.getPhoto(),
                user.getCountry(),
                user.getState(),
                user.getCity()
        );
    }

    public static UserDTO toDTOWithPassword(User user) {
        return new UserDTO(
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
                user.getCity()
        );
    }

}
