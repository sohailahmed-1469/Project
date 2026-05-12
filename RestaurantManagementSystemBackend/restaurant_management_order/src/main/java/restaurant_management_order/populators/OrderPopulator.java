package restaurant_management_order.populators;

import org.hibernate.annotations.Comment;
import org.springframework.stereotype.Component;
import restaurant_management_order.dto.OrderDTO;
import restaurant_management_order.dto.OrderItemDTO;
import restaurant_management_order.entity.Order;
import restaurant_management_order.entity.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderPopulator {

    public OrderDTO mapToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();

        // Map Order properties
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setPaymentStatus(order.getPaymentStatus());
        orderDTO.setDeliveryAddress(order.getDeliveryAddress());
        orderDTO.setDeliveryDate(order.getDeliveryDate());
        orderDTO.setDiscount(order.getDiscount());
        orderDTO.setTax(order.getTax());

        // Map OrderItems
        List<OrderItemDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::mapToOrderItemDTO)
                .collect(Collectors.toList());
        orderDTO.setOrderItems(orderItemDTOs);

        return orderDTO;
    }

    // Method to map OrderItem to OrderItemDTO
    public OrderItemDTO mapToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();

        // Map OrderItem properties
        orderItemDTO.setOrderItemId(orderItem.getOrderItemId());
        orderItemDTO.setMenuItemId(orderItem.getMenuItemId());
        orderItemDTO.setItemName(orderItem.getItemName());
        orderItemDTO.setQuantity(orderItem.getQuantity());
        orderItemDTO.setUnitPrice(orderItem.getUnitPrice());
        orderItemDTO.setTotalPrice(orderItem.getTotalPrice());

        return orderItemDTO;
    }
}
