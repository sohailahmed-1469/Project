package restaurant_management.user.dto;

import lombok.Getter;
import lombok.Setter;
import restaurant_management.user.entity.Role;

@Getter
@Setter
public class RegisterRequest {

    private String userName;
    private String email;
    private String password;
    private Role role;

}
