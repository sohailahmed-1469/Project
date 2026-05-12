package restaurant_management.menu.service.menuServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import restaurant_management.menu.dto.CategoryDTO;
import restaurant_management.menu.dto.MenuItemDTO;
import restaurant_management.menu.entity.Category;
import restaurant_management.menu.entity.MenuItem;
import restaurant_management.menu.repository.CategoryRepository;
import restaurant_management.menu.repository.MenuItemRepository;
import restaurant_management.menu.service.MenuService;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private MenuItemRepository menuItemRepo;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }
    @Override
    public CategoryDTO getCategoryById(Long categoryId) {
        Optional<Category> categoryDB = categoryRepo.findById(categoryId);

        if (categoryDB.isPresent()) {
            Category category = categoryDB.get();
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setId(category.getId());
            categoryDTO.setName(category.getName());
            categoryDTO.setCategoryDescription(category.getCategoryDescription());
            categoryDTO.setCategoryImage(category.getCategoryImage());
            categoryDTO.setCreatedBy(category.getCreatedBy());
            categoryDTO.setLastUpdatedBy(category.getLastUpdatedBy());

            if (category.getItems()!=null) {
                categoryDTO.setItems(category.getItems());
            }
            return categoryDTO;
        } else {
            throw new NoSuchElementException("Category Not Found with id: " + categoryId);
        }
    }
    @Override
    public MenuItemDTO getMenuItemById(Long itemId) {
        Optional<MenuItem> menuItemOptional = menuItemRepo.findById(itemId);

        if (menuItemOptional.isPresent()) {
            MenuItem menuItem = menuItemOptional.get();
            MenuItemDTO menuItemDTO = new MenuItemDTO();
            menuItemDTO.setId(menuItem.getId());
            menuItemDTO.setName(menuItem.getName());
            menuItemDTO.setDescription(menuItem.getDescription());
            menuItemDTO.setPrice(menuItem.getPrice());
            menuItemDTO.setIngredients(menuItem.getIngredients());
            menuItemDTO.setImage(menuItem.getImage());
            menuItemDTO.setCreatedBy(menuItem.getCreatedBy());
            menuItemDTO.setLastUpdatedBy(menuItem.getLastUpdatedBy());

            if (menuItem.getCategory() != null) {
                menuItemDTO.setCategoryName(menuItem.getCategory().getName());
            }
            return menuItemDTO;
        } else {
            throw new NoSuchElementException("Menu item not found with id: " + itemId);
        }
    }


    @Override
    public String createCategoryMenu(CategoryDTO categoryDTO) {
        Category category = new Category();

        category.setName(categoryDTO.getName());
        category.setCategoryDescription(
                categoryDTO.getCategoryDescription() != null ? categoryDTO.getCategoryDescription() : ""
        );
        category.setCategoryImage(
                categoryDTO.getCategoryImage() != null ? categoryDTO.getCategoryImage() : ""
        );
        category.setItems(categoryDTO.getItems() != null ? categoryDTO.getItems() : new ArrayList<>());
        category.setCreatedBy(categoryDTO.getCreatedBy() != null ? categoryDTO.getCreatedBy() : "system");
        category.setLastUpdatedBy(categoryDTO.getLastUpdatedBy() != null ? categoryDTO.getLastUpdatedBy() : "system");

        categoryRepo.save(category);
        return "Category added Successfully...";
    }



    @Override
    public String createItemForCategory(MenuItemDTO menuItemDTO) {
        Category category = categoryRepo.findAll()
                .stream()
                .filter(c -> c.getName().equalsIgnoreCase(menuItemDTO.getCategoryName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found: " + menuItemDTO.getCategoryName()));

        MenuItem menuItem = getMenuItem(menuItemDTO, category);

        menuItemRepo.save(menuItem);
        return "Item Added to the Category Successfully...";
    }

    @Override
    public List<MenuItemDTO> getAllMenuItems() {
        List<MenuItem> menuItemList = menuItemRepo.findAll();

        return menuItemList.stream().map(menuItem -> {
            MenuItemDTO dto = new MenuItemDTO();
            dto.setId(menuItem.getId());
            dto.setName(menuItem.getName());
            dto.setDescription(menuItem.getDescription());
            dto.setPrice(menuItem.getPrice());
            dto.setIngredients(menuItem.getIngredients());
            dto.setImage(menuItem.getImage());
            dto.setCreatedBy(menuItem.getCreatedBy());
            dto.setLastUpdatedBy(menuItem.getLastUpdatedBy());

            if (menuItem.getCategory() != null) {
                dto.setCategoryName(menuItem.getCategory().getName());
            }
            return dto;
        }).toList();
    }


    public static MenuItem getMenuItem(MenuItemDTO menuItemDTO, Category category) {
        MenuItem menuItem = new MenuItem();

        menuItem.setName(menuItemDTO.getName() != null ? menuItemDTO.getName() : "");
        menuItem.setImage(menuItemDTO.getImage() != null ? menuItemDTO.getImage() : "");
        menuItem.setPrice(menuItemDTO.getPrice() != 0.0 ? menuItemDTO.getPrice() : 0.0);
        menuItem.setCreatedBy(menuItemDTO.getCreatedBy() != null ? menuItemDTO.getCreatedBy() : "");
        menuItem.setDescription(menuItemDTO.getDescription() != null ? menuItemDTO.getDescription() : "");
        menuItem.setIngredients(menuItemDTO.getIngredients() != null ? menuItemDTO.getIngredients() : "");
        menuItem.setLastUpdatedBy(menuItemDTO.getLastUpdatedBy() != null ? menuItemDTO.getLastUpdatedBy() : "");
        menuItem.setCategory(category);
        return menuItem;
    }
}
