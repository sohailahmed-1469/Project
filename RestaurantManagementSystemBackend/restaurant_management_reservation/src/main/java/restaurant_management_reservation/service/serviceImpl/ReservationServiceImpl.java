package restaurant_management_reservation.service.serviceImpl;

import io.micrometer.common.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import restaurant_management_reservation.dto.ReservationDTO;
import restaurant_management_reservation.entity.Reservation;
import restaurant_management_reservation.repository.ReservationRepository;
import restaurant_management_reservation.service.ReservationService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {
    private static Logger LOGGER =  LoggerFactory.getLogger(ReservationServiceImpl.class);

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public ReservationDTO createReservation(Reservation reservation) {
        LOGGER.info("Inside Conversion of reservation and reservationDTO");
        ReservationDTO reservationDTO = new ReservationDTO();
        reservationDTO.setCustomerName(reservation.getCustomerName());
        reservationDTO.setReservationDate(reservation.getReservationDate());
        reservationDTO.setReservationTime(reservation.getReservationTime());
        reservationDTO.setEmail(reservation.getEmail());
        reservationDTO.setStatus(reservation.getStatus());
        reservationDTO.setContactNumber(reservation.getContactNumber());
        reservationDTO.setSpecialRequests(StringUtils.isNotBlank(reservation.getSpecialRequests())?reservation.getSpecialRequests():"");
        reservationDTO.setNumberOfGuests(reservation.getNumberOfGuests());

        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        reservationRepository.save(reservation);
        return reservationDTO;
    }
    @Override
    public List<ReservationDTO> getAllReservations() {
        LOGGER.info("Inside Conversion of Reservations to ReservationDTO :");
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(this::convertToDTO)
                .toList();
    }

    private ReservationDTO convertToDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setCustomerName(reservation.getCustomerName());
        dto.setEmail(reservation.getEmail());
        dto.setContactNumber(reservation.getContactNumber());
        dto.setNumberOfGuests(reservation.getNumberOfGuests());
        dto.setReservationDate(reservation.getReservationDate());
        dto.setReservationTime(reservation.getReservationTime());
        dto.setSpecialRequests(StringUtils.isNotBlank(reservation.getSpecialRequests())?reservation.getSpecialRequests():"");
        dto.setStatus(reservation.getStatus());
        return dto;
    }

    @Override
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }
    @Override
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation existing = getReservationById(id);
        existing.setCustomerName(updatedReservation.getCustomerName());
        existing.setContactNumber(updatedReservation.getContactNumber());
        existing.setEmail(updatedReservation.getEmail());
        existing.setReservationDate(updatedReservation.getReservationDate());
        existing.setReservationTime(updatedReservation.getReservationTime());
        existing.setNumberOfGuests(updatedReservation.getNumberOfGuests());
        existing.setStatus(updatedReservation.getStatus());
        existing.setSpecialRequests(updatedReservation.getSpecialRequests());
        return reservationRepository.save(existing);
    }
    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}

