package learn.petsitter.data;

import learn.petsitter.data.mappers.AppUserMapper;
import learn.petsitter.data.mappers.FindAllUsersMapper;
import learn.petsitter.models.AppUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Collection;
import java.util.List;

@Repository
public class AppUserJdbcTemplateRepository implements AppUserRepository{

    private final JdbcTemplate jdbcTemplate;

    public AppUserJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public AppUser findByUsername(String username) {
        List<String> roles = getRolesByUsername(username);

        final String sql = "select app_user_id, username, password_hash, enabled "
                + "from app_user "
                + "where username = ?;";

        return jdbcTemplate.query(sql, new AppUserMapper(roles), username)
                .stream()
                .findFirst().orElse(null);
    }

    @Override
    @Transactional
    public AppUser create(AppUser user) {

        final String sql = "insert into app_user (username, password_hash) values (?, ?);";

        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        user.setAppUserId(keyHolder.getKey().intValue());

        updateRoles(user);

        return user;
    }

//    createGoogleUser uses the Google OAuth and does not store passwords. It also uses the email for the username.
    @Override
    @Transactional
    public AppUser createGoogleUser(AppUser user) {

        final String sql = "insert into app_user (username) values (?);";

        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            return ps;
        }, keyHolder);

        if(rowsAffected <= 0) {
            return null;
        }

        user.setAppUserId(keyHolder.getKey().intValue());
        updateRoles(user);
        return user;
    }


    @Override
    @Transactional
    public void update(AppUser user) {

        final String sql = "update app_user set "
                + "username = ?, "
                + "enabled = ? "
                + "where app_user_id = ?";

        jdbcTemplate.update(sql,
                user.getUsername(), user.isEnabled(), user.getAppUserId());

        updateRoles(user);
    }

    @Override
    @Transactional
    public List<AppUser> getAllOwners() {
         final String sql = "SELECT au.app_user_id, au.username, au.password_hash, au.enabled, ar.name AS role " +
                 "FROM app_user au " +
                 "JOIN app_user_role aur ON au.app_user_id = aur.app_user_id " +
                 "JOIN app_role ar ON aur.app_role_id = ar.app_role_id " +
                 "WHERE aur.app_role_id = 1;";
         return jdbcTemplate.query(sql, new FindAllUsersMapper());
    }

    @Override
    @Transactional
    public List<AppUser> getAllSitters() {
        final String sql = "SELECT au.app_user_id, au.username, au.password_hash, au.enabled, ar.name AS role " +
                "FROM app_user au " +
                "JOIN app_user_role aur ON au.app_user_id = aur.app_user_id " +
                "JOIN app_role ar ON aur.app_role_id = ar.app_role_id " +
                "WHERE aur.app_role_id = 2;";
        return jdbcTemplate.query(sql, new FindAllUsersMapper());
    }

    private void updateRoles(AppUser user) {
        // delete all roles, then re-add
        jdbcTemplate.update("delete from app_user_role where app_user_id = ?;", user.getAppUserId());

        Collection<GrantedAuthority> authorities = user.getAuthorities();

        if (authorities == null) {
            return;
        }

        for (GrantedAuthority role : authorities) {
            String sql = "insert into app_user_role (app_user_id, app_role_id) "
                    + "select ?, app_role_id from app_role where `name` = ?;";
            jdbcTemplate.update(sql, user.getAppUserId(), role.getAuthority());
        }
    }

    private List<String> getRolesByUsername(String username) {
        final String sql = "select r.name "
                + "from app_user_role ur "
                + "inner join app_role r on ur.app_role_id = r.app_role_id "
                + "inner join app_user au on ur.app_user_id = au.app_user_id "
                + "where au.username = ?";
        return jdbcTemplate.query(sql, (rs, rowId) -> rs.getString("name"), username);
    }
}


