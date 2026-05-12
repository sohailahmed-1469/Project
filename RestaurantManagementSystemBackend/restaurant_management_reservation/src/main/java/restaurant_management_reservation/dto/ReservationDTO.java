package restaurant_management_reservation.dto;

import lombok.Getter;
import lombok.Setter;
import restaurant_management_reservation.enums.ReservationStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class ReservationDTO {

    private String customerName;
    private String contactNumber;
    private String email;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private int numberOfGuests;
    private ReservationStatus status;
    private String specialRequests;
}
