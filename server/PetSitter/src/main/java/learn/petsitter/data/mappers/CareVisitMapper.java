package learn.petsitter.data.mappers;

import learn.petsitter.models.CareVisit;
import learn.petsitter.models.Pet;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CareVisitMapper implements RowMapper<CareVisit> {

    @Override
    public CareVisit mapRow(ResultSet resultSet, int i) throws SQLException {
        CareVisit cv = new CareVisit();

        cv.setCareVisitId(resultSet.getInt("care_visit_id"));
        cv.setStartDate(resultSet.getDate("start_date"));
        cv.setStartDate(resultSet.getDate("end_date"));
        cv.setNotes(resultSet.getString("status"));
        cv.setStartDate(resultSet.getTime("time_of_day"));
        cv.setNotes(resultSet.getString("notes"));
        cv.setCost(resultSet.getBigDecimal("cost"));
        cv.setOwnerId(resultSet.getInt("owner_id"));
        cv.setSitterId(resultSet.getInt("sitter_id"));

        return cv;
    }
}
