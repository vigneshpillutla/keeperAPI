package com.keeper.api.repository;

import com.keeper.api.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {
    boolean existsByUsername(String username);
    User findByUsername(String username);
}
