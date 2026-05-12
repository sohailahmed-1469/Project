package restaurant_management_order.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import restaurant_management_order.dto.CreateOrderRequestDto;
import restaurant_management_order.dto.OrderDTO;
import restaurant_management_order.enums.OrderStatus;
import restaurant_management_order.exceptions.OrderNotFoundException;
import restaurant_management_order.service.OrderService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping("/createOrder")
    public OrderDTO createOrder(@RequestBody CreateOrderRequestDto createOrderRequestDto) {
        logger.info("Received request to create order for address: {}", createOrderRequestDto.getDeliveryAddress());
        OrderDTO savedOrder = orderService.saveOrder(createOrderRequestDto);
        logger.info("Order created successfully with ID: {}", savedOrder.getOrderId());
        return savedOrder;
    }

    @GetMapping("/viewAllOrders")
    public List<OrderDTO> getAllOrders() {
        logger.info("Received request for get All Orders");
        return orderService.getAllOrders();
    }

    @GetMapping("/status")
    public List<OrderDTO> getOrdersByStatus(@RequestParam String status) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.trim().toUpperCase().replace("-", "_"));
            return orderService.getOrdersByStatus(orderStatus);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }
    }

    @GetMapping("viewOrderById/{id}")
    public OrderDTO getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/{orderId}/status")
    public String updateOrderStatus(@PathVariable("orderId") Long orderId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                return "Status is required";
            }
            return orderService.updateOrderStatus(orderId, status);
        } catch (OrderNotFoundException e) {
            return "Order Not Found";
        } catch (Exception e) {
            return "Failed to update order status";
        }
    }

    @PostMapping("/filter")
    public List<OrderDTO> filterOrders(@RequestBody Map<String, Object> filters) {
        return orderService.filterOrders(filters);
    }
}
