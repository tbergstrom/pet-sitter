package learn.petsitter.data;

import learn.petsitter.data.mappers.CareVisitMapper;
import learn.petsitter.data.mappers.PetMapper;
import learn.petsitter.models.CareVisit;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class CareVisitJdbcTemplateRepository implements CareVisitRepository{

    private final JdbcTemplate jdbcTemplate;

    public CareVisitJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<CareVisit> findByOwnerId(int ownerId) {
        final String sql = "select care_visit_id, start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id "
                + "from care_visit "
                + "where owner_id = ?;";

        return jdbcTemplate.query(sql, new CareVisitMapper(), ownerId);
    }

    @Override
    public List<CareVisit> findBySitterId(int sitterId) {
        final String sql = "select care_visit_id, start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id "
                + "from care_visit "
                + "where sitter_id = ?;";

        return jdbcTemplate.query(sql, new CareVisitMapper(), sitterId);
    }

    @Override
    public CareVisit findById(int id) {
        final String sql = "select care_visit_id, start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id "
                + "from care_visit "
                + "where care_visit_id = ?;";
        return jdbcTemplate.query(sql, new CareVisitMapper(), id).stream()
                .findFirst().orElse(null);
    }

    @Override
    public CareVisit create(CareVisit careVisit) {
        final String sql = "insert into care_visit (start_date, end_date, `status`, time_of_day, notes, cost, owner_id, sitter_id "
                + " values (?,?,?,?,??,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setDate(1, (Date) careVisit.getStartDate());
            ps.setDate(2, (Date) careVisit.getEndDate());
            ps.setString(3, careVisit.getStatus());
            ps.setTime(4, careVisit.getTimeOfDay());
            ps.setString(5, careVisit.getNotes());
            ps.setInt(6, careVisit.getOwnerId());
            ps.setInt(7, careVisit.getSitterId());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        careVisit.setCareVisitId(keyHolder.getKey().intValue());
        return careVisit;
    }

    @Override
    public boolean update(CareVisit careVisit) {
        final String sql = "update care_visit set " +
                "start_date = ?, " +
                "end_date = ?, " +
                "`status` = ?, " +
                "time_of_day = ?, " +
                "notes = ?, " +
                "cost = ?, " +
                "owner_id = ?, " +
                "sitter_id = ? " +
                "where care_visit_id = ?;";

        int rowsUpdated = jdbcTemplate.update(sql,
                careVisit.getStartDate(),
                careVisit.getEndDate(),
                careVisit.getStatus(),
                careVisit.getTimeOfDay(),
                careVisit.getNotes(),
                careVisit.getCost(),
                careVisit.getOwnerId(),
                careVisit.getSitterId(),
                careVisit.getCareVisitId());

        return rowsUpdated > 0;
    }

    @Override
    public boolean delete(CareVisit careVisit) {
        final String sql = "update care_visit set " +
                "`status` = ? "  +
                "where care_visit_id = ?;";
        int rowsUpdated = jdbcTemplate.update(sql,
                careVisit.getStatus());

        return rowsUpdated > 0;
    }
}
