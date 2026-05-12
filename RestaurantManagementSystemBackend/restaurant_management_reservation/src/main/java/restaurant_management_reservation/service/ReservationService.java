package restaurant_management_reservation.service;

import restaurant_management_reservation.dto.ReservationDTO;
import restaurant_management_reservation.entity.Reservation;

import java.util.List;

public interface ReservationService {
    ReservationDTO createReservation(Reservation reservation);

    List<ReservationDTO> getAllReservations();

    Reservation getReservationById(Long id);

    Reservation updateReservation(Long id, Reservation updatedReservation);

    void deleteReservation(Long id);
}
