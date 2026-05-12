package restaurant_management_reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import restaurant_management_reservation.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {

}
