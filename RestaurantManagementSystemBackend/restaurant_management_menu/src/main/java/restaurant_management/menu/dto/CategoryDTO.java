package restaurant_management.menu.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import restaurant_management.menu.entity.MenuItem;

import java.util.List;

@Setter
@Getter
public class CategoryDTO {

    private Long id;
    private String name;
    @Column(name = "categoryImage", columnDefinition = "LONGTEXT")
    private String categoryImage;
    private String categoryDescription;
    private String createdBy;
    private String lastUpdatedBy;
    private List<MenuItem> items;

}
