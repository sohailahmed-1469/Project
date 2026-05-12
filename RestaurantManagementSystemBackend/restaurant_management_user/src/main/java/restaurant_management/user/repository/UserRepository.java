package restaurant_management.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant_management.user.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

