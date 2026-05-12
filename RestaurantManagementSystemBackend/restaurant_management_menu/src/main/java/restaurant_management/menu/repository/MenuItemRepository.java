package restaurant_management.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant_management.menu.entity.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

}

