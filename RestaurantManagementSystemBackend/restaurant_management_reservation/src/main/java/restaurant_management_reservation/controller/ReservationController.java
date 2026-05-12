package restaurant_management_reservation.controller;

import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_management_reservation.dto.ReservationDTO;
import restaurant_management_reservation.entity.Reservation;
import restaurant_management_reservation.service.ReservationService;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private static org.slf4j.Logger LOGGER =  LoggerFactory.getLogger(ReservationController.class);
    @Autowired
    private ReservationService reservationService;


    @PostMapping("/createReservation")
    public ReservationDTO createReservation(@Valid @RequestBody Reservation reservation) {
        LOGGER.info("Start of Create Reservation Implementation : ");
        return reservationService.createReservation(reservation);
    }


    @GetMapping("/getAllReservations")
    public List<ReservationDTO> getAllReservations() {
        LOGGER.info("Inside Retrieve All Reservations Implementation :");
        return reservationService.getAllReservations();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @Valid @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.updateReservation(id, reservation));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }
}

