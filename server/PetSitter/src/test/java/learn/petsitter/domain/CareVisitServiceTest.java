package learn.petsitter.domain;

import learn.petsitter.data.CareVisitRepository;
import learn.petsitter.data.ContactInfoRepository;
import learn.petsitter.models.CareVisit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

@SpringBootTest()
class CareVisitServiceTest {
    @Autowired
    CareVisitService service;

    @MockBean
    CareVisitRepository repository;

    //TODO how to actually create a testable object?
    @Test
    void findByOwnerId() {
        when(repository.findByOwnerId(1)).thenReturn(List.of(
                new CareVisit()
        ));

        List<CareVisit> visits = service.findByOwnerId(1);
        assertTrue(visits.size() == 1);
    }

    @Test
    void findBySitterId() {
        when(repository.findBySitterId(4)).thenReturn(List.of(
                new CareVisit()
        ));

        List<CareVisit> visits = service.findBySitterId(4);
        assertTrue(visits.size() == 1);
    }

    @Test
    void findById() {
        when(repository.findById(1)).thenReturn(new CareVisit());
        CareVisit visit = service.findById(1);
        assertNotNull(visit);
    }

    @Test
    void create() {
    }

    @Test
    void update() {
    }



}