package restaurant_management_order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import restaurant_management_order.enums.OrderStatus;
import restaurant_management_order.enums.PaymentStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "`order`")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    private String orderDate;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    private String deliveryAddress;
    private String deliveryDate;
    private BigDecimal discount;
    private BigDecimal tax;
}
