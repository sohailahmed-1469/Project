package restaurant_management_order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequestDto {

    private String orderDate;
    private String deliveryAddress;
    private String deliveryDate;
    private BigDecimal discount;
    private BigDecimal tax;
    private List<OrderItemRequestDto> orderItems;

}

