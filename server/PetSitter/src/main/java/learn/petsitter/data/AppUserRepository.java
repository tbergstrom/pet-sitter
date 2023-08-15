package learn.petsitter.data;

import learn.petsitter.models.AppUser;
import org.springframework.transaction.annotation.Transactional;

public interface AppUserRepository {

    @Transactional
    public AppUser findByUsername(String username);

    @Transactional
    public AppUser create(AppUser user);

    @Transactional
    void update(AppUser user);


}
