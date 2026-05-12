package restaurant_management.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant_management.user.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}

