package learn.petsitter.data;

import learn.petsitter.models.CareVisit;
import learn.petsitter.models.Pet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CareVisitJdbcTemplateRepositoryTest {
    @Autowired
    private CareVisitJdbcTemplateRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    static boolean hasSetup = false;

    @BeforeEach
    void setup() {
        if (!hasSetup) {
            hasSetup = true;
            jdbcTemplate.update("call set_known_good_state();");
        }
    }
    @Test
    void findByOwnerId() {
        List <CareVisit> result = repository.findByOwnerId(1);
        assertNotNull(result);
        assertTrue(result.size() >= 2);

        assertTrue(result.get(0).getSitterId() == 4);


    }

    @Test
    void findBySitterId() {
        List <CareVisit> result = repository.findBySitterId(4);
        assertNotNull(result);
        assertTrue(result.size() >= 3);

        assertTrue(result.get(0).getOwnerId() == 1);

    }

    @Test
    void findById() {
        CareVisit result = repository.findById(1);
        assertNotNull(result);
        assertEquals("Pending", result.getStatus());

    }
    //TODO How to test? Can't seem to pass correct date types
    @Test
    void create() {
//        CareVisit careVisit = new CareVisit();
//        Date startDate = new Date("");
//        Date endDate = new Date("");
//
//        Time time = new Time(8L);
//        careVisit.setStartDate(startDate);
//        careVisit.setEndDate(endDate);
//        careVisit.setStatus("Pending");
////        careVisit.setTimeOfDay(time);
//        careVisit.setNotes("A note");
//        careVisit.setCost(new BigDecimal(30.00));
//        careVisit.setOwnerId(1);
//        careVisit.setSitterId(4);

    }

    @Test
    void update() {

    }

}