package restaurant_management_order.service.impl;

import jakarta.annotation.Resource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import restaurant_management_order.dto.*;
import restaurant_management_order.entity.Order;
import restaurant_management_order.entity.OrderItem;
import restaurant_management_order.enums.OrderStatus;
import restaurant_management_order.enums.PaymentStatus;
import restaurant_management_order.exceptions.OrderNotFoundException;
import restaurant_management_order.populators.OrderPopulator;
import restaurant_management_order.repository.OrderItemRepository;
import restaurant_management_order.repository.OrderRepository;
import restaurant_management_order.service.OrderService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    @Resource
    private OrderRepository orderRepository;

    @Resource
    private OrderItemRepository orderItemRepository;

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private OrderPopulator orderPopulator;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public OrderDTO saveOrder(CreateOrderRequestDto dto) {
        logger.info("Starting order creation for delivery address: {}", dto.getDeliveryAddress());

        Order order = new Order();
        order.setOrderDate(dto.getOrderDate());
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setDiscount(dto.getDiscount());
        order.setTax(dto.getTax());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        totalAmount = calculateAmount(dto, order, orderItems, totalAmount);

        if (dto.getTax() != null && dto.getTax().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal taxAmount = totalAmount.multiply(dto.getTax())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.add(taxAmount);
        }

        if (dto.getDiscount() != null && dto.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountAmount = totalAmount.multiply(dto.getDiscount())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            totalAmount = totalAmount.subtract(discountAmount);
        }

        order.setTotalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);

        logger.info("Order saved successfully with ID: {}", savedOrder.getOrderId());

        return convertToDto(savedOrder);
    }

    private static BigDecimal calculateAmount(CreateOrderRequestDto dto, Order order, List<OrderItem> orderItems, BigDecimal totalAmount) {
        for (OrderItemRequestDto itemDto : dto.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItemId(itemDto.getMenuItemId());
            BigDecimal unitPrice = BigDecimal.valueOf(itemDto.getPrice()).setScale(2, RoundingMode.HALF_UP);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(itemDto.getQuantity());

            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            orderItem.setTotalPrice(itemTotal);
            orderItem.setOrder(order);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(itemTotal);
        }
        return totalAmount;
    }

    public OrderDTO convertToDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setOrderDate(order.getOrderDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDiscount(order.getDiscount());
        dto.setTax(order.getTax());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentStatus(order.getPaymentStatus());

        List<OrderItemDTO> orderItemDTOs = getOrderItemDTOS(order);
        dto.setOrderItems(orderItemDTOs);

        return dto;
    }

    private static List<OrderItemDTO> getOrderItemDTOS(Order order) {
        List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
        for (OrderItem orderItem : order.getOrderItems()) {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setOrderItemId(orderItem.getOrderItemId());
            itemDTO.setMenuItemId(orderItem.getMenuItemId());
            itemDTO.setItemName(orderItem.getItemName());
            itemDTO.setQuantity(orderItem.getQuantity());
            itemDTO.setUnitPrice(orderItem.getUnitPrice());
            itemDTO.setTotalPrice(orderItem.getTotalPrice());

            orderItemDTOs.add(itemDTO);
        }
        return orderItemDTOs;
    }


    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> orderPopulator.mapToOrderDTO(order))
                .toList();
    }

    @Override
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatus(status);
        return orders.stream()
                .map(order -> orderPopulator.mapToOrderDTO(order))
                .toList();
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));

        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDiscount(order.getDiscount());
        dto.setTax(order.getTax());

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setOrderItemId(item.getOrderItemId());
            itemDTO.setMenuItemId(item.getMenuItemId());
            itemDTO.setItemName(item.getItemName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setTotalPrice(item.getTotalPrice());
            return itemDTO;
        }).toList();

        dto.setOrderItems(itemDTOs);
        return dto;
    }

    @Override
    public String updateOrderStatus(Long orderId, String status) throws OrderNotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        if(Objects.nonNull(order)){
            order.setStatus(OrderStatus.valueOf(status));
            orderRepository.save(order);
            return "SUCCESS";
        }else{
            return "FAILED TO UPDATE STATUS";
        }
    }
    @Override
    public List<OrderDTO> filterOrders(Map<String, Object> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> root = query.from(Order.class);

        List<Predicate> predicates = new ArrayList<>();

        // Apply orderId filter if it's not empty
        if (filters.get("orderId") != null && !filters.get("orderId").toString().isEmpty()) {
            String orderId = filters.get("orderId").toString();
            predicates.add(cb.equal(root.get("orderId"), orderId));
        }

        // Apply customerName filter if it's not empty
        if (filters.get("customerName") != null && !filters.get("customerName").toString().isEmpty()) {
            String customerName = filters.get("customerName").toString().toLowerCase();
            predicates.add(cb.like(cb.lower(root.get("customerName")), "%" + customerName + "%"));
        }

        // Apply fromDate filter if it's not empty
        if (filters.get("fromDate") != null && !filters.get("fromDate").toString().isEmpty()) {
            LocalDate fromDate = LocalDate.parse(filters.get("fromDate").toString());
            predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), fromDate));
        }

        // Apply toDate filter if it's not empty
        if (filters.get("toDate") != null && !filters.get("toDate").toString().isEmpty()) {
            LocalDate toDate = LocalDate.parse(filters.get("toDate").toString());
            predicates.add(cb.lessThanOrEqualTo(root.get("orderDate"), toDate));
        }

        // Apply productName filter if it's not empty
        if (filters.get("productName") != null && !filters.get("productName").toString().isEmpty()) {
            String productName = filters.get("productName").toString().toLowerCase();
            predicates.add(cb.like(cb.lower(root.get("productName")), "%" + productName + "%"));
        }

        // Apply status filter if it's not empty
        if (filters.get("status") != null && !filters.get("status").toString().isEmpty()) {
            String status = filters.get("status").toString().toUpperCase();
            predicates.add(cb.equal(root.get("status"), status));
        }

        // Apply all predicates combined with AND
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        List<Order> resultList = entityManager.createQuery(query).getResultList();

        return resultList.stream()
                .map(this::mapToDTO)
                .toList();
    }



    private OrderDTO mapToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setDiscount(order.getDiscount());
        dto.setTax(order.getTax());

        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setQuantity(item.getQuantity());
            itemDTOs.add(itemDTO);
        }
        dto.setOrderItems(itemDTOs);

        return dto;
    }
}
