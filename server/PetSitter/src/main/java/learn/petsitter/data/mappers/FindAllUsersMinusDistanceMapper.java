package learn.petsitter.data.mappers;

import learn.petsitter.models.AppUser;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class FindAllUsersMinusDistanceMapper implements RowMapper<AppUser> {

    @Override
    public AppUser mapRow(ResultSet rs, int i) throws SQLException {
        List<String> roles = Arrays.asList(rs.getString("role").split(","));
        return new AppUser(
                rs.getInt("app_user_id"),
                rs.getString("username"),
                rs.getString("password_hash"),
                rs.getBoolean("enabled"),
                rs.getBigDecimal("rate"),
                rs.getString("pfp_url"),
                roles);
    }
}
