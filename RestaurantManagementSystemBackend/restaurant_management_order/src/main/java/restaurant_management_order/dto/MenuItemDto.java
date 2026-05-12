package restaurant_management_order.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MenuItemDto {
    private Long menuItemId;
    private String name;
    private BigDecimal price;
    private String category;
}
