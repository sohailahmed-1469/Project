package restaurant_management.user.service.serviceImpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import restaurant_management.user.entity.Role;
import restaurant_management.user.entity.User;
import restaurant_management.user.repository.RoleRepository;
import restaurant_management.user.repository.UserRepository;
import restaurant_management.user.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void registerUser(String email, String password, String roleName, String userName) {
        Role role = roleRepository.findByName(roleName);
        User user = new User(email, passwordEncoder.encode(password), role.getName(),userName);
        userRepository.save(user);
    }
}
