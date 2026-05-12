package restaurant_management.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import restaurant_management.menu.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}

