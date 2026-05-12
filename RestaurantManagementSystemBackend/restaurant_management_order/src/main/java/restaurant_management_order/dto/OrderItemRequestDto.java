package restaurant_management_order.dto;

import lombok.Data;

@Data
public class OrderItemRequestDto {

    private Long menuItemId;
    private int quantity;
    private int price;

}

