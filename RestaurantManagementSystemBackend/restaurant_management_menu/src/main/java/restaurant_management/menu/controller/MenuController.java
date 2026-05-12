package restaurant_management.menu.controller;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import restaurant_management.menu.dto.CategoryDTO;
import restaurant_management.menu.dto.MenuItemDTO;
import restaurant_management.menu.entity.Category;
import restaurant_management.menu.service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Resource
    private MenuService menuService;

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return menuService.getAllCategories();
    }
    @GetMapping("/getAllMenuItems")
    public List<MenuItemDTO> getMenuItems(){
        return menuService.getAllMenuItems();
    }

    @GetMapping("/category/{categoryId}")
    public CategoryDTO getCategory(@PathVariable Long categoryId) {
        return menuService.getCategoryById(categoryId);
    }

    @GetMapping("/item/{itemId}")
    public MenuItemDTO getMenuItem(@PathVariable Long itemId) {
        return menuService.getMenuItemById(itemId);
    }

    @PostMapping("/addCategory")
    public String addCategory(@RequestBody CategoryDTO categoryDTO){
        return menuService.createCategoryMenu(categoryDTO);
    }
    @PostMapping("/addItemToCategory")
    public String addItemToCategory(@RequestBody MenuItemDTO menuItemDTO){
        return menuService.createItemForCategory(menuItemDTO);
    }
}

