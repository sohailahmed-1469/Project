package restaurant_management.menu.service;

import restaurant_management.menu.dto.CategoryDTO;
import restaurant_management.menu.dto.MenuItemDTO;
import restaurant_management.menu.entity.Category;

import java.util.List;

public interface MenuService {
    List<Category> getAllCategories();

    CategoryDTO getCategoryById(Long categoryId);

    MenuItemDTO getMenuItemById(Long itemId);

    String createCategoryMenu(CategoryDTO categoryDTO);

    String createItemForCategory(MenuItemDTO menuItemDTO);

    List<MenuItemDTO> getAllMenuItems();
}
