package restaurant_management_order.service;

import restaurant_management_order.dto.CreateOrderRequestDto;
import restaurant_management_order.dto.OrderDTO;
import restaurant_management_order.enums.OrderStatus;
import java.util.List;
import java.util.Map;


public interface OrderService {
    OrderDTO saveOrder(CreateOrderRequestDto createOrderRequestDto);

    List<OrderDTO> getAllOrders();

    List<OrderDTO> getOrdersByStatus(OrderStatus status);

    OrderDTO getOrderById(Long id);

    String updateOrderStatus(Long orderId, String status);

    List<OrderDTO> filterOrders(Map<String, Object> filters);
}
