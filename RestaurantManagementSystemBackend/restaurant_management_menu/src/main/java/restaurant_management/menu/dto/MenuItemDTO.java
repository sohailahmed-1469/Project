package restaurant_management.menu.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuItemDTO {

    private Long id;
    private String name;
    private String description;
    private double price;
    private String ingredients;
    private String image;
    private String createdBy;
    private String lastUpdatedBy;
    private String categoryName;
}
